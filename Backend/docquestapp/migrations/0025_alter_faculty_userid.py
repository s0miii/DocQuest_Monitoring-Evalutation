# Generated by Django 5.0.7 on 2024-11-29 18:48

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('docquestapp', '0024_rename_partyadescription_moa_partydescription_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='faculty',
            name='userID',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
