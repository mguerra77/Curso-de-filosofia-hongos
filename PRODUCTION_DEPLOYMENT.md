# 🚀 Guía de Despliegue en Producción
🚀 INSTRUCCIONES DE DESPLIEGUE - SERVIDOR DE PRODUCCIÓN

Prerrequisitos del Servidor
---------------------------

Instala Docker y Docker Compose (plugin):

```bash
sudo apt update
sudo apt install docker.io docker-compose-plugin
sudo systemctl start docker
sudo systemctl enable docker

# (Opcional) Agregar tu usuario al grupo docker para evitar sudo
sudo usermod -aG docker $USER
# Luego haz logout/login para aplicar el cambio
```

Clonar el Repositorio
----------------------

```bash
# Clonar en el servidor
git clone [URL-DEL-REPOSITORIO]
cd curso-hongos
```

Configurar Variables de Entorno
-------------------------------

```bash
# Copiar archivo de ejemplo
cp .env.docker .env

# Editar con valores reales de producción
nano .env
```

Completar estos valores OBLIGATORIOS en `.env`:

```bash
# Base de datos - CAMBIAR OBLIGATORIAMENTE
DB_PASSWORD=tu_password_super_seguro_2024

# Claves de seguridad - GENERAR NUEVAS
SECRET_KEY=clave-super-secreta-de-32-caracteres-minimo-12345
JWT_SECRET_KEY=otra-clave-jwt-diferente-de-la-anterior-67890

# Email - CREDENCIALES REALES (proporcionadas fuera de este repositorio)
MAIL_USERNAME=espaciothaumazein@gmail.com
MAIL_PASSWORD=[PROPORCIONAR_PASSWORD_DEL_APP_GMAIL]
MAIL_DEFAULT_SENDER=espaciothaumazein@gmail.com

# URL del sitio web - CAMBIAR POR TU DOMINIO
FRONTEND_URL=https://tu-dominio.com

# Mercado Pago (opcional)
MP_ACCESS_TOKEN=your_mp_access_token
MP_PUBLIC_KEY=your_mp_public_key
```

Levantar la Aplicación
----------------------

```bash
# Construir y levantar todo
docker compose up -d --build

# Verificar que todo esté funcionando
docker compose ps
```

Deberías ver contenedores con estado `Up` y preferentemente `healthy`.

Verificar Funcionamiento
-----------------------

```bash
# Ver logs si hay problemas
docker compose logs backend
docker compose logs frontend
docker compose logs db

# Probar endpoints básicos
curl http://localhost/api/health
curl http://localhost
```

Acceso de Administrador
-----------------------

La aplicación puede crear un usuario administrador durante la inicialización o puedes usar las utilidades del backend para crearlo manualmente. Valores por defecto (si se usan):

- Email: `admin@cursohongos.com`
- Password: `admin123`

Configurar Nginx (Opcional pero Recomendado)
------------------------------------------

Instala Nginx y configura un proxy reverso:

```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/curso-hongos
```

Ejemplo de configuracion:

```nginx
server {
	listen 80;
	server_name tu-dominio.com;

	location / {
		proxy_pass http://localhost:80;
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
	}

	location /api {
		proxy_pass http://localhost:5000;
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
	}
}
```

Activar y recargar Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/curso-hongos /etc/nginx/sites-enabled/
sudo systemctl reload nginx
```

Credenciales de Email
---------------------

IMPORTANTE: Las credenciales del email se deben transmitir de forma segura (no las incluyas en el repositorio público). Contactar al desarrollador para obtener `MAIL_PASSWORD` (App Password de Gmail) y configurarlo en `.env`.

Comandos Útiles
---------------

```bash
# Ver estado
docker compose ps

# Ver logs en vivo
docker compose logs -f

# Reiniciar servicios
docker compose restart

# Detener todo
docker compose down

# Actualizar aplicación (pull + rebuild)
git pull
docker compose up -d --build
```

Backup de Base de Datos
-----------------------

```bash
# Crear backup (ajusta usuario/nombre de la BD según tu compose)
docker compose exec db pg_dump -U curso_user curso_hongos > backup_$(date +%Y%m%d).sql

# Restaurar backup
docker compose exec -T db psql -U curso_user curso_hongos < backup_20241217.sql
```

Monitoreo
--------

```bash
# Uso de recursos
docker stats

# Buscar errores en logs
docker compose logs backend | grep ERROR
```

Soporte
-------

Para problemas contactar:
- Desarrollador: Martín Guerra - martinge777@gmail.com
- Administracion: espaciothaumazein@gmail.com

El sitio estará disponible en `http://tu-dominio.com` (o el dominio que configures en `FRONTEND_URL`).

Esta guía te ayudará a desplegar tu aplicación del Curso de Hongos en un servidor de producción.

## 📋 Requisitos Previos

- Servidor con Docker y Docker Compose instalados
- Dominio apuntando a tu servidor
- Certificado SSL (recomendado: Let's Encrypt)

## 🔧 Configuración para Producción

### 1. Variables de Entorno

Copia el archivo `.env.docker` a `.env` y configura las siguientes variables:

```bash
# OBLIGATORIO: Cambiar en producción
DB_PASSWORD=tu_password_super_seguro_aqui
SECRET_KEY=clave-super-secreta-minimo-32-caracteres
JWT_SECRET_KEY=otra-clave-jwt-diferente-de-la-anterior

# URL de tu sitio web en producción
FRONTEND_URL=https://tu-dominio.com

# Email (OBLIGATORIO para confirmaciones)
MAIL_USERNAME=tu-email@gmail.com
MAIL_PASSWORD=tu_app_password_de_gmail
MAIL_DEFAULT_SENDER=tu-email@gmail.com

# Mercado Pago (opcional)
MP_ACCESS_TOKEN=tu_access_token_de_mp
MP_PUBLIC_KEY=tu_public_key_de_mp
```

### 2. Configuración de URLs

**IMPORTANTE**: La variable `FRONTEND_URL` determina hacia dónde van los enlaces en los emails:

- **Desarrollo**: `FRONTEND_URL=http://localhost`
- **Producción**: `FRONTEND_URL=https://tu-dominio.com`

```

## 🚀 Comandos de Despliegue

```bash
# 1. Clonar el repositorio en el servidor
git clone https://github.com/mguerra77/Curso-de-filosofia-hongos.git
cd Curso-de-filosofia-hongos

# 2. Configurar variables de entorno
cp .env.docker .env
nano .env  # Editar con tus valores reales

# 3. Desplegar la aplicación
docker compose up --build -d

# 4. Verificar que todo funciona
docker compose ps
docker compose logs
```

## 🔍 Verificación Post-Despliegue

### Pruebas Básicas:
```bash
# 1. Health check del backend
curl https://tu-dominio.com/api/health

# 2. Verificar frontend
curl -I https://tu-dominio.com

# 3. Ver logs en tiempo real
docker compose logs -f
```

### Test de Email:
1. Registra una cuenta de prueba
2. Verifica que el email llegue con el dominio correcto
3. Confirma que el enlace redirija a tu dominio

## 🛡️ Seguridad en Producción

### Variables Críticas a Cambiar:
- ✅ `DB_PASSWORD`: Password súper seguro para PostgreSQL
- ✅ `SECRET_KEY`: Clave de 32+ caracteres para Flask
- ✅ `JWT_SECRET_KEY`: Clave diferente para tokens JWT
- ✅ `FRONTEND_URL`: Tu dominio real con HTTPS

### Recomendaciones:
- Usa HTTPS (certificado SSL)
- Configura un firewall
- Haz backups regulares de la base de datos
- Monitorea los logs de la aplicación

## 📁 Estructura de Archivos en Producción

```
tu-servidor/
├── Curso-de-filosofia-hongos/
│   ├── docker-compose.yml
│   ├── .env                    # ← TUS CONFIGURACIONES AQUÍ
│   ├── backend/
│   ├── frontend/
│   └── ...
└── backups/                    # ← Opcional: carpeta de backups
```

## 🔄 Actualizaciones

Para actualizar la aplicación:

```bash
# 1. Hacer backup de la base de datos
docker compose exec db pg_dump -U postgres curso_hongos > backup_$(date +%Y%m%d).sql

# 2. Obtener últimos cambios
git pull origin main

# 3. Reconstruir y desplegar
docker compose up --build -d

# 4. Verificar que todo funciona
docker compose ps
```

## 🆘 Solución de Problemas

### Problema: Enlaces de email van a localhost
**Solución**: Verificar que `FRONTEND_URL` esté configurado correctamente en `.env`

### Problema: Emails no llegan
**Solución**: Verificar configuración SMTP en las variables `MAIL_*`

### Problema: Contenedor backend falla
**Solución**: 
```bash
docker compose logs backend
# Verificar configuración de base de datos
```

## 📞 Soporte

Si tienes problemas con el despliegue, verifica:
1. Logs de los contenedores: `docker compose logs`
2. Variables de entorno en `.env`
3. Conectividad de red y DNS del dominio

---

**¡Tu aplicación está lista para producción!** 🎉