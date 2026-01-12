"""
Training models for HEDDIEKITCHEN.
"""
from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal


class TrainingPackage(models.Model):
    """
    Training package model for different course offerings.
    """
    PACKAGE_TYPES = [
        ('6months', '6 Months Package'),
        ('3months', '3 Months Package'),
        ('1month', '1 Month Package'),
        ('2weeks', '2 Weeks Package'),
    ]
    
    package_type = models.CharField(max_length=20, choices=PACKAGE_TYPES, unique=True)
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    description = models.TextField()
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
        null=True,
        blank=True,
        help_text="Leave blank if price varies or contact for pricing"
    )
    
    # Package details
    is_for_beginners = models.BooleanField(default=False, help_text="For beginners")
    is_advanced = models.BooleanField(default=False, help_text="Advanced classes")
    is_upgrade = models.BooleanField(default=False, help_text="Upgrade package")
    is_housewife = models.BooleanField(default=False, help_text="House-Wife package")
    
    # Features (stored as JSON or TextField)
    features = models.JSONField(
        default=list,
        help_text="List of features/inclusions for this package"
    )
    
    # Course content
    includes_theory = models.BooleanField(default=False)
    theory_topics = models.JSONField(
        default=list,
        help_text="List of theory topics (e.g., F&B, kitchen management, costing)"
    )
    
    # Practical courses
    includes_pastries = models.BooleanField(default=False)
    includes_baking = models.BooleanField(default=False)
    includes_local_dishes = models.BooleanField(default=False)
    includes_intercontinental = models.BooleanField(default=False)
    includes_advanced_cooking = models.BooleanField(default=False)
    includes_upscale_dining = models.BooleanField(default=False)
    includes_event_catering = models.BooleanField(default=False)
    includes_management = models.BooleanField(default=False)
    includes_general_kitchen_mgmt = models.BooleanField(default=False)
    includes_popular_african_menu = models.BooleanField(default=False)
    
    # Certification
    includes_certification = models.BooleanField(default=False)
    
    # Display
    is_active = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0, help_text="Order for display (lower numbers first)")
    image = models.ImageField(upload_to='training/', null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Training Package'
        verbose_name_plural = 'Training Packages'
        ordering = ['display_order', 'package_type']
    
    def __str__(self):
        return f"{self.get_package_type_display()} - {self.title}"

