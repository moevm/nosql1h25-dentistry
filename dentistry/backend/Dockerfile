FROM python:3.9-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /project_root
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./backend/

ENV PYTHONPATH="/project_root:${PYTHONPATH}"

WORKDIR /project_root/backend

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"] 