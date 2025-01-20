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
    class Meta:
        model = AttendanceTemplate
        fields = [
            'project', 'templateName', 'trainerLoad', 'first_name', 'middle_name', 'last_name',
            'include_attendee_name', 'include_gender', 'include_college', 'include_department',
            'include_year_section', 'include_agency_office', 'include_contact_number', 'sharable_link',
            'token', 'expiration_date', 'created_at',
        ]

    def create(self, validated_data):
        # Automatically generate a unique token and sharable link
        instance = AttendanceTemplate.objects.create(**validated_data)
        instance.save()  # Triggers the token and link generation logic in the model
        return instance

    def validate(self, attrs):
        # Validate for duplicates
        if AttendanceTemplate.objects.filter(
            project=attrs['project'],
            first_name=attrs['first_name'],
            middle_name=attrs['middle_name'],
            last_name=attrs['last_name']
        ).exists():
            raise serializers.ValidationError(
                "An attendee with this name already exists for this project."
            )
        return attrs

    
class CreatedAttendanceRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreatedAttendanceRecord
        fields = '__all__'


# PREXC Report Serializer
class ExtensionProgramOp2Serializer(serializers.ModelSerializer):
    class Meta:
        model = ExtensionProgramOp2
        fields = ['id', 'mandated_priority_program', 'quarter', 'extension_program', 'from_date', 'to_date', 'campus', 'remarks', 'created_at']

class ExtensionProgramOCSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExtensionProgramOC
        fields = '__all__'        

class CollegePerformanceRowSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollegePerformanceRow
        fields = '__all__'
        extra_kwargs = {
            field: {'required': False} for field in [
                'programs_number', 'programs_percentage', 'faculty_number', 
                'faculty_percentage', 'average_percentage', 'persons_trained_target', 
                'persons_trained_weighted_accomplishment', 'persons_trained_variance',
                'partnerships_target', 'partnerships_accomplishment', 'partnerships_variance',
                'beneficiaries_target', 'beneficiaries_accomplishment', 'beneficiaries_variance',
                'extension_programs_target', 'extension_programs_accomplishment', 'extension_programs_variance'
            ]
        }   