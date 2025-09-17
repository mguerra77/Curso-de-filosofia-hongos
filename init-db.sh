#!/bin/bash
set -e

# Este script se ejecuta automáticamente cuando se crea el contenedor de PostgreSQL

echo "🚀 Inicializando base de datos para Curso de Hongos..."

# El usuario y la base de datos ya se crean con las variables de entorno
# Solo necesitamos asegurar los permisos correctos

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Asegurar que el usuario tenga todos los permisos
    GRANT ALL PRIVILEGES ON DATABASE curso_hongos TO curso_user;
    
    -- Permitir crear extensiones si es necesario
    GRANT CREATE ON SCHEMA public TO curso_user;
    
    -- Mensaje de confirmación
    SELECT 'Base de datos inicializada correctamente' as status;
EOSQL

echo "✅ Base de datos inicializada correctamente"