from django.urls import resolve, reverse
from backend.clients.views import ClientViewSet


def test_client_me_url_resolves():
    url = reverse('clients:client-me')
    assert resolve(url).func.__name__ == ClientViewSet.as_view({'get': 'me'}).__name__


def test_client_list_url_resolves():
    url = reverse('clients:client-list')
    assert resolve(url).func.__name__ == ClientViewSet.as_view({'get': 'list'}).__name__