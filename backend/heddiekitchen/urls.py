"""
URL Configuration for HEDDIEKITCHEN API.
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView, RedirectView
from django.views.static import serve
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from pathlib import Path

urlpatterns = [
    path('admin/', admin.site.urls),
    # Handle missing trailing slash for admin when APPEND_SLASH=False
    path('admin', RedirectView.as_view(url='/admin/', permanent=False)),
    
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
    path('api/training/', include('heddiekitchen.training.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
else:
    # In production we still need media files (uploaded via admin) available
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Serve React app for all non-API routes (SPA catch-all)
# This must be last to catch all routes not matched above
FRONTEND_BUILD_DIR = Path(__file__).resolve().parent.parent / 'frontend_dist'
if FRONTEND_BUILD_DIR.exists() and (FRONTEND_BUILD_DIR / 'index.html').exists():
    # Serve Vite assets (JS, CSS from assets folder)
    assets_dir = FRONTEND_BUILD_DIR / 'assets'
    if assets_dir.exists():
        urlpatterns += [
            re_path(r'^assets/(?P<path>.*)$', serve, {
                'document_root': assets_dir,
                'show_indexes': False,
            }),
        ]
    # Serve index.html for all other routes (React Router will handle routing)
    # Explicitly handle root path and all other paths to avoid redirect loops
    # WhiteNoise will also serve static files from STATICFILES_DIRS
    urlpatterns += [
        # Explicit root path handler
        path('', TemplateView.as_view(template_name='index.html'), name='home'),
        # Catch-all for all other non-API routes
        re_path(r'^(?!api|admin|media|static|assets).*$', TemplateView.as_view(template_name='index.html')),
    ]
