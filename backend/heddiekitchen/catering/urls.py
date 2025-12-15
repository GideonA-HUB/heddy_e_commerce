from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CateringCategoryViewSet,
    CateringPackageViewSet,
    CateringEnquiryViewSet,
    BuffetServiceViewSet,
)

router = DefaultRouter()
router.register(r'categories', CateringCategoryViewSet, basename='catering-category')
router.register(r'packages', CateringPackageViewSet, basename='catering-package')
router.register(r'enquiries', CateringEnquiryViewSet, basename='catering-enquiry')
router.register(r'buffet-services', BuffetServiceViewSet, basename='buffet-service')

urlpatterns = [
    path('', include(router.urls)),
]