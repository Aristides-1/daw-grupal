from rest_framework.permissions import IsAuthenticated
from usuarios.permissions import EsVeterinario

class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer
    permission_classes = [IsAuthenticated, EsVeterinario]