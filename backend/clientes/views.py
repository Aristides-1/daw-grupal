from rest_framework import viewsets
from usuarios.permissions import RolPermisoPorAccion
from .models import Cliente
from .serializers import ClienteSerializer


class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    permission_classes = [RolPermisoPorAccion]
    roles_lectura = ['Administrador', 'Recepcionista', 'Veterinario']
    roles_escritura = ['Administrador', 'Recepcionista']

    search_fields = ['nombres', 'apellidos', 'documento', 'correo']
    ordering_fields = ['apellidos', 'nombres']
