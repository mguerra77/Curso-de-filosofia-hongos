# Sistema de Curso de Hongos - Conexión Backend/Frontend

Este es un sistema completo que conecta el backend (Flask) con el frontend (React) para gestionar usuarios y acceso al curso de hongos.

## 🚀 Estado Actual del Sistema

### ✅ Funcionalidades Implementadas

1. **Registro de Usuarios**: Los usuarios pueden crear cuentas nuevas
2. **Login/Logout**: Sistema de autenticación con JWT
3. **Verificación de Acceso**: Control de acceso al contenido del curso
4. **Panel de Administración**: Gestión manual de usuarios por parte de admins
5. **Protección de Rutas**: Solo usuarios autenticados pueden acceder al curso

### ⚠️ Funcionalidad Temporalmente Deshabilitada

- **Subida de Comprobantes**: Por ahora los usuarios deben enviar emails manuales al administrador para solicitar acceso

## 🔧 Configuración y Ejecución

### Backend (Puerto 5000)
```bash
cd backend
# El entorno virtual ya está configurado
python app.py
```

### Frontend (Puerto 5173)
```bash
cd frontend
npm run dev
```

## 👥 Usuarios de Prueba

### Usuario Administrador (ya creado)
- **Email**: admin@cursohongos.com
- **Contraseña**: admin123
- **Acceso**: Panel de administración en `/admin`

## 🌐 Flujo de Trabajo Actual

### Para Usuarios Nuevos:
1. Ir a http://localhost:5174 (o puerto disponible)
2. Hacer clic en "📚 Mi Curso" o "🔑 Iniciar Sesión"
3. Cambiar a "Crear Cuenta" en el formulario de login
4. Completar el formulario de registro
5. **Enviar email manual** al administrador solicitando acceso
6. Esperar a que el admin active la cuenta

### Para Usuarios sin Acceso:
1. Hacer login con sus credenciales
2. Serán redirigidos a la **página principal** (no al curso)
3. Si intentan acceder a "📚 Mi Curso", verán la **página de acceso restringido**
4. Desde ahí pueden ir directamente a **comprar el curso** (`/checkout`)

### Para Administradores:
1. Hacer login con las credenciales de admin
2. **El botón "🔧 Admin" aparece automáticamente** en el header
3. Ir a `/admin` para gestionar usuarios
4. Ver lista completa de usuarios con estado de acceso
5. **Activar usuarios** y **dar acceso al curso** con botones específicos
6. Los cambios se aplican inmediatamente

### Para Usuarios con Acceso:
1. Hacer login normalmente
2. Serán redirigidos automáticamente a `/course`
3. Pueden ver todo el contenido del curso
4. Botón "🚪 Cerrar Sesión" disponible en el header

## 🔗 Endpoints de la API

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil
- `GET /api/auth/check-course-access` - Verificar acceso al curso

### Administración (solo admins)
- `GET /api/auth/users` - Listar todos los usuarios
- `POST /api/auth/admin/activate-user` - Activar usuario
- `POST /api/auth/admin/deactivate-user` - Desactivar usuario
- `POST /api/auth/admin/grant-access` - Dar acceso al curso
- `POST /api/auth/admin/revoke-access` - Quitar acceso al curso

### Pagos (temporalmente deshabilitado)
- `POST /api/payments/create-transfer` - Retorna error 503

## 📱 Páginas Disponibles

- `/` - Página principal con botones dinámicos según estado de autenticación
- `/login` - Login/Registro
- `/course` - Contenido del curso (requiere acceso, redirige a `/restricted` si no tiene acceso)
- `/restricted` - Página de acceso restringido con CTA para comprar el curso
- `/admin` - Panel de administración (solo admins autenticados)
- `/checkout` - Página de pago mejorada

## 🔧 Nuevas Funcionalidades UI

### Header Dinámico:
- **📚 Mi Curso**: Siempre visible, lleva al curso o a página de acceso restringido
- **🔧 Admin**: Solo visible para usuarios admin autenticados
- **🔑 Iniciar Sesión**: Para usuarios no autenticados
- **🚪 Cerrar Sesión**: Para usuarios autenticados (reemplaza "Mi Cuenta")

### Flujo de Acceso Inteligente:
- **Login exitoso con acceso** → Redirige a `/course`
- **Login exitoso sin acceso** → Redirige a `/` (página principal)
- **Intento de acceder a "Mi Curso" sin acceso** → Redirige a `/restricted`

### Página de Acceso Restringido (`/restricted`):
- Mensaje personalizado con nombre del usuario
- Lista de beneficios del curso
- Botón principal para ir a `/checkout`
- Botón para volver al inicio
- Información sobre proceso manual de habilitación

## 🛡️ Seguridad

- Autenticación JWT con tokens que expiran en 24 horas
- Verificación de permisos en cada endpoint protegido
- Validación de roles (admin vs usuario regular)
- CORS configurado para desarrollo

## 📝 Próximos Pasos Sugeridos

1. **Conectar sistema de pagos** cuando esté listo
2. **Envío de emails automático** para notificaciones
3. **Recuperación de contraseña**
4. **Mejorar la UI/UX** del panel de admin
5. **Agregar logs** de actividad

## 🐛 Para Debugging

- Backend logs: Ver terminal donde corre `python app.py`
- Frontend: Abrir Developer Tools en el navegador
- Base de datos: Archivo SQLite en `backend/data/curso_hongos.db`
- Archivos subidos: Carpeta `backend/uploads/`

---

**¡El sistema está funcionando y listo para usar!** 🎉

Para cualquier problema, verificar que ambos servidores estén ejecutándose y que no haya conflictos de puertos.
