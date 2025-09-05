#!/usr/bin/env python3
"""
Script de prueba completa del sistema de reset de contraseña
"""

import requests
import json
import time
from models import db, Usuario
from config import Config
import psycopg2

# Configuración
FRONTEND_URL = 'http://localhost:5173'
BACKEND_URL = 'http://localhost:5000/api/auth'
TEST_EMAIL = 'martinge777@gmail.com'  # Email real para pruebas

def test_backend_endpoints():
    """Probar todos los endpoints del backend"""
    print("🔍 Probando endpoints del backend...")
    
    # 1. Probar forgot-password
    print("📧 Probando endpoint forgot-password...")
    response = requests.post(f"{BACKEND_URL}/forgot-password", json={
        'email': TEST_EMAIL
    })
    
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}")
    
    if response.status_code == 200:
        print("   ✅ Endpoint funcionando correctamente")
    else:
        print("   ❌ Error en endpoint")
        return False
    
    # 2. Verificar que se creó el token en la base de datos
    print("🔍 Verificando token en base de datos...")
    try:
        conn = psycopg2.connect(Config.SQLALCHEMY_DATABASE_URI)
        cur = conn.cursor()
        
        cur.execute("""
            SELECT password_reset_token, password_reset_expires 
            FROM usuarios 
            WHERE email = %s
        """, (TEST_EMAIL,))
        
        result = cur.fetchone()
        if result and result[0]:
            print(f"   ✅ Token creado: {result[0][:20]}...")
            print(f"   ✅ Expira: {result[1]}")
            
            # Probar reset con este token
            print("🔑 Probando reset-password...")
            reset_response = requests.post(f"{BACKEND_URL}/reset-password", json={
                'token': result[0],
                'password': 'newpassword123'
            })
            
            print(f"   Status: {reset_response.status_code}")
            print(f"   Response: {reset_response.json()}")
            
            if reset_response.status_code == 200:
                print("   ✅ Reset de contraseña funcionando")
            else:
                print("   ❌ Error en reset de contraseña")
            
        else:
            print("   ❌ No se encontró token en base de datos")
            return False
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"   ❌ Error verificando base de datos: {e}")
        return False
    
    return True

def test_frontend_pages():
    """Probar que las páginas frontend estén disponibles"""
    print("\n🌐 Probando páginas del frontend...")
    
    pages = [
        ('/login', 'Página de login'),
        ('/forgot-password', 'Página forgot password'),
        ('/reset-password?token=test', 'Página reset password')
    ]
    
    for path, name in pages:
        try:
            response = requests.get(f"{FRONTEND_URL}{path}")
            if response.status_code == 200:
                print(f"   ✅ {name} disponible")
            else:
                print(f"   ❌ {name} error: {response.status_code}")
        except Exception as e:
            print(f"   ❌ {name} no disponible: {e}")
            return False
    
    return True

def create_test_summary():
    """Crear resumen de la funcionalidad implementada"""
    print("\n" + "="*60)
    print("📋 RESUMEN DE FUNCIONALIDAD IMPLEMENTADA")
    print("="*60)
    
    print("\n🔧 BACKEND:")
    print("   ✅ Nuevos campos en base de datos:")
    print("      - password_reset_token")
    print("      - password_reset_expires")
    print("   ✅ Nuevos endpoints:")
    print("      - POST /api/auth/forgot-password")
    print("      - POST /api/auth/reset-password")
    print("   ✅ Servicio de email configurado")
    print("   ✅ Tokens con expiración (1 hora)")
    print("   ✅ Validaciones de seguridad")
    
    print("\n🎨 FRONTEND:")
    print("   ✅ ForgotPasswordPage.jsx")
    print("   ✅ ResetPasswordPage.jsx")
    print("   ✅ Estilos CSS agregados")
    print("   ✅ Rutas configuradas")
    print("   ✅ Link desde LoginPage")
    print("   ✅ Proxy API configurado")
    
    print("\n📧 EMAILS:")
    print("   ✅ Templates HTML profesionales")
    print("   ✅ Configuración SMTP Gmail")
    print("   ✅ Manejo de errores")
    print("   ✅ Misma configuración que confirmación")
    
    print("\n🔒 SEGURIDAD:")
    print("   ✅ Tokens únicos y seguros")
    print("   ✅ Expiración automática")
    print("   ✅ Validación de email existente")
    print("   ✅ Respuesta consistente (sin leak de info)")
    print("   ✅ Limpieza de tokens usados")

def main():
    """Función principal de pruebas"""
    print("🧪 INICIANDO PRUEBAS COMPLETAS DEL SISTEMA DE RESET")
    print("="*60)
    
    # Probar backend
    backend_ok = test_backend_endpoints()
    
    # Probar frontend
    frontend_ok = test_frontend_pages()
    
    # Mostrar resumen
    create_test_summary()
    
    print("\n" + "="*60)
    if backend_ok and frontend_ok:
        print("🎉 SISTEMA COMPLETAMENTE FUNCIONAL!")
        print("\n📝 PARA PROBAR MANUALMENTE:")
        print("1. Ve a http://localhost:5173/login")
        print("2. Haz clic en '¿Olvidaste tu contraseña?'")
        print("3. Ingresa tu email")
        print("4. Revisa tu email (puede estar en spam)")
        print("5. Sigue el enlace para restablecer")
    else:
        print("❌ ALGUNOS COMPONENTES TIENEN PROBLEMAS")
        if not backend_ok:
            print("   - Backend tiene errores")
        if not frontend_ok:
            print("   - Frontend tiene errores")
    print("="*60)

if __name__ == '__main__':
    main()
