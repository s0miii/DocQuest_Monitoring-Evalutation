from rest_framework import status, viewsets, generics
from rest_framework.views import APIView, View
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import get_object_or_404, render, redirect
from docquestapp.models import Project, LoadingOfTrainers
from .models import *
from .forms import *
from .serializers import *

## Form Views

class DailyAttendanceUploadView(LoginRequiredMixin, CreateView):
    model = DailyAttendanceRecord
    form_class = DailyAttendanceForm
    template_name = 'monitoring/daily_attendance_form.html'
    success_url = reverse_lazy('monitoring_evaluation:attendance_list')

    def form_valid(self, form):
        form.instance.proponent = self.request.user
        return super().form_valid(form)

class SummaryOfEvaluationUploadView(LoginRequiredMixin, CreateView):
    model = SummaryOfEvaluation
    form_class = SummaryOfEvaluationForm
    template_name = 'monitoring_evaluation/summary_of_evaluation_form.html'
    success_url = reverse_lazy('monitoring_evaluation:evaluation_list')

    def form_valid(self, form):
        form.instance.proponent = self.request.user
        return super().form_valid(form)
class ModulesLectureNotesUploadView(LoginRequiredMixin, CreateView):
    model = ModulesLectureNotes
    form_class = ModulesLectureNotesForm
    template_name = 'monitoring_evaluation/modules_lecture_notes_form.html'
    success_url = reverse_lazy('monitoring_evaluation:lecture_notes_list')
    
    def form_valid(self, form):
        form.instance.proponent = self.request.user
        return super().form_valid(form)

class PhotoDocumentationUploadView(LoginRequiredMixin, CreateView):
    model = PhotoDocumentation
    form_class = PhotoDocumentationForm
    template_name = 'monitoring_evaluation/photo_documentation_form.html'
    success_url = reverse_lazy('monitoring_evaluation:photo_list')
    
    def form_valid(self, form):
        form.instance.proponent = self.request.user
        return super().form_valid(form)
    
class OtherFilesUploadView(LoginRequiredMixin, CreateView):
    model = OtherFiles
    form_class = OtherFilesForm
    template_name = 'monitoring_evaluation/other_files_form.html'
    success_url = reverse_lazy('monitoring_evaluation:other_files_list')
    
    def form_valid(self, form):
        form.instance.proponent = self.request.user
        return super().form_valid(form)
    
class ChecklistAssignmentView(LoginRequiredMixin, CreateView):
    model = ChecklistAssignment
    fields = [
        'project',
        'proponent',
        'daily_attendance',
        'summary_of_evaluation',
        'modules_lecture_notes',
        'photo_documentation',
        'other_files'
        ]
    template_name = 'monitoring_evaluation/checklist_assignment_form.html'
    success_url = reverse_lazy('monitoring_evaluation:assignment_list')
    
    def form_valid(self, form): 
        form.instance.proponent = self.request.user
        return super().form_valid(form)

class AccomplishmentReportCreateView(LoginRequiredMixin, CreateView):
    model = AccomplishmentReport
    form_class = AccomplishmentReportForm
    template_name = 'monitoring_evaluation/accomplishment_report_form.html'
    success_url = reverse_lazy('monitoring_evaluation:report_list')
    def form_valid(self, form):
        form.instance.submitted_by = self.request.user
        return super().form_valid(form)

class AccomplishmentReportDetailView(LoginRequiredMixin, View):
    def get(self, request, pk):
        report = get_object_or_404(AccomplishmentReport, pk=pk)
        return render(request, 'monitoring_evaluation/accomplishment_report_detail.html', {'report': report})

class PREXCAchievementCreateView(LoginRequiredMixin, CreateView):
    model = PREXCAchievement
    form_class = PREXCAchievementForm
    template_name = 'monitoring_evaluation/prexc_achievement_form.html'
    success_url = reverse_lazy('monitoring_evaluation:prexc_achievement_list')
    
    def form_valid(self, form):
        form.instance.submitted_by = self.request.user
        return super().form_valid(form)
    
class ProjectNarrativeCreateView(LoginRequiredMixin, CreateView):
    model = ProjectNarrative
    form_class = ProjectNarrativeForm
    template_name = 'monitoring_evaluation/project_narrative_form.html'
    success_url = reverse_lazy('monitoring_evaluation:project_narrative_list')
    def form_valid(self, form):
        form.instance.submitted_by = self.request.user
        return super().form_valid(form)
    
# API Views
class DailyAttendanceRecordViewSet(viewsets.ModelViewSet): 
    queryset = DailyAttendanceRecord.objects.all()
    serializer_class = DailyAttendanceRecordSerializer
    
class SummaryOfEvaluationViewSet(viewsets.ModelViewSet):
    queryset = SummaryOfEvaluation.objects.all()
    serializer_class = SummaryOfEvaluationSerializer
    
class ModulesLectureNotesViewSet(viewsets.ModelViewSet):
    queryset = ModulesLectureNotes.objects.all()
    serializer_class = ModulesLectureNotesSerializer
    
class PhotoDocumentationViewSet(viewsets.ModelViewSet): 
    queryset = PhotoDocumentation.objects.all()
    serializer_class = PhotoDocumentationSerializer
    
class OtherFilesViewSet(viewsets.ModelViewSet):
    queryset = OtherFiles.objects.all()
    serializer_class = OtherFilesSerializer
    
class ChecklistAssignmentViewSet(viewsets.ModelViewSet):
    queryset = ChecklistAssignment.objects.all()
    serializer_class = ChecklistAssignmentSerializer
    
class AccomplishmentReportViewSet(viewsets.ModelViewSet):
    queryset = AccomplishmentReport.objects.all()
    serializer_class = AccomplishmentReportSerializer

class PREXCAchievementViewSet(viewsets.ModelViewSet):
    queryset = PREXCAchievement.objects.all()
    serializer_class = PREXCAchievementSerializer

class ProjectNarrativeViewSet(viewsets.ModelViewSet):
    queryset = ProjectNarrative.objects.all()
    serializer_class = ProjectNarrativeSerializer

# Evaluation Viewset for Evaluation Forms
class EvaluationViewSet(viewsets.ModelViewSet):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer

    @action(detail=True, methods=['get'])
    def generate_evaluation_url(self, request, pk=None):
        trainer = get_object_or_404(LoadingOfTrainers, LOTID=pk)
        project_id = request.query_params.get('project_id')

        if not project_id:
            return Response({"error": "Project ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        project = get_object_or_404(Project, id=project_id)

        # Generate the evaluation URL
        evaluation_url = f"{request.build_absolute_uri('/')[:-1]}/evaluation/{trainer.LOTID}/{project.id}/"
        return Response({"evaluation_url": evaluation_url}, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# Evaluation Form View for HTML Form Submission
def evaluation_form_view(request, trainer_id, project_id):
    # Retrieve the specific Trainer and Project
    trainer = get_object_or_404(LoadingOfTrainers, LOTID=trainer_id)
    project = get_object_or_404(Project, projectID=project_id)

    if request.method == 'POST':
        form = EvaluationForm(request.POST)
        if form.is_valid():
            evaluation = form.save(commit=False)
            evaluation.trainer = trainer
            evaluation.project = project
            evaluation.stored_overall_rating = evaluation.calculate_overall_rating()
            evaluation.save()

            print("Stored Overall Rating:", evaluation.stored_overall_rating)

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

