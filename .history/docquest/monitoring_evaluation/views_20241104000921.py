from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import Documents,Checklist, Progress, Evaluation
from docquestapp.models import Project, Proponents
from .serializers import ChecklistSerializer, DocumentsSerializer, ProgressSerializer, EvaluationSerializer
from .forms import EvaluationForm


# Checklist Viewset
class ChecklistViewSet(viewsets.ModelViewSet):
    queryset = Checklist.objects.all()
    serializer_class = ChecklistSerializer

# Document Viewset for Uploads
class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Documents.objects.all()
    serializer_class = DocumentsSerializer

    def create(self, request, *args, **kwargs):
        project_id = request.data.get('project_id')
        checklist_item_id = request.data.get('checklist_item_id')

        #validate project
        try:
            project = Project.objects.get(projectID=project_id)
        except Project.DoesNotExist:
            return Response({'error': 'Project does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        
        # validate checklist item
        try:
            checklist_item = Checklist.objects.get(id=checklist_item_id, project=project)
        except Checklist.DoesNotExist:
            return Response({'error': 'Checklist item does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        

        #create Document
        document = Documents.objects.create(
            project=project,
            name=request.data.get('name'),
            file=request.FILES.get('file'),
            checklist_item=checklist_item
        )

        # update progress
        progress, created = Progress.objects.get_or_create(project=project)
        # update completed items if it's the first time fulfilling this checklist item
        if Documents.objects.filter(project=project, checklist_item=checklist_item).count == 1:
            progress.completed_items += 1
        progress.total_items = Checklist.objects.filter(project=project).count()
        progress.save

        serializer = self.get_serializer(document)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# Progress Viewset for Tracking
class ProgressViewSet(viewsets.ModelViewSet):
    queryset = Progress.objects.all()
    serializer_class = ProgressSerializer

    @action(detail=True, methods=['get'])
    def get_progress(self, request, pk=None):
        project = Project.objects.get(pk=pk)
        progress = Progress.objects.get(project=project)
        serializer = self.get_serializer(progress)
        return Response(serializer.data)

# Evaluation Viewset for Evaluation Forms
class EvaluationViewSet(viewsets.ModelViewSet):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer

    @action(detail=True, methods=['get'])
    def generate_evaluation_url(self, request, pk=None):
        # """
        # Generate a unique URL for the proponent's evaluation form.
        # """
        proponent = get_object_or_404(Proponents, pk=pk)
        project_id = request.query_params.get('project_id')

        if not project_id:
            return Response({"error": "Project ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        project = get_object_or_404(Project, id=project_id)

        # Generate the evaluation URL
        evaluation_url = f"{request.build_absolute_uri('/')[:-1]}/evaluation/{proponent.id}/{project.id}/"
        return Response({"evaluation_url": evaluation_url}, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        # """
        # Handle submission of evaluation form data by attendees.
        # """
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
            evaluation.save()
            return redirect('evaluation_thank_you')  # Redirect to a thank-you page after submission
    else:
        form = EvaluationForm()

    # Render the form with the necessary context
    return render(request, 'evaluation_form.html', {'form': form, 'proponent': proponent, 'project': project})    