from rest_framework.permissions import BasePermission

class EsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.rol.nombre == "admin"


class EsVeterinario(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.rol.nombre == "veterinario"


class EsCliente(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.rol.nombre == "cliente"