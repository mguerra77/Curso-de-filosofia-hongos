#!/usr/bin/env python3
"""
Script para agregar campos de reset de contraseña a la base de datos
"""

import os
import sys

# Agregar el directorio del backend al path para importar módulos
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

from config import Config
import psycopg2

def migrate_password_reset_fields():
    """Agregar campos para reset de contraseña"""
    try:
        # Conectar a PostgreSQL
        conn = psycopg2.connect(Config.SQLALCHEMY_DATABASE_URI)
        cur = conn.cursor()
        
        print("Conectado a PostgreSQL")
        
        # Verificar si las columnas ya existen
        cur.execute("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'usuarios' 
            AND column_name IN ('password_reset_token', 'password_reset_expires')
        """)
        
        existing_columns = [row[0] for row in cur.fetchall()]
        
        # Agregar password_reset_token si no existe
        if 'password_reset_token' not in existing_columns:
            print("Agregando columna password_reset_token...")
            cur.execute("""
                ALTER TABLE usuarios 
                ADD COLUMN password_reset_token VARCHAR(255) NULL
            """)
            print("✅ Columna password_reset_token agregada")
        else:
            print("⚠️  Columna password_reset_token ya existe")
        
        # Agregar password_reset_expires si no existe
        if 'password_reset_expires' not in existing_columns:
            print("Agregando columna password_reset_expires...")
            cur.execute("""
                ALTER TABLE usuarios 
                ADD COLUMN password_reset_expires TIMESTAMP NULL
            """)
            print("✅ Columna password_reset_expires agregada")
        else:
            print("⚠️  Columna password_reset_expires ya existe")
        
        # Crear índice para password_reset_token si no existe
        cur.execute("""
            SELECT indexname FROM pg_indexes 
            WHERE tablename = 'usuarios' 
            AND indexname = 'idx_usuarios_password_reset_token'
        """)
        
        if not cur.fetchone():
            print("Creando índice para password_reset_token...")
            cur.execute("""
                CREATE INDEX idx_usuarios_password_reset_token 
                ON usuarios(password_reset_token) 
                WHERE password_reset_token IS NOT NULL
            """)
            print("✅ Índice creado")
        else:
            print("⚠️  Índice ya existe")
        
        # Confirmar cambios
        conn.commit()
        print("\n🎉 Migración de reset de contraseña completada exitosamente")
        
        # Verificar estructura final
        cur.execute("""
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'usuarios' 
            AND column_name IN ('password_reset_token', 'password_reset_expires')
            ORDER BY column_name
        """)
        
        print("\n📋 Estructura de campos de reset:")
        for row in cur.fetchall():
            print(f"   {row[0]}: {row[1]} (nullable: {row[2]})")
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error en migración: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    return True

if __name__ == '__main__':
    print("🔄 Iniciando migración de campos de reset de contraseña...")
    success = migrate_password_reset_fields()
    sys.exit(0 if success else 1)
