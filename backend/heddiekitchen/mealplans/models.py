"""
Meal Plans Models
"""
from django.db import models
from django.contrib.auth.models import User


class MealPlan(models.Model):
    """Subscription meal plans."""
    PLAN_TYPE_CHOICES = [
        ('weight_loss', 'Weight Loss'),
        ('muscle_gain', 'Muscle Gain/Bulk'),
        ('healthy_weekly', 'Healthy Weekly'),
        ('corporate_lunch', 'Corporate Lunch'),
        ('family_pack', 'Family Pack'),
    ]

    PERIOD_CHOICES = [('weekly', 'Weekly'), ('monthly', 'Monthly')]

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    plan_type = models.CharField(max_length=50, choices=PLAN_TYPE_CHOICES)
    period = models.CharField(max_length=20, choices=PERIOD_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    features = models.JSONField(default=list, help_text='List of features')
    sample_pdf = models.FileField(upload_to='meal_plans/', blank=True, null=True)
    is_customizable = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class MealPlanSubscription(models.Model):
    """Customer subscription to meal plans."""
    STATUS_CHOICES = [('active', 'Active'), ('paused', 'Paused'), ('cancelled', 'Cancelled')]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meal_subscriptions')
    meal_plan = models.ForeignKey(MealPlan, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    next_billing_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.meal_plan.title}"
