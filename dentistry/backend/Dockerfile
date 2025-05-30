# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Создаем корневую директорию, которая будет в PYTHONPATH
WORKDIR /project_root

# Install system dependencies (if any, e.g., for Pillow or other C-extensions)
# RUN apt-get update && apt-get install -y ...

# Install dependencies
# Assuming requirements.txt is in the root of the backend directory
# If it's one level up (in the project root), the docker-compose context needs to be set accordingly
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем все содержимое папки 'backend' (из dentistry/backend/)
# в созданную папку '/project_root/backend/' внутри образа
COPY backend/ ./backend/
COPY backend/wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Устанавливаем PYTHONPATH, чтобы Python мог найти пакет 'backend'
ENV PYTHONPATH="/project_root:${PYTHONPATH}"

# Устанавливаем рабочую директорию там, где находится manage.py
WORKDIR /project_root/backend

# Expose port (if using runserver, it's usually 8000)
EXPOSE 8000

# Command to run the application
# For development, runserver is fine. For production, use gunicorn or similar.
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"] 