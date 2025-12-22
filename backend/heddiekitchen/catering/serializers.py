from rest_framework import serializers
from .models import (
    CateringCategory,
    CateringPackage,
    CateringEnquiry,
    CateringPackageImage,
    BuffetService,
    BuffetImage,
)


class CateringCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CateringCategory
        fields = ['id', 'name', 'description', 'created_at']


class CateringPackageImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = CateringPackageImage
        fields = ['id', 'image', 'image_url', 'caption', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']
    
    def get_image_url(self, obj):
        """Get absolute URL for the image (handles Cloudinary URLs)."""
        if obj.image:
            url = obj.image.url
            # If URL is already absolute (Cloudinary), return as-is
            if url.startswith('http://') or url.startswith('https://'):
                return url
            # Otherwise, make it absolute using request
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(url)
            return url
        return None


class CateringPackageSerializer(serializers.ModelSerializer):
    category_name = serializers.StringRelatedField(source='category', read_only=True)
    gallery = CateringPackageImageSerializer(many=True, read_only=True)

    class Meta:
        model = CateringPackage
        fields = [
            'id', 'category', 'category_name', 'title', 'tier', 'description',
            'min_guests', 'max_guests', 'price_min', 'price_max', 'price_per_head',
            'menu_options', 'gallery', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class CateringEnquirySerializer(serializers.ModelSerializer):
    package_title = serializers.StringRelatedField(source='package.title', read_only=True)

    class Meta:
        model = CateringEnquiry
        fields = [
            'id', 'user', 'package', 'package_title', 'name', 'email', 'phone',
            'event_date', 'number_of_guests', 'message',
            'tasting_session_requested', 'tasting_date',
            'status', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'status', 'user']

    def create(self, validated_data):
        """Create enquiry and set user from request when available."""
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            validated_data['user'] = request.user
        return super().create(validated_data)


class BuffetImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = BuffetImage
        fields = ['id', 'image', 'caption', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']


class BuffetServiceSerializer(serializers.ModelSerializer):
    images = BuffetImageSerializer(many=True, read_only=True)

    class Meta:
        model = BuffetService
        fields = [
            'id', 'buffet_type', 'title', 'description', 'price_per_head',
            'add_ons', 'setup_notes', 'images', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']