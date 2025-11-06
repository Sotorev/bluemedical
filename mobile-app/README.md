# Mobile App - Gestor de Tareas

Aplicación móvil desarrollada con React Native y Expo para el gestor de tareas.

## Tecnologías Utilizadas

- **React Native 0.81.4**: Framework para desarrollo móvil multiplataforma
- **Expo 54.0.7**: Herramientas y servicios para desarrollo React Native
- **React Navigation 7.x**: Navegación entre pantallas
- **TypeScript**: Tipado estático
- **Axios**: Cliente HTTP para peticiones al backend
- **Expo Secure Store**: Almacenamiento seguro de tokens y datos sensibles
- **React Native Picker**: Selector de opciones

## Arquitectura

La aplicación sigue el patrón **Container-Presenter** para separar la lógica de negocio de la presentación:

```
src/
├── api/                      # Configuración de Axios
│   └── axios.ts
├── components/               # Componentes reutilizables
│   ├── tasks/               # Componentes específicos de tareas
│   │   ├── TaskCard.tsx     # Tarjeta de tarea
│   │   └── TaskForm.tsx     # Formulario de tarea
│   └── ui/                  # Componentes UI base
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Select.tsx
│       └── Spinner.tsx
├── context/                  # Context API
│   └── AuthContext.tsx      # Contexto de autenticación
├── navigation/               # Configuración de navegación
│   └── AppNavigator.tsx     # Navegador principal
├── screens/                  # Pantallas (Container + Presenter)
│   ├── Login/
│   │   ├── LoginContainer.tsx
│   │   ├── LoginPresenter.tsx
│   │   └── index.tsx
│   ├── Register/
│   │   ├── RegisterContainer.tsx
│   │   ├── RegisterPresenter.tsx
│   │   └── index.tsx
│   └── Tasks/
│       ├── TasksContainer.tsx
│       ├── TasksPresenter.tsx
│       └── index.tsx
├── services/                 # Servicios de API
│   ├── authService.ts
│   └── taskService.ts
├── types/                    # Definiciones de TypeScript
│   └── index.ts
├── utils/                    # Utilidades
│   ├── constants.ts
│   ├── storage.ts
│   └── validators.ts
└── App.tsx                   # Componente raíz
```

## Características Principales

- Login y registro de usuarios
- Gestión completa de tareas (CRUD)
- Filtrado de tareas por estado
- Almacenamiento seguro de tokens con Expo Secure Store
- Manejo de autenticación con Context API
- Navegación protegida basada en autenticación
- Interceptores HTTP para manejo de tokens
- Validación de formularios
- Estados de carga y errores
- Pull to refresh en lista de tareas

## Requisitos Previos

- Node.js 18 o superior
- npm o yarn
- Expo CLI (se instalará automáticamente)
- Para Android: Android Studio y un dispositivo/emulador Android
- Para iOS: Xcode y un dispositivo/simulador iOS (solo macOS)
- Expo Go app en tu dispositivo móvil (opcional, para desarrollo rápido)

## Instalación

1. Navegar al directorio de la aplicación:
```bash
cd mobile-app
```

2. Instalar las dependencias:
```bash
npm install
```

3. Configurar la URL del backend (opcional):
Editar el archivo `src/utils/constants.ts` si tu backend no está en `http://localhost:3001`:
```typescript
export const API_BASE_URL = 'http://tu-backend-url:puerto/api';
```

**Nota importante**: La aplicación móvil no utiliza archivo `.env` para la configuración. La URL de la API debe configurarse directamente editando `src/utils/constants.ts`.

## Ejecución en Desarrollo

### Iniciar el servidor de desarrollo de Expo:
```bash
npm start
```

Esto abrirá Expo DevTools en tu navegador con un código QR.

### Opciones de ejecución:

#### 1. Usando Expo Go (Recomendado para desarrollo rápido)
- Descarga Expo Go desde la App Store (iOS) o Google Play Store (Android)
- Escanea el código QR con la app Expo Go (Android) o con la cámara (iOS)
- La app se cargará automáticamente

#### 2. Emulador/Simulador Android:
```bash
npm run android
```

Requisitos:
- Android Studio instalado
- Variables de entorno configuradas (ANDROID_HOME)
- Emulador Android en ejecución

#### 3. Simulador iOS (solo macOS):
```bash
npm run ios
```

Requisitos:
- Xcode instalado
- Simulador iOS configurado

#### 4. Web (experimental):
```bash
npm run web
```

## Docker

### Construcción de la imagen:
```bash
docker build -t mobile-app .
```

### Ejecución del contenedor:
```bash
docker run -p 8081:8081 -p 19000:19000 -p 19001:19001 -p 19002:19002 mobile-app
```

### Usando Docker Compose (desde la raíz del proyecto):

#### Para desarrollo:
```bash
docker-compose up mobile-app
```

#### Para producción:
```bash
docker-compose -f docker-compose.prod.yml up mobile-app
```

#### Para ejecutar tests:
```bash
docker-compose -f docker-compose.test.yml up mobile-app-test
```

### Puertos expuestos:
- **8081**: Metro Bundler
- **19000**: Expo DevTools
- **19001**: Expo CLI
- **19002**: Expo Web

**Nota**: El contenedor Docker ejecuta el servidor de desarrollo de Expo. Para conectarte desde un dispositivo físico, asegúrate de que:
1. El backend sea accesible desde la red local
2. Tu dispositivo esté en la misma red
3. La configuración `API_BASE_URL` use la IP de tu máquina, no localhost

## Configuración del Backend

Para que la aplicación móvil funcione correctamente:

1. Asegúrate de que el backend esté ejecutándose en `http://localhost:3001`
2. Si usas un dispositivo físico, necesitarás usar la IP de tu máquina en lugar de localhost
3. Actualiza `API_BASE_URL` en `src/utils/constants.ts` según corresponda

Ejemplo para desarrollo con dispositivo físico:
```typescript
export const API_BASE_URL = 'http://192.168.1.100:3001/api';
```

## Scripts Disponibles

- `npm start`: Inicia el servidor de desarrollo de Expo
- `npm run android`: Ejecuta la app en Android
- `npm run ios`: Ejecuta la app en iOS
- `npm run web`: Ejecuta la app en el navegador (experimental)
- `npm test`: Ejecuta los tests en modo watch
- `npm run testFinal`: Ejecuta los tests una vez (usado en CI/CD)

## Tests Unitarios

La aplicación incluye tests unitarios para componentes y servicios:

### Ejecutar tests:
```bash
npm test
```

### Ejecutar tests sin watch (CI/CD):
```bash
npm run testFinal
```

### Ver cobertura:
```bash
npm test -- --coverage
```

### Ejecutar tests en Docker:
```bash
docker-compose -f docker-compose.test.yml up mobile-app-test
```

Los tests incluyen:
- Tests de componentes UI (Button, Card, Input, etc.)
- Tests de componentes de tareas (TaskCard, TaskForm)
- Cobertura de código configurada

## Estructura de Datos

### Usuario (User)
```typescript
interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
```

### Tarea (Task)
```typescript
interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pendiente' | 'en progreso' | 'completada';
  userId: number;
  createdAt: string;
  updatedAt: string;
}
```

## Manejo de Estados

- **Autenticación**: Context API con Expo Secure Store
- **Estado de tareas**: State local en containers con hooks
- **Navegación**: React Navigation con protección de rutas

## Seguridad

- Tokens JWT almacenados de forma segura con Expo Secure Store
- Interceptores de Axios para añadir tokens automáticamente
- Manejo de sesión expirada con redirección automática al login
- Validación de formularios en el cliente

## Patrón Container-Presenter

### Container
- Maneja la lógica de negocio
- Gestiona el estado
- Realiza llamadas a servicios
- Pasa datos y funciones al Presenter

### Presenter
- Solo recibe props
- Renderiza la UI
- No contiene lógica de negocio
- Componentes puros y reutilizables

## Componentes UI

Todos los componentes UI están adaptados de TailwindCSS a StyleSheet de React Native:

- **Button**: Botón con variantes (primary, secondary, danger, success)
- **Input**: Campo de texto con label, error y helper text
- **Card**: Contenedor con sombra y bordes redondeados
- **Badge**: Etiqueta de estado con colores personalizados
- **Modal**: Modal responsive con overlay
- **Select**: Selector de opciones con Picker nativo
- **Spinner**: Indicador de carga

## Troubleshooting

### Error: "Unable to resolve module"
```bash
npm install
npx expo start -c
```

### Error de conexión al backend
- Verifica que el backend esté ejecutándose
- Si usas dispositivo físico, usa la IP de tu máquina en lugar de localhost
- Verifica que el firewall permita las conexiones

### Error en Android: SDK no encontrado
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Limpiar caché
```bash
npx expo start -c
```

## Notas Importantes

- La aplicación usa `expo-secure-store` que solo funciona en dispositivos nativos (no en web)
- Para desarrollo web, considera usar AsyncStorage como fallback
- El backend debe tener CORS configurado para permitir peticiones desde la app móvil
- Para producción, asegúrate de configurar correctamente la URL del backend

## Licencia

Este proyecto es parte de una prueba técnica.
