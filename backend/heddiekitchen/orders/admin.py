"""
Admin configuration for orders app.
"""
from django.contrib import admin
from heddiekitchen.orders.models import Cart, CartItem, Order, OrderItem


class CartItemInline(admin.TabularInline):
    """Inline for cart items."""
    model = CartItem
    extra = 0
    readonly_fields = ['added_at', 'updated_at']


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    """Admin for shopping carts."""
    list_display = ['user', 'session_id', 'created_at', 'updated_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'session_id']
    inlines = [CartItemInline]
    readonly_fields = ['created_at', 'updated_at']


class OrderItemInline(admin.TabularInline):
    """Inline for order items."""
    model = OrderItem
    extra = 0
    readonly_fields = ['item_name', 'quantity', 'unit_price', 'subtotal']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """Admin for orders."""
    list_display = ['order_number', 'user', 'status', 'payment_status', 'total', 'created_at']
    list_filter = ['status', 'payment_status', 'order_type', 'created_at']
    search_fields = ['order_number', 'user__username', 'shipping_email', 'payment_reference']
    inlines = [OrderItemInline]
    readonly_fields = ['order_number', 'created_at', 'updated_at', 'paid_at']
    fieldsets = (
        ('Order Info', {'fields': ('order_number', 'user', 'guest_email', 'order_type', 'status')}),
        ('Totals', {'fields': ('subtotal', 'shipping_fee', 'tax', 'discount', 'total')}),
        ('Shipping', {'fields': ('shipping_name', 'shipping_email', 'shipping_phone', 'shipping_address', 'shipping_city', 'shipping_state', 'shipping_country', 'shipping_zip', 'delivery_date')}),
        ('Payment', {'fields': ('payment_method', 'payment_status', 'payment_reference', 'paid_at')}),
        ('Tracking', {'fields': ('tracking_number', 'special_instructions', 'notes')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )

    actions = ['mark_as_processing', 'mark_as_dispatched', 'mark_as_delivered']

    def mark_as_processing(self, request, queryset):
        queryset.update(status='processing')
    mark_as_processing.short_description = "Mark selected as processing"

    def mark_as_dispatched(self, request, queryset):
        queryset.update(status='dispatched')
    mark_as_dispatched.short_description = "Mark selected as dispatched"

    def mark_as_delivered(self, request, queryset):
        queryset.update(status='delivered')
    mark_as_delivered.short_description = "Mark selected as delivered"


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    """Admin for order items."""
    list_display = ['order', 'item_name', 'quantity', 'unit_price', 'subtotal']
    list_filter = ['order__created_at']
    search_fields = ['order__order_number', 'item_name']
    readonly_fields = ['order', 'item_name', 'quantity', 'unit_price', 'subtotal']

    def has_add_permission(self, request):
        """OrderItems are created automatically."""
        return False
