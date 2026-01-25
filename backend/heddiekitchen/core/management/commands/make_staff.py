"""
Management command to grant staff status to a user.
Usage: python manage.py make_staff <username>
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = 'Grant staff and superuser status to a user'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Username of the user to make staff')
        parser.add_argument(
            '--superuser',
            action='store_true',
            help='Also grant superuser status',
        )

    def handle(self, *args, **options):
        username = options['username']
        make_superuser = options['superuser']

        try:
            user = User.objects.get(username=username)
            
            if user.is_staff and (not make_superuser or user.is_superuser):
                self.stdout.write(
                    self.style.WARNING(
                        f'User "{username}" already has staff status'
                        + (' and superuser status' if make_superuser and user.is_superuser else '')
                    )
                )
                return

            user.is_staff = True
            if make_superuser:
                user.is_superuser = True
            user.save()

            status_msg = 'staff and superuser' if make_superuser else 'staff'
            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully granted {status_msg} status to user "{username}"'
                )
            )
            self.stdout.write(f'User can now access Django admin at /admin/')

        except User.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(f'User "{username}" does not exist')
            )
            self.stdout.write('Available users:')
            for u in User.objects.all():
                self.stdout.write(f'  - {u.username} (staff: {u.is_staff}, superuser: {u.is_superuser})')

