from rest_framework import viewsets
from usuarios.permissions import RolPermisoPorAccion
from .models import Cita
from .serializers import CitaSerializer


class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.select_related(
        'mascota__cliente', 'veterinario__especialidad'
    ).all()
    serializer_class = CitaSerializer
    permission_classes = [RolPermisoPorAccion]
    roles_lectura = ['Administrador', 'Recepcionista', 'Veterinario']
    roles_escritura = ['Administrador', 'Recepcionista']

    # Filtros: /api/citas/?mascota=3  ?veterinario=2  ?estado=pendiente  ?fecha=2026-07-01
    filterset_fields = ['mascota', 'veterinario', 'estado', 'fecha']
    ordering_fields = ['fecha', 'hora']
