from rest_framework import serializers
from .models import *

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
        

class AccomplishmentReportSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source='project.projectTitle', read_only=True)
    project_type = serializers.CharField(source='project.projectType', read_only=True)
    project_category = serializers.StringRelatedField(source='project.projectCategory', many=True, read_only=True)
    research_title = serializers.CharField(source='project.researchTitle', read_only=True)
    proponents = serializers.StringRelatedField(source='project.proponents', many=True, read_only=True)
    program = serializers.StringRelatedField(source='project.program', many=True, read_only=True)
    accreditation_level = serializers.CharField(source='project.accreditationLevel', read_only=True)
    college = serializers.CharField(source='project.college', read_only=True)
    target_groups_beneficiaries = serializers.CharField(source='project.beneficiaries', read_only=True)
    project_location = serializers.CharField(source='project.projectLocationID', read_only=True)
    partner_agency = serializers.StringRelatedField(source='project.agency', many=True, read_only=True)

    class Meta:
        model = AccomplishmentReport
        fields = ['id', 'banner_program_title', 'flagship_program', 'training_modality', 'actual_implementation_date', 'total_number_of_days', 'submitted_by', 'prexc_achievement', 'project_narrative', 'project_title', 'project_type', 'project_category', 'research_title', 'proponents', 'program', 'accreditation_level', 'college', 'target_groups_beneficiaries', 'project_location', 'partner_agency']

        
class EvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = '__all__'

class PREXCAchievementSerializer(serializers.ModelSerializer):
    class Meta: model = PREXCAchievement
    fields = '__all__'

class ProjectNarrativeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectNarrative
        fields = '__all__'

