from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Project, AccomplishmentReport, EvaluationSummary, Document

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = UserProfile
        fields = ('user', 'role')

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class AccomplishmentReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccomplishmentReport
        fields = '__all__'

class EvaluationSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationSummary
        fields = '__all__'

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'
