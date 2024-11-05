from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChecklistViewSet, DocumentViewSet, ProgressViewSet, EvaluationViewSet, evaluation_form_view

router = DefaultRouter()
router.register(r'checklists', ChecklistViewSet)
router.register(r'documents', DocumentViewSet)
router.register(r'progress', ProgressViewSet)
router.register(r'evaluation', EvaluationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('evaluation/<int:proponent_id>/<int:project_id>/', evaluation_form_view, name='evaluation_form'),
    path('thank-you/', TemplateView.as_view(template_name="thank_you.html"), name='evaluation_thank_you'),
]
