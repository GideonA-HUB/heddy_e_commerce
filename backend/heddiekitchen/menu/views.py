"""
Views for menu app.
"""
from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from heddiekitchen.menu.models import MenuCategory, MenuItem, MenuItemReview
from heddiekitchen.menu.serializers import (
    MenuCategorySerializer, MenuItemDetailSerializer,
    MenuItemListSerializer, MenuItemReviewSerializer
)


class MenuCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for menu categories."""
    queryset = MenuCategory.objects.filter(is_active=True).order_by('display_order')
    serializer_class = MenuCategorySerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = ['is_active']


class MenuItemViewSet(viewsets.ModelViewSet):
    """ViewSet for menu items with filtering and search."""
    queryset = MenuItem.objects.filter(is_available=True).select_related('category').prefetch_related('categories', 'images', 'reviews')
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_featured', 'is_available']
    search_fields = ['name', 'description', 'ingredients']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-is_featured', '-created_at']

    def get_serializer_class(self):
        """Use lightweight serializer for list, detailed for retrieve."""
        if self.action == 'retrieve':
            return MenuItemDetailSerializer
        return MenuItemListSerializer

    @action(detail=True, methods=['get'])
    def reviews(self, request, pk=None):
        """Get reviews for a menu item."""
        menu_item = self.get_object()
        reviews = menu_item.reviews.all()
        serializer = MenuItemReviewSerializer(reviews, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def add_review(self, request, pk=None):
        """Add a review to a menu item."""
        menu_item = self.get_object()
        rating = request.data.get('rating')
        title = request.data.get('title')
        comment = request.data.get('comment')

        if not all([rating, title, comment]):
            return Response(
                {'error': 'rating, title, and comment are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            review, created = MenuItemReview.objects.get_or_create(
                menu_item=menu_item,
                user=request.user,
                defaults={'rating': int(rating), 'title': title, 'comment': comment}
            )
            if not created:
                review.rating = int(rating)
                review.title = title
                review.comment = comment
                review.save()

            serializer = MenuItemReviewSerializer(review, context={'request': request})
            return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
        except ValueError:
            return Response(
                {'error': 'Invalid rating value'},
                status=status.HTTP_400_BAD_REQUEST
            )
