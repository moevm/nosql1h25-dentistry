from django.urls import reverse
from backend.users.models import CustomUser

def test_client_me_integration(api_client, client_user):

    print(CustomUser.objects.all()[0].__dict__)
    url = reverse('clients:client-me')
    api_client.force_authenticate(user=client_user)
    response = api_client.get(url)

    assert response.status_code == 200
    print(response.data)
    assert response.data["email"] == "client@test.com"
    assert "additional_info" in response.data
    assert response.data["additional_info"]["allergy"] == "лидокаин"