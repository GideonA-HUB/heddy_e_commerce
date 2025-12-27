from rest_framework import viewsets, filters, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from .models import BlogCategory, BlogTag, BlogPost, BlogComment, BlogPostLike, BlogCommentLike, BlogPostView
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
    
    def retrieve(self, request, *args, **kwargs):
        """Increment view count on retrieve and track viewer."""
        response = super().retrieve(request, *args, **kwargs)
        post = self.get_object()
        post.view_count += 1
        post.save(update_fields=['view_count'])
        
        # Track who viewed
        ip_address = self._get_client_ip(request)
        BlogPostView.objects.create(
            post=post,
            user=request.user if request.user.is_authenticated else None,
            ip_address=ip_address
        )
        
        return response
    
    def _get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
    
    @action(detail=True, methods=['post', 'delete'], permission_classes=[permissions.AllowAny])
    def like(self, request, slug=None):
        """Like or unlike a blog post."""
        post = self.get_object()
        ip_address = self._get_client_ip(request)
        
        if request.method == 'POST':
            # Check if already liked
            if request.user.is_authenticated:
                existing = BlogPostLike.objects.filter(post=post, user=request.user).first()
            else:
                existing = BlogPostLike.objects.filter(post=post, ip_address=ip_address).first()
            
            if existing:
                return Response({'error': 'Already liked'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Like the post
            BlogPostLike.objects.create(
                post=post,
                user=request.user if request.user.is_authenticated else None,
                ip_address=ip_address if not request.user.is_authenticated else None
            )
            return Response({'liked': True, 'like_count': post.likes.count()})
        else:
            # Unlike the post
            if request.user.is_authenticated:
                deleted = BlogPostLike.objects.filter(post=post, user=request.user).delete()[0]
            else:
                deleted = BlogPostLike.objects.filter(post=post, ip_address=ip_address).delete()[0]
            if deleted:
                return Response({'liked': False, 'like_count': post.likes.count()})
            return Response({'error': 'Not liked'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def add_comment(self, request, slug=None):
        """Add a comment to a blog post."""
        post = self.get_object()
        content = request.data.get('content', '').strip()
        parent_id = request.data.get('parent_id')
        
        if not content:
            return Response({'error': 'Comment cannot be empty'}, status=status.HTTP_400_BAD_REQUEST)
        
        # BlogComment.author is a CharField, not ForeignKey
        author_name = request.user.get_full_name() or request.user.username if request.user.is_authenticated else request.data.get('author', 'Anonymous')
        email = request.user.email or request.data.get('email', '')
        
        parent = None
        if parent_id:
            try:
                parent = BlogComment.objects.get(id=parent_id, post=post)
            except BlogComment.DoesNotExist:
                return Response({'error': 'Parent comment not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        comment = BlogComment.objects.create(
            post=post,
            author=author_name,
            email=email,
            content=content,
            parent=parent,
            is_approved=False  # Requires moderation
        )
        
        serializer = BlogCommentSerializer(comment, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class BlogCommentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing blog comments.
    """
    queryset = BlogComment.objects.all()
    serializer_class = BlogCommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def _get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
    
    @action(detail=True, methods=['post', 'delete'], permission_classes=[permissions.AllowAny])
    def like(self, request, pk=None):
        """Like or unlike a comment."""
        comment = self.get_object()
        ip_address = self._get_client_ip(request)
        
        if request.method == 'POST':
            # Check if already liked
            if request.user.is_authenticated:
                existing = BlogCommentLike.objects.filter(comment=comment, user=request.user).first()
            else:
                existing = BlogCommentLike.objects.filter(comment=comment, ip_address=ip_address).first()
            
            if existing:
                return Response({'error': 'Already liked'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Like the comment
            BlogCommentLike.objects.create(
                comment=comment,
                user=request.user if request.user.is_authenticated else None,
                ip_address=ip_address if not request.user.is_authenticated else None
            )
            return Response({'liked': True, 'like_count': comment.likes.count()})
        else:
            # Unlike the comment
            if request.user.is_authenticated:
                deleted = BlogCommentLike.objects.filter(comment=comment, user=request.user).delete()[0]
            else:
                deleted = BlogCommentLike.objects.filter(comment=comment, ip_address=ip_address).delete()[0]
            if deleted:
                return Response({'liked': False, 'like_count': comment.likes.count()})
            return Response({'error': 'Not liked'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def approve(self, request, pk=None):
        """Approve a comment."""
        comment = self.get_object()
        comment.is_approved = True
        comment.save()
        return Response({'status': 'Comment approved'})
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def reject(self, request, pk=None):
        """Reject a comment."""
        comment = self.get_object()
        comment.delete()
        return Response({'status': 'Comment deleted'})