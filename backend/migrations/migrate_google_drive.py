"""
Migración para agregar soporte de Google Drive al contenido del curso
"""
import sqlite3
import sys
import os

def migrate_database():
    """Migrar la base de datos para agregar campos de Google Drive"""
    
    # Ruta a la base de datos
    db_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'curso_hongos.db')
    
    if not os.path.exists(db_path):
        print(f"Base de datos no encontrada en: {db_path}")
        return False
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Verificar si la tabla existe
        cursor.execute("""
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name='course_content'
        """)
        
        if not cursor.fetchone():
            print("Tabla course_content no existe. Creando tabla completa...")
            
            # Crear tabla completa con nuevos campos
            cursor.execute("""
                CREATE TABLE course_content (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    video_id INTEGER UNIQUE NOT NULL,
                    title VARCHAR(200) NOT NULL,
                    description TEXT,
                    duration VARCHAR(10),
                    module VARCHAR(50),
                    video_url VARCHAR(500),
                    video_type VARCHAR(20) DEFAULT 'youtube',
                    drive_file_id VARCHAR(100),
                    reading_material TEXT,
                    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """)
            print("Tabla course_content creada exitosamente")
            
        else:
            print("Tabla course_content existe. Verificando campos...")
            
            # Obtener estructura actual de la tabla
            cursor.execute("PRAGMA table_info(course_content)")
            columns = [column[1] for column in cursor.fetchall()]
            
            # Agregar campos si no existen
            if 'video_type' not in columns:
                cursor.execute("""
                    ALTER TABLE course_content 
                    ADD COLUMN video_type VARCHAR(20) DEFAULT 'youtube'
                """)
                print("Campo video_type agregado")
                
            if 'drive_file_id' not in columns:
                cursor.execute("""
                    ALTER TABLE course_content 
                    ADD COLUMN drive_file_id VARCHAR(100)
                """)
                print("Campo drive_file_id agregado")
            
            # Actualizar video_type basado en URLs existentes
            cursor.execute("""
                UPDATE course_content 
                SET video_type = CASE 
                    WHEN video_url LIKE '%drive.google.com%' THEN 'drive'
                    WHEN video_url LIKE '%youtube.com%' OR video_url LIKE '%youtu.be%' THEN 'youtube'
                    WHEN video_url LIKE '/uploads/%' THEN 'local'
                    ELSE 'youtube'
                END
                WHERE video_url IS NOT NULL
            """)
            print("Campo video_type actualizado basado en URLs existentes")
        
        conn.commit()
        conn.close()
        
        print("Migración completada exitosamente")
        return True
        
    except Exception as e:
        print(f"Error durante la migración: {e}")
        return False

if __name__ == "__main__":
    success = migrate_database()
    sys.exit(0 if success else 1)