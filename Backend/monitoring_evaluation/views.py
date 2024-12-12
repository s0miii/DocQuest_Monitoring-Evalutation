from rest_framework import status, viewsets, generics
from rest_framework.views import APIView, View
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.db import transaction
from django.db.models import F, Q, ExpressionWrapper, IntegerField, Sum
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
from django.conf import settings
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

# Email
@role_required(allowed_role_codes=["estf"])  # Restrict to EStaff
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_dynamic_reminder_email(request, project_id):
    user = request.user  # Logged-in EStaff user

    # Fetch the project
    project = get_object_or_404(Project, projectID=project_id, status="approved")

    # Fetch the project leader
    project_leader = project.userID  # The project leader (CustomUser instance)
    if not project_leader or not project_leader.email:
        return Response({"error": "Project leader email not found."}, status=400)

    # Fetch proponents associated with the project
    proponents = project.proponents.all()  # Related CustomUser instances
    proponent_emails = [proponent.email for proponent in proponents if proponent.email]

    # Combine project leader email with proponent emails
    recipient_list = [project_leader.email] + proponent_emails
    if not recipient_list:
        return Response({"error": "No recipients found for this project."}, status=400)

    # Check for missing checklist items
    missing_items = []

    # Check for missing Daily Attendance Records
    if not DailyAttendanceRecord.objects.filter(project=project, status="Approved").exists():
        missing_items.append("Daily Attendance Record")

    # Check for missing Summary of Evaluations
    if not SummaryOfEvaluation.objects.filter(project=project, status="Approved").exists():
        missing_items.append("Summary of Evaluation")

    if not TrainerCvDtr.objects.filter(project=project, status="Approved").exists():
        missing_items.append("Trainer CV/DTR")

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
        f"Dear Project Leader and Proponents,\n\n"
        "Good day! The following submissions are still missing for the project "
        f"'{project.projectTitle}':\n"
        + ("\n".join(f"• {item}" for item in missing_items) if missing_items else "No missing items found.")
        + "\n\nPlease ensure that all submissions are completed as soon as possible. Wenk wenk\n\n"
        "Gwapo si,\nKettaps"
    )

    # Send the email
    send_reminder_email(subject, message, recipient_list, sender_email=user.email)

    # Log the notification for each recipient
    for recipient in recipient_list:
        NotificationLog.objects.create(
            sender=user,
            project=project,
            recipient_email=recipient,
            subject=subject,
            message=message,
        )

    return Response({"message": "Reminder email sent successfully."}, status=200)


# retrieve projects based on user role each project
@role_required(allowed_role_codes=["pjld", "ppnt", "estf"])
class UserProjectsView(APIView):
    permission_classes = [IsAuthenticated]

    # Define role_mapping inside the class
    role_mapping = {
        "pjld": "Project Leader",
        "ppnt": "Proponent",
    }

    def get(self, request):
        user = request.user
        if not user:
            return Response({"error": "Invalid session"}, status=403)

        try:
            # Filter projects where the user is a project leader or proponent
            projects = Project.objects.filter(
                Q(userID=user) | Q(proponents__userID=user.userID),
                status="approved"
            ).distinct()

            combined_projects = []
            for project in projects:
                role = None
                # Determine the role based on user association with the project
                if project.userID == user:
                    role = self.role_mapping.get("pjld")  # Map "pjld" role code
                elif project.proponents.filter(userID=user.userID).exists():
                    role = self.role_mapping.get("ppnt")  # Map "ppnt" role code

                if role:
                    combined_projects.append({
                        "projectID": project.projectID,
                        "projectTitle": project.projectTitle,
                        "background": project.background,
                        "targetImplementation": f"{project.targetStartDateImplementation or 'N/A'} - {project.targetEndDateImplementation or 'N/A'}",
                        "role": role,
                    })

            return Response(combined_projects, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


# retrieve projects for staff role
@role_required(allowed_role_codes=["estf"])  # Restrict access to estaff only
class StaffProjectsView(APIView):
    permission_classes = [IsAuthenticated]

    # Define role mapping for scalability (only estf for now)
    role_mapping = {
        "estf": "Extension Staff",
    }

    def get(self, request):
        user = request.user
        if not user:
            return Response({"error": "Invalid session"}, status=403)

        try:
            # Fetch all approved projects
            projects = Project.objects.filter(status="approved").distinct()

            combined_projects = []
            for project in projects:
                role = self.role_mapping.get("estf")  # Map to "Extension Staff"
                
                # Add project details to the response
                combined_projects.append({
                    "projectID": project.projectID,
                    "projectTitle": project.projectTitle,
                    "projectLeader": f"{project.userID.firstname} {project.userID.lastname}",  # Get project leader's name
                    "targetImplementation": f"{project.targetStartDateImplementation or 'N/A'} - {project.targetEndDateImplementation or 'N/A'}",
                    "role": role,
                })

            return Response(combined_projects, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

    
# Proponent Project Details
@role_required(allowed_role_codes=["ppnt", "estf", "coord"])
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
                if assignment.can_submit_trainer_cv_dtr:
                    assigned_requirements.append("Trainer CV DTR")
                if assignment.can_submit_modules_lecture_notes:
                    assigned_requirements.append("Lecture Notes")
                if assignment.can_submit_photo_documentation:
                    assigned_requirements.append("Photo Documentations")
                if assignment.can_submit_other_files:
                    assigned_requirements.append("Other Files")
                

            return Response({
                "projectDetails": project_details,
                "assignedRequirements": assigned_requirements,
            }, status=status.HTTP_200_OK)

        except Project.DoesNotExist:
            return Response({"error": "Project not found."}, status=status.HTTP_404_NOT_FOUND)
        except CustomUser.DoesNotExist:
            return Response({"error": "Project Leader not found."}, status=status.HTTP_404_NOT_FOUND)

# get project proponents
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def project_proponents(request, project_id):
    """
    Get all proponents assigned to a specific project.
    """
    try:
        # Fetch the project
        project = get_object_or_404(Project, projectID=project_id, status="approved")

        # Retrieve proponents
        proponents = project.proponents.all()  # Access the many-to-many relationship

        # Serialize proponents
        serialized_proponents = [
            {
                "id": proponent.userID,
                "name": f"{proponent.firstname} {proponent.lastname}",
            }
            for proponent in proponents
        ]

        return Response({"proponents": serialized_proponents}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

# document count for checklist item
@role_required(allowed_role_codes=["pjld", "ppnt", "estf", "coord"])
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def document_counts(request, project_id):
    user = request.user
    project = get_object_or_404(Project, projectID=project_id, status="approved")

    # Check user roles dynamically
    is_project_leader = project.userID == user
    is_estaff = user.role.filter(code="estf").exists()  # Adjusted for `role` field
    is_coord = user.role.filter(code="coord").exists()  # Adjusted for `role` field

    # Initialize counts dictionary
    document_counts = {}

    # Define checklist items
    checklist_items = [
        (DailyAttendanceRecord, 'Daily Attendance'),
        (SummaryOfEvaluation, 'Summary of Evaluation'),
        (TrainerCvDtr, 'Trainer CV-DTR'),
        (ModulesLectureNotes, 'Lecture Notes'),
        (PhotoDocumentation, 'Photo Documentations'),
        (OtherFiles, 'Other Files'),
    ]

    for model, item_name in checklist_items:
        try:
            if is_project_leader:  # Project leader sees all documents
                count = model.objects.filter(project=project).count()
            elif is_estaff:  # estaff and coordinator see all documents
                count = model.objects.filter(project=project).count()
            # elif is_coord:  # estaff and coordinator see all documents
            #     count = model.objects.filter(project=project, status="Approved").count()
            else:  # Proponent sees only their own documents
                count = model.objects.filter(project=project, proponent=user).count()

            document_counts[item_name] = count
        except Exception as e:
            document_counts[item_name] = 0
            print(f"Error processing {item_name}: {e}")

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
                + F("can_submit_trainer_cv_dtr")
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

        approved_submissions_count += TrainerCvDtr.objects.filter(
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
@role_required(allowed_role_codes=["pjld", "ppnt", "estf", "coord"])
class DailyAttendanceUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        user = request.user

        if not user:
            return Response({"error": "Invalid user session or token."}, status=status.HTTP_401_UNAUTHORIZED)

        file = request.FILES.get('attendance_file')
        total_attendees = request.data.get('total_attendees')
        description = request.data.get('description')

        if not file or not total_attendees or not description:
            return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            total_attendees = int(total_attendees)
        except ValueError:
            return Response({"error": "Total attendees must be a valid number."}, status=status.HTTP_400_BAD_REQUEST)

        project = get_object_or_404(Project, projectID=project_id, status="approved")

        if project.userID == user:
            pass
        else:
            try:
                assignment = ChecklistAssignment.objects.get(project=project, proponent=user)
                if not assignment.can_submit_daily_attendance:
                    return Response({"error": "You are not assigned to submit this item."}, status=status.HTTP_403_FORBIDDEN)
            except ChecklistAssignment.DoesNotExist:
                return Response({"error": "Checklist assignment not found for this proponent."}, status=status.HTTP_404_NOT_FOUND)

        try:
            daily_attendance = DailyAttendanceRecord.objects.create(
                project=project,
                proponent=user,
                attendance_file=file,
                total_attendees=total_attendees,
                description=description,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        serialized_data = DailyAttendanceRecordSerializer(daily_attendance).data
        return Response(serialized_data, status=status.HTTP_201_CREATED)



@role_required(allowed_role_codes=["pjld", "ppnt", "estf", "coord"])
class SummaryOfEvaluationUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        user = request.user

        file = request.FILES.get('summary_file')
        if not file:
            return Response({"error": "Summary file is required."}, status=status.HTTP_400_BAD_REQUEST)

        project = get_object_or_404(Project, projectID=project_id, status="approved")

        if project.userID == user:  
            pass
        else:
            assignment = get_object_or_404(ChecklistAssignment, project=project, proponent=user)
            if not assignment.can_submit_summary_of_evaluation:
                return Response({"error": "You are not assigned to submit this item."}, status=status.HTTP_403_FORBIDDEN)

        summary = SummaryOfEvaluation.objects.create(
            project=project,
            proponent=user,
            summary_file=file
        )
        return Response(SummaryOfEvaluationSerializer(summary).data, status=status.HTTP_201_CREATED)

@role_required(allowed_role_codes=["pjld", "ppnt", "estf", "coord"])
class TrainerCvDtrUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        user = request.user

        file = request.FILES.get('cv_dtr_file')
        description = request.data.get('description')

        if not file:
            return Response({"error": "Trainer CV/DTR is required."}, status=status.HTTP_400_BAD_REQUEST)

        project = get_object_or_404(Project, projectID=project_id, status="approved")

        if project.userID == user:  
            pass
        else:
            assignment = get_object_or_404(ChecklistAssignment, project=project, proponent=user)
            if not assignment.can_submit_modules_lecture_notes:
                return Response({"error": "You are not assigned to submit this item."}, status=status.HTTP_403_FORBIDDEN)

        trainer_cv_dtr = TrainerCvDtr.objects.create(
            project=project,
            proponent=user,
            module_file=file,
            description=description,
        )

        return Response(TrainerCvDtrSerializer(trainer_cv_dtr).data, status=status.HTTP_201_CREATED)

@role_required(allowed_role_codes=["pjld", "ppnt", "estf", "coord"])
class ModulesLectureNotesUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        user = request.user

        file = request.FILES.get('module_file')
        description = request.data.get('description')

        if not file:
            return Response({"error": "Module file is required."}, status=status.HTTP_400_BAD_REQUEST)

        project = get_object_or_404(Project, projectID=project_id, status="approved")

        if project.userID == user:  
            pass
        else:
            assignment = get_object_or_404(ChecklistAssignment, project=project, proponent=user)
            if not assignment.can_submit_modules_lecture_notes:
                return Response({"error": "You are not assigned to submit this item."}, status=status.HTTP_403_FORBIDDEN)

        lecture_notes = ModulesLectureNotes.objects.create(
            project=project,
            proponent=user,
            module_file=file,
            description=description,
        )

        return Response(ModulesLectureNotesSerializer(lecture_notes).data, status=status.HTTP_201_CREATED)


@role_required(allowed_role_codes=["pjld", "ppnt", "estf", "coord"])
class PhotoDocumentationUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        user = request.user

        file = request.FILES.get('photo')
        description = request.data.get('description')

        if not file:
            return Response({"error": "Photo file is required."}, status=status.HTTP_400_BAD_REQUEST)

        project = get_object_or_404(Project, projectID=project_id, status="approved")

        if project.userID == user:  
            pass
        else:
            assignment = get_object_or_404(ChecklistAssignment, project=project, proponent=user)
            if not assignment.can_submit_photo_documentation:
                return Response({"error": "You are not assigned to submit this item."}, status=status.HTTP_403_FORBIDDEN)

        photo = PhotoDocumentation.objects.create(
            project=project,
            proponent=user,
            photo=file,
            description=description
        )

        return Response(PhotoDocumentationSerializer(photo).data, status=status.HTTP_201_CREATED)

@role_required(allowed_role_codes=["pjld", "ppnt", "estf", "coord"])
class OtherFilesUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        user = request.user

        file = request.FILES.get('other_files')
        description = request.data.get('description')

        if not file:
            return Response({"error": "File is required."}, status=status.HTTP_400_BAD_REQUEST)

        project = get_object_or_404(Project, projectID=project_id, status="approved")

        if project.userID == user:  
            pass
        else:
            assignment = get_object_or_404(ChecklistAssignment, project=project, proponent=user)
            if not assignment.can_submit_other_files:
                return Response({"error": "You are not assigned to submit this item."}, status=status.HTTP_403_FORBIDDEN)

        other_file = OtherFiles.objects.create(
            project=project,
            proponent=user,
            file=file,
            description=description
        )

        return Response(OtherFilesSerializer(other_file).data, status=status.HTTP_201_CREATED)


# Deletee submission
MODEL_MAP = {
    "daily_attendance": DailyAttendanceRecord,
    "summary_of_evaluation": SummaryOfEvaluation,
    "trainer_cv_dtr": TrainerCvDtr,
    "modules_lecture_notes": ModulesLectureNotes,
    "photo_documentations": PhotoDocumentation,
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
@role_required(allowed_role_codes=["pjld", "ppnt", "estf", "coord"])
class ChecklistItemSubmissionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id, checklist_item_name):
        try:
            # Get the authenticated user
            user = request.user

            # Fetch the project
            project = get_object_or_404(Project, projectID=project_id, status="approved")

            # Determine roles for the user
            is_estaff = user.role.filter(code="estf").exists()
            is_project_leader = project.userID == user
            is_proponent = project.proponents.filter(userID=user.userID).exists()

            # Ensure user has access to the project
            if not (is_project_leader or is_proponent or is_estaff):
                return Response({"error": "You do not have access to this project."}, status=status.HTTP_403_FORBIDDEN)

            # Initialize submissions list
            submissions = []

            # Determine the model to use based on the checklist item name
            model_mapping = {
                "Daily Attendance": (DailyAttendanceRecord, "attendance_records"),
                "Summary of Evaluation": (SummaryOfEvaluation, "summary_of_evaluations"),
                "Trainer CV DTR": (TrainerCvDtr, "trainer_cv_dtr"),
                "Lecture Notes": (ModulesLectureNotes, "lecture_notes"),
                "Photo Documentations": (PhotoDocumentation, "photo_documentations"),
                "Other Files": (OtherFiles, "other_files"),
            }

            if checklist_item_name not in model_mapping:
                return Response({"error": "Invalid checklist item name."}, status=status.HTTP_400_BAD_REQUEST)

            model, directory = model_mapping[checklist_item_name]

            # Fetch records based on role
            if is_project_leader:
                # Fetch records for project leader and all proponents
                records = model.objects.filter(project=project, proponent__in=[user] + list(project.proponents.all()))
            elif is_estaff:
                # Fetch all records for EStaff
                records = model.objects.filter(project=project)
            else:
                # Fetch records specific to the proponent
                records = model.objects.filter(project=project, proponent=user)

            # Serialize submissions
            for record in records:
                file_field = (
                    getattr(record, 'attendance_file', None) or
                    getattr(record, 'summary_file', None) or
                    getattr(record, 'cv_dtr_file', None) or
                    getattr(record, 'module_file', None) or
                    getattr(record, 'photo', None) or
                    getattr(record, 'file', None)
                )

                submissions.append({
                    "submission_id": record.id,
                    "status": getattr(record, "status", "N/A"),
                    "rejection_reason": getattr(record, "rejection_reason", None),
                    "date_uploaded": getattr(record, "date_uploaded", None),
                    "total_attendees": getattr(record, "total_attendees", "N/A"),
                    "description": getattr(record, "description", "N/A"),
                    "submitted_by": f"{record.proponent.firstname} {record.proponent.lastname}" if record.proponent else "Unknown",
                    "file_name": file_field.name.split('/')[-1] if file_field else "No File",
                    "directory": directory,
                })

            return Response({"submissions": submissions}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error in ChecklistItemSubmissionsView: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



    
### assign checklist@role_required(allowed_role_codes=["pjld"])
@role_required(allowed_role_codes=["pjld"])
@method_decorator(csrf_exempt, name='dispatch')
class AssignChecklistItemsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, projectID):
        project_id = projectID  # Extract projectID from the URL
        proponent_id = request.data.get('proponent')
        checklist_items = request.data.get('checklist_items', {})

        if not proponent_id:
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


def get_proponent_checklist(request, project_id):
    try:
        # Fetch the project and related proponents
        project = Project.objects.get(id=project_id)
        proponents = project.proponents.all()

        # Fetch the checklist assignments for each proponent in the project
        data = []
        for proponent in proponents:
            assignments = ChecklistAssignment.objects.filter(project=project, proponent=proponent)
            checklist = {
                "id": proponent.id,
                "name": proponent.name,  # Adjust according to your user model
                "daily_attendance": assignments.filter(item="daily_attendance").exists(),
                "summary_of_evaluation": assignments.filter(item="summary_of_evaluation").exists(),
                "trainer_cv_dtr": assignments.filter(item="trainer_cv_dtr").exists(),
                "lecture_notes": assignments.filter(item="lecture_notes").exists(),
                "other_files": assignments.filter(item="other_files").exists(),
                "photo_documentation": assignments.filter(item="photo_documentation").exists(),
            }
            data.append(checklist)

        return JsonResponse({"proponents": data}, status=200)

    except Project.DoesNotExist:
        return JsonResponse({"error": "Project not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

## View checklist assignments by project
@role_required(allowed_role_codes=["pjld", "ppnt", "estf", "coord"])
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
                    "can_submit_trainer_cv_dtr": assignment.can_submit_trainer_cv_dtr,
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
    "trainer_cv_dtr": TrainerCvDtr,
    "lecture_notes": ModulesLectureNotes,
    "photo_documentations": PhotoDocumentation,
    "other_files": OtherFiles,
}
@role_required(allowed_role_codes=["estf"])
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

            # Handle rejection reason
            if status_value == "Rejected":
                if not rejection_reason:
                    return Response({"error": "Rejection reason is required for rejection."}, status=status.HTTP_400_BAD_REQUEST)
                submission.rejection_reason = rejection_reason
            else:
                submission.rejection_reason = None  # Clear rejection reason for other statuses

            submission.save()

            return Response({"message": f"Submission status updated to {status_value}."}, status=status.HTTP_200_OK)

        except Model.DoesNotExist:
            return Response({"error": "Submission not found."}, status=status.HTTP_404_NOT_FOUND)

# proponent view, display the status and rejection reason
@role_required(allowed_role_codes=["pjld", "ppnt", "estf", "coord"])
class ProponentSubmissionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user  # Get the currently authenticated user
        submissions = {
            "daily_attendance": DailyAttendanceRecord.objects.filter(proponent=user),
            "summary_of_evaluation": SummaryOfEvaluation.objects.filter(proponent=user),
            "trainer_cv_dtr": TrainerCvDtr.objects.filter(proponent=user),
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
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = {'trainer': ['exact'], 'project': ['exact']}  # These must match model field names
    search_fields = ['attendee_name', 'project__projectTitle', 'trainer__faculty']
    ordering_fields = ['submitted_at', 'overall_rating']

    def get_queryset(self):
        queryset = super().get_queryset()
        trainer = self.request.query_params.get('trainer')
        project = self.request.query_params.get('project')
        
        if trainer:
            queryset = queryset.filter(trainer_id=trainer)
        if project:
            queryset = queryset.filter(project_id=project)
        
        print(f"Filtered queryset: {queryset.query}")  # Log the filtered query
        return queryset

class EvaluationSharableLinkViewSet(viewsets.ModelViewSet):
    queryset = EvaluationSharableLink.objects.all()
    serializer_class = EvaluationSharableLinkSerializer

    # List all sharable links
    def list(self, request, *args, **kwargs):
        # Handle GET requests to list all sharable links.
        
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    # Retrieve a specific sharable link by ID
    def retrieve(self, request, pk=None):
        # Handle GET requests to retrieve a specific sharable link.
        sharable_link = get_object_or_404(EvaluationSharableLink, pk=pk)
        serializer = self.get_serializer(sharable_link)
        return Response(serializer.data)
        
    def create(self, request, *args, **kwargs):
        try:
            trainer_id = request.data.get("trainer_id")
            project_id = request.data.get("project_id")
            expiration_date = request.data.get("expiration_date")
            trainer = LoadingOfTrainers.objects.get(pk=trainer_id)
            project = Project.objects.get(pk=project_id)

            link, created = EvaluationSharableLink.objects.get_or_create(
                trainer=trainer,
                project=project,
                defaults={"expiration_date": expiration_date},
            )

            if not created:
                link.expiration_date = expiration_date
                link.save()

            return Response(
                {"message": "Sharable link created/retrieved successfully", "data": EvaluationSharableLinkSerializer(link).data},
                status=status.HTTP_201_CREATED,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            
# # Evaluation Form View for HTML Form Submission
# def evaluation_form_view(request, project_id, trainer_id=None):
#     project = get_object_or_404(Project, projectID=project_id)
#     trainer = get_object_or_404(LoadingOfTrainers, LOTID=trainer_id) if trainer_id else None #Set trainer to None if not provided for project-only evaluations

#     access_token = request.GET.get("access_token")
#     evaluation = get_object_or_404(Evaluation, project=project, trainer=trainer)
#     if access_token != evaluation.access_token:
#         return HttpResponseForbidden("Invalid or missing access token.")

#     if request.method == 'POST':
#         form = EvaluationForm(request.POST)
#         if form.is_valid():
#             evaluation = form.save(commit=False)
#             evaluation.project = project
#             if trainer:
#                 evaluation.trainer = trainer
#             evaluation.stored_overall_rating = evaluation.calculate_overall_rating()
#             evaluation.save()
            
#             return render(request, 'thank_you.html', {'stored_overall_rating': evaluation.stored_overall_rating})
#     else:
#         form = EvaluationForm()

#     return render(request, 'evaluation_form.html', {'form': form, 'trainer': trainer, 'project': project})    

# def evaluation_summary_view(request):
#     projects = Project.objects.all()
#     project_summaries = []

#     for project in projects:
#         trainers = project.loadingOfTrainers.all()
#         trainer_evaluations = []

#         for trainer in trainers:
#             evaluations = Evaluation.objects.filter(project=project, trainer=trainer)
#             if evaluations.exists():
#                 trainer_evaluations.append({
#                     'trainer': trainer,
#                     'evaluations': evaluations,
#                 })

#         if trainer_evaluations:
#             project_summaries.append({
#                 'project': project,
#                 'trainer_evaluations': trainer_evaluations,
#             })        

#     context = {'project_summaries': project_summaries}
#     return render(request, 'evaluation_summary.html', context)            


#EVAL NGA API-BASED NA
class GenerateEvaluationSharableLinkView(APIView):
    # API to generate sharable links for evaluations.
    def post(self, request):
        trainer_id = request.data.get("trainer_id")
        project_id = request.data.get("project_id")
        expiration_date = request.data.get("expiration_date")

        try:
            sharable_link, created = EvaluationSharableLink.objects.get_or_create(
                trainer_id=trainer_id,
                project_id=project_id,
                defaults={"expiration_date": expiration_date},
            )
            if not created:
                sharable_link.expiration_date = expiration_date
                sharable_link.save()

            return Response({
                "message": "Sharable link generated successfully.",
                "data": {
                    "trainer_id": trainer_id,
                    "project_id": project_id,
                    "link": sharable_link.sharable_link,
                    "expiration_date": sharable_link.expiration_date,
                }
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class SubmitEvaluationView(APIView):
    # API to retrieve and submit evaluations via sharable links.
    permission_classes = [AllowAny]
    
    def get(self, request, token):
        sharable_link = get_object_or_404(EvaluationSharableLink, token=token)

        if sharable_link.expiration_date and sharable_link.expiration_date < timezone.now().date():
            return Response({"error": "This link has expired."}, status=status.HTTP_400_BAD_REQUEST)

        base_url = request.build_absolute_uri('/')[:-1]
        sharable_link_url = f"{base_url}/monitoring/evaluation/fill/{sharable_link.token}/"

        return Response({
            "trainer_id": sharable_link.trainer.LOTID,
            "trainer_name": sharable_link.trainer.faculty,
            "project_id": sharable_link.project.projectID,
            "project_title": sharable_link.project.projectTitle,
            "expiration_date": sharable_link.expiration_date,
            "sharable_link": sharable_link_url
        }, status=status.HTTP_200_OK)

    def post(self, request, token):
            sharable_link = get_object_or_404(EvaluationSharableLink, token=token)

            if sharable_link.expiration_date and sharable_link.expiration_date < timezone.now().date():
                return Response({"error": "This link has expired."}, status=status.HTTP_400_BAD_REQUEST)

            required_fields = ["attendee_name", "relevance_of_topics", "organizational_flow", "learning_methods"]
            missing_fields = [field for field in required_fields if field not in request.data]
            if missing_fields:
                return Response({"error": f"Missing required fields: {', '.join(missing_fields)}"}, status=status.HTTP_400_BAD_REQUEST)

            existing_evaluation = Evaluation.objects.filter(
                attendee_name=request.data.get("attendee_name"),
                trainer=sharable_link.trainer,
                project=sharable_link.project
            ).first()

            if existing_evaluation:
                return Response({"error": "You have already submitted an evaluation."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Inject trainer and project into the data
            data = request.data.copy()
            data["trainer"] = sharable_link.trainer.LOTID
            data["project"] = sharable_link.project.projectID

            serializer = EvaluationSerializer(data=data)
            if serializer.is_valid():
                evaluation = serializer.save()
                return Response({
                    "message": "Evaluation submitted successfully.",
                    "evaluation_id": evaluation.id
                }, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

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
        
        expiration_date = request.data.get("expiration_date")
        if not expiration_date:
            return Response({"error": "Expiration date is required."}, status=400)

        try:
            expiration_date = datetime.strptime(expiration_date, "%Y-%m-%d").date()
        except ValueError:
            return Response({"error": "Invalid date format. Use 'YYYY-MM-DD'."}, status=400)
        

        # Create the template
        attendance_template = AttendanceTemplate.objects.create(project=project, expiration_date=expiration_date, **fields)

        # # Generate sharable link
        # sharable_link = f"{request.build_absolute_uri('/')[:-1]}/monitoring/attendance/fill/{attendance_template.token}/"

        # Use the frontend base URL for the sharable link
        frontend_base_url = settings.FRONTEND_BASE_URL  # Retrieve the frontend URL from settings
        sharable_link = f"{frontend_base_url}/attendance/fill/{attendance_template.token}/"

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
    

    @action(detail=False, methods=['get'], url_path='template/(?P<template_id>[^/.]+)')
    def get_by_template(self, request, template_id=None):
        records = CreatedAttendanceRecord.objects.filter(template__id=template_id)
        if not records.exists():
            return Response({"message": "No attendance records found for this template."}, status=404)
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

        