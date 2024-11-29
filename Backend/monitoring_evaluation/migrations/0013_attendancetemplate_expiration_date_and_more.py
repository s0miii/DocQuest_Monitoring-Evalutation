# Generated by Django 5.0.7 on 2024-11-28 07:03

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('docquestapp', '0019_moa_approvalcounter_moa_confidentialityclause_and_more'),
        ('monitoring_evaluation', '0012_alter_attendancetemplate_token'),
    ]

    operations = [
        migrations.AddField(
            model_name='attendancetemplate',
            name='expiration_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='attendancetemplate',
            name='token',
            field=models.CharField(default='t5XCZMAyrWRifZKwjRi7NQ', max_length=32, unique=True),
        ),
        migrations.CreateModel(
            name='TotalAttendees',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total', models.PositiveIntegerField(default=0)),
                ('average', models.FloatField(default=0.0)),
                ('calculated_at', models.DateTimeField(auto_now=True)),
                ('project', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='total_attendees', to='docquestapp.project')),
            ],
        ),
    ]
