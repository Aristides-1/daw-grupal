from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from usuarios.permissions import IsAdmin, IsVeterinario, IsCliente, IsAdminOVeterinario
from .models import Cita
from .serializers import CitaSerializer


class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer

    def get_permissions(self):
        if self.action == "create":
            return [IsCliente()] # solo  clientes pueden crear citas

        if self.action in ["update", "partial_update"]:
            return [IsAdminOVeterinario()] # solo admin o veterinario pueden actualizar citas

        if self.action == "destroy":
            return [IsAdmin()] #solo admin elimina

        return [IsAuthenticated()]