#!/bin/bash
set -e

echo "🚀 Iniciando aplicación del Curso de Hongos..."

# Esperar a que la base de datos esté lista
echo "📡 Esperando conexión con la base de datos..."
until pg_isready -h db -p 5432 -U curso_user; do
  echo "⏳ Esperando PostgreSQL..."
  sleep 2
done

echo "✅ Base de datos conectada"

# La aplicación crea las tablas automáticamente con db.create_all()
echo "🔧 Las tablas se crearán automáticamente al iniciar la app"

# Crear usuario administrador si no existe
echo "👤 Verificando usuario administrador..."
python3 << EOF
import os
from app import create_app
from models import db, Usuario
from werkzeug.security import generate_password_hash

app = create_app()

with app.app_context():
    # Verificar si ya existe un admin
    admin = Usuario.query.filter_by(email='admin@cursohongos.com').first()
    
    if not admin:
        print("🔧 Creando usuario administrador...")
        admin = Usuario(
            nombre='Administrador',
            apellido='Sistema',
            email='admin@cursohongos.com',
            password_hash=generate_password_hash('admin123'),
            email_confirmed=True,
            rol='admin',
            has_access=True  # Admin debe tener acceso al curso
        )
        db.session.add(admin)
        db.session.commit()
        print("✅ Usuario administrador creado: admin@cursohongos.com / admin123")
        print("⚠️  IMPORTANTE: Cambiar contraseña después del primer login")
    else:
        # Verificar que el admin tenga acceso al curso
        if not admin.has_access:
            print("🔧 Actualizando permisos del administrador...")
            admin.has_access = True
            db.session.commit()
            print("✅ Administrador ahora tiene acceso al curso")
        print("ℹ️  Usuario administrador ya existe")
EOF

echo "🎉 Aplicación inicializada correctamente"

# Ejecutar el comando pasado como argumento
exec "$@"