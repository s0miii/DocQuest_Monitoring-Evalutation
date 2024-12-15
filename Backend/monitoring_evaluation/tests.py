from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from .models import (
    Project, DailyAttendanceRecord, SummaryOfEvaluation, ModulesLectureNotes, 
    PhotoDocumentation, OtherFiles, ChecklistAssignment, AccomplishmentReport, 
    PREXCAchievement, ProjectNarrative
)
from .forms import DailyAttendanceForm
from rest_framework.test import APIClient
from rest_framework import status

class ModelTests(TestCase):

    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username='testuser', password='testpass'
        )
        self.project = Project.objects.create(projectTitle='Test Project')

    def test_create_daily_attendance_record(self):
        record = DailyAttendanceRecord.objects.create(
            project=self.project,
            proponent=self.user,
            total_attendees=50
        )
        self.assertEqual(record.total_attendees, 50)
        self.assertEqual(record.project.projectTitle, 'Test Project')
        self.assertEqual(record.proponent.username, 'testuser')

    def test_create_prexc_achievement(self):
        achievement = PREXCAchievement.objects.create(
            project=self.project,
            persons_trained_weighted_days=10.5,
            actual_trainees=20,
            actual_days_training=3,
            persons_trained=20,
            satisfactory_trainees=18,
            rating_percentage=90.0
        )
        self.assertEqual(achievement.project.projectTitle, 'Test Project')
        self.assertEqual(achievement.persons_trained_weighted_days, 10.5)

    def test_create_project_narrative(self):
        narrative = ProjectNarrative.objects.create(
            project=self.project,
            phase_description='Phase 1 description',
            activities_topics='Activity 1, Activity 2',
            issues_challenges='Some challenges',
            participant_engagement_quality='High',
            discussion_comments='Discussion comments',
            ways_forward_plans='Plan A, Plan B'
        )
        self.assertEqual(narrative.project.projectTitle, 'Test Project')
        self.assertEqual(narrative.phase_description, 'Phase 1 description')

class ViewTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            username='testuser', password='testpass'
        )
        self.client.login(username='testuser', password='testpass')
        self.project = Project.objects.create(projectTitle='Test Project')

    def test_upload_daily_attendance_record(self):
        url = reverse('monitoring_evaluation:attendance_upload')
        data = {
            'project': self.project.id,
            'total_attendees': 50
        }
        with open('testfile.txt', 'w') as f:
            f.write('Test content')
        with open('testfile.txt') as f:
            data['attendance_file'] = f
            response = self.client.post(url, data)
        
        self.assertEqual(response.status_code, 302)
        self.assertEqual(DailyAttendanceRecord.objects.count(), 1)
        record = DailyAttendanceRecord.objects.first()
        self.assertEqual(record.total_attendees, 50)

    def test_api_get_daily_attendance(self):
        url = reverse('dailyattendance-record-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_api_create_daily_attendance(self):
        url = reverse('dailyattendance-record-list')
        data = {
            'project': self.project.id,
            'total_attendees': 50
        }
        with open('testfile.txt', 'w') as f:
            f.write('Test content')
        with open('testfile.txt') as f:
            data['attendance_file'] = f
            response = self.client.post(url, data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(DailyAttendanceRecord.objects.count(), 1)
        record = DailyAttendanceRecord.objects.first()
        self.assertEqual(record.total_attendees, 50)

class FormTests(TestCase):

    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username='testuser', password='testpass'
        )
        self.project = Project.objects.create(projectTitle='Test Project')

    def test_daily_attendance_form_valid(self):
        with open('testfile.txt', 'w') as f:
            f.write('Test content')
        with open('testfile.txt') as f:
            form = DailyAttendanceForm({
                'project': self.project.id,
                'total_attendees': 50,
            }, {
                'attendance_file': f
            })
            self.assertTrue(form.is_valid())
    
    def test_daily_attendance_form_invalid(self):
        form = DailyAttendanceForm({
            'project': self.project.id,
            'total_attendees': 'invalid'
        })
        self.assertFalse(form.is_valid())
