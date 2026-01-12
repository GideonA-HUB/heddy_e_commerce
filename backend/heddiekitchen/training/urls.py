"""
URL routing for training app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TrainingPackageViewSet

router = DefaultRouter()
router.register(r'packages', TrainingPackageViewSet, basename='training-package')

urlpatterns = [
    path('', include(router.urls)),
]

