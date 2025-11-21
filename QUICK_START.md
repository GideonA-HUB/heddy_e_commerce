# 🚀 HEDDIEKITCHEN - Quick Start Guide

## ⚡ Get Running in 5 Minutes

### Step 1: Install Dependencies

```bash
# Frontend dependencies
cd frontend
npm install

# Backend dependencies  
cd ../backend
python -m venv venv
source venv/Scripts/activate  # Windows
source venv/bin/activate      # macOS/Linux
pip install -r requirements.txt
```

### Step 2: Setup Database

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser  # Create admin user
```

### Step 3: Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
python manage.py runserver
# Runs on http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

### Step 4: Access the App

- **Frontend**: http://localhost:5173
- **API Docs**: http://localhost:8000/api/docs/
- **Admin Panel**: http://localhost:8000/admin/

---

## 🧪 Quick Testing

### Test Backend APIs

```bash
# Using curl or Postman
curl http://localhost:8000/api/menu/items/

# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'
```

### Test Frontend

1. Open http://localhost:5173
2. Click "Order Now" to go to menu
3. Browse items and add to cart
4. Proceed to checkout

---

## 📋 Common Commands

```bash
# Backend
python manage.py createsuperuser      # Create admin
python manage.py makemigrations       # Create migrations
python manage.py migrate              # Apply migrations
python manage.py collectstatic        # Collect static files
pytest                                # Run tests

# Frontend
npm run dev                           # Start dev server
npm run build                         # Build for production
npm run preview                       # Preview build
npm run lint                          # Check for errors
```

---

## 🐳 Using Docker (Optional)

```bash
cd backend
docker-compose up -d          # Start all services
docker-compose down           # Stop services
docker-compose logs -f        # View logs
```

---

## 🔑 Environment Variables

Create `.env` file in `backend/` with:

```env
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/heddiekitchen
PAYSTACK_PUBLIC_KEY=your_paystack_public_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

Create `.env` file in `frontend/` with:

```env
VITE_API_URL=http://localhost:8000/api
VITE_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
```

---

## 🛠️ Development Workflow

1. **Make backend changes** → Changes auto-reload on http://localhost:8000
2. **Make frontend changes** → HMR (Hot Module Reload) auto-updates on http://localhost:5173
3. **Add new models** → Run `python manage.py makemigrations && migrate`
4. **Run tests** → `pytest` (backend) or `npm test` (frontend)

---

## 📚 Project Structure

```
heddiekitchen/
├── backend/               # Django REST API
│   ├── heddiekitchen/    # Main Django package
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
└── frontend/             # React + Vite app
    ├── src/
    ├── package.json
    └── vite.config.ts
```

---

## ❓ Troubleshooting

**"Cannot find module" errors on frontend:**
```bash
npm install  # Make sure node_modules exists
```

**Database connection error:**
```bash
# Check PostgreSQL is running
psql -U postgres  # Test connection
```

**Port already in use:**
```bash
python manage.py runserver 8001  # Use different port
npm run dev -- --port 5174       # Use different port
```

**Module not found on backend:**
```bash
pip install -r requirements.txt  # Reinstall packages
```

---

## 📖 Next Steps

1. ✅ Start the servers (see above)
2. ✅ Test the admin panel: http://localhost:8000/admin/
3. ✅ Add some menu items via admin
4. ✅ Test frontend menu page
5. ✅ Try adding items to cart
6. Read `PROGRESS.md` for what's next

---

## 🎯 Quick Links

- **API Docs**: http://localhost:8000/api/docs/
- **Admin Panel**: http://localhost:8000/admin/
- **Frontend**: http://localhost:5173
- **Database**: Check `backend/.env` for DATABASE_URL
- **Backend README**: `backend/README.md`
- **Frontend README**: `frontend/README.md`
- **Progress Report**: `PROGRESS.md`

---

## 💡 Tips

- Use **admin panel** to manage content (menu items, catering packages, blog posts)
- **Django signals** automatically create user profiles on registration
- **Zustand stores** persist to localStorage automatically
- **API token** expires after 24 hours (configure in settings.py)
- **Search/filtering** works on menu, blog, and all list endpoints

---

**Ready to build? Start with Step 1 above! 🚀**
