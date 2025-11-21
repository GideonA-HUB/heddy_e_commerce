from rest_framework import viewsets, filters, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import MealPlan, MealPlanSubscription
from .serializers import MealPlanSerializer, MealPlanSubscriptionSerializer


class MealPlanViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only viewset for meal plans.
    - GET /api/mealplans/plans/ - List all meal plans
    - GET /api/mealplans/plans/{id}/ - Plan detail
    """
    queryset = MealPlan.objects.filter(is_active=True)
    serializer_class = MealPlanSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description', 'plan_type']


class MealPlanSubscriptionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for meal plan subscriptions.
    - GET /api/mealplans/subscriptions/ - User's subscriptions
    - POST /api/mealplans/subscriptions/ - Subscribe to plan
    - PATCH /api/mealplans/subscriptions/{id}/ - Update subscription
    - DELETE /api/mealplans/subscriptions/{id}/ - Cancel subscription
    """
    serializer_class = MealPlanSubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Users see only their own subscriptions; admin sees all."""
        user = self.request.user
        if user.is_staff:
            return MealPlanSubscription.objects.all().select_related('user', 'plan')
        return MealPlanSubscription.objects.filter(user=user).select_related('plan')
    
    def perform_create(self, serializer):
        """Create subscription and initialize billing."""
        subscription = serializer.save()
        # TODO: Initialize first payment with Paystack
        return subscription
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel an active subscription."""
        subscription = self.get_object()
        if subscription.is_active:
            subscription.is_active = False
            subscription.save()
            return Response({'status': 'Subscription cancelled'})
        return Response(
            {'error': 'Subscription already cancelled'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=True, methods=['post'])
    def pause(self, request, pk=None):
        """Pause a subscription temporarily."""
        subscription = self.get_object()
        if subscription.is_active:
            subscription.is_active = False
            subscription.save()
            return Response({'status': 'Subscription paused'})
        return Response(
            {'error': 'Subscription not active'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=True, methods=['post'])
    def resume(self, request, pk=None):
        """Resume a paused subscription."""
        subscription = self.get_object()
        subscription.is_active = True
        subscription.save()
        return Response({'status': 'Subscription resumed'})
    
    @action(detail=True, methods=['post'])
    def change_plan(self, request, pk=None):
        """Change meal plan."""
        subscription = self.get_object()
        new_plan_id = request.data.get('plan_id')
        
        if not new_plan_id:
            return Response({'error': 'plan_id required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            new_plan = MealPlan.objects.get(id=new_plan_id)
        except MealPlan.DoesNotExist:
            return Response({'error': 'Plan not found'}, status=status.HTTP_404_NOT_FOUND)
        
        subscription.plan = new_plan
        subscription.save()
        return Response({
            'status': 'Plan changed',
            'plan': MealPlanSerializer(new_plan).data
        })