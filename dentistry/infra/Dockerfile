FROM python:3.10-slim

WORKDIR /app

# Установка зависимостей
COPY ../backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем весь проект внутрь /app/backend
COPY ../backend /app/backend

# Устанавливаем PYTHONPATH, чтобы Django видел backend
ENV PYTHONPATH=/app \
    DJANGO_SETTINGS_MODULE=backend.core.settings

# Запуск сервера
CMD ["python", "/app/backend/manage.py", "runserver", "0.0.0.0:8000"]