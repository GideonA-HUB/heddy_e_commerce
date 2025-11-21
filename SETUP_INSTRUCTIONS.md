# HEDDIEKITCHEN - Setup Instructions

## 🚀 Quick Setup Guide

Follow these steps **in order** to get the project running.

---

## Prerequisites

- **Python 3.8+** installed
- **Node.js 16+** and npm installed
- **PostgreSQL 12+** installed and running
- **Git** installed

---

## Step 1: Install Backend Dependencies

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Expected Output**: All packages installed successfully

---

## Step 2: Install Frontend Dependencies

```bash
cd frontend

# Install npm packages
npm install
```

**Expected Output**: `node_modules/` folder created with all dependencies

---

## Step 3: Setup PostgreSQL Database

### Option A: Using psql (Command Line)

```bash
# Connect to PostgreSQL
psql -U postgres

# Run these SQL commands:
CREATE DATABASE heddiekitchen;
CREATE USER heddiekitchen_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE heddiekitchen TO heddiekitchen_user;
\q
```

### Option B: Using pgAdmin (GUI)

1. Open pgAdmin
2. Right-click "Databases" → "Create" → "Database"
3. Name: `heddiekitchen`
4. Create user: `heddiekitchen_user` with password
5. Grant privileges

---

## Step 4: Create Environment Files

### Backend `.env` File

Create `backend/.env`:

```env
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here-change-in-production-min-50-chars
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=heddiekitchen
DB_USER=heddiekitchen_user
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=5432

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
CSRF_TRUSTED_ORIGINS=http://localhost:5173,http://localhost:3000

# Paystack (Get from https://dashboard.paystack.com/#/settings/developer)
PAYSTACK_PUBLIC_KEY=pk_test_your_key_here
PAYSTACK_SECRET_KEY=sk_test_your_key_here

# Email (Optional - uses console backend by default)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend

# Optional: S3 Storage (set to False for local storage)
USE_S3=False
```

**Important**: 
- Replace `SECRET_KEY` with a random 50+ character string
- Replace database credentials with your actual values
- Get Paystack keys from your Paystack dashboard

### Frontend `.env` File

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000/api
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_key_here
```

---

## Step 5: Run Database Migrations

```bash
cd backend

# Make sure virtual environment is activated
# Create migration files
python manage.py makemigrations

# Apply migrations to database
python manage.py migrate
```

**Expected Output**: 
- Migration files created in each app's `migrations/` folder
- Database tables created successfully

---

## Step 6: Create Superuser

```bash
cd backend

# Create admin user
python manage.py createsuperuser

# Follow prompts:
# Username: admin
# Email: admin@example.com
# Password: (enter secure password)
```

**Expected Output**: Superuser created successfully

---

## Step 7: Collect Static Files

```bash
cd backend

python manage.py collectstatic --noinput
```

**Expected Output**: Static files collected to `staticfiles/` folder

---

## Step 8: Start Backend Server

```bash
cd backend

# Make sure virtual environment is activated
python manage.py runserver
```

**Expected Output**: 
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

**Test**: Open http://localhost:8000/admin/ and login with superuser credentials

---

## Step 9: Start Frontend Server

Open a **new terminal window**:

```bash
cd frontend

npm run dev
```

**Expected Output**:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Test**: Open http://localhost:5173/ in browser

---

## Step 10: Upload Site Assets (Logo/Favicon)

1. Go to http://localhost:8000/admin/
2. Login with superuser credentials
3. Navigate to **"Site Assets"** under **"CORE"**
4. Click **"Add Site Asset"** (or edit existing)
5. Upload:
   - **Favicon**: Small icon (32x32px recommended, ICO or PNG)
   - **Logo Primary**: Main logo for navbar (PNG/SVG)
   - **Logo Light**: Light variant (optional)
   - **Logo Dark**: Dark variant (optional)
6. Click **"Save"**

**Verify**: 
- Logo appears in navbar
- Logo spinner works on page loads
- Favicon appears in browser tab

---

## Step 11: Add Test Data (Optional)

### Via Admin Panel:

1. Go to http://localhost:8000/admin/
2. Add **Menu Categories**
3. Add **Menu Items** with images
4. Add **Blog Posts**
5. Add **Meal Plans**
6. Add **Catering Packages**

### Via Django Shell:

```bash
cd backend
python manage.py shell

# Example: Create a menu category
from heddiekitchen.menu.models import MenuCategory
category = MenuCategory.objects.create(
    name="Soups",
    slug="soups",
    description="Delicious soups",
    is_active=True
)
```

---

## ✅ Verification Checklist

- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] PostgreSQL database created
- [ ] `.env` files created (backend and frontend)
- [ ] Migrations run successfully
- [ ] Superuser created
- [ ] Backend server running on http://localhost:8000
- [ ] Frontend server running on http://localhost:5173
- [ ] Admin panel accessible
- [ ] Site assets uploaded
- [ ] Logo appears in navbar
- [ ] Logo spinner works

---

## 🐛 Troubleshooting

### Issue: `pip install` fails
**Solution**: 
- Make sure Python 3.8+ is installed
- Try: `python -m pip install --upgrade pip`
- Check internet connection

### Issue: `npm install` fails
**Solution**:
- Make sure Node.js 16+ is installed
- Try: `npm cache clean --force`
- Delete `node_modules/` and `package-lock.json`, then retry

### Issue: Database connection error
**Solution**:
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Test connection: `psql -U heddiekitchen_user -d heddiekitchen`

### Issue: Migration errors
**Solution**:
- Delete all `migrations/` folders (except `__init__.py`)
- Run: `python manage.py makemigrations`
- Run: `python manage.py migrate`

### Issue: CORS errors
**Solution**:
- Check `CORS_ALLOWED_ORIGINS` in `backend/.env`
- Make sure frontend URL matches exactly
- Restart backend server

### Issue: Logo not appearing
**Solution**:
- Check SiteAsset is created in admin
- Verify logo file uploaded successfully
- Check browser console for errors
- Verify API endpoint: http://localhost:8000/api/auth/assets/

### Issue: Payment not working
**Solution**:
- Verify Paystack keys in `.env`
- Use test keys for development
- Check Paystack dashboard for webhook URL
- Test with Paystack test cards

---

## 📚 Next Steps After Setup

1. **Test All Pages**:
   - Homepage
   - Menu page
   - Cart
   - Checkout
   - All other pages

2. **Test API Endpoints**:
   - Use Postman or browser
   - Check http://localhost:8000/api/docs/

3. **Add Content**:
   - Menu items
   - Blog posts
   - Meal plans
   - Catering packages

4. **Test Payment Flow**:
   - Create test order
   - Test Paystack integration
   - Verify webhook

---

## 🎯 Success Criteria

You'll know setup is complete when:
- ✅ Both servers start without errors
- ✅ Admin panel is accessible
- ✅ Frontend loads correctly
- ✅ Logo appears in navbar
- ✅ API endpoints respond
- ✅ No console errors

---

**Last Updated**: Current  
**Status**: Ready for Setup

