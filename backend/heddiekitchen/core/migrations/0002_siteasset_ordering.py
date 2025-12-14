# Generated manually for adding ordering to SiteAsset model

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='siteasset',
            options={
                'ordering': ['-updated_at'],
                'verbose_name': 'Site Asset',
                'verbose_name_plural': 'Site Assets',
            },
        ),
    ]

