from django.urls import path, include
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter
from .views import EvaluationViewSet, evaluation_form_view, evaluation_summary_view, AccomplishmentReportListCreateView, AccomplishmentReportDetailView, ProjectNarrativeListCreateView, ProjectNarrativeDetailView


router = DefaultRouter()
# router.register(r'checklists', ChecklistViewSet)
# router.register(r'documents', DocumentViewSet)
# router.register(r'progress', ProgressViewSet)
router.register(r'evaluation', EvaluationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # path('attendance-records/', AttendanceRecordListCreateView.as_view(), name='attendance-record-list-create'),
    path('evaluation/<int:trainer_id>/<int:project_id>/', evaluation_form_view, name='evaluation_form'),
    path('evaluation_thank_you/', TemplateView.as_view(template_name="thank_you.html"), name='evaluation_thank_you'),
    path('evaluation_summary/', evaluation_summary_view, name='evaluation_summary'),
    path('accomplishment-reports/', AccomplishmentReportListCreateView.as_view(), name='accomplishment_report_list'),
    path('accomplishment-reports/<int:pk>/', AccomplishmentReportDetailView.as_view(), name='accomplishment_report_detail'),
    path('project-narratives/', ProjectNarrativeListCreateView.as_view(), name='project_narrative_list'),
    path('project-narratives/<int:pk>/', ProjectNarrativeDetailView.as_view(), name='project_narrative_detail'),
    ]
