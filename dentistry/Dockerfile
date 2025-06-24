FROM python:3.11-slim

WORKDIR /backend

COPY backend /backend

RUN pip install --no-cache-dir -r /backend/requirements.txt

EXPOSE 8000

CMD ["sh", "-c", "python3 manage.py migrate && python3 manage.py generate_test_data && python3 manage.py runserver 0.0.0.0:8000"]
