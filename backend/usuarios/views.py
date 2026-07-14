from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Rol, Usuario
from .permissions import IsAdmin
from .serializers import (
    RolSerializer,
    UsuarioActualSerializer,
    UsuarioSerializer,
)


class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all().order_by("nombre")
    serializer_class = RolSerializer
    permission_classes = [IsAdmin]


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.select_related(
        "rol",
    ).all().order_by("username")

    serializer_class = UsuarioSerializer

    def get_permissions(self):
        if self.action == "me":
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdmin]

        return [
            permission()
            for permission in permission_classes
        ]

    @action(
        detail=False,
        methods=["get"],
        url_path="me",
    )
    def me(self, request):
        serializer = UsuarioActualSerializer(
            request.user,
        )

        return Response(serializer.data)