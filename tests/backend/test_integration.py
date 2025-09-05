import pytest
import requests
import json
import time

class TestRegistrationIntegration:
    """Tests de integración para el sistema de registro y confirmación"""
    
    BASE_URL = "http://localhost:5000/api"
    
    def setup_method(self):
        """Configuración antes de cada test"""
        self.test_user = {
            'email': f'test_{int(time.time())}@example.com',  # Email único usando timestamp
            'password': 'password123',
            'nombre': 'Test',
            'apellido': 'User'
        }
    
    def test_full_registration_flow(self):
        """Test completo del flujo de registro"""
        
        # 1. Registrar usuario
        response = requests.post(
            f"{self.BASE_URL}/auth/register",
            json=self.test_user,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Registro - Status: {response.status_code}")
        print(f"Registro - Response: {response.text}")
        
        assert response.status_code == 201, f"Error en registro: {response.text}"
        
        data = response.json()
        assert 'message' in data
        assert 'usuario' in data
        assert data['usuario']['email'] == self.test_user['email']
        assert data['usuario']['email_confirmed'] == False
        
        print("✅ Registro exitoso")
        
        # 2. Intentar login sin confirmar email (debería funcionar)
        login_response = requests.post(
            f"{self.BASE_URL}/auth/login",
            json={
                'email': self.test_user['email'],
                'password': self.test_user['password']
            },
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Login - Status: {login_response.status_code}")
        print(f"Login - Response: {login_response.text}")
        
        if login_response.status_code == 200:
            print("✅ Login exitoso (incluso sin confirmar email)")
        else:
            print("ℹ️ Login requiere confirmación de email")
    
    def test_registration_duplicate_email(self):
        """Test de registro con email duplicado"""
        
        # Registrar usuario primera vez
        response1 = requests.post(
            f"{self.BASE_URL}/auth/register",
            json=self.test_user,
            headers={'Content-Type': 'application/json'}
        )
        
        assert response1.status_code == 201
        print("✅ Primera registro exitoso")
        
        # Intentar registrar con el mismo email
        response2 = requests.post(
            f"{self.BASE_URL}/auth/register",
            json=self.test_user,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Registro duplicado - Status: {response2.status_code}")
        print(f"Registro duplicado - Response: {response2.text}")
        
        assert response2.status_code == 409
        data = response2.json()
        assert 'error' in data
        assert 'ya está registrado' in data['error']
        
        print("✅ Error de email duplicado detectado correctamente")
    
    def test_resend_confirmation(self):
        """Test de reenvío de confirmación"""
        
        # Registrar usuario
        response = requests.post(
            f"{self.BASE_URL}/auth/register",
            json=self.test_user,
            headers={'Content-Type': 'application/json'}
        )
        
        assert response.status_code == 201
        print("✅ Usuario registrado")
        
        # Solicitar reenvío de confirmación
        resend_response = requests.post(
            f"{self.BASE_URL}/auth/resend-confirmation",
            json={'email': self.test_user['email']},
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Reenvío - Status: {resend_response.status_code}")
        print(f"Reenvío - Response: {resend_response.text}")
        
        assert resend_response.status_code == 200
        data = resend_response.json()
        assert 'message' in data
        
        print("✅ Reenvío de confirmación exitoso")
    
    def test_server_connectivity(self):
        """Test básico de conectividad con el servidor"""
        try:
            response = requests.get(f"{self.BASE_URL}/auth/users", timeout=5)
            print(f"Conectividad - Status: {response.status_code}")
            print("✅ Servidor accesible")
        except requests.exceptions.ConnectionError:
            pytest.fail("❌ No se puede conectar al servidor. Asegúrate de que esté ejecutándose en localhost:5000")
        except requests.exceptions.Timeout:
            pytest.fail("❌ Timeout conectando al servidor")
    
    def test_registration_validation(self):
        """Test de validación de datos de registro"""
        
        # Test con campos faltantes
        incomplete_user = {
            'email': self.test_user['email'],
            'password': self.test_user['password']
            # Faltan nombre y apellido
        }
        
        response = requests.post(
            f"{self.BASE_URL}/auth/register",
            json=incomplete_user,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Validación - Status: {response.status_code}")
        print(f"Validación - Response: {response.text}")
        
        assert response.status_code == 400
        data = response.json()
        assert 'error' in data
        
        print("✅ Validación de campos requeridos funciona")

def run_manual_tests():
    """Función para ejecutar tests manualmente"""
    print("🧪 Ejecutando tests de integración...")
    print("=" * 50)
    
    test_instance = TestRegistrationIntegration()
    
    try:
        print("\n1. Test de conectividad...")
        test_instance.test_server_connectivity()
        
        print("\n2. Test de registro completo...")
        test_instance.setup_method()
        test_instance.test_full_registration_flow()
        
        print("\n3. Test de email duplicado...")
        test_instance.setup_method()
        test_instance.test_registration_duplicate_email()
        
        print("\n4. Test de reenvío de confirmación...")
        test_instance.setup_method()
        test_instance.test_resend_confirmation()
        
        print("\n5. Test de validación...")
        test_instance.setup_method()
        test_instance.test_registration_validation()
        
        print("\n" + "=" * 50)
        print("🎉 Todos los tests pasaron exitosamente!")
        
    except Exception as e:
        print(f"\n❌ Test falló: {str(e)}")
        return False
    
    return True

if __name__ == '__main__':
    success = run_manual_tests()
    if not success:
        exit(1)
