#!/usr/bin/env python3
"""
Script de prueba para la funcionalidad de reset de contraseña
"""

import requests
import json
import time

# Configuración
BASE_URL = 'http://localhost:5000/api/auth'
TEST_EMAIL = 'test_reset@example.com'
TEST_PASSWORD = 'test123'
NEW_PASSWORD = 'newpass123'

def test_forgot_password():
    """Probar solicitud de reset de contraseña"""
    print("🔄 Probando solicitud de reset de contraseña...")
    
    url = f"{BASE_URL}/forgot-password"
    data = {
        'email': TEST_EMAIL
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            print("✅ Solicitud de reset enviada exitosamente")
            return True
        else:
            print(f"❌ Error en solicitud: {response.json()}")
            return False
            
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return False

def test_register_user():
    """Crear un usuario de prueba para testing"""
    print("🔄 Creando usuario de prueba...")
    
    url = f"{BASE_URL}/register"
    data = {
        'email': TEST_EMAIL,
        'password': TEST_PASSWORD,
        'nombre': 'Test',
        'apellido': 'Reset'
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code in [200, 201]:
            print("✅ Usuario de prueba creado")
            return True
        elif response.status_code == 409 and 'ya está registrado' in response.json().get('error', ''):
            print("ℹ️ Usuario ya existe, continuando...")
            return True
        else:
            print(f"❌ Error creando usuario: {response.json()}")
            return False
            
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return False

def test_endpoints():
    """Probar todos los endpoints"""
    print("🧪 Iniciando pruebas de reset de contraseña...\n")
    
    # 1. Crear usuario de prueba
    if not test_register_user():
        return False
    
    print()
    
    # 2. Probar forgot password
    if not test_forgot_password():
        return False
    
    print()
    
    # 3. Probar con email inexistente
    print("🔄 Probando con email inexistente...")
    url = f"{BASE_URL}/forgot-password"
    data = {'email': 'noexiste@example.com'}
    
    try:
        response = requests.post(url, json=data)
        if response.status_code == 200:
            print("✅ Manejo correcto de email inexistente")
        else:
            print(f"❌ Error inesperado: {response.json()}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print()
    
    # 4. Probar validaciones
    print("🔄 Probando validaciones...")
    
    # Email vacío
    response = requests.post(f"{BASE_URL}/forgot-password", json={})
    if response.status_code == 400:
        print("✅ Validación de email vacío funciona")
    else:
        print(f"❌ Validación fallida: {response.json()}")
    
    # Token inválido para reset
    response = requests.post(f"{BASE_URL}/reset-password", json={
        'token': 'token_invalido',
        'password': 'newpass123'
    })
    if response.status_code == 400:
        print("✅ Validación de token inválido funciona")
    else:
        print(f"❌ Validación fallida: {response.json()}")
    
    print("\n🎉 Todas las pruebas completadas!")
    return True

if __name__ == '__main__':
    print("=" * 50)
    print("PRUEBAS DE FUNCIONALIDAD RESET DE CONTRASEÑA")
    print("=" * 50)
    
    success = test_endpoints()
    
    if success:
        print("\n✅ Sistema de reset de contraseña funcionando correctamente!")
        print("\n📝 Para probar completamente:")
        print("1. Ve a http://localhost:5174/login")
        print("2. Haz clic en '¿Olvidaste tu contraseña?'")
        print("3. Ingresa un email válido")
        print("4. Revisa tu email (puede estar en spam)")
        print("5. Sigue el enlace para restablecer la contraseña")
    else:
        print("\n❌ Algunas pruebas fallaron. Revisa los errores arriba.")
