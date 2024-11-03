from django.apps import AppConfig


class MonitoringEvaluationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'monitoring_evaluation'

    def ready(self):
        # signal to ensure they get connected properly
        import monitoring_evaluation.signals