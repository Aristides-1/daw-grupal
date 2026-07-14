from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from usuarios.permissions import IsAdmin, IsAdminOVeterinario

from .models import Receta
from .serializers import RecetaSerializer


class RecetaViewSet(viewsets.ModelViewSet):
    queryset = Receta.objects.select_related(
        "atencion",
        "atencion__cita",
        "atencion__cita__mascota",
    ).all()

    serializer_class = RecetaSerializer

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