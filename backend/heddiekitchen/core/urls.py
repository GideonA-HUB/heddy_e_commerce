"""
URL routing for core app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions, status
from rest_framework.response import Response
from heddiekitchen.core.views import (
    SiteAssetViewSet, UserProfileViewSet, NewsletterViewSet, ContactViewSet,
    register_user, login_user, logout_user, current_user, grant_staff_access
)

router = DefaultRouter()
router.register(r'assets', SiteAssetViewSet, basename='asset')
router.register(r'profile', UserProfileViewSet, basename='profile')
router.register(r'newsletter', NewsletterViewSet, basename='newsletter')
router.register(r'contact', ContactViewSet, basename='contact')

@api_view(['GET', 'PATCH', 'PUT'])
@permission_classes([permissions.IsAuthenticated])
def profile_endpoint(request):
    """Handle GET and PATCH /api/auth/profile/ (without ID)."""
    from heddiekitchen.core.models import UserProfile
    from heddiekitchen.core.serializers import UserProfileSerializer
    
    # Get or create user profile
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    
    if request.method == 'GET':
        # Return profile data
        serializer = UserProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)
    elif request.method in ['PATCH', 'PUT']:
        # Update profile
        serializer = UserProfileSerializer(profile, data=request.data, partial=True, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('logout/', logout_user, name='logout'),
    path('me/', current_user, name='current_user'),
    path('grant-staff/', grant_staff_access, name='grant_staff_access'),  # One-time staff access grant
    # Custom route for GET and PATCH /api/auth/profile/ (before router)
    path('profile/', profile_endpoint, name='profile_endpoint'),
    path('', include(router.urls)),
]
