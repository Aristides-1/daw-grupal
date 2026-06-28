from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

from usuarios.views import UsuarioViewSet, RolViewSet, MeView, CustomTokenObtainPairView
from clientes.views import ClienteViewSet
from mascotas.views import MascotaViewSet
from veterinarios.views import EspecialidadViewSet, VeterinarioViewSet
from citas.views import CitaViewSet
from atenciones.views import AtencionViewSet
from recetas.views import RecetaViewSet

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'roles', RolViewSet)
router.register(r'clientes', ClienteViewSet)
router.register(r'mascotas', MascotaViewSet)
router.register(r'especialidades', EspecialidadViewSet)
router.register(r'veterinarios', VeterinarioViewSet)
router.register(r'citas', CitaViewSet)
router.register(r'atenciones', AtencionViewSet)
router.register(r'recetas', RecetaViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),

    # Autenticación JWT
    path('api/auth/login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/me/', MeView.as_view(), name='me'),

    # Recursos de la API
    path('api/', include(router.urls)),

    # Documentación interactiva
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
