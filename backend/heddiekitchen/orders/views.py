"""
Views for orders app.
"""
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from heddiekitchen.orders.models import Cart, CartItem, Order, OrderItem
from heddiekitchen.menu.models import MenuItem
from heddiekitchen.orders.serializers import (
    CartSerializer, CartItemSerializer, OrderDetailSerializer,
    OrderListSerializer, CreateOrderSerializer
)
import uuid
from decimal import Decimal


class CartViewSet(viewsets.ViewSet):
    """ViewSet for cart operations."""
    permission_classes = [permissions.AllowAny]

    def _get_or_create_cart(self, request):
        """Get or create cart for user or session."""
        if request.user.is_authenticated:
            cart, _ = Cart.objects.get_or_create(user=request.user)
        else:
            session_id = request.session.get('cart_session_id')
            if not session_id:
                session_id = str(uuid.uuid4())
                request.session['cart_session_id'] = session_id
            cart, _ = Cart.objects.get_or_create(session_id=session_id)
        return cart

    @action(detail=False, methods=['get'])
    def list_cart(self, request):
        """Get current cart."""
        cart = self._get_or_create_cart(request)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        """Add item to cart."""
        cart = self._get_or_create_cart(request)
        menu_item_id = request.data.get('menu_item_id')
        quantity = int(request.data.get('quantity', 1))
        special_instructions = request.data.get('special_instructions', '')

        try:
            menu_item = MenuItem.objects.get(id=menu_item_id)
        except MenuItem.DoesNotExist:
            return Response({'error': 'Menu item not found'}, status=status.HTTP_404_NOT_FOUND)

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            menu_item=menu_item,
            defaults={'quantity': quantity, 'price_at_add': menu_item.price, 'special_instructions': special_instructions}
        )

        if not created:
            cart_item.quantity += quantity
            cart_item.special_instructions = special_instructions
            cart_item.save()

        serializer = CartItemSerializer(cart_item, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    @action(detail=False, methods=['put'])
    def update_item(self, request):
        """Update cart item quantity."""
        cart = self._get_or_create_cart(request)
        cart_item_id = request.data.get('cart_item_id')
        quantity = int(request.data.get('quantity', 1))

        cart_item = get_object_or_404(CartItem, id=cart_item_id, cart=cart)
        cart_item.quantity = quantity
        cart_item.save()

        serializer = CartItemSerializer(cart_item, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['delete'])
    def remove_item(self, request):
        """Remove item from cart."""
        cart = self._get_or_create_cart(request)
        cart_item_id = request.data.get('cart_item_id')
        cart_item = get_object_or_404(CartItem, id=cart_item_id, cart=cart)
        cart_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['post'])
    def clear_cart(self, request):
        """Clear entire cart."""
        cart = self._get_or_create_cart(request)
        cart.items.all().delete()
        return Response({'message': 'Cart cleared'}, status=status.HTTP_200_OK)


class OrderViewSet(viewsets.ModelViewSet):
    """ViewSet for orders."""
    serializer_class = OrderDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Users can only see their own orders."""
        if self.request.user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        """Use list serializer for list action."""
        if self.action == 'list':
            return OrderListSerializer
        return OrderDetailSerializer

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def create_order(self, request):
        """Create order from cart."""
        serializer = CreateOrderSerializer(data=request.data)
        if not serializer.is_valid():
            # Return detailed validation errors
            return Response(
                {'error': 'Validation failed', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get or create cart
        if request.user.is_authenticated:
            cart = get_object_or_404(Cart, user=request.user)
        else:
            session_id = request.session.get('cart_session_id')
            cart = get_object_or_404(Cart, session_id=session_id)

        cart_items = cart.items.all()
        if not cart_items.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate totals
        subtotal = sum(item.get_subtotal() for item in cart_items)
        # Default shipping fee (can be customized based on location)
        shipping_fee = Decimal('5000.00')  # Default shipping fee
        tax = subtotal * Decimal('0.075')  # 7.5% tax
        total = subtotal + shipping_fee + tax

        # Create order
        order = Order.objects.create(
            user=request.user if request.user.is_authenticated else None,
            guest_email=serializer.validated_data.get('shipping_email'),
            order_type='single',
            status='payment_pending',
            subtotal=subtotal,
            shipping_fee=shipping_fee,
            tax=tax,
            total=total,
            shipping_name=serializer.validated_data['shipping_name'],
            shipping_email=serializer.validated_data['shipping_email'],
            shipping_phone=serializer.validated_data['shipping_phone'],
            shipping_address=serializer.validated_data['shipping_address'],
            shipping_city=serializer.validated_data['shipping_city'],
            shipping_state=serializer.validated_data['shipping_state'],
            shipping_country=serializer.validated_data.get('shipping_country', 'Nigeria'),
            shipping_zip=serializer.validated_data.get('shipping_zip', ''),
            delivery_date=serializer.validated_data.get('delivery_date'),
            special_instructions=serializer.validated_data.get('special_instructions', ''),
            payment_method=serializer.validated_data.get('payment_method', 'paystack'),
        )

        # Create order items
        for cart_item in cart_items:
            OrderItem.objects.create(
                order=order,
                menu_item=cart_item.menu_item,
                item_name=cart_item.menu_item.name,
                quantity=cart_item.quantity,
                unit_price=cart_item.price_at_add,
                special_instructions=cart_item.special_instructions,
            )

        # DON'T clear cart here - only clear after payment is successful
        # Cart will be cleared when payment webhook confirms payment
        # This allows users to retry if they cancel Paystack checkout

        # Send order confirmation email asynchronously (don't block the response)
        try:
            import threading
            from heddiekitchen.core.email_utils import send_order_confirmation_email
            
            def send_email_async():
                try:
                    send_order_confirmation_email(order)
                except Exception as e:
                    print(f"Error sending order confirmation email: {e}")
            
            # Send email in background thread
            thread = threading.Thread(target=send_email_async)
            thread.daemon = True
            thread.start()
        except Exception as e:
            # Log error but don't fail the order creation
            print(f"Error setting up order email thread: {e}")

        response_serializer = OrderDetailSerializer(order, context={'request': request})
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'])
    def tracking(self, request, pk=None):
        """Get order tracking info."""
        order = self.get_object()
        return Response({
            'order_number': order.order_number,
            'status': order.status,
            'tracking_number': order.tracking_number,
            'delivery_date': order.delivery_date,
            'current_location': order.notes,
        })
