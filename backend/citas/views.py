from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from usuarios.permissions import IsAdminsAdmin, IsVeterinario, IsCliente
from .models import Cita
from .serializers import CitaSerializer

class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer

    def get_permissions(self):
        if self.action == "create":
            return [IsCliente()]   # cliente SOLO solicita

        if self.action in ["update", "partial_update"]:
            return [IsVeterinario() | IsAdmin()]  # control médico

        if self.action == "destroy":
            return [IsAdmin()]  # solo admin elimina

        return [IsAuthenticated()]