# Generated by Django 5.0.7 on 2024-11-05 08:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('docquestapp', '0008_alter_evaluationandmonitoring_project_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='moa',
            name='dateCreated',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AddField(
            model_name='moa',
            name='status',
            field=models.CharField(choices=[('approved', 'Approved'), ('pending', 'Pending'), ('rejected', 'Rejected')], default='pending', max_length=10),
        ),
        migrations.AddField(
            model_name='moa',
            name='uniqueCode',
            field=models.CharField(blank=True, max_length=255, null=True, unique=True),
        ),
    ]
