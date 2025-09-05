# Sistema de Roles y Acceso - Curso de Hongos

## Cambios Implementados

### ✅ **1. Modelo de Usuario Actualizado**

Se agregaron los siguientes campos al modelo `Usuario`:

- **`rol`**: Puede ser `"user"` o `"admin"` (por defecto: `"user"`)
- **`has_access`**: Boolean que indica si tiene acceso al contenido del curso (por defecto: `False`)

### ✅ **2. Nuevas Rutas de Administración**

Todas requieren rol de **admin** y token JWT válido:

#### **Gestión de Usuarios:**
- `POST /api/auth/admin/activate-user` - Activar usuario y dar acceso al curso
- `POST /api/auth/admin/deactivate-user` - Desactivar usuario 
- `GET /api/auth/users` - Listar todos los usuarios

#### **Gestión de Acceso al Curso:**
- `POST /api/auth/admin/grant-access` - Otorgar acceso al curso
- `POST /api/auth/admin/revoke-access` - Revocar acceso al curso

#### **Verificación de Acceso:**
- `GET /api/auth/check-course-access` - Verificar si usuario tiene acceso al curso

### ✅ **3. Seguridad Implementada**

- **Verificación de rol admin**: Solo usuarios con rol `"admin"` pueden acceder a rutas administrativas
- **Verificación JWT**: Todas las rutas requieren token válido
- **Control de acceso al curso**: Campo `has_access` controla acceso al contenido

## Configuración Inicial

### 1. **Instalar Dependencias**
```bash
cd backend
pip install -r requirements.txt
```

### 2. **Crear Usuario Administrador**
```bash
python3 create_admin.py
```

**Datos por defecto del admin:**
- Email: `admin@cursohongos.com`
- Password: `admin123`
- ⚠️ **CAMBIAR la contraseña después del primer login**

### 3. **Iniciar el Servidor**
```bash
python3 app.py
```

## Uso de las APIs

### **Autenticación Admin**
```bash
# Login como admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@cursohongos.com", "password": "admin123"}'

# Respuesta incluye el token JWT
```

### **Gestión de Usuarios (Solo Admin)**
```bash
# Listar usuarios
curl -X GET http://localhost:5000/api/auth/users \
  -H "Authorization: Bearer <TOKEN_JWT>"

# Activar usuario y dar acceso al curso
curl -X POST http://localhost:5000/api/auth/admin/activate-user \
  -H "Authorization: Bearer <TOKEN_JWT>" \
  -H "Content-Type: application/json" \
  -d '{"user_id": 2}'

# Solo otorgar acceso al curso (sin activar)
curl -X POST http://localhost:5000/api/auth/admin/grant-access \
  -H "Authorization: Bearer <TOKEN_JWT>" \
  -H "Content-Type: application/json" \
  -d '{"user_id": 2}'
```

### **Verificación de Acceso (Usuario)**
```bash
# Verificar si tiene acceso al curso
curl -X GET http://localhost:5000/api/auth/check-course-access \
  -H "Authorization: Bearer <TOKEN_USER>"
```

### **Gestión de Comprobantes (Solo Admin)**
```bash
# Listar comprobantes subidos
curl -X GET http://localhost:5000/api/payments/list-comprobantes \
  -H "Authorization: Bearer <TOKEN_ADMIN>"
```

## Estados de Usuario

| Campo | Descripción |
|-------|-------------|
| `activo: true` | Usuario puede hacer login |
| `activo: false` | Usuario no puede hacer login |
| `has_access: true` | Puede acceder al contenido del curso |
| `has_access: false` | No puede acceder al contenido del curso |
| `rol: "admin"` | Puede gestionar usuarios y accesos |
| `rol: "user"` | Usuario normal |

## Flujo de Trabajo

1. **Usuario se registra** → `activo: true, has_access: false, rol: "user"`
2. **Usuario sube comprobante de pago** → Archivo guardado en `/uploads/`
3. **Admin revisa comprobante** → Puede ver lista en `/list-comprobantes`
4. **Admin otorga acceso** → Cambia `has_access: true` del usuario
5. **Usuario accede al curso** → Frontend verifica `/check-course-access`

## Seguridad

- ✅ Solo admins pueden activar/desactivar usuarios
- ✅ Solo admins pueden otorgar/revocar acceso al curso  
- ✅ Solo admins pueden ver lista de comprobantes
- ✅ Los admins no pueden desactivarse a sí mismos
- ✅ Todas las rutas administrativas requieren token JWT válido
- ✅ Verificación de rol en cada operación administrativa

## Frontend Integration

En el frontend, usar la ruta `/check-course-access` para verificar si mostrar el contenido del curso:

```javascript
// Verificar acceso antes de mostrar contenido del curso
const checkAccess = async () => {
  const response = await fetch('/api/auth/check-course-access', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  
  if (data.has_access) {
    // Mostrar contenido del curso
  } else {
    // Mostrar mensaje "Pendiente de aprobación de pago"
  }
};
```
