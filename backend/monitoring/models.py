from django.db import models
from django.contrib.auth.models import User

# UserProfile model to extend the User model
class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('admin', 'System Admin'),
        ('project_leader', 'Project Leader'),
        ('trainer', 'Trainer'),
        ('coordinator', 'College Extension Coordinator'),
        ('staff', 'Extension Administrative Staff'),
        ('department_head', 'Department Head/College Head'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.user.username} - {self.role}"

from django.db import models
from django.contrib.auth.models import User

# Project Model
class Project(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=50)

    def __str__(self):
        return self.title


# Accomplishment Report Model
class AccomplishmentReport(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='accomplishment_reports')
    report_summary = models.TextField()
    submitted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    submission_date = models.DateField()

    def __str__(self):
        return f"Accomplishment Report for {self.project.title} by {self.submitted_by}"

# Evaluation Summary Model
class EvaluationSummary(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='evaluation_summaries')
    evaluator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    evaluation_date = models.DateField()
    overall_score = models.IntegerField()  # e.g., 1-100
    comments = models.TextField()

    def __str__(self):
        return f"Evaluation for {self.project.title} by {self.evaluator}"

# Document Model
class Document(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='documents')
    name = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
