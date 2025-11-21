"""
All admin registrations for remaining apps.
"""
from django.contrib import admin
from heddiekitchen.mealplans.models import MealPlan, MealPlanSubscription
from heddiekitchen.catering.models import CateringCategory, CateringPackage, CateringEnquiry
from heddiekitchen.shipping.models import ShippingDestination, ShippingOrder
from heddiekitchen.blog.models import BlogPost, BlogCategory, BlogTag, BlogComment
from heddiekitchen.payments.models import Payment, PaystackWebhook
from heddiekitchen.gallery.models import GalleryCategory, GalleryImage


@admin.register(MealPlan)
class MealPlanAdmin(admin.ModelAdmin):
    list_display = ['title', 'plan_type', 'period', 'price', 'is_active']
    prepopulated_fields = {'slug': ('title',)}


@admin.register(MealPlanSubscription)
class MealPlanSubscriptionAdmin(admin.ModelAdmin):
    list_display = ['user', 'meal_plan', 'status', 'start_date', 'end_date']
    list_filter = ['status', 'start_date']


@admin.register(CateringCategory)
class CateringCategoryAdmin(admin.ModelAdmin):
    pass


@admin.register(CateringPackage)
class CateringPackageAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'tier', 'price_per_head']
    list_filter = ['category', 'tier']


@admin.register(CateringEnquiry)
class CateringEnquiryAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'event_date', 'number_of_guests', 'status']
    list_filter = ['status', 'event_date']
    search_fields = ['name', 'email']


@admin.register(ShippingDestination)
class ShippingDestinationAdmin(admin.ModelAdmin):
    list_display = ['name', 'destination_type', 'shipping_fee', 'estimated_days', 'is_active']
    list_filter = ['destination_type', 'is_active']


@admin.register(ShippingOrder)
class ShippingOrderAdmin(admin.ModelAdmin):
    list_display = ['destination', 'weight_kg', 'shipping_fee', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    readonly_fields = ['created_at']


@admin.register(BlogCategory)
class BlogCategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}


@admin.register(BlogTag)
class BlogTagAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'category', 'is_published', 'publish_date', 'view_count']
    list_filter = ['is_published', 'category', 'publish_date']
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ['title', 'body']
    fieldsets = (
        ('Content', {'fields': ('title', 'slug', 'author', 'category', 'tags', 'featured_image', 'excerpt', 'body')}),
        ('SEO', {'fields': ('meta_description', 'meta_keywords')}),
        ('Publishing', {'fields': ('is_published', 'publish_date')}),
        ('Stats', {'fields': ('view_count',), 'classes': ('collapse',)}),
    )


@admin.register(BlogComment)
class BlogCommentAdmin(admin.ModelAdmin):
    list_display = ['author', 'post', 'is_approved', 'created_at']
    list_filter = ['is_approved', 'created_at']
    search_fields = ['author', 'email']


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['reference', 'amount', 'status', 'payment_gateway', 'created_at']
    list_filter = ['status', 'payment_gateway', 'created_at']
    readonly_fields = ['reference', 'created_at']


@admin.register(PaystackWebhook)
class PaystackWebhookAdmin(admin.ModelAdmin):
    list_display = ['reference', 'event', 'processed', 'created_at']
    list_filter = ['event', 'processed', 'created_at']
    readonly_fields = ['data', 'created_at']


@admin.register(GalleryCategory)
class GalleryCategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'display_order']
    list_filter = ['category']
    search_fields = ['title']
