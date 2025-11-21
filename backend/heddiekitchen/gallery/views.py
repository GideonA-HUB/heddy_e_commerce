from rest_framework import viewsets, filters, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .models import GalleryCategory, GalleryImage
from .serializers import GalleryCategorySerializer, GalleryImageSerializer


class GalleryCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only viewset for gallery categories."""
    queryset = GalleryCategory.objects.prefetch_related('images')
    serializer_class = GalleryCategorySerializer
    lookup_field = 'slug'


class GalleryImageViewSet(viewsets.ModelViewSet):
    """
    ViewSet for gallery images.
    - GET /api/gallery/images/ - List all images
    - GET /api/gallery/images/{id}/ - Image detail
    - POST /api/gallery/images/ - Upload image (staff only)
    """
    queryset = GalleryImage.objects.all().select_related('category').order_by('display_order')
    serializer_class = GalleryImageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['title', 'description', 'alt_text']
    ordering_fields = ['upload_date', 'display_order']
    
    def perform_create(self, serializer):
        """Only staff can upload images."""
        if not self.request.user.is_staff:
            raise permissions.PermissionDenied("Only staff can upload images")
        serializer.save()