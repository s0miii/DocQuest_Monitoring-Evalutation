# Generated by Django 5.0.7 on 2024-11-29 16:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('monitoring_evaluation', '0016_merge_20241130_0007'),
    ]

    operations = [
        migrations.AlterField(
            model_name='attendancetemplate',
            name='token',
            field=models.CharField(default='iZyB8H-7hw1BKRGReRiR_g', max_length=32, unique=True),
        ),
    ]
