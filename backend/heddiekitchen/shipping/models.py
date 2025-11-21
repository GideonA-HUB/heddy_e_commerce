"""
Shipping Models
"""
from django.db import models


class ShippingDestination(models.Model):
    """Valid shipping destinations."""
    DESTINATION_TYPES = [('domestic', 'Domestic (Nigeria)'), ('international', 'International')]

    name = models.CharField(max_length=100)  # Country or State
    destination_type = models.CharField(max_length=20, choices=DESTINATION_TYPES)
    shipping_fee = models.DecimalField(max_digits=10, decimal_places=2)
    estimated_days = models.IntegerField()
    is_active = models.BooleanField(default=True)

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
