# Generated by Django 5.0.7 on 2025-01-14 04:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('monitoring_evaluation', '0003_extensionprogramop2'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExtensionProgramOC',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('memorandum_of_agreements', models.TextField()),
                ('extension_program', models.TextField()),
                ('from_date', models.DateField()),
                ('to_date', models.DateField()),
                ('campus', models.CharField(max_length=255)),
                ('remarks', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]