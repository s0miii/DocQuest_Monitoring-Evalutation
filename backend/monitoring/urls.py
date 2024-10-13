from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserProfileViewSet,
    ProjectViewSet,
    AccomplishmentReportViewSet,
    EvaluationSummaryViewSet,
    DocumentViewSet,
    get_mock_projects,
)

router = DefaultRouter()
router.register(r'users', UserProfileViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'accomplishment_reports', AccomplishmentReportViewSet)
router.register(r'evaluation_summaries', EvaluationSummaryViewSet)
router.register(r'documents', DocumentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('mock-projects/', get_mock_projects, name='mock_projects'),
]
