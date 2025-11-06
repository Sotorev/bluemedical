# Ejemplos de uso de la API

Ejemplos prácticos para interactuar con la API del Gestor de Tareas.

## Herramientas

Puedes usar cualquiera de estas herramientas:
- **cURL** (incluido en la mayoría de sistemas)
- **Postman** (interfaz gráfica)
- **HTTPie** (más amigable que cURL)
- **Insomnia** (interfaz gráfica)

---

## 1. Autenticación

### Registrar un nuevo usuario

**cURL:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuevo@example.com",
    "password": "password123",
    "name": "Nuevo Usuario"
  }'
```

**HTTPie:**
```bash
http POST http://localhost:3001/api/auth/register \
  email=nuevo@example.com \
  password=password123 \
  name="Nuevo Usuario"
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"nuevo@example.com","password":"password123","name":"Nuevo Usuario"}'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": 1,
      "email": "nuevo@example.com",
      "name": "Nuevo Usuario",
      "createdAt": "2025-11-04T00:00:00.000Z",
      "updatedAt": "2025-11-04T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Iniciar sesión

**cURL:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuevo@example.com",
    "password": "password123"
  }'
```

**HTTPie:**
```bash
http POST http://localhost:3001/api/auth/login \
  email=nuevo@example.com \
  password=password123
```

**PowerShell:**
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"nuevo@example.com","password":"password123"}'

# Guardar el token para usarlo después
$token = $response.data.token
echo $token
```

💡 **Importante:** Guarda el token que recibes, lo necesitarás para las siguientes peticiones.

---

## 2. Tareas (requieren autenticación)

### Variables de entorno (Linux/Mac)
```bash
# Guardar el token en una variable
export TOKEN="tu_token_aqui"

# O usar el token directamente del login
export TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nuevo@example.com","password":"password123"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)
```

### Variables de entorno (Windows PowerShell)
```powershell
# Guardar el token en una variable
$token = "tu_token_aqui"

# O usar el token directamente del login
$response = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"nuevo@example.com","password":"password123"}'
$token = $response.data.token
```

### Crear una tarea

**cURL:**
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Completar documentación",
    "description": "Escribir la documentación completa del proyecto",
    "status": "pendiente"
  }'
```

**HTTPie:**
```bash
http POST http://localhost:3001/api/tasks \
  Authorization:"Bearer $TOKEN" \
  title="Completar documentación" \
  description="Escribir la documentación completa del proyecto" \
  status=pendiente
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/tasks" `
  -Method POST `
  -Headers @{Authorization="Bearer $token"} `
  -ContentType "application/json" `
  -Body '{"title":"Completar documentación","description":"Escribir la documentación completa del proyecto","status":"pendiente"}'
```

### Obtener todas las tareas

**cURL:**
```bash
curl -X GET http://localhost:3001/api/tasks \
  -H "Authorization: Bearer $TOKEN"
```

**HTTPie:**
```bash
http GET http://localhost:3001/api/tasks \
  Authorization:"Bearer $TOKEN"
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/tasks" `
  -Method GET `
  -Headers @{Authorization="Bearer $token"}
```

### Filtrar tareas por estado

**cURL:**
```bash
# Tareas pendientes
curl -X GET "http://localhost:3001/api/tasks?status=pendiente" \
  -H "Authorization: Bearer $TOKEN"

# Tareas en progreso
curl -X GET "http://localhost:3001/api/tasks?status=en%20progreso" \
  -H "Authorization: Bearer $TOKEN"

# Tareas completadas
curl -X GET "http://localhost:3001/api/tasks?status=completada" \
  -H "Authorization: Bearer $TOKEN"
```

**HTTPie:**
```bash
# Tareas pendientes
http GET "http://localhost:3001/api/tasks?status=pendiente" \
  Authorization:"Bearer $TOKEN"

# Tareas en progreso
http GET "http://localhost:3001/api/tasks?status=en progreso" \
  Authorization:"Bearer $TOKEN"

# Tareas completadas
http GET "http://localhost:3001/api/tasks?status=completada" \
  Authorization:"Bearer $TOKEN"
```

**PowerShell:**
```powershell
# Tareas pendientes
Invoke-RestMethod -Uri "http://localhost:3001/api/tasks?status=pendiente" `
  -Method GET `
  -Headers @{Authorization="Bearer $token"}

# Tareas en progreso
Invoke-RestMethod -Uri "http://localhost:3001/api/tasks?status=en%20progreso" `
  -Method GET `
  -Headers @{Authorization="Bearer $token"}

# Tareas completadas
Invoke-RestMethod -Uri "http://localhost:3001/api/tasks?status=completada" `
  -Method GET `
  -Headers @{Authorization="Bearer $token"}
```

### Obtener una tarea específica

**cURL:**
```bash
curl -X GET http://localhost:3001/api/tasks/1 \
  -H "Authorization: Bearer $TOKEN"
```

**HTTPie:**
```bash
http GET http://localhost:3001/api/tasks/1 \
  Authorization:"Bearer $TOKEN"
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/tasks/1" `
  -Method GET `
  -Headers @{Authorization="Bearer $token"}
```

### Actualizar una tarea

**cURL:**
```bash
curl -X PUT http://localhost:3001/api/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Documentación actualizada",
    "description": "Documentación completa y revisada",
    "status": "completada"
  }'
```

**HTTPie:**
```bash
http PUT http://localhost:3001/api/tasks/1 \
  Authorization:"Bearer $TOKEN" \
  title="Documentación actualizada" \
  description="Documentación completa y revisada" \
  status=completada
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/tasks/1" `
  -Method PUT `
  -Headers @{Authorization="Bearer $token"} `
  -ContentType "application/json" `
  -Body '{"title":"Documentación actualizada","description":"Documentación completa y revisada","status":"completada"}'
```

### Actualización parcial (solo un campo)

**cURL:**
```bash
# Solo actualizar el estado
curl -X PUT http://localhost:3001/api/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status": "en progreso"}'
```

**HTTPie:**
```bash
http PUT http://localhost:3001/api/tasks/1 \
  Authorization:"Bearer $TOKEN" \
  status="en progreso"
```

### Eliminar una tarea

**cURL:**
```bash
curl -X DELETE http://localhost:3001/api/tasks/1 \
  -H "Authorization: Bearer $TOKEN"
```

**HTTPie:**
```bash
http DELETE http://localhost:3001/api/tasks/1 \
  Authorization:"Bearer $TOKEN"
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/tasks/1" `
  -Method DELETE `
  -Headers @{Authorization="Bearer $token"}
```

---

## 3. Health Check

```bash
# cURL
curl http://localhost:3001/api/health

# HTTPie
http GET http://localhost:3001/api/health

# PowerShell
Invoke-RestMethod -Uri "http://localhost:3001/api/health"
```

---

## 4. Estados válidos de tareas

- `pendiente` - Tarea pendiente de iniciar
- `en progreso` - Tarea en progreso
- `completada` - Tarea completada

---

## 5. Códigos de respuesta HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Petición exitosa |
| 201 | Created - Recurso creado exitosamente |
| 400 | Bad Request - Error de validación |
| 401 | Unauthorized - Token inválido o no proporcionado |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error del servidor |

---

## 6. Script completo de ejemplo (Bash)

```bash
#!/bin/bash

API_URL="http://localhost:3001/api"

# 1. Registrar usuario
echo "1. Registrando usuario..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }')

echo "$REGISTER_RESPONSE" | jq .

# 2. Extraer token
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.data.token')
echo "Token obtenido: $TOKEN"

# 3. Crear tarea
echo -e "\n2. Creando tarea..."
curl -s -X POST "$API_URL/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Mi primera tarea",
    "description": "Esta es mi primera tarea de prueba",
    "status": "pendiente"
  }' | jq .

# 4. Listar tareas
echo -e "\n3. Listando tareas..."
curl -s -X GET "$API_URL/tasks" \
  -H "Authorization: Bearer $TOKEN" | jq .

# 5. Actualizar tarea
echo -e "\n4. Actualizando tarea..."
curl -s -X PUT "$API_URL/tasks/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status": "completada"}' | jq .

echo -e "\n¡Script completado!"
```

---

## 7. Script completo de ejemplo (PowerShell)

```powershell
$API_URL = "http://localhost:3001/api"

# 1. Registrar usuario
Write-Host "1. Registrando usuario..." -ForegroundColor Green
$registerResponse = Invoke-RestMethod -Uri "$API_URL/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"test@example.com","password":"password123","name":"Test User"}'

$registerResponse | ConvertTo-Json

# 2. Obtener token
$token = $registerResponse.data.token
Write-Host "Token obtenido: $token" -ForegroundColor Yellow

# 3. Crear tarea
Write-Host "`n2. Creando tarea..." -ForegroundColor Green
$taskResponse = Invoke-RestMethod -Uri "$API_URL/tasks" `
  -Method POST `
  -Headers @{Authorization="Bearer $token"} `
  -ContentType "application/json" `
  -Body '{"title":"Mi primera tarea","description":"Esta es mi primera tarea de prueba","status":"pendiente"}'

$taskResponse | ConvertTo-Json

# 4. Listar tareas
Write-Host "`n3. Listando tareas..." -ForegroundColor Green
$tasksResponse = Invoke-RestMethod -Uri "$API_URL/tasks" `
  -Method GET `
  -Headers @{Authorization="Bearer $token"}

$tasksResponse | ConvertTo-Json

# 5. Actualizar tarea
Write-Host "`n4. Actualizando tarea..." -ForegroundColor Green
$updateResponse = Invoke-RestMethod -Uri "$API_URL/tasks/1" `
  -Method PUT `
  -Headers @{Authorization="Bearer $token"} `
  -ContentType "application/json" `
  -Body '{"status":"completada"}'

$updateResponse | ConvertTo-Json

Write-Host "`n¡Script completado!" -ForegroundColor Cyan
```

---

## 8. Postman Collection

Para importar en Postman, crea una nueva colección con estas peticiones o descarga el archivo JSON:

[Ver ejemplo de colección Postman](https://www.postman.com/downloads/)

---

## 💡 Consejos

1. **Guarda el token**: Después del login, guarda el token en una variable de entorno
2. **Token expira**: Los tokens JWT tienen una duración de 24 horas por defecto
3. **Usa jq**: Si usas cURL, instala `jq` para formatear las respuestas JSON
4. **Variables de Postman**: En Postman, usa variables para el token y URL base
5. **Valida antes**: Revisa los errores de validación en el campo `errors` de la respuesta

---

¡Listo para probar la API! 🚀

