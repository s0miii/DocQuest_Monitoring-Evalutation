from django.contrib import admin
from .models import Checklist, Documents, Progress
from docquestapp.models import Project

# Register Checklist with project information
@admin.register(Checklist)
class ChecklistAdmin(admin.ModelAdmin):
    list_display = ('item_name', 'project')  # Display checklist item and its project
    list_filter = ('project',)  # Filter by project to easily categorize
    search_fields = ('item_name', 'project__projectTitle')  # Search by item name or project title

# Register Document with project and checklist information
@admin.register(Documents)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('name', 'project', 'checklist_item')  # Display document name, project, and related checklist item
    list_filter = ('project',)  # Filter by project to easily categorize documents
    search_fields = ('name', 'project__projectTitle', 'checklist_item__item_name')  # Search fields for ease of navigation

# Register Progress model
@admin.register(Progress)
class ProgressAdmin(admin.ModelAdmin):
    list_display = ('project', 'completed_items', 'total_items', 'calculate_progress_percentage')
    list_filter = ('project',)
    search_fields = ('project__projectTitle',)
