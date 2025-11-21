"""
URL routing for menu app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from heddiekitchen.menu.views import MenuCategoryViewSet, MenuItemViewSet

router = DefaultRouter()
router.register(r'categories', MenuCategoryViewSet, basename='category')
router.register(r'items', MenuItemViewSet, basename='menuitem')

urlpatterns = [
    path('', include(router.urls)),
]
