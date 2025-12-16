"""
Shipping Models
"""
from django.db import models


class ShippingDestination(models.Model):
    """
    Valid shipping destinations for both Nigeria-wide and international shipping.

    - For INTERNATIONAL (UK, Canada, USA): use base_fee + per_kg_fee * weight_kg
    - For DOMESTIC (36 states + FCT): you can use shipping_fee as a flat rate
      and/or per_kg_fee if you want weight to affect pricing.

    All fees are stored in NGN; you control FX conversion when setting the fees.
    """
    DESTINATION_TYPES = [
        ('domestic', 'Domestic (Nigeria)'),
        ('international', 'International'),
    ]

    name = models.CharField(
        max_length=100,
        help_text='Country (for international) or State (for Nigeria-wide)',
    )
    destination_type = models.CharField(max_length=20, choices=DESTINATION_TYPES)

    # Core pricing (all NGN)
    shipping_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text='Flat fee (commonly used for Nigeria-wide shipping)',
    )
    base_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text='Base fee for the destination (often used for international shipping)',
    )
    per_kg_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text='Per‑kg fee used when calculating quotes based on weight',
    )

    # Delivery & catalogue info
    estimated_days = models.IntegerField(
        help_text='Typical delivery time in days for this destination',
    )
    delivery_time_description = models.CharField(
        max_length=255,
        blank=True,
        help_text='Extra details about delivery timelines',
    )
    allowed_items = models.TextField(
        blank=True,
        help_text=(
            'List of food items you can ship to this destination. '
            'For international: dried foods, swallows, packaged foods, etc. '
            'For Nigeria-wide: items available for nationwide shipping.'
        ),
    )
    packaging_standards = models.TextField(
        blank=True,
        help_text='Packaging standards (vacuum sealing, double-bagging, etc.)',
    )
    customs_notice = models.TextField(
        blank=True,
        help_text='Customs / food safety notice for this destination',
    )

    # Nigeria‑wide pickup options
    is_pickup_available = models.BooleanField(default=False)
    pickup_location = models.CharField(max_length=255, blank=True)
    pickup_schedule = models.CharField(max_length=255, blank=True)

    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-is_active', 'name']
        verbose_name = 'Shipping Destination'
        verbose_name_plural = 'Shipping Destinations'

    def __str__(self):
        return self.name


class ShippingOrder(models.Model):
    """Food shipping orders."""
    STATUS_CHOICES = [('pending', 'Pending'), ('packed', 'Packed'), ('shipped', 'Shipped'), ('delivered', 'Delivered')]

    user = models.ForeignKey('auth.User', on_delete=models.CASCADE, null=True, blank=True)
    destination = models.ForeignKey(ShippingDestination, on_delete=models.CASCADE)
    items = models.JSONField(default=list, help_text='Food items with quantities')
    weight_kg = models.DecimalField(max_digits=8, decimal_places=2)
    total_weight_fee = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_fee = models.DecimalField(max_digits=10, decimal_places=2)
    customs_info = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    tracking_number = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Shipping to {self.destination} - {self.weight_kg}kg"
