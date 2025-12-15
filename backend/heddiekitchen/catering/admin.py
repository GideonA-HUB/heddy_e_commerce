from django.contrib import admin
from .models import (
    CateringCategory,
    CateringPackage,
    CateringEnquiry,
    CateringPackageImage,
    BuffetService,
    BuffetImage,
)


@admin.register(CateringCategory)
class CateringCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at']


class CateringPackageImageInline(admin.TabularInline):
    model = CateringPackageImage
    extra = 1
    fields = ('image', 'caption', 'uploaded_at')
    readonly_fields = ('uploaded_at',)


@admin.register(CateringPackage)
class CateringPackageAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'category', 'tier', 'min_guests', 'max_guests',
        'price_min', 'price_max', 'price_per_head', 'created_at'
    ]
    list_filter = ['category', 'tier', 'created_at']
    search_fields = ['title', 'description']
    readonly_fields = ['created_at']
    inlines = [CateringPackageImageInline]
    fieldsets = (
        ('Basic Info', {
            'fields': ('category', 'title', 'tier', 'description')
        }),
        ('Pricing & Capacity', {
            'fields': ('min_guests', 'max_guests', 'price_min', 'price_max', 'price_per_head')
        }),
        ('Details', {
            'fields': ('menu_options',)
        }),
        ('Timestamps', {
            'fields': ('created_at',)
        }),
    )


@admin.register(CateringEnquiry)
class CateringEnquiryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'package', 'number_of_guests', 'event_date', 'status', 'created_at']
    list_filter = ['status', 'created_at', 'package__category']
    search_fields = ['name', 'email', 'phone', 'package__title']
    readonly_fields = ['created_at']
    actions = ['mark_responded', 'mark_booked', 'mark_cancelled']
    fieldsets = (
        ('Contact Info', {
            'fields': ('user', 'name', 'email', 'phone')
        }),
        ('Event Info', {
            'fields': ('package', 'event_date', 'number_of_guests', 'message', 'tasting_session_requested', 'tasting_date')
        }),
        ('Status', {
            'fields': ('status', 'created_at')
        }),
    )
    
    def mark_responded(self, request, queryset):
        updated = queryset.update(status='responded')
        self.message_user(request, f'{updated} enquiry(ies) marked as responded.')
    
    def mark_booked(self, request, queryset):
        updated = queryset.update(status='booked')
        self.message_user(request, f'{updated} booking(s) confirmed.')
    
    def mark_cancelled(self, request, queryset):
        updated = queryset.update(status='cancelled')
        self.message_user(request, f'{updated} enquiry(ies) cancelled.')
    
    mark_responded.short_description = 'Mark as responded'
    mark_booked.short_description = 'Mark as booked'
    mark_cancelled.short_description = 'Mark as cancelled'


class BuffetImageInline(admin.TabularInline):
    model = BuffetImage
    extra = 1
    fields = ('image', 'caption', 'uploaded_at')
    readonly_fields = ('uploaded_at',)


@admin.register(BuffetService)
class BuffetServiceAdmin(admin.ModelAdmin):
    list_display = ['title', 'buffet_type', 'price_per_head', 'created_at']
    list_filter = ['buffet_type', 'created_at']
    search_fields = ['title', 'description']
    readonly_fields = ['created_at']
    inlines = [BuffetImageInline]
    fieldsets = (
        ('Details', {
            'fields': ('buffet_type', 'title', 'description', 'price_per_head', 'add_ons', 'setup_notes')
        }),
        ('Timestamps', {
            'fields': ('created_at',)
        }),
    )
