# HEDDIEKITCHEN

🍽️ **African Mobile Kitchen E-Commerce Platform**

A complete, scalable e-commerce solution for food delivery, meal planning, event catering, and international food shipping. Built with React + Vite frontend, Django + DRF backend, and PostgreSQL database.

---

## 📋 Quick Start

### Prerequisites
- **Backend**: Python 3.8+, PostgreSQL 12+, Redis (optional)
- **Frontend**: Node.js 16+, npm/yarn
- **Deployment**: Railway account (or similar PaaS)

### Quick Setup

**1. Clone & Navigate**
```bash
git clone https://github.com/yourusername/heddiekitchen.git
cd heddiekitchen
```

**2. Backend Setup**
```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # Windows
source venv/bin/activate      # macOS/Linux

pip install -r requirements.txt
cp .env.example .env          # Edit .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

**3. Frontend Setup** (in new terminal)
```bash
cd frontend
npm install
npm run dev
```

**4. Access**
- Frontend: http://localhost:5173
- API Docs: http://localhost:8000/api/docs/
- Admin: http://localhost:8000/admin/

---

## 🏗️ Architecture

### Backend (Django + DRF)
- **REST API** with OpenAPI/Swagger docs
- **9 Django Apps**: core, menu, orders, mealplans, catering, shipping, blog, payments, gallery
- **Models**: User, MenuItem, Order, MealPlan, CateringPackage, ShippingOrder, BlogPost, Payment
- **Authentication**: Token-based (REST API)
- **Payments**: Paystack integration with webhooks
- **Admin Dashboard**: Full Django admin with custom interfaces

### Frontend (React + Vite)
- **Components**: Reusable UI (Navbar, Card, Loader, Footer, Skeleton, etc.)
- **Pages**: Menu, Cart, Checkout, Blog, Catering, Shipping, Profile
- **State**: Zustand stores (auth, cart, ui)
- **Styling**: TailwindCSS (mobile-first, responsive)
- **Performance**: Code-splitting, lazy loading, image optimization

### Database (PostgreSQL)
- Relational data model
- Indexed queries for performance
- Cascading deletes for data integrity

---

## 📁 Project Structure

```
heddiekitchen/
├── backend/                          # Django project
│   ├── heddiekitchen/               # Main Django package
│   │   ├── settings.py              # Configuration
│   │   ├── urls.py                  # URL routing
│   │   ├── core/                    # Core app (auth, SiteAsset)
│   │   ├── menu/                    # Menu items
│   │   ├── orders/                  # Shopping cart & orders
│   │   ├── mealplans/               # Meal subscriptions
│   │   ├── catering/                # Event catering
│   │   ├── shipping/                # Food shipping
│   │   ├── blog/                    # Blog posts
│   │   ├── payments/                # Payment handling
│   │   └── gallery/                 # Image galleries
│   ├── manage.py                    # Django CLI
│   ├── requirements.txt             # Python dependencies
│   ├── Dockerfile                   # Docker image
│   ├── docker-compose.yml           # Local dev stack
│   └── README.md                    # Backend docs
│
├── frontend/                         # React + Vite app
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   ├── pages/                   # Page components
│   │   ├── stores/                  # Zustand stores
│   │   ├── api/                     # API client & services
│   │   ├── types/                   # TypeScript interfaces
│   │   ├── hooks/                   # Custom hooks
│   │   ├── utils/                   # Utilities
│   │   ├── App.tsx                  # Root component
│   │   ├── main.tsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── index.html                   # HTML template
│   ├── package.json                 # npm dependencies
│   ├── vite.config.ts               # Vite config
│   ├── tsconfig.json                # TypeScript config
│   └── README.md                    # Frontend docs
│
├── .github/
│   ├── workflows/
│   │   ├── backend.yml              # Backend CI/CD
│   │   └── frontend.yml             # Frontend CI/CD
│   └── copilot-instructions.md
│
├── README.md                         # This file
└── .gitignore
```

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | React 18, Vite, TypeScript, TailwindCSS, Zustand |
| **Backend** | Django 4.2, DRF, PostgreSQL, Gunicorn |
| **APIs** | RESTful, OpenAPI/Swagger, Redoc |
| **Auth** | Token-based (DRF Token) |
| **Payments** | Paystack + Webhooks |
| **Storage** | S3-compatible (local or AWS) |
| **Deployment** | Railway, Docker, GitHub Actions |
| **Monitoring** | Sentry (error tracking) |
| **Documentation** | ReDoc, Swagger UI |

---

## 📚 Key Features

### 1. **Menu & Ordering**
- Browse menu items with filters/search
- Product galleries, reviews, ratings
- Add to cart, persistent cart (localStorage)
- Checkout with shipping info validation

### 2. **Meal Plans**
- Pre-defined subscription plans (weight loss, muscle gain, etc.)
- Weekly/monthly billing
- Sample PDFs, customization options
- Auto-recurring orders with Paystack

### 3. **Event Catering**
- Catering packages (Bronze/Silver/Gold tiers)
- Categories: Weddings, Birthdays, Corporate, etc.
- Guest capacity & menu options
- Enquiry forms with file uploads

### 4. **Food Shipping**
- **Domestic** (Nigeria): State-based shipping
- **International**: Weight-based pricing, countries list
- Customs compliance info
- Real-time shipping quotes

### 5. **Blog & Gallery**
- Blog posts with categories, tags, SEO metadata
- Image galleries (events, food, team)
- Comment system
- RSS feeds

### 6. **Admin Dashboard**
- Django admin with custom interfaces
- **SiteAsset model**: Upload favicon, logo_primary, logo_light, logo_dark
- Logo spinner uses admin-uploaded logo
- Full order management with bulk actions
- Staff can manage all content

### 7. **Payments**
- Paystack integration (cards, transfers, USSD)
- Webhook handling for payment status
- Invoice generation
- Payment history

### 8. **Loading States**
- **Logo Spinner**: Animated HEDDIEKITCHEN logo during data loads
- **Skeleton Screens**: Placeholder content while loading
- **Progress Indicators**: For multi-step processes

---

## 🚀 Deployment

### Railway
1. Connect GitHub repo to Railway
2. Set environment variables (DATABASE_URL, PAYSTACK keys, etc.)
3. Railway auto-runs migrations on deploy
4. Frontend deploys to Vercel/Railway with `npm run build`

### Docker
```bash
cd backend
docker-compose up -d
```

### CI/CD Pipeline
GitHub Actions:
- Linting (flake8, ESLint)
- Tests (pytest, Jest)
- Build & deploy to Railway on main branch

---

## 🔐 Security

- ✅ HTTPS-only in production
- ✅ CSRF protection
- ✅ Secure file uploads (S3)
- ✅ Rate limiting on API endpoints
- ✅ Input validation & sanitization
- ✅ SQL injection prevention (Django ORM)
- ✅ XSS protection (React escaping)
- ✅ CORS properly configured
- ✅ Secrets in environment variables

---

## 📊 Database Schema Highlights

### Core Models
- **User**: Django User + extended UserProfile
- **SiteAsset**: Favicon, logos (superuser-editable)
- **Newsletter**: Email subscriptions
- **Contact**: Contact form submissions

### Commerce
- **Cart** ↔ **CartItem**: Shopping carts
- **Order** ↔ **OrderItem**: Customer orders
- **Payment**: Payment transactions + Paystack webhooks
- **MealPlan** ↔ **MealPlanSubscription**: Subscriptions
- **CateringPackage** ↔ **CateringEnquiry**: Event catering

### Content
- **MenuItem** ↔ **MenuItemImage** ↔ **MenuItemReview**
- **BlogPost**: Articles with categories, tags, SEO
- **GalleryImage**: Photos organized by category

---

## 📖 API Endpoints

### Auth
- `POST /api/auth/register/` - Register
- `POST /api/auth/login/` - Login
- `POST /api/auth/logout/` - Logout
- `GET /api/auth/me/` - Current user

### Menu
- `GET /api/menu/categories/` - Categories
- `GET /api/menu/items/` - Menu items (filterable, paginated)
- `GET /api/menu/items/{id}/` - Menu item detail
- `POST /api/menu/items/{id}/add_review/` - Add review

### Cart & Orders
- `GET /api/orders/cart/list_cart/` - Get cart
- `POST /api/orders/cart/add_item/` - Add to cart
- `POST /api/orders/create_order/` - Create order
- `GET /api/orders/` - User orders
- `GET /api/orders/{id}/tracking/` - Track order

### Payments
- `POST /api/payments/webhook/` - Paystack webhook (auto-verify)
- `GET /api/payments/` - Payment history

### Blog
- `GET /api/blog/` - Blog posts (filterable)
- `GET /api/blog/{slug}/` - Blog detail

### Newsletter
- `POST /api/auth/newsletter/` - Subscribe

Full API docs at: `/api/docs/` (Swagger) or `/api/redoc/` (ReDoc)

---

## 🧪 Testing

### Backend
```bash
cd backend
pytest                        # Run all tests
pytest --cov                 # With coverage
pytest heddiekitchen/core/   # Specific app
```

### Frontend
```bash
cd frontend
npm run test                 # Run tests
npm run test:coverage       # With coverage
```

---

## 🎨 Customization

### Theme Colors
Edit `frontend/src/index.css`:
```css
:root {
  --primary: #ff6b35;     /* Orange */
  --secondary: #004e89;   /* Blue */
  --accent: #f7931e;      /* Gold */
}
```

### Site Assets (Logo/Favicon)
1. Go to Django admin: `/admin/`
2. Navigate to "Site Assets"
3. Upload favicon, logo_primary, logo_light, logo_dark
4. Frontend loads and uses in:
   - Navbar
   - Logo Spinner during data loads
   - Browser tab (favicon)

### Email Templates
Edit in `backend/heddiekitchen/templates/` and configure SMTP in `.env`

---

## 📱 Mobile Responsiveness

All pages are mobile-first and fully responsive:
- **Mobile** (< 768px): Hamburger menu, single column layouts
- **Tablet** (768px - 1024px): 2-column grids
- **Desktop** (> 1024px): 3-column grids, full features

Test with Chrome DevTools or actual devices.

---

## ♿ Accessibility

- ✅ Semantic HTML (header, nav, main, footer, article)
- ✅ ARIA labels for icons & interactive elements
- ✅ Keyboard navigation support
- ✅ Color contrast >= 4.5:1 (WCAG AA)
- ✅ Alt text on all images
- ✅ Form labels linked to inputs
- ✅ Focus indicators on interactive elements

Target: **WCAG 2.1 AA baseline**

---

## 🔍 SEO

- ✅ Meta tags (title, description, keywords)
- ✅ Open Graph tags (social sharing)
- ✅ Semantic HTML markup
- ✅ Sitemap.xml auto-generation (blog)
- ✅ RSS feeds
- ✅ Canonical URLs
- ✅ Mobile-friendly design
- ✅ Fast load times (Lighthouse > 90)

---

## 📝 Environment Variables

### Backend `.env`
```env
DEBUG=False
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:pass@host:5432/db
CORS_ALLOWED_ORIGINS=https://yourdomain.com
PAYSTACK_PUBLIC_KEY=...
PAYSTACK_SECRET_KEY=...
SENTRY_DSN=...
```

### Frontend `.env`
```env
VITE_API_URL=https://api.yourdomain.com/api
VITE_PAYSTACK_PUBLIC_KEY=...
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Django migration error** | Delete `db.sqlite3`, re-run migrations |
| **CORS error** | Add frontend URL to `CORS_ALLOWED_ORIGINS` in backend |
| **Vite not finding modules** | Run `npm install`, check Node version |
| **Paystack webhook not working** | Verify webhook URL in Paystack dashboard, check firewall |
| **Image upload fails** | Check `MEDIA_ROOT` permissions, S3 credentials |
| **Frontend can't reach API** | Check `VITE_API_URL`, backend is running, network proxy |

---

## 📞 Support

- **API Docs**: http://localhost:8000/api/docs/
- **Admin**: http://localhost:8000/admin/
- **Issues**: GitHub Issues tab
- **Discussions**: GitHub Discussions

---

## 📜 License

[Add your license]

---

## 👥 Contributors

- [Your Name] - Project Lead
- [Team Members]

---

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Advanced analytics
- [ ] AI-powered recommendations
- [ ] Multi-language support
- [ ] Advanced scheduling
- [ ] Loyalty program
- [ ] Integration with food delivery partners (Uber Eats, etc.)

---

**Last Updated**: November 2024  
**Version**: 1.0.0  
**Status**: 🚀 Production Ready
