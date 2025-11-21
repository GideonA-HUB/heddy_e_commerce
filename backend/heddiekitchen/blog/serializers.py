from rest_framework import serializers
from .models import BlogCategory, BlogTag, BlogPost, BlogComment


class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = ['id', 'name', 'slug', 'description']


class BlogTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogTag
        fields = ['id', 'name', 'slug']


class BlogCommentSerializer(serializers.ModelSerializer):
    author_name = serializers.StringRelatedField(source='author.userprofile.phone', read_only=True)
    
    class Meta:
        model = BlogComment
        fields = ['id', 'author_name', 'content', 'created_at', 'is_approved']
        read_only_fields = ['created_at', 'is_approved', 'author_name']


class BlogPostListSerializer(serializers.ModelSerializer):
    category_name = serializers.StringRelatedField(source='category.name', read_only=True)
    tags = BlogTagSerializer(many=True, read_only=True)
    comment_count = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'slug', 'excerpt', 'featured_image', 'category_name', 
                  'tags', 'author', 'created_at', 'view_count', 'comment_count', 'is_published']
        read_only_fields = ['slug', 'view_count', 'created_at']
    
    def get_comment_count(self, obj):
        return obj.comments.filter(is_approved=True).count()


class BlogPostDetailSerializer(serializers.ModelSerializer):
    category = BlogCategorySerializer(read_only=True)
    tags = BlogTagSerializer(many=True, read_only=True)
    comments = serializers.SerializerMethodField()
    author_email = serializers.StringRelatedField(source='author.email', read_only=True)
    
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'slug', 'excerpt', 'body', 'featured_image', 
                  'category', 'tags', 'author', 'author_email', 'meta_description',
                  'meta_keywords', 'created_at', 'updated_at', 'view_count', 
                  'comments', 'is_published']
        read_only_fields = ['slug', 'view_count', 'created_at', 'updated_at']
    
    def get_comments(self, obj):
        approved_comments = obj.comments.filter(is_approved=True)
        return BlogCommentSerializer(approved_comments, many=True).data