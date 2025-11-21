"""
Models for menu app.
"""
from django.db import models
from django.utils.text import slugify


class MenuCategory(models.Model):
    """Menu item categories (Soups, Proteins, Rice meals, etc.)."""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    icon = models.ImageField(upload_to='categories/', null=True, blank=True)
    display_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Menu Categories'
        ordering = ['display_order', 'name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class MenuItem(models.Model):
    """Menu items available for purchase."""
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(MenuCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='items')
    categories = models.ManyToManyField(MenuCategory, related_name='menu_items', blank=True)
    image = models.ImageField(upload_to='menu_items/')
    prep_time_minutes = models.IntegerField(default=30, help_text='Preparation time in minutes')
    servings = models.IntegerField(default=1, help_text='Number of servings')
    is_available = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    stock_quantity = models.IntegerField(default=0, help_text='Available quantity (0 = unlimited)')
    calories = models.IntegerField(null=True, blank=True)
    ingredients = models.TextField(blank=True, help_text='Comma-separated ingredients')
    allergens = models.TextField(blank=True, help_text='Comma-separated allergens')
    nutritional_info = models.JSONField(null=True, blank=True, help_text='Nutritional info as JSON')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_featured', '-created_at']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class MenuItemImage(models.Model):
    """Gallery of images for menu items."""
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='menu_items/gallery/')
    alt_text = models.CharField(max_length=200, blank=True)
    display_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['display_order']

    def __str__(self):
        return f"Image for {self.menu_item.name}"


class MenuItemReview(models.Model):
    """Customer reviews for menu items."""
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])  # 1-5 stars
    title = models.CharField(max_length=200)
    comment = models.TextField()
    is_verified_purchase = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['menu_item', 'user']

    def __str__(self):
        return f"{self.menu_item.name} - {self.rating} stars by {self.user.username}"
