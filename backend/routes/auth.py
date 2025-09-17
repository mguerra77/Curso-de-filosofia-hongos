from flask import Blueprint, request, jsonify, current_app
from models import db, Usuario, UserRole
from email_service import generate_confirmation_token, send_confirmation_email, generate_password_reset_token, send_password_reset_email
import jwt
from datetime import datetime, timedelta
import time
from config import Config

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/health', methods=['GET'])
def health():
    """Endpoint de health check"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'service': 'auth'
    }), 200

def get_current_user():
    """Función helper para obtener el usuario actual desde el token JWT"""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header.split(' ')[1]
    
    try:
        payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=['HS256'])
        user_id = payload['user_id']
        return Usuario.query.filter_by(id=user_id, activo=True).first()
    except:
        return None

@auth_bp.route('/register', methods=['POST'])
def registro():
    """
    Registra un nuevo usuario y envía email de confirmación
    """
    try:
        data = request.get_json()
        
        # Validaciones
        required_fields = ['email', 'password', 'nombre', 'apellido']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} es requerido'}), 400
        
        # Verificar si el email ya existe
        usuario_existente = Usuario.query.filter_by(email=data['email']).first()
        if usuario_existente:
            return jsonify({'error': 'El email ya está registrado'}), 409
        
        # Generar token de confirmación
        confirmation_token = generate_confirmation_token()
        
        # Crear nuevo usuario
        nuevo_usuario = Usuario(
            email=data['email'],
            nombre=data['nombre'],
            apellido=data['apellido'],
            email_confirmation_token=confirmation_token
        )
        nuevo_usuario.set_password(data['password'])
        
        db.session.add(nuevo_usuario)
        db.session.commit()
        
        # Enviar email de confirmación
        email_sent = send_confirmation_email(
            user_email=nuevo_usuario.email,
            user_name=nuevo_usuario.nombre,
            confirmation_token=confirmation_token
        )
        
        if not email_sent:
            return jsonify({
                'message': 'Usuario registrado pero hubo un error enviando el email de confirmación',
                'usuario': nuevo_usuario.to_dict()
            }), 201
        
        return jsonify({
            'message': 'Usuario registrado exitosamente. Revisa tu email para confirmar tu cuenta.',
            'usuario': nuevo_usuario.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Autentica un usuario y retorna un token JWT
    """
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email y password son requeridos'}), 400
        
        usuario = Usuario.query.filter_by(email=data['email'], activo=True).first()
        
        if not usuario or not usuario.check_password(data['password']):
            return jsonify({'error': 'Credenciales inválidas'}), 401
        
        # Generar token JWT
        payload = {
            'user_id': usuario.id,
            'email': usuario.email,
            'exp': datetime.utcnow() + timedelta(hours=24)
        }
        
        token = jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm='HS256')
        
        return jsonify({
            'message': 'Login exitoso',
            'token': token,
            'usuario': usuario.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/confirm-email', methods=['POST'])
def confirmar_email():
    """
    Confirma el email del usuario usando el token
    """
    try:
        data = request.get_json()
        
        if not data.get('token'):
            return jsonify({'error': 'Token es requerido'}), 400
        
        # Buscar usuario por token
        usuario = Usuario.query.filter_by(email_confirmation_token=data['token']).first()
        
        if not usuario:
            return jsonify({'error': 'Token inválido'}), 400
        
        # Confirmar email
        usuario.email_confirmed = True
        usuario.email_confirmation_token = None  # Limpiar token usado
        db.session.commit()
        
        return jsonify({
            'message': 'Email confirmado exitosamente',
            'usuario': usuario.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/resend-confirmation', methods=['POST'])
def reenviar_confirmacion():
    """
    Reenvía el email de confirmación
    """
    try:
        data = request.get_json()
        
        if not data.get('email'):
            return jsonify({'error': 'Email es requerido'}), 400
        
        # Buscar usuario
        usuario = Usuario.query.filter_by(email=data['email'], activo=True).first()
        
        if not usuario:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        if usuario.email_confirmed:
            return jsonify({'error': 'El email ya está confirmado'}), 400
        
        # Generar nuevo token
        nuevo_token = generate_confirmation_token()
        usuario.email_confirmation_token = nuevo_token
        db.session.commit()
        
        # Enviar email
        email_sent = send_confirmation_email(
            user_email=usuario.email,
            user_name=usuario.nombre,
            confirmation_token=nuevo_token
        )
        
        if not email_sent:
            return jsonify({'error': 'Error al enviar el email'}), 500
        
        return jsonify({
            'message': 'Email de confirmación reenviado exitosamente'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
def obtener_perfil():
    """
    Obtiene el perfil del usuario autenticado
    """
    try:
        usuario = get_current_user()
        if not usuario:
            return jsonify({'error': 'Usuario no autenticado'}), 401
        
        return jsonify({
            'usuario': usuario.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """
    Solicitar reset de contraseña
    """
    try:
        data = request.get_json()
        
        if not data.get('email'):
            return jsonify({'error': 'Email es requerido'}), 400
        
        # Buscar usuario por email
        usuario = Usuario.query.filter_by(email=data['email'], activo=True).first()
        
        if not usuario:
            # Por seguridad, siempre devolvemos el mismo mensaje
            return jsonify({
                'message': 'Si el email existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña'
            }), 200
        
        # Generar token de reset
        reset_token = generate_password_reset_token()
        
        # Establecer token y expiración (1 hora)
        usuario.password_reset_token = reset_token
        usuario.password_reset_expires = datetime.utcnow() + timedelta(hours=1)
        db.session.commit()
        
        # Enviar email
        email_sent = send_password_reset_email(
            usuario.email, 
            usuario.nombre, 
            reset_token
        )
        
        if not email_sent:
            return jsonify({'error': 'Error al enviar el email. Intenta nuevamente más tarde'}), 500
        
        return jsonify({
            'message': 'Si el email existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """
    Restablecer contraseña usando token
    """
    try:
        data = request.get_json()
        
        if not data.get('token') or not data.get('password'):
            return jsonify({'error': 'Token y nueva contraseña son requeridos'}), 400
        
        # Buscar usuario por token válido
        usuario = Usuario.query.filter_by(password_reset_token=data['token']).first()
        
        if not usuario:
            return jsonify({'error': 'Token inválido'}), 400
        
        # Verificar si el token ha expirado
        if not usuario.password_reset_expires or usuario.password_reset_expires < datetime.utcnow():
            return jsonify({'error': 'Token expirado. Solicita un nuevo enlace de restablecimiento'}), 400
        
        # Validar nueva contraseña
        if len(data['password']) < 6:
            return jsonify({'error': 'La contraseña debe tener al menos 6 caracteres'}), 400
        
        # Actualizar contraseña
        usuario.set_password(data['password'])
        usuario.password_reset_token = None  # Limpiar token usado
        usuario.password_reset_expires = None  # Limpiar expiración
        db.session.commit()
        
        return jsonify({
            'message': 'Contraseña restablecida exitosamente'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
