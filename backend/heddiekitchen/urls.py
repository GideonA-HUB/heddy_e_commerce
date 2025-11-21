"""
URL Configuration for HEDDIEKITCHEN API.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API Schema & Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    
    # API Endpoints
    path('api/auth/', include('heddiekitchen.core.urls')),
    path('api/menu/', include('heddiekitchen.menu.urls')),
    path('api/mealplans/', include('heddiekitchen.mealplans.urls')),
    path('api/orders/', include('heddiekitchen.orders.urls')),
    path('api/catering/', include('heddiekitchen.catering.urls')),
    path('api/shipping/', include('heddiekitchen.shipping.urls')),
    path('api/blog/', include('heddiekitchen.blog.urls')),
    path('api/payments/', include('heddiekitchen.payments.urls')),
    path('api/gallery/', include('heddiekitchen.gallery.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
