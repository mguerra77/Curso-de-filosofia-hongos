# 🚀 Guía de Despliegue - Curso de Filosofía de los Hongos

## � Despliegue con Docker (RECOMENDADO)

### �📋 Requisitos del Servidor
- **Docker:** 20.10+
- **Docker Compose:** 2.0+
- **RAM:** 2-4 GB mínimo
- **Storage:** 10-20 GB (sin videos, con Drive)

### 🚀 Instalación Ultra-Rápida

```bash
# 1. Clonar repositorio
git clone [URL-DEL-REPOSITORIO]
cd curso-hongos

# 2. Configurar variables de entorno
cp .env.docker .env
nano .env  # Editar con valores reales

# 3. Levantar toda la aplicación
docker-compose up -d

# 4. Verificar que todo funcione
docker-compose logs -f
```

### 🔧 Configuración de Variables (.env)

**⚠️ OBLIGATORIO: Editar estos valores en .env**

```bash
# Base de datos (cambiar password)
DB_PASSWORD=tu_password_super_seguro

# Seguridad (generar claves únicas)
SECRET_KEY=clave-secreta-de-32-caracteres-minimo
JWT_SECRET_KEY=otra-clave-jwt-diferente-y-segura

# Email (CRÍTICO para funcionamiento)
MAIL_USERNAME=espaciothaumazein@gmail.com
MAIL_PASSWORD=[SOLICITAR A MARTIN]
MAIL_DEFAULT_SENDER=espaciothaumazein@gmail.com

# Mercado Pago (opcional)
MP_ACCESS_TOKEN=tu_access_token
MP_PUBLIC_KEY=tu_public_key

# URLs de producción
MP_SUCCESS_URL=https://tu-dominio.com/payment-success
MP_FAILURE_URL=https://tu-dominio.com/payment-failure
MP_PENDING_URL=https://tu-dominio.com/payment-pending
```

### 🎯 Verificación del Despliegue

```bash
# Ver estado de contenedores
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Acceder a la aplicación
curl http://localhost        # Frontend
curl http://localhost/api/health  # Backend API
```

### 🔑 Acceso Inicial

**Usuario Administrador (creado automáticamente):**
- **URL:** http://tu-dominio.com/admin
- **Email:** admin@cursohongos.com
- **Contraseña:** admin123

**⚠️ CAMBIAR CONTRASEÑA inmediatamente después del primer login**

### 📊 Comandos Útiles

```bash
# Reiniciar aplicación
docker-compose restart

# Ver logs de un servicio específico
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db

# Backup de base de datos
docker-compose exec db pg_dump -U curso_user curso_hongos > backup_$(date +%Y%m%d).sql

# Restaurar backup
docker-compose exec -T db psql -U curso_user curso_hongos < backup_20250101.sql

# Acceder al contenedor backend
docker-compose exec backend bash

# Parar todo
docker-compose down

# Parar y eliminar volúmenes (CUIDADO: borra datos)
docker-compose down -v
```

### 🌐 Configuración de Dominio

Si tienes un dominio, edita el `docker-compose.yml`:

```yaml
frontend:
  ports:
    - "80:80"
    - "443:443"  # Para HTTPS
```

---

## 📦 Despliegue Manual (Alternativo)

<details>
<summary>Click para ver instrucciones manuales</summary>

### 📋 Requisitos del Servidor
- **Sistema:** Ubuntu/Debian 20.04+
- **Python:** 3.8+
- **Node.js:** 18+
- **PostgreSQL:** 12+

[... resto de instrucciones manuales ...]

</details>

---

## 🆘 Soporte

**Desarrollador:** Martín Guerra
**Email:** martinge777@gmail.com

### 🐛 Problemas Comunes

**Error de conexión a base de datos:**
```bash
docker-compose logs db
# Verificar que PostgreSQL esté corriendo
```

**Error de permisos:**
```bash
sudo chown -R $USER:$USER .
```

**Error de puertos ocupados:**
```bash
# Cambiar puertos en docker-compose.yml
ports:
  - "8080:80"  # En lugar de 80:80
```

## 🔧 Instalación Paso a Paso

### 1. Clonar el Repositorio
```bash
git clone [URL-DEL-REPOSITORIO]
cd curso-hongos
```

### 2. Configurar Variables de Entorno
```bash
# Copiar el ejemplo
cp backend/.env.example backend/.env

# Editar con valores reales
nano backend/.env
```

**⚠️ IMPORTANTE: Configurar estas variables:**

```bash
# Generar claves seguras (ejemplo)
SECRET_KEY=una-clave-super-segura-de-32-caracteres
JWT_SECRET_KEY=otra-clave-jwt-diferente-y-segura

# Base de datos PostgreSQL
DATABASE_URL=postgresql://usuario:password@localhost:5432/curso_hongos

# Email (OBLIGATORIO para funcionamiento)
MAIL_USERNAME=espaciothaumazein@gmail.com
MAIL_PASSWORD=[SOLICITAR]
MAIL_DEFAULT_SENDER=espaciothaumazein@gmail.com

# URLs de producción
MP_SUCCESS_URL=https://tu-dominio.com/payment-success
MP_FAILURE_URL=https://tu-dominio.com/payment-failure
MP_PENDING_URL=https://tu-dominio.com/payment-pending
```

### 3. Configurar Base de Datos
```bash
# Instalar PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Crear base de datos
sudo -u postgres psql
CREATE DATABASE curso_hongos;
CREATE USER curso_user WITH ENCRYPTED PASSWORD 'password_seguro';
GRANT ALL PRIVILEGES ON DATABASE curso_hongos TO curso_user;
\q
```

### 4. Backend (Python/Flask)
```bash
cd backend

# Crear entorno virtual
python3 -m venv venv
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Inicializar base de datos
flask db upgrade

# Crear usuario administrador
python create_admin.py
```

### 5. Frontend (React/Vite)
```bash
cd ../frontend

# Instalar dependencias
npm install

# Compilar para producción
npm run build
```

### 6. Configurar Nginx (Producción)
```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    # Frontend estático
    location / {
        root /ruta/al/proyecto/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # API Backend
    location /api {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 7. Ejecutar en Producción
```bash
# Backend (con gunicorn)
cd backend
source venv/bin/activate
gunicorn -w 4 -b 127.0.0.1:5000 app:app

# O usar systemd service
sudo systemctl start curso-hongos
sudo systemctl enable curso-hongos
```

## 🔑 Credenciales de Administrador

**Usuario por defecto:**
- Email: -
- Contraseña: -

**⚠️ CAMBIAR INMEDIATAMENTE después del primer login**

## 📧 Configuración de Email

**CRÍTICO:** El sistema necesita credenciales de email para:
- Confirmación de cuentas
- Recuperación de contraseñas
- Notificaciones de pago

**Contactar para:**
- Password de aplicación de Gmail
- Configuración específica del servidor

## 🔍 Verificación del Despliegue

1. **Frontend:** http://tu-dominio.com
2. **API:** http://tu-dominio.com/api/health
3. **Admin:** http://tu-dominio.com/admin

## 🆘 Soporte

**Desarrollador:** Martín Guerra
**Email:** martinge777@gmail.com
**WhatsApp:** [54 1136562519]

---

## 📝 Comandos Útiles

```bash
# Ver logs del backend
tail -f logs/app.log

# Reiniciar servicios
sudo systemctl restart curso-hongos
sudo systemctl restart nginx
```
