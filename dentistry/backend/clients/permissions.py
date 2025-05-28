from rest_framework import permissions
from rest_framework.request import Request
from ..users.models import ClientRole

class IsClient(permissions.BasePermission):
    def has_permission(self, request, view):
        if not hasattr(request, 'user'):
            return False
        return request.user.is_authenticated and request.user.role_id == ClientRole.id