# Generated by Django 5.0.7 on 2024-11-26 10:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('monitoring_evaluation', '0011_alter_attendancetemplate_token'),
    ]

    operations = [
        migrations.AlterField(
            model_name='attendancetemplate',
            name='token',
            field=models.CharField(default='_lqQ812qMCOjFWObpDF__A', max_length=32, unique=True),
        ),
    ]