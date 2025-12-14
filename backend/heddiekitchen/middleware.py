"""
Custom middleware for HEDDIEKITCHEN.
"""
from django.middleware.csrf import CsrfViewMiddleware


class CsrfExemptApiMiddleware(CsrfViewMiddleware):
    """Exempt API endpoints from CSRF checks."""
    def process_view(self, request, callback, callback_args, callback_kwargs):
        # Exempt all /api/ endpoints from CSRF
        if request.path.startswith('/api/'):
            return None
        return super().process_view(request, callback, callback_args, callback_kwargs)

