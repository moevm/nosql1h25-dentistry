import pytest
from rest_framework.test import APIRequestFactory
from backend.users.models import CustomUser, DentistRole, ClientRole
from rest_framework.test import APIClient

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def api_request_factory():
    return APIRequestFactory()

@pytest.fixture
def dentist_user(db):
    return CustomUser.objects.create(
        email="dentist@test.com",
        password="testpass123",
        username="dentist_test",
        role_id=3
    )

@pytest.fixture
def client_user(db):
    return CustomUser.objects.create(
        email="client@test.com",
        password="testpass123",
        username="client_test",
        role_id=ClientRole.id,
        additional_info={"allergy": "лидокаин"}
    )
