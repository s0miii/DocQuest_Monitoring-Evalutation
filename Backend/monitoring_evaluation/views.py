from rest_framework import status, viewsets, generics
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from django.shortcuts import get_object_or_404, render
from .models import Evaluation, AccomplishmentReport, ProjectNarrative
from docquestapp.models import Project, LoadingOfTrainers
from .serializers import EvaluationSerializer, AccomplishmentReportSerializer, ProjectNarrativeSerializer
from .forms import EvaluationForm
from rest_framework.permissions import IsAuthenticated

# # Checklist Viewset
# class ChecklistViewSet(viewsets.ModelViewSet):
#     queryset = Checklist.objects.all()
#     serializer_class = ChecklistSerializer

# # Document Viewset for Uploads
# class DocumentViewSet(viewsets.ModelViewSet):
#     queryset = Documents.objects.all()
#     serializer_class = DocumentsSerializer

#     # Progress is updated automatically when a document is created
#     def perform_create(self, serializer):
#         document = serializer.save()
#         if document.status == 'submitted':
#             # Update progress
#             progress, created = Progress.objects.get_or_create(project=document.project)
#             progress.update_progress()

# # Progress Viewset for Tracking
# class ProgressViewSet(viewsets.ModelViewSet):
#     queryset = Progress.objects.all()
#     serializer_class = ProgressSerializer
#     permission_classes = [IsAuthenticated]

#     # Action to retrieve specific progress details
#     @action(detail=True, methods=['get'])
#     def get_progress(self, request, pk=None):
#         progress = self.get_object()
#         serializer = self.get_serializer(progress)
#         return Response(serializer.data)

# # AttendanceRecord Viewset for Attendance
# class AttendanceRecordListCreateView(generics.ListCreateAPIView):
#     queryset = AttendanceRecord.objects.all()
#     serializer_class = AttendanceRecordSerializer

# Evaluation ViewSet for Evaluation Forms
class EvaluationViewSet(viewsets.ModelViewSet):
    # queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer

    def get_queryset(self):
        return Evaluation.objects.filter(project__status='approved')

    @action(detail=True, methods=['get'])
    def generate_evaluation_url(self, request, pk=None):
        trainer = get_object_or_404(LoadingOfTrainers, LOTID=pk)
        project_id = request.query_params.get('project_id')

        if not project_id:
            return Response({"error": "Project ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        project = get_object_or_404(Project, id=project_id)

        evaluation_url = f"{request.build_absolute_uri('/')[:-1]}/evaluation/{trainer.LOTID}/{project.id}/"
        return Response({"evaluation_url": evaluation_url}, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# Evaluation Form View for HTML Form Submission
def evaluation_form_view(request, project_id, trainer_id=None):
    project = get_object_or_404(Project, projectID=project_id)
    trainer = get_object_or_404(LoadingOfTrainers, LOTID=trainer_id) if trainer_id else None #Set trainer to None if not provided for project-only evaluations

    if request.method == 'POST':
        form = EvaluationForm(request.POST)
        if form.is_valid():
            evaluation = form.save(commit=False)
            evaluation.project = project
            if trainer:
                evaluation.trainer = trainer
            evaluation.stored_overall_rating = evaluation.calculate_overall_rating()
            evaluation.save()
            
            return render(request, 'thank_you.html', {'stored_overall_rating': evaluation.stored_overall_rating})
    else:
        form = EvaluationForm()

    # Render the form with the necessary context
    return render(request, 'evaluation_form.html', {'form': form, 'trainer': trainer, 'project': project})    

def evaluation_summary_view(request):
    projects = Project.objects.all()
    project_summaries = []

    for project in projects:
        trainers = project.loadingOfTrainers.all()
        trainer_evaluations = []

        for trainer in trainers:
            evaluations = Evaluation.objects.filter(project=project, trainer=trainer)
            if evaluations.exists():
                trainer_evaluations.append({
                    'trainer': trainer,
                    'evaluations': evaluations,
                })

        if trainer_evaluations:
            project_summaries.append({
                'project': project,
                'trainer_evaluations': trainer_evaluations,
            })        

    context = {'project_summaries': project_summaries}
    return render(request, 'evaluation_summary.html', context)            


# Accomplishment Report Views
class AccomplishmentReportListCreateView(generics.ListCreateAPIView):
    queryset = AccomplishmentReport.objects.all()
    serializer_class = AccomplishmentReportSerializer

class AccomplishmentReportDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AccomplishmentReport.objects.all()
    serializer_class = AccomplishmentReportSerializer

# Project Narrative Views
class ProjectNarrativeListCreateView(generics.ListCreateAPIView):
    queryset = ProjectNarrative.objects.all()
    serializer_class = ProjectNarrativeSerializer

class ProjectNarrativeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProjectNarrative.objects.all()
    serializer_class = ProjectNarrativeSerializer
