# Frontend - Gestor de Tareas

Aplicación web construida con Next.js, React y TailwindCSS para gestionar tareas.

## Tecnologías

- **Next.js 16** con App Router
- **React 19** con Hooks
- **TypeScript**
- **TailwindCSS 4** para estilos
- **Axios** para peticiones HTTP
- **React Hook Form** para manejo de formularios
- **Zod** para validaciones
- **React Hot Toast** para notificaciones

## Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Backend corriendo en http://localhost:3001

## Instalación

1. Instalar dependencias:

```bash
cd frontend
npm install
```

2. Configurar variables de entorno:

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Ejecución en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: http://localhost:3000

## Construcción para Producción

```bash
npm run build
npm start
```

## Ejecución con Docker

El frontend incluye un Dockerfile optimizado con multi-stage build para reducir el tamaño de la imagen final.

### Arquitectura del Dockerfile

El Dockerfile utiliza 4 etapas:
1. **base**: Imagen base Node.js 20 Alpine
2. **deps**: Instalación de dependencias con npm ci
3. **builder**: Construcción de la aplicación Next.js
4. **runner**: Imagen final optimizada con standalone output

### Opción 1: Docker Compose (Recomendado)

Desde la raíz del proyecto:

```bash
docker-compose up -d frontend
```


Para levantar todos los servicios:

```bash
docker-compose up -d
```

### Opción 2: Docker Individual

Construir la imagen:

```bash
docker build -t taskmanager-frontend .
```

Ejecutar el contenedor:

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:3001/api \
  taskmanager-frontend
```

La aplicación estará disponible en: http://localhost:3000

### Variables de Entorno en Docker

El frontend en Docker acepta las siguientes variables de entorno:

- `NEXT_PUBLIC_API_URL`: URL del backend API (default: http://localhost:3001/api)
- `NODE_ENV`: Entorno de ejecución (production, development)
- `PORT`: Puerto donde correrá el servidor (default: 3000)

### Comandos Útiles de Docker

```bash
# Ver logs
docker-compose logs frontend

# Ver logs en tiempo real
docker-compose logs -f frontend

# Reconstruir imagen
docker-compose build frontend

# Reiniciar servicio
docker-compose restart frontend

# Detener frontend
docker-compose stop frontend

# Limpiar y reconstruir
docker-compose down
docker-compose up -d --build
```

## Funcionalidades

### Autenticación
- Registro de usuarios
- Inicio de sesión
- Cierre de sesión
- Protección de rutas
- Persistencia de sesión con JWT

### Gestión de Tareas
- Crear tareas con título, descripción y estado
- Listar todas las tareas
- Filtrar tareas por estado (pendiente, en progreso, completada)
- Editar tareas existentes
- Eliminar tareas
- Interfaz responsiva

### UI/UX
- Diseño limpio y moderno
- Interfaz responsiva (mobile-first)
- Notificaciones toast para feedback
- Loading states
- Manejo de errores
- Validación de formularios

## Arquitectura

### Component-Based Architecture
La aplicación sigue una arquitectura basada en componentes con separación de responsabilidades:

- **Componentes UI**: Componentes reutilizables sin lógica de negocio
- **Componentes de Presentación**: Componentes que muestran datos
- **Context API**: Manejo de estado global para autenticación
- **Custom Hooks**: Lógica reutilizable (useTasks, useAuth)
- **Services**: Abstracción de llamadas a la API
- **Validators**: Validación de formularios con Zod

