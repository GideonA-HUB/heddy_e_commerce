from rest_framework import serializers
from .models import BlogCategory, BlogTag, BlogPost, BlogComment, BlogPostLike, BlogCommentLike, BlogPostView


class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = ['id', 'name', 'slug']


class BlogTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogTag
        fields = ['id', 'name', 'slug']


class BlogCommentReplySerializer(serializers.ModelSerializer):
    """Serializer for comment replies (no nested replies to avoid infinite recursion)."""
    author_name = serializers.CharField(source='author', read_only=True)
    like_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogComment
        fields = ['id', 'author_name', 'content', 'created_at', 'is_approved', 'parent', 'like_count', 'is_liked']
        read_only_fields = ['created_at', 'is_approved', 'author_name']
    
    def get_like_count(self, obj):
        return obj.likes.count()
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        if request:
            ip = self._get_client_ip(request)
            if ip:
                return obj.likes.filter(ip_address=ip).exists()
        return False
    
    def _get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class BlogCommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author', read_only=True)
    like_count = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogComment
        fields = ['id', 'author_name', 'content', 'created_at', 'is_approved', 'parent', 'like_count', 'replies', 'is_liked']
        read_only_fields = ['created_at', 'is_approved', 'author_name']
    
    def get_like_count(self, obj):
        return obj.likes.count()
    
    def get_replies(self, obj):
        replies = obj.replies.filter(is_approved=True).order_by('created_at')
        return BlogCommentReplySerializer(replies, many=True, context=self.context).data
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        # Check by IP for anonymous users
        if request:
            ip = self._get_client_ip(request)
            if ip:
                return obj.likes.filter(ip_address=ip).exists()
        return False
    
    def _get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class BlogPostListSerializer(serializers.ModelSerializer):
    category_name = serializers.StringRelatedField(source='category.name', read_only=True)
    tags = BlogTagSerializer(many=True, read_only=True)
    comment_count = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()
    featured_image_url = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'slug', 'excerpt', 'featured_image', 'featured_image_url', 
                  'category_name', 'tags', 'author', 'author_name', 'created_at', 
                  'view_count', 'comment_count', 'like_count', 'is_liked', 'is_published', 'publish_date']
        read_only_fields = ['slug', 'view_count', 'created_at']
    
    def get_comment_count(self, obj):
        return obj.comments.filter(is_approved=True).count()
    
    def get_like_count(self, obj):
        return obj.likes.count()
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        # Check by IP for anonymous users
        if request:
            ip = self._get_client_ip(request)
            if ip:
                return obj.likes.filter(ip_address=ip).exists()
        return False
    
    def _get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
    
    def get_featured_image_url(self, obj):
        request = self.context.get('request')
        if obj.featured_image and request:
            url = obj.featured_image.url
            # If URL is already absolute (Cloudinary), return as-is
            if url.startswith('http://') or url.startswith('https://'):
                return url
            return request.build_absolute_uri(url)
        return None
    
    def get_author_name(self, obj):
        if obj.author:
            return obj.author.get_full_name() or obj.author.username
        return None


class BlogPostDetailSerializer(serializers.ModelSerializer):
    category = BlogCategorySerializer(read_only=True)
    tags = BlogTagSerializer(many=True, read_only=True)
    comments = serializers.SerializerMethodField()
    author_email = serializers.StringRelatedField(source='author.email', read_only=True)
    featured_image_url = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    share_url = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'slug', 'excerpt', 'body', 'featured_image', 'featured_image_url',
                  'category', 'tags', 'author', 'author_name', 'author_email', 'meta_description',
                  'meta_keywords', 'created_at', 'updated_at', 'view_count', 
                  'comments', 'like_count', 'is_liked', 'share_url', 'is_published', 'publish_date']
        read_only_fields = ['slug', 'view_count', 'created_at', 'updated_at']
    
    def get_comments(self, obj):
        # Get top-level comments only (no parent)
        approved_comments = obj.comments.filter(is_approved=True, parent__isnull=True).order_by('-created_at')
        return BlogCommentSerializer(approved_comments, many=True, context=self.context).data
    
    def get_like_count(self, obj):
        return obj.likes.count()
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        # Check by IP for anonymous users
        if request:
            ip = self._get_client_ip(request)
            if ip:
                return obj.likes.filter(ip_address=ip).exists()
        return False
    
    def _get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
    
    def get_share_url(self, obj):
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(f'/blog/{obj.slug}/')
        return None
    
    def get_featured_image_url(self, obj):
        request = self.context.get('request')
        if obj.featured_image and request:
            url = obj.featured_image.url
            # If URL is already absolute (Cloudinary), return as-is
            if url.startswith('http://') or url.startswith('https://'):
                return url
            return request.build_absolute_uri(url)
        return None
    
    def get_author_name(self, obj):
        if obj.author:
            return obj.author.get_full_name() or obj.author.username
        return None