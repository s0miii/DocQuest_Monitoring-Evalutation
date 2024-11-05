from django import forms
from .models import Evaluation

class EvaluationForm(forms.ModelForm):
    class Meta:
        model = Evaluation
        fields = [
            'attendee_name', 'relevance_of_topics', 'organizational_flow', 'learning_methods', 
            'technology_use', 'time_efficiency', 'mastery_subject', 'preparedness', 
            'audience_participation', 'interest_level', 'handle_questions', 'voice_personality', 
            'visual_aids', 'useful_concepts', 'improvement_areas', 'additional_comments', 
            'venue_assessment', 'timeliness'
        ]
        widgets = {
            'relevance_of_topics': forms.RadioSelect(choices=[(i, i) for i in range(6)]),
            'organizational_flow': forms.RadioSelect(choices=[(i, i) for i in range(6)]),
            'learning_methods': forms.RadioSelect(choices=[(i, i) for i in range(6)]),
            'technology_use': forms.RadioSelect(choices=[(i, i) for i in range(6)]),
            'time_efficiency': forms.RadioSelect(choices=[(i, i) for i in range(6)]),
            'mastery_subject': forms.RadioSelect(choices=[(i, i) for i in range(6)]),
            'preparedness': forms.RadioSelect(choices=[(i, i) for i in range(6)]),
            'audience_participation': forms.RadioSelect(choices=[(i, i) for i in range(6)]),
            'interest_level': forms.RadioSelect(choices=[(i, i) for i in range(6)]),
            'handle_questions': forms.RadioSelect(choices=[(i, i) for i in range(6)]),
            'voice_personality': forms.RadioSelect(choices=[(i, i) for i in range(6)]),
            'visual_aids': forms.RadioSelect(choices=[(i, i) for i in range(6)]),
            'venue_assessment': forms.RadioSelect(choices=[(i, i) for i in range(6)]),
            'timeliness': forms.RadioSelect(choices=[(i, i) for i in range(6)]),
            'overall_management': forms.RadioSelect(choices=[(i, i) for i in range(6)]),
        }
