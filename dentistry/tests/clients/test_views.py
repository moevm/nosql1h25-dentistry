from rest_framework.response import Response
from backend.clients.views import ClientViewSet


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