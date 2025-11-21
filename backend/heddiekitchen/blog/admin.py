from django.contrib import admin
from .models import BlogCategory, BlogTag, BlogPost, BlogComment


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


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'author', 'is_published', 'view_count', 'created_at']
    list_filter = ['is_published', 'category', 'created_at']
    search_fields = ['title', 'excerpt', 'body', 'meta_keywords']
    readonly_fields = ['slug', 'view_count', 'created_at', 'updated_at']
    prepopulated_fields = {'slug': ('title',)}
    inlines = [BlogCommentInline]
    fieldsets = (
        ('Content', {
            'fields': ('title', 'slug', 'excerpt', 'body', 'featured_image', 'category', 'tags')
        }),
        ('SEO', {
            'fields': ('meta_description', 'meta_keywords')
        }),
        ('Publishing', {
            'fields': ('is_published', 'author', 'view_count', 'created_at', 'updated_at')
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not change:
            obj.author = request.user
        super().save_model(request, obj, form, change)


@admin.register(BlogComment)
class BlogCommentAdmin(admin.ModelAdmin):
    list_display = ['author', 'post', 'is_approved', 'created_at']
    list_filter = ['is_approved', 'created_at']
    search_fields = ['author__username', 'content', 'post__title']
    readonly_fields = ['created_at']
    actions = ['approve_comments', 'reject_comments']
    
    def approve_comments(self, request, queryset):
        updated = queryset.update(is_approved=True)
        self.message_user(request, f'{updated} comment(s) approved.')
    
    def reject_comments(self, request, queryset):
        queryset.delete()
        self.message_user(request, 'Comment(s) deleted.')
    
    approve_comments.short_description = 'Approve selected comments'
    reject_comments.short_description = 'Reject selected comments'