import pytest
from django.urls import reverse


def test_dentist_me_integration(api_client, dentist_user):
    url = reverse('dentists:dentist-me')
    api_client.force_authenticate(user=dentist_user)
    response = api_client.get(url)
    
    assert response.status_code == 200
    assert response.data["email"] == "dentist@test.com"