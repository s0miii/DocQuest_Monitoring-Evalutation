from rest_framework import status, viewsets, generics
from rest_framework.views import APIView, View
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from rest_framework.permissions import IsAuthenticated
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import get_object_or_404, render, redirect
from django.http import HttpResponseForbidden, JsonResponse
from docquestapp.models import Project, LoadingOfTrainers
from .models import *
from .forms import *
from .serializers import *
import secrets, json

## Form Views

class DailyAttendanceUploadView(LoginRequiredMixin, CreateView):
    model = DailyAttendanceRecord
    form_class = DailyAttendanceForm
    template_name = 'monitoring/daily_attendance_form.html'
    success_url = reverse_lazy('monitoring_evaluation:attendance_list')
    permission_classes = [IsAuthenticated]

    def form_valid(self, form):
        form.instance.proponent = self.request.user
        return super().form_valid(form)

class SummaryOfEvaluationUploadView(LoginRequiredMixin, CreateView):
    model = SummaryOfEvaluation
    form_class = SummaryOfEvaluationForm
    template_name = 'monitoring_evaluation/summary_of_evaluation_form.html'
    success_url = reverse_lazy('monitoring_evaluation:evaluation_list')
    permission_classes = [IsAuthenticated]

    def form_valid(self, form):
        form.instance.proponent = self.request.user
        return super().form_valid(form)
class ModulesLectureNotesUploadView(LoginRequiredMixin, CreateView):
    model = ModulesLectureNotes
    form_class = ModulesLectureNotesForm
    template_name = 'monitoring_evaluation/modules_lecture_notes_form.html'
    success_url = reverse_lazy('monitoring_evaluation:lecture_notes_list')
    permission_classes = [IsAuthenticated]
    
    def form_valid(self, form):
        form.instance.proponent = self.request.user
        return super().form_valid(form)

class PhotoDocumentationUploadView(LoginRequiredMixin, CreateView):
    model = PhotoDocumentation
    form_class = PhotoDocumentationForm
    template_name = 'monitoring_evaluation/photo_documentation_form.html'
    success_url = reverse_lazy('monitoring_evaluation:photo_list')
    permission_classes = [IsAuthenticated]
    
    def form_valid(self, form):
        form.instance.proponent = self.request.user
        return super().form_valid(form)
    
class OtherFilesUploadView(LoginRequiredMixin, CreateView):
    model = OtherFiles
    form_class = OtherFilesForm
    template_name = 'monitoring_evaluation/other_files_form.html'
    success_url = reverse_lazy('monitoring_evaluation:other_files_list')
    permission_classes = [IsAuthenticated]
    
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
    permission_classes = [IsAuthenticated]
    
    def form_valid(self, form): 
        form.instance.proponent = self.request.user
        return super().form_valid(form)

class AccomplishmentReportCreateView(LoginRequiredMixin, CreateView):
    model = AccomplishmentReport
    form_class = AccomplishmentReportForm
    template_name = 'monitoring_evaluation/accomplishment_report_form.html'
    success_url = reverse_lazy('monitoring_evaluation:report_list')
    permission_classes = [IsAuthenticated]
    
    def form_valid(self, form):
        form.instance.submitted_by = self.request.user
        return super().form_valid(form)

class AccomplishmentReportDetailView(LoginRequiredMixin, View):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        report = get_object_or_404(AccomplishmentReport, pk=pk)
        return render(request, 'monitoring_evaluation/accomplishment_report_detail.html', {'report': report})

class PREXCAchievementCreateView(LoginRequiredMixin, CreateView):
    model = PREXCAchievement
    form_class = PREXCAchievementForm
    template_name = 'monitoring_evaluation/prexc_achievement_form.html'
    success_url = reverse_lazy('monitoring_evaluation:prexc_achievement_list')
    permission_classes = [IsAuthenticated]
    
    def form_valid(self, form):
        form.instance.submitted_by = self.request.user
        return super().form_valid(form)
    
class ProjectNarrativeCreateView(LoginRequiredMixin, CreateView):
    model = ProjectNarrative
    form_class = ProjectNarrativeForm
    template_name = 'monitoring_evaluation/project_narrative_form.html'
    success_url = reverse_lazy('monitoring_evaluation:project_narrative_list')
    permission_classes = [IsAuthenticated]

    def form_valid(self, form):
        form.instance.submitted_by = self.request.user
        return super().form_valid(form)
    
# API Views
class DailyAttendanceRecordViewSet(viewsets.ModelViewSet): 
    queryset = DailyAttendanceRecord.objects.all()
    serializer_class = DailyAttendanceRecordSerializer
    permission_classes = [IsAuthenticated]
    
class SummaryOfEvaluationViewSet(viewsets.ModelViewSet):
    queryset = SummaryOfEvaluation.objects.all()
    serializer_class = SummaryOfEvaluationSerializer
    permission_classes = [IsAuthenticated]
    
class ModulesLectureNotesViewSet(viewsets.ModelViewSet):
    queryset = ModulesLectureNotes.objects.all()
    serializer_class = ModulesLectureNotesSerializer
    permission_classes = [IsAuthenticated]
    
class PhotoDocumentationViewSet(viewsets.ModelViewSet): 
    queryset = PhotoDocumentation.objects.all()
    serializer_class = PhotoDocumentationSerializer
    permission_classes = [IsAuthenticated]
    
class OtherFilesViewSet(viewsets.ModelViewSet):
    queryset = OtherFiles.objects.all()
    serializer_class = OtherFilesSerializer
    permission_classes = [IsAuthenticated]
    
class ChecklistAssignmentViewSet(viewsets.ModelViewSet):
    queryset = ChecklistAssignment.objects.all()
    serializer_class = ChecklistAssignmentSerializer
    permission_classes = [IsAuthenticated]
    
class AccomplishmentReportViewSet(viewsets.ModelViewSet):
    queryset = AccomplishmentReport.objects.all()
    serializer_class = AccomplishmentReportSerializer
    permission_classes = [IsAuthenticated]

class PREXCAchievementViewSet(viewsets.ModelViewSet):
    queryset = PREXCAchievement.objects.all()
    serializer_class = PREXCAchievementSerializer
    permission_classes = [IsAuthenticated]

class ProjectNarrativeViewSet(viewsets.ModelViewSet):
    queryset = ProjectNarrative.objects.all()
    serializer_class = ProjectNarrativeSerializer
    permission_classes = [IsAuthenticated]

# Evaluation ViewSet for Evaluation Forms
class EvaluationViewSet(viewsets.ModelViewSet):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Evaluation.objects.filter(project__status='approved')

    @action(detail=True, methods=['get'])
    def generate_evaluation_url(self, request, trainer_id, project_id):
        trainer = get_object_or_404(LoadingOfTrainers, LOTID=trainer_id)
        project_id = get_object_or_404(Project, projectID=project_id)

        if not project_id:
            return Response({"error": "Project ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        project = get_object_or_404(Project, id=project_id)

        evaluation, created = Evaluation.objects.get_or_create(
            trainer=trainer, project=project,
            defaults={"access_token": secrets.token_urlsafe(16)}
        )

        evaluation_url = (
            f"{request.build_absolute_uri('/')[:-1]}"
            f"/evaluation/{trainer.LOTID}/{project.id}/"
            f"?access_token={evaluation.access_token}"
        )    
        return Response({"evaluation_url": evaluation_url}, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            evaluation = serializer.save()
            evaluation.access_token = secrets.token_urlsafe(16)
            evaluation.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# Evaluation Form View for HTML Form Submission
def evaluation_form_view(request, project_id, trainer_id=None):
    project = get_object_or_404(Project, projectID=project_id)
    trainer = get_object_or_404(LoadingOfTrainers, LOTID=trainer_id) if trainer_id else None #Set trainer to None if not provided for project-only evaluations

    access_token = request.GET.get("access_token")
    evaluation = get_object_or_404(Evaluation, project=project, trainer=trainer)
    if access_token != evaluation.access_token:
        return HttpResponseForbidden("Invalid or missing access token.")

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


# Attendance 
class AttendanceTemplateViewSet(viewsets.ModelViewSet):
    queryset = AttendanceTemplate.objects.all()
    serializer_class = AttendanceTemplateSerializer

    def perform_create(self, serializer):
        # Link the template to the current user/project if needed
        serializer.save()

def create_attendance_template(request):
    if request.method == 'POST':
        project_id = request.POST['project']
        name = request.POST['name']
        field_names = request.POST.getlist('field_names')
        field_types = request.POST.getlist('field_types')

        # fields = {name: field_type for name, field_type in zip(field_names, field_types)}
        if not project_id:
            return JsonResponse({'error': 'Project is required.'}, status=400)
        try:
            project = Project.objects.get(projectID=project_id)
        except (ValueError, Project.DoesNotExist):
            return JsonResponse({'message': 'Template created successfully!'}, status=201)
        fields = {name: field_type for name, field_type in zip(field_names, field_types)}
        
        AttendanceTemplate.objects.create(project=project, name=name, fields=fields)
        return JsonResponse({'message': 'Template created successfully!'}, status=201)

    projects = Project.objects.all()  # Pass projects to template
    return render(request, 'attendance_template_form.html', {'projects': projects})

class AttendanceRecordViewSet(viewsets.ModelViewSet):
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceRecordSerializer

    def perform_create(self, serializer):
        # Save attendance record dynamically
        serializer.save()

def submit_attendance_record(request):
    if request.method == 'POST':
        template_id = request.POST['template']
        data = request.POST['data']

        try:
            data_json = json.loads(data)  # Validate JSON format
            template = AttendanceTemplate.objects.get(id=template_id)
            AttendanceRecord.objects.create(template=template, data=data_json)
            return JsonResponse({'message': 'Record submitted successfully!'}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)

    templates = AttendanceTemplate.objects.all()  # Pass templates to template
    return render(request, 'attendance_record_form.html', {'templates': templates})