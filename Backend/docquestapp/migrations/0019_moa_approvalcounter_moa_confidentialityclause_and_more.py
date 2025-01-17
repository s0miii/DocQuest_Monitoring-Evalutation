# Generated by Django 5.0.7 on 2024-11-19 02:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('docquestapp', '0018_college_remove_project_college_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='moa',
            name='approvalCounter',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='moa',
            name='confidentialityClause',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='moa',
            name='coverageAndEffectivity',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='project',
            name='approvalCounter',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='review',
            name='approvalCounter',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='review',
            name='reviewerResponsible',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
        migrations.DeleteModel(
            name='Effectivity',
        ),
    ]
