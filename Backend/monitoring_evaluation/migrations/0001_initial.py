# Generated by Django 5.0.7 on 2024-11-14 08:40

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('docquestapp', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AttendanceRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('attendance_file', models.FileField(upload_to='attendance_files/')),
                ('total_attendees', models.PositiveIntegerField()),
                ('upload_date', models.DateTimeField(auto_now_add=True)),
            ],
        ),
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
            name='Evaluation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('attendee_name', models.CharField(max_length=255)),
                ('relevance_of_topics', models.IntegerField(choices=[(0, 0), (1, 1), (2, 2), (3, 3), (4, 4), (5, 5)])),
                ('organizational_flow', models.IntegerField(choices=[(0, 0), (1, 1), (2, 2), (3, 3), (4, 4), (5, 5)])),
                ('learning_methods', models.IntegerField(choices=[(0, 0), (1, 1), (2, 2), (3, 3), (4, 4), (5, 5)])),
                ('technology_use', models.IntegerField(choices=[(0, 0), (1, 1), (2, 2), (3, 3), (4, 4), (5, 5)])),
                ('time_efficiency', models.IntegerField(choices=[(0, 0), (1, 1), (2, 2), (3, 3), (4, 4), (5, 5)])),
                ('mastery_subject', models.IntegerField(choices=[(0, 0), (1, 1), (2, 2), (3, 3), (4, 4), (5, 5)])),
                ('preparedness', models.IntegerField(choices=[(0, 0), (1, 1), (2, 2), (3, 3), (4, 4), (5, 5)])),
                ('audience_participation', models.IntegerField(choices=[(0, 0), (1, 1), (2, 2), (3, 3), (4, 4), (5, 5)])),
                ('interest_level', models.IntegerField(choices=[(0, 0), (1, 1), (2, 2), (3, 3), (4, 4), (5, 5)])),
                ('handle_questions', models.IntegerField(choices=[(0, 0), (1, 1), (2, 2), (3, 3), (4, 4), (5, 5)])),
                ('voice_personality', models.IntegerField(choices=[(0, 0), (1, 1), (2, 2), (3, 3), (4, 4), (5, 5)])),
                ('visual_aids', models.IntegerField(choices=[(0, 0), (1, 1), (2, 2), (3, 3), (4, 4), (5, 5)])),
                ('useful_concepts', models.TextField(blank=True, null=True)),
                ('improvement_areas', models.TextField(blank=True, null=True)),
                ('additional_comments', models.TextField(blank=True, null=True)),
                ('venue_assessment', models.IntegerField(choices=[(0, 0), (1, 1), (2, 2), (3, 3), (4, 4), (5, 5)])),
                ('timeliness', models.IntegerField(choices=[(0, 0), (1, 1), (2, 2), (3, 3), (4, 4), (5, 5)])),
                ('overall_management', models.IntegerField(choices=[(0, 0), (1, 1), (2, 2), (3, 3), (4, 4), (5, 5)])),
                ('stored_overall_rating', models.IntegerField(blank=True, null=True, verbose_name='Overall Rating')),
                ('submitted_at', models.DateTimeField(default=django.utils.timezone.now, verbose_name='Date Submitted')),
                ('evaluation_number', models.IntegerField(blank=True, null=True, verbose_name='No.')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='evaluations', to='docquestapp.project')),
                ('trainer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='evaluations', to='docquestapp.loadingoftrainers')),
            ],
        ),
        migrations.CreateModel(
            name='Progress',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('completed_items', models.IntegerField(default=0)),
                ('total_items', models.IntegerField(default=0)),
                ('percentage', models.FloatField(default=0.0)),
                ('project', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='progress', to='docquestapp.project')),
            ],
        ),
    ]