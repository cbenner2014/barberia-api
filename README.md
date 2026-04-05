# Barbería API & Frontend - Sistema de Gestión 💈

¡Bienvenido al sistema de gestión para Barberías! Este proyecto es una solución integral que incluye un **Backend en Spring Boot** y un **Frontend en Angular**, permitiendo administrar citas, servicios, barberos y clientes con un sistema robusto de **Control de Acceso Basado en Roles (RBAC)**.

## 🚀 Características Principales

- **Sistema de Roles (RBAC)**:
  - **ADMIN**: Control total de barberos, servicios, horarios y finanzas.
  - **BARBERO**: Gestión de sus propias citas y visualización de su clientela.
  - **CLIENTE**: Reserva de citas online, elección de barbero y servicio.
- **Seguridad**: Autenticación mediante **JWT (JSON Web Tokens)** y encriptación de contraseñas con **BCrypt**.
- **Diseño Moderno**: Interfaz *Glassmorphic* realizada en Angular, optimizada para una experiencia premium.
- **Backend Robusto**: API REST funcional con filtrado de datos automático según la identidad del usuario.

## 🛠️ Tecnologías Utilizadas

- **Backend**: Java 17+, Spring Boot 3.3+, Spring Security, JPA Hibernate, MySQL, JJWT.
- **Frontend**: Angular 17+, Signals (Estado), Reactive Forms, Vanilla CSS (Premium Styles).
- **Base de Datos**: MySQL.

## ⚙️ Configuración y Despliegue

### Requisitos Previos
- JDK 17 o superior.
- Node.js y npm.
- MySQL Server.

### Instalación Backend
1. Configura tu base de datos en `src/main/resources/application.yml`.
2. Ejecuta el script SQL incluido en `barberia_bd` para inicializar tablas y usuarios.
3. Inicia la aplicación con:
   ```bash
   mvn spring-boot:run
   ```

### Instalación Frontend
1. Ve a la carpeta del frontend:
   ```bash
   cd barberia-frontend
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   ng serve
   ```

## 🔐 Credenciales de Prueba
- **Admin**: `admin` / `123456`
- **Barbero**: `barbero_pro` / `123456`
- **Cliente**: `cliente_fiel` / `123456`

---
Desarrollado con ❤️ para la gestión moderna de barberías.
