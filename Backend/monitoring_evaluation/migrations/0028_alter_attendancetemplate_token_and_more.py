# Generated by Django 5.0.7 on 2024-12-08 10:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('monitoring_evaluation', '0027_alter_attendancetemplate_token_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='attendancetemplate',
            name='token',
            field=models.CharField(default='E0S6eLWqiYfMmQaEb4YGUQ', max_length=32, unique=True),
        ),
        migrations.AlterField(
            model_name='evaluationsharablelink',
            name='token',
            field=models.CharField(default='UPN8ZsYm1q3kfLm6co8DTw', max_length=64, unique=True),
        ),
    ]