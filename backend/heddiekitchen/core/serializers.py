"""
Serializers for core app.
"""
from rest_framework import serializers
from django.contrib.auth.models import User
from heddiekitchen.core.models import SiteAsset, UserProfile, Newsletter, Contact, HomepageHero


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile model."""
    user = UserSerializer(read_only=True)
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'phone', 'address', 'city', 'state', 'country', 
                  'zip_code', 'role', 'avatar', 'avatar_url', 'newsletter_subscribed', 'created_at']
        read_only_fields = ['id', 'user', 'created_at', 'avatar_url']

    def get_avatar_url(self, obj):
        """Get absolute URL for avatar image."""
        if obj.avatar:
            url = obj.avatar.url
            # If URL is already absolute (Cloudinary), return as-is
            if url.startswith('http://') or url.startswith('https://'):
                return url
            # Otherwise, make it absolute using request
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(url)
            return url
        return None


class SiteAssetSerializer(serializers.ModelSerializer):
    """Serializer for SiteAsset model."""
    favicon_url = serializers.SerializerMethodField()
    logo_primary_url = serializers.SerializerMethodField()
    logo_light_url = serializers.SerializerMethodField()
    logo_dark_url = serializers.SerializerMethodField()

    class Meta:
        model = SiteAsset
        fields = ['id', 'name', 'favicon', 'favicon_url', 'logo_primary', 'logo_primary_url',
                  'logo_light', 'logo_light_url', 'logo_dark', 'logo_dark_url']
        read_only_fields = ['id']

    def get_favicon_url(self, obj):
        if obj.favicon:
            url = obj.favicon.url
            # If URL is already absolute (Cloudinary), return as-is
            # Otherwise, make it absolute using request
            if url.startswith('http://') or url.startswith('https://'):
                return url
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(url)
            return url
        return None

    def get_logo_primary_url(self, obj):
        if obj.logo_primary:
            url = obj.logo_primary.url
            if url.startswith('http://') or url.startswith('https://'):
                return url
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(url)
            return url
        return None

    def get_logo_light_url(self, obj):
        if obj.logo_light:
            url = obj.logo_light.url
            if url.startswith('http://') or url.startswith('https://'):
                return url
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(url)
            return url
        return None

    def get_logo_dark_url(self, obj):
        if obj.logo_dark:
            url = obj.logo_dark.url
            if url.startswith('http://') or url.startswith('https://'):
                return url
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(url)
            return url
        return None


class NewsletterSerializer(serializers.ModelSerializer):
    """Serializer for Newsletter subscriptions."""
    class Meta:
        model = Newsletter
        fields = ['id', 'email', 'subscribed_at', 'is_active']
        read_only_fields = ['id', 'subscribed_at']


class ContactSerializer(serializers.ModelSerializer):
    """Serializer for Contact form submissions."""
    class Meta:
        model = Contact
        fields = ['id', 'name', 'email', 'phone', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']


def _absolute_image_url(obj_field, request):
    if not obj_field:
        return None
    url = obj_field.url
    if url.startswith('http://') or url.startswith('https://'):
        return url
    if request:
        return request.build_absolute_uri(url)
    return url


class HomepageHeroSerializer(serializers.ModelSerializer):
    """Public homepage hero payload for the gallery CTA section."""
    gallery_images = serializers.SerializerMethodField()

    class Meta:
        model = HomepageHero
        fields = [
            'id',
            'eyebrow',
            'headline',
            'description',
            'cta_primary_text',
            'cta_primary_link',
            'cta_secondary_text',
            'cta_secondary_link',
            'gallery_images',
            'updated_at',
        ]

    def get_gallery_images(self, obj):
        request = self.context.get('request')
        images = []
        for i in range(1, 5):
            field = getattr(obj, f'gallery_image_{i}', None)
            alt = getattr(obj, f'gallery_alt_{i}', '') or f'Hero image {i}'
            url = _absolute_image_url(field, request)
            if url:
                images.append({'url': url, 'alt': alt, 'index': i - 1})
        return images
