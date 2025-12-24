from rest_framework import serializers
from .models import GalleryCategory, GalleryImage


class GalleryCategorySerializer(serializers.ModelSerializer):
    image_count = serializers.SerializerMethodField()
    
    class Meta:
        model = GalleryCategory
        fields = ['id', 'name', 'slug', 'image_count']
    
    def get_image_count(self, obj):
        return obj.images.count()


class GalleryImageSerializer(serializers.ModelSerializer):
    category_name = serializers.StringRelatedField(source='category.name', read_only=True)
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = GalleryImage
        fields = ['id', 'category', 'category_name', 'image', 'image_url', 'title', 'description', 
                  'display_order', 'created_at']
        read_only_fields = ['created_at']
    
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            url = obj.image.url
            # If URL is already absolute (Cloudinary), return as-is
            if url.startswith('http://') or url.startswith('https://'):
                return url
            return request.build_absolute_uri(url)
        return None