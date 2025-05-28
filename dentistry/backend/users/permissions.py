from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request):
        req = request.request
        if req.user.is_authenticated and req.user.is_support:
            return True

        return False

    def has_object_permission(self, request, view, obj):
        req = request.request
        if req.user.is_authenticated and request.method in permissions.SAFE_METHODS or req.user.is_support:
            return True

        return False