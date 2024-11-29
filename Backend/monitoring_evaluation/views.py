from rest_framework import status, viewsets, generics
from rest_framework.views import APIView, View
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.db import transaction
from django.db.models import Value, CharField
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import get_object_or_404, render, redirect
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from docquestapp.models import Roles, Project, LoadingOfTrainers
from .models import *
from .forms import *
from .serializers import *
from .decorators import role_required
from django.http import HttpResponseForbidden, JsonResponse
import secrets, logging, datetime
from django.utils.dateparse import parse_date


# retrieve projects based on user role each project
@role_required(allowed_role_codes=["PJLD", "PPNT"])
class UserProjectsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if not user:
            return Response({"error": "Invalid session"}, status=403)

        # Fetch user roles dynamically
        user_roles = Roles.objects.filter(user__userID=user.userID).values_list("code", flat=True)

        # Dynamic Role-Query Mappings
        role_query_mapping = {
            "PJLD": {
                "queryset": Project.objects.filter(userID=user.userID, status="approved"),
                "role": "leader",
            },
            "PPNT": {
                "queryset": Project.objects.filter(proponents__userID=user.userID, status="approved"),
                "role": "proponent",
            },
        }

        combined_projects = []

        # Dynamically fetch and serialize based on roles
        for role in user_roles:
            if role in role_query_mapping:
                config = role_query_mapping[role]
                queryset = config["queryset"]

                # Serialize manually to inject the dynamic role
                for project in queryset:
                    combined_projects.append({
                        "projectID": project.projectID,
                        "projectTitle": project.projectTitle,
                        "background": project.background,
                        "targetImplementation": project.targetImplementation,
                        "role": config["role"],  # Dynamically add the role
                    })

        # Return a response even if no projects are found
        if not combined_projects:
            return Response({"message": "No projects found for the user"}, status=200)

        return Response(combined_projects, status=200)


### Role Based Access
# expose user roles
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_roles(request):
    """Fetch roles of the authenticated user."""
    roles = request.user.roles.values_list('code', flat=True)
    return Response({"roles": list(roles)})



### upload files
@role_required(allowed_role_codes=["PJLD", "PPNT"])
class DailyAttendanceUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):

        # Extract authenticated user
        user = request.user

        # Validate the authenticated user
        if not user:
            return Response({"error": "Invalid user session or token."}, status=status.HTTP_401_UNAUTHORIZED)


        # Extract and validate fields
        proponent_id = request.data.get('proponent')
        file = request.FILES.get('attendance_file')
        total_attendees = request.data.get('total_attendees')
        description = request.data.get('description')

        # Validate each field
        if not proponent_id:
            return Response({"error": "Proponent ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        if not file:
            return Response({"error": "Attendance file is required."}, status=status.HTTP_400_BAD_REQUEST)
        if not total_attendees:
            return Response({"error": "Total attendees is required."}, status=status.HTTP_400_BAD_REQUEST)
        if not description:
            return Response({"error": "Description is required."}, status=status.HTTP_400_BAD_REQUEST)

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
            return Response({"error": "You are not assigned to submit this item."}, status=status.HTTP_403_FORBIDDEN)

        # Create attendance record
        daily_attendance = DailyAttendanceRecord.objects.create(
            project=project,
            proponent=proponent,
            attendance_file=file,
            total_attendees=total_attendees,
            description=description,
        )

        # Serialize and return the response
        return Response(DailyAttendanceRecordSerializer(daily_attendance).data, status=status.HTTP_201_CREATED)



@role_required(allowed_role_codes=["PJLD", "PPNT"])
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

@role_required(allowed_role_codes=["PJLD", "PPNT"])
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

@role_required(allowed_role_codes=["PJLD", "PPNT"])
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

@role_required(allowed_role_codes=["PJLD", "PPNT"])
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
@role_required(allowed_role_codes=["PJLD", "PPNT"])
class ChecklistSubmissionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id, checklist_item_name=None):
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
                "submitted_by": f"{record.proponent.firstname} {record.proponent.lastname}",
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
                "submitted_by": f"{evaluation.proponent.firstname} {evaluation.proponent.lastname}",
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
                "submitted_by": f"{module.proponent.firstname} {module.proponent.lastname}",
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
                "submitted_by": f"{photo.proponent.firstname} {photo.proponent.lastname}",
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
                "submitted_by": f"{file.proponent.firstname} {file.proponent.lastname}",
            })

        return Response(submissions, status=200)


        

    
### assign checklist
@role_required(allowed_role_codes=["PJLD"])
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

## View checklist assignments by project
@role_required(allowed_role_codes=["PJLD", "PPNT"])
class ChecklistItemSubmissionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        try:
            # Fetch the project
            project = Project.objects.get(projectID=project_id, status="approved")

            # Check the role and filter assignments accordingly
            if "PJLD" in [role.code for role in request.auth.role.all()]:
                # Project leaders see all assignments for the project
                assignments = ChecklistAssignment.objects.filter(project=project)
            elif "PPNT" in [role.code for role in request.auth.role.all()]:
                # Proponents see only their own assignments
                assignments = ChecklistAssignment.objects.filter(
                    project=project, proponent__userID=request.auth.user.userID
                )
            else:
                return Response(
                    {"error": "You do not have the required role to access this feature."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            # Serialize the assignments
            results = []
            for assignment in assignments:
                results.append({
                    "id": assignment.id,
                    "can_submit_daily_attendance": assignment.can_submit_daily_attendance,
                    "can_submit_summary_of_evaluation": assignment.can_submit_summary_of_evaluation,
                    "can_submit_modules_lecture_notes": assignment.can_submit_modules_lecture_notes,
                    "can_submit_other_files": assignment.can_submit_other_files,
                    "can_submit_photo_documentation": assignment.can_submit_photo_documentation,
                    "is_completed": assignment.is_completed,
                    "completion_date": assignment.completion_date,
                    "project": assignment.project.projectID,
                    "proponent": f"{assignment.proponent.firstname} {assignment.proponent.lastname}",
                })

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
@role_required(allowed_role_codes=["PJLD"])
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
@role_required(allowed_role_codes=["PJLD", "PPNT"])
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

        project = get_object_or_404(Project, projectID=project_id)

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
# class AttendanceTemplateViewSet(viewsets.ModelViewSet):
#     queryset = AttendanceTemplate.objects.all()
#     serializer_class = AttendanceTemplateSerializer

#     def perform_create(self, serializer):
#         # Link the template to the current user/project if needed
#         serializer.save()

# def create_attendance_template(request):
#     if request.method == 'POST':
#         project_id = request.POST['project']
#         name = request.POST['name']
#         field_names = request.POST.getlist('field_names')
#         field_types = request.POST.getlist('field_types')

#         # fields = {name: field_type for name, field_type in zip(field_names, field_types)}
#         if not project_id:
#             return JsonResponse({'error': 'Project is required.'}, status=400)
#         try:
#             project = Project.objects.get(projectID=project_id)
#         except (ValueError, Project.DoesNotExist):
#             return JsonResponse({'message': 'Template created successfully!'}, status=201)
#         fields = {name: field_type for name, field_type in zip(field_names, field_types)}
        
#         AttendanceTemplate.objects.create(project=project, name=name, fields=fields)
#         return JsonResponse({'message': 'Template created successfully!'}, status=201)

#     projects = Project.objects.all()  # Pass projects to template
#     return render(request, 'attendance_template_form.html', {'projects': projects})

# class AttendanceRecordViewSet(viewsets.ModelViewSet):
#     queryset = AttendanceRecord.objects.all()
#     serializer_class = AttendanceRecordSerializer

#     def perform_create(self, serializer):
#         # Save attendance record dynamically
#         serializer.save()

# def submit_attendance_record(request):
#     if request.method == 'POST':
#         template_id = request.POST['template']
#         data = request.POST['data']

#         try:
#             data_json = json.loads(data)  # Validate JSON format
#             template = AttendanceTemplate.objects.get(id=template_id)
#             AttendanceRecord.objects.create(template=template, data=data_json)
#             return JsonResponse({'message': 'Record submitted successfully!'}, status=200)
#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON format'}, status=400)

#     templates = AttendanceTemplate.objects.all()  # Pass templates to template
#     return render(request, 'attendance_record_form.html', {'templates': templates})


# ATTENDANCE TEMPLATE -> KATONG CHECKLIST NGA LOGIC
class AttendanceTemplateViewSet(viewsets.ModelViewSet):
    queryset = AttendanceTemplate.objects.all()
    serializer_class = AttendanceTemplateSerializer

    def get_serializer_context(self):
        # Include the request in the serializer context to generate sharable links
        return {'request': self.request}
class CreateAttendanceTemplateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        # Validate project
        project = get_object_or_404(Project, projectID=project_id)

        # Extract template fields
        fields = {
            "include_attendee_name": request.data.get("include_attendee_name", False),
            "include_gender": request.data.get("include_gender", False),
            "include_college": request.data.get("include_college", False),
            "include_department": request.data.get("include_department", False),
            "include_year_section": request.data.get("include_year_section", False),
            "include_agency_office": request.data.get("include_agency_office", False),
            "include_contact_number": request.data.get("include_contact_number", False),
        }

        # expiration_date_str = request.data.get("expiration_date")
        # if not expiration_date_str:
        #     return Response({"error": "Expiration date is required."})
        
        # expiration_date = parse_date(expiration_date_str)
        # if not expiration_date or expiration_date <= date.today().date():
        #     return Response({"error": "Invalid expiration date."}, status=400)

        expiration_date = request.data.get("expiration_date")
        if not expiration_date:
            return Response({"error": "Expiration date is required."}, status=400)

        try:
            expiration_date = datetime.strptime(expiration_date, "%Y-%m-%d").date()
        except ValueError:
            return Response({"error": "Invalid date format. Use 'YYYY-MM-DD'."}, status=400)
        

        # Create the template
        attendance_template = AttendanceTemplate.objects.create(project=project, expiration_date=expiration_date, **fields)

        # Generate sharable link
        sharable_link = f"{request.build_absolute_uri('/')[:-1]}/monitoring/attendance/fill/{attendance_template.token}/"

        # Save the sharable link sa database mismo -> added feature lang
        attendance_template.sharable_link = sharable_link
        attendance_template.save()

        return Response({
            "template": AttendanceTemplateSerializer(attendance_template).data,
            "sharable_link": sharable_link
        }, status=201)

class AttendanceRecordViewSet(viewsets.ModelViewSet):
    queryset = CreatedAttendanceRecord.objects.all()
    serializer_class = CreatedAttendanceRecordSerializer

    @action(detail=False, methods=['get'], url_path='project/(?P<project_id>[^/.]+)')
    def get_by_project(self, request, project_id=None):
        """
        Fetch all attendance records for a specific project.
        """
        records = CreatedAttendanceRecord.objects.filter(project__projectID=project_id)
        
        if not records.exists():
            return Response({"message": "No attendance records found for this project."}, status=404)
        
        serializer = self.get_serializer(records, many=True)
        return Response(serializer.data)
    
# Submit Attendance Record (For Authenticated Users Only)
# This view is retained for scenarios where authenticated users (e.g., staff or project leaders) 
# might need to submit attendance records programmatically or through internal workflows.
class SubmitAttendanceRecordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id, template_id):
        # Validate project and template
        project = get_object_or_404(Project, projectID=project_id)
        template = get_object_or_404(AttendanceTemplate, id=template_id, project=project)

        #I-check if valid pa ang template and wa pa nilapas sa expiration
        if not template.is_valid():
            return Response({"error": "THis attendance template has expired"}, status=400)

        # Validate required fields based on the template
        data = request.data
        if template.include_attendee_name and not data.get("attendee_name"):
            return Response({"error": "Attendee's Name is required."}, status=400)
        if template.include_gender and not data.get("gender"):
            return Response({"error": "Gender is required."}, status=400)
        if template.include_college and not data.get("college"):
            return Response({"error": "College is required."}, status=400)
        if template.include_department and not data.get("department"):
            return Response({"error": "Department is required."}, status=400)
        if template.include_year_section and not data.get("year_section"):
            return Response({"error": "Year & Section is required."}, status=400)
        if template.include_agency_office and not data.get("agency_office"):
            return Response({"error": "Agency/Office is required."}, status=400)
        if template.include_contact_number and not data.get("contact_number"):
            return Response({"error": "Contact Number is required."}, status=400)

        # Create the attendance record
        attendance_record = CreatedAttendanceRecord.objects.create(
            project=project,
            template=template,
            attendee_name=data.get("attendee_name"),
            gender=data.get("gender"),
            college=data.get("college"),
            department=data.get("department"),
            year_section=data.get("year_section"),
            agency_office=data.get("agency_office"),
            contact_number=data.get("contact_number"),
        )

        return Response(
            CreatedAttendanceRecordSerializer(attendance_record).data,
            status=201
        )

# This is used for sharable link - anyone outside the system can access the link
logger = logging.getLogger(__name__)
class FillAttendanceView(APIView):
    permission_classes = [AllowAny]  # Allow anyone to access this view without authentication

    # def get(self, request, token):
    #     template = get_object_or_404(AttendanceTemplate, token=token)
    #     print(f"GET request received with token: {token}") #For debugging only
    #     # Return the template details so the frontend can generate the form dynamically
    #     print(f"Template found: {template}") #For debugging only

    #     return Response({
    #         "templateName": template.templateName,
    #         "fields": {
    #             "include_attendee_name": template.include_attendee_name,
    #             "include_gender": template.include_gender,
    #             "include_college": template.include_college,
    #             "include_department": template.include_department,
    #             "include_year_section": template.include_year_section,
    #             "include_agency_office": template.include_agency_office,
    #             "include_contact_number": template.include_contact_number,
    #         },
    #         "project": template.project.projectID
    #     })

    def get(self, request, token):
        template = get_object_or_404(AttendanceTemplate, token=token)

        if not template.is_valid():
            return Response({"error": "This attendance link has already expired."}, status=400)

        return Response({
            "templateName": template.templateName,
            "fields": {
                "include_attendee_name": template.include_attendee_name,
                "include_gender": template.include_gender,
                "include_college": template.include_college,
                "include_department": template.include_department,
                "include_year_section": template.include_year_section,
                "include_agency_office": template.include_agency_office,
                "include_contact_number": template.include_contact_number,
            },
            "project": template.project.projectID
        })
    
    def post(self, request, token):
        # Find the template using the token
        template = get_object_or_404(AttendanceTemplate, token=token)
        if not template.is_valid():
            return Response({"error": "This attendance link has expired."}, status=400)

        # Define allowed fields based on the template
        allowed_fields = {
            "attendee_name": template.include_attendee_name,
            "gender": template.include_gender,
            "college": template.include_college,
            "department": template.include_department,
            "year_section": template.include_year_section,
            "agency_office": template.include_agency_office,
            "contact_number": template.include_contact_number,
        }

        # Validate incoming data against allowed fields
        data = request.data
        errors = {}

        # Check required and unexpected fields
        for field, is_allowed in allowed_fields.items():
            if is_allowed and not data.get(field):
                errors[field] = f"{field.replace('_', ' ').capitalize()} is required."
            elif not is_allowed and field in data:
                errors[field] = f"{field.replace('_', ' ').capitalize()} is not allowed for this template."

        # Detect unexpected fields not defined in allowed_fields
        unexpected_fields = set(data.keys()) - set(allowed_fields.keys())
        if unexpected_fields:
            for field in unexpected_fields:
                errors[field] = f"Unexpected field '{field}' is not allowed."

        if errors:
            return Response(errors, status=400)

        # Create the attendance record using only the allowed fields
        attendance_record = CreatedAttendanceRecord.objects.create(
            project=template.project,
            template=template,
            **{field: data.get(field) for field, is_allowed in allowed_fields.items() if is_allowed}
        )

        return Response(
            CreatedAttendanceRecordSerializer(attendance_record).data,
            status=201
        )    
    
class CalculateTotalAttendeesView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        project = get_object_or_404(Project, projectID=project_id)
        attendance_templates = project.attendance_templates.all()

        # Calculate total attendees
        total_attendees = 0
        num_templates = attendance_templates.count()

        for template in attendance_templates:
            count = template.createdattendancerecord_set.count()
            total_attendees += count
            print(f"Template ID {template.id} has {count} attendees")

        # if num_templates > 0:
        #     average_attendees = round(total_attendees / num_templates)

        # else:
        #     average_attendees = 0    

        if num_templates > 1: #Multiple-days Project
            average_attendees = round(total_attendees/ num_templates)
        elif num_templates == 1: #Single-day Project
            average_attendees = total_attendees
        else:
            average_attendees = 0  #No templates or attendees      


        # Save total attendees
        total, _ = TotalAttendees.objects.get_or_create(project=project)
        total.total_attendees = total_attendees
        total.average_attendees = average_attendees
        total.num_templates = num_templates
        total.save()

        return Response(
            {
                "total_attendees": total_attendees, 
                "average_attendees": average_attendees,
                "num_templates": num_templates,
            }, 
            status=200
        )

        