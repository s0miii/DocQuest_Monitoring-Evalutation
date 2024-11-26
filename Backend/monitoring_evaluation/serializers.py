from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import *

class DailyAttendanceRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyAttendanceRecord
        fields = '__all__'

class SummaryOfEvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SummaryOfEvaluation
        fields = '__all__'

class ModulesLectureNotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModulesLectureNotes
        fields = '__all__'

class PhotoDocumentationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhotoDocumentation
        fields = '__all__'

class OtherFilesSerializer(serializers.ModelSerializer):
    class Meta:
        model = OtherFiles
        fields = '__all__'
        
class ChecklistAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChecklistAssignment
        fields = '__all__'

# Accomplishment Report Serializer
class AccomplishmentReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccomplishmentReport
        fields = '__all__'
        
class EvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = '__all__'

    #I-validate if project is approved before maka evaluate
    def validate(self, data):
        project = data.get('project')
        if project.status != 'approved':
            raise ValidationError("Evaluations can only be created for approved projects.")
        return data    

class PREXCAchievementSerializer(serializers.ModelSerializer):
    class Meta: model = PREXCAchievement
    fields = '__all__'

class ProjectNarrativeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectNarrative
        fields = '__all__'

class AttendanceTemplateSerializer(serializers.ModelSerializer):
    sharable_link = serializers.SerializerMethodField()
    class Meta:
        model = AttendanceTemplate
        fields = '__all__'

    def get_sharable_link(self, obj):
        request = self.context.get('request')
        if request:
            return f"{request.build_absolute_uri('/')[:-1]}/monitoring/attendance/fill/{obj.token}/"
        return None
class CreatedAttendanceRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreatedAttendanceRecord
        fields = '__all__'