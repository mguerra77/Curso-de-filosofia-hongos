#!/usr/bin/env python3
"""
Script para crear el primer usuario administrador
"""
from app import create_app
from models import db, Usuario, UserRole

def create_admin_user():
    app = create_app()
    
    with app.app_context():
        # Verificar si ya existe un admin
        admin_exists = Usuario.query.filter_by(rol=UserRole.ADMIN.value).first()
        if admin_exists:
            print(f"Ya existe un usuario admin: {admin_exists.email}")
            return
        
        # Datos del admin (cambia estos valores)
        admin_data = {
            'email': 'facildeacordar@gmail.com',
            'password': 'hongoporhongo',  # CAMBIAR POR UNA CONTRASEÑA SEGURA
            'nombre': 'Administrador',
            'apellido': 'Sistema'
        }
        
        # Crear usuario admin
        admin_user = Usuario(
            email=admin_data['email'],
            nombre=admin_data['nombre'],
            apellido=admin_data['apellido'],
            rol=UserRole.ADMIN.value,
            activo=True,
            has_access=True  # Los admins tienen acceso completo
        )
        admin_user.set_password(admin_data['password'])
        
        try:
            db.session.add(admin_user)
            db.session.commit()
            print(f"✅ Usuario administrador creado exitosamente:")
            print(f"   Email: {admin_data['email']}")
            print(f"   Password: {admin_data['password']}")
            print("   ⚠️  RECUERDA CAMBIAR LA CONTRASEÑA DESPUÉS DEL PRIMER LOGIN")
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error creando usuario admin: {str(e)}")

if __name__ == '__main__':
    create_admin_user()
