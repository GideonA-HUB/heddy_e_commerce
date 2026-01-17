from rest_framework import serializers
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
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


class PublicMealPlanSubscriptionSerializer(serializers.Serializer):
    """Serializer for public meal plan subscriptions (no authentication required)."""
    meal_plan_id = serializers.IntegerField()
    full_name = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    address = serializers.CharField()
    city = serializers.CharField(max_length=100, required=False, allow_blank=True)
    state = serializers.CharField(max_length=100, required=False, allow_blank=True)
    country = serializers.CharField(max_length=100, default='Nigeria')
    postal_code = serializers.CharField(max_length=20, required=False, allow_blank=True)
    start_date = serializers.DateField(required=False)
    special_instructions = serializers.CharField(required=False, allow_blank=True)
    dietary_preferences = serializers.CharField(required=False, allow_blank=True)

    def create(self, validated_data):
        """Create or get user, then create subscription."""
        from heddiekitchen.core.models import UserProfile
        
        email = validated_data['email']
        full_name = validated_data['full_name']
        
        # Get or create user
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': email,  # Use email as username
                'first_name': full_name.split()[0] if full_name else '',
                'last_name': ' '.join(full_name.split()[1:]) if len(full_name.split()) > 1 else '',
                'is_active': True,
            }
        )
        
        # Get or create user profile
        profile, profile_created = UserProfile.objects.get_or_create(user=user)
        
        # Update profile with subscription info
        if profile_created or not profile.phone:
            profile.phone = validated_data.get('phone', '')
        if profile_created or not profile.address:
            profile.address = validated_data.get('address', '')
        if profile_created or not profile.city:
            profile.city = validated_data.get('city', '')
        if profile_created or not profile.state:
            profile.state = validated_data.get('state', '')
        if profile_created or not profile.country:
            profile.country = validated_data.get('country', 'Nigeria')
        if profile_created or not profile.zip_code:
            profile.zip_code = validated_data.get('postal_code', '')
        profile.save()
        
        # Get meal plan
        meal_plan_id = validated_data['meal_plan_id']
        try:
            meal_plan = MealPlan.objects.get(id=meal_plan_id, is_active=True)
        except MealPlan.DoesNotExist:
            raise serializers.ValidationError({'meal_plan_id': 'Meal plan not found or inactive'})
        
        # Calculate dates
        if validated_data.get('start_date'):
            start_date = validated_data['start_date']
        else:
            start_date = timezone.now().date() + timedelta(days=1)  # Start tomorrow
        
        # Calculate next billing date based on period
        if meal_plan.period == 'weekly':
            next_billing_date = start_date + timedelta(weeks=1)
        else:  # monthly
            next_billing_date = start_date + timedelta(days=30)
        
        # Create subscription
        subscription = MealPlanSubscription.objects.create(
            user=user,
            meal_plan=meal_plan,
            status='active',
            start_date=start_date,
            next_billing_date=next_billing_date,
        )
        
        # TODO: Store additional info like dietary_preferences and special_instructions
        # This could be stored in a separate model or as JSON in the subscription model
        
        return subscription
    
    def to_representation(self, instance):
        """Return subscription data after creation."""
        return {
            'id': instance.id,
            'message': 'Subscription created successfully',
            'subscription_id': instance.id,
            'user_email': instance.user.email,
            'plan_title': instance.meal_plan.title,
            'start_date': instance.start_date,
            'next_billing_date': instance.next_billing_date,
        }