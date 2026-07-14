from django.http import FileResponse

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from usuarios.permissions import IsAdmin, IsAdminOVeterinario

from .models import Receta
from .pdf import generar_receta_pdf
from .serializers import RecetaSerializer


class RecetaViewSet(viewsets.ModelViewSet):
    queryset = Receta.objects.select_related(
        "atencion",
        "atencion__cita",
        "atencion__cita__mascota",
        "atencion__cita__mascota__cliente",
        "atencion__cita__veterinario",
        "atencion__cita__veterinario__especialidad",
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

    @action(
        detail=True,
        methods=["get"],
        url_path="pdf",
    )
    def pdf(self, request, pk=None):
        receta = self.get_object()
        archivo = generar_receta_pdf(receta)

        return FileResponse(
            archivo,
            as_attachment=True,
            filename=f"receta-vetcare-{receta.id}.pdf",
            content_type="application/pdf",
        )