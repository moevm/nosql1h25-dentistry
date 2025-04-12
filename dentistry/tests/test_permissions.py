import pytest
from rest_framework.test import APIRequestFactory
from backend.users.models import CustomUser
from backend.dentists.permissions import IsDentist

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
        role_id=2
    )

def test_is_dentist_permission_true(api_request_factory, dentist_user):
    permission = IsDentist()
    request = api_request_factory.get('/dentists/me/')
    request.user = dentist_user
    assert permission.has_permission(request, None) is True

def test_is_dentist_permission_false_not_dentist(api_request_factory, client_user):
    permission = IsDentist()
    request = api_request_factory.get('/dentists/me/')
    request.user = client_user
    assert permission.has_permission(request, None) is False

def test_is_dentist_permission_false_not_authenticated(api_request_factory):
    permission = IsDentist()
    request = api_request_factory.get('/dentists/me/')
    assert permission.has_permission(request, None) is False