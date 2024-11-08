from django.contrib import admin
from .models import Checklist, Documents, Progress, Evaluation

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