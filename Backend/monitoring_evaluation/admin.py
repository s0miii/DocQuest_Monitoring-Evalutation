from django.contrib import admin
from .models import *
from django.urls import reverse
from django.utils.html import format_html
from django import forms

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

@admin.register(TrainerCvDtr)
class TrainerCvDtrAdmin(admin.ModelAdmin):
    list_display = ('project', 'proponent', 'description', 'date_uploaded')
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


# Custom Form for AccomplishmentReportAdmin
class AccomplishmentReportForm(forms.ModelForm):
    class Meta:
        model = AccomplishmentReport
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Ensure 'project' field displays available projects
        self.fields['project'].queryset = Project.objects.filter(status='approved')
@admin.register(AccomplishmentReport)
class AccomplishmentReportAdmin(admin.ModelAdmin):
    form = AccomplishmentReportForm  # Attach the custom form

    list_display = (
        'id', 
        'project_link', 
        'banner_program_title', 
        'flagship_program', 
        'training_modality', 
        'actualStartDateImplementation',
        'actualEndDateImplementation', 
        'total_number_of_days', 
        'submitted_by', 
        'get_project_title', 
        'get_project_type', 
        'get_project_category', 
        'get_research_title', 
        'get_proponents', 
        'get_program', 
        'get_accreditation_level', 
        'get_college', 
        'get_target_groups_beneficiaries', 
        'get_project_location', 
        'get_partner_agency',
        'get_prexc_achievement',
        'get_project_narrative',
    )
    search_fields = (
        'banner_program_title', 
        'flagship_program', 
        'training_modality', 
        'project__projectTitle', 
        'submitted_by__email',
    )
    list_filter = (
        'actualStartDateImplementation',
        'actualEndDateImplementation',
        'training_modality', 
    )
    ordering = ('-actualStartDateImplementation',)

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.select_related(
            'project', 
            'submitted_by',
            'prexc_achievement',
            'project_narrative'
        ).prefetch_related(
            'project__proponents', 
            'project__program', 
            'project__agency'
        )
    
    def project_link(self, obj):
        if obj.project:
            url = reverse("admin:docquestapp_project_change", args=[obj.project.projectID])
            return format_html('<a href="{}">{}</a>', url, obj.project.projectTitle)
        return "N/A"
    project_link.short_description = "Project"

    def get_project_title(self, obj):
        return obj.project_title if obj.project else "N/A"
    get_project_title.short_description = 'Project Title'

    def get_project_type(self, obj):
        return obj.project_type if obj.project else "N/A"
    get_project_type.short_description = 'Project Type'

    def get_project_category(self, obj):
        if obj.project:
            return ", ".join([category.title for category in obj.project.projectCategory.all()])
        return "N/A"
    get_project_category.short_description = 'Project Category'

    def get_research_title(self, obj):
        return obj.research_title if obj.project else "N/A"
    get_research_title.short_description = 'Research Title'

    def get_proponents(self, obj):
        if obj.project:
            return ", ".join([f"{proponent.firstname} {proponent.lastname}" for proponent in obj.project.proponents.all()])
        return "N/A"

    def get_program(self, obj):
        if obj.project:
            return ", ".join([program.title for program in obj.project.program.all()])
        return "N/A"
    get_program.short_description = 'Program'

    def get_accreditation_level(self, obj):
        return obj.accreditation_level if obj.project else "N/A"
    get_accreditation_level.short_description = 'Accreditation Level'

    def get_college(self, obj):
        return obj.college if obj.project else "N/A"
    get_college.short_description = 'College'

    def get_target_groups_beneficiaries(self, obj):
        return obj.target_groups_beneficiaries if obj.project else "N/A"
    get_target_groups_beneficiaries.short_description = 'Beneficiaries'

    def get_project_location(self, obj):
        return obj.project_location if obj.project else "N/A"
    get_project_location.short_description = 'Project Location'

    def get_partner_agency(self, obj):
        if obj.project:
            return ", ".join([str(a) for a in obj.project.agency.all()])
        return "N/A"
    get_partner_agency.short_description = 'Partner Agency'

    def get_prexc_achievement(self, obj):
        return obj.prexc_achievement.id if obj.prexc_achievement else "N/A"
    get_prexc_achievement.short_description = 'PREXC Achievement ID'

    def get_project_narrative(self, obj):
        return obj.project_narrative.id if obj.project_narrative else "N/A"
    get_project_narrative.short_description = 'Project Narrative ID'

@admin.register(ProjectNarrative)
class ProjectNarrativeAdmin(admin.ModelAdmin):
    list_display = (
        'id', 
        'activities_topics', 
        'issues_challenges', 
        'participant_engagement_quality', 
        'discussion_comments', 
        'ways_forward_plans',
    )
    ordering = ('-project__dateCreated',)

@admin.register(PREXCAchievement)
class PREXCAchievementAdmin(admin.ModelAdmin):
    list_display = (
        'persons_trained_weighted_days', 
        'actual_trainees', 
        'actual_days_training',
        'persons_trained', 
        'satisfactory_trainees', 
        'rating_percentage'
    )
    search_fields = ('accomplishment_report__project__projectTitle',)
    list_filter = ('rating_percentage', 'actual_days_training')
    ordering = ('rating_percentage',)

@admin.register(AttendanceTemplate)
class AttendanceTemplateAdmin(admin.ModelAdmin):
    list_display = ['templateName', 'project', 'created_at']


@admin.register(CreatedAttendanceRecord)
class CreatedAttendanceRecordAdmin(admin.ModelAdmin):
    list_display = ['id', 'project', 'attendee_name', 'submitted_at']


#For PREXC Report
# OP2
@admin.register(ExtensionProgramOp2)
class ExtensionProgramOp2Admin(admin.ModelAdmin):
    list_display = ('id', 'mandated_priority_program','quarter','extension_program', 'from_date', 'to_date', 'campus', 'remarks', 'created_at')
    search_fields = ('mandated_priority_program','quarter', 'extension_program', 'campus')
    list_filter = ('from_date', 'to_date') 
    ordering = ('-created_at',)  

@admin.register(ExtensionProgramOC)
class ExtensionProgramOCAdmin(admin.ModelAdmin):
    list_display = ('memorandum_of_agreements', 'extension_program', 'from_date', 'to_date', 'campus', 'created_at')
    search_fields = ('memorandum_of_agreements', 'extension_program', 'campus')
    list_filter = ('from_date', 'to_date', 'campus')
    ordering = ('-created_at',)

@admin.register(CollegePerformanceRow)
class CollegePerformanceRowAdmin(admin.ModelAdmin):
    list_display = (
        'campus',
        'programs_number',
        'programs_percentage',
        'faculty_number',
        'faculty_percentage',
        'average_percentage',
        'persons_trained_target',
        'persons_trained_weighted_accomplishment',
        'persons_trained_variance',
        'partnerships_target',
        'partnerships_accomplishment',
        'partnerships_variance',
        'beneficiaries_target',
        'beneficiaries_accomplishment',
        'beneficiaries_variance',
        'extension_programs_target',
        'extension_programs_accomplishment',
        'extension_programs_variance',
        'created_at',
        'updated_at',
    )
    list_filter = ('campus',)
    search_fields = ('campus',)    
    