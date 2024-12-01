# Generated by Django 5.0.7 on 2024-11-25 19:00

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('docquestapp', '0019_moa_approvalcounter_moa_confidentialityclause_and_more'),
        ('monitoring_evaluation', '0006_attendancetemplate_attendancerecord'),
    ]

    operations = [
        migrations.RenameField(
            model_name='attendancetemplate',
            old_name='name',
            new_name='templateName',
        ),
        migrations.RemoveField(
            model_name='attendancetemplate',
            name='fields',
        ),
        migrations.AddField(
            model_name='attendancetemplate',
            name='include_agency_office',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='attendancetemplate',
            name='include_attendee_name',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='attendancetemplate',
            name='include_college',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='attendancetemplate',
            name='include_contact_number',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='attendancetemplate',
            name='include_department',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='attendancetemplate',
            name='include_gender',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='attendancetemplate',
            name='include_year_section',
            field=models.BooleanField(default=False),
        ),
        migrations.CreateModel(
            name='CreatedAttendanceRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('attendee_name', models.CharField(blank=True, max_length=255, null=True)),
                ('gender', models.CharField(blank=True, max_length=50, null=True)),
                ('college', models.CharField(blank=True, max_length=255, null=True)),
                ('department', models.CharField(blank=True, max_length=255, null=True)),
                ('year_section', models.CharField(blank=True, max_length=255, null=True)),
                ('agency_office', models.CharField(blank=True, max_length=255, null=True)),
                ('contact_number', models.CharField(blank=True, max_length=50, null=True)),
                ('submitted_at', models.DateTimeField(auto_now_add=True)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='docquestapp.project')),
                ('template', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='monitoring_evaluation.attendancetemplate')),
            ],
        ),
        migrations.DeleteModel(
            name='AttendanceRecord',
        ),
    ]