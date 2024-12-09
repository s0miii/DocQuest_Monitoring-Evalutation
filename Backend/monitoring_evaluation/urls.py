from django.urls import path, include
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from .views import *

app_name = 'monitoring_evaluation'

router = DefaultRouter()
# router.register(r'checklists', ChecklistViewSet)
# router.register(r'documents', DocumentViewSet)
# router.register(r'progress', ProgressViewSet)
router.register(r'evaluations', EvaluationViewSet, basename='evaluation')
router.register(r'evaluation_links', EvaluationSharableLinkViewSet, basename='evaluation_links')
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

    ### User Role
    path('user/roles/', get_user_roles, name='get_user_roles'),

    # Email
    path('projects/<int:project_id>/send_dynamic_reminder/', send_dynamic_reminder_email, name='send_dynamic_reminder'),

    # view all projects
    path("user-projects/", UserProjectsView.as_view(), name="user-projects"),

    # staff view for all projects
    path("staff-projects/", StaffProjectsView.as_view(), name="staff-projects"),

    # document count
    # path("project/<int:project_id>/document_counts/", DocumentCountsView.as_view(), name="document_counts"),
    path("project/<int:project_id>/document_counts/", document_counts, name="document_counts"),

    # View Proponent Project Details
    path('projects/<int:project_id>/details/', ProponentProjectDetailsView.as_view(), name='proponent_project_details'),

    

    # project progress
    path('project/<int:project_id>/progress/', project_progress, name='project_progress'),

    ### Checklist & items
    # upload
    path('upload/attendance/<int:project_id>/', DailyAttendanceUploadView.as_view(), name='attendance_upload'),
    path('upload/evaluation/<int:project_id>/', SummaryOfEvaluationUploadView.as_view(), name='evaluation_upload'),
    path('upload/lecture_notes/<int:project_id>/', ModulesLectureNotesUploadView.as_view(), name='lecture_notes_upload'),
    path('upload/photo_documentation/<int:project_id>/', PhotoDocumentationUploadView.as_view(), name='photo_upload'),
    path('upload/other_files/<int:project_id>/', OtherFilesUploadView.as_view(), name='other_files_upload'),
    
    # Delete submission
    path("submissions/<str:model_name>/<int:submission_id>/", delete_submission, name="delete_submission"),

    
    # view all submissions from a checklist item
    path("project/<int:project_id>/checklist/<str:checklist_item_name>/submissions/", ChecklistItemSubmissionsView.as_view(), name="checklist_item_submissions", ),
    # view submission for a specific item
    # path("project/<int:project_id>/checklist_item/<str:checklist_item_name>/submissions/", ChecklistSubmissionsView.as_view(), name="checklist_item_submissions",),
    # assign checklist item
    path('assign/checklist_items/', AssignChecklistItemsView.as_view(), name='assign_checklist_items'),
    #submission status for project leader
    path("submission/update/<str:model_name>/<int:submission_id>/", UpdateSubmissionStatusView.as_view(), name="update_submission_status"),
    # submission status for proponent
    path("submissions/", ProponentSubmissionsView.as_view(), name="proponent_submissions"),

    # Attendance
    path('attendance/fill/<str:token>/', FillAttendanceView.as_view(), name='fill-attendance'),
    path('attendance_templates/<int:project_id>/', CreateAttendanceTemplateView.as_view(), name='create-attendance-template'),
    path('attendance_records/<int:projectID>/<int:template_id>/', SubmitAttendanceRecordView.as_view(), name='submit-attendance-record'),
    # path('attendance/calculate_total/<int:project_id>/', CalculateTotalAttendeesView.as_view(), name='calculate-total-attendees'),
    path('calculate_attendees/<int:project_id>/', CalculateTotalAttendeesView.as_view(), name='calculate-attendees'),
    path(
        'attendance_templates/create/<int:project_id>/',
        CreateAttendanceTemplateView.as_view(),
        name='create-attendance-template'
    ),

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
    # path('evaluation/generate_evaluation_url/', EvaluationViewSet.as_view({'get': 'generate_evaluation_url'})),
    # path('evaluation/<int:project_id>/', evaluation_form_view, name='evaluation_form_project_only'),
    
    path('evaluation/<int:trainer_id>/<int:project_id>/', evaluation_form_view, name='evaluation_form'),
    path('evaluation_links/', GenerateEvaluationSharableLinkView.as_view(), name="generate_evaluation_link"),
    path("evaluation/fill/<str:token>/", SubmitEvaluationView.as_view(), name='submit_evaluation'),
    # compute summary
    path('project/<int:project_id>/evaluations_summary/', evaluations_summary_view, name='evaluations_summary'),

]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

