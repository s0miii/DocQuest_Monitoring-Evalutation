from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Documents, Checklist, Progress
from docquestapp.models import Project
from .serializers import ChecklistSerializer, DocumentsSerializer, ProgressSerializer
from rest_framework.permissions import IsAuthenticated

# Checklist Viewset
class ChecklistViewSet(viewsets.ModelViewSet):
    queryset = Checklist.objects.all()
    serializer_class = ChecklistSerializer

# Document Viewset for Uploads
class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Documents.objects.all()
    serializer_class = DocumentsSerializer

    # Progress is updated automatically when a document is created
    def perform_create(self, serializer):
        document = serializer.save()
        if document.status == 'submitted':
            # Update progress
            progress, created = Progress.objects.get_or_create(project=document.project)
            progress.update_progress()

# Progress Viewset for Tracking
class ProgressViewSet(viewsets.ModelViewSet):
    queryset = Progress.objects.all()
    serializer_class = ProgressSerializer
    permission_classes = [IsAuthenticated]

    # Action to retrieve specific progress details
    @action(detail=True, methods=['get'])
    def get_progress(self, request, pk=None):
        progress = self.get_object()
        serializer = self.get_serializer(progress)
        return Response(serializer.data)
