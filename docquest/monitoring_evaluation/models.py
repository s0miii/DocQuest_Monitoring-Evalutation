from django.db import models
from docquestapp.models import Project

# Checklist Model
class Checklist(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="checklist_items")
    item_name = models.CharField(max_length=255) # example: "Attendance Sheet", "Images"
    is_required = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.item_name} for Project {self.project.projectTitle}"

# Documents Model
class Documents(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="documents")
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='uploads/')
    upload_date = models.DateTimeField(auto_now_add=True)
    checklist_item = models.ForeignKey(Checklist, on_delete=models.CASCADE, related_name="documents")
    status = models.CharField(max_length=50, choices=[('pending', 'Pending'), ('submitted', 'Submitted'), ('reviewed', 'Reviewed')], default='pending')

    def __str__(self):
        return f"{self.name} for Project {self.project.projectTitle}"

# Progress Tracking Model
class Progress(models.Model):
    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name="progress")
    completed_items = models.IntegerField(default=0)
    total_items = models.IntegerField(default=0)
    percentage = models.FloatField(default=0.0)

    def update_progress(self):
        # Count all checklist items and submitted documents
        self.total_items = Checklist.objects.filter(project=self.project).count()
        self.completed_items = Documents.objects.filter(project=self.project, status='submitted').count()
        self.percentage = (self.completed_items / self.total_items) * 100 if self.total_items > 0 else 0
        self.save()

    def __str__(self):
        return f"Progress for {self.project.projectTitle} - {self.percentage}%"
