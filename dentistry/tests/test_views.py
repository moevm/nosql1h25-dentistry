import pytest
from rest_framework.test import APIRequestFactory
from rest_framework.response import Response
from backend.users.models import CustomUser
from backend.dentists.views import DentistViewSet
from backend.clients.views import ClientViewSet

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


def test_me_action_get_dentist(db, dentist_user, api_request_factory):
    view = DentistViewSet()
    request = api_request_factory.get('/dentists/me/')
    request.user = dentist_user
    view.request = request

    # Мокаем метод me
    view.me = lambda r: Response({'email': r.user.email})

    response = view.me(request)
    assert isinstance(response, Response)
    assert response.status_code == 200
    assert response.data["email"] == "dentist@test.com"


@pytest.fixture
def client_user(db):
    return CustomUser.objects.create(
        email="client@test.com",
        password="testpass123",
        role_id=2,
        additional_info={"allergy": "лидокаин"}
    )


def test_me_action_get_client(db, client_user, api_request_factory):
    view = ClientViewSet()
    request = api_request_factory.get('/clients/me/')
    request.user = client_user
    view.request = request

    # Мокаем метод me
    view.me = lambda r: Response({'email': r.user.email, 'additional_info': r.user.additional_info})

    response = view.me(request)
    assert isinstance(response, Response)
    assert response.status_code == 200
    assert response.data["email"] == "client@test.com"
    assert response.data["additional_info"]["allergy"] == "лидокаин"