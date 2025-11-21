from rest_framework import serializers
from .models import ShippingDestination, ShippingOrder


class ShippingDestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingDestination
        fields = ['id', 'country', 'state_or_region', 'delivery_time_days', 'base_fee', 
                  'per_kg_fee', 'is_active']


class ShippingOrderSerializer(serializers.ModelSerializer):
    destination_name = serializers.SerializerMethodField()
    total_shipping_cost = serializers.SerializerMethodField()
    
    class Meta:
        model = ShippingOrder
        fields = ['id', 'order', 'destination', 'destination_name', 'weight_kg', 
                  'estimated_delivery', 'tracking_number', 'status', 'customs_info',
                  'total_shipping_cost', 'created_at']
        read_only_fields = ['created_at', 'tracking_number', 'estimated_delivery', 'status']
    
    def get_destination_name(self, obj):
        if obj.destination.state_or_region:
            return f"{obj.destination.country} - {obj.destination.state_or_region}"
        return obj.destination.country
    
    def get_total_shipping_cost(self, obj):
        """Calculate total shipping cost based on destination and weight."""
        dest = obj.destination
        base_cost = dest.base_fee
        weight_cost = obj.weight_kg * dest.per_kg_fee
        return base_cost + weight_cost