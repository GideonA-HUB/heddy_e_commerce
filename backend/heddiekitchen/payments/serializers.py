from rest_framework import serializers
from .models import Payment, PaystackWebhook


class PaymentSerializer(serializers.ModelSerializer):
    order_number = serializers.StringRelatedField(source='order.order_number', read_only=True)
    
    class Meta:
        model = Payment
        fields = ['id', 'order', 'order_number', 'amount', 'currency', 'gateway',
                  'reference', 'status', 'gateway_response', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at', 'gateway_response']


class PaymentInitializeSerializer(serializers.Serializer):
    """Serializer for initializing a payment."""
    order_id = serializers.IntegerField()
    email = serializers.EmailField()
    
    def validate_order_id(self, value):
        from heddiekitchen.orders.models import Order
        try:
            Order.objects.get(id=value)
        except Order.DoesNotExist:
            raise serializers.ValidationError("Order not found")
        return value


class PaystackWebhookSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaystackWebhook
        fields = ['id', 'event', 'reference', 'status', 'data', 'processed', 'created_at']
        read_only_fields = ['created_at']