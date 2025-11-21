#!/bin/bash

# This is a setup guide - follow the steps to complete the HEDDIEKITCHEN project

# 1. Install Python dependencies
# cd backend
# python -m venv venv
# source venv/Scripts/activate  # on Windows
# pip install -r requirements.txt

# 2. Initialize database
# python manage.py makemigrations
# python manage.py migrate

# 3. Create superuser
# python manage.py createsuperuser

# 4. Load initial data (optional)
# python manage.py loaddata fixtures/initial_data.json

# 5. Collect static files
# python manage.py collectstatic --noinput

# 6. Run development server
# python manage.py runserver

# 7. Access Django Admin
# http://localhost:8000/admin/

# 8. Access API Documentation
# http://localhost:8000/api/docs/
# http://localhost:8000/api/redoc/

echo "HEDDIEKITCHEN Backend Setup Instructions:"
echo "=========================================="
echo "1. Create and activate virtual environment"
echo "2. Install dependencies: pip install -r requirements.txt"
echo "3. Run migrations: python manage.py makemigrations && python manage.py migrate"
echo "4. Create superuser: python manage.py createsuperuser"
echo "5. Run server: python manage.py runserver"
echo "6. Visit: http://localhost:8000/admin/"
