# Generated by Django 5.0.7 on 2025-01-14 01:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('monitoring_evaluation', '0002_remove_projectnarrative_phase_description'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExtensionProgramOp2',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('academic_program', models.CharField(max_length=255)),
                ('extension_program', models.CharField(max_length=255)),
                ('from_date', models.DateField()),
                ('to_date', models.DateField()),
                ('campus', models.CharField(max_length=255)),
                ('remarks', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]