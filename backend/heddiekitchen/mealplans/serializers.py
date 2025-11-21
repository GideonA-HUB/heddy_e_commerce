from rest_framework import serializers
from .models import MealPlan, MealPlanSubscription


class MealPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealPlan
        fields = ['id', 'name', 'plan_type', 'description', 'meal_count_per_week',
                  'weekly_price', 'monthly_price', 'highlights', 'image']


class MealPlanSubscriptionSerializer(serializers.ModelSerializer):
    plan_name = serializers.StringRelatedField(source='plan.name', read_only=True)
    plan = MealPlanSerializer(read_only=True)
    plan_id = serializers.PrimaryKeyRelatedField(
        queryset=MealPlan.objects.all(),
        write_only=True,
        source='plan'
    )
    
    class Meta:
        model = MealPlanSubscription
        fields = ['id', 'user', 'plan', 'plan_id', 'plan_name', 'billing_cycle', 
                  'next_billing_date', 'is_active', 'auto_renew', 'created_at']
        read_only_fields = ['created_at', 'user', 'next_billing_date']
    
    def create(self, validated_data):
        """Create subscription with user from request."""
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)