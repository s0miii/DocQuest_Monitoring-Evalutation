# Generated by Django 5.0.7 on 2024-11-01 13:25

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('docquestapp', '0004_rename_personresponsibleid_projectactivities_personresponsible'),
    ]

    operations = [
        migrations.CreateModel(
            name='Checklist',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('item_name', models.CharField(max_length=255)),
                ('is_required', models.BooleanField(default=True)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='checklist_items', to='docquestapp.project')),
            ],
        ),
        migrations.CreateModel(
            name='Documents',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('file', models.FileField(upload_to='uploads/')),
                ('upload_date', models.DateTimeField(auto_now_add=True)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('submitted', 'Submitted'), ('reviewed', 'Reviewed')], default='pending', max_length=50)),
                ('checklist_item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='documents', to='monitoring_evaluation.checklist')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='documents', to='docquestapp.project')),
            ],
        ),
        migrations.CreateModel(
            name='Progress',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('completed_items', models.IntegerField(default=0)),
                ('total_items', models.IntegerField(default=0)),
                ('project', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='Progress', to='docquestapp.project')),
            ],
        ),
    ]
