"""
Views for training app.
"""
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import TrainingPackage, TrainingEnquiry
from .serializers import TrainingPackageSerializer, TrainingEnquirySerializer


class TrainingPackageViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for training packages.
    Read-only for public access.
    """
    queryset = TrainingPackage.objects.filter(is_active=True)
    serializer_class = TrainingPackageSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    
    def get_serializer_context(self):
        """Add request to serializer context for absolute URLs."""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class TrainingEnquiryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for training enquiries.
    Allow anyone to create enquiries, but only staff can view them.
    """
    queryset = TrainingEnquiry.objects.all()
    serializer_class = TrainingEnquirySerializer
    permission_classes = [permissions.AllowAny]
    http_method_names = ['post', 'get']  # Only allow POST for creation, GET for staff
    
    def get_permissions(self):
        """Allow anyone to create, but only staff to list/retrieve."""
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
    
    def create(self, request, *args, **kwargs):
        """Create a new training enquiry."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {'message': 'Thank you for your enquiry! We will contact you soon.'},
            status=status.HTTP_201_CREATED,
            headers=headers
        )

