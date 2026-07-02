from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.is_superuser
        )


class IsVeterinario(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            getattr(request.user, "rol", None) == "veterinario"
        )


class IsCliente(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            getattr(request.user, "rol", None) == "cliente"
        )


class IsAdminOVeterinario(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and (
                request.user.is_superuser or
                getattr(request.user, "rol", None) == "veterinario"
            )
        )