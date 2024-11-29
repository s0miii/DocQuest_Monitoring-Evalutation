# Use the official Python image as the base
FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /app

# Copy only the backend folder into the container
COPY ./Backend /app

# Install system dependencies
RUN apt-get update && apt-get install -y gcc libpq-dev

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Collect static files (if using Whitenoise)
RUN python manage.py collectstatic --no-input

# Expose the default Django port
EXPOSE 8000

# Command to start the Gunicorn server
CMD ["gunicorn", "docquest.wsgi:application", "--bind", "0.0.0.0:8000"]
