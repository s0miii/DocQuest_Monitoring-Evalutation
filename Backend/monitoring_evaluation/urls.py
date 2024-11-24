from django.urls import path, include
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter
from .views import *

app_name = 'monitoring_evaluation'

router = DefaultRouter()
# router.register(r'checklists', ChecklistViewSet)
# router.register(r'documents', DocumentViewSet)
# router.register(r'progress', ProgressViewSet)
router.register(r'evaluation', EvaluationViewSet, basename='evaluation')
router.register(r'attendance_templates', AttendanceTemplateViewSet, basename='attendance_template')
router.register(r'attendance_records', AttendanceRecordViewSet, basename='attendance_record')
### Checklist Items
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
    # Checklist
    path('upload/attendance/', DailyAttendanceUploadView.as_view(), name='attendance_upload'),
    path('upload/evaluation/', SummaryOfEvaluationUploadView.as_view(), name='evaluation_upload'),
    path('upload/lecture_notes/', ModulesLectureNotesUploadView.as_view(), name='lecture_notes_upload'),
    path('upload/photo/', PhotoDocumentationUploadView.as_view(), name='photo_upload'),
    path('upload/other_files/', OtherFilesUploadView.as_view(), name='other_files_upload'),
    path('assign/checklist/', ChecklistAssignmentView.as_view(), name='checklist_assignment'),
    
    # Accomplishment Report
    path('create/report/', AccomplishmentReportCreateView.as_view(), name='report_create'),
    path('report/<int:pk>/', AccomplishmentReportDetailView.as_view(), name='report_detail'),
    path('create/prexc_achievement/', PREXCAchievementCreateView.as_view(), name='prexc_achievement_create'),
    path('create/project_narrative/', ProjectNarrativeCreateView.as_view(), name='project_narrative_create'),

    # Evaluation
    # path(
    #     "evaluation/generate/<int:trainer_id>/<int:project_id>/",
    #     EvaluationViewSet.generate_evaluation_url,
    #     name="generate_evaluation_url",
    # ),
    path('evaluation/generate_evaluation_url/', EvaluationViewSet.as_view({'get': 'generate_evaluation_url'})),
    path('evaluation/<int:trainer_id>/<int:project_id>/', evaluation_form_view, name='evaluation_form'),
    path('evaluation/<int:project_id>/', evaluation_form_view, name='evaluation_form_project_only'),
    path('evaluation_thank_you/', TemplateView.as_view(template_name="thank_you.html"), name='evaluation_thank_you'),
    path('evaluation_summary/', evaluation_summary_view, name='evaluation_summary'),

    # Attendance
    path('test/create-template/', create_attendance_template, name='create_attendance_template'),
    path('test/submit-record/', submit_attendance_record, name='submit_attendance_record'),
]
