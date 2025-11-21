from rest_framework import serializers
from .models import GalleryCategory, GalleryImage


class GalleryCategorySerializer(serializers.ModelSerializer):
    image_count = serializers.SerializerMethodField()
    
    class Meta:
        model = GalleryCategory
        fields = ['id', 'name', 'slug', 'description', 'image_count']
    
    def get_image_count(self, obj):
        return obj.images.count()


class GalleryImageSerializer(serializers.ModelSerializer):
    category_name = serializers.StringRelatedField(source='category.name', read_only=True)
    
    class Meta:
        model = GalleryImage
        fields = ['id', 'category', 'category_name', 'image', 'title', 'description', 
                  'alt_text', 'upload_date', 'display_order']
        read_only_fields = ['upload_date']