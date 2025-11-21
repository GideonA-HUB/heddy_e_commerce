"""
Admin configuration for menu app.
"""
from django.contrib import admin
from heddiekitchen.menu.models import MenuCategory, MenuItem, MenuItemImage, MenuItemReview


@admin.register(MenuCategory)
class MenuCategoryAdmin(admin.ModelAdmin):
    """Admin for menu categories."""
    list_display = ['name', 'display_order', 'is_active']
    list_filter = ['is_active']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']


class MenuItemImageInline(admin.TabularInline):
    """Inline for menu item images."""
    model = MenuItemImage
    extra = 1


class MenuItemReviewInline(admin.TabularInline):
    """Inline for menu item reviews."""
    model = MenuItemReview
    extra = 0
    readonly_fields = ['user', 'rating', 'title', 'comment', 'created_at']
    can_delete = False


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    """Admin for menu items."""
    list_display = ['name', 'price', 'category', 'is_available', 'is_featured', 'stock_quantity']
    list_filter = ['is_available', 'is_featured', 'category', 'created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [MenuItemImageInline, MenuItemReviewInline]
    fieldsets = (
        ('Basic Info', {'fields': ('name', 'slug', 'description')}),
        ('Pricing & Stock', {'fields': ('price', 'stock_quantity')}),
        ('Categories', {'fields': ('category', 'categories')}),
        ('Media', {'fields': ('image',)}),
        ('Details', {'fields': ('prep_time_minutes', 'servings', 'calories', 'ingredients', 'allergens', 'nutritional_info')}),
        ('Status', {'fields': ('is_available', 'is_featured')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )
    readonly_fields = ['created_at', 'updated_at']


@admin.register(MenuItemImage)
class MenuItemImageAdmin(admin.ModelAdmin):
    """Admin for menu item images."""
    list_display = ['menu_item', 'display_order']
    list_filter = ['menu_item']
    ordering = ['menu_item', 'display_order']


@admin.register(MenuItemReview)
class MenuItemReviewAdmin(admin.ModelAdmin):
    """Admin for menu item reviews."""
    list_display = ['menu_item', 'user', 'rating', 'is_verified_purchase', 'created_at']
    list_filter = ['rating', 'is_verified_purchase', 'created_at']
    search_fields = ['menu_item__name', 'user__username']
    readonly_fields = ['created_at', 'updated_at']
