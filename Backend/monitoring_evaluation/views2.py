from rest_framework import status, viewsets, generics
from rest_framework.views import APIView, View
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
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
from .decorators import role_required

# Proponent Actions
@role_required(allowed_role_codes=["PPNT"])
class ProponentActionsView(APIView):
    permission_classes = [IsAuthenticated]

    def upload_daily_attendance(self, request, project_id):
        """
        Handles daily attendance upload for proponents.
        """
        # Extract fields
        proponent_id = request.data.get('proponent')
        file = request.FILES.get('attendance_file')
        total_attendees = request.data.get('total_attendees')

        # Validate fields
        missing_fields = []
        if not proponent_id:
            missing_fields.append("Proponent ID")
        if not file:
            missing_fields.append("Attendance file")
        if not total_attendees:
            missing_fields.append("Total attendees")
        if missing_fields:
            return Response(
                {"error": f"Missing required fields: {', '.join(missing_fields)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate total_attendees as a number
        try:
            total_attendees = int(total_attendees)
        except ValueError:
            return Response(
                {"error": "Total attendees must be a valid number."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Fetch related objects
        proponent = get_object_or_404(CustomUser, userID=proponent_id)
        project = get_object_or_404(Project, projectID=project_id, status="approved")
        assignment = get_object_or_404(ChecklistAssignment, project=project, proponent=proponent)

        # Check permission to submit
        if not getattr(assignment, "can_submit_daily_attendance", False):
            return Response(
                {"error": "You are not assigned to submit this item."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Create and save the attendance record
        daily_attendance = DailyAttendanceRecord.objects.create(
            project=project,
            proponent=proponent,
            attendance_file=file,
            total_attendees=total_attendees
        )

        # Serialize and return response
        serializer = DailyAttendanceRecordSerializer(daily_attendance)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


