# Generated by Django 5.0.7 on 2024-11-15 00:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('docquestapp', '0014_firstparty_secondparty_witnesses'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProgramCategory',
            fields=[
                ('programCategoryID', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='ProjectCategory',
            fields=[
                ('projectCategoryID', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=50)),
            ],
        ),
        migrations.RemoveField(
            model_name='project',
            name='programCategory',
        ),
        migrations.RemoveField(
            model_name='project',
            name='projectCategory',
        ),
        migrations.AddField(
            model_name='project',
            name='programCategory',
            field=models.ManyToManyField(related_name='programCategory', to='docquestapp.programcategory'),
        ),
        migrations.AddField(
            model_name='project',
            name='projectCategory',
            field=models.ManyToManyField(related_name='projectCategory', to='docquestapp.projectcategory'),
        ),
    ]