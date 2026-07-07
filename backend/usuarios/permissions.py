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
            request.user.rol and 
            request.user.rol.nombre == "veterinario" #En vez de objeto veterinario, se compara como String el nombre del rol, ya 
                                                   #que el objeto veterinario no tiene relación con el usuario, sino que es un objeto independiente.
        )


class IsCliente(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.rol and
            request.user.rol.nombre == "cliente"
        )

class IsAdminOVeterinario(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and (
                request.user.is_superuser or
                (request.user.rol and request.user.rol.nombre == "veterinario")
            )
        )