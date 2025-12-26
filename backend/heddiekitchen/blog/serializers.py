from rest_framework import serializers
from .models import BlogCategory, BlogTag, BlogPost, BlogComment


class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = ['id', 'name', 'slug']


class BlogTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogTag
        fields = ['id', 'name', 'slug']


class BlogCommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author', read_only=True)
    
    class Meta:
        model = BlogComment
        fields = ['id', 'author_name', 'content', 'created_at', 'is_approved']
        read_only_fields = ['created_at', 'is_approved', 'author_name']


class BlogPostListSerializer(serializers.ModelSerializer):
    category_name = serializers.StringRelatedField(source='category.name', read_only=True)
    tags = BlogTagSerializer(many=True, read_only=True)
    comment_count = serializers.SerializerMethodField()
    featured_image_url = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'slug', 'excerpt', 'featured_image', 'featured_image_url', 
                  'category_name', 'tags', 'author', 'author_name', 'created_at', 
                  'view_count', 'comment_count', 'is_published', 'publish_date']
        read_only_fields = ['slug', 'view_count', 'created_at']
    
    def get_comment_count(self, obj):
        return obj.comments.filter(is_approved=True).count()
    
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
    
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'slug', 'excerpt', 'body', 'featured_image', 'featured_image_url',
                  'category', 'tags', 'author', 'author_name', 'author_email', 'meta_description',
                  'meta_keywords', 'created_at', 'updated_at', 'view_count', 
                  'comments', 'is_published', 'publish_date']
        read_only_fields = ['slug', 'view_count', 'created_at', 'updated_at']
    
    def get_comments(self, obj):
        approved_comments = obj.comments.filter(is_approved=True)
        return BlogCommentSerializer(approved_comments, many=True).data
    
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