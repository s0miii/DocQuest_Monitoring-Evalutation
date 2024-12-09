from django.contrib import admin
from .models import *
from django.urls import reverse
from django.utils.html import format_html

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

# Email
@admin.register(NotificationLog)
class NotificationLogAdmin(admin.ModelAdmin):
    list_display = ('sender', 'recipient_email', 'project', 'subject', 'timestamp')
    list_filter = ('timestamp', 'sender', 'project')
    search_fields = ('recipient_email', 'subject', 'message')

# Checklist
@admin.register(DailyAttendanceRecord)
class DailyAttendanceRecordAdmin(admin.ModelAdmin):
    list_display = ('project', 'proponent', 'date_uploaded')
    search_fields = ('project__title', 'proponent__username')

@admin.register(SummaryOfEvaluation)
class SummaryOfEvaluationAdmin(admin.ModelAdmin):
    list_display = ('project', 'proponent', 'date_uploaded')
    search_fields = ('project__title', 'proponent__username')

@admin.register(ModulesLectureNotes)
class ModulesLectureNotesAdmin(admin.ModelAdmin):
    list_display = ('project', 'proponent', 'description', 'date_uploaded')
    search_fields = ('project__title', 'proponent__username')

@admin.register(PhotoDocumentation)
class PhotoDocumentationAdmin(admin.ModelAdmin):
    list_display = ('project', 'proponent', 'description', 'date_uploaded')
    search_fields = ('project__title', 'proponent__username')

@admin.register(OtherFiles)
class OtherFilesAdmin(admin.ModelAdmin):
    list_display = ('project', 'proponent', 'description', 'date_uploaded')
    search_fields = ('project__title', 'proponent__username')

@admin.register(ChecklistAssignment)
class ChecklistAssignmentAdmin(admin.ModelAdmin):
    list_display = ('project', 'proponent', 'is_completed', 'completion_date')
    search_fields = ('project__title', 'proponent__username')
    list_filter = ('is_completed',)

# @admin.register(Evaluation)
# class EvaluationAdmin(admin.ModelAdmin):
#     list_display = ('trainer', 'project', 'attendee_name', 'overall_rating', 'submitted_at', 'evaluation_link')
#     search_fields = ('attendee_name', 'project__projectTitle', 'trainer__faculty')
#     list_filter = ('project', 'trainer')
    
#     def get_queryset(self, request):
#         qs = super().get_queryset(request)
#         return qs.filter(project__status='approved') 

#     def overall_rating(self, obj):
#         return obj.stored_overall_rating or "N/A"
#     overall_rating.short_description = 'Average Overall Rating'

#     def get_date_submitted(self, obj):
#         return obj.submitted_at
#     get_date_submitted.short_description = 'Date Submitted'

#     def trainer_project(self, obj):
#         if obj.trainer and obj.project:
#             return f"{obj.trainer.faculty} ({obj.project.projectTitle})"
#         return "No Trainer/Project"
#     trainer_project.short_description = "Trainer and Project"

#     def evaluation_link(self, obj):
#         if obj.trainer and obj.project:
#             url = reverse('evaluation_form', args=[obj.trainer.LOTID, obj.project.projectID])
#             return format_html('<a href="{}" target="_blank">Evaluate</a>', url)
#         return "N/A"
#     evaluation_link.short_description = 'Evaluation Form Link'
    
#     def changelist_view(self, request, extra_context=None):
#         extra_context = extra_context or {}
#         extra_context['title'] = "Evaluations Grouped by Trainer and Project"
#         return super().changelist_view(request, extra_context=extra_context)

@admin.register(Evaluation)
class EvaluationAdmin(admin.ModelAdmin):
    list_display = ('trainer', 'project', 'attendee_name', 'overall_rating', 'submitted_at')
    search_fields = ('attendee_name', 'project__projectTitle', 'trainer__faculty')
    list_filter = ('project', 'trainer')
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(project__status='approved')

    def overall_rating(self, obj):
        return obj.overall_rating or "N/A"
    overall_rating.short_description = 'Average Overall Rating'

    def evaluation_link(self, obj):
        try:
            # Attempt to reverse the URL
            if obj.trainer and obj.project:
                url = reverse('evaluation_form', args=[obj.trainer.LOTID, obj.project.projectID])
                return format_html('<a href="{}" target="_blank">Evaluate</a>', url)
        except Exception:
            # Handle missing or undefined URL gracefully
            return "N/A"
    evaluation_link.short_description = 'Evaluation Form Link'

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context['title'] = "Evaluations Grouped by Trainer and Project"
        return super().changelist_view(request, extra_context=extra_context)


@admin.register(EvaluationSharableLink)
class EvaluationSharableLinkAdmin(admin.ModelAdmin):
    list_display = ('id', 'trainer', 'project', 'expiration_date', 'created_at', 'sharable_link')
    list_filter = ('expiration_date', 'created_at')
    search_fields = ('trainer__faculty', 'project__projectTitle', 'token')
    ordering = ('-created_at',)
    readonly_fields = ('sharable_link',)

@admin.register(EvaluationSummary)
class EvaluationSummaryAdmin(admin.ModelAdmin):
    list_display = ('project', 'total_evaluations', 'last_updated')
    search_fields = ('project__name',)
    list_filter = ('last_updated',)    

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


@admin.register(AttendanceTemplate)
class AttendanceTemplateAdmin(admin.ModelAdmin):
    list_display = ['templateName', 'project', 'created_at']


@admin.register(CreatedAttendanceRecord)
class CreatedAttendanceRecordAdmin(admin.ModelAdmin):
    list_display = ['id', 'project', 'attendee_name', 'submitted_at']