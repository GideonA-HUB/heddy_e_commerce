"""
Admin configuration for training app.
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import TrainingPackage


@admin.register(TrainingPackage)
class TrainingPackageAdmin(admin.ModelAdmin):
    """Admin interface for TrainingPackage."""
    list_display = [
        'package_type', 'title', 'price', 'is_active', 'display_order',
        'includes_certification', 'image_preview'
    ]
    list_filter = [
        'package_type', 'is_active', 'is_for_beginners', 'is_advanced',
        'is_upgrade', 'is_housewife', 'includes_certification'
    ]
    search_fields = ['title', 'description', 'package_type']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['created_at', 'updated_at', 'image_preview']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('package_type', 'title', 'slug', 'description', 'price', 'image', 'image_preview')
        }),
        ('Package Type Flags', {
            'fields': ('is_for_beginners', 'is_advanced', 'is_upgrade', 'is_housewife')
        }),
        ('Features', {
            'fields': ('features',)
        }),
        ('Theory & Education', {
            'fields': ('includes_theory', 'theory_topics')
        }),
        ('Practical Courses', {
            'fields': (
                'includes_pastries', 'includes_baking', 'includes_local_dishes',
                'includes_intercontinental', 'includes_advanced_cooking',
                'includes_upscale_dining', 'includes_event_catering',
                'includes_management', 'includes_general_kitchen_mgmt',
                'includes_popular_african_menu'
            )
        }),
        ('Certification', {
            'fields': ('includes_certification',)
        }),
        ('Display Settings', {
            'fields': ('is_active', 'display_order')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="width:100px; height:100px; object-fit:cover; border-radius:8px;" />',
                obj.image.url
            )
        return "No image"
    image_preview.short_description = "Image Preview"

