# 🚀 Backend - API REST de Bodegas

API REST con Node.js, Express y SQL Server para el CRUD de Bodegas.

## 📦 Iniciar el Servidor

```powershell
# Desarrollo (con recarga automática)
npm run dev

# Producción
npm start
```

El servidor estará disponible en: **http://localhost:3000**

---

## 🔗 Endpoints Disponibles

### **Base URL:** `http://localhost:3000/api/bodegas`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/bodegas` | Listar todas las bodegas activas |
| GET | `/api/bodegas/:id` | Obtener una bodega por ID |
| POST | `/api/bodegas` | Crear nueva bodega |
| PUT | `/api/bodegas/:id` | Actualizar bodega existente |
| DELETE | `/api/bodegas/:id` | Eliminar bodega (soft delete) |

---

## 📋 Ejemplos para Postman

### 1️⃣ **GET** - Listar todas las bodegas

```
GET http://localhost:3000/api/bodegas
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "IDBODEGA": "BOD01",
      "NOMBRE": "Bodega Central",
      "DIRECCION": "Av. Principal #123",
      "TELEFONOS": "555-1234",
      "FAX": "555-5678",
      "RESPONSABLE": "Juan Pérez",
      "VENDIBLE": "S",
      "ESTADO": "A"
    }
  ],
  "message": "Bodegas obtenidas exitosamente"
}
```

---

### 2️⃣ **GET** - Obtener bodega por ID

```
GET http://localhost:3000/api/bodegas/BOD01
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "IDBODEGA": "BOD01",
    "NOMBRE": "Bodega Central",
    "DIRECCION": "Av. Principal #123",
    "TELEFONOS": "555-1234",
    "FAX": "555-5678",
    "RESPONSABLE": "Juan Pérez",
    "TIPO": "P",
    "SERIE_DOCUMENTOS": "A",
    "VENDIBLE": "S",
    "ESTADO": "A"
  },
  "message": "Bodega obtenida exitosamente"
}
```

---

### 3️⃣ **POST** - Crear nueva bodega

```
POST http://localhost:3000/api/bodegas
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "idBodega": "BOD01",
  "nombre": "Bodega Central",
  "direccion": "Av. Principal #123",
  "telefonos": "555-1234",
  "fax": "555-5678",
  "responsable": "Juan Pérez",
  "idUsuarioCrea": "ADMIN",
  "tipo": "P",
  "serieDocumentos": "A",
  "vendible": "S"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "Mensaje": "Bodega creada exitosamente.",
    "IdBodega": "BOD01",
    "FechaCreacion": "2026-02-05T..."
  },
  "message": "Bodega creada exitosamente"
}
```

---

### 4️⃣ **PUT** - Actualizar bodega

```
PUT http://localhost:3000/api/bodegas/BOD01
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "nombre": "Bodega Central Actualizada",
  "direccion": "Nueva Dirección #456",
  "telefonos": "555-9999",
  "fax": "555-8888",
  "responsable": "María López",
  "idUsuarioModi": "ADMIN",
  "tipo": "P",
  "serieDocumentos": "B",
  "vendible": "S",
  "estado": "A"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "Mensaje": "Bodega actualizada exitosamente.",
    "IdBodega": "BOD01",
    "FechaModificacion": "2026-02-05T..."
  },
  "message": "Bodega actualizada exitosamente"
}
```

---

### 5️⃣ **DELETE** - Eliminar bodega (soft delete)

```
DELETE http://localhost:3000/api/bodegas/BOD01
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "idUsuarioModi": "ADMIN"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "Mensaje": "Bodega eliminada (inactivada) exitosamente.",
    "IdBodega": "BOD01",
    "FechaEliminacion": "2026-02-05T..."
  },
  "message": "Bodega eliminada exitosamente"
}
```

---

## ⚠️ Notas Importantes

### **Límite de caracteres:**
- `idBodega`: **Máximo 5 caracteres** (nvarchar(5))
- Ejemplo: ✅ `"BOD01"` | ❌ `"BOD001"` (6 caracteres - error)

### **Campos obligatorios (POST):**
- `idBodega`
- `nombre`
- `direccion`
- `telefonos`
- `fax`
- `responsable`
- `idUsuarioCrea`
- `tipo`
- `serieDocumentos`
- `vendible`

### **Valores permitidos:**
- `vendible`: `"S"` (Sí) o `"N"` (No)
- `estado`: `"A"` (Activo) o `"I"` (Inactivo)

---

## 🧪 Prueba Rápida en PowerShell

```powershell
# Listar bodegas
curl http://localhost:3000/api/bodegas

# Crear bodega (Windows PowerShell)
$body = @{
    idBodega = "TEST1"
    nombre = "Bodega de Prueba"
    direccion = "Calle Falsa 123"
    telefonos = "555-0000"
    fax = "555-0001"
    responsable = "Test User"
    idUsuarioCrea = "ADMIN"
    tipo = "P"
    serieDocumentos = "A"
    vendible = "S"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:3000/api/bodegas -Method POST -Body $body -ContentType "application/json"
```

---

## 📂 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          ← Conexión SQL Server
│   ├── routes/
│   │   └── bodega.routes.js     ← Rutas REST
│   ├── controllers/
│   │   └── bodega.controller.js ← Lógica de negocio
│   ├── services/
│   │   └── bodega.service.js    ← Acceso a datos (SP)
│   └── app.js                   ← Configuración Express
├── .env                         ← Credenciales (NO subir a Git)
├── .env.example                 ← Plantilla sin credenciales
├── package.json
└── server.js                    ← Punto de entrada
```

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to SQL Server"
1. Verifica que el servidor SQL esté corriendo
2. Revisa las credenciales en `.env`
3. Verifica el firewall (puerto 1433)

### Error: "Port 3000 already in use"
```powershell
# Ver qué proceso usa el puerto 3000
netstat -ano | findstr :3000

# Matar el proceso (usa el PID del comando anterior)
taskkill /PID <numero> /F

# O cambia el puerto en .env
PORT=3001
```

### Error: "Module not found"
```powershell
npm install
```
