from backend.clients.permissions import IsClient

# Clients
def test_is_client_permission_true(api_request_factory, client_user):
    permission = IsClient()
    request = api_request_factory.get('/clients/me/')
    request.user = client_user
    assert permission.has_permission(request, None) is True


def test_is_client_permission_false_not_client(api_request_factory, dentist_user):
    permission = IsClient()
    request = api_request_factory.get('/clients/me/')
    request.user = dentist_user
    assert permission.has_permission(request, None) is False


def test_is_client_permission_false_not_authenticated(api_request_factory):
    permission = IsClient()
    request = api_request_factory.get('/clients/me/')
    assert permission.has_permission(request, None) is False