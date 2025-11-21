from django.contrib import admin
from .models import ShippingDestination, ShippingOrder


@admin.register(ShippingDestination)
class ShippingDestinationAdmin(admin.ModelAdmin):
    list_display = ['name', 'destination_type', 'shipping_fee', 'estimated_days', 'is_active']
    list_filter = ['is_active', 'destination_type']
    search_fields = ['name']
    fieldsets = (
        ('Location Info', {
            'fields': ('name', 'destination_type')
        }),
        ('Shipping Details', {
            'fields': ('shipping_fee', 'estimated_days')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
    )


@admin.register(ShippingOrder)
class ShippingOrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'destination', 'weight_kg', 'status', 'tracking_number', 'created_at']
    list_filter = ['status', 'destination', 'created_at']
    search_fields = ['tracking_number', 'destination__name', 'user__username']
    readonly_fields = ['created_at', 'tracking_number']
    actions = ['mark_packed', 'mark_shipped', 'mark_delivered']
    fieldsets = (
        ('Order Info', {
            'fields': ('user', 'destination', 'weight_kg')
        }),
        ('Shipping Details', {
            'fields': ('items', 'total_weight_fee', 'shipping_fee', 'tracking_number', 'status')
        }),
        ('Customs', {
            'fields': ('customs_info',)
        }),
        ('Timestamps', {
            'fields': ('created_at',)
        }),
    )
    
    def mark_packed(self, request, queryset):
        updated = queryset.update(status='packed')
        self.message_user(request, f'{updated} order(s) marked as packed.')
    
    def mark_shipped(self, request, queryset):
        updated = queryset.update(status='shipped')
        self.message_user(request, f'{updated} order(s) marked as shipped.')
    
    def mark_delivered(self, request, queryset):
        updated = queryset.update(status='delivered')
        self.message_user(request, f'{updated} order(s) marked as delivered.')
    
    mark_packed.short_description = 'Mark as packed'
    mark_shipped.short_description = 'Mark as shipped'
    mark_delivered.short_description = 'Mark as delivered'
