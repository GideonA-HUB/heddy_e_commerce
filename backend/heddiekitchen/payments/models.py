"""
Payments Models
"""
import uuid
from django.db import models
from django.contrib.auth.models import User


class Payment(models.Model):
    """Payment transactions."""
    STATUS_CHOICES = [('pending', 'Pending'), ('completed', 'Completed'), ('failed', 'Failed'), ('refunded', 'Refunded')]

    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default='NGN')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    gateway = models.CharField(max_length=50, default='paystack', db_column='payment_gateway')
    reference = models.CharField(max_length=200, unique=True, db_index=True, blank=True)
    gateway_response = models.JSONField(default=dict)
    order = models.OneToOneField('orders.Order', on_delete=models.CASCADE, related_name='payment', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'payments_payment'

    def save(self, *args, **kwargs):
        """Generate reference if not provided."""
        if not self.reference:
            self.reference = f"PAY_{uuid.uuid4().hex[:12].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.reference} - {self.amount} {self.currency}"


class PaystackWebhook(models.Model):
    """Log Paystack webhooks."""
    reference = models.CharField(max_length=200, db_index=True)
    event = models.CharField(max_length=100)
    status = models.CharField(max_length=50, blank=True)
    data = models.JSONField()
    processed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.event} - {self.reference}"
