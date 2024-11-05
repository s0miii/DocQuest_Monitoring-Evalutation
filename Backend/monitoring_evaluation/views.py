from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404, render, redirect
from .models import Documents, Checklist, Progress, Evaluation
from docquestapp.models import Project, Proponents
from .serializers import ChecklistSerializer, DocumentsSerializer, ProgressSerializer, EvaluationSerializer
from .forms import EvaluationForm
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

# Evaluation Viewset for Evaluation Forms
class EvaluationViewSet(viewsets.ModelViewSet):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer

    @action(detail=True, methods=['get'])
    def generate_evaluation_url(self, request, pk=None):
        proponent = get_object_or_404(Proponents, pk=pk)
        project_id = request.query_params.get('project_id')

        if not project_id:
            return Response({"error": "Project ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        project = get_object_or_404(Project, id=project_id)

        # Generate the evaluation URL
        evaluation_url = f"{request.build_absolute_uri('/')[:-1]}/evaluation/{proponent.id}/{project.id}/"
        return Response({"evaluation_url": evaluation_url}, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# Evaluation Form View for HTML Form Submission
def evaluation_form_view(request, proponent_id, project_id):
    # Retrieve the specific Proponent and Project
    proponent = get_object_or_404(Proponents, id=proponent_id)
    project = get_object_or_404(Project, projectID=project_id)

    if request.method == 'POST':
        form = EvaluationForm(request.POST)
        if form.is_valid():
            evaluation = form.save(commit=False)
            evaluation.proponents = proponent
            evaluation.project = project
            evaluation.stored_overall_rating = evaluation.calculate_overall_rating()
            evaluation.save()

            return render(request, 'thank_you.html', {'stored_overall_rating': evaluation.stored_overall_rating})
    else:
        form = EvaluationForm()

    # Render the form with the necessary context
    return render(request, 'evaluation_form.html', {'form': form, 'proponent': proponent, 'project': project})    
