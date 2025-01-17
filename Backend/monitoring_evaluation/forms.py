from django import forms
from .models import *
class DailyAttendanceForm(forms.ModelForm):
    class Meta:
        model = DailyAttendanceRecord
        fields = ['project', 'attendance_file', 'total_attendees']  # Ensure fields are specified

class SummaryOfEvaluationForm(forms.ModelForm):
    class Meta:
        model = SummaryOfEvaluation
        fields = ['project', 'summary_file']  # Ensure fields are specified

class ModulesLectureNotesForm(forms.ModelForm):
    class Meta:
        model = ModulesLectureNotes
        fields = ['project', 'module_file', 'description']  # Ensure fields are specified

class PhotoDocumentationForm(forms.ModelForm):
    class Meta:
        model = PhotoDocumentation
        fields = ['project', 'photo', 'description']  # Ensure fields are specified

class OtherFilesForm(forms.ModelForm):
    class Meta:
        model = OtherFiles
        fields = ['project', 'file', 'description']  # Ensure fields are specified

class AccomplishmentReportForm(forms.ModelForm):
    class Meta:
        model = AccomplishmentReport
        fields = [
            'project', 'banner_program_title', 'flagship_program', 
            'training_modality', 'actualStartDateImplementation', 
            'actualEndDateImplementation', 'prexc_achievement', 'project_narrative'
        ]  # Ensure fields are specified

class PREXCAchievementForm(forms.ModelForm):
    class Meta:
        model = PREXCAchievement
        fields = [
            'persons_trained_weighted_days', 'actual_trainees', 
            'actual_days_training', 'persons_trained', 'satisfactory_trainees', 
            'rating_percentage'
        ]  # Ensure fields are specified

class ProjectNarrativeForm(forms.ModelForm):
    class Meta:
        model = ProjectNarrative
        fields = [
            'activities_topics','issues_challenges', 'participant_engagement_quality', 
            'discussion_comments', 'ways_forward_plans'
        ]  # Ensure fields are specified


class EvaluationForm(forms.ModelForm):
    class Meta:
        model = Evaluation
        fields = [
            'attendee_name', 'relevance_of_topics', 'organizational_flow', 'learning_methods', 
            'technology_use', 'time_efficiency', 'mastery_subject', 'preparedness', 
            'audience_participation', 'interest_level', 'handle_questions', 'voice_personality', 
            'visual_aids', 'useful_concepts', 'improvement_areas', 'additional_comments', 
            'venue_assessment', 'timeliness', 'overall_management'
        ]
        widgets = {
            'relevance_of_topics': forms.RadioSelect(choices=[(i, i) for i in range(6)]),
            'organizational_flow': forms.RadioSelect(choices=[(i, i) for i in range(6)]),
            'learning_methods': forms.RadioSelect(choices=[(i, i) for i in range(6)]),
            'technology_use': forms.RadioSelect(choices=[(i, i) for i in range(6)]),
            'time_efficiency': forms.RadioSelect(choices=[(i, i) for i in range(6)]),
            'mastery_subject': forms.RadioSelect(choices=[(i, i) for i in range(6)]),
            'preparedness': forms.RadioSelect(choices=[(i, i) for i in range(6)]),
            'audience_participation': forms.RadioSelect(choices=[(i, i) for i in range(6)]),
            'interest_level': forms.RadioSelect(choices=[(i, i) for i in range(6)]),
            'handle_questions': forms.RadioSelect(choices=[(i, i) for i in range(6)]),
            'voice_personality': forms.RadioSelect(choices=[(i, i) for i in range(6)]),
            'visual_aids': forms.RadioSelect(choices=[(i, i) for i in range(6)]),
            'venue_assessment': forms.RadioSelect(choices=[(i, i) for i in range(6)]),
            'timeliness': forms.RadioSelect(choices=[(i, i) for i in range(6)]),
            'overall_management': forms.RadioSelect(choices=[(i, i) for i in range(6)]),
        }

class AttendanceTemplateForm(forms.ModelForm):
    class Meta:
        model = AttendanceTemplate
        fields = [
            "project",
            "templateName",
            "first_name",
            "middle_name",
            "last_name",
            "include_attendee_name",
            "include_gender",
            "include_college",
            "include_department",
            "include_year_section",
            "include_agency_office",
            "include_contact_number",
        ]

    def clean(self):
        cleaned_data = super().clean()

        # Safely fetch fields from cleaned_data
        first_name = cleaned_data.get("first_name", "").strip()
        middle_name = cleaned_data.get("middle_name", "").strip()  # Optional field
        last_name = cleaned_data.get("last_name", "").strip()

        # Validate required fields
        if not first_name:
            self.add_error("first_name", "First name is required.")
        if not last_name:
            self.add_error("last_name", "Last name is required.")

        # Custom validation logic if needed
        if first_name and last_name and len(first_name) < 2:
            self.add_error("first_name", "First name must be at least 2 characters long.")
        if first_name and last_name and len(last_name) < 2:
            self.add_error("last_name", "Last name must be at least 2 characters long.")

        return cleaned_data



class CreatedAttendanceRecordForm(forms.ModelForm):
    class Meta:
        model = CreatedAttendanceRecord
        fields = [
            'project',
            'template',
            'first_name',
            'middle_name',
            'last_name',
            'gender',
            'college',
            'department',
            'year_section',
            'agency_office',
            'contact_number',
        ]

    # Require fields
    def clean(self):
        cleaned_data = super().clean()

        # Example: Require first_name, last_name, and gender
        if not cleaned_data.get('first_name'):
            self.add_error('first_name', "First name is required.")
        if not cleaned_data.get('last_name'):
            self.add_error('last_name', "Last name is required.")
        if not cleaned_data.get('gender'):
            self.add_error('gender', "Gender is required.")

        return cleaned_data
