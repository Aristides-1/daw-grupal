from rest_framework import viewsets
from .models import Atencion
from .serializers import AtencionSerializer
from usuarios.permissions import IsVeterinario

class AtencionViewSet(viewsets.ModelViewSet):
    queryset = Atencion.objects.all()
    serializer_class = AtencionSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [IsVeterinario()]
        return [IsAuthenticated()]