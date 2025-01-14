from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import *
from django.conf import settings

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['projectID', 'projectTitle', 'background', 'targetImplementation']

class DailyAttendanceRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyAttendanceRecord
        fields = '__all__'

class SummaryOfEvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SummaryOfEvaluation
        fields = '__all__'

class TrainerCvDtrSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainerCvDtr
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
        
class PREXCAchievementSerializer(serializers.ModelSerializer):
    class Meta: model = PREXCAchievement
    fields = '__all__'

class ProjectNarrativeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectNarrative
        fields = '__all__'

# Accomplishment Report Serializer
# class AccomplishmentReportSerializer(serializers.ModelSerializer):
#     total_number_of_days = serializers.ReadOnlyField()
#     submitted_by = serializers.SerializerMethodField()
#     project_narrative = ProjectNarrativeSerializer(required=True)
#     approved_photos = serializers.SerializerMethodField()

#     class Meta:
#         model = AccomplishmentReport
#         fields = '__all__'
#         read_only_fields = ['submitted_by','total_number_of_days']

#     def get_submitted_by(self, obj):
#         if obj.submitted_by:
#             return f"{obj.submitted_by.firstname} {obj.submitted_by.lastname}"
#         return None
    
#     def get_approved_photos(self, obj):
#         approved_photos = PhotoDocumentation.objects.filter(
#             project=obj.project, status="Approved"
#         )
#         return PhotoDocumentationSerializer(approved_photos, many=True).data
    
#     def validate(self, data):
#         start_date = data.get('actualStartDateImplementation')
#         end_date = data.get('actualEndDateImplementation')
        
#         if start_date and end_date and start_date > end_date:
#             raise serializers.ValidationError("Start date must be before or equal to the end date.")
#         return data
    
#     def create(self, validated_data):
#         project_narrative_data = validated_data.pop('project_narrative')
#         project_narrative = ProjectNarrative.objects.create(**project_narrative_data)

#         accomplishment_report = AccomplishmentReport.objects.create(
#             project_narrative=project_narrative,
#             **validated_data
#         )
#         return accomplishment_report

#     def update(self, instance, validated_data):
#         project_narrative_data = validated_data.pop('project_narrative', None)
#         if project_narrative_data:
#             ProjectNarrative.objects.update_or_create(
#                 accomplishment_report=instance,
#                 defaults=project_narrative_data
#             )
#         return super().update(instance, validated_data)

class AccomplishmentReportSerializer(serializers.ModelSerializer):
    total_number_of_days = serializers.ReadOnlyField()
    submitted_by = serializers.SerializerMethodField()
    project_narrative = ProjectNarrativeSerializer(required=False, allow_null=True)  # Optional
    approved_photos = serializers.SerializerMethodField()

    class Meta:
        model = AccomplishmentReport
        fields = '__all__'
        read_only_fields = ['submitted_by', 'total_number_of_days']

    def get_submitted_by(self, obj):
        return f"{obj.submitted_by.firstname} {obj.submitted_by.lastname}" if obj.submitted_by else None

    def get_approved_photos(self, obj):
        approved_photos = PhotoDocumentation.objects.filter(project=obj.project, status="Approved")
        return PhotoDocumentationSerializer(approved_photos, many=True).data

    def validate(self, data):
        # Validation for start and end dates
        start_date = data.get('actualStartDateImplementation')
        end_date = data.get('actualEndDateImplementation')
        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError("Start date must be before or equal to the end date.")
        return data

    
class EvaluationSerializer(serializers.ModelSerializer):
    trainerLoad = serializers.ReadOnlyField()
    class Meta:
        model = Evaluation
        fields = '__all__'
        extra_kwargs = {
            "trainer": {"required": False},
            "project": {"required": True},
        }

    #I-validate if project is approved before maka evaluate
    def validate(self, data):
        project = data.get('project')
        if project.status != 'approved':
            raise ValidationError("Evaluations can only be created for approved projects.")
        
        # Ensure unique combination of attendee_name, trainer, and project
        attendee_name = data.get('attendee_name')
        trainer = data.get('trainer')
        project = data.get('project')

        if Evaluation.objects.filter(
            attendee_name=attendee_name,
            trainer=trainer,
            project=project
        ).exists():
            raise ValidationError("An evaluation for this attendee, trainer, and project already exists.")

        return data
class EvaluationSharableLinkSerializer(serializers.ModelSerializer):
    trainer_name = serializers.CharField(source="trainer.faculty", default="No trainer assigned", read_only=True)
    class Meta:
        model = EvaluationSharableLink
        fields = ['id', 'trainer_name', 'project', 'expiration_date', 'token', 'sharable_link']

    def create(self, validated_data):
        # You can add custom creation logic here if needed
        return super().create(validated_data)

class AttendanceTemplateSerializer(serializers.ModelSerializer):
    sharable_link = serializers.SerializerMethodField()
    class Meta:
        model = AttendanceTemplate
        fields = '__all__'

    def get_sharable_link(self, obj):
        request = self.context.get('request')
        if request:
            return f"{settings.FRONTEND_BASE_URL}/attendance/fill/{obj.token}/"
        return None
class CreatedAttendanceRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreatedAttendanceRecord
        fields = '__all__'


# PREXC Report Serializer
class ExtensionProgramOp2Serializer(serializers.ModelSerializer):
    class Meta:
        model = ExtensionProgramOp2
        fields = ['id', 'academic_program', 'extension_program', 'from_date', 'to_date', 'campus', 'remarks', 'created_at']