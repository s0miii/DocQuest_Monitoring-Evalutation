from rest_framework import serializers
from .models import Checklist, Documents, Progress, Evaluation

class ChecklistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Checklist
        fields = '__all__'  # Alternatively, you can specify fields explicitly

class DocumentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Documents
        fields = '__all__'

class ProgressSerializer(serializers.ModelSerializer):
    progress_percentage = serializers.SerializerMethodField()

    class Meta:
        model = Progress
        fields = ['project', 'completed_items', 'total_items', 'progress_percentage']

    def get_progress_percentage(self, obj):
        return obj.calculate_progress_percentage()
    
class EvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = '__all__'
