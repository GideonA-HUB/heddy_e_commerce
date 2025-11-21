from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MealPlanViewSet, MealPlanSubscriptionViewSet

router = DefaultRouter()
router.register(r'plans', MealPlanViewSet, basename='mealplan')
router.register(r'subscriptions', MealPlanSubscriptionViewSet, basename='mealplan-subscription')

urlpatterns = [
    path('', include(router.urls)),
]