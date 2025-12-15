from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('catering', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cateringcategory',
            name='name',
            field=models.CharField(choices=[('weddings', 'Weddings'), ('birthdays', 'Birthdays'), ('corporate', 'Corporate events'), ('house_parties', 'House parties'), ('traditional', 'Traditional ceremonies'), ('outdoor', 'Outdoor events'), ('buffet_services', 'Buffet services'), ('small_chops_cocktails', 'Small chops & cocktail setups')], max_length=100, unique=True),
        ),
        migrations.RemoveField(
            model_name='cateringpackage',
            name='images',
        ),
        migrations.AddField(
            model_name='cateringpackage',
            name='price_max',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
        migrations.AddField(
            model_name='cateringpackage',
            name='price_min',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
        migrations.AddField(
            model_name='cateringpackage',
            name='price_per_head',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
        migrations.AddField(
            model_name='cateringpackage',
            name='description',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='cateringenquiry',
            name='tasting_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='cateringenquiry',
            name='tasting_session_requested',
            field=models.BooleanField(default=False),
        ),
        migrations.CreateModel(
            name='BuffetService',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('buffet_type', models.CharField(choices=[('continental', 'Continental buffet'), ('african', 'African buffet'), ('mixed', 'Mixed cuisine buffet'), ('custom', 'Custom buffet')], max_length=20)),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField(blank=True)),
                ('price_per_head', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('add_ons', models.JSONField(blank=True, default=list, help_text='Add-ons like servers, drinks, desserts, palm wine bar, etc.')),
                ('setup_notes', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='CateringPackageImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='catering/packages/')),
                ('caption', models.CharField(blank=True, max_length=255)),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('package', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='gallery', to='catering.cateringpackage')),
            ],
        ),
        migrations.CreateModel(
            name='BuffetImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='catering/buffet/')),
                ('caption', models.CharField(blank=True, max_length=255)),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('buffet', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='catering.buffetservice')),
            ],
        ),
    ]

