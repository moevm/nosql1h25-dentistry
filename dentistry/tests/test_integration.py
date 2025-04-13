import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from backend.users.models import CustomUser, DentistRole, ClientRole


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def dentist_user(db):
    return CustomUser.objects.create(
        email="dentist@test.com",
        password="testpass123",
        role_id=DentistRole.id,
        id=3
    )


def test_dentist_me_integration(api_client, dentist_user):
    url = reverse('dentists:dentist-me')
    api_client.force_authenticate(user=dentist_user)
    response = api_client.get(url)
    
    assert response.status_code == 200
    assert response.data["email"] == "dentist@test.com"


# Clients
@pytest.fixture
def client_user(db):
    return CustomUser.objects.create(
        email="client@test.com",
        password="testpass123",
        role_id=ClientRole.id,
        id=2,
        additional_info={"allergy": "лидокаин"}
    )


def test_client_me_integration(api_client, client_user):
    url = reverse('clients:client-me')
    api_client.force_authenticate(user=client_user)
    response = api_client.get(url)

    assert response.status_code == 200
    assert response.data["email"] == "client@test.com"
    assert "additional_info" in response.data
    assert response.data["additional_info"]["allergy"] == "лидокаин"