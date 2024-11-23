from django.urls import path, include
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter
from .views import *

app_name = 'monitoring_evaluation'

router = DefaultRouter()
# router.register(r'checklists', ChecklistViewSet)
# router.register(r'documents', DocumentViewSet)
# router.register(r'progress', ProgressViewSet)
router.register(r'evaluation', EvaluationViewSet)
### Checklist & Items
router.register(r'daily_attendance', DailyAttendanceRecordViewSet)
router.register(r'evaluations', SummaryOfEvaluationViewSet)
router.register(r'lecture_notes', ModulesLectureNotesViewSet)
router.register(r'photo_documentations', PhotoDocumentationViewSet)
router.register(r'other_files', OtherFilesViewSet)
router.register(r'checklist_assignments', ChecklistAssignmentViewSet)
router.register(r'accomplishment_reports', AccomplishmentReportViewSet)
router.register(r'prexc_achievements', PREXCAchievementViewSet)
router.register(r'project_narratives', ProjectNarrativeViewSet)


urlpatterns = [
    path('', include(router.urls)),
    ### Checklist & items
    # upload
    path('upload/attendance/<int:project_id>/', DailyAttendanceUploadView.as_view(), name='attendance_upload'),
    path('upload/evaluation/<int:project_id>/', SummaryOfEvaluationUploadView.as_view(), name='evaluation_upload'),
    path('upload/lecture_notes/<int:project_id>/', ModulesLectureNotesUploadView.as_view(), name='lecture_notes_upload'),
    path('upload/photo/<int:project_id>/', PhotoDocumentationUploadView.as_view(), name='photo_upload'),
    path('upload/other_files/<int:project_id>/', OtherFilesUploadView.as_view(), name='other_files_upload'),
    # view submissions
    path('project/<int:project_id>/checklist_submissions/', ChecklistSubmissionsView.as_view(), name='checklist_submissions'),
    # assign checklist item
    path('assign/checklist_items/', AssignChecklistItemsView.as_view(), name='assign_checklist_items'),
    

    
    # Accomplishment Report
    path('create/report/', AccomplishmentReportCreateView.as_view(), name='report_create'),
    path('report/<int:pk>/', AccomplishmentReportDetailView.as_view(), name='report_detail'),
    path('create/prexc_achievement/', PREXCAchievementCreateView.as_view(), name='prexc_achievement_create'),
    path('create/project_narrative/', ProjectNarrativeCreateView.as_view(), name='project_narrative_create'),

    # Evaluation
    path('evaluation/<int:trainer_id>/<int:project_id>/', evaluation_form_view, name='evaluation_form'),
    path('evaluation_thank_you/', TemplateView.as_view(template_name="thank_you.html"), name='evaluation_thank_you'),
    path('evaluation_summary/', evaluation_summary_view, name='evaluation_summary'),

]
