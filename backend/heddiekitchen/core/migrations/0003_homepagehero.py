# Generated manually for HomepageHero

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_siteasset_ordering'),
    ]

    operations = [
        migrations.CreateModel(
            name='HomepageHero',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('eyebrow', models.CharField(default='Authentic African Cuisine', help_text='Small label above the headline', max_length=120)),
                ('headline', models.CharField(default='Delicious food, delivered fresh', max_length=200)),
                ('description', models.TextField(default='Premium ingredients. Chef-crafted dishes. Order for tonight or plan the week with HEDDIEKITCHEN.')),
                ('cta_primary_text', models.CharField(default='Order Now', max_length=80)),
                ('cta_primary_link', models.CharField(default='/menu', max_length=200)),
                ('cta_secondary_text', models.CharField(blank=True, default='View Menu', max_length=80)),
                ('cta_secondary_link', models.CharField(blank=True, default='/menu', max_length=200)),
                ('gallery_image_1', models.ImageField(blank=True, help_text='Hero gallery image 1 (top-right cell)', null=True, upload_to='hero/')),
                ('gallery_image_2', models.ImageField(blank=True, help_text='Hero gallery image 2 (mid-left cell)', null=True, upload_to='hero/')),
                ('gallery_image_3', models.ImageField(blank=True, help_text='Hero gallery image 3 (bottom-left cell)', null=True, upload_to='hero/')),
                ('gallery_image_4', models.ImageField(blank=True, help_text='Hero gallery image 4 (mid-right cell)', null=True, upload_to='hero/')),
                ('gallery_alt_1', models.CharField(blank=True, default='Signature dish', max_length=120)),
                ('gallery_alt_2', models.CharField(blank=True, default='Chef special', max_length=120)),
                ('gallery_alt_3', models.CharField(blank=True, default='Fresh plate', max_length=120)),
                ('gallery_alt_4', models.CharField(blank=True, default='African cuisine', max_length=120)),
                ('is_active', models.BooleanField(default=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'Homepage Hero',
                'verbose_name_plural': 'Homepage Hero',
                'ordering': ['-updated_at'],
            },
        ),
    ]
