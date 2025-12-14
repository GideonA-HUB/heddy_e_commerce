"""
Custom middleware for HEDDIEKITCHEN.
"""
from django.utils.deprecation import MiddlewareMixin


class CsrfExemptApiMiddleware(MiddlewareMixin):
    """
    Exempt API endpoints from CSRF checks.
    This middleware must be placed BEFORE django.middleware.csrf.CsrfViewMiddleware
    in the MIDDLEWARE list.
    """
    def process_request(self, request):
        # Exempt all /api/ endpoints from CSRF by setting the exemption flag
        if request.path.startswith('/api/'):
            setattr(request, '_dont_enforce_csrf_checks', True)
        return None

