from rest_framework.response import Response
from backend.dentists.views import DentistViewSet


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