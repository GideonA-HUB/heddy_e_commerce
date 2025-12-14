# Generated manually for adding ordering and verbose names to ShippingDestination model

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shipping', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='shippingdestination',
            options={
                'ordering': ['-is_active', 'name'],
                'verbose_name': 'Shipping Destination',
                'verbose_name_plural': 'Shipping Destinations',
            },
        ),
    ]

