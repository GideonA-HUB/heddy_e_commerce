from rest_framework import viewsets, filters, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import BlogCategory, BlogTag, BlogPost, BlogComment
from .serializers import (
    BlogCategorySerializer, BlogTagSerializer, BlogPostListSerializer,
    BlogPostDetailSerializer, BlogCommentSerializer
)


class BlogCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only viewset for blog categories."""
    queryset = BlogCategory.objects.all()
    serializer_class = BlogCategorySerializer
    lookup_field = 'slug'


class BlogTagViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only viewset for blog tags."""
    queryset = BlogTag.objects.all()
    serializer_class = BlogTagSerializer
    lookup_field = 'slug'


class BlogPostViewSet(viewsets.ModelViewSet):
    """
    ViewSet for blog posts.
    - GET /api/blog/ - List published posts
    - GET /api/blog/{id}/ - Post detail, increments view_count
    - POST /api/blog/{id}/add_comment/ - Add comment (authenticated)
    """
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_published']
    search_fields = ['title', 'excerpt', 'body', 'meta_keywords']
    ordering_fields = ['created_at', 'view_count']
    ordering = ['-created_at']
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    
    def get_queryset(self):
        """Filter by published status."""
        queryset = BlogPost.objects.all()
        if self.action in ['list', 'retrieve']:
            queryset = queryset.filter(is_published=True)
        return queryset.select_related('category', 'author').prefetch_related('tags', 'comments')
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return BlogPostDetailSerializer
        return BlogPostListSerializer
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def add_comment(self, request, slug=None):
        """Add a comment to a blog post."""
        post = self.get_object()
        content = request.data.get('content', '').strip()
        
        if not content:
            return Response({'error': 'Comment cannot be empty'}, status=status.HTTP_400_BAD_REQUEST)
        
        comment = BlogComment.objects.create(
            post=post,
            author=request.user,
            content=content,
            is_approved=False  # Requires moderation
        )
        
        serializer = BlogCommentSerializer(comment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def retrieve(self, request, *args, **kwargs):
        """Increment view count on retrieve."""
        response = super().retrieve(request, *args, **kwargs)
        post = self.get_object()
        post.view_count += 1
        post.save(update_fields=['view_count'])
        return response


class BlogCommentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing blog comments (admin only).
    """
    queryset = BlogComment.objects.all()
    serializer_class = BlogCommentSerializer
    permission_classes = [permissions.IsAdminUser]
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a comment."""
        comment = self.get_object()
        comment.is_approved = True
        comment.save()
        return Response({'status': 'Comment approved'})
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a comment."""
        comment = self.get_object()
        comment.delete()
        return Response({'status': 'Comment deleted'})