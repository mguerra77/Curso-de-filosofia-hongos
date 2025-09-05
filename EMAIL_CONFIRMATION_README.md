# Sistema de Confirmación de Email - Curso de Hongos

## Resumen de Funcionalidades Implementadas

Se ha implementado un sistema minimalista de confirmación de usuarios vía email con las siguientes características:

### Backend (Flask)

#### Nuevas Dependencias
- `flask-mail==0.9.1` - Para envío de emails

#### Cambios en el Modelo de Datos
- `email_confirmed`: Campo booleano para indicar si el email fue confirmado
- `email_confirmation_token`: Token único para confirmar el email

#### Nuevas Rutas API
- `POST /api/auth/confirm-email` - Confirma el email usando un token
- `POST /api/auth/resend-confirmation` - Reenvía el email de confirmación

#### Configuración de Email
El sistema está configurado para enviar emails desde `espaciothaumazein@gmail.com` usando Gmail SMTP.

### Frontend (React)

#### Nueva Página
- `EmailConfirmationPage` - Página para confirmar email y reenviar confirmaciones

#### Flujo de Usuario Actualizado
1. **Registro**: Después de registrarse, el usuario es redirigido a la página de confirmación
2. **Email enviado**: Se envía automáticamente un email con un enlace de confirmación
3. **Confirmación**: Al hacer clic en el enlace, el email se confirma automáticamente
4. **Reenvío**: Si no recibe el email, puede solicitar que se reenvíe

## Instalación y Configuración

### 1. Instalar Dependencias del Backend

```bash
cd backend
pip install flask-mail
```

### 2. Migración de Base de Datos

```bash
cd backend
python migrate_email_confirmation.py
```

### 3. Configuración de Email

El archivo `.env` ya está configurado con el email `espaciothaumazein@gmail.com`. Para cambiar la configuración:

```env
MAIL_USERNAME=espaciothaumazein@gmail.com
MAIL_PASSWORD=tu_app_password_aqui
MAIL_DEFAULT_SENDER=espaciothaumazein@gmail.com
```

**Importante**: Para Gmail, necesitas usar una "App Password" en lugar de tu contraseña regular.

### 4. Ejecutar la Aplicación

#### Backend
```bash
cd backend
python app.py
```

#### Frontend
```bash
cd frontend
npm run dev
```

## Flujo de Confirmación de Email

### 1. Registro de Usuario
```
Usuario completa formulario → POST /api/auth/register → 
↓
Se crea usuario con email_confirmed=False →
↓
Se genera token único → Se envía email → Usuario redirigido a /confirm-email
```

### 2. Confirmación de Email
```
Usuario hace clic en enlace del email → GET /confirm-email?token=ABC123 →
↓
Frontend llama POST /api/auth/confirm-email → Backend confirma email →
↓
email_confirmed=True → Usuario redirigido a login
```

### 3. Reenvío de Confirmación
```
Usuario no recibe email → Ingresa email en formulario →
↓
POST /api/auth/resend-confirmation → Se genera nuevo token →
↓
Se envía nuevo email de confirmación
```

## Estructura del Email de Confirmación

El email incluye:
- Saludo personalizado con el nombre del usuario
- Botón de confirmación con enlace directo
- URL de confirmación como texto (para casos donde el botón no funcione)
- Diseño responsive y profesional
- Información del remitente (Espacio Thaumazein)

## Endpoints de la API

### Confirmar Email
```http
POST /api/auth/confirm-email
Content-Type: application/json

{
  "token": "abc123def456..."
}
```

### Reenviar Confirmación
```http
POST /api/auth/resend-confirmation
Content-Type: application/json

{
  "email": "usuario@ejemplo.com"
}
```

## Seguridad

- Los tokens de confirmación son únicos y se generan usando `secrets.token_urlsafe(32)`
- Los tokens se eliminan de la base de datos después de ser usados
- Solo se pueden confirmar emails que tengan un token válido
- No se revela información sobre usuarios inexistentes

## Notas de Implementación

- **Minimalista**: Se implementó solo lo esencial para la confirmación de email
- **Sin expiración**: Los tokens no expiran (se puede agregar si es necesario)
- **Error handling**: Manejo robusto de errores tanto en backend como frontend
- **UX friendly**: Interfaz clara y mensajes informativos para el usuario
- **Responsive**: La página de confirmación es completamente responsive

## Próximos Pasos Opcionales

1. **Expiración de tokens**: Agregar campo `token_expires_at` para mayor seguridad
2. **Rate limiting**: Limitar la cantidad de emails de confirmación por hora
3. **Templates de email**: Usar templates más sofisticados con Jinja2
4. **Confirmación en login**: Verificar que el email esté confirmado antes de permitir login
5. **Notificaciones**: Agregar notificaciones toast en lugar de alerts
