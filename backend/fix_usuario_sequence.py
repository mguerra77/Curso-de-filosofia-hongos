#!/usr/bin/env python3
"""
Script para corregir el problema de secuencia del ID en la tabla usuarios
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from models import db
from sqlalchemy import text

def fix_usuario_sequence():
    """Corregir la secuencia del ID de la tabla usuarios"""
    app = create_app()
    
    with app.app_context():
        try:
            # Obtener el ID máximo actual
            with db.engine.connect() as connection:
                result = connection.execute(text("SELECT MAX(id) FROM usuarios;"))
                max_id = result.scalar()
                
                if max_id is None:
                    max_id = 0
                
                print(f"ID máximo actual en usuarios: {max_id}")
                
                # Resetear la secuencia al siguiente valor disponible
                next_id = max_id + 1
                connection.execute(text(f"ALTER SEQUENCE usuarios_id_seq RESTART WITH {next_id};"))
                connection.commit()
                
                print(f"✅ Secuencia usuarios_id_seq reiniciada desde {next_id}")
                
                # Verificar que funciona
                result = connection.execute(text("SELECT nextval('usuarios_id_seq');"))
                next_val = result.scalar()
                print(f"✅ Próximo ID que se asignará: {next_val}")
                
        except Exception as e:
            print(f"❌ Error corrigiendo secuencia: {str(e)}")
            return False
    
    return True

if __name__ == "__main__":
    print("🔧 Corrigiendo secuencia de ID de usuarios...")
    success = fix_usuario_sequence()
    if success:
        print("🎉 Secuencia corregida exitosamente")
    else:
        print("💥 Error corrigiendo secuencia")
        sys.exit(1)
