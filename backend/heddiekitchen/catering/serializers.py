from rest_framework import serializers
from .models import CateringCategory, CateringPackage, CateringEnquiry


class CateringCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CateringCategory
        fields = ['id', 'name', 'slug', 'description', 'icon']


class CateringPackageSerializer(serializers.ModelSerializer):
    category_name = serializers.StringRelatedField(source='category.name', read_only=True)
    
    class Meta:
        model = CateringPackage
        fields = ['id', 'category', 'category_name', 'name', 'tier', 'description', 
                  'min_guests', 'max_guests', 'price_per_head', 'inclusions', 'image']


class CateringEnquirySerializer(serializers.ModelSerializer):
    package_name = serializers.StringRelatedField(source='package.name', read_only=True)
    
    class Meta:
        model = CateringEnquiry
        fields = ['id', 'user', 'package', 'package_name', 'guest_count', 'event_date',
                  'event_location', 'dietary_requirements', 'special_requests', 
                  'contact_phone', 'estimated_budget', 'status', 'created_at']
        read_only_fields = ['created_at', 'status']
    
    def create(self, validated_data):
        """Create enquiry and set user from request."""
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)