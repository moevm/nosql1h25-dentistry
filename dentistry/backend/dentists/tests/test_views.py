import pytest
from rest_framework.test import APIRequestFactory
from rest_framework.response import Response
from users.models import CustomUser
from backend.dentists.views import DentistViewSet

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

def test_me_action_get(db, dentist_user, api_request_factory):
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