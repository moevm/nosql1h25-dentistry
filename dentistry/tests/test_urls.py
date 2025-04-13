from django.urls import resolve, reverse
from backend.dentists.views import DentistViewSet
from backend.clients.views import ClientViewSet


# Dentists
def test_dentist_me_url_resolves():
    url = reverse('dentists:dentist-me')
    assert resolve(url).func.__name__ == DentistViewSet.as_view({'get': 'me'}).__name__


def test_dentist_patients_url_resolves():
    url = reverse('dentists:dentist-patients')
    assert resolve(url).func.__name__ == DentistViewSet.as_view({'get': 'patients'}).__name__


def test_dentist_list_url_resolves():
    url = reverse('dentists:dentist-list')
    assert resolve(url).func.__name__ == DentistViewSet.as_view({'get': 'list'}).__name__


# Clients

def test_client_me_url_resolves():
    url = reverse('clients:client-me')
    assert resolve(url).func.__name__ == ClientViewSet.as_view({'get': 'me'}).__name__


def test_client_list_url_resolves():
    url = reverse('clients:client-list')
    assert resolve(url).func.__name__ == ClientViewSet.as_view({'get': 'list'}).__name__