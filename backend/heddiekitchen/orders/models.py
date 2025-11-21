"""
Models for orders app (Cart, CartItem, Order, OrderItem).
"""
from django.db import models
from django.contrib.auth.models import User
from heddiekitchen.menu.models import MenuItem


class Cart(models.Model):
    """Shopping cart for each user."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart', null=True, blank=True)
    session_id = models.CharField(max_length=200, unique=True, null=True, blank=True, help_text='For anonymous users')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        if self.user:
            return f"Cart for {self.user.username}"
        return f"Cart {self.session_id}"

    def get_total(self):
        """Calculate total cart value."""
        return sum(item.get_subtotal() for item in self.items.all())

    def get_item_count(self):
        """Get total number of items in cart."""
        return sum(item.quantity for item in self.items.all())


class CartItem(models.Model):
    """Items in shopping cart."""
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    price_at_add = models.DecimalField(max_digits=10, decimal_places=2, help_text='Price when added to cart')
    special_instructions = models.TextField(blank=True, help_text='e.g., "No spicy", "Extra sauce"')
    added_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.menu_item.name} x{self.quantity}"

    def get_subtotal(self):
        """Calculate subtotal for this item."""
        return self.price_at_add * self.quantity

    class Meta:
        unique_together = ['cart', 'menu_item']


class Order(models.Model):
    """Customer orders."""
    ORDER_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('payment_pending', 'Payment Pending'),
        ('paid', 'Paid'),
        ('processing', 'Processing'),
        ('ready_for_pickup', 'Ready for Pickup'),
        ('dispatched', 'Dispatched'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    ORDER_TYPE_CHOICES = [
        ('single', 'Single Order'),
        ('subscription', 'Meal Plan Subscription'),
        ('catering', 'Catering'),
        ('shipping', 'Shipping'),
    ]

    # User & Basic Info
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders', null=True, blank=True)
    guest_email = models.EmailField(blank=True, help_text='For guest checkout')
    order_number = models.CharField(max_length=50, unique=True, db_index=True)
    order_type = models.CharField(max_length=20, choices=ORDER_TYPE_CHOICES, default='single')
    status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default='pending')

    # Totals
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    shipping_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2)

    # Shipping Info
    shipping_name = models.CharField(max_length=200)
    shipping_email = models.EmailField()
    shipping_phone = models.CharField(max_length=20)
    shipping_address = models.TextField()
    shipping_city = models.CharField(max_length=100)
    shipping_state = models.CharField(max_length=100)
    shipping_country = models.CharField(max_length=100, default='Nigeria')
    shipping_zip = models.CharField(max_length=20, blank=True)
    delivery_date = models.DateField(null=True, blank=True)
    special_instructions = models.TextField(blank=True)

    # Payment
    payment_method = models.CharField(max_length=50, default='paystack', help_text='e.g., paystack, transfer, cash')
    payment_status = models.CharField(max_length=20, default='pending', choices=[
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ])
    payment_reference = models.CharField(max_length=200, blank=True, db_index=True)
    paid_at = models.DateTimeField(null=True, blank=True)

    # Tracking
    tracking_number = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True, help_text='Internal notes for staff')

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['order_number']),
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['payment_reference']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"Order {self.order_number}"

    def save(self, *args, **kwargs):
        if not self.order_number:
            import uuid
            self.order_number = f"ORD-{int(timezone.now().timestamp())}-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)


class OrderItem(models.Model):
    """Items in an order."""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    menu_item = models.ForeignKey(MenuItem, on_delete=models.SET_NULL, null=True, blank=True)
    item_name = models.CharField(max_length=200, help_text='Store name in case menu item is deleted')
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    special_instructions = models.TextField(blank=True)

    def __str__(self):
        return f"{self.item_name} (Order {self.order.order_number})"

    def save(self, *args, **kwargs):
        if not self.item_name and self.menu_item:
            self.item_name = self.menu_item.name
        if not self.subtotal:
            self.subtotal = self.unit_price * self.quantity
        super().save(*args, **kwargs)


# Import timezone for default order_number generation
from django.utils import timezone
