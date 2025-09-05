#!/bin/bash
# Script para actualizar las URLs del frontend a las nuevas rutas modularizadas

echo "🔄 Actualizando URLs del frontend..."

# Archivo de servicios API
API_FILE="/home/martin/Prácticas/Pagina hongos/curso-hongos/frontend/src/services/api.js"

# Backup del archivo original
cp "$API_FILE" "${API_FILE}.backup"

# Actualizar rutas de administración
sed -i 's|/api/auth/users|/api/admin/users|g' "$API_FILE"
sed -i 's|/api/auth/admin/activate-user|/api/admin/activate-user|g' "$API_FILE"
sed -i 's|/api/auth/admin/deactivate-user|/api/admin/deactivate-user|g' "$API_FILE"
sed -i 's|/api/auth/admin/grant-access|/api/admin/grant-access|g' "$API_FILE"
sed -i 's|/api/auth/admin/revoke-access|/api/admin/revoke-access|g' "$API_FILE"

# Actualizar rutas de curso
sed -i 's|/api/auth/check-course-access|/api/course/check-access|g' "$API_FILE"
sed -i 's|/api/auth/course/content|/api/course/content|g' "$API_FILE"

# Actualizar rutas de pagos
sed -i 's|/api/auth/create-preference|/api/payments/create-preference|g' "$API_FILE"
sed -i 's|/api/auth/payment-webhook|/api/payments/webhook|g' "$API_FILE"
sed -i 's|/api/auth/payment-status|/api/payments/status|g' "$API_FILE"
sed -i 's|/api/auth/mp-debug|/api/payments/mp-debug|g' "$API_FILE"

echo "✅ URLs actualizadas en api.js"

# Buscar otros archivos que puedan tener URLs hardcodeadas
echo "🔍 Buscando otras referencias..."

FRONTEND_DIR="/home/martin/Prácticas/Pagina hongos/curso-hongos/frontend/src"

# Buscar en todos los archivos .jsx y .js
find "$FRONTEND_DIR" -name "*.jsx" -o -name "*.js" | while read file; do
    if grep -q "/api/auth/" "$file" 2>/dev/null; then
        echo "📝 Encontrado en: $file"
        
        # Crear backup
        cp "$file" "${file}.backup"
        
        # Actualizar rutas
        sed -i 's|/api/auth/users|/api/admin/users|g' "$file"
        sed -i 's|/api/auth/admin/|/api/admin/|g' "$file"
        sed -i 's|/api/auth/check-course-access|/api/course/check-access|g' "$file"
        sed -i 's|/api/auth/course/|/api/course/|g' "$file"
        sed -i 's|/api/auth/create-preference|/api/payments/create-preference|g' "$file"
        sed -i 's|/api/auth/payment|/api/payments|g' "$file"
        sed -i 's|/api/auth/mp-debug|/api/payments/mp-debug|g' "$file"
    fi
done

echo "🎉 Actualización completada!"
echo "💾 Se crearon backups con extensión .backup"
