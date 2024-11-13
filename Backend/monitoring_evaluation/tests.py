

from django.test import TestCase
from docquestapp.models import CustomUser
from .models import Checklist, Documents, Progress, AttendanceRecord, Evaluation
from django.contrib.auth.models import User
from datetime import date

class ChecklistModelTest(TestCase):
    def setUp(self):
     def setUp(self):
        self.user = CustomUser.objects.create(email="testuser@example.com")  # Adjust field name if needed
        self.checklist = Checklist.objects.create(
            title="Sample Checklist",  # Adjust field name based on your Checklist model
            description="Sample description"
        )

    def test_checklist_creation(self):
        self.assertIsInstance(self.checklist, Checklist)

class DocumentsModelTest(TestCase):
    def setUp(self):
        self.checklist = Checklist.objects.create(
            title="Sample Checklist",  # Adjust field name
            description="Sample description"
        )
        self.document = Documents.objects.create(
            checklist=self.checklist,
            file="path/to/file.pdf",
            status="submitted"
        )

    def test_document_creation(self):
        self.assertIsInstance(self.document, Documents)

class ProgressModelTest(TestCase):
    def setUp(self):
        self.project_id = 1
        self.checklist = Checklist.objects.create(
            project_id=self.project_id,
            item="Test Checklist Item",
            is_required=True,
        )
        self.progress = Progress.objects.create(
            project_id=self.project_id,
            checklist=self.checklist,
            is_completed=True,
        )

    def test_progress_creation(self):
        self.assertEqual(self.progress.project_id, self.project_id)
        self.assertTrue(self.progress.is_completed)
        self.assertEqual(self.progress.checklist, self.checklist)


class AttendanceRecordModelTest(TestCase):
    def setUp(self):
        self.attendance_record = AttendanceRecord.objects.create(
            total_attendees=25,
            attendance_file="path/to/sample_file.pdf"
        )

    def test_attendance_record_creation(self):
        self.assertEqual(self.attendance_record.total_attendees, 25)
        self.assertEqual(self.attendance_record.attendance_file, "path/to/sample_file.pdf")

class EvaluationModelTest(TestCase):
    def setUp(self):
        self.project_id = 1
        self.user = CustomUser.objects.create(username="trainer1")
        self.evaluation = Evaluation.objects.create(
            project_id=self.project_id,
            trainer=self.user,
            relevance_of_topics=5,
            organizational_flow=4,
            appropriateness_of_methods=3,
            use_of_tech=5,
            efficiency=4,
            mastery_of_subject=5,
            preparedness=4,
            audience_participation=3,
            interesting_activity=5,
            handle_questions=4,
            voice_personality=3,
            visual_aids=5,
            participant_engagement=4,
            clarity_of_objectives=5,
            logistical_support=3,
            useful_concepts="Concept A, Concept B",
            improvement_areas="None",
            additional_comments="Great session",
            overall_rating=4,
            remarks="Very well organized",
            timestamp=date.today(),
        )

    def test_evaluation_creation(self):
        self.assertEqual(self.evaluation.project_id, self.project_id)
        self.assertEqual(self.evaluation.trainer, self.user)
        self.assertEqual(self.evaluation.relevance_of_topics, 5)
        self.assertEqual(self.evaluation.overall_rating, 4)
        self.assertEqual(self.evaluation.remarks, "Very well organized")
        self.assertIsNotNone(self.evaluation.timestamp)
