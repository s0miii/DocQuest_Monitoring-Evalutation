from rest_framework import status, viewsets, generics
from rest_framework.views import APIView, View
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.db import transaction
from django.db.models import F, ExpressionWrapper, IntegerField, Sum
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import get_object_or_404, render, redirect
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from docquestapp.models import Roles, Project, LoadingOfTrainers
from .models import *
from .forms import *
from .serializers import *
from .utils import send_reminder_email
from .decorators import role_required
from django.http import HttpResponseForbidden, JsonResponse
import secrets, logging, datetime
from django.utils.dateparse import parse_date

# Email
@role_required(allowed_role_codes=["estf"])  # Restrict to EStaff
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_dynamic_reminder_email(request, project_id):
    user = request.user  # Logged-in EStaff user

    # Fetch the project
    project = get_object_or_404(Project, projectID=project_id, status="approved")
    project_leader = project.userID  # Assuming userID links to the project leader

    if not project_leader or not project_leader.email:
        return Response({"error": "Project leader email not found."}, status=400)

    # Fetch missing submissions directly in the view
    missing_items = []

    # Check for missing Daily Attendance Records
    if not DailyAttendanceRecord.objects.filter(project=project, status="Approved").exists():
        missing_items.append("Daily Attendance Record")

    # Check for missing Summary of Evaluations
    if not SummaryOfEvaluation.objects.filter(project=project, status="Approved").exists():
        missing_items.append("Summary of Evaluation")

    # Check for other checklist items
    if not ModulesLectureNotes.objects.filter(project=project, status="Approved").exists():
        missing_items.append("Modules/Lecture Notes")

    if not PhotoDocumentation.objects.filter(project=project, status="Approved").exists():
        missing_items.append("Photo Documentation")

    if not OtherFiles.objects.filter(project=project, status="Approved").exists():
        missing_items.append("Other Files")

    # Generate dynamic email content
    subject = request.data.get('subject', f"Reminder: Missing Submissions for Project '{project.projectTitle}'")
    message = (
        f"Dear {project_leader.firstname} {project_leader.lastname},\n\n"
        f"The following submissions are still missing for the project '{project.projectTitle}':\n"
        f"{', '.join(missing_items) if missing_items else 'No missing items found.'}\n\n"
        "Best regards,\nEStaff Team"
    )

    # Send the email
    send_reminder_email(subject, message, [project_leader.email], sender_email=user.email)

    # Log the notification
    NotificationLog.objects.create(
        sender=user,
        project=project,
        recipient_email=project_leader.email,
        subject=subject,
        message=message,
    )

    return Response({"message": "Reminder email sent successfully."}, status=200)

# retrieve projects based on user role each project
@role_required(allowed_role_codes=["pjld", "ppnt"])
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
            "pjld": {
                "queryset": Project.objects.filter(userID=user.userID, status="approved"),
                "role": "leader",
            },
            "ppnt": {
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
                        "targetImplementation": f"{project.targetStartDateImplementation or 'N/A'} - {project.targetEndDateImplementation or 'N/A'}",
                        "role": config["role"],  # Dynamically add the role
                    })

        # Return a response even if no projects are found
        if not combined_projects:
            return Response({"message": "No projects found for the user"}, status=200)

        return Response(combined_projects, status=200)
    
# Proponent Project Details
@role_required(allowed_role_codes=["ppnt"])
class ProponentProjectDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        try:
            # Fetch project details
            project = Project.objects.get(projectID=project_id, status="approved")
            
            # Fetch project leader details
            project_leader_name = f"{project.userID.firstname} {project.userID.lastname}"

            # Prepare project details
            project_details = {
                "projectTitle": project.projectTitle,
                "college": project.program.all().first().collegeID.title if project.program.exists() else "N/A",
                "targetDate": f"{project.targetStartDateImplementation or 'N/A'} - {project.targetEndDateImplementation or 'N/A'}",
                "partnerAgency": ", ".join([agency.agencyName for agency in project.agency.all()]),
                "projectLeader": project_leader_name,
            }

            # Fetch assigned documentary requirements for the current proponent
            assignments = ChecklistAssignment.objects.filter(
                project=project,
                proponent=request.user
            )

            assigned_requirements = []
            for assignment in assignments:
                if assignment.can_submit_daily_attendance:
                    assigned_requirements.append("Daily Attendance")
                if assignment.can_submit_summary_of_evaluation:
                    assigned_requirements.append("Summary of Evaluation")
                if assignment.can_submit_modules_lecture_notes:
                    assigned_requirements.append("Lecture Notes")
                if assignment.can_submit_other_files:
                    assigned_requirements.append("Other Files")
                if assignment.can_submit_photo_documentation:
                    assigned_requirements.append("Photo Documentation")

            return Response({
                "projectDetails": project_details,
                "assignedRequirements": assigned_requirements,
            }, status=status.HTTP_200_OK)

        except Project.DoesNotExist:
            return Response({"error": "Project not found."}, status=status.HTTP_404_NOT_FOUND)
        except CustomUser.DoesNotExist:
            return Response({"error": "Project Leader not found."}, status=status.HTTP_404_NOT_FOUND)

# document count for checklist item
@role_required(allowed_role_codes=["pjld", "ppnt"])
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def document_counts(request, project_id):
    user = request.user
    project = get_object_or_404(Project, projectID=project_id, status="approved")

    # Check if the user is the project leader for this project
    is_project_leader = project.userID == user

    # Initialize counts dictionary
    document_counts = {}

    # Define a list of tuples containing the model and the corresponding checklist item name
    checklist_items = [
        (DailyAttendanceRecord, 'Daily Attendance'),
        (SummaryOfEvaluation, 'Summary of Evaluation'),
        (ModulesLectureNotes, 'Lecture Notes'),
        (PhotoDocumentation, 'Photo Documentation'),
        (OtherFiles, 'Other Files'),
    ]

    for model, item_name in checklist_items:
        if is_project_leader:
            count = model.objects.filter(project=project).count()
        else:
            count = model.objects.filter(project=project, proponent=user).count()
        document_counts[item_name] = count

    return Response({"document_counts": document_counts}, status=status.HTTP_200_OK)



# project progress
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def project_progress(request, project_id):
    try:
        # Get all checklist assignments for the given project
        checklist_assignments = ChecklistAssignment.objects.filter(project__projectID=project_id)

        # Calculate total assigned checklist items across all proponents
        total_assignments = ChecklistAssignment.objects.annotate(
            checklist_total=ExpressionWrapper(
                F("can_submit_daily_attendance")
                + F("can_submit_summary_of_evaluation")
                + F("can_submit_modules_lecture_notes")
                + F("can_submit_other_files")
                + F("can_submit_photo_documentation"),
                output_field=IntegerField(),  # Specify the output type
            )
        ).aggregate(total=Sum("checklist_total"))["total"] or 0

        # Calculate the count of approved submissions across all categories
        approved_submissions_count = DailyAttendanceRecord.objects.filter(
            project__projectID=project_id, status="Approved"
        ).distinct().count()

        approved_submissions_count += SummaryOfEvaluation.objects.filter(
            project__projectID=project_id, status="Approved"
        ).distinct().count()

        approved_submissions_count += ModulesLectureNotes.objects.filter(
            project__projectID=project_id, status="Approved"
        ).distinct().count()

        approved_submissions_count += PhotoDocumentation.objects.filter(
            project__projectID=project_id, status="Approved"
        ).distinct().count()

        approved_submissions_count += OtherFiles.objects.filter(
            project__projectID=project_id, status="Approved"
        ).distinct().count()

        # Avoid division by zero
        if total_assignments == 0:
            return Response({"progress": 0}, status=status.HTTP_200_OK)

        # Calculate progress
        progress = (approved_submissions_count / total_assignments) * 100
        return Response({"progress": min(progress, 100)}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


### Role Based Access
# expose user roles
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_roles(request):
    """Fetch roles of the authenticated user."""
    roles = request.user.roles.values_list('code', flat=True)
    return Response({"roles": list(roles)})


### upload files
@role_required(allowed_role_codes=["pjld", "ppnt"])
class DailyAttendanceUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        # Extract authenticated user
        user = request.user

        # Validate the authenticated user
        if not user:
            return Response({"error": "Invalid user session or token."}, status=status.HTTP_401_UNAUTHORIZED)

        # Extract and validate fields
        file = request.FILES.get('attendance_file')
        total_attendees = request.data.get('total_attendees')
        description = request.data.get('description')

        # Validate each field
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
        project = get_object_or_404(Project, projectID=project_id, status="approved")
        assignment = get_object_or_404(ChecklistAssignment, project=project, proponent=user)

        # Check permissions to submit
        if not assignment.can_submit_daily_attendance:
            return Response({"error": "You are not assigned to submit this item."}, status=status.HTTP_403_FORBIDDEN)

        # Create attendance record
        daily_attendance = DailyAttendanceRecord.objects.create(
            project=project,
            proponent=user,
            attendance_file=file,
            total_attendees=total_attendees,
            description=description,
        )

        # Serialize and return the response
        return Response(DailyAttendanceRecordSerializer(daily_attendance).data, status=status.HTTP_201_CREATED)



@role_required(allowed_role_codes=["pjld", "ppnt"])
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

@role_required(allowed_role_codes=["pjld", "ppnt"])
class ModulesLectureNotesUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        user = request.user

        file = request.FILES.get('module_file')
        description = request.data.get('description')

        if not file:
            return Response({"error": "Module file is required."}, status=status.HTTP_400_BAD_REQUEST)

        project = get_object_or_404(Project, projectID=project_id, status="approved")
        assignment = get_object_or_404(ChecklistAssignment, project=project, proponent=user)

        if not assignment.can_submit_modules_lecture_notes:
            return Response({"error": "You are not assigned to submit this item."}, status=status.HTTP_403_FORBIDDEN)

        # Save the uploaded file
        lecture_notes = ModulesLectureNotes.objects.create(
            project=project,
            proponent=user,
            module_file=file,  # File gets saved to the 'lecture_notes/' folder
            description=description,
        )

        return Response(ModulesLectureNotesSerializer(lecture_notes).data, status=status.HTTP_201_CREATED)


@role_required(allowed_role_codes=["pjld", "ppnt"])
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

@role_required(allowed_role_codes=["pjld", "ppnt"])
class OtherFilesUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        print("FILES:", request.FILES)  # Debug: Log incoming files
        print("DATA:", request.data)   # Debug: Log incoming data

        proponent_id = request.data.get('proponent')
        file = request.FILES.get('other_files')  # Match this with FormData key
        description = request.data.get('description')

        if not file:
            return Response({"error": "File is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch objects
        try:
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
            else:
                return Response({"error": "You are not assigned to submit this item."}, status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            return Response({"error": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Deletee submission
MODEL_MAP = {
    "daily_attendance": DailyAttendanceRecord,
    "summary_of_evaluation": SummaryOfEvaluation,
    "modules_lecture_notes": ModulesLectureNotes,
    "photo_documentation": PhotoDocumentation,
    "other_files": OtherFiles,
}

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_submission(request, model_name, submission_id):
    if model_name not in MODEL_MAP:
        return Response({"error": "Invalid model name."}, status=status.HTTP_400_BAD_REQUEST)

    Model = MODEL_MAP[model_name]

    try:
        submission = Model.objects.get(id=submission_id)
        project = submission.project
        is_project_leader = project.userID == request.user

        if not (is_project_leader or submission.proponent == request.user):
            return Response({"error": "Unauthorized action"}, status=status.HTTP_403_FORBIDDEN)

        submission.delete()
        return Response({"message": "Submission deleted successfully"}, status=status.HTTP_200_OK)

    except Model.DoesNotExist:
        return Response({"error": "Submission not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




## view all submissions
@role_required(allowed_role_codes=["pjld", "ppnt"])
class ChecklistItemSubmissionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id, checklist_item_name):
        try:
            # Get the authenticated user
            user = request.user

            # Initialize a list to store submissions
            submissions = []

            # Filter submissions based on the checklist item
            if checklist_item_name == "Daily Attendance":
                records = DailyAttendanceRecord.objects.filter(project__projectID=project_id, proponent=user)
            elif checklist_item_name == "Summary of Evaluation":
                records = SummaryOfEvaluation.objects.filter(project__projectID=project_id, proponent=user)
            elif checklist_item_name == "Lecture Notes":
                records = ModulesLectureNotes.objects.filter(project__projectID=project_id, proponent=user)
            elif checklist_item_name == "Photo Documentation":
                records = PhotoDocumentation.objects.filter(project__projectID=project_id, proponent=user)
            elif checklist_item_name == "Other Files":
                records = OtherFiles.objects.filter(project__projectID=project_id, proponent=user)
            else:
                return Response({"error": "Invalid checklist item name."}, status=status.HTTP_400_BAD_REQUEST)

            # Serialize submissions dynamically
            for record in records:
                submissions.append({
                    "submission_id": record.id,
                    "status": record.status,
                    "rejection_reason": record.rejection_reason,
                    "date_uploaded": record.date_uploaded,
                    "description": getattr(record, "description", "N/A"),  # Optional field
                    "file_name": (
                        getattr(record, 'attendance_file', None).name if getattr(record, 'attendance_file', None) else
                        getattr(record, 'summary_file', None).name if getattr(record, 'summary_file', None) else
                        getattr(record, 'module_file', None).name if getattr(record, 'module_file', None) else
                        getattr(record, 'photo', None).name if getattr(record, 'photo', None) else
                        getattr(record, 'file', None).name if getattr(record, 'file', None) else
                        None
                    )  
                })

            return Response({"submissions": submissions}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    
### assign checklist
@role_required(allowed_role_codes=["pjld"])
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
                        "can_submit_modules_lecture_notes": checklist_items.get("lecture_notes", False),
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
@role_required(allowed_role_codes=["pjld", "ppnt"])
class ChecklistItemSubmissionView(APIView): ## this is a different class from the first one above!!!!
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        try:
            # Fetch the project
            project = Project.objects.get(projectID=project_id, status="approved")

            # Check the role and filter assignments accordingly
            if "pjld" in [role.code for role in request.auth.role.all()]:
                # Project leaders see all assignments for the project
                assignments = ChecklistAssignment.objects.filter(project=project)
            elif "ppnt" in [role.code for role in request.auth.role.all()]:
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
@role_required(allowed_role_codes=["pjld"])
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
@role_required(allowed_role_codes=["pjld", "ppnt"])
class ProponentSubmissionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user  # Get the currently authenticated user
        submissions = {
            "daily_attendance": DailyAttendanceRecord.objects.filter(proponent=user),
            "summary_of_evaluation": SummaryOfEvaluation.objects.filter(proponent=user),
            "lecture_notes": ModulesLectureNotes.objects.filter(proponent=user),
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

        