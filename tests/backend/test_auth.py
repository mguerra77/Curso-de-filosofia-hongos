import pytest
import json
import sys
import os

# Agregar el directorio backend al path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../backend'))

from app import create_app
from models import db, Usuario
from email_service import generate_confirmation_token
from config import Config

@pytest.fixture
def app():
    """Crear aplicación Flask para testing"""
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'  # Base de datos en memoria para tests
    
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()

@pytest.fixture
def client(app):
    """Cliente de prueba para hacer requests"""
    return app.test_client()

@pytest.fixture
def sample_user_data():
    """Datos de usuario de ejemplo para tests"""
    return {
        'email': 'test@example.com',
        'password': 'password123',
        'nombre': 'Test',
        'apellido': 'User'
    }

class TestUserRegistration:
    """Tests para el registro de usuarios"""
    
    def test_register_success(self, client, sample_user_data):
        """Test de registro exitoso"""
        response = client.post('/api/auth/register', 
                             data=json.dumps(sample_user_data),
                             content_type='application/json')
        
        assert response.status_code == 201
        data = json.loads(response.data)
        assert 'message' in data
        assert 'usuario' in data
        assert data['usuario']['email'] == sample_user_data['email']
        assert data['usuario']['email_confirmed'] == False
        
    def test_register_duplicate_email(self, client, sample_user_data):
        """Test de registro con email duplicado"""
        # Registrar usuario primera vez
        client.post('/api/auth/register',
                   data=json.dumps(sample_user_data),
                   content_type='application/json')
        
        # Intentar registrar con el mismo email
        response = client.post('/api/auth/register',
                             data=json.dumps(sample_user_data),
                             content_type='application/json')
        
        assert response.status_code == 409
        data = json.loads(response.data)
        assert 'error' in data
        assert 'ya está registrado' in data['error']
        
    def test_register_missing_fields(self, client):
        """Test de registro con campos faltantes"""
        incomplete_data = {
            'email': 'test@example.com',
            'password': 'password123'
            # Faltan nombre y apellido
        }
        
        response = client.post('/api/auth/register',
                             data=json.dumps(incomplete_data),
                             content_type='application/json')
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data

class TestEmailConfirmation:
    """Tests para confirmación de email"""
    
    def test_confirm_email_success(self, client, app, sample_user_data):
        """Test de confirmación de email exitosa"""
        with app.app_context():
            # Crear usuario con token de confirmación
            token = generate_confirmation_token()
            user = Usuario(
                email=sample_user_data['email'],
                nombre=sample_user_data['nombre'],
                apellido=sample_user_data['apellido'],
                email_confirmation_token=token
            )
            user.set_password(sample_user_data['password'])
            db.session.add(user)
            db.session.commit()
            
            # Confirmar email
            response = client.post('/api/auth/confirm-email',
                                 data=json.dumps({'token': token}),
                                 content_type='application/json')
            
            assert response.status_code == 200
            data = json.loads(response.data)
            assert 'message' in data
            assert data['usuario']['email_confirmed'] == True
            
            # Verificar que el token se haya eliminado
            updated_user = Usuario.query.filter_by(email=sample_user_data['email']).first()
            assert updated_user.email_confirmation_token is None
    
    def test_confirm_email_invalid_token(self, client):
        """Test de confirmación con token inválido"""
        response = client.post('/api/auth/confirm-email',
                             data=json.dumps({'token': 'invalid_token'}),
                             content_type='application/json')
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data
        assert 'inválido' in data['error']
    
    def test_resend_confirmation_success(self, client, app, sample_user_data):
        """Test de reenvío de confirmación exitoso"""
        with app.app_context():
            # Crear usuario sin email confirmado
            user = Usuario(
                email=sample_user_data['email'],
                nombre=sample_user_data['nombre'],
                apellido=sample_user_data['apellido'],
                email_confirmed=False
            )
            user.set_password(sample_user_data['password'])
            db.session.add(user)
            db.session.commit()
            
            # Solicitar reenvío de confirmación
            response = client.post('/api/auth/resend-confirmation',
                                 data=json.dumps({'email': sample_user_data['email']}),
                                 content_type='application/json')
            
            assert response.status_code == 200
            data = json.loads(response.data)
            assert 'message' in data
            
            # Verificar que se haya generado un nuevo token
            updated_user = Usuario.query.filter_by(email=sample_user_data['email']).first()
            assert updated_user.email_confirmation_token is not None
    
    def test_resend_confirmation_already_confirmed(self, client, app, sample_user_data):
        """Test de reenvío cuando email ya está confirmado"""
        with app.app_context():
            # Crear usuario con email ya confirmado
            user = Usuario(
                email=sample_user_data['email'],
                nombre=sample_user_data['nombre'],
                apellido=sample_user_data['apellido'],
                email_confirmed=True
            )
            user.set_password(sample_user_data['password'])
            db.session.add(user)
            db.session.commit()
            
            # Intentar reenviar confirmación
            response = client.post('/api/auth/resend-confirmation',
                                 data=json.dumps({'email': sample_user_data['email']}),
                                 content_type='application/json')
            
            assert response.status_code == 400
            data = json.loads(response.data)
            assert 'error' in data
            assert 'ya está confirmado' in data['error']
    
    def test_resend_confirmation_user_not_found(self, client):
        """Test de reenvío para usuario inexistente"""
        response = client.post('/api/auth/resend-confirmation',
                             data=json.dumps({'email': 'nonexistent@example.com'}),
                             content_type='application/json')
        
        assert response.status_code == 404
        data = json.loads(response.data)
        assert 'error' in data
        assert 'no encontrado' in data['error']

class TestUserLogin:
    """Tests para login de usuarios"""
    
    def test_login_success(self, client, app, sample_user_data):
        """Test de login exitoso"""
        with app.app_context():
            # Crear usuario confirmado
            user = Usuario(
                email=sample_user_data['email'],
                nombre=sample_user_data['nombre'],
                apellido=sample_user_data['apellido'],
                email_confirmed=True
            )
            user.set_password(sample_user_data['password'])
            db.session.add(user)
            db.session.commit()
            
            # Hacer login
            login_data = {
                'email': sample_user_data['email'],
                'password': sample_user_data['password']
            }
            
            response = client.post('/api/auth/login',
                                 data=json.dumps(login_data),
                                 content_type='application/json')
            
            assert response.status_code == 200
            data = json.loads(response.data)
            assert 'token' in data
            assert 'usuario' in data
            assert data['usuario']['email'] == sample_user_data['email']
    
    def test_login_invalid_credentials(self, client, app, sample_user_data):
        """Test de login con credenciales incorrectas"""
        with app.app_context():
            # Crear usuario
            user = Usuario(
                email=sample_user_data['email'],
                nombre=sample_user_data['nombre'],
                apellido=sample_user_data['apellido']
            )
            user.set_password(sample_user_data['password'])
            db.session.add(user)
            db.session.commit()
            
            # Intentar login con contraseña incorrecta
            login_data = {
                'email': sample_user_data['email'],
                'password': 'wrong_password'
            }
            
            response = client.post('/api/auth/login',
                                 data=json.dumps(login_data),
                                 content_type='application/json')
            
            assert response.status_code == 401
            data = json.loads(response.data)
            assert 'error' in data
            assert 'inválidas' in data['error']

if __name__ == '__main__':
    pytest.main([__file__, '-v'])
