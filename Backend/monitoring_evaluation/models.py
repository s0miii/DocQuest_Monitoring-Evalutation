from django.db import models
from docquestapp.models import Project, LoadingOfTrainers
from django.urls import reverse
from django.utils import timezone
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
    

# Model for Evaluation Form
class Evaluation(models.Model):
    trainer = models.ForeignKey(LoadingOfTrainers, on_delete=models.CASCADE, related_name="evaluations")
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="evaluations")
    attendee_name = models.CharField(max_length=255)
    relevance_of_topics = models.IntegerField(choices=[(i, i) for i in range(6)])
    organizational_flow = models.IntegerField(choices=[(i, i) for i in range(6)])
    learning_methods = models.IntegerField(choices=[(i, i) for i in range(6)])
    technology_use = models.IntegerField(choices=[(i, i) for i in range(6)])
    time_efficiency = models.IntegerField(choices=[(i, i) for i in range(6)])
    mastery_subject = models.IntegerField(choices=[(i, i) for i in range(6)])
    preparedness = models.IntegerField(choices=[(i, i) for i in range(6)])
    audience_participation = models.IntegerField(choices=[(i, i) for i in range(6)])
    interest_level = models.IntegerField(choices=[(i, i) for i in range(6)])
    handle_questions = models.IntegerField(choices=[(i, i) for i in range(6)])
    voice_personality = models.IntegerField(choices=[(i, i) for i in range(6)])
    visual_aids = models.IntegerField(choices=[(i, i) for i in range(6)])
    useful_concepts = models.TextField(blank=True, null=True)
    improvement_areas = models.TextField(blank=True, null=True)
    additional_comments = models.TextField(blank=True, null=True)
    venue_assessment = models.IntegerField(choices=[(i, i) for i in range(6)])
    timeliness = models.IntegerField(choices=[(i, i) for i in range(6)])
    overall_management = models.IntegerField(choices=[(i, i) for i in range(6)])
    # stored_overall_rating = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    stored_overall_rating = models.IntegerField(null=True, blank=True, verbose_name="Overall Rating")
    submitted_at = models.DateTimeField(default=timezone.now, verbose_name="Date Submitted")


     
    def calculate_overall_rating(self):
        ratings = [
            self.relevance_of_topics,
            self.organizational_flow,
            self.learning_methods,
            self.technology_use,
            self.time_efficiency,
            self.mastery_subject,
            self.preparedness,
            self.audience_participation,
            self.interest_level,
            self.handle_questions,
            self.voice_personality,
            self.visual_aids,
            self.venue_assessment,
            self.timeliness,
            self.overall_management
        ]
        
        # Filter out None values and calculate the average
        total_ratings = [r for r in ratings if r is not None]
        average_rating = sum(total_ratings) / len(total_ratings) if total_ratings else 0 
        return round(average_rating)
    
    def save(self, *args, **kwargs):
        # Calculate overall_rating before saving
        self.stored_overall_rating = self.calculate_overall_rating()
        super().save(*args, **kwargs)
   
    def get_absolute_url(self):
        return reverse('evaluation_form', args=[str(self.id)])

    def __str__(self):
        return f"Evaluation for Trainer {self.trainer.LOTID} - Project {self.project.projectID}"

    



