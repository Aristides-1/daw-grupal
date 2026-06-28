# Grupo 2 — API REST con Django REST Framework

> **Alcance:** Puntos 3, 4 y 5 del plan de API REST.
> **Archivos creados/modificados:**
> - `<app>/serializers.py` (6 archivos nuevos)
> - `<app>/views.py` (6 archivos modificados)
> - `<app>/admin.py` (6 archivos modificados)
> - `config/urls.py` (modificado)
> - Migraciones generadas en todas las apps

---

## ¿Qué se hizo y por qué?

### 1. Serializers (`<app>/serializers.py`)

Un **serializer** es el traductor entre el modelo de Django (Python/ORM) y JSON (el formato que usa la API). Sin serializers, Django no sabe cómo convertir un objeto `Cliente` a `{"id": 1, "nombres": "Juan", ...}` ni al revés.

Se creó un serializer por cada modelo usando `ModelSerializer`, que genera automáticamente los campos a partir del modelo:

```python
# Patrón aplicado en todas las apps
class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'  # expone todos los campos del modelo
```

**Apps con serializers creados:** `clientes`, `mascotas`, `veterinarios` (incluye `Especialidad` y `Veterinario`), `citas`, `atenciones`, `recetas`.

**¿Por qué `fields = '__all__'`?** Para desarrollo es lo más práctico: expone todo sin tener que listar campos manualmente. En producción se recomendaría listar explícitamente los campos para evitar exponer datos sensibles.

---

### 2. ViewSets (`<app>/views.py`)

Un **ViewSet** agrupa todas las operaciones CRUD de un modelo en una sola clase. `ModelViewSet` en particular provee automáticamente:

| Operación HTTP | Endpoint generado | Acción |
|---|---|---|
| `GET` | `/api/clientes/` | Listar todos |
| `POST` | `/api/clientes/` | Crear uno nuevo |
| `GET` | `/api/clientes/{id}/` | Ver uno específico |
| `PUT` | `/api/clientes/{id}/` | Actualizar completo |
| `PATCH` | `/api/clientes/{id}/` | Actualizar parcial |
| `DELETE` | `/api/clientes/{id}/` | Eliminar |

```python
# Patrón aplicado en todas las apps
class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
```

`queryset` define qué registros de la BD entrega la vista. `serializer_class` define cómo se serializa/deserializa cada registro.

**Apps con ViewSets implementados:** `clientes`, `mascotas`, `veterinarios` (dos ViewSets: `EspecialidadViewSet` y `VeterinarioViewSet`), `citas`, `atenciones`, `recetas`.

---

### 3. Router global (`config/urls.py`)

El **DefaultRouter** de DRF conecta cada ViewSet con sus URLs automáticamente. Sin el router, habría que escribir las rutas a mano (una por operación). Con él, una sola línea genera todas las rutas de un recurso:

```python
router.register(r'clientes', ClienteViewSet)
# → genera: /api/clientes/, /api/clientes/{id}/
```

**Todos los recursos registrados:**

```
/api/clientes/
/api/mascotas/
/api/especialidades/
/api/veterinarios/
/api/citas/
/api/atenciones/
/api/recetas/
```

**Nota:** `especialidades` se registró como recurso independiente (además de `veterinarios`) porque tiene su propio modelo `Especialidad` y puede necesitar ser consultado por separado (ej: para llenar un `<select>` en Angular).

---

### 4. Documentación interactiva (drf-spectacular)

Se agregaron tres rutas al final de `urlpatterns`:

```python
path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
```

| URL | Qué hace |
|---|---|
| `/api/schema/` | Devuelve la especificación OpenAPI 3 en JSON/YAML |
| `/api/schema/swagger-ui/` | Interfaz visual para explorar y probar endpoints |
| `/api/schema/redoc/` | Documentación alternativa más legible |

`drf-spectacular` lee los ViewSets registrados en el router y genera la documentación automáticamente. Cada vez que se agrega un ViewSet nuevo, la documentación se actualiza sola.

---

### 5. Admin de Django (`<app>/admin.py`)

Se registraron todos los modelos en el panel de administración de Django (`/admin/`). Esto permite crear, ver, editar y eliminar registros directamente desde el navegador sin escribir código de frontend, lo cual es útil para:
- cargar datos de prueba durante el desarrollo;
- demostrar el sistema en presentaciones;
- verificar rápidamente que las migraciones crearon las tablas correctas.

```python
# Patrón en cada app
from .models import Cliente
admin.site.register(Cliente)
```

---

### 6. Migraciones

Antes de este grupo, solo `usuarios` tenía migración. Se generaron y aplicaron las migraciones iniciales para las 6 apps restantes:

```bash
python manage.py makemigrations  # genera los archivos de migración
python manage.py migrate         # aplica los cambios a la base de datos
```

Las tablas creadas en PostgreSQL:
- `clientes_cliente`
- `mascotas_mascota`
- `veterinarios_especialidad`
- `veterinarios_veterinario`
- `citas_cita`
- `atenciones_atencion`
- `recetas_receta`

---

## Verificación

Con el stack corriendo (`docker compose up`), todos estos endpoints deben responder:

```bash
# Raíz de la API (lista todos los recursos disponibles)
curl http://localhost:8000/api/

# Documentación interactiva
http://localhost:8000/api/schema/swagger-ui/
http://localhost:8000/api/schema/redoc/

# Panel de administración
http://localhost:8000/admin/
```

---

## Estado al finalizar este grupo

| Elemento | Estado |
|---|---|
| Serializers (6 apps) | [COMPLETADO] |
| ViewSets (7 recursos) | [COMPLETADO] |
| Router global | [COMPLETADO] |
| Migraciones aplicadas | [COMPLETADO] |
| Admin registrado (todas las apps) | [COMPLETADO] |
| Swagger UI en `/api/schema/swagger-ui/` | [COMPLETADO] |
| ReDoc en `/api/schema/redoc/` | [COMPLETADO] |

## Siguiente paso sugerido

- Autenticación con JWT (`djangorestframework-simplejwt`) para proteger los endpoints
- Componentes y servicios Angular que consuman esta API
