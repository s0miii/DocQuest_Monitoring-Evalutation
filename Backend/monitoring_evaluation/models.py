from django.db import models, IntegrityError
from django.db.models import Avg
from docquestapp.models import Project, CustomUser, LoadingOfTrainers
from django.urls import reverse
from django.utils import timezone
from django.contrib.auth import get_user_model
import secrets
from datetime import date
from django.utils.timezone import now

# model for logging

CustomUser = get_user_model()

class NotificationLog(models.Model):
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="sent_notifications")
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="notification_logs")
    recipient_email = models.EmailField()
    subject = models.CharField(max_length=255)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification from {self.sender} to {self.recipient_email} for {self.project.projectTitle}"


### Checklist Items

# Daily Attendance Record
class DailyAttendanceRecord(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="daily_attendance_records")
    proponent = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="daily_attendance_submissions", null=True)
    attendance_file = models.FileField(upload_to="attendance_records/", null=True, blank=True)
    total_attendees = models.PositiveIntegerField(null=True, blank=True)
    date_uploaded = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
    rejection_reason = models.TextField(null=True, blank=True)
    

    def __str__(self):
        return f"Attendance Record for {self.project.projectTitle} by {self.proponent.firstname} + {self.proponent.lastname} on {self.date_uploaded.date()}"

# Evaluation Summary
class SummaryOfEvaluation(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="evaluation_summaries")
    proponent = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="evaluation_submissions", null=True)
    summary_file = models.FileField(upload_to="evaluation_summaries/", null=True, blank=True)
    date_uploaded = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
    rejection_reason = models.TextField(null=True, blank=True)

# Modules/Lecture Notes
class ModulesLectureNotes(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="lecture_notes")
    proponent = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="lecture_notes_submissions", null=True)
    module_file = models.FileField(upload_to="lecture_notes/", null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    date_uploaded = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
    rejection_reason = models.TextField(null=True, blank=True)

# Photo Documentation
class PhotoDocumentation(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="photo_documentations")
    proponent = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="photo_documentations", null=True)
    photo = models.ImageField(upload_to="photo_documentations/", null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    date_uploaded = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
    rejection_reason = models.TextField(null=True, blank=True)

# Other FIles
class OtherFiles(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="other_files")
    proponent = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="other_files_submissions", null=True)
    file = models.FileField(upload_to="other_files/", null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    date_uploaded = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
    rejection_reason = models.TextField(null=True, blank=True)

## Assign Checklist Item
CustomUser = get_user_model()

class ChecklistAssignment(models.Model):
    project = models.ForeignKey(Project, related_name="checklist_assignments", on_delete=models.CASCADE)
    proponent = models.ForeignKey(CustomUser, related_name="assigned_checklists", on_delete=models.CASCADE)

    # Boolean fields to represent the state of each checklist item
    can_submit_daily_attendance = models.BooleanField(default=False)
    can_submit_summary_of_evaluation = models.BooleanField(default=False)
    can_submit_modules_lecture_notes = models.BooleanField(default=False)
    can_submit_other_files = models.BooleanField(default=False)
    can_submit_photo_documentation = models.BooleanField(default=False)

    is_completed = models.BooleanField(default=False)
    completion_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Checklist Assignment for {self.proponent.firstname + self.proponent.lastname} on {self.project.projectTitle}"


# Accomplishment Report Model
class AccomplishmentReport(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='accomplishment_reports')

    # Fields from the template
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

    # Related models
    prexc_achievement = models.OneToOneField(
        'PREXCAchievement', on_delete=models.CASCADE, null=True, blank=True, related_name='accomplishment_report'
    )
    project_narrative = models.OneToOneField(
        'ProjectNarrative', on_delete=models.CASCADE, null=True, blank=True, related_name='accomplishment_report'
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

# PREXC Achievement Model
class PREXCAchievement(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="prexc_achievements")
    persons_trained_weighted_days = models.DecimalField(max_digits=10, decimal_places=2)
    actual_trainees = models.PositiveIntegerField()
    actual_days_training = models.PositiveIntegerField()
    persons_trained = models.PositiveIntegerField()
    satisfactory_trainees = models.PositiveIntegerField()
    rating_percentage = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"PREXC Achievement for Project: {self.project.projectTitle}"

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
    
# Model for Evaluation Form
class Evaluation(models.Model):
    trainer = models.ForeignKey(LoadingOfTrainers, on_delete=models.CASCADE, related_name="evaluations")
    project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True, blank=True, related_name="evaluations")
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
    overall_rating = models.IntegerField(null=True, blank=True, verbose_name="Overall Rating")
    remarks = models.TextField(blank=True, null=True)
    
    submitted_at = models.DateTimeField(default=timezone.now, verbose_name="Date Submitted")
    evaluation_number = models.IntegerField(null=True, blank=True, verbose_name="No.")
    access_token = models.CharField(max_length=64, unique=True, blank=True, null=True)
    
    class Meta:
        unique_together = ('trainer', 'project', 'attendee_name')

    @property
    def trainingLoad(self):
        if self.trainer:
            return self.trainer.trainingLoad
        return None

    def save(self, *args, **kwargs):
        if self.project.status != 'approved':
            raise ValueError(f"Evaluations can only be created for approved projects.")

        if not self.access_token:
            self.access_token = secrets.token_urlsafe(16)

        self.overall_rating = self.calculate_overall_rating()
        
        if not self.evaluation_number:
            last_evaluation = Evaluation.objects.filter(
                trainer=self.trainer, project=self.project
            ).order_by('evaluation_number').last()

            if last_evaluation and last_evaluation.evaluation_number is not None:
                self.evaluation_number = last_evaluation.evaluation_number + 1
            else:
                self.evaluation_number = 1

        super().save(*args, **kwargs)
    
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
        
        total_ratings = [r for r in ratings if r is not None]
        return round(sum(total_ratings) / len(total_ratings) if total_ratings else 0)
    
    def __str__(self):
        return f"Evaluation for Trainer {self.trainer.LOTID} - Project {self.project.projectID}"

def generate_token_32():
    return secrets.token_urlsafe(16)  # Generates a 32-character token
class EvaluationSharableLink(models.Model):
    trainer = models.ForeignKey(LoadingOfTrainers, on_delete=models.CASCADE, related_name="evaluation_links", null=True, blank=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="evaluation_links")
    token = models.CharField(default=generate_token_32, max_length=64, unique=True)    
    sharable_link = models.URLField(max_length=500, blank=True, null=True)
    expiration_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def trainingLoad(self):
        return self.trainer.trainingLoad if self.trainer else None

    def save(self, *args, **kwargs):
        if not self.token:
            self.token = secrets.token_urlsafe(16)

        # Generate the sharable link if not already set
        if not self.sharable_link:
            base_url = "http://127.0.0.1:8000/monitoring/evaluation/fill"
            self.sharable_link = f"{base_url}/{self.token}/"
        
        super().save(*args, **kwargs)

    def is_valid(self):
        return not self.expiration_date or self.expiration_date >= timezone.now().date()

    def __str__(self):
        if self.trainer:
            return f"Sharable Link for Trainer {self.trainer.LOTID} - Project {self.project.projectID}"
        return f"Sharable Link for Project {self.project.projectID} (No Trainer)"

class EvaluationSummary(models.Model):
    project = models.ForeignKey('docquestapp.Project', on_delete=models.CASCADE)
    total_evaluations = models.IntegerField(default=0)
    categories = models.JSONField(default=dict)  # For rating counts
    percentages = models.JSONField(default=dict)  # For percentage calculations
    last_updated = models.DateTimeField(default=now)

    def __str__(self):
        return f"Summary for Project {self.project.projectTitle if self.project else 'Unknown'} (Last Updated: {self.last_updated})"
    
# Attendance Template and Attendance Record Model
class AttendanceTemplate(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="attendance_templates")
    templateName = models.CharField(max_length=255, default="Attendance Template")    
    trainerLoad = models.ForeignKey(
        LoadingOfTrainers,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='attendance_templates'
    )

    include_attendee_name = models.BooleanField(default=False)
    include_gender = models.BooleanField(default=False)
    include_college = models.BooleanField(default=False)
    include_department = models.BooleanField(default=False)
    include_year_section = models.BooleanField(default=False)
    include_agency_office = models.BooleanField(default=False)
    include_contact_number = models.BooleanField(default=False)
    
    sharable_link = models.URLField(max_length=500, blank=True, null=True)
    token = models.CharField(default=generate_token_32, max_length=64, unique=True)
    expiration_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        # Check if the template is still valid based on the expiration date."""
        if self.expiration_date:
            return date.today() <= self.expiration_date
        return True

    def __str__(self):
        return f"{self.templateName} for {self.project.projectTitle}"    
    
    def save(self, *args, **kwargs):
        # Generate a unique token if wala pa
        if not self.token:
            self.token = secrets.token_urlsafe(16)

        while True: 
            try:
                # Save the record
                super().save(*args, **kwargs)
                break
            except IntegrityError:  # If a duplicate token error occurs, regenerate the token
                self.token = secrets.token_urlsafe(16)

        # Generate the sharable link if it does not exist
        if not self.sharable_link:
            base_url = "http://127.0.0.1:8000/monitoring/attendance/fill"
            self.sharable_link = f"{base_url}/{self.token}/"
class TotalAttendees(models.Model):
    project = models.OneToOneField('docquestapp.Project', on_delete=models.CASCADE, related_name="total_attendees")
    total_attendees = models.PositiveIntegerField(default=0)
    average_attendees = models.FloatField(default=0.0)
    num_templates = models.PositiveIntegerField(default=0)
    calculated_at = models.DateTimeField(auto_now=True) 

    def __str__(self):
        return f"Total Attendees for {self.project.projectTitle}: {self.total_attendees}"       

# Created attendance record from the template
class CreatedAttendanceRecord(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    template = models.ForeignKey(AttendanceTemplate, on_delete=models.CASCADE)
    attendee_name = models.CharField(max_length=255, null=True, blank=True)
    gender = models.CharField(max_length=50, null=True, blank=True)
    college = models.CharField(max_length=255, null=True, blank=True)
    department = models.CharField(max_length=255, null=True, blank=True)
    year_section = models.CharField(max_length=255, null=True, blank=True)
    agency_office = models.CharField(max_length=255, null=True, blank=True)
    contact_number = models.CharField(max_length=50, null=True, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Record for {self.project.projectTitle} submitted at {self.submitted_at}"
