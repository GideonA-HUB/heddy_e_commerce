"""
Blog Models
"""
from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify


class BlogCategory(models.Model):
    """Blog post categories."""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name


class BlogTag(models.Model):
    """Blog post tags."""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name


class BlogPost(models.Model):
    """Blog posts."""
    title = models.CharField(max_length=300)
    slug = models.SlugField(unique=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blog_posts')
    category = models.ForeignKey(BlogCategory, on_delete=models.SET_NULL, null=True, blank=True)
    tags = models.ManyToManyField(BlogTag, related_name='posts')
    featured_image = models.ImageField(upload_to='blog/')
    excerpt = models.TextField(max_length=500)
    body = models.TextField(help_text='Markdown supported')
    meta_description = models.CharField(max_length=160, blank=True)
    meta_keywords = models.CharField(max_length=200, blank=True)
    is_published = models.BooleanField(default=False)
    publish_date = models.DateTimeField(null=True, blank=True)
    view_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-publish_date', '-created_at']  # Use created_at as fallback if publish_date is None

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class BlogComment(models.Model):
    """Blog post comments."""
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='comments')
    author = models.CharField(max_length=200)
    email = models.EmailField()
    content = models.TextField()
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    is_approved = models.BooleanField(default=True, help_text="Comments are approved by default but can be moderated")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Comment by {self.author} on {self.post.title}"


class BlogPostLike(models.Model):
    """Track who liked a blog post."""
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blog_post_likes', null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [['post', 'user'], ['post', 'ip_address']]
        ordering = ['-created_at']

    def __str__(self):
        if self.user:
            return f"{self.user.username} liked {self.post.title}"
        return f"Anonymous (IP: {self.ip_address}) liked {self.post.title}"


class BlogCommentLike(models.Model):
    """Track who liked a comment."""
    comment = models.ForeignKey(BlogComment, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blog_comment_likes', null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [['comment', 'user'], ['comment', 'ip_address']]
        ordering = ['-created_at']

    def __str__(self):
        if self.user:
            return f"{self.user.username} liked comment on {self.comment.post.title}"
        return f"Anonymous (IP: {self.ip_address}) liked comment"


class BlogPostView(models.Model):
    """Track who viewed a blog post."""
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='views_tracked')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blog_post_views', null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-viewed_at']

    def __str__(self):
        if self.user:
            return f"{self.user.username} viewed {self.post.title}"
        return f"Anonymous (IP: {self.ip_address}) viewed {self.post.title}"
