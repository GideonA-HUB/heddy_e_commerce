"""
Serializers for menu app.
"""
from rest_framework import serializers
from heddiekitchen.menu.models import MenuCategory, MenuItem, MenuItemImage, MenuItemReview


class MenuCategorySerializer(serializers.ModelSerializer):
    """Serializer for menu categories."""
    class Meta:
        model = MenuCategory
        fields = ['id', 'name', 'slug', 'description', 'icon', 'display_order', 'is_active']


class MenuItemImageSerializer(serializers.ModelSerializer):
    """Serializer for menu item images."""
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = MenuItemImage
        fields = ['id', 'image', 'image_url', 'alt_text', 'display_order']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None


class MenuItemReviewSerializer(serializers.ModelSerializer):
    """Serializer for menu item reviews."""
    username = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = MenuItemReview
        fields = ['id', 'rating', 'title', 'comment', 'username', 'is_verified_purchase', 'created_at']
        read_only_fields = ['id', 'created_at', 'username']


class MenuItemDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for menu items."""
    category_name = serializers.CharField(source='category.name', read_only=True)
    categories = MenuCategorySerializer(many=True, read_only=True)
    images = MenuItemImageSerializer(many=True, read_only=True)
    reviews = MenuItemReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = MenuItem
        fields = [
            'id', 'name', 'slug', 'description', 'price', 'category', 'category_name',
            'categories', 'image', 'image_url', 'prep_time_minutes', 'servings',
            'is_available', 'is_featured', 'stock_quantity', 'calories',
            'ingredients', 'allergens', 'nutritional_info', 'images', 'reviews',
            'average_rating', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if reviews:
            return round(sum(r.rating for r in reviews) / len(reviews), 1)
        return None


class MenuItemListSerializer(serializers.ModelSerializer):
    """List serializer for menu items (lightweight)."""
    category_name = serializers.CharField(source='category.name', read_only=True)
    image_url = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = MenuItem
        fields = [
            'id', 'name', 'slug', 'description', 'price', 'category', 'category_name',
            'image', 'image_url', 'prep_time_minutes', 'is_available', 'is_featured',
            'average_rating', 'created_at'
        ]

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if reviews:
            return round(sum(r.rating for r in reviews) / len(reviews), 1)
        return None
