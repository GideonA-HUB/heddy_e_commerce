from rest_framework import serializers
from .models import ShippingDestination, ShippingOrder


class ShippingDestinationSerializer(serializers.ModelSerializer):
    """Expose full catalogue info for each destination."""

    zone = serializers.SerializerMethodField()

    class Meta:
        model = ShippingDestination
        fields = [
            'id',
            'name',
            'destination_type',
            'zone',
            'shipping_fee',
            'base_fee',
            'per_kg_fee',
            'estimated_days',
            'delivery_time_description',
            'allowed_items',
            'packaging_standards',
            'customs_notice',
            'is_pickup_available',
            'pickup_location',
            'pickup_schedule',
            'is_active',
        ]

    def get_zone(self, obj):
        return 'International' if obj.destination_type == 'international' else 'Nigeria-wide'


class ShippingOrderSerializer(serializers.ModelSerializer):
    destination_name = serializers.SerializerMethodField()
    total_shipping_cost = serializers.SerializerMethodField()

    class Meta:
        model = ShippingOrder
        fields = [
            'id',
            'user',
            'destination',
            'destination_name',
            'items',
            'weight_kg',
            'total_weight_fee',
            'shipping_fee',
            'customs_info',
            'status',
            'tracking_number',
            'created_at',
            'total_shipping_cost',
        ]
        read_only_fields = ['created_at', 'tracking_number']

    def get_destination_name(self, obj):
        return obj.destination.name

    def get_total_shipping_cost(self, obj):
        # Use stored shipping_fee as the current total; this keeps logic simple
        # and avoids double-calculating in multiple places.
        return obj.shipping_fee