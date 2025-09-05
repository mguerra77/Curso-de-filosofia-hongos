#!/usr/bin/env python3
"""
Script directo para limpiar la base de datos (sin confirmación interactiva)
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from models import db, Usuario, UserRole
from sqlalchemy import text

def clean_database_direct():
    """Eliminar todos los usuarios excepto el administrador - versión directa"""
    app = create_app()
    
    with app.app_context():
        try:
            print("🧹 Iniciando limpieza de base de datos...")
            
            # Buscar el usuario administrador
            admin_user = Usuario.query.filter_by(rol=UserRole.ADMIN.value).first()
            
            if admin_user:
                print(f"✅ Admin encontrado: {admin_user.email} (ID: {admin_user.id})")
            else:
                print("❌ No se encontró usuario administrador")
                return False
            
            # Contar usuarios antes
            total_before = Usuario.query.count()
            non_admin_users = Usuario.query.filter(Usuario.rol != UserRole.ADMIN.value).all()
            
            print(f"📊 Total usuarios: {total_before}")
            print(f"🗑️  Para eliminar: {len(non_admin_users)}")
            
            # Mostrar usuarios que se van a eliminar
            if non_admin_users:
                print("\n👥 Usuarios que se eliminarán:")
                for user in non_admin_users:
                    print(f"   - ID: {user.id}, Email: {user.email}, Nombre: {user.nombre} {user.apellido}")
            
            # Eliminar usuarios no administradores
            deleted_count = Usuario.query.filter(Usuario.rol != UserRole.ADMIN.value).delete()
            db.session.commit()
            
            print(f"\n✅ Eliminados: {deleted_count} usuarios")
            
            # Resetear secuencia
            with db.engine.connect() as connection:
                result = connection.execute(text("SELECT MAX(id) FROM usuarios;"))
                max_id = result.scalar() or 0
                next_id = max_id + 1
                connection.execute(text(f"ALTER SEQUENCE usuarios_id_seq RESTART WITH {next_id};"))
                connection.commit()
                print(f"🔄 Secuencia ID reiniciada desde {next_id}")
            
            # Verificar resultado final
            final_count = Usuario.query.count()
            print(f"📊 Usuarios restantes: {final_count}")
            
            return True
            
        except Exception as e:
            print(f"❌ Error: {str(e)}")
            db.session.rollback()
            return False

if __name__ == "__main__":
    success = clean_database_direct()
    if success:
        print("\n🎉 ¡Base de datos limpiada exitosamente!")
    else:
        print("\n💥 Error en la limpieza")
        sys.exit(1)
