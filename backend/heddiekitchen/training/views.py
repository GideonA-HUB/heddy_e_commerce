"""
Views for training app.
"""
from rest_framework import viewsets, permissions
from .models import TrainingPackage
from .serializers import TrainingPackageSerializer


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

