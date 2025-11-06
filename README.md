# Gestor de Tareas - Full Stack Application

Aplicación completa de gestión de tareas personales construida con Node.js + Express (backend), Next.js + TailwindCSS (frontend web) y React Native + Expo (aplicación móvil).

## 📋 Descripción

Sistema de gestión de tareas que permite a los usuarios:
- Registrarse e iniciar sesión
-  Crear, editar, listar y eliminar tareas personales
- Filtrar tareas por estado (pendiente, en progreso, completada)
- Acceder desde web y aplicación móvil

##  Estructura del proyecto

```
bluemedical/
├── backend/              # API REST con Node.js + Express + TypeScript
├── frontend/             # Aplicación web con Next.js + TailwindCSS
├── mobile-app/           # Aplicación móvil con React Native + Expo 
├── docker-compose.yml
```

## 🚀 Inicio rápido

### Requisitos previos

- Docker y Docker Compose instalados
- Node.js 20+ (para desarrollo local)
- MySQL 8.0+ (para desarrollo local)

### Instalación con Docker (Recomendado)

1. Clonar el repositorio:
```bash
git clone https://github.com/Sotorev/bluemedical
cd bluemedical
```

2. Iniciar todos los servicios:
```bash
docker-compose up -d
```

3. Ejecutar migraciones de base de datos:
```bash
docker-compose exec backend npm run migration:run
```

4. (Opcional) Cargar datos de prueba:
```bash
docker-compose exec backend npm run seed
```

5. Verificar que los servicios estén corriendo:
```bash
docker-compose ps
```

### Servicios disponibles

- **Backend API**: http://localhost:3001
- **Frontend Web**: http://localhost:3000
- **MySQL**: localhost:3306
- **Mobile App (Metro Bundler)**: http://localhost:8081
- **Mobile App (Expo DevTools)**: http://localhost:19000 

## 📦 Componentes del proyecto

### Backend 

API RESTful construida con:
- Node.js + Express + TypeScript
- MySQL + TypeORM
- Autenticación JWT
- Validaciones con express-validator
- Arquitectura Repository + Service Layer
- Tests unitarios con Jest
- Dockerizado

📖 [Ver documentación completa del Backend](./backend/README.md)

#### Endpoints principales:
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/tasks` - Listar tareas
- `POST /api/tasks` - Crear tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea

### Frontend Web

Aplicación web construida con:
- Next.js 16+
- TailwindCSS 4
- Context API para gestión de estado
- Axios para peticiones HTTP
- React Hook Form para manejo de formularios
- Arquitectura component-based
- Dockerizado

📖 [Ver documentación completa del Frontend](./frontend/README.md)

### Mobile App

Aplicación móvil construida con:
- React Native 0.81.4
- Expo 54
- React Navigation 7
- Expo SecureStore
- Axios
- Patrón Container-Presenter
- Tests unitarios con Jest
- Dockerizado

📖 [Ver documentación completa del Mobile App](./mobile-app/README.md)

## Desarrollo local

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en http://localhost:3000

### Mobile App

```bash
cd mobile-app
npm install
npm start
```

Para conectar desde un dispositivo físico, actualiza `src/utils/constants.ts` con la IP de la api.

## 🧪 Testing

### Ejecutar todos los tests con Docker (Recomendado)

**Linux/Mac:**
```bash
chmod +x run-tests.sh
./run-tests.sh
```

**Windows:**
```bash
run-tests.bat
```

Este script ejecuta todos los tests:
- **Backend**: Con Docker + MySQL (tests de integración)
- **Frontend**: Directamente con npm (tests unitarios)
- **Mobile-app**: Directamente con npm (tests unitarios)

### Tests individuales

#### Backend
```bash
cd backend
npm test
npm test -- --coverage

# Con Docker
docker compose -f docker-compose.test.yml up --build backend-test mysql-test
```

#### Frontend
```bash
cd frontend
npm test

# Con cobertura
npm run test:coverage

# Con Docker
docker compose -f docker-compose.test.yml up --build frontend-test
```

#### Mobile App
```bash
cd mobile-app
npm test

# Ejecutar tests sin watch
npm run testFinal

# Con Docker
docker compose -f docker-compose.test.yml up --build mobile-app-test
```

### Arquitectura de Tests

#### Backend (Tests de Integración)
Usa Docker porque requiere MySQL:
- **`Dockerfile.test`**: Imagen optimizada para ejecutar tests
- **`test-entrypoint.sh`**: Espera a MySQL y ejecuta tests
- Configuración en `docker-compose.test.yml`

#### Frontend y Mobile-App (Tests Unitarios)
Se ejecutan directamente sin Docker:
- Más rápidos (sin overhead de Docker)
- Más simples (sin Dockerfile adicional)
- Suficiente para tests unitarios puros

**Puedes ejecutar con Docker si prefieres:**
```bash
docker compose -f docker-compose.test.yml up --build frontend-test
docker compose -f docker-compose.test.yml up --build mobile-app-test
```

## 🐳 Docker

El proyecto usa Docker y Docker Compose para desarrollo, tests y producción.

### Comandos rápidos

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mobile-app

# Ejecutar todos los tests
./run-tests.sh        # Linux/Mac
run-tests.bat         # Windows

# Detener todos los servicios
docker-compose down

# Reconstruir un servicio
docker-compose up --build backend

# Limpiar volúmenes (⚠️ elimina datos de la base de datos)
docker-compose down -v
```

### Archivos Docker

- `docker-compose.yml` - Desarrollo local
- `docker-compose.prod.yml` - Producción
- `docker-compose.test.yml` - Tests automatizados
- `*/Dockerfile` - Imágenes de desarrollo/producción
- `*/Dockerfile.test` - Imágenes optimizadas para tests
- `*/test-entrypoint.sh` - Scripts de entrada para tests

## 📊 Base de datos

### Modelo de datos

#### Users
- id (PK)
- email (unique)
- password (hashed)
- name
- created_at
- updated_at

#### Tasks
- id (PK)
- title
- description
- status (enum: pendiente, en progreso, completada)
- user_id (FK)
- created_at
- updated_at

## 🏛️ Arquitectura y buenas prácticas

### Backend
- Repository Pattern
- Service Layer
- Principios SOLID
- DTOs para formatear respuestas
- Validaciones robustas
- Manejo centralizado de errores
- Tests unitarios

### Frontend
- Arquitectura component-based
- Hooks personalizados (useTasks, useAuth)
- Separación de lógica de presentación y negocio
- Manejo de estados global con Context API
- Componentes reutilizables

### Mobile App
- Patrón Container-Presenter
- Navegación estructurada con React Navigation
- Gestión de estado global con Context API
- Almacenamiento seguro de tokens con Expo Secure Store

## Seguridad

- Autenticación JWT
- Contraseñas hasheadas con bcrypt
- Validación de entrada de datos
- Headers de seguridad (Helmet)
- CORS configurado
- Variables de entorno para datos sensibles

## Variables de entorno

### Backend
Ver [backend/.env.example](./backend/.env.example)

### Frontend
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Mobile App
Las configuraciones se encuentran en `src/utils/constants.ts`:
```typescript
export const API_BASE_URL = 'http://localhost:3001/api';
```

**Nota**: La aplicación móvil no utiliza archivo `.env` para la configuración. La URL de la API debe configurarse directamente en `src/utils/constants.ts`.

Para dispositivos físicos, usa la IP de máquina local:
```typescript
export const API_BASE_URL = 'http://192.168.1.X:3001/api';
```

## CI/CD Pipeline

El proyecto incluye pipelines automatizados de CI/CD con GitHub Actions:

### Pipeline de CI (`.github/workflows/ci.yml`)

Se ejecuta en cada push o pull request a las ramas `main` y `develop`:

1. **Frontend Tests**: Tests unitarios directamente con npm (más rápido)
2. **Backend Tests**: Tests de integración con MySQL y Docker (`Dockerfile.test`)
3. **Mobile App Tests**: Tests unitarios directamente con npm (más rápido)
4. **Backend Lint**: Verificación de código con ESLint
5. **Frontend Lint**: Verificación de código con ESLint
6. **Build**: Construcción de todas las imágenes Docker

**Decisión arquitectural:**
- **Backend**: Usa Docker porque tiene tests de integración que requieren MySQL
- **Frontend/Mobile**: Ejecutan directamente con npm porque solo tienen tests unitarios (más rápido y simple)

### Pipeline de CD (`.github/workflows/cd.yml`)

Se ejecuta en cada push a `main` o manualmente:

1. Construye y publica imágenes Docker a Docker Hub
2. Copia `docker-compose.prod.yml` al VPS
3. Despliega los servicios en el VPS
4. Ejecuta health checks

### Secrets requeridos para CI/CD

```
DOCKER_USERNAME: Usuario de Docker Hub
DOCKER_PASSWORD: Token de Docker Hub
VPS_IP: IP del servidor VPS
VPS_USERNAME: Usuario SSH del VPS
VPS_SSH_KEY: Clave privada SSH para el VPS
```


## 🐛 Solución de problemas

### Error de conexión a MySQL
```bash
# Verificar que MySQL esté saludable
docker-compose ps
docker-compose logs mysql

# Esperar a que MySQL esté listo
docker-compose restart backend
```

### Puerto ya en uso
Cambiar los puertos en `docker-compose.yml` o detener el servicio que está usando el puerto.

### Errores de permisos en Docker
```bash
# Linux/Mac
sudo chown -R $USER:$USER .

# Windows
# Ejecutar PowerShell como administrador
```

## Licencia

Este proyecto es parte de una prueba técnica para Blue Medical.

## Autor

Desarrollado como parte de una evaluación técnica Full Stack.



---

