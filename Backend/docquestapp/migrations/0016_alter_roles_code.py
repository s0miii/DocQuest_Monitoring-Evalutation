# Generated by Django 5.0.7 on 2024-11-16 08:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('docquestapp', '0015_programcategory_projectcategory_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='roles',
            name='code',
            field=models.CharField(max_length=5),
        ),
    ]
