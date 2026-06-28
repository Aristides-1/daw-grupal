from rest_framework import viewsets
from usuarios.permissions import RolPermisoPorAccion
from .models import Especialidad, Veterinario
from .serializers import EspecialidadSerializer, VeterinarioSerializer


class EspecialidadViewSet(viewsets.ModelViewSet):
    queryset = Especialidad.objects.all()
    serializer_class = EspecialidadSerializer
    permission_classes = [RolPermisoPorAccion]
    roles_lectura = ['Administrador', 'Recepcionista', 'Veterinario']
    roles_escritura = ['Administrador']

    search_fields = ['nombre']


class VeterinarioViewSet(viewsets.ModelViewSet):
    queryset = Veterinario.objects.select_related('especialidad').all()
    serializer_class = VeterinarioSerializer
    permission_classes = [RolPermisoPorAccion]
    roles_lectura = ['Administrador', 'Recepcionista', 'Veterinario']
    roles_escritura = ['Administrador']

    filterset_fields = ['especialidad']
    search_fields = ['nombres', 'apellidos', 'correo']
    ordering_fields = ['apellidos', 'nombres']
