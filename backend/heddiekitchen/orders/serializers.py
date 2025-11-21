"""
Serializers for orders app.
"""
from rest_framework import serializers
from heddiekitchen.orders.models import Cart, CartItem, Order, OrderItem
from heddiekitchen.menu.serializers import MenuItemListSerializer


class CartItemSerializer(serializers.ModelSerializer):
    """Serializer for cart items."""
    menu_item = MenuItemListSerializer(read_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'menu_item', 'quantity', 'price_at_add', 'subtotal', 'special_instructions', 'added_at']
        read_only_fields = ['id', 'added_at']

    def get_subtotal(self, obj):
        return obj.get_subtotal()


class CartSerializer(serializers.ModelSerializer):
    """Serializer for cart."""
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()
    item_count = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total', 'item_count', 'updated_at']

    def get_total(self, obj):
        return obj.get_total()

    def get_item_count(self, obj):
        return obj.get_item_count()


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for order items."""
    class Meta:
        model = OrderItem
        fields = ['id', 'item_name', 'quantity', 'unit_price', 'subtotal', 'special_instructions']


class OrderDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for orders."""
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'order_type', 'status', 'payment_status',
            'subtotal', 'shipping_fee', 'tax', 'discount', 'total',
            'shipping_name', 'shipping_email', 'shipping_phone', 'shipping_address',
            'shipping_city', 'shipping_state', 'shipping_country', 'shipping_zip',
            'delivery_date', 'special_instructions', 'payment_reference', 'tracking_number',
            'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'order_number', 'created_at', 'updated_at']


class OrderListSerializer(serializers.ModelSerializer):
    """List serializer for orders."""
    items_count = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'order_type', 'status', 'payment_status',
            'total', 'shipping_city', 'delivery_date', 'items_count', 'created_at'
        ]

    def get_items_count(self, obj):
        return obj.items.count()


class CreateOrderSerializer(serializers.Serializer):
    """Serializer for creating orders from cart."""
    shipping_name = serializers.CharField(max_length=200)
    shipping_email = serializers.EmailField()
    shipping_phone = serializers.CharField(max_length=20)
    shipping_address = serializers.CharField()
    shipping_city = serializers.CharField(max_length=100)
    shipping_state = serializers.CharField(max_length=100)
    shipping_country = serializers.CharField(max_length=100, default='Nigeria')
    shipping_zip = serializers.CharField(max_length=20, required=False, allow_blank=True)
    delivery_date = serializers.DateField(required=False, allow_null=True)
    special_instructions = serializers.CharField(required=False, allow_blank=True)
    payment_method = serializers.CharField(max_length=50, default='paystack')
