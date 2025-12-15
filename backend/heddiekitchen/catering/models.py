"""
Catering Models
"""
from django.db import models


class CateringCategory(models.Model):
    """Catering event categories."""
    CATEGORIES = [
        ('weddings', 'Weddings'),
        ('birthdays', 'Birthdays'),
        ('corporate', 'Corporate events'),
        ('house_parties', 'House parties'),
        ('traditional', 'Traditional ceremonies'),
        ('outdoor', 'Outdoor events'),
        ('buffet_services', 'Buffet services'),
        ('small_chops_cocktails', 'Small chops & cocktail setups'),
    ]

    name = models.CharField(max_length=100, choices=CATEGORIES, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class CateringPackage(models.Model):
    """Catering packages for each category."""
    TIERS = [('bronze', 'Bronze'), ('silver', 'Silver'), ('gold', 'Gold')]

    category = models.ForeignKey(CateringCategory, on_delete=models.CASCADE, related_name='packages')
    tier = models.CharField(max_length=20, choices=TIERS)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    min_guests = models.IntegerField()
    max_guests = models.IntegerField()
    price_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    price_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    price_per_head = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    menu_options = models.JSONField(default=list, blank=True, help_text="List or groups of menu options")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.tier})"


class CateringEnquiry(models.Model):
    """Catering enquiries and bookings."""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('responded', 'Responded'),
        ('booked', 'Booked'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey('auth.User', on_delete=models.CASCADE, null=True, blank=True)
    package = models.ForeignKey(CateringPackage, on_delete=models.CASCADE, related_name='enquiries')
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    event_date = models.DateField()
    number_of_guests = models.IntegerField()
    message = models.TextField(blank=True)
    tasting_session_requested = models.BooleanField(default=False)
    tasting_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Enquiry from {self.name} - {self.event_date}"


class CateringPackageImage(models.Model):
    """Gallery images for catering packages."""
    package = models.ForeignKey(CateringPackage, on_delete=models.CASCADE, related_name='gallery')
    image = models.ImageField(upload_to='catering/packages/')
    caption = models.CharField(max_length=255, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.package.title}"


class BuffetService(models.Model):
    """Dedicated buffet services under catering."""
    BUFFET_TYPES = [
        ('continental', 'Continental buffet'),
        ('african', 'African buffet'),
        ('mixed', 'Mixed cuisine buffet'),
        ('custom', 'Custom buffet'),
    ]

    buffet_type = models.CharField(max_length=20, choices=BUFFET_TYPES)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price_per_head = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    add_ons = models.JSONField(default=list, blank=True, help_text="Add-ons like servers, drinks, desserts, palm wine bar, etc.")
    setup_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.get_buffet_type_display()} - {self.title}"


class BuffetImage(models.Model):
    """Images for buffet setups."""
    buffet = models.ForeignKey(BuffetService, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='catering/buffet/')
    caption = models.CharField(max_length=255, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Buffet image - {self.buffet.title}"
