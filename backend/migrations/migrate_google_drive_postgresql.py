"""
Migración para agregar soporte de Google Drive al contenido del curso - PostgreSQL
"""
import psycopg2
import sys
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

def migrate_database():
    """Migrar la base de datos PostgreSQL para agregar campos de Google Drive"""
    
    try:
        # Obtener configuración de conexión desde .env
        database_url = os.environ.get('DATABASE_URL')
        if not database_url:
            print("Error: DATABASE_URL no configurada en .env")
            return False
        
        # Conectar a PostgreSQL
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        
        # Verificar si la tabla existe
        cursor.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'course_content'
            );
        """)
        
        table_exists = cursor.fetchone()[0]
        
        if not table_exists:
            print("Tabla course_content no existe. Creando tabla completa...")
            
            # Crear tabla completa con nuevos campos
            cursor.execute("""
                CREATE TABLE course_content (
                    id SERIAL PRIMARY KEY,
                    video_id INTEGER UNIQUE NOT NULL,
                    title VARCHAR(200) NOT NULL,
                    description TEXT,
                    duration VARCHAR(10),
                    module VARCHAR(50),
                    video_url VARCHAR(500),
                    video_type VARCHAR(20) DEFAULT 'youtube',
                    drive_file_id VARCHAR(100),
                    reading_material TEXT,
                    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)
            print("Tabla course_content creada exitosamente")
            
        else:
            print("Tabla course_content existe. Verificando campos...")
            
            # Verificar si las columnas ya existen
            cursor.execute("""
                SELECT column_name FROM information_schema.columns 
                WHERE table_name = 'course_content';
            """)
            columns = [row[0] for row in cursor.fetchall()]
            
            # Agregar campos si no existen
            if 'video_type' not in columns:
                cursor.execute("""
                    ALTER TABLE course_content 
                    ADD COLUMN video_type VARCHAR(20) DEFAULT 'youtube';
                """)
                print("Campo video_type agregado")
                
            if 'drive_file_id' not in columns:
                cursor.execute("""
                    ALTER TABLE course_content 
                    ADD COLUMN drive_file_id VARCHAR(100);
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
                WHERE video_url IS NOT NULL;
            """)
            print("Campo video_type actualizado basado en URLs existentes")
        
        conn.commit()
        cursor.close()
        conn.close()
        
        print("✅ Migración completada exitosamente")
        return True
        
    except Exception as e:
        print(f"❌ Error durante la migración: {e}")
        return False

if __name__ == "__main__":
    success = migrate_database()
    sys.exit(0 if success else 1)