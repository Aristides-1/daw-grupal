VetCare
Sistema Integral de Gestión para Clínicas Veterinarias
1. Descripción del proyecto
VetCare es una aplicación web desarrollada para optimizar la gestión administrativa y
médica de una clínica veterinaria mediante la digitalización de sus procesos principales.
El sistema permitirá administrar la información de clientes, mascotas, veterinarios, citas
médicas, atenciones clínicas y recetas veterinarias desde una plataforma web moderna,
intuitiva y centralizada.
La aplicación estará construida siguiendo una arquitectura cliente-servidor, donde el
Backend será desarrollado con Django y Django REST Framework, exponiendo una
API REST que será consumida por un Frontend desarrollado en Angular. La
comunicación entre ambos componentes se realizará mediante peticiones HTTP
asíncronas utilizando JSON.
VetCare busca reemplazar procesos manuales como el registro en papel o el uso de
hojas de cálculo, proporcionando un sistema seguro, organizado y escalable que facilite
la consulta del historial médico de las mascotas, la programación de citas, el
seguimiento de tratamientos y la generación automática de documentos clínicos.
El sistema ha sido concebido como una solución escalable, permitiendo incorporar en
futuras versiones módulos adicionales como inventario, facturación, recordatorios
automáticos de vacunación, pagos en línea o una aplicación móvil.
2. Problemática
En muchas clínicas veterinarias de pequeña y mediana escala, la información de
clientes, mascotas y atenciones médicas se administra mediante registros físicos o
aplicaciones poco integradas. Esta situación ocasiona problemas como:
• pérdida o duplicidad de información;
• dificultad para acceder al historial clínico de una mascota;
• desorganización en la programación de citas;
• seguimiento limitado de tratamientos médicos;
• generación manual de recetas e informes;
• escasa disponibilidad de indicadores administrativos.
VetCare propone una solución informática que centraliza toda la información clínica y
administrativa, mejorando la organización y reduciendo errores en la gestión diaria.
3. Objetivo general
Desarrollar una aplicación web denominada VetCare que permita gestionar
integralmente los procesos administrativos y clínicos de una clínica veterinaria,
utilizando Django como Backend, Angular como Frontend y una arquitectura basada en
API REST, aplicando los conocimientos adquiridos durante el curso de Desarrollo de
Aplicaciones Web.
4. Objetivos específicos
• Implementar un sistema de autenticación con control de acceso según el rol del
usuario.
• Gestionar la información de clientes y sus mascotas.
• Administrar el personal veterinario y sus especialidades.
• Programar y administrar citas médicas.
• Registrar diagnósticos, tratamientos y observaciones clínicas.
• Generar recetas veterinarias.
• Consultar el historial médico de cada mascota.
• Exponer servicios mediante una API REST.
• Consumir la API desde Angular utilizando peticiones HTTP asíncronas.
• Generar reportes en formato PDF.
• Enviar correos electrónicos automáticos relacionados con las citas.
• Desplegar la aplicación en un servidor web para su acceso mediante HTTPS.
5. Arquitectura del sistema
VetCare seguirá una arquitectura desacoplada cliente-servidor.
 Usuario
 │
 Navegador Web
 │
 Angular (Frontend)
 │
 HTTP / JSON (API REST)
 │
 Django + Django REST Framework
 │
 PostgreSQL
El Backend será responsable de la lógica de negocio, autenticación, acceso a datos y
exposición de servicios REST, mientras que Angular implementará la interfaz gráfica y
consumirá dichos servicios mediante HttpClient.
6. Flujo principal del negocio
El proceso principal que administrará el sistema será el siguiente:
Inicio de sesión
↓
Registro del cliente
↓
Registro de la mascota
↓
Programación de cita
↓
Asignación del veterinario
↓
Atención médica
↓
Diagnóstico
↓
Tratamiento
↓
Receta médica
↓
Generación de PDF
↓
Envío de correo al propietario
Este flujo integra los principales módulos del sistema y cubre las funcionalidades
requeridas para la gestión clínica.
7. Módulos del sistema
7.1 Autenticación y usuarios
Permitirá:
• inicio y cierre de sesión;
• administración de usuarios;
• asignación de roles;
• control de permisos.
Roles propuestos
• Administrador.
• Veterinario.
• Recepcionista.
7.2 Clientes
Permitirá:
• registrar propietarios;
• actualizar información;
• eliminar registros;
• consultar historial de mascotas;
• realizar búsquedas y filtros.
7.3 Mascotas
Permitirá administrar:
• datos generales;
• especie;
• raza;
• sexo;
• fecha de nacimiento;
• peso;
• historial clínico.
Cada mascota pertenecerá a un único cliente.
7.4 Veterinarios
Permitirá registrar:
• datos personales;
• especialidad;
• estado;
• disponibilidad.
7.5 Especialidades
Catálogo de especialidades veterinarias.
Ejemplos:
• Medicina General.
• Cirugía.
• Dermatología.
• Traumatología.
• Odontología.
7.6 Citas
Permitirá:
• registrar citas;
• reprogramarlas;
• cancelarlas;
• consultar agenda diaria;
• consultar agenda semanal;
• visualizar disponibilidad de veterinarios.
7.7 Atenciones médicas
Permitirá registrar:
• motivo de consulta;
• síntomas;
• examen físico;
• diagnóstico;
• tratamiento;
• observaciones.
Cada atención estará asociada a una cita previamente registrada.
7.8 Recetas
Permitirá registrar:
• medicamentos;
• dosis;
• frecuencia;
• duración;
• recomendaciones.
Una atención podrá generar una o varias indicaciones médicas.
7.9 Reportes
Permitirá generar documentos PDF como:
• receta veterinaria;
• historial clínico;
• listado de citas;
• reporte de pacientes atendidos.
7.10 Notificaciones
Permitirá enviar automáticamente correos electrónicos para:
• confirmación de cita;
• reprogramación;
• cancelación;
• envío de receta.
8. Modelo de datos
El sistema estará compuesto inicialmente por las siguientes entidades:
Entidad Descripción
Usuario Credenciales de acceso al sistema
Rol Permisos de usuario
Cliente Propietario de una o varias mascotas
Mascota Paciente veterinario
Veterinario Profesional que realiza las atenciones
Especialidad Área médica del veterinario
Cita Programación de atención médica
Atención Registro clínico de la consulta
Receta Medicamentos e indicaciones médicas
9. Relaciones principales
Cliente
 │
 └───────< Mascota
Veterinario
 │
 └───────< Cita
Especialidad
 │
 └───────< Veterinario
Mascota
 │
 └───────< Cita
Cita
 │
 └──────── Atención
Atención
 │
 └───────< Receta
Este modelo permite implementar relaciones One-to-Many y One-to-One,
aprovechando las claves foráneas de Django.
10. Funcionalidades principales
El sistema incorporará las siguientes funcionalidades:
• autenticación de usuarios;
• administración de roles;
• CRUD de clientes;
• CRUD de mascotas;
• CRUD de veterinarios;
• CRUD de especialidades;
• CRUD de citas;
• CRUD de atenciones;
• CRUD de recetas;
• búsqueda y filtrado de información;
• consultas mediante API REST;
• consumo de servicios desde Angular;
• operaciones asíncronas mediante HTTP;
• generación de reportes PDF;
• envío automático de correos electrónicos;
• interfaz responsive utilizando Bootstrap.
11. API REST
La API será desarrollada mediante Django REST Framework, proporcionando
servicios en formato JSON.
Se plantea la siguiente estructura inicial:
/api/auth/
/api/clientes/
/api/mascotas/
/api/veterinarios/
/api/especialidades/
/api/citas/
/api/atenciones/
/api/recetas/
/api/reportes/
Estos servicios serán consumidos por Angular mediante HttpClient, evitando el uso de
vistas tradicionales de Django para la interfaz de usuario.
12. Tecnologías
Backend
• Python 3
• Django
• Django REST Framework
Frontend
• Angular
• TypeScript
• HTML5
• CSS3
• Bootstrap 5
Base de datos
• PostgreSQL
Contenedores
• Docker
• Docker Compose
Comunicación
• REST API
• JSON
• HttpClient (Angular)
Herramientas de desarrollo
• Visual Studio Code
• Git
• GitHub
• Postman
Despliegue
• Gunicorn
• Nginx
• HTTPS
13. Metodología de desarrollo
El proyecto será desarrollado por un equipo de dos integrantes utilizando una
metodología incremental basada en funcionalidades.
Se empleará un repositorio único en GitHub con la siguiente estructura:
vetcare/
│
├── backend/
├── frontend/
├── docs/
├── docker-compose.yml
├── README.md
└── .gitignore
El entorno de desarrollo será estandarizado mediante Docker Compose, permitiendo que
ambos integrantes trabajen con las mismas versiones de Python, PostgreSQL y Angular,
reduciendo problemas de configuración y compatibilidad.
Para el control de versiones se utilizará una estrategia simplificada con tres ramas:
• main: versión estable y lista para presentación.
• develop: integración de funcionalidades probadas.
• feature/vetcare: desarrollo activo del proyecto.
Cada funcionalidad será implementada y validada en feature/vetcare, integrada
posteriormente en develop y, una vez verificada, fusionada con main. Esta estrategia
mantiene un flujo de trabajo sencillo, adecuado para un equipo de dos personas y
alineado con el requisito del curso de trabajar colaborativamente mediante Git.
14. Funcionalidades complementarias
Si el cronograma lo permite, VetCare incorporará funcionalidades adicionales que
incrementen el valor del proyecto:
• panel de control con indicadores (dashboard);
• calendario de citas;
• historial clínico completo por mascota;
• filtros avanzados de búsqueda;
• exportación de reportes PDF;
• envío de recordatorios por correo electrónico;
• despliegue público mediante HTTPS.
Alcance del proyecto
El alcance definido permite cumplir con los requisitos establecidos para el trabajo final
del curso, integrando un backend en Django, un frontend en Angular, una API REST,
operaciones asíncronas, CRUD completos, generación de reportes, envío de correos y
trabajo colaborativo mediante Git y Docker, manteniendo un nivel de complejidad
adecuado para un equipo de dos integrantes y dejando una base sólida para futuras
ampliaciones del sistema.