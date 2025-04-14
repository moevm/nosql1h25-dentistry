import pytest
from datetime import timedelta
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from backend.users.models import CustomUser
from backend.records.models import Record

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def admin_user(db):
    return CustomUser.objects.create_user(
        email='admin@clinic.com',
        password='adminpass123',
        username='admin',
        role_id=1,  # Администратор
        is_staff=True
    )

@pytest.fixture
def dentist_user(db):
    return CustomUser.objects.create_user(
        email='dentist@clinic.com',
        password='testpass123',
        username='dr_smith',
        role_id=3  # Стоматолог
    )

@pytest.fixture
def patient_user(db):
    return CustomUser.objects.create_user(
        email='patient@test.com',
        password='testpass123',
        username='john_doe',
        role_id=2  # Пациент
    )

@pytest.fixture
def another_patient_user(db):
    return CustomUser.objects.create_user(
        email='another@patient.com',
        password='testpass123',
        username='another_patient',
        role_id=2  # Пациент
    )

@pytest.fixture
def record_data(dentist_user, patient_user):
    now = timezone.now()
    return {
        'dentist': dentist_user.email,
        'patient': patient_user.email,
        'appointment_date': (now.replace(hour=10, minute=0) + timedelta(days=1)).isoformat(),
        'duration': 45,
        'status': 'scheduled',
        'notes': 'Test note'
    }

@pytest.fixture
def auth_admin_client(api_client, admin_user):
    api_client.force_authenticate(user=admin_user)
    return api_client

@pytest.fixture
def auth_dentist_client(api_client, dentist_user):
    api_client.force_authenticate(user=dentist_user)
    return api_client

@pytest.fixture
def auth_patient_client(api_client, patient_user):
    api_client.force_authenticate(user=patient_user)
    return api_client

@pytest.fixture
def created_record(auth_dentist_client, record_data):
    response = auth_dentist_client.post(
        reverse('records:record-list'),
        data=record_data,
        format='json'
    )
    return response.data

@pytest.mark.django_db
class TestRecordCreation:
    def test_create_record_as_dentist(self, auth_dentist_client, record_data):
        response = auth_dentist_client.post(
            reverse('records:record-list'),
            data=record_data,
            format='json'
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert Record.objects.count() == 1

    def test_create_record_as_admin(self, auth_admin_client, dentist_user, patient_user):
        now = timezone.now()
        data = {
            'dentist': dentist_user.email,
            'patient': patient_user.email,
            'appointment_date': (now.replace(hour=11, minute=0) + timedelta(days=1)).isoformat(),
            'duration': 30,
            'status': 'scheduled'
        }
        response = auth_admin_client.post(
            reverse('records:record-list'),
            data=data,
            format='json'
        )
        assert response.status_code == status.HTTP_201_CREATED

    def test_admin_must_specify_dentist(self, auth_admin_client, patient_user):
        now = timezone.now()
        data = {
            'patient': patient_user.email,
            'appointment_date': (now.replace(hour=12, minute=0) + timedelta(days=1)).isoformat(),
            'duration': 30,
            'status': 'scheduled'
        }
        response = auth_admin_client.post(
            reverse('records:record-list'),
            data=data,
            format='json'
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_patient_cannot_create_record(self, auth_patient_client, record_data):
        response = auth_patient_client.post(
            reverse('records:record-list'),
            data=record_data,
            format='json'
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN

@pytest.mark.django_db
class TestRecordRetrieval:
    def test_retrieve_records_as_patient(self, auth_patient_client, auth_dentist_client, patient_user):
        # Создаем запись для пациента
        now = timezone.now()
        data = {
            'dentist': 'dentist@clinic.com',
            'patient': patient_user.email,
            'appointment_date': (now.replace(hour=10, minute=0) + timedelta(days=1)).isoformat(),
            'duration': 30,
            'status': 'scheduled'
        }
        auth_dentist_client.post(reverse('records:record-list'), data=data)
        
        response = auth_patient_client.get(reverse('records:record-list'))
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1

@pytest.mark.django_db
class TestRecordUpdate:
    def test_update_record_status_as_dentist(self, auth_dentist_client, created_record):
        update_data = {'status': 'completed'}
        response = auth_dentist_client.patch(
            reverse('records:record-detail', args=[created_record['id']]),
            data=update_data,
            format='json'
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.data['status'] == 'completed'

    def test_update_record_as_admin(self, auth_admin_client, created_record):
        update_data = {'status': 'canceled'}
        response = auth_admin_client.patch(
            reverse('records:record-detail', args=[created_record['id']]),
            data=update_data,
            format='json'
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.data['status'] == 'canceled'

@pytest.mark.django_db
class TestRecordDeletion:
    def test_delete_record_as_dentist(self, auth_dentist_client, created_record):
        response = auth_dentist_client.delete(
            reverse('records:record-detail', args=[created_record['id']])
        )
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert Record.objects.count() == 0

    def test_delete_record_as_admin(self, auth_admin_client, created_record):
        response = auth_admin_client.delete(
            reverse('records:record-detail', args=[created_record['id']])
        )
        assert response.status_code == status.HTTP_204_NO_CONTENT


@pytest.mark.django_db
class TestRecordFilters:
    def test_filter_by_status(self, auth_dentist_client, created_record):
        # Обновляем статус записи
        update_url = reverse('records:record-detail', args=[created_record['id']])
        auth_dentist_client.patch(
            update_url,
            data={'status': 'completed'},
            format='json'
        )
        
        # Создаем еще одну запись с другим статусом
        now = timezone.now()
        data = {
            'dentist': 'dentist@clinic.com',
            'patient': 'patient@test.com',
            'appointment_date': (now.replace(hour=14, minute=0) + timedelta(days=2)).isoformat(),
            'duration': 30,
            'status': 'scheduled'
        }
        auth_dentist_client.post(reverse('records:record-list'), data=data)
        
        response = auth_dentist_client.get(
            reverse('records:record-list') + '?status=completed'
        )
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1
        assert response.data['results'][0]['status'] == 'completed'

    def test_filter_by_dentist(self, auth_dentist_client, dentist_user, created_record):
        response = auth_dentist_client.get(
            reverse('records:record-list') + f'?dentist={dentist_user.email}'
        )
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1
        assert response.data['results'][0]['dentist'] == dentist_user.email