from rest_framework import viewsets
from usuarios.permissions import RolPermisoPorAccion
from .models import Receta
from .serializers import RecetaSerializer


class RecetaViewSet(viewsets.ModelViewSet):
    queryset = Receta.objects.select_related(
        'atencion__cita__mascota__cliente',
        'atencion__cita__veterinario__especialidad',
    ).all()
    serializer_class = RecetaSerializer
    permission_classes = [RolPermisoPorAccion]
    roles_lectura = ['Administrador', 'Recepcionista', 'Veterinario']
    roles_escritura = ['Administrador', 'Veterinario']

    filterset_fields = ['atencion']
