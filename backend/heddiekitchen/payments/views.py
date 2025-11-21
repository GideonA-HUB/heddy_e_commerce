import json
import hashlib
import hmac
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from paystack.resource import TransactionResource
from .models import Payment, PaystackWebhook
from .serializers import PaymentSerializer, PaymentInitializeSerializer
from heddiekitchen.orders.models import Order


class PaymentViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only viewset for payments.
    - GET /api/payments/ - User's payments
    - GET /api/payments/{id}/ - Payment detail
    """
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Users see only their own payments; admin sees all."""
        user = self.request.user
        if user.is_staff:
            return Payment.objects.all().select_related('order')
        return Payment.objects.filter(order__user=user).select_related('order')
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def initialize(self, request):
        """
        Initialize a Paystack payment.
        POST /api/payments/initialize/
        {
            "order_id": 1,
            "email": "user@example.com"
        }
        """
        serializer = PaymentInitializeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        order_id = serializer.validated_data['order_id']
        email = serializer.validated_data['email']
        
        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found or does not belong to user'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if payment already exists
        payment = Payment.objects.filter(order=order, status='pending').first()
        if not payment:
            payment = Payment.objects.create(
                order=order,
                user=request.user,
                amount=order.total_amount,
                currency='NGN',
                gateway='paystack'
            )
        
        try:
            # Initialize Paystack transaction
            transaction = TransactionResource(secret_key=settings.PAYSTACK_SECRET_KEY)
            response = transaction.initialize(
                reference=payment.reference,
                amount=int(payment.amount * 100),  # Paystack uses kobo
                email=email,
                callback_url=f"{request.scheme}://{request.get_host()}/order-confirmation/{order.id}/"
            )
            
            if response.get('status'):
                payment.gateway_response = response
                payment.save()
                
                return Response({
                    'status': 'success',
                    'authorization_url': response.get('data', {}).get('authorization_url'),
                    'access_code': response.get('data', {}).get('access_code'),
                    'reference': response.get('data', {}).get('reference'),
                })
            else:
                return Response(
                    {'error': response.get('message', 'Payment initialization failed')},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            return Response(
                {'error': f'Payment initialization failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@method_decorator(csrf_exempt, name='dispatch')
class PaystackWebhookView(APIView):
    """
    Handle Paystack webhooks.
    POST /api/payments/webhook/
    """
    
    def post(self, request):
        """Process Paystack webhook event."""
        # Verify webhook signature
        signature = request.META.get('HTTP_X_PAYSTACK_SIGNATURE', '')
        body = request.body
        
        # Calculate expected signature
        expected_signature = hmac.new(
            settings.PAYSTACK_SECRET_KEY.encode(),
            body,
            hashlib.sha512
        ).hexdigest()
        
        if signature != expected_signature:
            return Response(
                {'error': 'Invalid signature'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Process webhook
        try:
            data = json.loads(body)
            event = data.get('event')
            webhook_ref = data.get('data', {}).get('reference')
            
            # Log webhook
            webhook = PaystackWebhook.objects.create(
                event=event,
                reference=webhook_ref,
                status=data.get('data', {}).get('status'),
                data=data
            )
            
            # Process specific events
            if event == 'charge.success':
                self._handle_charge_success(data)
            elif event == 'charge.failed':
                self._handle_charge_failed(data)
            
            webhook.processed = True
            webhook.save()
            
            return Response({'status': 'ok'})
        except Exception as e:
            return Response(
                {'error': f'Webhook processing failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _handle_charge_success(self, data):
        """Handle successful charge."""
        reference = data.get('data', {}).get('reference')
        
        try:
            payment = Payment.objects.get(reference=reference)
            payment.status = 'completed'
            payment.save()
            
            # Update order status
            order = payment.order
            order.payment_status = 'paid'
            order.status = 'processing'
            order.save()
        except Payment.DoesNotExist:
            pass
    
    def _handle_charge_failed(self, data):
        """Handle failed charge."""
        reference = data.get('data', {}).get('reference')
        
        try:
            payment = Payment.objects.get(reference=reference)
            payment.status = 'failed'
            payment.save()
        except Payment.DoesNotExist:
            pass