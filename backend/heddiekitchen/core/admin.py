"""
Admin configuration for core app.
"""
from django.contrib import admin
from django.contrib.auth.models import User
from heddiekitchen.core.models import SiteAsset, UserProfile, Newsletter, Contact


@admin.register(SiteAsset)
class SiteAssetAdmin(admin.ModelAdmin):
    """
    Admin interface for SiteAsset.
    Only superusers can edit site assets.
    """
    list_display = ['name', 'created_at', 'updated_at']
    readonly_fields = ['created_at', 'updated_at']
    fields = ['name', 'favicon', 'logo_primary', 'logo_light', 'logo_dark', 'created_at', 'updated_at']

    def has_add_permission(self, request):
        """Only allow one SiteAsset instance."""
        return not SiteAsset.objects.exists() or request.user.is_superuser

    def has_delete_permission(self, request, obj=None):
        """Only superusers can delete."""
        return request.user.is_superuser

    def has_change_permission(self, request, obj=None):
        """Only superusers can change."""
        return request.user.is_superuser


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """Admin interface for UserProfile."""
    list_display = ['user', 'phone', 'city', 'country', 'role', 'newsletter_subscribed', 'avatar_preview']
    list_filter = ['role', 'country', 'newsletter_subscribed']
    search_fields = ['user__username', 'user__email', 'phone']
    readonly_fields = ['created_at', 'updated_at', 'avatar_preview']
    fieldsets = (
        ('User Info', {'fields': ('user',)}),
        ('Contact Info', {'fields': ('phone', 'address', 'city', 'state', 'country', 'zip_code')}),
        ('Profile', {'fields': ('role', 'avatar', 'avatar_preview', 'newsletter_subscribed')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )
    
    def avatar_preview(self, obj):
        """Display avatar preview and download link in admin."""
        if obj.avatar:
            from django.utils.html import format_html
            from django.urls import reverse
            return format_html(
                '<div style="margin: 10px 0;">'
                '<img src="{}" style="max-width: 150px; max-height: 150px; border-radius: 50%; border: 2px solid #ddd; padding: 5px;" /><br/>'
                '<a href="{}" download style="margin-top: 10px; display: inline-block; padding: 8px 16px; background: #007cba; color: white; text-decoration: none; border-radius: 4px; font-size: 12px;">Download Avatar</a>'
                '</div>',
                obj.avatar.url,
                obj.avatar.url
            )
        return "No avatar uploaded"
    avatar_preview.short_description = "Avatar Preview"


@admin.register(Newsletter)
class NewsletterAdmin(admin.ModelAdmin):
    """Admin interface for Newsletter subscriptions."""
    list_display = ['email', 'subscribed_at', 'is_active']
    list_filter = ['is_active', 'subscribed_at']
    search_fields = ['email']
    readonly_fields = ['subscribed_at']


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    """Admin interface for Contact form submissions."""
    list_display = ['name', 'email', 'phone', 'created_at', 'is_read']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'phone', 'message']
    readonly_fields = ['created_at', 'name', 'email', 'phone', 'message']
    fieldsets = (
        ('Contact Info', {'fields': ('name', 'email', 'phone')}),
        ('Message', {'fields': ('message',)}),
        ('Status', {'fields': ('is_read',)}),
        ('Timestamp', {'fields': ('created_at',), 'classes': ('collapse',)}),
    )

    def has_add_permission(self, request):
        """Contact submissions are created via API only."""
        return False
