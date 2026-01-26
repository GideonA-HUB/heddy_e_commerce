"""
Views for core app (authentication, profiles, etc.).
"""
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.db import IntegrityError
from .models import UserProfile, Newsletter, Contact, SiteAsset
from .serializers import (
    UserSerializer, UserProfileSerializer, NewsletterSerializer,
    ContactSerializer, SiteAssetSerializer
)
from .email_utils import send_newsletter_welcome_email


class UserProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for user profiles.
    - GET /api/auth/profile/ - Get current user's profile
    - PATCH /api/auth/profile/ - Update current user's profile
    """
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Users can only see their own profile."""
        return UserProfile.objects.filter(user=self.request.user)

    def get_object(self):
        """Get or create profile for current user."""
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile

    def get_serializer_context(self):
        """Add request to serializer context."""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


@api_view(['GET', 'PATCH', 'PUT'])
@permission_classes([permissions.IsAuthenticated])
def profile_endpoint(request):
    """
    Custom endpoint for GET and PATCH /api/auth/profile/
    This handles profile operations without requiring an ID in the URL.
    """
    from .serializers import UserProfileSerializer
    
    # Get or create user profile
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    
    if request.method == 'GET':
        serializer = UserProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)
    
    elif request.method in ['PATCH', 'PUT']:
        serializer = UserProfileSerializer(
            profile, 
            data=request.data, 
            partial=request.method == 'PATCH',
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    """
    Register a new user.
    POST /api/auth/register/
    """
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    first_name = request.data.get('first_name', '')
    last_name = request.data.get('last_name', '')

    if not all([username, email, password]):
        return Response(
            {'error': 'username, email, and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key
        }, status=status.HTTP_201_CREATED)
    except IntegrityError:
        return Response(
            {'error': 'Username or email already exists'},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_user(request):
    """
    Login user.
    POST /api/auth/login/
    """
    username = request.data.get('username')
    password = request.data.get('password')

    if not all([username, password]):
        return Response(
            {'error': 'username and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(username=username)
        if user.check_password(password):
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'user': UserSerializer(user).data,
                'token': token.key
            }, status=status.HTTP_200_OK)
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_user(request):
    """
    Logout user (delete token).
    POST /api/auth/logout/
    """
    try:
        request.user.auth_token.delete()
    except:
        pass
    return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def current_user(request):
    """
    Get current authenticated user.
    GET /api/auth/me/
    """
    profile = None
    try:
        profile = request.user.userprofile
    except:
        pass
    
    return Response({
        'user': UserSerializer(request.user).data,
        'profile': UserProfileSerializer(profile).data if profile else None
    })


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def grant_staff_access(request):
    """
    One-time secure endpoint to grant staff/superuser status to a user.
    Protected by ADMIN_SETUP_TOKEN environment variable.
    
    POST /api/auth/grant-staff/
    Body: {
        "token": "your-admin-setup-token",
        "username": "heydaddy",
        "superuser": true  // optional, defaults to false
    }
    """
    import os
    
    # Get the admin setup token from environment
    admin_token = os.getenv('ADMIN_SETUP_TOKEN', '')
    
    if not admin_token:
        return Response(
            {'error': 'ADMIN_SETUP_TOKEN not configured. Please set it in your environment variables.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    # Verify the token
    provided_token = request.data.get('token')
    if not provided_token or provided_token != admin_token:
        return Response(
            {'error': 'Invalid or missing token'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Get username and superuser flag
    username = request.data.get('username')
    make_superuser = request.data.get('superuser', False)
    
    if not username:
        return Response(
            {'error': 'username is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = User.objects.get(username=username)
        
        if user.is_staff and (not make_superuser or user.is_superuser):
            return Response({
                'message': f'User "{username}" already has staff status' + (' and superuser status' if make_superuser and user.is_superuser else ''),
                'user': {
                    'username': user.username,
                    'email': user.email,
                    'is_staff': user.is_staff,
                    'is_superuser': user.is_superuser,
                    'is_active': user.is_active
                }
            }, status=status.HTTP_200_OK)
        
        user.is_staff = True
        if make_superuser:
            user.is_superuser = True
        user.save()
        
        status_msg = 'staff and superuser' if make_superuser else 'staff'
        return Response({
            'message': f'Successfully granted {status_msg} status to user "{username}"',
            'user': {
                'username': user.username,
                'email': user.email,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
                'is_active': user.is_active
            }
        }, status=status.HTTP_200_OK)
        
    except User.DoesNotExist:
        # List available users
        users = User.objects.all()[:10]  # Limit to first 10
        return Response({
            'error': f'User "{username}" does not exist',
            'available_users': [
                {
                    'username': u.username,
                    'email': u.email,
                    'is_staff': u.is_staff,
                    'is_superuser': u.is_superuser
                } for u in users
            ]
        }, status=status.HTTP_404_NOT_FOUND)


class NewsletterViewSet(viewsets.ModelViewSet):
    """
    ViewSet for newsletter subscriptions.
    - POST /api/newsletter/ - Subscribe to newsletter
    - GET /api/newsletter/ - List subscriptions (staff only)
    """
    queryset = Newsletter.objects.all()
    serializer_class = NewsletterSerializer
    permission_classes = [permissions.AllowAny]  # Allow anyone to subscribe
    
    def get_permissions(self):
        """Only staff can view subscriptions."""
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        """Create subscription and send welcome email."""
        subscription = serializer.save()
        # Send welcome email to the subscriber
        try:
            send_newsletter_welcome_email(subscription.email)
        except Exception as e:
            # Log error but don't fail the subscription creation
            print(f"Failed to send newsletter welcome email to {subscription.email}: {e}")
        return subscription


class ContactViewSet(viewsets.ModelViewSet):
    """
    ViewSet for contact form submissions.
    - POST /api/contact/ - Submit contact form
    - GET /api/contact/ - List submissions (staff only)
    """
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [permissions.AllowAny]  # Allow anyone to submit
    
    def get_permissions(self):
        """Only staff can view submissions."""
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        """Create contact submission."""
        submission = serializer.save()
        # TODO: Send notification email
        return submission


class SiteAssetViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only ViewSet for site assets (logos, favicon).
    - GET /api/site-assets/ - Get site assets
    """
    queryset = SiteAsset.objects.all()
    serializer_class = SiteAssetSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        """Return the first site asset or empty."""
        asset = SiteAsset.objects.first()
        if asset:
            return SiteAsset.objects.filter(pk=asset.pk)
        return SiteAsset.objects.none()
