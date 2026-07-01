from rest_framework import viewsets
from .models import Cliente
from .serializers import ClienteSerializer
from rest_framework.permissions import IsAuthenticated
from usuarios.permissions import IsAdmin

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer

    def get_permissions(self):
        if self.action == 'destroy':
            return [IsAdmin()]
        return [IsAuthenticated()]