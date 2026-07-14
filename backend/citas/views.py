from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from usuarios.permissions import IsAdmin, IsAdminOVeterinario
from .models import Cita
from .serializers import CitaSerializer


class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.select_related(
        "mascota",
        "veterinario",
    ).all()

    serializer_class = CitaSerializer

    def get_permissions(self):
        if self.action == "destroy":
            permission_classes = [IsAdmin]

        elif self.action in [
            "create",
            "update",
            "partial_update",
        ]:
            permission_classes = [IsAdminOVeterinario]

        else:
            permission_classes = [IsAuthenticated]

        return [
            permission()
            for permission in permission_classes
        ]