from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from usuarios.permissions import EsVeterinario
from .models import Cita
from .serializers import CitaSerializer


class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer
    permission_classes = [IsAuthenticated, EsVeterinario]