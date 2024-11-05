from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChecklistViewSet, DocumentViewSet, ProgressViewSet, EvaluationViewSet

router = DefaultRouter()
router.register(r'checklists', ChecklistViewSet)
router.register(r'documents', DocumentViewSet)
router.register(r'progress', ProgressViewSet)
router.register(r'evaluation', EvaluationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
