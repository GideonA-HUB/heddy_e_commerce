from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ShippingDestinationViewSet, ShippingOrderViewSet

router = DefaultRouter()
router.register(r'destinations', ShippingDestinationViewSet, basename='shipping-destination')
router.register(r'orders', ShippingOrderViewSet, basename='shipping-order')

urlpatterns = [
    path('', include(router.urls)),
]