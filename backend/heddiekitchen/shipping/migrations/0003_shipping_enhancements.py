from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shipping', '0002_shippingdestination_ordering'),
    ]

    operations = [
        migrations.AddField(
            model_name='shippingdestination',
            name='base_fee',
            field=models.DecimalField(decimal_places=2, default=0, help_text='Base fee for the destination (often used for international shipping)', max_digits=10),
        ),
        migrations.AddField(
            model_name='shippingdestination',
            name='per_kg_fee',
            field=models.DecimalField(decimal_places=2, default=0, help_text='Per‑kg fee used when calculating quotes based on weight', max_digits=10),
        ),
        migrations.AddField(
            model_name='shippingdestination',
            name='delivery_time_description',
            field=models.CharField(blank=True, help_text='Extra details about delivery timelines', max_length=255),
        ),
        migrations.AddField(
            model_name='shippingdestination',
            name='allowed_items',
            field=models.TextField(blank=True, help_text='List of food items you can ship to this destination. For international: dried foods, swallows, packaged foods, etc. For Nigeria-wide: items available for nationwide shipping.'),
        ),
        migrations.AddField(
            model_name='shippingdestination',
            name='packaging_standards',
            field=models.TextField(blank=True, help_text='Packaging standards (vacuum sealing, double-bagging, etc.)'),
        ),
        migrations.AddField(
            model_name='shippingdestination',
            name='customs_notice',
            field=models.TextField(blank=True, help_text='Customs / food safety notice for this destination'),
        ),
        migrations.AddField(
            model_name='shippingdestination',
            name='is_pickup_available',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='shippingdestination',
            name='pickup_location',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='shippingdestination',
            name='pickup_schedule',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='shippingdestination',
            name='shipping_fee',
            field=models.DecimalField(decimal_places=2, help_text='Flat fee (commonly used for Nigeria-wide shipping)', max_digits=10),
        ),
        migrations.AlterField(
            model_name='shippingdestination',
            name='estimated_days',
            field=models.IntegerField(help_text='Typical delivery time in days for this destination'),
        ),
        migrations.AlterField(
            model_name='shippingdestination',
            name='name',
            field=models.CharField(help_text='Country (for international) or State (for Nigeria-wide)', max_length=100),
        ),
        migrations.AlterField(
            model_name='shippingdestination',
            name='destination_type',
            field=models.CharField(choices=[('domestic', 'Domestic (Nigeria)'), ('international', 'International')], max_length=20),
        ),
    ]


