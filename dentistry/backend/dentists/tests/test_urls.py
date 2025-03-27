from django.urls import resolve, reverse
from dentists.views import DentistViewSet


def test_dentist_me_url_resolves():
    url = reverse('dentists:dentist-me')
    assert resolve(url).func.__name__ == DentistViewSet.as_view({'get': 'me'}).__name__


def test_dentist_patients_url_resolves():
    url = reverse('dentists:dentist-patients')
    assert resolve(url).func.__name__ == DentistViewSet.as_view({'get': 'patients'}).__name__


def test_dentist_list_url_resolves():
    url = reverse('dentists:dentist-list')
    assert resolve(url).func.__name__ == DentistViewSet.as_view({'get': 'list'}).__name__