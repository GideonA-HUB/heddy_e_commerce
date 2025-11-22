# Docker configuration for HEDDIEKITCHEN (Backend + Frontend)

# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm ci

# Copy frontend source
COPY frontend/ ./

# Build frontend (VITE_API_URL will be set at runtime, but we build with placeholder)
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: Backend + Frontend
FROM python:3.11-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend project
COPY backend/ .

# Copy built frontend from builder stage
COPY --from=frontend-builder /app/frontend/dist ./frontend_dist

# Collect static files
RUN python manage.py collectstatic --noinput

# Run migrations and start server
# Railway sets PORT env var, but we default to 8000 for Docker
CMD sh -c "python manage.py migrate && gunicorn heddiekitchen.wsgi:application --bind 0.0.0.0:${PORT:-8000}"
