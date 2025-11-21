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
    list_display = ['user', 'phone', 'city', 'country', 'role', 'newsletter_subscribed']
    list_filter = ['role', 'country', 'newsletter_subscribed']
    search_fields = ['user__username', 'user__email', 'phone']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('User Info', {'fields': ('user',)}),
        ('Contact Info', {'fields': ('phone', 'address', 'city', 'state', 'country', 'zip_code')}),
        ('Profile', {'fields': ('role', 'avatar', 'newsletter_subscribed')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )


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
