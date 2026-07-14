from rest_framework.permissions import BasePermission

from .models import Rol


def usuario_tiene_rol(user, nombre_rol):
    return (
        user.is_authenticated
        and user.is_active
        and user.estado
        and user.rol is not None
        and user.rol.nombre.lower() == nombre_rol
    )


class IsAdmin(BasePermission):
    message = "Se requiere el rol de administrador."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.is_active
            and (
                request.user.is_superuser
                or usuario_tiene_rol(
                    request.user,
                    Rol.ADMINISTRADOR,
                )
            )
        )


class IsRecepcionista(BasePermission):
    message = "Se requiere el rol de recepcionista."

    def has_permission(self, request, view):
        return usuario_tiene_rol(
            request.user,
            Rol.RECEPCIONISTA,
        )


class IsVeterinario(BasePermission):
    message = "Se requiere el rol de veterinario."

    def has_permission(self, request, view):
        return usuario_tiene_rol(
            request.user,
            Rol.VETERINARIO,
        )


class IsAdminORecepcionista(BasePermission):
    message = (
        "Se requiere el rol de administrador "
        "o recepcionista."
    )

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.is_active
            and (
                request.user.is_superuser
                or usuario_tiene_rol(
                    request.user,
                    Rol.ADMINISTRADOR,
                )
                or usuario_tiene_rol(
                    request.user,
                    Rol.RECEPCIONISTA,
                )
            )
        )


class IsAdminOVeterinario(BasePermission):
    message = (
        "Se requiere el rol de administrador "
        "o veterinario."
    )

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.is_active
            and (
                request.user.is_superuser
                or usuario_tiene_rol(
                    request.user,
                    Rol.ADMINISTRADOR,
                )
                or usuario_tiene_rol(
                    request.user,
                    Rol.VETERINARIO,
                )
            )
        )


class IsPersonalVetCare(BasePermission):
    message = "Se requiere una cuenta activa de VetCare."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.is_active
            and request.user.estado
            and (
                request.user.is_superuser
                or request.user.rol is not None
            )
        )