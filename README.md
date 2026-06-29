# 🚀 REPOSITORIO GRUPAL DE LABORATORIO
#    DESARROLLO DE APLICACIONES WEB, LABORATORIO
## 🧑‍🎓INTEGRANTES DEL REPOSITORIO (GRUPO):
-ULLOA SALAS, SEBASTIAN DONATO

-CERVANTES APAZA, DIEGO ARISTIDES

-CASTELLANOS AMPUERO, BASILY ANDREE

🐾 VetCare API - Backend

Sistema de gestión veterinaria desarrollado con Django + Django REST Framework + JWT + Docker.

🚀 Descripción

VetCare API es un backend REST para la administración de una clínica veterinaria que permite gestionar:

Clientes 🧑
Mascotas 🐶🐱
Veterinarios 👨‍⚕️
Citas 📅
Atenciones médicas 🏥
Recetas 💊

Incluye autenticación con JWT y control de acceso por roles.

🧱 Tecnologías usadas
Django 5
Django REST Framework
PostgreSQL
SimpleJWT (autenticación)
Docker + Docker Compose
Python 3.12
📦 Arquitectura del proyecto
backend/
│
├── clientes/
├── mascotas/
├── veterinarios/
├── citas/
├── atenciones/
├── recetas/
├── usuarios/
│
├── config/
│   ├── settings.py
│   ├── urls.py
⚙️ Instalación y ejecución
🐳 Ejecutar con Docker
docker compose up --build
🔁 Reset completo de entorno (opcional)

⚠️ Elimina base de datos

docker compose down -v
docker compose up --build
🔐 Autenticación (JWT)
Obtener token
POST /api/token/
Body:
{
  "username": "admin",
  "password": "********"
}
Usar token

Agregar en headers:

Authorization: Bearer <access_token>
Refrescar token
POST /api/token/refresh/
🌐 Endpoints principales
🟢 Clientes
GET    /api/clientes/
POST   /api/clientes/
🟢 Mascotas
GET    /api/mascotas/
POST   /api/mascotas/
🟢 Veterinarios
GET    /api/veterinarios/
POST   /api/veterinarios/
🟢 Citas
GET    /api/citas/
POST   /api/citas/
🟢 Atenciones
GET    /api/atenciones/
POST   /api/atenciones/
🟢 Recetas
GET    /api/recetas/
POST   /api/recetas/
🔒 Seguridad implementada
JWT Authentication
Protección de endpoints con IsAuthenticated
Control base por roles (admin / veterinario / cliente)
👥 Roles del sistema (en progreso)
👑 Admin: acceso total
👨‍⚕️ Veterinario: gestión médica
👤 Cliente: acceso limitado a sus datos
🧪 Pruebas realizadas
Postman
Login JWT funcional
CRUD completo probado
Endpoints protegidos funcionando
Navegador
API Root disponible:
http://localhost:8000/api/
🐳 Docker
Servicios incluidos:
backend (Django)
frontend (Angular)
database (PostgreSQL)
🚧 Estado del proyecto
✔ Completado
Modelos
CRUD API REST
JWT Authentication
Docker setup
PostgreSQL conexión
🔄 En progreso
Roles avanzados
Permisos por usuario
Lógica de negocio avanzada
Filtros por usuario
🎯 Objetivo

Construir un sistema veterinario completo con arquitectura REST API listo para integración con frontend Angular.

👨‍💻 Autor

Proyecto académico - Desarrollo de Aplicaciones Web (DAW)