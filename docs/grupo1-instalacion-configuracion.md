# Grupo 1 — Instalación y Configuración del Backend

> **Alcance:** Puntos 1 y 2 del plan de API REST.
> **Archivos modificados:** `backend/requirements.txt`, `backend/config/settings.py`

---

## ¿Qué se hizo y por qué?

### 1. Nuevas dependencias en `requirements.txt`

Se agregaron cuatro paquetes nuevos al archivo de dependencias del backend:

```
django-cors-headers==4.7.0
drf-spectacular==0.28.0
django-extensions==3.2.3
pydot==3.0.4
```

#### `django-cors-headers`
**Problema que resuelve:** Cuando Angular (corriendo en `localhost:4200`) hace una petición HTTP a Django (en `localhost:8000`), el navegador bloquea la respuesta por la política de seguridad **CORS** (*Cross-Origin Resource Sharing*). Sin este paquete, la API existe pero Angular nunca puede leerla.

**Cómo funciona:** Agrega un middleware que inyecta cabeceras HTTP especiales (`Access-Control-Allow-Origin`, etc.) en cada respuesta de Django, indicándole al navegador que está autorizado a leer esa respuesta.

#### `drf-spectacular`
**Problema que resuelve:** Sin documentación, cualquier compañero o evaluador que quiera usar la API tiene que adivinar qué endpoints existen, qué campos acepta y qué devuelve. `drf-spectacular` lee automáticamente los ViewSets de DRF y genera documentación interactiva en formato OpenAPI 3.

**Lo que genera:**
- `/api/schema/` — archivo JSON/YAML con la especificación completa de la API
- `/api/schema/swagger-ui/` — interfaz gráfica para explorar y probar endpoints
- `/api/schema/redoc/` — documentación alternativa más legible

#### `django-extensions`
**Problema que resuelve:** Django base no incluye herramientas para visualizar el esquema de base de datos. `django-extensions` agrega comandos de gestión extra, siendo el más útil `graph_models`.

**Comando para generar el diagrama ER:**
```bash
# Dentro del contenedor:
docker compose exec backend python manage.py graph_models -a -o erd.png
```
Esto genera un archivo `erd.png` con todas las tablas y sus relaciones visualmente.

#### `pydot`
**Problema que resuelve:** Es la dependencia que usa `django-extensions` internamente para dibujar el gráfico. Sin `pydot`, el comando `graph_models` falla.

---

### 2. Cambios en `settings.py`

#### `INSTALLED_APPS`
Se registraron las tres librerías nuevas:

```python
'corsheaders',      # activa el middleware de CORS
'drf_spectacular',  # activa la generación de esquema OpenAPI
'django_extensions', # activa los comandos extra (graph_models, etc.)
```

**¿Por qué hay que registrarlas?** Django solo carga lo que está listado en `INSTALLED_APPS`. Sin el registro, los middlewares y comandos no existen para Django.

Se aprovechó también para limpiar la indentación inconsistente que tenían algunas apps (`mascotas`, `veterinarios`, `atenciones`, `recetas` tenían 3 espacios en vez de 4).

#### `MIDDLEWARE` — posición de `CorsMiddleware`
```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',        # ← AQUÍ, antes de CommonMiddleware
    'django.middleware.common.CommonMiddleware',
    ...
]
```

**¿Por qué tiene que ir antes de `CommonMiddleware`?** El middleware de CORS necesita interceptar la petición y agregar sus cabeceras *antes* de que Django procese la URL. Si va después de `CommonMiddleware`, algunos tipos de peticiones (especialmente las preflight `OPTIONS`) no reciben las cabeceras y el navegador las rechaza.

#### `CORS_ALLOW_ALL_ORIGINS = True`
Permite que cualquier origen haga peticiones a la API. Está bien para desarrollo local. En producción esto se reemplaza por:
```python
CORS_ALLOWED_ORIGINS = [
    "https://tu-dominio.com",
]
```

#### `REST_FRAMEWORK`
```python
REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}
```
Le indica a DRF que use el generador de esquema de `drf-spectacular` en lugar del que trae por defecto. Sin esta línea, la documentación generada estaría vacía o incompleta.

#### `SPECTACULAR_SETTINGS`
Metadatos que aparecen en la cabecera de la documentación Swagger:
```python
SPECTACULAR_SETTINGS = {
    'TITLE': 'VetCare API',
    'DESCRIPTION': '...',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
}
```
`SERVE_INCLUDE_SCHEMA: False` oculta el endpoint `/api/schema/` del listado de la UI (evita que aparezca como un endpoint más cuando estás en Swagger).

#### `LANGUAGE_CODE` y `TIME_ZONE`
```python
LANGUAGE_CODE = 'es-pe'
TIME_ZONE = 'America/Lima'
```
Se cambió del inglés y UTC al español de Perú y la zona horaria de Lima. Esto afecta los mensajes del admin de Django y los timestamps guardados en la base de datos.

---

## Cómo aplicar estos cambios

Después de hacer pull de esta rama, reconstruir el contenedor para que instale los nuevos paquetes:

```bash
docker compose up --build
```

El flag `--build` es necesario porque `requirements.txt` cambió. Sin él, Docker usa la imagen cacheada y los paquetes nuevos no se instalan.

---

## Estado al finalizar este grupo

| Elemento | Estado |
|---|---|
| `django-cors-headers` configurado | [COMPLETADO] |
| `drf-spectacular` configurado | [COMPLETADO] |
| `django-extensions` instalado | [COMPLETADO] |
| CORS habilitado para Angular | [COMPLETADO] |
| Swagger UI disponible (falta wiring de URLs) | [PENDIENTE - Grupo 2] |
| Serializers y ViewSets | [PENDIENTE - Grupo 2] |

Las URLs de Swagger (`/api/schema/swagger-ui/`) se registran en el Grupo 2 junto con el router de la API.
