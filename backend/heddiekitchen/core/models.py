"""
Models for core functionality: SiteAssets (logos/favicons), extended User model.
"""
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import URLValidator
from django.utils.text import slugify


class SiteAsset(models.Model):
    """
    Model for managing site-wide assets: favicon, logos.
    Only superusers can edit these via Django admin.
    """
    name = models.CharField(
        max_length=50,
        default="HEDDIEKITCHEN assets",
        unique=True
    )
    favicon = models.ImageField(
        upload_to='site_assets/',
        null=True,
        blank=True,
        help_text='Favicon for browser tab (ICO or PNG, 32x32px recommended)'
    )
    logo_primary = models.ImageField(
        upload_to='site_assets/',
        null=True,
        blank=True,
        help_text='Primary logo for navbar and branding'
    )
    logo_light = models.ImageField(
        upload_to='site_assets/',
        null=True,
        blank=True,
        help_text='Light variant of logo (for dark backgrounds)'
    )
    logo_dark = models.ImageField(
        upload_to='site_assets/',
        null=True,
        blank=True,
        help_text='Dark variant of logo (for light backgrounds)'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Site Asset'
        verbose_name_plural = 'Site Assets'
        # Ensure deterministic ordering to avoid DRF UnorderedObjectListWarning during pagination
        ordering = ['-updated_at']

    def __str__(self):
        return self.name


class UserProfile(models.Model):
    """
    Extended user profile with additional fields.
    """
    ROLE_CHOICES = [
        ('customer', 'Customer'),
        ('staff', 'Staff'),
        ('chef', 'Chef'),
        ('admin', 'Admin'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True, default='Nigeria')
    zip_code = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    newsletter_subscribed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} ({self.role})"

    class Meta:
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'


class Newsletter(models.Model):
    """
    Newsletter subscription model for email capture.
    """
    email = models.EmailField(unique=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.email

    class Meta:
        verbose_name = 'Newsletter Subscription'
        verbose_name_plural = 'Newsletter Subscriptions'


class Contact(models.Model):
    """
    Contact form submissions.
    """
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Contact from {self.name} ({self.email})"

    class Meta:
        verbose_name = 'Contact Message'
        verbose_name_plural = 'Contact Messages'
        ordering = ['-created_at']
