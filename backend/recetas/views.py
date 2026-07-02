from usuarios.permissions import IsAdminOVeterinario
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Receta
from .serializers import RecetaSerializer

class RecetaViewSet(viewsets.ModelViewSet):
    queryset = Receta.objects.all()
    serializer_class = RecetaSerializer
    
    def get_permissions(self):
        if self.action == "create":
            return [IsAdminOVeterinario()]

        return [IsAuthenticated()]