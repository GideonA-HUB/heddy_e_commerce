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

    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'phone', 'address', 'city', 'state', 'country', 
                  'zip_code', 'role', 'avatar', 'newsletter_subscribed', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']


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
        request = self.context.get('request')
        if obj.favicon and request:
            return request.build_absolute_uri(obj.favicon.url)
        return None

    def get_logo_primary_url(self, obj):
        request = self.context.get('request')
        if obj.logo_primary and request:
            return request.build_absolute_uri(obj.logo_primary.url)
        return None

    def get_logo_light_url(self, obj):
        request = self.context.get('request')
        if obj.logo_light and request:
            return request.build_absolute_uri(obj.logo_light.url)
        return None

    def get_logo_dark_url(self, obj):
        request = self.context.get('request')
        if obj.logo_dark and request:
            return request.build_absolute_uri(obj.logo_dark.url)
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
