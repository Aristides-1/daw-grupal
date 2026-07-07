from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Usuario
from .serializers import UsuarioSerializer
from .permissions import IsAdmin


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]  # cualquiera puede registrarse
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsAdmin()]  # solo admin gestiona usuarios existentes
        return [IsAuthenticated()]