from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from usuarios.permissions import IsAdmin, IsAdminOVeterinario

from .models import Atencion
from .serializers import AtencionSerializer


class AtencionViewSet(viewsets.ModelViewSet):
    queryset = Atencion.objects.select_related(
        "cita",
        "cita__mascota",
        "cita__veterinario",
    ).all()

    serializer_class = AtencionSerializer

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