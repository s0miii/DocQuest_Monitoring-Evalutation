from rest_framework import serializers
from .models import Evaluation, AccomplishmentReport, ProjectNarrative

# class ChecklistSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Checklist
#         fields = '__all__'

# class DocumentsSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Documents
#         fields = '__all__'

# class ProgressSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Progress
#         fields = '__all__'    

# class AttendanceRecordSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = AttendanceRecord
#         fields = ['attendance_file', 'total_attendees', 'upload_date']
        
class EvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = '__all__'

# Accomplishment Report Serializer
class AccomplishmentReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccomplishmentReport
        fields = '__all__'

# Project Narrative Serializer
class ProjectNarrativeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectNarrative
        fields = '__all__'
