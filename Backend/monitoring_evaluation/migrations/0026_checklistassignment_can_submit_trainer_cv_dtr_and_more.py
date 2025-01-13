# Generated by Django 5.0.7 on 2024-12-11 14:56

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('docquestapp', '0025_alter_faculty_userid'),
        ('monitoring_evaluation', '0025_alter_attendancetemplate_token_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='checklistassignment',
            name='can_submit_trainer_cv_dtr',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='attendancetemplate',
            name='token',
            field=models.CharField(default='UcPcvQwyS7E-ct7Ldwq-CQ', max_length=32, unique=True),
        ),
        migrations.AlterField(
            model_name='evaluationsharablelink',
            name='token',
            field=models.CharField(default='ROTv1lOYfrKRJiPCWHRUyw', max_length=64, unique=True),
        ),
        migrations.CreateModel(
            name='TrainerCvDtr',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('module_file', models.FileField(blank=True, null=True, upload_to='trainer_cv_dtr/')),
                ('description', models.TextField(blank=True, null=True)),
                ('date_uploaded', models.DateTimeField(auto_now_add=True)),
                ('status', models.CharField(choices=[('Pending', 'Pending'), ('Approved', 'Approved'), ('Rejected', 'Rejected')], default='Pending', max_length=20)),
                ('rejection_reason', models.TextField(blank=True, null=True)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='trainer_cv_dtr', to='docquestapp.project')),
                ('proponent', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='trainer_cv_dtr_submissions', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]