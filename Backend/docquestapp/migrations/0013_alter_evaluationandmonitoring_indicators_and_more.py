# Generated by Django 5.0.7 on 2024-11-08 09:21

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('docquestapp', '0012_alter_partneragency_addressid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='evaluationandmonitoring',
            name='indicators',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='evaluationandmonitoring',
            name='meansOfVerification',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='evaluationandmonitoring',
            name='projectSummary',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='evaluationandmonitoring',
            name='risksAssumptions',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='evaluationandmonitoring',
            name='type',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='loadingoftrainers',
            name='project',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='loadingOfTrainers', to='docquestapp.project'),
        ),
    ]
