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
        # Extract and validate fields
        proponent_id = request.data.get('proponent')
        file = request.FILES.get('attendance_file')
        total_attendees = request.data.get('total_attendees')

        # Validate each field individually
        if not proponent_id:
            return Response({"error": "Proponent ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        if not file:
            return Response({"error": "Attendance file is required."}, status=status.HTTP_400_BAD_REQUEST)
        if not total_attendees:
            return Response({"error": "Total attendees is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            total_attendees = int(total_attendees)
        except ValueError:
            return Response({"error": "Total attendees must be a valid number."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch required objects
        proponent = get_object_or_404(CustomUser, userID=proponent_id)
        project = get_object_or_404(Project, projectID=project_id, status="approved")
        assignment = get_object_or_404(ChecklistAssignment, project=project, proponent=proponent)

        # Check permissions to submit
        if not assignment.can_submit_daily_attendance:
            return Response({"error": "You are not assigned to submit this item."},
                            status=status.HTTP_403_FORBIDDEN)

        # Create attendance record
        daily_attendance = DailyAttendanceRecord.objects.create(
            project=project,
            proponent=proponent,
            attendance_file=file,
            total_attendees=total_attendees
        )

        # Serialize and return the response
        return Response(DailyAttendanceRecordSerializer(daily_attendance).data, status=status.HTTP_201_CREATED)




class SummaryOfEvaluationUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        proponent_id = request.data.get('proponent')
        file = request.FILES.get('summary_file')

        if not file:
            return Response({"error": "Summary file is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch objects
        proponent = get_object_or_404(CustomUser, userID=proponent_id)
        project = get_object_or_404(Project, projectID=project_id, status="approved")
        assignment = get_object_or_404(ChecklistAssignment, project=project, proponent=proponent)

        if assignment.can_submit_summary_of_evaluation:
            summary = SummaryOfEvaluation.objects.create(
                project=project,
                proponent=proponent,
                summary_file=file
            )
            return Response(SummaryOfEvaluationSerializer(summary).data, status=status.HTTP_201_CREATED)

        return Response({"error": "You are not assigned to submit this item."}, status=status.HTTP_403_FORBIDDEN)


class ModulesLectureNotesUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        proponent_id = request.data.get('proponent')
        file = request.FILES.get('module_file')
        description = request.data.get('description')

        if not file:
            return Response({"error": "Module file is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch objects
        proponent = get_object_or_404(CustomUser, userID=proponent_id)
        project = get_object_or_404(Project, projectID=project_id, status="approved")
        assignment = get_object_or_404(ChecklistAssignment, project=project, proponent=proponent)

        if assignment.can_submit_modules_lecture_notes:
            lecture_notes = ModulesLectureNotes.objects.create(
                project=project,
                proponent=proponent,
                module_file=file,
                description=description
            )
            return Response(ModulesLectureNotesSerializer(lecture_notes).data, status=status.HTTP_201_CREATED)

        return Response({"error": "You are not assigned to submit this item."}, status=status.HTTP_403_FORBIDDEN)


class PhotoDocumentationUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        proponent_id = request.data.get('proponent')
        file = request.FILES.get('photo')
        description = request.data.get('description')

        if not file:
            return Response({"error": "Photo file is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch objects
        proponent = get_object_or_404(CustomUser, userID=proponent_id)
        project = get_object_or_404(Project, projectID=project_id, status="approved")
        assignment = get_object_or_404(ChecklistAssignment, project=project, proponent=proponent)

        if assignment.can_submit_photo_documentation:
            photo = PhotoDocumentation.objects.create(
                project=project,
                proponent=proponent,
                photo=file,
                description=description
            )
            return Response(PhotoDocumentationSerializer(photo).data, status=status.HTTP_201_CREATED)

        return Response({"error": "You are not assigned to submit this item."}, status=status.HTTP_403_FORBIDDEN)


class OtherFilesUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        proponent_id = request.data.get('proponent')
        file = request.FILES.get('other_files')
        description = request.data.get('description')

        if not file:
            return Response({"error": "File is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch objects
        proponent = get_object_or_404(CustomUser, userID=proponent_id)
        project = get_object_or_404(Project, projectID=project_id, status="approved")
        assignment = get_object_or_404(ChecklistAssignment, project=project, proponent=proponent)

        if assignment.can_submit_other_files:
            other_file = OtherFiles.objects.create(
                project=project,
                proponent=proponent,
                file=file,
                description=description
            )
            return Response(OtherFilesSerializer(other_file).data, status=status.HTTP_201_CREATED)

        return Response({"error": "You are not assigned to submit this item."}, status=status.HTTP_403_FORBIDDEN)

## view all submissions
class ChecklistSubmissionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        submissions = []

        # Fetch daily attendance records
        daily_attendance = DailyAttendanceRecord.objects.filter(project__projectID=project_id)
        for record in daily_attendance:
            submissions.append({
                "submission_id": record.id,
                "submission_type": "Daily Attendance",
                "status": record.status,
                "rejection_reason": record.rejection_reason,
                "date_uploaded": record.date_uploaded,
            })

        # Fetch summary of evaluations
        evaluations = SummaryOfEvaluation.objects.filter(project__projectID=project_id)
        for evaluation in evaluations:
            submissions.append({
                "submission_id": evaluation.id,
                "submission_type": "Summary of Evaluations",
                "status": evaluation.status,
                "rejection_reason": evaluation.rejection_reason,
                "date_uploaded": evaluation.date_uploaded,
            })

        # Fetch modules/lecture notes
        modules = ModulesLectureNotes.objects.filter(project__projectID=project_id)
        for module in modules:
            submissions.append({
                "submission_id": module.id,
                "submission_type": "Modules/Lecture Notes",
                "status": module.status,
                "rejection_reason": module.rejection_reason,
                "date_uploaded": module.date_uploaded,
            })

        # Fetch photo documentation
        photos = PhotoDocumentation.objects.filter(project__projectID=project_id)
        for photo in photos:
            submissions.append({
                "submission_id": photo.id,
                "submission_type": "Photo Documentation",
                "status": photo.status,
                "rejection_reason": photo.rejection_reason,
                "date_uploaded": photo.date_uploaded,
            })

        # Fetch other files
        other_files = OtherFiles.objects.filter(project__projectID=project_id)
        for file in other_files:
            submissions.append({
                "submission_id": file.id,
                "submission_type": "Other Files",
                "status": file.status,
                "rejection_reason": file.rejection_reason,
                "date_uploaded": file.date_uploaded,
            })

        return Response(submissions, status=200)

    
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
            project = Project.objects.get(projectID=project_id, status="approved")
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
            project = Project.objects.get(projectID=project_id, status="approved")
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
        
# Update file submission status
MODEL_MAP = {
    "daily_attendance": DailyAttendanceRecord,
    "summary_of_evaluation": SummaryOfEvaluation,
    "modules_lecture_notes": ModulesLectureNotes,
    "photo_documentation": PhotoDocumentation,
    "other_files": OtherFiles,
}

class UpdateSubmissionStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, model_name, submission_id):
        if model_name not in MODEL_MAP:
            return Response({"error": "Invalid model name."}, status=status.HTTP_400_BAD_REQUEST)

        Model = MODEL_MAP[model_name]

        try:
            submission = Model.objects.get(id=submission_id)
            status_value = request.data.get("status")
            rejection_reason = request.data.get("rejection_reason", "")

            if status_value not in ["Pending", "Approved", "Rejected"]:
                return Response({"error": "Invalid status value."}, status=status.HTTP_400_BAD_REQUEST)

            submission.status = status_value
            if status_value == "Rejected":
                submission.rejection_reason = rejection_reason
            else:
                submission.rejection_reason = None
            submission.save()

            return Response({"message": "Submission status updated successfully."}, status=status.HTTP_200_OK)

        except Model.DoesNotExist:
            return Response({"error": "Submission not found."}, status=status.HTTP_404_NOT_FOUND)

# proponent view, display the status and rejection reason
class ProponentSubmissionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user  # Get the currently authenticated user
        submissions = {
            "daily_attendance": DailyAttendanceRecord.objects.filter(proponent=user),
            "summary_of_evaluation": SummaryOfEvaluation.objects.filter(proponent=user),
            "modules_lecture_notes": ModulesLectureNotes.objects.filter(proponent=user),
            "photo_documentations": PhotoDocumentation.objects.filter(proponent=user),
            "other_files": OtherFiles.objects.filter(proponent=user),
        }

        result = {
            model: [
                {
                    "id": submission.id,
                    "project": submission.project.projectTitle,
                    "status": submission.status,
                    "rejection_reason": submission.rejection_reason,
                    "date_uploaded": submission.date_uploaded,
                }
                for submission in queryset
            ]
            for model, queryset in submissions.items()
        }

        return Response(result, status=status.HTTP_200_OK)


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

