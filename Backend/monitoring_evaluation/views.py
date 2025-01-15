from rest_framework import status, viewsets, generics
from rest_framework.views import APIView, View
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.renderers import JSONRenderer
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.db import transaction
from django.db.models import F, Q, ExpressionWrapper, IntegerField, Sum, Count
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.paginator import Paginator, EmptyPage
from django.shortcuts import get_object_or_404, render, redirect
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse
from docquestapp.models import Roles, Project, LoadingOfTrainers
from .models import *
from .forms import *
from .serializers import *
from .utils import send_reminder_email
from .decorators import role_required
from django.http import HttpResponseForbidden, JsonResponse
import secrets, logging
from django.utils.dateparse import parse_date
from django.conf import settings
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from datetime import datetime

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

### file uploads

# upload file
# def upload_file(request):
#     if request.method == 'POST' and request.FILES.get('file'):
#         uploaded_file = request.FILES['file']
#         file_instance = UploadedFile(
#             name=uploaded_file.name,
#             content_type=uploaded_file.content_type,
#             file_data=uploaded_file.read()
#         )
#         file_instance.save()
#         return JsonResponse({'message':'File uploaded successfully'})
#     return JsonResponse({'error': 'No file uploaded'}, status=400)

# # serve file
# def serve_file(request, file_id):
#     try:
#         file_instance = UploadedFile.objects.get(id=file_id)
#         response = HttpResponse(file_instance.file_data, content_type=file_instance.content_type)
#         response['Content-Disposition'] = f'attachment; filename="{file_instance.name}"'
#         return response
#     except UploadedFile.DoesNotExist:
#         return HttpResponse('File not found', status=404)


# retrieve projects based on user role each project
@role_required(allowed_role_codes=["pjld", "ppnt", "estf", "coord", "head"])
class UserProjectsView(APIView):
    permission_classes = [IsAuthenticated]

    role_mapping = {
        "pjld": "Project Leader",
        "ppnt": "Proponent",
    }

    def get(self, request):
        user = request.user
        if not user:
            return Response({"error": "Invalid session"}, status=status.HTTP_403_FORBIDDEN)

        try:
            # Fetch projects and prefetch related data
            projects = Project.objects.filter(
                Q(userID=user) | Q(proponents__userID=user.userID),
                status__in=["approved"]
            ).distinct().prefetch_related('proponents')

            combined_projects = []
            for project in projects:
                role = None
                if project.userID == user:
                    role = self.role_mapping.get("pjld")
                elif project.proponents.filter(userID=user.userID).exists():
                    role = self.role_mapping.get("ppnt")

                combined_projects.append({
                    "projectID": project.projectID,
                    "projectTitle": project.projectTitle,
                    "background": project.background,
                    "targetImplementation": f"{project.targetStartDateImplementation or 'N/A'} - {project.targetEndDateImplementation or 'N/A'}",
                    "role": role,
                })


            # Pagination logic
            try:
                page = int(request.GET.get('page', 1))
                if page < 1:
                    raise ValueError
            except ValueError:
                return Response({"error": "Invalid page number"}, status=status.HTTP_400_BAD_REQUEST)

            page_size = min(int(request.GET.get('page_size', 5)), 100)  # Limit max page size
            paginator = Paginator(combined_projects, page_size)

            try:
                paginated_projects = paginator.page(page)
            except EmptyPage:
                paginated_projects = []
                return Response({
                    "data": [],
                    "meta": {
                        "total_pages": paginator.num_pages,
                        "current_page": int(page),
                        "total_items": paginator.count,
                    },
                }, status=status.HTTP_200_OK)

            return Response({
                "data": paginated_projects.object_list,
                "meta": {
                    "total_pages": paginator.num_pages,
                    "current_page": int(page),
                    "total_items": paginator.count,
                },
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error in UserProjectsView: {str(e)}")
            return Response(
                {"error": "An internal server error occurred"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# retrieve projects for staff role
@role_required(allowed_role_codes=["estf", "coord", "head"])  # Restrict access to estaff only
class StaffProjectsView(APIView):
    permission_classes = [IsAuthenticated]

    # Define role mapping for scalability (only estf for now)
    role_mapping = {
        "estf": "Extension Staff",
        "coord": "College Extension Coordinator",
        "head": "Department/College Head",
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

            # Pagination logic
            try:
                page = int(request.GET.get('page', 1))
                if page < 1:
                    raise ValueError
            except ValueError:
                return Response({"error": "Invalid page number"}, status=status.HTTP_400_BAD_REQUEST)

            page_size = min(int(request.GET.get('page_size', 5)), 100)  # Limit max page size
            paginator = Paginator(combined_projects, page_size)

            try:
                paginated_projects = paginator.page(page)
            except EmptyPage:
                paginated_projects = []
                return Response({
                    "data": [],
                    "meta": {
                        "total_pages": paginator.num_pages,
                        "current_page": int(page),
                        "total_items": paginator.count,
                    },
                }, status=status.HTTP_200_OK)
            
            return Response({
                "data": paginated_projects.object_list,
                "meta": {
                    "total_pages": paginator.num_pages,
                    "current_page": int(page),
                    "total_items": paginator.count,
                },
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error in StaffProjectsView: {str(e)}")
            return Response(
                {"error": "An internal server error occurred"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    
# Proponent Project Details
@role_required(allowed_role_codes=["ppnt", "estf", "coord", "head"])
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
@role_required(allowed_role_codes=["pjld", "ppnt", "estf", "coord", "head"])
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def document_counts(request, project_id):
    user = request.user
    project = get_object_or_404(Project, projectID=project_id, status="approved")

    # Check user roles dynamically
    is_project_leader = project.userID == user
    is_estaff = user.role.filter(code="estf").exists()  
    is_coord = user.role.filter(code="coord").exists()
    is_head = user.role.filter(code="head").exists()  

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
            elif is_estaff:  # estaff, coordinator and head see all documents
                count = model.objects.filter(project=project).count()
            elif is_coord:  # estaff, coordinator and head see all documents
                count = model.objects.filter(project=project, status="Approved").count()
            elif is_head:  # estaff, coordinator and head see all documents
                count = model.objects.filter(project=project, status="Approved").count()
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
@role_required(allowed_role_codes=["pjld", "ppnt", "estf", "coord", "head"])
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
    "lecture_notes": ModulesLectureNotes,
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
@role_required(allowed_role_codes=["pjld", "ppnt", "estf", "coord", "head"])
class ChecklistItemSubmissionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id, checklist_item_name):
        try:
            # Get the authenticated user
            user = request.user

            # Fetch the project
            project = get_object_or_404(Project, projectID=project_id, status="approved")

            # Determine roles for the user
            is_head = user.role.filter(code="head").exists()
            is_coord = user.role.filter(code="coord").exists()
            is_estaff = user.role.filter(code="estf").exists()
            is_project_leader = project.userID == user
            is_proponent = project.proponents.filter(userID=user.userID).exists()

            # Ensure user has access to the project
            if not (is_project_leader or is_proponent or is_estaff or is_coord or is_head):
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
            elif is_head:
                # Fetch all records for Head
                records = model.objects.filter(project=project, status="Approved")
            elif is_coord:
                # Fetch all records for Coordinator
                records = model.objects.filter(project=project, status="Approved")
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

                #debug prints
                print("===== Debug Info =====")
                print(f"Record ID: {record.id}")
                print(f"File field: {file_field}")
                print(f"Storage backend: {type(file_field.storage).__name__ if file_field else None}")
                print(f"File URL: {file_field.url if file_field else None}")

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
                    "file_url": file_field.url if file_field else None,
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
                        "can_submit_trainer_cv_dtr": checklist_items.get("trainer_cv_dtr", False),
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
        project = Project.objects.get(projectID=project_id)
        proponents = project.proponents.all()

        # Fetch the checklist assignments for each proponent in the project
        data = []
        for proponent in proponents:
            assignments = ChecklistAssignment.objects.filter(project=project, proponent=proponent).first()
            checklist = {
                "id": proponent.userID,
                "name": f"{proponent.firstname} {proponent.lastname}",
                "daily_attendance": getattr(assignments, "can_submit_daily_attendance", False),
                "summary_of_evaluation": getattr(assignments, "can_submit_summary_of_evaluation", False),
                "trainer_cv_dtr": getattr(assignments, "can_submit_trainer_cv_dtr", False),
                "lecture_notes": getattr(assignments, "can_submit_modules_lecture_notes", False),
                "other_files": getattr(assignments, "can_submit_other_files", False),
                "photo_documentation": getattr(assignments, "can_submit_photo_documentation", False),
            }
            data.append(checklist)

        return JsonResponse({"proponents": data}, status=200)

    except Project.DoesNotExist:
        return JsonResponse({"error": "Project not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)




## View checklist assignments by project
@role_required(allowed_role_codes=["pjld", "ppnt", "estf", "coord", "head"])
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
@role_required(allowed_role_codes=["pjld", "ppnt", "estf", "coord", "head"])
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
    filterset_fields = {'trainer': ['exact'], 'project': ['exact']}
    search_fields = ['attendee_name', 'project__projectTitle', 'trainer__faculty']
    ordering_fields = ['submitted_at', 'overall_rating']

    def get_queryset(self):
        queryset = super().get_queryset()
        trainer = self.request.query_params.get('trainer')
        project = self.request.query_params.get('project')
        
        if project:
            queryset = queryset.filter(project_id=project)
        if trainer:
            queryset = queryset.filter(trainer_id=trainer)

        print(f"Filtered queryset: {queryset.query}")  # Log the filtered query
        return queryset

class EvaluationSharableLinkViewSet(viewsets.ModelViewSet):
    queryset = EvaluationSharableLink.objects.all()
    serializer_class = EvaluationSharableLinkSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {'project': ['exact']}

    def get_queryset(self):
        queryset = EvaluationSharableLink.objects.all()
        project = self.request.query_params.get('project', None)
        if project:
            queryset = queryset.filter(project_id=project)
            
        return queryset

    def list(self, request, *args, **kwargs):
        # List all sharable links.
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({"links": serializer.data})

    def retrieve(self, request, pk=None):
        # Retrieve a specific sharable link by ID.
        sharable_link = get_object_or_404(EvaluationSharableLink, pk=pk)
        serializer = self.get_serializer(sharable_link)
        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        try:
            trainer_id = request.data.get("trainer_id")
            project_id = request.data.get("project_id")
            expiration_date = request.data.get("expiration_date")

            # Fetch the project project
            project = Project.objects.get(pk=project_id)

            # Validate trainer if related siya sa project (if naay trainer)
            trainer = None
            if trainer_id:
                trainer = LoadingOfTrainers.objects.filter(pk=trainer_id, project=project).first()
                if not trainer:
                    return Response(
                        {"error": f"Trainer with ID {trainer_id} is not associated with Project ID {project_id}."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            #  Create or update sharable link
            link, created = EvaluationSharableLink.objects.get_or_create(
                project=project,
                trainer=trainer,  # This will be None if no trainer is provided
                defaults={"expiration_date": expiration_date},
            )

            if not created:
                link.expiration_date = expiration_date
                link.save()

            response_data = EvaluationSharableLinkSerializer(link).data

            # Remove trainer-related fields if no trainer is assigned
            if not trainer:
                response_data.pop("trainer", None)
                response_data.pop("trainer_name", None)

            return Response(
                {"message": "Sharable link created/retrieved successfully", "data": response_data},
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# API-based Eval Link Generation - NEW
class GenerateEvaluationSharableLinkView(APIView):
    # API to generate sharable links for evaluations.
    def post(self, request):
        project_id = request.data.get("project_id")
        trainer_id = request.data.get("trainer_id")
        expiration_date = request.data.get("expiration_date")

        try:
            project = Project.objects.get(pk=project_id)

            # Check if the project has a trainer
            trainer = None
            if trainer_id:
                trainer = LoadingOfTrainers.objects.filter(pk=trainer_id).first()
                if not trainer:
                    return Response({"error": "Trainer not found."}, status=status.HTTP_400_BAD_REQUEST)

            sharable_link, created = EvaluationSharableLink.objects.get_or_create(
                trainer=trainer,
                project=project,
                defaults={"expiration_date": expiration_date},
            )

            if not created:
                sharable_link.expiration_date = expiration_date
                sharable_link.save()

            return Response({
                "message": "Sharable link generated successfully.",
                "data": {
                    "trainer_id": trainer.LOTID if trainer else None,
                    "trainer_name": trainer.faculty if trainer else None,
                    "trainingLoad": trainer.trainingLoad if trainer else None,
                    "project_id": project.projectID,
                    "project_title": project.projectTitle,
                    "expiration_date": sharable_link.expiration_date,
                    "link": sharable_link.sharable_link,
                }
            }, status=status.HTTP_201_CREATED)

        except Project.DoesNotExist:
            return Response({"error": "Project not found."}, status=status.HTTP_400_BAD_REQUEST)
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

def evaluation_form_view(request, trainer_id, project_id):
    trainer = get_object_or_404(LoadingOfTrainers, pk=trainer_id)
    project = get_object_or_404(Project, pk=project_id)
    return render(request, 'evaluation_form.html', {
        'trainer': trainer,
        'project': project,
    })    

# Function to fetch all evaluations for a specific project/trainer
def get_detailed_evaluations(project_id):
    evaluations = Evaluation.objects.filter(project_id=project_id)
    
    # Build a table-like structure
    detailed_summary = []
    for evaluation in evaluations:
        row = {
            "id": evaluation.id,
            "relevance_of_topics": evaluation.relevance_of_topics,
            "organizational_flow": evaluation.organizational_flow,
            "learning_methods": evaluation.learning_methods,
            "technology_use": evaluation.technology_use,
            "time_efficiency": evaluation.time_efficiency,
            "mastery_subject": evaluation.mastery_subject,
            "preparedness": evaluation.preparedness,
            "audience_participation": evaluation.audience_participation,
            "interest_level": evaluation.interest_level,
            "handle_questions": evaluation.handle_questions,
            "voice_personality": evaluation.voice_personality,
            "visual_aids": evaluation.visual_aids,
            "venue_assessment": evaluation.venue_assessment,
            "timeliness": evaluation.timeliness,
            "overall_management": evaluation.overall_management,
            "average": evaluation.overall_rating,
        }
        detailed_summary.append(row)
    
    return detailed_summary

# View that generates evaluation summary table - UPDATED, WITH MODEL
@api_view(['GET'])
def evaluation_summary_view(request, project_id):
    try:
        # Step 1: Check for an existing summary in the database
        try:
            summary = EvaluationSummary.objects.get(project_id=project_id)
        except EvaluationSummary.DoesNotExist:
            summary = None

        # Step 2: Determine if recalculation is needed
        recalculate = False
        if summary:
            # Check if the summary is outdated (you can adjust the condition)
            time_difference = now() - summary.last_updated
            if time_difference.seconds > 3600:  # 1 hour threshold
                recalculate = True
        else:
            recalculate = True

        if recalculate:
            # Step 3: Recalculate the summary dynamically
            evaluations = Evaluation.objects.filter(project_id=project_id)
            if not evaluations.exists():
                return Response({
                    "message": "No evaluations found for this project.",
                    "evaluations": [],
                    "categories": {"poor": 0, "fair": 0, "good": 0, "better": 0, "best": 0},
                    "total_evaluations": 0,
                    "percentages": {"poor": 0, "fair": 0, "good": 0, "better": 0, "best": 0},
                    "detailed_evaluations": [],

                }, status=200)

            # Count evaluators in each rating category
            categories = {"poor": 0, "fair": 0, "good": 0, "better": 0, "best": 0}
            total_evaluations = evaluations.count()
            for evaluation in evaluations:
                avg = evaluation.overall_rating
                if avg <= 1:
                    categories["poor"] += 1
                elif avg <= 2:
                    categories["fair"] += 1
                elif avg <= 3:
                    categories["good"] += 1
                elif avg <= 4:
                    categories["better"] += 1
                else:
                    categories["best"] += 1

            # Calculate percentages
            percentages = {
                key: round((value / total_evaluations) * 100, 2) if total_evaluations > 0 else 0
                for key, value in categories.items()
            }

            # Step 4: Update or create the database record
            if summary:
                summary.total_evaluations = total_evaluations
                summary.categories = categories
                summary.percentages = percentages
                summary.last_updated = now()
                summary.save()
            else:
                summary = EvaluationSummary.objects.create(
                    project_id=project_id,
                    total_evaluations=total_evaluations,
                    categories=categories,
                    percentages=percentages,
                )

        # Step 5: Get detailed evaluations
        detailed_evaluations = get_detailed_evaluations(project_id)

        # Step 6: Return the summary (whether from database or recalculated)
        return Response({
            "message": "Evaluations summary retrieved successfully.",
            "total_evaluations": summary.total_evaluations,
            "categories": summary.categories,
            "percentages": summary.percentages,
            "detailed_evaluations": detailed_evaluations,
        }, status=200)

    except Exception as e:
        return Response({"message": "An error occurred.", "error": str(e)}, status=500)

# # View that generates evaluation summary table - no model to store data yet, purely view lang
# @api_view(['GET'])
# def evaluations_summary_view(request, project_id):
#     try:
#         # Fetch evaluations for the project
#         evaluations_summary = get_evaluations_summary(project_id)
        
#         if not evaluations_summary:
#             # No evaluations found
#             return Response({
#                 "message": "No evaluations found for this project.",
#                 "evaluations": [],
#                 "categories": {"poor": 0, "fair": 0, "good": 0, "better": 0, "best": 0},
#                 "total_evaluations": 0,
#                 "percentages": {"poor": 0, "fair": 0, "good": 0, "better": 0, "best": 0}
#             }, status=status.HTTP_200_OK)

#         # Calculate total evaluations
#         total_evaluations = len(evaluations_summary)

#         # Count evaluators in each rating category
#         categories = {"poor": 0, "fair": 0, "good": 0, "better": 0, "best": 0}
#         for eval in evaluations_summary:
#             if eval["average"] <= 1:
#                 categories["poor"] += 1
#             elif eval["average"] <= 2:
#                 categories["fair"] += 1
#             elif eval["average"] <= 3:
#                 categories["good"] += 1
#             elif eval["average"] <= 4:
#                 categories["better"] += 1
#             else:
#                 categories["best"] += 1
        
#         # Calculate percentages
#         percentages = {key: round((value / total_evaluations) * 100, 2) if total_evaluations > 0 else 0 
#                        for key, value in categories.items()}

#         # Combine results
#         return Response({
#             "message": "Evaluations summary retrieved successfully.",
#             "evaluations": evaluations_summary,
#             "categories": categories,
#             "total_evaluations": total_evaluations,
#             "percentages": percentages,
#         })
#     except Exception as e:
#         return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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

        #Validate trainer_id if existing
        trainer_id = request.data.get("trainer_id")
        trainer_load = None
        if trainer_id:
            # Validate if associated ba ang trainer sa project
            try:
                trainer_load = LoadingOfTrainers.objects.get(LOTID=trainer_id, project=project)
            except LoadingOfTrainers.DoesNotExist:
                return Response({"error": "The specified trainer is not linked to this project."}, status=400)


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
        attendance_template = AttendanceTemplate.objects.create(
            project=project, 
            trainerLoad=trainer_load, 
            expiration_date=expiration_date,  
            templateName=request.data.get("templateName"), 
            **fields
            )

        # Generate sharable link
        sharable_link = f"{request.build_absolute_uri('/')[:-1]}/monitoring/attendance/fill/{attendance_template.token}/"

        # # Use the frontend base URL for the sharable link
        # frontend_base_url = settings.FRONTEND_BASE_URL  # Retrieve the frontend URL from settings
        # sharable_link = f"{frontend_base_url}/attendance/fill/{attendance_template.token}/"

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
        
# Fetch list of trainers per project from docquestapp
def get_trainers_by_project(request, project_id):
    trainers = LoadingOfTrainers.objects.filter(project_id=project_id).values('LOTID', 'faculty', 'trainingLoad', 'hours')
    return JsonResponse({'trainers': list(trainers)})

# # For OC

# For OP2
@role_required(allowed_role_codes=["estf"])
class ExtensionProgramOp2ViewSet(viewsets.ModelViewSet):
    queryset = ExtensionProgramOp2.objects.all()
    serializer_class = ExtensionProgramOp2Serializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        try:
            # Call the default create method from ModelViewSet
            response = super().create(request, *args, **kwargs)

            # Return the created entry with a 201 status (created)
            return Response(response.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            # Handle any exceptions if necessary and log them
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        try:
            # Fetch all entries from the queryset
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)

            # Return the serialized data
            return Response(serializer.data)
        except Exception as e:
            # Handle exceptions and provide an error message
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# For OC

@role_required(allowed_role_codes=["estf"])
class ExtensionProgramOCViewSet(viewsets.ModelViewSet):
    queryset = ExtensionProgramOC.objects.all().order_by('-created_at')  # Show the newest entries first
    serializer_class = ExtensionProgramOCSerializer
    permission_classes = [IsAuthenticated]

# For Campus Performance
# class CollegePerformanceAPI(APIView):
#     def get(self, request):
#         rows = CollegePerformanceRow.objects.all()
#         serializer = CollegePerformanceRowSerializer(rows, many=True)
#         return Response(serializer.data)

#     def post(self, request):
#         data = request.data
#         for row in data:
#             CollegePerformanceRow.objects.update_or_create(
#                 campus=row['campus'],
#                 defaults=row
#             )
#         return Response({"message": "Data saved successfully"}, status=status.HTTP_200_OK)

# @role_required(allowed_role_codes=["estf"])
# class CollegePerformanceViewSet(viewsets.ModelViewSet):
#     queryset = CollegePerformanceRow.objects.all()
#     serializer_class = CollegePerformanceRowSerializer
#     permission_classes = [IsAuthenticated]

#     def create(self, request, *args, **kwargs):
#         # Logging for debugging
#         import logging
#         logger = logging.getLogger(__name__)
#         logger.info(f"Received data: {request.data}")

#         # Handle bulk creation
#         many = isinstance(request.data, list)
#         serializer = self.get_serializer(data=request.data, many=many)
#         serializer.is_valid(raise_exception=True)

#         # Perform create
#         self.perform_create(serializer)

#         # Return the serialized data
#         return Response(serializer.data, status=status.HTTP_201_CREATED)

@role_required(allowed_role_codes=["estf"])
class CollegePerformanceViewSet(viewsets.ModelViewSet):
    queryset = CollegePerformanceRow.objects.all()
    serializer_class = CollegePerformanceRowSerializer
    permission_classes = [IsAuthenticated]
    renderer_classes = [JSONRenderer]   

    def create(self, request, *args, **kwargs):
        many = isinstance(request.data, list)
        serializer = self.get_serializer(data=request.data, many=many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

