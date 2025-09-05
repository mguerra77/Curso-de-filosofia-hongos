#!/usr/bin/env python3
"""
Script para migrar la base de datos existente a la nueva estructura con roles
"""
from app import create_app
from models import db, Usuario, UserRole
import sqlite3
import os

def migrate_database():
    app = create_app()
    
    with app.app_context():
        db_path = app.config['SQLALCHEMY_DATABASE_URI'].replace('sqlite:///', '')
        
        # Verificar si la BD existe
        if not os.path.exists(db_path):
            print("Base de datos no existe, creando nueva...")
            db.create_all()
            return True
        
        # Conectar directamente a SQLite para verificar columnas
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        try:
            # Verificar si las columnas nuevas ya existen
            cursor.execute("PRAGMA table_info(usuarios)")
            columns = [column[1] for column in cursor.fetchall()]
            
            print(f"Columnas actuales: {columns}")
            
            # Agregar columna 'rol' si no existe
            if 'rol' not in columns:
                print("Agregando columna 'rol'...")
                cursor.execute("ALTER TABLE usuarios ADD COLUMN rol TEXT DEFAULT 'user'")
                # Actualizar todos los usuarios existentes con rol 'user'
                cursor.execute("UPDATE usuarios SET rol = 'user' WHERE rol IS NULL")
            
            # Agregar columna 'has_access' si no existe  
            if 'has_access' not in columns:
                print("Agregando columna 'has_access'...")
                cursor.execute("ALTER TABLE usuarios ADD COLUMN has_access BOOLEAN DEFAULT 0")
                # Actualizar todos los usuarios existentes sin acceso
                cursor.execute("UPDATE usuarios SET has_access = 0 WHERE has_access IS NULL")
            
            conn.commit()
            print("✅ Migración completada exitosamente")
            
            # Mostrar usuarios existentes
            cursor.execute("SELECT id, email, nombre, apellido, rol, has_access, activo FROM usuarios")
            usuarios = cursor.fetchall()
            
            if usuarios:
                print("\n📋 Usuarios existentes:")
                for usuario in usuarios:
                    print(f"  ID: {usuario[0]}, Email: {usuario[1]}, Nombre: {usuario[2]} {usuario[3]}")
                    print(f"      Rol: {usuario[4]}, Acceso: {usuario[5]}, Activo: {usuario[6]}")
            else:
                print("\n📋 No hay usuarios existentes")
            
        except Exception as e:
            print(f"❌ Error en migración: {str(e)}")
            conn.rollback()
            return False
        finally:
            conn.close()
            
        return True

if __name__ == '__main__':
    success = migrate_database()
    if success:
        print("\n🚀 Ahora puedes ejecutar: python create_admin.py")
    else:
        print("\n❌ La migración falló")
