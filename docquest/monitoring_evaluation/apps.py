from django.apps import AppConfig

class MonitoringEvaluationConfig(AppConfig):
    name = 'monitoring_evaluation'

    def ready(self):
        import monitoring_evaluation.signals