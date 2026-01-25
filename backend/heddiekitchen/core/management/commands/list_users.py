"""
Management command to list all users and their staff status.
Usage: python manage.py list_users
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = 'List all users and their staff/superuser status'

    def handle(self, *args, **options):
        users = User.objects.all().order_by('username')
        
        if not users.exists():
            self.stdout.write(self.style.WARNING('No users found in database'))
            return

        self.stdout.write(self.style.SUCCESS(f'\nFound {users.count()} user(s):\n'))
        self.stdout.write(f'{"Username":<20} {"Email":<30} {"Staff":<10} {"Superuser":<10} {"Active":<10}')
        self.stdout.write('-' * 80)
        
        for user in users:
            self.stdout.write(
                f'{user.username:<20} '
                f'{user.email or "N/A":<30} '
                f'{str(user.is_staff):<10} '
                f'{str(user.is_superuser):<10} '
                f'{str(user.is_active):<10}'
            )
        
        self.stdout.write('\n')

