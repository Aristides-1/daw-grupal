from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from clientes.views import ClienteViewSet
from mascotas.views import MascotaViewSet
from veterinarios.views import VeterinarioViewSet, EspecialidadViewSet
from citas.views import CitaViewSet
from atenciones.views import AtencionViewSet
from recetas.views import RecetaViewSet

router = DefaultRouter()

router.register(r'clientes', ClienteViewSet)
router.register(r'mascotas', MascotaViewSet)
router.register(r'veterinarios', VeterinarioViewSet)
router.register(r'especialidades', EspecialidadViewSet)
router.register(r'citas', CitaViewSet)
router.register(r'atenciones', AtencionViewSet)
router.register(r'recetas', RecetaViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]