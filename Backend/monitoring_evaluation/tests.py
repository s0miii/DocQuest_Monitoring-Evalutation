from django.test import TestCase
from django.utils import timezone
from .models import Checklist, Documents, Progress, Evaluation
from docquestapp.models import Project
from django.contrib.auth import get_user_model

User = get_user_model()

class ChecklistModelTest(TestCase):
    def setUp(self):
        # Setup a sample user and project for checklist
        self.user = User.objects.create(username="testuser", password="password")
        self.project = Project.objects.create(title="Sample Project", created_by=self.user)

    def test_create_checklist(self):
        checklist = Checklist.objects.create(project=self.project, item_name="Submit Proposal")
        self.assertEqual(checklist.item_name, "Submit Proposal")
        self.assertEqual(checklist.project, self.project)

class DocumentsModelTest(TestCase):
    def setUp(self):
        # Setup sample project and checklist item
        self.project = Project.objects.create(title="Sample Project")
        self.checklist_item = Checklist.objects.create(project=self.project, item_name="Submit Proposal")

    def test_document_status(self):
        document = Documents.objects.create(
            project=self.project,
            checklist_item=self.checklist_item,
            status='pending',
            upload_date=timezone.now()
        )
        self.assertEqual(document.status, "pending")
        document.status = "submitted"
        document.save()
        self.assertEqual(Documents.objects.get(id=document.id).status, "submitted")

class ProgressModelTest(TestCase):
    def setUp(self):
        # Setup sample project and checklist item
        self.project = Project.objects.create(title="Sample Project")
        self.checklist_item = Checklist.objects.create(project=self.project, item_name="Submit Proposal")

    def test_progress_completion(self):
        progress = Progress.objects.create(
            project=self.project,
            checklist_item=self.checklist_item,
            is_complete=False
        )
        self.assertFalse(progress.is_complete)
        progress.is_complete = True
        progress.save()
        self.assertTrue(Progress.objects.get(id=progress.id).is_complete)

class EvaluationModelTest(TestCase):
    def setUp(self):
        # Setup sample project, user, and evaluation
        self.user = User.objects.create(username="trainer", password="password")
        self.project = Project.objects.create(title="Sample Project", created_by=self.user)

    def test_evaluation_creation(self):
        evaluation = Evaluation.objects.create(
            project=self.project,
            trainer=self.user,
            relevance_of_topics=5,
            organizational_flow=4,
            learning_methods=3,
            technology_use=4,
            time_efficiency=5
        )
        self.assertEqual(evaluation.relevance_of_topics, 5)
        self.assertEqual(evaluation.organizational_flow, 4)
        self.assertEqual(evaluation.calculate_overall_rating(), 4.2)  # Example calculation based on your logic

