# Generated by Django 5.0.7 on 2024-11-23 12:13

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('docquestapp', '0019_moa_approvalcounter_moa_confidentialityclause_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Campus',
            fields=[
                ('campusID', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.RemoveField(
            model_name='customuser',
            name='campus',
        ),
        migrations.RemoveField(
            model_name='customuser',
            name='college',
        ),
        migrations.RemoveField(
            model_name='customuser',
            name='department',
        ),
        migrations.AddField(
            model_name='college',
            name='collegeDean',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='program',
            name='programChair',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='college',
            name='campusID',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='campus', to='docquestapp.campus'),
        ),
        migrations.CreateModel(
            name='Faculty',
            fields=[
                ('facultyID', models.AutoField(primary_key=True, serialize=False)),
                ('collegeID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='docquestapp.college')),
                ('programID', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='docquestapp.program')),
                ('userID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
