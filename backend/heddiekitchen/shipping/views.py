from decimal import Decimal
from rest_framework import viewsets, filters, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import ShippingDestination, ShippingOrder
from .serializers import ShippingDestinationSerializer, ShippingOrderSerializer


class ShippingDestinationViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only viewset for shipping destinations (Nigeria-wide + international)."""
    queryset = ShippingDestination.objects.filter(is_active=True)
    serializer_class = ShippingDestinationSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'destination_type']


class ShippingOrderViewSet(viewsets.ModelViewSet):
    """
    ViewSet for shipping orders.
    - GET /api/shipping/orders/ - User's shipping orders
    - POST /api/shipping/orders/ - Create shipping order
    - GET /api/shipping/orders/{id}/ - Order detail with tracking
    - POST /api/shipping/orders/calculate_quote/ - Get shipping quote
    """
    serializer_class = ShippingOrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'destination']
    ordering_fields = ['created_at', 'estimated_delivery']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Users see only their orders; admin sees all."""
        user = self.request.user
        if user.is_staff:
            return ShippingOrder.objects.all().select_related('destination', 'user')
        return ShippingOrder.objects.filter(user=user).select_related('destination')
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def calculate_quote(self, request):
        """
        Calculate shipping quote.
        POST /api/shipping/orders/calculate_quote/
        {
            "destination_id": 1,
            "weight_kg": 5.0
        }
        """
        destination_id = request.data.get('destination_id')
        weight_kg = request.data.get('weight_kg')
        
        if not destination_id or not weight_kg:
            return Response(
                {'error': 'destination_id and weight_kg required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            destination = ShippingDestination.objects.get(id=destination_id, is_active=True)
        except ShippingDestination.DoesNotExist:
            return Response({'error': 'Destination not found'}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            weight_kg = Decimal(str(weight_kg))
        except (ValueError, TypeError):
            return Response({'error': 'weight_kg must be a number'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Pricing:
        # - For international: typically base_fee + per_kg_fee * weight
        # - For domestic: you can rely on shipping_fee (flat) and/or per_kg_fee
        base_fee = destination.base_fee or destination.shipping_fee or Decimal('0')
        per_kg_fee = destination.per_kg_fee or Decimal('0')
        weight_fee = weight_kg * per_kg_fee
        total_fee = base_fee + weight_fee
        
        return Response({
            'destination': destination_id,
            'destination_name': destination.name,
            'zone': 'International' if destination.destination_type == 'international' else 'Nigeria-wide',
            'weight_kg': float(weight_kg),
            'base_fee': float(base_fee),
            'weight_fee': float(weight_fee),
            'total_fee': float(total_fee),
            'amount': float(total_fee),
            'delivery_time_days': destination.estimated_days,
            'allowed_items': destination.allowed_items,
            'packaging_standards': destination.packaging_standards,
            'customs_notice': destination.customs_notice,
        })
    
    @action(detail=True, methods=['get'])
    def tracking(self, request, pk=None):
        """Get tracking information for a shipping order."""
        order = self.get_object()
        return Response({
            'tracking_number': order.tracking_number,
            'status': order.status,
            'destination': f"{order.destination.country} - {order.destination.state_or_region or ''}",
            'estimated_delivery': order.estimated_delivery,
        })