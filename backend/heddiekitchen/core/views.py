"""
Views for core app: auth, site assets, newsletter, contact.
"""
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.db import IntegrityError
from heddiekitchen.core.models import SiteAsset, UserProfile, Newsletter, Contact
from heddiekitchen.core.serializers import (
    UserSerializer, UserProfileSerializer, SiteAssetSerializer,
    NewsletterSerializer, ContactSerializer
)


class SiteAssetViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for SiteAsset model (favicon, logos).
    Read-only for public endpoints.
    """
    queryset = SiteAsset.objects.all()
    serializer_class = SiteAssetSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_context(self):
        """Add request to serializer context for URL generation."""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class UserProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for UserProfile.
    """
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Users can only see their own profile."""
        return UserProfile.objects.filter(user=self.request.user)

    def get_object(self):
        """Get current user's profile."""
        return self.request.user.profile


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
    request.user.auth_token.delete()
    return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def current_user(request):
    """
    Get current authenticated user.
    GET /api/auth/me/
    """
    return Response({
        'user': UserSerializer(request.user).data,
        'profile': UserProfileSerializer(request.user.profile, context={'request': request}).data
    })


class NewsletterViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Newsletter subscriptions.
    """
    queryset = Newsletter.objects.all()
    serializer_class = NewsletterSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names = ['post', 'delete']

    def create(self, request, *args, **kwargs):
        """Subscribe to newsletter."""
        email = request.data.get('email')
        if not email:
            return Response(
                {'error': 'email is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        newsletter, created = Newsletter.objects.get_or_create(
            email=email,
            defaults={'is_active': True}
        )
        
        if not created and not newsletter.is_active:
            newsletter.is_active = True
            newsletter.save()

        # Send welcome email asynchronously (don't block the response)
        try:
            import threading
            from heddiekitchen.core.email_utils import send_newsletter_welcome_email
            
            def send_email_async():
                try:
                    send_newsletter_welcome_email(email)
                except Exception as e:
                    print(f"Error sending newsletter welcome email: {e}")
            
            # Send email in background thread
            thread = threading.Thread(target=send_email_async)
            thread.daemon = True
            thread.start()
        except Exception as e:
            # Log error but don't fail the subscription
            print(f"Error setting up newsletter email thread: {e}")

        return Response(
            NewsletterSerializer(newsletter).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )


class ContactViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Contact form submissions.
    """
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names = ['post', 'get']

    def get_queryset(self):
        """Admin can see all, others can't view."""
        if self.request.user.is_staff:
            return Contact.objects.all()
        return Contact.objects.none()

    def create(self, request, *args, **kwargs):
        """Submit contact form."""
        return super().create(request, *args, **kwargs)
