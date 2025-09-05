#!/usr/bin/env python3
"""
Script para migrar la base de datos agregando campos de confirmación de email
"""

import sys
import os

# Agregar el directorio del backend al path para importar módulos
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

from app import create_app
from models import db

def migrate_add_email_confirmation():
    """Agregar campos de confirmación de email a la tabla usuarios"""
    app = create_app()
    
    with app.app_context():
        try:
            # Ejecutar las migraciones SQL manualmente
            with db.engine.connect() as connection:
                connection.execute(db.text("""
                    ALTER TABLE usuarios 
                    ADD COLUMN IF NOT EXISTS email_confirmed BOOLEAN DEFAULT FALSE;
                """))
                
                connection.execute(db.text("""
                    ALTER TABLE usuarios 
                    ADD COLUMN IF NOT EXISTS email_confirmation_token VARCHAR(255);
                """))
                
                connection.commit()
            
            print("✅ Migración completada: Campos de confirmación de email agregados")
            
        except Exception as e:
            print(f"❌ Error durante la migración: {str(e)}")
            return False
    
    return True

if __name__ == "__main__":
    success = migrate_add_email_confirmation()
    if success:
        print("🎉 Migración exitosa")
    else:
        print("💥 Migración falló")
        sys.exit(1)
