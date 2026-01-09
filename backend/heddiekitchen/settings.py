"""
Django settings for HEDDIEKITCHEN e-commerce platform.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Optional Sentry import (only if package is installed)
try:
    import sentry_sdk
    from sentry_sdk.integrations.django import DjangoIntegration
    SENTRY_AVAILABLE = True
except ImportError:
    SENTRY_AVAILABLE = False

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# Frontend build directory (for serving React app)
FRONTEND_BUILD_DIR = BASE_DIR / 'frontend_dist'

SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-dev-key-change-in-production')

DEBUG = os.getenv('DEBUG', 'True') == 'True'

# Allow custom domain (heddiekitchen.com) and Railway domains
ALLOWED_HOSTS = os.getenv(
    'ALLOWED_HOSTS',
    'localhost,127.0.0.1,heddiekitchen.com,www.heddiekitchen.com,heddyecommerce-production.up.railway.app,*.railway.app'
).split(',')

# CORS Configuration
CORS_ALLOWED_ORIGINS = os.getenv(
    'CORS_ALLOWED_ORIGINS',
    'http://localhost:3000,http://localhost:5173'
).split(',')
CSRF_TRUSTED_ORIGINS = os.getenv(
    'CSRF_TRUSTED_ORIGINS',
    'http://localhost:3000,http://localhost:5173'
).split(',')

# Application definition
INSTALLED_APPS = [
    # Django
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'drf_spectacular',
    'django_filters',
    'storages',
    
    # Local apps
    'heddiekitchen.core',
    'heddiekitchen.menu',
    'heddiekitchen.mealplans',
    'heddiekitchen.orders',
    'heddiekitchen.catering',
    'heddiekitchen.shipping',
    'heddiekitchen.blog',
    'heddiekitchen.payments',
    'heddiekitchen.gallery',
]

# Conditionally add Cloudinary apps only if available and enabled
try:
    import cloudinary
    import cloudinary_storage
    if os.getenv('USE_CLOUDINARY', 'False').lower() == 'true':
        INSTALLED_APPS.insert(6, 'cloudinary_storage')
        INSTALLED_APPS.insert(6, 'cloudinary')
except ImportError:
    # Cloudinary not installed, skip adding to INSTALLED_APPS
    pass

# Conditionally enable django_ratelimit only when shared cache is available
USE_REDIS_CACHE = os.getenv('USE_REDIS_CACHE', os.getenv('USE_REDIS', 'False')).strip().lower() == 'true'
if USE_REDIS_CACHE:
    INSTALLED_APPS.append('django_ratelimit')

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'heddiekitchen.middleware.CsrfExemptApiMiddleware',  # Custom middleware that exempts /api/ endpoints from CSRF
    'django.middleware.csrf.CsrfViewMiddleware',  # Standard CSRF middleware (runs after our exemption middleware)
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Disable APPEND_SLASH for SPA routes to prevent redirect loops
# This allows React Router to handle client-side routing properly
APPEND_SLASH = False

ROOT_URLCONF = 'heddiekitchen.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            BASE_DIR / 'templates',
            FRONTEND_BUILD_DIR,  # React build directory for index.html
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'heddiekitchen.wsgi.application'

# Database
if 'DATABASE_URL' in os.environ:
    import dj_database_url
    DATABASES = {
        'default': dj_database_url.config(
            default=os.getenv('DATABASE_URL'),
            conn_max_age=600
        )
    }
elif os.getenv('USE_SQLITE', 'False') == 'True' or not os.getenv('DB_NAME'):
    # Use SQLite for development if explicitly set or if DB_NAME not provided
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
else:
    # Use PostgreSQL if DB_NAME is provided
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv('DB_NAME', 'heddiekitchen'),
            'USER': os.getenv('DB_USER', 'postgres'),
            'PASSWORD': os.getenv('DB_PASSWORD', ''),
            'HOST': os.getenv('DB_HOST', 'localhost'),
            'PORT': os.getenv('DB_PORT', '5432'),
        }
    }

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Frontend static files (React build)
STATICFILES_DIRS = []
if FRONTEND_BUILD_DIR.exists():
    STATICFILES_DIRS.append(FRONTEND_BUILD_DIR)

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media files
MEDIA_URL = '/media/'
# Allow overriding MEDIA_ROOT via env (useful to mount a Railway volume)
MEDIA_ROOT = Path(os.getenv('MEDIA_ROOT', BASE_DIR / 'media'))

# Optional: Cloudinary for media storage (set USE_CLOUDINARY=True)
USE_CLOUDINARY = os.getenv('USE_CLOUDINARY', 'False').lower() == 'true'
if USE_CLOUDINARY:
    import cloudinary
    import cloudinary.uploader
    import cloudinary.api
    
    # Support both CLOUDINARY_URL or individual variables
    CLOUDINARY_URL = os.getenv('CLOUDINARY_URL')
    CLOUDINARY_CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME')
    CLOUDINARY_API_KEY = os.getenv('CLOUDINARY_API_KEY')
    CLOUDINARY_API_SECRET = os.getenv('CLOUDINARY_API_SECRET')
    
    # If CLOUDINARY_URL is provided, use it; otherwise use individual vars
    if CLOUDINARY_URL:
        cloudinary.config(
            cloudinary_url=CLOUDINARY_URL
        )
    elif CLOUDINARY_CLOUD_NAME and CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET:
        cloudinary.config(
            cloud_name=CLOUDINARY_CLOUD_NAME,
            api_key=CLOUDINARY_API_KEY,
            api_secret=CLOUDINARY_API_SECRET
        )
    else:
        raise ValueError(
            "When USE_CLOUDINARY=True, either set CLOUDINARY_URL or set all of: "
            "CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET"
        )
    
    # django-cloudinary-storage uses DEFAULT_FILE_STORAGE for media
    DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
    # Cloudinary serves media from their CDN, not /media/ path
    # But we keep MEDIA_URL for compatibility
    MEDIA_URL = os.getenv('MEDIA_URL', '/media/')

# S3 Storage Configuration (Optional)
if os.getenv('USE_S3') == 'True':
    AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
    AWS_STORAGE_BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET_NAME')
    AWS_S3_REGION_NAME = os.getenv('AWS_S3_REGION_NAME', 'us-east-1')
    AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'
    STATIC_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/static/'
    DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REST Framework Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour'
    }
}

# Spectacular (OpenAPI/Swagger/Redoc) Configuration
SPECTACULAR_SETTINGS = {
    'TITLE': 'HEDDIEKITCHEN API',
    'DESCRIPTION': 'E-commerce platform for African food, catering, and meal plans',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'SWAGGER_UI_SETTINGS': {
        'deepLinking': True,
    },
}

# Email Configuration
# Using Resend API instead of SMTP to avoid Railway network restrictions
# With verified custom domain (heddiekitchen.com), Resend works perfectly
RESEND_API_KEY = os.getenv('RESEND_API_KEY', os.getenv('EMAIL_HOST_PASSWORD', ''))  # Fallback to EMAIL_HOST_PASSWORD if RESEND_API_KEY not set

# Legacy SMTP settings (kept for backward compatibility, but not used)
EMAIL_BACKEND = os.getenv(
    'EMAIL_BACKEND',
    'django.core.mail.backends.console.EmailBackend' if DEBUG else 'django.core.mail.backends.smtp.EmailBackend'
)
EMAIL_HOST = os.getenv('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', 587))
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'True') == 'True'
EMAIL_USE_SSL = os.getenv('EMAIL_USE_SSL', 'False') == 'True'
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', EMAIL_HOST_USER or 'heddiekitchen@gmail.com')
FRONTEND_URL = os.getenv('FRONTEND_URL', 'https://heddyecommerce-production.up.railway.app')

# Email timeout settings (prevent hanging)
EMAIL_TIMEOUT = 10  # 10 seconds timeout for email operations

# Paystack Configuration
PAYSTACK_PUBLIC_KEY = os.getenv('PAYSTACK_PUBLIC_KEY', '')
PAYSTACK_SECRET_KEY = os.getenv('PAYSTACK_SECRET_KEY', '')

# Redis / Cache Configuration
REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')

if USE_REDIS_CACHE:
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.redis.RedisCache',
            'LOCATION': REDIS_URL,
        }
    }
else:
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
            'LOCATION': 'heddiekitchen-cache',
        }
    }

# Django Ratelimit configuration – disable when no shared cache available
RATELIMIT_ENABLE = USE_REDIS_CACHE

# Celery Configuration
CELERY_BROKER_URL = REDIS_URL
CELERY_RESULT_BACKEND = REDIS_URL
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'UTC'

# Security Settings (Production)
if not DEBUG:
    # Railway terminates TLS at the edge; respect X-Forwarded-Proto to avoid redirect loops
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    USE_X_FORWARDED_HOST = True

    SECURE_SSL_REDIRECT = os.getenv('SECURE_SSL_REDIRECT', 'True') == 'True'
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_SECURITY_POLICY = {
        'default-src': ("'self'",),
        'script-src': ("'self'", "'unsafe-inline'", "cdn.jsdelivr.net"),
        'style-src': ("'self'", "'unsafe-inline'"),
        'img-src': ("'self'", "data:", "https:"),
    }

# Sentry Configuration (Error tracking)
if SENTRY_AVAILABLE and os.getenv('SENTRY_DSN'):
    sentry_sdk.init(
        dsn=os.getenv('SENTRY_DSN'),
        integrations=[DjangoIntegration()],
        traces_sample_rate=0.1,
        send_default_pii=False
    )

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}
