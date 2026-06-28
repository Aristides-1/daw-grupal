from rest_framework import viewsets
from usuarios.permissions import RolPermisoPorAccion
from .models import Mascota
from .serializers import MascotaSerializer


class MascotaViewSet(viewsets.ModelViewSet):
    queryset = Mascota.objects.select_related('cliente').all()
    serializer_class = MascotaSerializer
    permission_classes = [RolPermisoPorAccion]
    roles_lectura = ['Administrador', 'Recepcionista', 'Veterinario']
    roles_escritura = ['Administrador', 'Recepcionista']

    # Filtro por dueño: /api/mascotas/?cliente=1
    filterset_fields = ['cliente', 'especie', 'sexo']
    search_fields = ['nombre', 'raza']
    ordering_fields = ['nombre', 'fecha_nacimiento']
