"""
Serializers for core app.
"""
from rest_framework import serializers
from django.contrib.auth.models import User
from heddiekitchen.core.models import SiteAsset, UserProfile, Newsletter, Contact


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
