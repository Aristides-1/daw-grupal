from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from clientes.views import ClienteViewSet
from mascotas.views import MascotaViewSet
from veterinarios.views import VeterinarioViewSet, EspecialidadViewSet
from citas.views import CitaViewSet
from atenciones.views import AtencionViewSet
from recetas.views import RecetaViewSet
from usuarios.views import (
    RolViewSet,
    UsuarioViewSet,
)

router = DefaultRouter()

router.register(r"clientes", ClienteViewSet)
router.register(r"mascotas", MascotaViewSet)
router.register(r"veterinarios", VeterinarioViewSet)
router.register(r"especialidades", EspecialidadViewSet)
router.register(r"citas", CitaViewSet)
router.register(r"atenciones", AtencionViewSet)
router.register(r"recetas", RecetaViewSet)
router.register(r"usuarios", UsuarioViewSet)
router.register(
    r"roles",
    RolViewSet,
    basename="rol",
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]