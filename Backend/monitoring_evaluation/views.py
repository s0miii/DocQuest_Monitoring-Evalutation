from rest_framework import status, viewsets, generics
from rest_framework.views import APIView, View
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from rest_framework.permissions import IsAuthenticated
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.db import transaction
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import get_object_or_404, render, redirect
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from docquestapp.models import Project, LoadingOfTrainers
from .models import *
from .forms import *
from .serializers import *


class DailyAttendanceUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        proponent_id = request.data.get('proponent')
        file = request.FILES.get('file')

        proponent = get_object_or_404(CustomUser, id=proponent_id)
        project = get_object_or_404(Project, id=project_id)

        assignment = get_object_or_404(ChecklistAssignment, project=project, proponent=proponent)

        if assignment.can_submit_daily_attendance:
            daily_attendance = DailyAttendanceRecord.objects.create(
                project=project,
                proponent=proponent,
                attendance_file=file,
                total_attendees=request.data.get('total_attendees')
            )
            serializer = DailyAttendanceRecordSerializer(daily_attendance)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response({"error": "You are not assigned to submit this item."}, status=status.HTTP_403_FORBIDDEN)


class SummaryOfEvaluationUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        proponent_id = request.data.get('proponent')
        file = request.FILES.get('summary_file')

        proponent = get_object_or_404(CustomUser, id=proponent_id)
        project = get_object_or_404(Project, id=project_id)

        assignment = get_object_or_404(ChecklistAssignment, project=project, proponent=proponent)

        if assignment.can_submit_summary_of_evaluation:
            summary = SummaryOfEvaluation.objects.create(
                project=project,
                proponent=proponent,
                summary_file=file
            )
            serializer = SummaryOfEvaluationSerializer(summary)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response({"error": "You are not assigned to submit this item."}, status=status.HTTP_403_FORBIDDEN)

    
class ModulesLectureNotesUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        proponent_id = request.data.get('proponent')
        file = request.FILES.get('module_file')

        proponent = get_object_or_404(CustomUser, id=proponent_id)
        project = get_object_or_404(Project, id=project_id)

        assignment = get_object_or_404(ChecklistAssignment, project=project, proponent=proponent)

        if assignment.can_submit_modules_lecture_notes:
            lecture_notes = ModulesLectureNotes.objects.create(
                project=project,
                proponent=proponent,
                module_file=file,
                description=request.data.get('description')
            )
            serializer = ModulesLectureNotesSerializer(lecture_notes)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response({"error": "You are not assigned to submit this item."}, status=status.HTTP_403_FORBIDDEN)

class PhotoDocumentationUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        proponent_id = request.data.get('proponent')
        file = request.FILES.get('photo')

        proponent = get_object_or_404(CustomUser, id=proponent_id)
        project = get_object_or_404(Project, id=project_id)

        assignment = get_object_or_404(ChecklistAssignment, project=project, proponent=proponent)

        if assignment.can_submit_photo_documentation:
            photo = PhotoDocumentation.objects.create(
                project=project,
                proponent=proponent,
                photo=file,
                description=request.data.get('description')
            )
            serializer = PhotoDocumentationSerializer(photo)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response({"error": "You are not assigned to submit this item."}, status=status.HTTP_403_FORBIDDEN)

class OtherFilesUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        proponent_id = request.data.get('proponent')
        file = request.FILES.get('file')

        proponent = get_object_or_404(CustomUser, id=proponent_id)
        project = get_object_or_404(Project, id=project_id)

        assignment = get_object_or_404(ChecklistAssignment, project=project, proponent=proponent)

        if assignment.can_submit_other_files:
            other_file = OtherFiles.objects.create(
                project=project,
                proponent=proponent,
                file=file,
                description=request.data.get('description')
            )
            serializer = OtherFilesSerializer(other_file)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response({"error": "You are not assigned to submit this item."}, status=status.HTTP_403_FORBIDDEN)


## view all submissions
class ChecklistSubmissionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        try:
            project = Project.objects.get(projectID=project_id)
            
            daily_attendance_records = DailyAttendanceRecord.objects.filter(project=project)
            summary_of_evaluations = SummaryOfEvaluation.objects.filter(project=project)
            modules_lecture_notes = ModulesLectureNotes.objects.filter(project=project)
            photo_documentations = PhotoDocumentation.objects.filter(project=project)
            other_files = OtherFiles.objects.filter(project=project)

            results = {
                "daily_attendance_records": [
                    {
                        "proponent": f"{record.proponent.firstname} {record.proponent.lastname}",
                        "attendance_file": record.attendance_file.url,
                        "total_attendees": record.total_attendees,
                        "date_uploaded": record.date_uploaded
                    } for record in daily_attendance_records
                ],
                "summary_of_evaluations": [
                    {
                        "proponent": f"{record.proponent.firstname} {record.proponent.lastname}",
                        "summary_file": record.summary_file.url,
                        "date_uploaded": record.date_uploaded
                    } for record in summary_of_evaluations
                ],
                "modules_lecture_notes": [
                    {
                        "proponent": f"{record.proponent.firstname} {record.proponent.lastname}",
                        "module_file": record.module_file.url,
                        "description": record.description,
                        "date_uploaded": record.date_uploaded
                    } for record in modules_lecture_notes
                ],
                "photo_documentations": [
                    {
                        "proponent": f"{record.proponent.firstname} {record.proponent.lastname}",
                        "photo": record.photo.url,
                        "description": record.description,
                        "date_uploaded": record.date_uploaded
                    } for record in photo_documentations
                ],
                "other_files": [
                    {
                        "proponent": f"{record.proponent.firstname} {record.proponent.lastname}",
                        "file": record.file.url,
                        "description": record.description,
                        "date_uploaded": record.date_uploaded
                    } for record in other_files
                ]
            }

            return Response(results, status=status.HTTP_200_OK)

        except Project.DoesNotExist:
            return Response({"error": "Project not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    
# assign checklist
@method_decorator(csrf_exempt, name='dispatch')
class AssignChecklistItemsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        project_id = request.data.get('project')
        proponent_id = request.data.get('proponent')
        checklist_items = request.data.get('checklist_items', {})

        if not all([project_id, proponent_id]):
            return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            project = Project.objects.get(projectID=project_id)
            proponent = get_object_or_404(CustomUser, userID=proponent_id)

            with transaction.atomic():
                assignment, created = ChecklistAssignment.objects.update_or_create(
                    project=project,
                    proponent=proponent,
                    defaults={
                        "can_submit_daily_attendance": checklist_items.get("daily_attendance", False),
                        "can_submit_summary_of_evaluation": checklist_items.get("summary_of_evaluation", False),
                        "can_submit_modules_lecture_notes": checklist_items.get("modules_lecture_notes", False),
                        "can_submit_other_files": checklist_items.get("other_files", False),
                        "can_submit_photo_documentation": checklist_items.get("photo_documentation", False),
                    }
                )

            serializer = ChecklistAssignmentSerializer(assignment)
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
            )

        except Project.DoesNotExist:
            return Response({"error": "Project not found."}, status=status.HTTP_404_NOT_FOUND)
        except CustomUser.DoesNotExist:
            return Response({"error": "Proponent not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# view checklist assignment
class ChecklistItemSubmissionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        try:
            project = Project.objects.get(projectID=project_id)
            assignments = ChecklistAssignment.objects.filter(project=project)

            results = {
                "daily_attendance": [],
                "summary_of_evaluation": [],
                "modules_lecture_notes": [],
                "other_files": [],
                "photo_documentation": []
            }

            for assignment in assignments:
                proponent_name = f"{assignment.proponent.firstname} {assignment.proponent.lastname}"
                if assignment.can_submit_daily_attendance:
                    results["daily_attendance"].append(proponent_name)
                if assignment.can_submit_summary_of_evaluation:
                    results["summary_of_evaluation"].append(proponent_name)
                if assignment.can_submit_modules_lecture_notes:
                    results["modules_lecture_notes"].append(proponent_name)
                if assignment.can_submit_other_files:
                    results["other_files"].append(proponent_name)
                if assignment.can_submit_photo_documentation:
                    results["photo_documentation"].append(proponent_name)

            return Response(results, status=status.HTTP_200_OK)

        except Project.DoesNotExist:
            return Response({"error": "Project not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

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

class AccomplishmentReportViewSet(viewsets.ModelViewSet):
    queryset = AccomplishmentReport.objects.all()
    serializer_class = AccomplishmentReportSerializer


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

