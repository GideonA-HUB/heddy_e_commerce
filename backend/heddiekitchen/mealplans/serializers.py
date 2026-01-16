from rest_framework import serializers
from .models import MealPlan, MealPlanSubscription


class MealPlanSerializer(serializers.ModelSerializer):
    plan_type_display = serializers.CharField(source='get_plan_type_display', read_only=True)
    period_display = serializers.CharField(source='get_period_display', read_only=True)
    sample_pdf_url = serializers.SerializerMethodField()
    
    features = serializers.SerializerMethodField()
    
    def get_features(self, obj):
        """Normalize features from JSON field to array format."""
        if not obj.features:
            return []
        
        if isinstance(obj.features, list):
            return obj.features
        
        if isinstance(obj.features, dict):
            # Handle object format: {"meals": [...], "benefits": [...], "customization": [...]}
            features = []
            for key, value in obj.features.items():
                if isinstance(value, list):
                    features.extend(value)
                elif isinstance(value, str):
                    features.append(value)
            return features
        
        return []
    
    def get_sample_pdf_url(self, obj):
        """Return the URL for the sample PDF if it exists."""
        if obj.sample_pdf:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.sample_pdf.url)
            return obj.sample_pdf.url
        return None
    
    class Meta:
        model = MealPlan
        fields = [
            'id', 'title', 'slug', 'plan_type', 'plan_type_display', 
            'period', 'period_display', 'price', 'description', 
            'features', 'sample_pdf_url', 'is_customizable', 
            'display_order', 'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at']


class MealPlanSubscriptionSerializer(serializers.ModelSerializer):
    plan_name = serializers.StringRelatedField(source='meal_plan.title', read_only=True)
    plan = MealPlanSerializer(source='meal_plan', read_only=True)
    plan_id = serializers.PrimaryKeyRelatedField(
        queryset=MealPlan.objects.all(),
        write_only=True,
        source='meal_plan'
    )
    
    class Meta:
        model = MealPlanSubscription
        fields = ['id', 'user', 'plan', 'plan_id', 'plan_name', 'status', 
                  'start_date', 'end_date', 'next_billing_date', 'created_at']
        read_only_fields = ['created_at', 'user']
    
    def create(self, validated_data):
        """Create subscription with user from request."""
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)