from django.db import models
from docquestapp.models import Project, CustomUser, LoadingOfTrainers
from django.urls import reverse
from django.utils import timezone


# # Checklist Model
# class Checklist(models.Model):
#     project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="checklist_items")
#     item_name = models.CharField(max_length=255) # example: "Attendance Sheet", "Images"
#     is_required = models.BooleanField(default=True)

#     def __str__(self):
#         return f"{self.item_name} for Project {self.project.projectTitle}"

# # Documents Model
# class Documents(models.Model):
#     project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="documents")
#     name = models.CharField(max_length=255)
#     file = models.FileField(upload_to='uploads/')
#     upload_date = models.DateTimeField(auto_now_add=True)
#     checklist_item = models.ForeignKey(Checklist, on_delete=models.CASCADE, related_name="documents")
#     status = models.CharField(max_length=50, choices=[('pending', 'Pending'), ('submitted', 'Submitted'), ('reviewed', 'Reviewed')], default='pending')

#     def __str__(self):
#         return f"{self.name} for Project {self.project.projectTitle}"

# # Progress Tracking Model
# class Progress(models.Model):
#     project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name="progress")
#     completed_items = models.IntegerField(default=0)
#     total_items = models.IntegerField(default=0)
#     percentage = models.FloatField(default=0.0)

#     def update_progress(self):
#         # Count all checklist items and submitted documents
#         self.total_items = Checklist.objects.filter(project=self.project).count()
#         self.completed_items = Documents.objects.filter(project=self.project, status='submitted').count()
#         self.percentage = (self.completed_items / self.total_items) * 100 if self.total_items > 0 else 0
#         self.save()

#     def __str__(self):
#         return f"Progress for {self.project.projectTitle} - {self.percentage}%"

# Model for Attendance
# class AttendanceRecord(models.Model):
#     # File field for the attendance file upload
#     attendance_file = models.FileField(upload_to='attendance_files/')
    
#     # Integer field for the total number of attendees
#     total_attendees = models.PositiveIntegerField()
    
#     # Timestamp for when the record was uploaded
#     upload_date = models.DateTimeField(auto_now_add=True)
    
#     def __str__(self):
#         return f"Attendance Record - {self.upload_date.strftime('%Y-%m-%d')} - {self.total_attendees} Attendees"
    


# New Models for Document Submission

# Accomplishment Report Model
class AccomplishmentReport(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='accomplishment_reports')

    # Fields specific to the accomplishment report
    banner_program_title = models.CharField(max_length=255)
    flagship_program = models.CharField(max_length=255)
    training_modality = models.CharField(
        max_length=50,
        choices=[("Virtual", 'Virtual'), ("Face to Face", 'Face to Face'), ("Blended", 'Blended')]
    )
    actual_implementation_date = models.DateField()
    total_number_of_days = models.IntegerField()
    submitted_by = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, related_name='submitted_accomplishments'
    )

    # Related Models
    project_narrative = models.OneToOneField(
        'ProjectNarrative', on_delete=models.CASCADE, null=True, blank=True, related_name="accomplishment_report"
    )

    # Properties to access fields from the Project model
    @property
    def project_title(self):
        return self.project.projectTitle

    @property
    def project_type(self):
        return self.project.projectType

    @property
    def project_category(self):
        return self.project.projectCategory

    @property
    def research_title(self):
        return self.project.researchTitle

    @property
    def proponents(self):
        return self.project.proponents.all()  # Many-to-Many field

    @property
    def program(self):
        return self.project.program

    @property
    def accreditation_level(self):
        return self.project.accreditationLevel

    @property
    def college(self):
        return self.project.college

    @property
    def target_groups_beneficiaries(self):
        return self.project.beneficiaries

    @property
    def project_location(self):
        return self.project.projectLocationID

    @property
    def partner_agency(self):
        return self.project.agency.all()  # Many-to-Many field

    def __str__(self):
        return f"Accomplishment Report for {self.project.projectTitle}"

# Project Narrative Model
class ProjectNarrative(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='project_narratives')
    phase_description = models.TextField()
    activities_topics = models.TextField()
    issues_challenges = models.TextField()
    participant_engagement_quality = models.TextField()
    discussion_comments = models.TextField()
    ways_forward_plans = models.TextField()

    def __str__(self):
        return f"Project Narrative for {self.project.projectTitle}"

# Daily Attendance Record Model
class DailyAttendanceRecord(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='daily_attendance_records')
    uploaded_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    file = models.FileField(upload_to='daily_attendance_records/', help_text="Upload the attendance record file")
    total_attendees = models.IntegerField()
    date_uploaded = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Attendance Record for  {self.project.projectTitle}"

# Modules & Notes Model
class ModulesNotes(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='modules_notes')
    file = models.FileField(upload_to='modules_notes/', help_text="Upload the module or note file")
    title = models.CharField(max_length=255, help_text="Title of the module or note")
    description = models.TextField(blank=True, help_text="Description or details about the module or note")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.project.projectTitle}"
    
# Others Model
class OtherDocuments(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="other_documents")
    file = models.FileField(upload_to='other_documents/', help_text="Upload the document file")
    title = models.CharField(max_length=255, help_text="Title of the document")
    description = models.TextField(blank=True, help_text="Description or details about the document")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.project.projectTitle}"

    
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
    stored_overall_rating = models.IntegerField(null=True, blank=True, verbose_name="Overall Rating")
    submitted_at = models.DateTimeField(default=timezone.now, verbose_name="Date Submitted")
    evaluation_number = models.IntegerField(null=True, blank=True, verbose_name="No.")


     
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

        if not self.evaluation_number:
            last_evaluation = Evaluation.objects.filter(
                trainer=self.trainer, project=self.project
            ).order_by('evaluation_number').last()

            if last_evaluation and last_evaluation.evaluation_number is not None:
                self.evaluation_number = last_evaluation.evaluation_number + 1
            else:
                self.evaluation_number = 1
        
        super().save(*args, **kwargs)
   
    def get_absolute_url(self):
        return reverse('evaluation_form', args=[str(self.id)])

    def __str__(self):
        return f"Evaluation for Trainer {self.trainer.LOTID} - Project {self.project.projectID}"

    



