from django.contrib import admin
from .models import Checklist, Documents, Progress, AttendanceRecord, Evaluation
from django.urls import reverse
from django.utils.html import format_html

@admin.register(Checklist)
class ChecklistAdmin(admin.ModelAdmin):
    list_display = ('item_name', 'project', 'is_required')
    search_fields = ('item_name', 'project__projectTitle')
    list_filter = ('is_required',)

@admin.register(Documents)
class DocumentsAdmin(admin.ModelAdmin):
    list_display = ('project', 'checklist_item', 'upload_date', 'status')
    search_fields = ('checklist_item__item_name', 'project__projectTitle')
    list_filter = ('status', 'upload_date')

@admin.register(Progress)
class ProgressAdmin(admin.ModelAdmin):
    list_display = ('project', 'completed_items', 'total_items', 'percentage')
    search_fields = ('project__projectTitle',)
    list_filter = ('percentage',)

@admin.register(AttendanceRecord)
class AttendanceRecordAdmin(admin.ModelAdmin):
    list_display = ('upload_date', 'total_attendees')

# Register Evaluation model
@admin.register(Evaluation)
class EvaluationAdmin(admin.ModelAdmin):
    list_display = ('trainer', 'project', 'attendee_name', 'stored_overall_rating', 'submitted_at', 'evaluation_link')
    search_fields = ('attendee_name', 'project__projectTitle', 'trainer__faculty')
    list_filter = ('project', 'trainer')
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(project__status='approved') 

    def get_overall_rating(self, obj):
        return obj.stored_overall_rating
    get_overall_rating.short_description = 'Average Overall Rating'

    def get_date_submitted(self, obj):
        return obj.submitted_at
    get_date_submitted.short_description = 'Date Submitted'

    def trainer_project(self, obj):
        if obj.trainer and obj.project:
            return f"{obj.trainer.faculty} ({obj.project.projectTitle})"
        return "No Trainer/Project"
    trainer_project.short_description = "Trainer and Project"

    def evaluation_link(self, obj):
        if obj.trainer and obj.project:
            url = reverse('evaluation_form', args=[obj.trainer.LOTID, obj.project.projectID])
            return format_html('<a href="{}" target="_blank">Evaluate</a>', url)
        return "N/A"
    evaluation_link.short_description = 'Evaluation Form Link'
    
    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context['title'] = "Evaluations Grouped by Trainer and Project"
        return super().changelist_view(request, extra_context=extra_context)


