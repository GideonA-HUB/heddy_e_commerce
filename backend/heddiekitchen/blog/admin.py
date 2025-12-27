from django.contrib import admin
from .models import BlogCategory, BlogTag, BlogPost, BlogComment, BlogPostLike, BlogCommentLike, BlogPostView


@admin.register(BlogCategory)
class BlogCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(BlogTag)
class BlogTagAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}


class BlogCommentInline(admin.TabularInline):
    model = BlogComment
    extra = 0
    fields = ['author', 'content', 'is_approved', 'created_at']
    readonly_fields = ['created_at', 'author']


class BlogPostLikeInline(admin.TabularInline):
    model = BlogPostLike
    extra = 0
    fields = ['user', 'ip_address', 'created_at']
    readonly_fields = ['created_at']
    can_delete = False


class BlogPostViewInline(admin.TabularInline):
    model = BlogPostView
    extra = 0
    fields = ['user', 'ip_address', 'viewed_at']
    readonly_fields = ['viewed_at']
    can_delete = False


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'author', 'is_published', 'view_count', 'like_count', 'comment_count', 'created_at']
    list_filter = ['is_published', 'category', 'created_at']
    search_fields = ['title', 'excerpt', 'body', 'meta_keywords']
    readonly_fields = ['view_count', 'created_at', 'updated_at', 'like_count', 'comment_count']
    inlines = [BlogCommentInline, BlogPostLikeInline, BlogPostViewInline]
    fieldsets = (
        ('Content', {
            'fields': ('title', 'slug', 'excerpt', 'body', 'featured_image', 'category', 'tags')
        }),
        ('SEO', {
            'fields': ('meta_description', 'meta_keywords')
        }),
        ('Publishing', {
            'fields': ('is_published', 'author', 'view_count', 'like_count', 'comment_count', 'created_at', 'updated_at')
        }),
    )
    
    def like_count(self, obj):
        return obj.likes.count()
    like_count.short_description = 'Likes'
    
    def comment_count(self, obj):
        return obj.comments.count()
    comment_count.short_description = 'Comments'
    
    def get_readonly_fields(self, request, obj=None):
        """Make slug readonly when editing existing post to prevent URL changes."""
        readonly = list(self.readonly_fields)
        if obj:  # Editing an existing object
            readonly.append('slug')
        return readonly
    
    def get_prepopulated_fields(self, request, obj=None):
        """Only prepopulate slug when creating new posts, not when editing."""
        if obj is None:  # Creating a new object
            return {'slug': ('title',)}
        return {}  # No prepopulation when editing
    
    def save_model(self, request, obj, form, change):
        if not change:
            obj.author = request.user
        # Set publish_date when post is published for the first time
        if obj.is_published and not obj.publish_date:
            from django.utils import timezone
            obj.publish_date = timezone.now()
        super().save_model(request, obj, form, change)


class BlogCommentLikeInline(admin.TabularInline):
    model = BlogCommentLike
    extra = 0
    fields = ['user', 'ip_address', 'created_at']
    readonly_fields = ['created_at']
    can_delete = False


@admin.register(BlogComment)
class BlogCommentAdmin(admin.ModelAdmin):
    list_display = ['author', 'post', 'parent', 'is_approved', 'like_count', 'reply_count', 'created_at']
    list_filter = ['is_approved', 'created_at']
    search_fields = ['author', 'content', 'post__title']
    readonly_fields = ['created_at', 'like_count', 'reply_count']
    inlines = [BlogCommentLikeInline]
    actions = ['approve_comments', 'reject_comments']
    
    def like_count(self, obj):
        return obj.likes.count()
    like_count.short_description = 'Likes'
    
    def reply_count(self, obj):
        return obj.replies.count()
    reply_count.short_description = 'Replies'
    
    def approve_comments(self, request, queryset):
        updated = queryset.update(is_approved=True)
        self.message_user(request, f'{updated} comment(s) approved.')
    
    def reject_comments(self, request, queryset):
        queryset.delete()
        self.message_user(request, 'Comment(s) deleted.')
    
    approve_comments.short_description = 'Approve selected comments'
    reject_comments.short_description = 'Reject selected comments'


@admin.register(BlogPostLike)
class BlogPostLikeAdmin(admin.ModelAdmin):
    list_display = ['post', 'user', 'ip_address', 'created_at']
    list_filter = ['created_at']
    search_fields = ['post__title', 'user__username', 'ip_address']
    readonly_fields = ['created_at']


@admin.register(BlogCommentLike)
class BlogCommentLikeAdmin(admin.ModelAdmin):
    list_display = ['comment', 'user', 'ip_address', 'created_at']
    list_filter = ['created_at']
    search_fields = ['comment__content', 'user__username', 'ip_address']
    readonly_fields = ['created_at']


@admin.register(BlogPostView)
class BlogPostViewAdmin(admin.ModelAdmin):
    list_display = ['post', 'user', 'ip_address', 'viewed_at']
    list_filter = ['viewed_at']
    search_fields = ['post__title', 'user__username', 'ip_address']
    readonly_fields = ['viewed_at']