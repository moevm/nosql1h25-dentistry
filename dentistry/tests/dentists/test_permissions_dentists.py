from backend.dentists.permissions import IsDentist


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