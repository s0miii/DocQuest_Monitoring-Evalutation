# Generated by Django 5.0.7 on 2024-11-05 08:47

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('docquestapp', '0009_moa_datecreated_moa_status_moa_uniquecode'),
    ]

    operations = [
        migrations.AlterField(
            model_name='moa',
            name='dateCreated',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
