# 🚀 Repositorio Grupal de Laboratorio
## 💻 Desarrollo de Aplicaciones Web (DAW)

---

## 🧑‍🎓 Integrantes del Grupo
* **Ulloa Salas**, Sebastian Donato
* **Cervantes Apaza**, Diego Aristides
* **Castellanos Ampuero**, Basily Andree

---

## 🐾 VetCare API - Backend

> **Sistema de gestión veterinaria** desarrollado con Django + Django REST Framework + JWT + Docker.

### 🚀 Descripción
**VetCare API** es un backend REST diseñado para la administración integral de una clínica veterinaria. La plataforma automatiza y centraliza el control de los siguientes módulos:

* 🧑 **Clientes:** Registro y perfiles de propietarios.
* 🐶🐱 **Mascotas:** Expediente digital clínico por animal.
* 👨‍⚕️ **Veterinarios:** Gestión del personal médico y especialidades.
* 📅 **Citas:** Control de agenda y programación de visitas.
* 🏥 **Atenciones Médicas:** Registro de consultas y diagnósticos.
* 💊 **Recetas:** Prescripción de medicamentos vinculados.

> 🔒 Incluye autenticación segura mediante **JWT** y control de acceso basado en roles.

---

## 🧱 Tecnologías Usadas
* **Lenguaje:** Python 3.12
* **Framework principal:** Django 5 & Django REST Framework (DRF)
* **Base de Datos:** PostgreSQL
* **Autenticación:** SimpleJWT
* **Contenedores:** Docker & Docker Compose

---

## 📦 Arquitectura del Proyecto
El backend está estructurado de manera modular e independiente para facilitar su escalabilidad:

```text
backend/
│
├── clientes/       # Control de propietarios
├── mascotas/       # Gestión de pacientes animales
├── veterinarios/   # Gestión de staff médico
├── citas/          # Módulo de reservas de turnos
├── atenciones/     # Historial de consultas clínicas
├── recetas/        # Medicación emitida
├── usuarios/       # Cuentas del sistema y accesos
│
└── config/         # Configuración del proyecto
    ├── settings.py
    └── urls.py
