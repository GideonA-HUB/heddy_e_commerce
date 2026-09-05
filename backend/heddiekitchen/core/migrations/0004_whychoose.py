# Generated manually for Why Choose Us coverflow

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_homepagehero'),
    ]

    operations = [
        migrations.CreateModel(
            name='WhyChooseSection',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('section_label', models.CharField(default='WHY CHOOSE US', help_text='Eyebrow label above the carousel', max_length=80)),
                ('is_active', models.BooleanField(default=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Why Choose Us Section',
                'verbose_name_plural': 'Why Choose Us Section',
            },
        ),
        migrations.CreateModel(
            name='WhyChooseSlide',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tag', models.CharField(blank=True, default='#Signature', max_length=60)),
                ('title_line1', models.CharField(max_length=80)),
                ('title_line2', models.CharField(blank=True, max_length=80)),
                ('description', models.TextField(blank=True)),
                ('image', models.ImageField(help_text='Slide image (upload)', upload_to='why_choose/')),
                ('cta_text', models.CharField(default='View Menu', max_length=40)),
                ('cta_url', models.CharField(default='/menu', max_length=200)),
                ('display_order', models.PositiveIntegerField(default=0)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('section', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='slides', to='core.whychoosesection')),
            ],
            options={
                'verbose_name': 'Why Choose Us Slide',
                'verbose_name_plural': 'Why Choose Us Slides',
                'ordering': ['display_order', 'id'],
            },
        ),
    ]
