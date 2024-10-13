from django.contrib import admin
from .models import Project, AccomplishmentReport, EvaluationSummary, Document

# Register your models here.
admin.site.register(Project)
admin.site.register(AccomplishmentReport)
admin.site.register(EvaluationSummary)
admin.site.register(Document)
