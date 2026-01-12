"""
Serializers for training app.
"""
from rest_framework import serializers
from .models import TrainingPackage


class TrainingPackageSerializer(serializers.ModelSerializer):
    """Serializer for training packages."""
    image_url = serializers.SerializerMethodField()
    package_type_display = serializers.CharField(source='get_package_type_display', read_only=True)
    
    class Meta:
        model = TrainingPackage
        fields = [
            'id', 'package_type', 'package_type_display', 'title', 'slug', 'description',
            'price', 'is_for_beginners', 'is_advanced', 'is_upgrade', 'is_housewife',
            'features', 'includes_theory', 'theory_topics', 'includes_pastries',
            'includes_baking', 'includes_local_dishes', 'includes_intercontinental',
            'includes_advanced_cooking', 'includes_upscale_dining', 'includes_event_catering',
            'includes_management', 'includes_general_kitchen_mgmt', 'includes_popular_african_menu',
            'includes_certification', 'is_active', 'display_order', 'image', 'image_url',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'image_url']
    
    def get_image_url(self, obj):
        """Get absolute URL for package image."""
        request = self.context.get('request')
        if obj.image and request:
            url = obj.image.url
            if url.startswith('http://') or url.startswith('https://'):
                return url
            return request.build_absolute_uri(url)
        return None

