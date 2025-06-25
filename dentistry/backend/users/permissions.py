from rest_framework import permissions
from .models import AdminRole


class IsAdminUser(permissions.BasePermission):
    """
    Разрешение только для пользователей с ролью администратора.
    """
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role_id == AdminRole.id
        )


class IsAdminUserOrReadOnly(permissions.BasePermission):
    """
    Разрешение на запись только для администраторов, 
    на чтение - для всех аутентифицированных пользователей.
    """
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role_id == AdminRole.id
        )


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Разрешение на изменение объекта только для владельца или администратора.
    """
    
    def has_object_permission(self, request, view, obj):
        # Администраторы имеют полный доступ
        if request.user.role_id == AdminRole.id:
            return True
        
        # Владельцы объекта имеют доступ к своим данным
        if hasattr(obj, 'user'):
            return obj.user == request.user
        elif hasattr(obj, 'id'):
            return obj.id == request.user.id
        
        return False


class CanManageUsers(permissions.BasePermission):
    """
    Разрешение на управление пользователями только для администраторов.
    """
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role_id == AdminRole.id and
            request.user.is_active
        )