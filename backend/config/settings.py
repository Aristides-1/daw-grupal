from pathlib import Path
from datetime import timedelta
import os

BASE_DIR = Path(__file__).resolve().parent.parent

# Configuración leída desde variables de entorno (.env). Los valores por
# defecto son seguros solo para desarrollo local.
SECRET_KEY = os.getenv(
    'DJANGO_SECRET_KEY',
    'django-insecure-vh#b_1p-%btou*8(^^k$)md+72)7@r8%kx*&1w$snstw#^6_n4',
)

DEBUG = os.getenv('DJANGO_DEBUG', 'True') == 'True'

ALLOWED_HOSTS = os.getenv('DJANGO_ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')


# ─── Apps ────────────────────────────────────────────────────────────────────

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Apps del proyecto
    'usuarios',
    'clientes',
    'mascotas',
    'veterinarios',
    'citas',
    'atenciones',
    'recetas',

    # API
    'rest_framework',
    'django_filters',
    'corsheaders',
    'drf_spectacular',

    # Herramientas de desarrollo
    'django_extensions',
]

AUTH_USER_MODEL = 'usuarios.Usuario'


# ─── Middleware ───────────────────────────────────────────────────────────────
# CorsMiddleware debe ir ANTES de CommonMiddleware

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# ─── Base de datos ────────────────────────────────────────────────────────────

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('POSTGRES_DB'),
        'USER': os.getenv('POSTGRES_USER'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD'),
        'HOST': os.getenv('POSTGRES_HOST', 'db'),
        'PORT': os.getenv('POSTGRES_PORT', '5432'),
    }
}


# ─── CORS ─────────────────────────────────────────────────────────────────────
# Permite que Angular (localhost:4200) llame a la API sin bloqueo del navegador.
# En desarrollo se permite todo; en producción se restringe vía CORS_ALLOWED_ORIGINS.

CORS_ALLOW_ALL_ORIGINS = os.getenv('CORS_ALLOW_ALL_ORIGINS', 'True') == 'True'

_cors_origins = os.getenv('CORS_ALLOWED_ORIGINS', '')
CORS_ALLOWED_ORIGINS = _cors_origins.split(',') if _cors_origins else []


# ─── Django REST Framework ────────────────────────────────────────────────────

REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',

    # Autenticación: por defecto se exige usuario autenticado vía JWT.
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),

    # Paginación: evita devolver toda la tabla en una sola respuesta.
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,

    # Filtros por querystring (?cliente=1, ?mascota=3, etc.)
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ),
}


# ─── Simple JWT ───────────────────────────────────────────────────────────────
# Tokens de acceso de vida corta + refresh de vida larga.

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': False,
    'AUTH_HEADER_TYPES': ('Bearer',),
}


# ─── drf-spectacular (Swagger / ReDoc) ───────────────────────────────────────

SPECTACULAR_SETTINGS = {
    'TITLE': 'VetCare API',
    'DESCRIPTION': (
        'API REST del sistema de gestión integral para clínicas veterinarias VetCare. '
        'Desarrollado con Django REST Framework como parte del curso de '
        'Desarrollo de Aplicaciones Web — UNSA.'
    ),
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
}


# ─── Validación de contraseñas ────────────────────────────────────────────────

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# ─── Internacionalización ─────────────────────────────────────────────────────

LANGUAGE_CODE = 'es-pe'
TIME_ZONE = 'America/Lima'
USE_I18N = True
USE_TZ = True


# ─── Archivos estáticos ───────────────────────────────────────────────────────

STATIC_URL = 'static/'
