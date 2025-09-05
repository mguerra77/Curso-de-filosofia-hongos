#!/usr/bin/env python3
"""
Test simple y rápido para verificar el registro
"""

import requests
import json
import time

def test_registration_simple():
    """Test simple de registro"""
    print("🧪 Test simple de registro...")
    
    # Datos de usuario único
    test_user = {
        'email': f'simple_test_{int(time.time())}@example.com',
        'password': 'password123',
        'nombre': 'Simple',
        'apellido': 'Test'
    }
    
    try:
        # Verificar conectividad
        print("1. Verificando conectividad...")
        response = requests.get("http://localhost:5000/api/auth/users", timeout=3)
        print(f"   Servidor responde: {response.status_code}")
        
        # Test de registro
        print("2. Registrando usuario...")
        response = requests.post(
            "http://localhost:5000/api/auth/register",
            json=test_user,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text[:200]}...")
        
        if response.status_code == 201:
            print("   ✅ Registro exitoso!")
            data = response.json()
            print(f"   Email: {data['usuario']['email']}")
            print(f"   Confirmado: {data['usuario']['email_confirmed']}")
        else:
            print(f"   ❌ Error en registro: {response.status_code}")
            
        # Test de login
        print("3. Probando login...")
        login_response = requests.post(
            "http://localhost:5000/api/auth/login",
            json={
                'email': test_user['email'],
                'password': test_user['password']
            },
            headers={'Content-Type': 'application/json'},
            timeout=5
        )
        
        print(f"   Login status: {login_response.status_code}")
        if login_response.status_code == 200:
            print("   ✅ Login exitoso!")
        else:
            print("   ℹ️ Login requiere confirmación o hay otro problema")
            
    except requests.exceptions.ConnectionError:
        print("❌ No se puede conectar al servidor")
        print("   Asegúrate de ejecutar: python app.py en el directorio backend")
        return False
    except Exception as e:
        print(f"❌ Error inesperado: {str(e)}")
        return False
    
    return True

if __name__ == '__main__':
    success = test_registration_simple()
    if success:
        print("\n🎉 Test completado!")
    else:
        print("\n💥 Test falló")
        exit(1)
