from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GalleryCategoryViewSet, GalleryImageViewSet

router = DefaultRouter()
router.register(r'categories', GalleryCategoryViewSet, basename='gallery-category')
router.register(r'images', GalleryImageViewSet, basename='gallery-image')

urlpatterns = [
    path('', include(router.urls)),
]