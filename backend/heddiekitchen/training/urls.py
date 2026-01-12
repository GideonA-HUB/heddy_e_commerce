"""
URL routing for training app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TrainingPackageViewSet, TrainingEnquiryViewSet

router = DefaultRouter()
router.register(r'packages', TrainingPackageViewSet, basename='training-package')
router.register(r'enquiries', TrainingEnquiryViewSet, basename='training-enquiry')

urlpatterns = [
    path('', include(router.urls)),
]

