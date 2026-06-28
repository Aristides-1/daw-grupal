# Grupo 3 — Autenticación JWT, Permisos por Rol, Filtros y Relaciones Anidadas

> **Alcance:** login JWT · autenticación real · permisos por rol · filtros por cliente/mascota · nested serializers.
> Esta fase resuelve el hallazgo **[CRITICO]** de la auditoría (API sin autenticación) y corrige el resto de hallazgos pendientes.

---

## 1. Dependencias nuevas (`requirements.txt`)

```
djangorestframework-simplejwt==5.5.1   # tokens JWT
PyJWT==2.13.0                          # dependencia de simplejwt
django-filter==25.2                    # filtros por querystring
```

Se **eliminó** `python-decouple` porque estaba instalado pero nunca se usaba (hallazgo de auditoría: dependencia muerta). La configuración se lee con `os.getenv`.

> [ADVERTENCIA] Como cambió `requirements.txt`, hay que reconstruir: `docker compose up --build`.

---

## 2. Login JWT y autenticación real

### ¿Qué es JWT?
Un **JSON Web Token** es una credencial firmada que el cliente envía en cada petición. En lugar de mantener sesiones en el servidor, el backend valida la firma del token. Es el estándar para APIs consumidas por SPAs como Angular.

### Flujo
1. El usuario envía `username` + `password` a `/api/auth/login/`.
2. El backend responde con dos tokens: `access` (vida corta, 60 min) y `refresh` (vida larga, 7 días), más `username`, `rol` e `is_superuser`.
3. Angular guarda el `access` y lo envía en cada petición:
   `Authorization: Bearer <access_token>`
4. Cuando el `access` expira, se renueva con `/api/auth/refresh/` sin volver a pedir contraseña.

### Endpoints de autenticación

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| `POST` | `/api/auth/login/` | Devuelve `access`, `refresh`, `username`, `rol`, `is_superuser` | Pública |
| `POST` | `/api/auth/refresh/` | Renueva el `access` a partir del `refresh` | Pública |
| `GET`  | `/api/auth/me/` | Datos del usuario autenticado actual | Requiere token |

### Token personalizado
`usuarios/serializers.py` → `CustomTokenObtainPairSerializer` añade el **rol** dentro del token y en la respuesta del login. Así Angular sabe inmediatamente qué rol tiene el usuario sin una petición extra.

### Configuración global (`settings.py`)
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': ('...JWTAuthentication', '...SessionAuthentication'),
    'DEFAULT_PERMISSION_CLASSES': ('rest_framework.permissions.IsAuthenticated',),
    ...
}
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'AUTH_HEADER_TYPES': ('Bearer',),
}
```

**`IsAuthenticated` por defecto** es lo que cierra el agujero crítico: ahora **ningún endpoint responde sin token** (devuelve `401`).

---

## 3. Permisos por rol

El sistema tiene 3 roles (modelo `usuarios.Rol`): **Administrador**, **Recepcionista**, **Veterinario**.

### Cómo funciona (`usuarios/permissions.py`)
La clase `RolPermisoPorAccion` lee dos atributos que cada ViewSet declara:
- `roles_lectura` → quién puede hacer `GET` (métodos seguros)
- `roles_escritura` → quién puede hacer `POST/PUT/PATCH/DELETE`

```python
class ClienteViewSet(viewsets.ModelViewSet):
    permission_classes = [RolPermisoPorAccion]
    roles_lectura = ['Administrador', 'Recepcionista', 'Veterinario']
    roles_escritura = ['Administrador', 'Recepcionista']
```

Los **superusuarios** de Django siempre pasan (para no bloquear el admin).

### Matriz de permisos (escritura)

| Recurso | Administrador | Recepcionista | Veterinario |
|---|:---:|:---:|:---:|
| clientes | [SÍ] | [SÍ] | [LECTURA] |
| mascotas | [SÍ] | [SÍ] | [LECTURA] |
| citas | [SÍ] | [SÍ] | [LECTURA] |
| veterinarios | [SÍ] | [LECTURA] | [LECTURA] |
| especialidades | [SÍ] | [LECTURA] | [LECTURA] |
| atenciones | [SÍ] | [LECTURA] | [SÍ] |
| recetas | [SÍ] | [LECTURA] | [SÍ] |
| usuarios / roles | [SÍ solo Admin] | [NO] | [NO] |

**Lógica de negocio detrás:** la recepcionista gestiona el front-desk (clientes, mascotas, agenda de citas); el veterinario registra lo médico (atenciones, recetas); el administrador maneja todo, incluida la gestión de usuarios y roles.

`usuarios` y `roles` usan la clase más estricta `EsAdministrador`.

---

## 4. Filtros por cliente / mascota (`django-filter`)

Se activó `DjangoFilterBackend` globalmente. Cada ViewSet declara `filterset_fields`:

| Endpoint | Filtros disponibles | Ejemplo |
|---|---|---|
| `/api/mascotas/` | `cliente`, `especie`, `sexo` | `/api/mascotas/?cliente=1` |
| `/api/citas/` | `mascota`, `veterinario`, `estado`, `fecha` | `/api/citas/?mascota=3&estado=pendiente` |
| `/api/atenciones/` | `cita` | `/api/atenciones/?cita=5` |
| `/api/recetas/` | `atencion` | `/api/recetas/?atencion=2` |
| `/api/veterinarios/` | `especialidad` | `/api/veterinarios/?especialidad=2` |

Además se habilitó **búsqueda de texto** (`?search=...`) y **ordenamiento** (`?ordering=...`) donde tiene sentido (ej. buscar cliente por nombre o documento).

---

## 5. Relaciones anidadas (nested serializers)

Antes los serializers usaban `fields = '__all__'` y solo devolvían **ids**. Ahora cada serializer:
1. lista **campos explícitos** (más seguro: no expone campos por accidente);
2. añade un campo `_detalle` con el objeto relacionado **anidado** (solo lectura).

### Patrón dual (escritura por id, lectura anidada)
```python
class MascotaSerializer(serializers.ModelSerializer):
    cliente_detalle = ClienteSerializer(source='cliente', read_only=True)
    class Meta:
        model = Mascota
        fields = ['id', 'nombre', ..., 'cliente', 'cliente_detalle']
```

- **Al crear/editar** se envía `"cliente": 1` (solo el id).
- **Al leer** se recibe `cliente` (id) **y** `cliente_detalle` (objeto completo del cliente).

Así el frontend no necesita una segunda petición para mostrar el nombre del dueño.

### Cadena de anidamiento
```
receta.atencion_detalle → atencion.cita_detalle → cita.mascota_detalle → mascota.cliente_detalle
                                                 → cita.veterinario_detalle → veterinario.especialidad_detalle
```

### Rendimiento — prevención de N+1
Como los nested generan consultas extra, cada ViewSet usa `select_related()` para traer las relaciones en un solo JOIN:
```python
queryset = Cita.objects.select_related('mascota__cliente', 'veterinario__especialidad').all()
```
Sin esto, listar 20 citas dispararía decenas de consultas a la BD (problema N+1).

---

## 6. Correcciones de auditoría aplicadas en esta fase

| Severidad | Hallazgo | Corrección |
|---|---|---|
| [CRITICO] | API sin autenticación | JWT + `IsAuthenticated` por defecto + permisos por rol |
| [ALTO] | `SECRET_KEY` y `DEBUG` hardcodeados | Ahora se leen de `os.getenv(...)` con defaults de dev |
| [ALTO] | Sin paginación | `PageNumberPagination`, `PAGE_SIZE=20` |
| [MEDIO] | `Cita` permitía doble reserva | `UniqueConstraint(veterinario, fecha, hora)` |
| [MEDIO] | Serializers `fields='__all__'` | Campos explícitos en todos los serializers |
| [MEDIO] | `Veterinario.correo` no único | `unique=True` |
| [MEDIO] | `python-decouple` sin usar | Eliminado de `requirements.txt` |
| [BAJO] | `Mascota.peso = FloatField` | `DecimalField(max_digits=5, decimal_places=2)` |
| [BAJO] | Credenciales duplicadas en compose | `db` ahora lee del `.env` (fuente única) |
| [BAJO] | Healthcheck con valores literales | Usa `$${POSTGRES_USER}` / `$${POSTGRES_DB}` |
| [BAJO] | `ALLOWED_HOSTS=['*']`, CORS abierto | Configurables vía env (defaults seguros para dev) |

> Los `tests.py` vacíos (hallazgo [BAJO]) **no** se abordaron en esta fase; quedan como mejora futura sugerida.

### Migraciones generadas
```
mascotas/0002_alter_mascota_peso.py
veterinarios/0002_alter_veterinario_correo.py
citas/0002_cita_unique_veterinario_fecha_hora.py
```

---

## 7. Cómo levantar y probar

```bash
# 1. Reconstruir (requirements.txt cambió)
docker compose up --build

# 2. Aplicar migraciones
docker compose exec backend python manage.py migrate

# 3. (Solo la primera vez) crear roles y superusuario
docker compose exec backend python manage.py createsuperuser
```

### Roles del sistema (datos maestros)
Deben existir estos 3 roles en la tabla `usuarios_rol`:
`Administrador`, `Recepcionista`, `Veterinario`.

### Usuarios de prueba ya creados (entorno de desarrollo)

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `admin1234` | superusuario (acceso total) |
| `recepcion` | `recep1234` | Recepcionista |
| `vet` | `vet1234` | Veterinario |

> Estas credenciales son **solo para desarrollo local**. No usar en despliegues reales.

### Probar el login (ejemplo con curl)
```bash
# Obtener token
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin1234"}'

# Usar el token
curl http://localhost:8000/api/clientes/ \
  -H "Authorization: Bearer <access_token>"
```

En **Swagger UI** (`/api/schema/swagger-ui/`) se puede pulsar **Authorize**, pegar `Bearer <token>` y probar todos los endpoints autenticados desde el navegador.

---

## 8. Verificación realizada

Todo lo siguiente se probó en vivo contra el contenedor:

| # | Prueba | Resultado |
|---|---|---|
| 1 | `GET /api/clientes/` sin token | `401` [OK] (fix crítico) |
| 2 | Login admin | devuelve tokens + rol [OK] |
| 3 | `GET /api/clientes/` con token | `200`, respuesta paginada (`count/next/previous/results`) [OK] |
| 4 | `GET /api/auth/me/` (recepcion) | devuelve usuario + `rol_detalle` [OK] |
| 5 | Recepcionista crea cliente | `201` [OK] |
| 6 | Recepcionista crea veterinario | `403` [OK] (prohibido) |
| 7 | Recepcionista lista usuarios | `403` [OK] (solo Admin) |
| 8 | Admin crea veterinario | `201` [OK] |
| 9 | Nested: mascota devuelve `cliente_detalle` | [OK] + `peso` decimal correcto |
| 10 | Filtro `/api/mascotas/?cliente=2` | devuelve solo sus mascotas [OK] |
| 11 | Cita duplicada (mismo vet/fecha/hora) | `400` [OK] (constraint) |
| 12 | Schema OpenAPI incluye endpoints de auth | [OK] |

---

## 9. Siguiente paso sugerido

- **Tests automatizados** de la API (los `tests.py` siguen vacíos) — login, permisos por rol y aislamiento.
- **Frontend Angular**: servicio de autenticación (guardar token, interceptor `Authorization`, guard por rol) y componentes que consuman estos endpoints.
- Generación de **PDF** (recetas) y **envío de correos**, según el plan original del proyecto.
