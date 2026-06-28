# Resumen de Avances — VetCare

> **Estado:** Backend funcional y asegurado. Listo para consumo desde el frontend.
> **Fecha:** Junio 2026 | **Fase:** 3 de 5

---

## En una línea

El backend de VetCare está **100% funcional** con autenticación JWT, permisos por rol, filtros, y relaciones anidadas. La API está lista para que Angular la consuma.

---

## ¿Qué se avanzó?

### Grupo 1: Instalación y Configuración Base
- Instalación de `django-cors-headers`, `drf-spectacular`, `django-extensions`, `pydot`
- Configuración de CORS para que Angular pueda llamar a la API
- Setup de Swagger UI (`/api/schema/swagger-ui/`) y ReDoc
- Docker Compose con healthcheck de PostgreSQL

### Grupo 2: API REST Completa
- **7 recursos CRUD funcionales:** clientes, mascotas, veterinarios, especialidades, citas, atenciones, recetas
- **Serializers y ViewSets** para cada modelo
- **Router automático** que genera los endpoints (`/api/clientes/`, `/api/mascotas/`, etc.)
- **Panel de administración** Django completamente configurado
- **Migraciones** aplicadas a la BD

### Grupo 3: Seguridad, Permisos y Filtros
- **Login JWT** con tokens access (60 min) y refresh (7 días)
- **Autenticación obligatoria** en todos los endpoints (fix crítico)
- **Sistema de permisos por rol:**
  - Administrador: acceso total
  - Recepcionista: gestión de clientes, mascotas, citas
  - Veterinario: registro de atenciones y recetas
- **Filtros dinámicos:** `?cliente=`, `?mascota=`, `?estado=`, `?fecha=`
- **Serializers anidados:** devuelven objetos relacionados completos, no solo IDs
- **Paginación automática:** 20 registros por página

### Auditoría y Correcciones
- Eliminado acceso sin token (crítico)
- Configuración desde `.env` (SECRET_KEY, DEBUG, ALLOWED_HOSTS)
- Agregada paginación
- Corregidas restricciones de unicidad
- Eliminadas dependencias muertas
- Mejorados tipos de datos (DecimalField, constraints)

---

## ¿Qué funciona ahora?

| Feature | URL | Estado |
|---|---|---|
| Login | `POST /api/auth/login/` | ✓ Devuelve access, refresh, rol |
| Datos del usuario | `GET /api/auth/me/` | ✓ Requiere token |
| Renovar token | `POST /api/auth/refresh/` | ✓ Extiende sesión |
| CRUD de clientes | `/api/clientes/` | ✓ Filtros, búsqueda, paginación |
| CRUD de mascotas | `/api/mascotas/` | ✓ Filtro por cliente, peso decimal |
| CRUD de citas | `/api/citas/` | ✓ Constraint de doble reserva |
| CRUD de atenciones | `/api/atenciones/` | ✓ Permiso solo para veterinarios |
| CRUD de recetas | `/api/recetas/` | ✓ Anidadas desde atenciones |
| Swagger UI | `/api/schema/swagger-ui/` | ✓ Documentación interactiva |
| Permisos por rol | En todos los endpoints | ✓ Responde 403 cuando corresponde |

---

## Usuarios de prueba (desarrollo)

```
admin      / admin1234      (Administrador)
recepcion  / recep1234      (Recepcionista)
vet        / vet1234        (Veterinario)
```

### Cómo probar el login:
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin1234"}'

# Respuesta incluye:
# { "access": "<token>", "refresh": "<token>", "username": "admin", "rol": null, "is_superuser": true }
```

### Usar el token:
```bash
curl http://localhost:8000/api/clientes/ \
  -H "Authorization: Bearer <access>"
```

---

## ¿El backend está completo?

**Sí y no.**

### Lo que está hecho (100%):
- ✓ Modelos de datos y relaciones
- ✓ API REST con CRUD completo
- ✓ Autenticación y autorización
- ✓ Filtros y paginación
- ✓ Documentación de API (Swagger)

### Lo que falta (parte del plan original):
- [ ] Tests automatizados (tests.py están vacíos)
- [ ] Generación de PDF (recetas, historial clínico)
- [ ] Envío de correos (confirmación de citas, recetas)
- [ ] Frontend Angular (componentes, servicios, guards por rol)

---

## Próximos pasos recomendados

### Fase 4: Frontend Angular (prioritario)
1. Crear servicio de autenticación (login, logout, token management)
2. Interceptor HTTP para agregar `Authorization` en todas las peticiones
3. Guards por rol para proteger rutas
4. Componentes principales:
   - Login
   - Dashboard (según rol)
   - CRUD de clientes, mascotas, citas
   - Formulario de atención médica
5. Consumir todos los endpoints con el servicio HTTP

### Fase 5: Características complementarias (opcional)
- Generación de PDF con ReportLab
- Envío de correos con Celery
- Calendario visual de citas
- Dashboard con indicadores
- Tests automatizados

---

## Cómo levantar el sistema

```bash
# 1. Reconstruir (requirements.txt cambió)
docker compose up --build

# 2. Aplicar migraciones (si es la primera vez)
docker compose exec backend python manage.py migrate

# 3. Acceder
Backend:  http://localhost:8000/api/
Swagger:  http://localhost:8000/api/schema/swagger-ui/
Admin:    http://localhost:8000/admin/
Frontend: http://localhost:4200/
```

---

## Documentación detallada

Para entender cada fase en profundidad:
- **`docs/grupo1-instalacion-configuracion.md`** — configuración base
- **`docs/grupo2-api-rest.md`** — API REST y router
- **`docs/grupo3-autenticacion-permisos.md`** — JWT, permisos, filtros, nested

---

## Matriz de cambios de archivos

| Archivo | Grupo | Cambio |
|---|---|---|
| `requirements.txt` | 1 + 3 | Agregadas dependencias |
| `settings.py` | 1 + 3 | CORS, JWT, paginación, permisos |
| `docker-compose.yml` | 1 + 3 | Healthcheck, variables desde .env |
| `config/urls.py` | 2 + 3 | Router, auth endpoints, Swagger |
| `*/serializers.py` | 2 + 3 | Creados, campos explícitos, nested |
| `*/views.py` | 2 + 3 | ViewSets, permisos, filtros, select_related |
| `*/models.py` | 3 | Ajustes: DecimalField, unique, constraints |
| `usuarios/permissions.py` | 3 | Sistema de permisos por rol [NUEVO] |
| `usuarios/serializers.py` | 3 | JWT customizado [NUEVO] |
| `usuarios/views.py` | 3 | Auth endpoints, /me [NUEVO] |

---

## Checklist para el equipo

- [ ] Leer este resumen
- [ ] Leer `docs/grupo1`, `docs/grupo2`, `docs/grupo3` para detalles
- [ ] Hacer `docker compose up --build`
- [ ] Probar login en Swagger UI
- [ ] Verificar permisos (probar con `recepcion` / `vet`)
- [ ] Leer los comentarios en `usuarios/permissions.py` para entender el sistema de roles
- [ ] **Siguiente:** iniciar Fase 4 (Frontend Angular)
