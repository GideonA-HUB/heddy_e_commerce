# HEDDIEKITCHEN Backend API

## Overview
Django REST Framework e-commerce API for African food, catering, meal plans, and shipping.

## Tech Stack
- **Framework**: Django 4.2 + Django REST Framework
- **Database**: PostgreSQL
- **API Documentation**: Swagger/Redoc (via drf-spectacular)
- **Authentication**: Token-based
- **Payment Gateway**: Paystack
- **Storage**: S3-compatible (local or cloud)

## Project Structure
```
backend/
├── heddiekitchen/          # Main Django project
│   ├── core/               # Core models (SiteAsset, User, Newsletter)
│   ├── menu/               # Menu & categories
│   ├── orders/             # Cart & orders
│   ├── mealplans/          # Meal plan subscriptions
│   ├── catering/           # Event catering
│   ├── shipping/           # Food shipping
│   ├── blog/               # Blog posts
│   ├── payments/           # Payment processing
│   ├── gallery/            # Image galleries
│   ├── settings.py         # Django settings
│   ├── urls.py             # URL routing
│   └── wsgi.py             # WSGI application
├── manage.py               # Django management
├── requirements.txt        # Python dependencies
└── README.md              # This file
```

## Setup Instructions

### Prerequisites
- Python 3.8+
- PostgreSQL 12+
- Redis (optional, for caching)

### Installation

1. **Clone and navigate to backend**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/Scripts/activate  # Windows
   source venv/bin/activate      # macOS/Linux
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser (admin)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Collect static files**
   ```bash
   python manage.py collectstatic --noinput
   ```

8. **Run development server**
   ```bash
   python manage.py runserver
   ```

## API Documentation

Once running, access documentation at:
- **Swagger UI**: `http://localhost:8000/api/docs/`
- **ReDoc**: `http://localhost:8000/api/redoc/`
- **OpenAPI Schema**: `http://localhost:8000/api/schema/`

## Environment Variables

```env
# Django
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/heddiekitchen

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Storage (S3)
USE_S3=False
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_STORAGE_BUCKET_NAME=

# Paystack
PAYSTACK_PUBLIC_KEY=your-public-key
PAYSTACK_SECRET_KEY=your-secret-key

# Email
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=

# Sentry
SENTRY_DSN=
```

## Key Models

### Core
- **SiteAsset**: Favicon, logos (editable by superusers)
- **UserProfile**: Extended user info
- **Newsletter**: Email subscriptions
- **Contact**: Contact form submissions

### Menu
- **MenuCategory**: Food categories
- **MenuItem**: Individual menu items
- **MenuItemImage**: Gallery for items
- **MenuItemReview**: Customer reviews

### Orders
- **Cart**: Shopping cart (user or session-based)
- **CartItem**: Items in cart
- **Order**: Customer orders
- **OrderItem**: Items in order

### Meal Plans
- **MealPlan**: Subscription meal plans
- **MealPlanSubscription**: Active subscriptions

### Catering
- **CateringCategory**: Event types
- **CateringPackage**: Package offerings
- **CateringEnquiry**: Booking requests

### Shipping
- **ShippingDestination**: Valid destinations
- **ShippingOrder**: Food shipping orders

### Blog
- **BlogPost**: Blog articles
- **BlogCategory**: Blog categories
- **BlogTag**: Post tags
- **BlogComment**: Comments

### Payments
- **Payment**: Transaction records
- **PaystackWebhook**: Webhook logs

### Gallery
- **GalleryCategory**: Gallery sections
- **GalleryImage**: Images in galleries

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register user
- `POST /api/auth/login/` - Login user
- `POST /api/auth/logout/` - Logout
- `GET /api/auth/me/` - Current user

### Menu
- `GET /api/menu/categories/` - List categories
- `GET /api/menu/items/` - List menu items (filterable, searchable)
- `GET /api/menu/items/{id}/` - Menu item detail
- `POST /api/menu/items/{id}/add_review/` - Add review

### Cart & Orders
- `GET /api/orders/cart/list_cart/` - Get cart
- `POST /api/orders/cart/add_item/` - Add to cart
- `PUT /api/orders/cart/update_item/` - Update cart item
- `DELETE /api/orders/cart/remove_item/` - Remove from cart
- `POST /api/orders/create_order/` - Create order
- `GET /api/orders/` - List user orders
- `GET /api/orders/{id}/tracking/` - Track order

### Newsletter
- `POST /api/auth/newsletter/` - Subscribe

### Contact
- `POST /api/auth/contact/` - Submit contact form

## Admin Panel

Access Django admin at `http://localhost:8000/admin/`

All models are registered with custom admin interfaces:
- SiteAsset (superuser only)
- UserProfile
- MenuItem with inline images
- MenuItemReview
- Order with bulk actions (mark processing, dispatched, delivered)
- Cart management
- All other models

## Testing

### Run tests
```bash
pytest
pytest --cov=heddiekitchen  # With coverage
```

### Run specific test
```bash
pytest heddiekitchen/core/tests.py::TestAuth::test_register_user
```

## Deployment

### Railway
1. Connect GitHub repository to Railway
2. Set environment variables
3. Railway auto-runs migrations via release command
4. Deploy from main branch

### Docker
```bash
docker build -t heddiekitchen-backend .
docker run -p 8000:8000 heddiekitchen-backend
```

## CI/CD Pipeline

GitHub Actions workflow:
- Lint with flake8
- Run tests with pytest
- Build Docker image
- Deploy to Railway

## Common Commands

```bash
# Database
python manage.py makemigrations [app]
python manage.py migrate
python manage.py sqlmigrate [app] [number]

# Data
python manage.py createsuperuser
python manage.py dumpdata > backup.json
python manage.py loaddata backup.json

# Development
python manage.py shell
python manage.py runserver 0.0.0.0:8000
python manage.py runserver_plus  # With debugging

# Static files
python manage.py collectstatic --noinput
python manage.py findstatic [filename]

# Debugging
python manage.py check
python manage.py inspectdb [table_name]
```

## Troubleshooting

**Database connection error**
- Check DATABASE_URL is correct
- Ensure PostgreSQL is running
- Verify credentials

**Static files not loading**
- Run `python manage.py collectstatic`
- Check STATIC_URL and STATIC_ROOT

**CORS errors**
- Verify frontend URL in CORS_ALLOWED_ORIGINS
- Check CSRF_TRUSTED_ORIGINS

**Payment webhook not working**
- Verify Paystack webhook URL in dashboard
- Check Paystack credentials in .env
- Review PaystackWebhook logs in admin

## Security Checklist

- [ ] Change SECRET_KEY in production
- [ ] Set DEBUG=False in production
- [ ] Use HTTPS only (SECURE_SSL_REDIRECT=True)
- [ ] Set SECURE_BROWSER_XSS_FILTER=True
- [ ] Configure ALLOWED_HOSTS properly
- [ ] Use strong database password
- [ ] Rotate Paystack keys regularly
- [ ] Enable Sentry for error tracking

## Support & Documentation

- Django: https://docs.djangoproject.com/
- DRF: https://www.django-rest-framework.org/
- Spectacular: https://drf-spectacular.readthedocs.io/
- Paystack: https://paystack.com/developers

---

**Version**: 1.0.0  
**Last Updated**: November 2024
