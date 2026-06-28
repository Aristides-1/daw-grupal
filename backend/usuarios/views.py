from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Rol, Usuario
from .serializers import RolSerializer, UsuarioSerializer, CustomTokenObtainPairSerializer
from .permissions import EsAdministrador


class CustomTokenObtainPairView(TokenObtainPairView):
    """POST /api/auth/login/ -> devuelve access, refresh, username y rol."""
    serializer_class = CustomTokenObtainPairSerializer


class MeView(APIView):
    """GET /api/auth/me/ -> datos del usuario autenticado actual."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UsuarioSerializer(request.user).data)


class RolViewSet(viewsets.ModelViewSet):
    """CRUD de roles. Solo Administrador."""
    queryset = Rol.objects.all()
    serializer_class = RolSerializer
    permission_classes = [EsAdministrador]


class UsuarioViewSet(viewsets.ModelViewSet):
    """CRUD de usuarios. Solo Administrador."""
    queryset = Usuario.objects.all().select_related('rol')
    serializer_class = UsuarioSerializer
    permission_classes = [EsAdministrador]
    filterset_fields = ['rol', 'estado', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name']
