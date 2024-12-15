# Use the official slim Python image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1   # Prevent Python from writing pyc files
ENV PYTHONUNBUFFERED 1          # Ensures output is shown in real-time

# Set the working directory
WORKDIR /app

# Install system dependencies first
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*  # Clean up apt cache to reduce image size

# Install Python dependencies
COPY ./Backend/requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application source code
COPY ./Backend /app

# Collect static files (only for production)
RUN python manage.py collectstatic --no-input

# Expose the Django port
EXPOSE 8000

# Use a non-root user for security
RUN useradd -m appuser
USER appuser

# Start Gunicorn server
CMD ["gunicorn", "docquest.wsgi:application", "--bind", "0.0.0.0:8000"]
