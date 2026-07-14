from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from usuarios.permissions import (
    IsAdmin,
    IsAdminORecepcionista,
)

from .models import Mascota
from .serializers import MascotaSerializer


class MascotaViewSet(viewsets.ModelViewSet):
    queryset = Mascota.objects.all()
    serializer_class = MascotaSerializer

    def get_permissions(self):
        if self.action == "destroy":
            permission_classes = [IsAdmin]

        elif self.action in [
            "create",
            "update",
            "partial_update",
        ]:
            permission_classes = [
                IsAdminORecepcionista
            ]

        else:
            permission_classes = [
                IsAuthenticated
            ]

        return [
            permission()
            for permission in permission_classes
        ]