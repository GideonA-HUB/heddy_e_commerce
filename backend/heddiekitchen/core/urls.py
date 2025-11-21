"""
URL routing for core app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from heddiekitchen.core.views import (
    SiteAssetViewSet, UserProfileViewSet, NewsletterViewSet, ContactViewSet,
    register_user, login_user, logout_user, current_user
)

router = DefaultRouter()
router.register(r'assets', SiteAssetViewSet, basename='asset')
router.register(r'profile', UserProfileViewSet, basename='profile')
router.register(r'newsletter', NewsletterViewSet, basename='newsletter')
router.register(r'contact', ContactViewSet, basename='contact')

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('logout/', logout_user, name='logout'),
    path('me/', current_user, name='current_user'),
    path('', include(router.urls)),
]
