from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BlogCategoryViewSet, BlogTagViewSet, BlogPostViewSet, BlogCommentViewSet
)

router = DefaultRouter()
router.register(r'categories', BlogCategoryViewSet, basename='blog-category')
router.register(r'tags', BlogTagViewSet, basename='blog-tag')
router.register(r'posts', BlogPostViewSet, basename='blog-post')
router.register(r'comments', BlogCommentViewSet, basename='blog-comment')

urlpatterns = [
    path('', include(router.urls)),
]