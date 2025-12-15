from rest_framework import viewsets, filters, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import CateringCategory, CateringPackage, CateringEnquiry, BuffetService
from .serializers import (
    CateringCategorySerializer,
    CateringPackageSerializer,
    CateringEnquirySerializer,
    BuffetServiceSerializer,
)


class CateringCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only viewset for catering event categories."""
    queryset = CateringCategory.objects.all()
    serializer_class = CateringCategorySerializer
    lookup_field = 'slug'


class CateringPackageViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only viewset for catering packages.
    - GET /api/catering/packages/ - List all packages
    - GET /api/catering/packages/{id}/ - Package detail
    """
    queryset = CateringPackage.objects.all().select_related('category')
    serializer_class = CateringPackageSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'tier']
    search_fields = ['title', 'description']
    ordering_fields = ['price_per_head', 'price_min', 'price_max', 'min_guests']
    ordering = ['tier', 'price_per_head']


class CateringEnquiryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for catering enquiries (event booking requests).
    - GET /api/catering/enquiries/ - User's enquiries
    - POST /api/catering/enquiries/ - Create enquiry
    - GET /api/catering/enquiries/{id}/ - Enquiry detail
    - PATCH /api/catering/enquiries/{id}/ - Update enquiry
    """
    serializer_class = CateringEnquirySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'package']
    ordering_fields = ['created_at', 'event_date']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Users see only their own enquiries, admin sees all."""
        user = self.request.user
        if user.is_staff:
            return CateringEnquiry.objects.all().select_related('user', 'package')
        return CateringEnquiry.objects.filter(user=user).select_related('package')
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def send_quotation(self, request, pk=None):
        """
        Send quotation email to enquirer.
        Admin action: POST /api/catering/enquiries/{id}/send_quotation/
        """
        enquiry = self.get_object()
        # TODO: Integrate email sending (uses quotation template)
        enquiry.status = 'quotation_sent'
        enquiry.save()
        return Response({'status': 'Quotation sent'})
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def confirm_booking(self, request, pk=None):
        """Confirm a catering booking."""
        enquiry = self.get_object()
        enquiry.status = 'confirmed'
        enquiry.save()
        # TODO: Send confirmation email
        return Response({'status': 'Booking confirmed'})
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def cancel(self, request, pk=None):
        """Cancel a catering enquiry."""
        enquiry = self.get_object()
        enquiry.status = 'cancelled'
        enquiry.save()
        return Response({'status': 'Enquiry cancelled'})


class BuffetServiceViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only viewset for buffet services."""
    queryset = BuffetService.objects.all()
    serializer_class = BuffetServiceSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['buffet_type']
    ordering_fields = ['price_per_head', 'created_at']
    ordering = ['buffet_type', 'price_per_head']