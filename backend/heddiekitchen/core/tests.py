"""
Tests for core app.
"""
import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from heddiekitchen.core.models import SiteAsset, Newsletter, Contact


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def test_user(db):
    return User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='testpass123'
    )


class TestAuth:
    """Test authentication endpoints."""

    def test_register_user(self, api_client):
        """Test user registration."""
        response = api_client.post('/api/auth/register/', {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'password123',
            'first_name': 'Test',
            'last_name': 'User'
        }, follow=True)
        assert response.status_code == 201
        assert 'token' in response.data

    def test_login_user(self, api_client, test_user):
        """Test user login."""
        response = api_client.post('/api/auth/login/', {
            'username': 'testuser',
            'password': 'testpass123'
        }, follow=True)
        assert response.status_code == 200
        assert 'token' in response.data

    def test_current_user(self, api_client, test_user):
        """Test get current user."""
        api_client.force_authenticate(user=test_user)
        response = api_client.get('/api/auth/me/', follow=True)
        assert response.status_code == 200
        assert response.data['user']['username'] == 'testuser'


class TestNewsletter:
    """Test newsletter endpoints."""

    def test_subscribe_newsletter(self, api_client):
        """Test newsletter subscription."""
        response = api_client.post('/api/auth/newsletter/', {
            'email': 'subscriber@example.com'
        }, follow=True)
        assert response.status_code == 201
        assert Newsletter.objects.filter(email='subscriber@example.com').exists()


class TestContact:
    """Test contact endpoints."""

    def test_submit_contact(self, api_client):
        """Test contact form submission."""
        response = api_client.post('/api/auth/contact/', {
            'name': 'John Doe',
            'email': 'john@example.com',
            'phone': '1234567890',
            'message': 'Test message'
        }, follow=True)
        assert response.status_code == 201
        assert Contact.objects.filter(email='john@example.com').exists()
