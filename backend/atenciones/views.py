from rest_framework import viewsets
from usuarios.permissions import RolPermisoPorAccion
from .models import Atencion
from .serializers import AtencionSerializer


class AtencionViewSet(viewsets.ModelViewSet):
    queryset = Atencion.objects.select_related(
        'cita__mascota__cliente', 'cita__veterinario__especialidad'
    ).all()
    serializer_class = AtencionSerializer
    permission_classes = [RolPermisoPorAccion]
    roles_lectura = ['Administrador', 'Recepcionista', 'Veterinario']
    roles_escritura = ['Administrador', 'Veterinario']

    filterset_fields = ['cita']
