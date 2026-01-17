from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MealPlanViewSet, MealPlanSubscriptionViewSet, create_public_subscription

router = DefaultRouter()
router.register(r'plans', MealPlanViewSet, basename='mealplan')
router.register(r'subscriptions', MealPlanSubscriptionViewSet, basename='mealplan-subscription')

urlpatterns = [
    path('subscribe/', create_public_subscription, name='mealplan-public-subscribe'),
    path('', include(router.urls)),
]