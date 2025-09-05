from flask import Blueprint, request, jsonify, current_app
from models import db, Usuario, UserRole
import jwt
from config import Config

admin_bp = Blueprint('admin', __name__)

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

def require_admin():
    """Verificar que el usuario actual sea admin"""
    usuario = get_current_user()
    if not usuario:
        return None, {'error': 'Usuario no autenticado'}, 401
    
    if not usuario.is_admin():
        return None, {'error': 'Acceso denegado. Se requieren permisos de administrador'}, 403
    
    return usuario, None, None

@admin_bp.route('/users', methods=['GET'])
def listar_usuarios():
    """
    Lista todos los usuarios (solo para admins)
    """
    try:
        usuario, error, status = require_admin()
        if error:
            return jsonify(error), status
        
        usuarios = Usuario.query.all()
        usuarios_data = []
        
        for user in usuarios:
            user_dict = user.to_dict()
            usuarios_data.append(user_dict)
        
        return jsonify({
            'usuarios': usuarios_data,
            'total': len(usuarios_data)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/activate-user', methods=['POST'])
def activar_usuario():
    """
    Activar un usuario específico (solo para admins)
    """
    try:
        usuario, error, status = require_admin()
        if error:
            return jsonify(error), status
        
        data = request.get_json()
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({'error': 'user_id es requerido'}), 400
        
        target_user = Usuario.query.get(user_id)
        if not target_user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        target_user.activo = True
        db.session.commit()
        
        return jsonify({
            'message': f'Usuario {target_user.email} activado exitosamente',
            'usuario': target_user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/deactivate-user', methods=['POST'])
def desactivar_usuario():
    """
    Desactivar un usuario específico (solo para admins)
    """
    try:
        usuario, error, status = require_admin()
        if error:
            return jsonify(error), status
        
        data = request.get_json()
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({'error': 'user_id es requerido'}), 400
        
        target_user = Usuario.query.get(user_id)
        if not target_user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        # No permitir desactivar al propio usuario admin
        if target_user.id == usuario.id:
            return jsonify({'error': 'No puedes desactivar tu propia cuenta'}), 400
        
        target_user.activo = False
        db.session.commit()
        
        return jsonify({
            'message': f'Usuario {target_user.email} desactivado exitosamente',
            'usuario': target_user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/grant-access', methods=['POST'])
def otorgar_acceso():
    """
    Otorgar acceso al curso a un usuario específico (solo para admins)
    """
    try:
        usuario, error, status = require_admin()
        if error:
            return jsonify(error), status
        
        data = request.get_json()
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({'error': 'user_id es requerido'}), 400
        
        target_user = Usuario.query.get(user_id)
        if not target_user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        target_user.has_access = True
        db.session.commit()
        
        return jsonify({
            'message': f'Acceso al curso otorgado a {target_user.email}',
            'usuario': target_user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/revoke-access', methods=['POST'])
def revocar_acceso():
    """
    Revocar acceso al curso a un usuario específico (solo para admins)
    """
    try:
        usuario, error, status = require_admin()
        if error:
            return jsonify(error), status
        
        data = request.get_json()
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({'error': 'user_id es requerido'}), 400
        
        target_user = Usuario.query.get(user_id)
        if not target_user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        # No permitir revocar acceso a admins
        if target_user.is_admin():
            return jsonify({'error': 'No se puede revocar acceso a un administrador'}), 400
        
        target_user.has_access = False
        db.session.commit()
        
        return jsonify({
            'message': f'Acceso al curso revocado para {target_user.email}',
            'usuario': target_user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
