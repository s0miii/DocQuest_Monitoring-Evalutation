# Generated by Django 5.0.7 on 2024-12-08 17:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('monitoring_evaluation', '0029_alter_evaluationsharablelink_options_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='attendancetemplate',
            name='token',
            field=models.CharField(default='tHIQKk9LUwr8o3AQtWzvXQ', max_length=32, unique=True),
        ),
        migrations.AlterField(
            model_name='evaluationsharablelink',
            name='token',
            field=models.CharField(default='uYbeq3oMB_chM_CF0DQFbQ', max_length=64, unique=True),
        ),
    ]