from django.http import JsonResponse
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import UserProfile, Project, AccomplishmentReport, EvaluationSummary, Document
from .serializers import UserSerializer, UserProfileSerializer, ProjectSerializer, AccomplishmentReportSerializer, EvaluationSummarySerializer, DocumentSerializer

# User Profile Viewset
class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

    def create(self, request, *args, **kwargs):
        user_data = request.data.pop('user')
        user = User.objects.create(**user_data)
        user_profile = UserProfile.objects.create(user=user, **request.data)
        serializer = self.get_serializer(user_profile)
        return Response(serializer.data)

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class AccomplishmentReportViewSet(viewsets.ModelViewSet):
    queryset = AccomplishmentReport.objects.all()
    serializer_class = AccomplishmentReportSerializer

class EvaluationSummaryViewSet(viewsets.ModelViewSet):
    queryset = EvaluationSummary.objects.all()
    serializer_class = EvaluationSummarySerializer

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer


# Temporary mock project data !!!
def get_mock_projects(request):
    mock_projects = [
        {
            'id': 1,
            'title': 'Community Outreach Program',
            'description': 'Assisting local communities with resources',
            'start_date': '2024-01-15',
            'end_date': '2024-12-31',
            'status': 'Completed',
        },
        {
            'id': 2,
            'title': 'Environmental Awareness Campaign',
            'description': 'Raising awareness about environmental issues.',
            'start_date': '2024-03-01',
            'end_date': '2024-11-01',
            'status': 'Completed',
        },
        {
            'id': 3,
            'title': 'Paano mag move-on?',
            'description': 'As the title says, paano nga ba?',
            'start_date': '2024-01-01',
            'end_date': '2024-12-31',
            'status': 'On-going',
        }
    ]
    return JsonResponse({'projects': mock_projects}, status=200)





