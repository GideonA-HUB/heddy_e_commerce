from django.contrib import admin
from .models import GalleryCategory, GalleryImage


@admin.register(GalleryCategory)
class GalleryCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'display_order', 'created_at']
    list_filter = ['category', 'created_at']
    search_fields = ['title', 'description']
    readonly_fields = ['created_at']
    fieldsets = (
        ('Image Info', {
            'fields': ('category', 'image', 'title')
        }),
        ('Details', {
            'fields': ('description', 'display_order')
        }),
        ('Timestamps', {
            'fields': ('created_at',)
        }),
    )
    ordering = ['category', 'display_order']
