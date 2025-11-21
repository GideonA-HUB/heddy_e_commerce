"""
All remaining URL configurations.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

# Placeholder routes - create individual viewsets in each app
urlpatterns = []

# Mealplans URLs
urlpatterns += [path('', include('heddiekitchen.mealplans.urls')),]

# Catering URLs  
urlpatterns += [path('', include('heddiekitchen.catering.urls')),]

# Shipping URLs
urlpatterns += [path('', include('heddiekitchen.shipping.urls')),]

# Blog URLs
urlpatterns += [path('', include('heddiekitchen.blog.urls')),]

# Payments URLs
urlpatterns += [path('', include('heddiekitchen.payments.urls')),]

# Gallery URLs
urlpatterns += [path('', include('heddiekitchen.gallery.urls')),]
