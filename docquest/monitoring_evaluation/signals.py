# monitoring_evaluation/signals.py

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Checklist, Documents, Progress
from docquestapp.models import Project

# Efficient Signal for Updating Progress
@receiver([post_save, post_delete], sender=Checklist)
@receiver([post_save, post_delete], sender=Documents)
def update_progress(sender, instance, **kwargs):
    project = instance.project
    progress, _ = Progress.objects.get_or_create(project=project)

    # Update total_items (based on checklist) and completed_items (based on documents)
    progress.total_items = Checklist.objects.filter(project=project).count()
    progress.completed_items = Documents.objects.filter(project=project).count()
    progress.save()
