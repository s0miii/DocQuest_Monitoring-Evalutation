from django.contrib import admin
from .models import Evaluation, AccomplishmentReport, ProjectNarrative

# @admin.register(Checklist)
# class ChecklistAdmin(admin.ModelAdmin):
#     list_display = ('item_name', 'project', 'is_required')
#     search_fields = ('item_name', 'project__projectTitle')
#     list_filter = ('is_required',)

# @admin.register(Documents)
# class DocumentsAdmin(admin.ModelAdmin):
#     list_display = ('project', 'checklist_item', 'upload_date', 'status')
#     search_fields = ('checklist_item__item_name', 'project__projectTitle')
#     list_filter = ('status', 'upload_date')

# @admin.register(Progress)
# class ProgressAdmin(admin.ModelAdmin):
#     list_display = ('project', 'completed_items', 'total_items', 'percentage')
#     search_fields = ('project__projectTitle',)
#     list_filter = ('percentage',)

# @admin.register(AttendanceRecord)
# class AttendanceRecordAdmin(admin.ModelAdmin):
#     list_display = ('upload_date', 'total_attendees')

# Register Evaluation model
@admin.register(Evaluation)
class EvaluationAdmin(admin.ModelAdmin):
    list_display = ('trainer', 'project', 'attendee_name', 'stored_overall_rating', 'submitted_at')
    list_filter = ('project', 'trainer')
    search_fields = ('attendee_name', 'project__projectTitle', 'trainer__faculty')

    def get_overall_rating(self, obj):
        return obj.stored_overall_rating
    get_overall_rating.short_description = 'Overall Rating'

    def get_date_submitted(self, obj):
        return obj.submitted_at
    get_date_submitted.short_description = 'Date Submitted'


@admin.register(AccomplishmentReport)
class AccomplishmentReportAdmin(admin.ModelAdmin):
    list_display = (
        'id', 
        'project', 
        'banner_program_title', 
        'flagship_program', 
        'training_modality', 
        'actual_implementation_date', 
        'total_number_of_days', 
        'submitted_by', 
        'project_title', 
        'project_type', 
        'project_category', 
        'research_title', 
        'proponents', 
        'program', 
        'accreditation_level', 
        'college', 
        'target_groups_beneficiaries', 
        'project_location', 
        'partner_agency',
    )
    search_fields = (
        'banner_program_title', 
        'flagship_program', 
        'training_modality', 
        'project__projectTitle', 
        'submitted_by__email',
    )
    list_filter = (
        'training_modality', 
        'actual_implementation_date', 
        'project__status',
    )
    ordering = ('-actual_implementation_date',)

@admin.register(ProjectNarrative)
class ProjectNarrativeAdmin(admin.ModelAdmin):
    list_display = (
        'id', 
        'project', 
        'phase_description', 
        'activities_topics', 
        'issues_challenges', 
        'participant_engagement_quality', 
        'discussion_comments', 
        'ways_forward_plans',
    )
    search_fields = ('project__projectTitle', 'phase_description')
    ordering = ('-project__dateCreated',)

