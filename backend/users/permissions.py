# Permisos personalizados reutilizables en toda la API
from rest_framework.permissions import BasePermission


class IsAdminRole(BasePermission):
    """Permite acceso solo a usuarios con role='admin'."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


class IsOwnerOrAdmin(BasePermission):
    """Permite acceso solo al dueño del objeto o a un admin."""
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        return obj == request.user or getattr(obj, 'author', None) == request.user
