"""
Permisos basados en el rol del usuario (modelo usuarios.Rol).

Cada ViewSet declara qué roles pueden LEER (métodos seguros: GET/HEAD/OPTIONS)
y qué roles pueden ESCRIBIR (POST/PUT/PATCH/DELETE) mediante los atributos de
clase `roles_lectura` y `roles_escritura`. Si un atributo no se declara, no se
restringe ese tipo de acción (cualquier usuario autenticado pasa).

Los superusuarios de Django siempre tienen acceso total (útil para el admin).
"""

from rest_framework.permissions import BasePermission, SAFE_METHODS


def nombre_rol(user):
    """Devuelve el nombre del rol del usuario, o None si no tiene."""
    rol = getattr(user, 'rol', None)
    return getattr(rol, 'nombre', None)


class RolPermisoPorAccion(BasePermission):
    """Concede acceso según el rol del usuario y la acción solicitada."""

    def has_permission(self, request, view):
        # Debe estar autenticado para cualquier acción.
        if not request.user or not request.user.is_authenticated:
            return False

        # El superusuario (admin de Django) siempre pasa.
        if request.user.is_superuser:
            return True

        if request.method in SAFE_METHODS:
            roles_permitidos = getattr(view, 'roles_lectura', None)
        else:
            roles_permitidos = getattr(view, 'roles_escritura', None)

        # Sin restricción declarada -> cualquier autenticado puede.
        if roles_permitidos is None:
            return True

        return nombre_rol(request.user) in roles_permitidos


class EsAdministrador(BasePermission):
    """Solo usuarios con rol 'Administrador' (o superusuarios)."""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.is_superuser:
            return True
        return nombre_rol(request.user) == 'Administrador'
