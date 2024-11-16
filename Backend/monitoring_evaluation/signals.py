from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
# from .models import Checklist, Documents, Progress

# # Update progress whenever checklist items change
# @receiver(post_save, sender=Checklist)
# @receiver(post_delete, sender=Checklist)
# def update_total_items(sender, instance, **kwargs):
#     try:
#         progress, _ = Progress.objects.get_or_create(project=instance.project)
#         progress.update_progress()
#     except Progress.DoesNotExist:
#         pass

# # Update progress whenever documents are added, updated, or removed
# @receiver(post_save, sender=Documents)
# @receiver(post_delete, sender=Documents)
# def update_completed_items(sender, instance, **kwargs):
#     try:
#         progress, _ = Progress.objects.get_or_create(project=instance.project)
#         progress.update_progress()
#     except Progress.DoesNotExist:
#         pass
