# Backend - Gestor de Tareas API

API RESTful construida con Node.js, Express y TypeScript para la gestión de tareas personales.


## Requisitos previos

- Node.js 20 o superior
- MySQL 8.0 o superior
- Docker y Docker Compose (opcional)

## Tecnologías utilizadas

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **TypeScript** - Superset tipado de JavaScript
- **TypeORM** - ORM para TypeScript/JavaScript
- **MySQL** - Base de datos relacional
- **JWT** - Autenticación basada en tokens
- **express-validator** - Validación de datos
- **bcrypt** - Encriptación de contraseñas
- **Jest** - Framework de testing

## Estructura del proyecto

```
backend/
├── src/
│   ├── config/           # Configuraciones (DB, env)
│   ├── controllers/      # Controladores de rutas
│   ├── database/
│   │   ├── migrations/   # Migraciones de base de datos
│   │   └── seeders/      # Seeders de datos iniciales
│   ├── dtos/            # Data Transfer Objects
│   ├── entities/        # Entidades TypeORM
│   ├── middlewares/     # Middlewares personalizados
│   ├── repositories/    # Capa de acceso a datos
│   ├── routes/          # Definición de rutas
│   ├── services/        # Lógica de negocio
│   ├── validators/      # Validadores de entrada
│   ├── app.ts           # Configuración de Express
│   └── index.ts         # Punto de entrada
├── Dockerfile
├── package.json
└── tsconfig.json
```

## Instalación y configuración

### Opción 1: Con Docker (Recomendado)

1. Desde la raíz del proyecto, ejecutar:

```bash
docker-compose up -d
```

2. Verificar que los servicios estén corriendo:

```bash
docker-compose ps
```

3. Ejecutar las migraciones:

```bash
docker-compose exec backend npm run migration:run
```

4. (Opcional) Cargar datos de prueba:

```bash
docker-compose exec backend npm run seed
```

La API estará disponible en: `http://localhost:3001`

### Opción 2: Instalación local

1. Clonar el repositorio y navegar a la carpeta backend:

```bash
cd backend
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:

```bash
cp .env.example .env
```

Editar el archivo `.env` con tus configuraciones:

```env
NODE_ENV=development
PORT=3001
API_PREFIX=/api

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=rootpassword
DB_DATABASE=taskmanager

JWT_SECRET=secret
JWT_EXPIRES_IN=24h

# CORS: Para múltiples orígenes, separar por comas
# Incluye frontend web (3000), mobile web (19006) y Expo (19000)
CORS_ORIGIN=http://localhost:3000,http://localhost:19006,exp://localhost:19000
```

4. Asegurarse de que MySQL esté corriendo y crear la base de datos:

```sql
CREATE DATABASE taskmanager;
```

5. Compilar TypeScript:

```bash
npm run build
```

6. Ejecutar migraciones:

```bash
npm run migration:run
```

7. (Opcional) Cargar datos de prueba:

En desarrollo local (sin build):
```bash
npm run seed:dev
```

O después de compilar:
```bash
npm run seed
```

8. Iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

La API estará disponible en: `http://localhost:3001`

## Endpoints de la API

### Autenticación

#### Registro de usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123",
  "name": "Nombre Usuario"
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": 1,
      "email": "usuario@example.com",
      "name": "Nombre Usuario",
      "createdAt": "2025-11-04T00:00:00.000Z",
      "updatedAt": "2025-11-04T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": 1,
      "email": "usuario@example.com",
      "name": "Nombre Usuario",
      "createdAt": "2025-11-04T00:00:00.000Z",
      "updatedAt": "2025-11-04T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Tareas (Requieren autenticación)

Todas las rutas de tareas requieren el header de autorización:
```
Authorization: Bearer {token}
```

#### Obtener todas las tareas del usuario
```http
GET /api/tasks
GET /api/tasks?status=pendiente
```

Estados válidos: `pendiente`, `en progreso`, `completada`

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Tareas obtenidas exitosamente",
  "data": [
    {
      "id": 1,
      "title": "Completar proyecto",
      "description": "Terminar la implementación del backend",
      "status": "en progreso",
      "userId": 1,
      "createdAt": "2025-11-04T00:00:00.000Z",
      "updatedAt": "2025-11-04T00:00:00.000Z"
    }
  ]
}
```

#### Obtener una tarea por ID
```http
GET /api/tasks/:id
```

#### Crear nueva tarea
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Nueva tarea",
  "description": "Descripción de la tarea",
  "status": "pendiente"
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Tarea creada exitosamente",
  "data": {
    "id": 1,
    "title": "Nueva tarea",
    "description": "Descripción de la tarea",
    "status": "pendiente",
    "userId": 1,
    "createdAt": "2025-11-04T00:00:00.000Z",
    "updatedAt": "2025-11-04T00:00:00.000Z"
  }
}
```

#### Actualizar tarea
```http
PUT /api/tasks/:id
Content-Type: application/json

{
  "title": "Título actualizado",
  "description": "Descripción actualizada",
  "status": "completada"
}
```

#### Eliminar tarea
```http
DELETE /api/tasks/:id
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Tarea eliminada exitosamente"
}
```

### Health Check
```http
GET /api/health
```

## Tests

El proyecto incluye tests unitarios y de integración.

### Ejecutar tests localmente

#### Tests completos (unitarios + integración)
```bash
npm test
```

Para los tests de integración, asegurar tener MySQL corriendo localmente o usa Docker.

### Tests con Docker

Para ejecutar los tests en un entorno aislado con Docker:

```bash
# Ejecutar tests de integración con docker-compose
docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit

# Limpiar contenedores después de los tests
docker-compose -f docker-compose.test.yml down -v
```

**Nota**: El contenedor de tests ejecuta automáticamente:
1. Espera a que MySQL esté listo
2. Ejecuta las migraciones para crear las tablas
3. Ejecuta todos los tests (unitarios + integración)

Este proceso se gestiona mediante el script `test-entrypoint.sh`.

### Integración continua

Los tests se ejecutan automáticamente en cada push o pull request mediante GitHub Actions:

- **Tests unitarios**: Se ejecutan directamente sin necesidad de servicios externos
- **Tests de integración**: Se ejecutan con Docker Compose (backend + MySQL)
  - La base de datos se crea automáticamente
  - Las migraciones se ejecutan antes de los tests
  - Los tests validan la API completa con datos reales
- **Linting**: Verifica la calidad del código
- **Build**: Construye la imagen Docker del proyecto

Ver el estado de los tests en la pestaña "Actions" del repositorio.
## Scripts disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo
- `npm run build` - Compila TypeScript a JavaScript
- `npm start` - Inicia el servidor en modo producción
- `npm test` - Ejecuta todos los tests (unitarios + integración)
- `npm run lint` - Ejecuta el linter
- `npm run lint:fix` - Corrige errores de linting
- `npm run migration:run` - Ejecuta las migraciones
- `npm run migration:revert` - Revierte la última migración
- `npm run seed` - Carga datos de prueba (requiere código compilado)
- `npm run seed:dev` - Carga datos de prueba en desarrollo (usa TypeScript directamente)

## Configuración CORS para Aplicación Móvil

El backend está configurado para aceptar peticiones desde múltiples orígenes:

- **Frontend Web**: `http://localhost:3000`
- **Expo Web**: `http://localhost:19006`
- **Expo Dev**: `exp://localhost:19000`

### Comportamiento de CORS

1. **En Desarrollo** (`NODE_ENV=development`):
   - Permite todos los orígenes automáticamente
   - Permite peticiones sin origin (apps móviles nativas, Postman)
   - Facilita el desarrollo sin configuraciones complejas

2. **En Producción** (`NODE_ENV=production`):
   - Solo permite orígenes específicos listados en `CORS_ORIGIN`
   - Valida estrictamente cada petición

### Configurar para Dispositivo Físico

Si estás desarrollando con un dispositivo físico (no emulador), necesitarás:

1. Obtener la IP de tu máquina:
```bash
# En Windows
ipconfig

# En Mac/Linux
ifconfig
```

2. Actualizar `CORS_ORIGIN` en el archivo `.env`:
```env
CORS_ORIGIN=http://localhost:3000,http://192.168.1.100:3000,http://192.168.1.100:19006
```

3. Actualizar `API_BASE_URL` en la app móvil (`mobile-app/src/utils/constants.ts`):
```typescript
export const API_BASE_URL = 'http://192.168.1.100:3001/api';
```

**Nota**: Asegúrate de que tu firewall permita conexiones en el puerto 3001.

## Solución de problemas

### Error de conexión a la base de datos

Si usas Docker y obtienes errores de conexión:

```bash
# Verificar que MySQL esté corriendo
docker-compose ps

# Ver logs de MySQL
docker-compose logs mysql

# Reiniciar servicios
docker-compose restart
```

### Error: Cannot find module

```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Puerto ya en uso

Cambiar el puerto en el archivo `.env`:

```env
PORT=3001
```

## Licencia

Este proyecto es parte de una prueba técnica.


