"""
WSGI config for docquest project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/wsgi/
"""

import os
from pathlib import Path  # Import Path for BASE_DIR
from django.core.wsgi import get_wsgi_application
from whitenoise import WhiteNoise

# Define BASE_DIR
BASE_DIR = Path(__file__).resolve().parent.parent

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'your_project.settings')

application = get_wsgi_application()
application = WhiteNoise(application, root=os.path.join(str(BASE_DIR), 'staticfiles'))
application.add_files(os.path.join(str(BASE_DIR), 'static'), prefix='static/')
