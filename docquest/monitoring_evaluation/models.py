from django.db import models
from docquestapp.models import Project

# Temporary Checklist Model
class Checklist(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="checklist_items")
    item_name = models.CharField(max_length=255) # example: "Attendance Sheet", "Images"
    is_required = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.item_name} for Project {self.project.projectID}"

# Documents Model
class Documents(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="documents")
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='uploads/')
    upload_date = models.DateTimeField(auto_now_add=True)
    checklist_item = models.ForeignKey(Checklist, on_delete=models.CASCADE, related_name="documents")
    status = models.CharField(max_length=50, choices=[('pending', 'Pending'), ('submitted', 'Submitted'), ('reviewed', 'Reviewed')], default='pending')

    def __str__(self):
        return f"{self.name} for Project {self.project.projectID}"

# Progress Tracking Model
class Progress(models.Model):
    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name="Progress")
    completed_items = models.IntegerField(default=0)
    total_items = models.IntegerField(default=0)

    def calculate_progress_percentage(self):
        if self.total_items > 0:
            return (self.completed_items / self.total_items) * 100
        return 0
    
    def __str__(self):
        return f"Progress for Project {self.project.projectID} - {self.calculate_progress_percentage()}%"
    






