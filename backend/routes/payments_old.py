from flask import Blueprint, request, jsonify, current_app
from models import db, Usuario, UserRole
from werkzeug.utils import secure_filename
import os
import uuid
from datetime import datetime

payments_bp = Blueprint('payments', __name__)

# Configuración para uploads
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf', 'txt'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_current_user():
    """Función helper para obtener el usuario actual desde el token JWT"""
    import jwt
    from config import Config
    
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

@payments_bp.route('/create-transfer', methods=['POST'])
def create_transfer_payment():
    """
    Subir comprobante de transferencia y enviarlo por email al admin
    NOTA: Esta funcionalidad está temporalmente deshabilitada
    El usuario debe enviar un email manual al administrador
    """
    return jsonify({
        'error': 'Esta funcionalidad está temporalmente deshabilitada. ' +
                'Por favor, envía un email manual al administrador para habilitar tu acceso.'
    }), 503  # Service Unavailable

# @payments_bp.route('/create-transfer', methods=['POST'])
# def create_transfer_payment():
#     """
#     Subir comprobante de transferencia y enviarlo por email al admin
#     """
#     try:
#         # Verificar autenticación
#         usuario = get_current_user()
#         if not usuario:
#             return jsonify({'error': 'Usuario no autenticado'}), 401
#         
#         # Validar archivo
#         if 'comprobante' not in request.files:
#             return jsonify({'error': 'El comprobante es requerido'}), 400
#         
#         file = request.files['comprobante']
#         if file.filename == '':
#             return jsonify({'error': 'No se seleccionó archivo'}), 400
#         
#         if not allowed_file(file.filename):
#             return jsonify({
#                 'error': 'Tipo de archivo no permitido. Solo PNG, JPG, JPEG, PDF'
#             }), 400
#         
#         # Guardar archivo
#         filename = secure_filename(file.filename)
#         # Agregar timestamp y UUID para evitar colisiones
#         name, ext = os.path.splitext(filename)
#         # Usar nombre y apellido en lugar de email
#         nombre_completo = f"{usuario.nombre}_{usuario.apellido}".replace(" ", "_")
#         unique_filename = f"{nombre_completo}_{uuid.uuid4().hex[:8]}{ext}"
#         
#         uploads_dir = os.path.join(current_app.config['UPLOAD_FOLDER'])
#         os.makedirs(uploads_dir, exist_ok=True)
#         
#         file_path = os.path.join(uploads_dir, unique_filename)
#         file.save(file_path)
#         
#         return jsonify({
#             'message': 'Comprobante subido exitosamente. Serás notificado cuando sea aprobado.',
#             'filename': unique_filename
#         }), 201
#         
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

@payments_bp.route('/list-comprobantes', methods=['GET'])
def list_comprobantes():
    """
    Listar todos los comprobantes subidos (solo para admin)
    """
    try:
        usuario = get_current_user()
        if not usuario:
            return jsonify({'error': 'Usuario no autenticado'}), 401
        
        # Verificar que sea admin
        if not usuario.is_admin():
            return jsonify({'error': 'Acceso denegado. Se requieren permisos de administrador'}), 403
        
        uploads_dir = os.path.join(current_app.config['UPLOAD_FOLDER'])
        
        if not os.path.exists(uploads_dir):
            return jsonify({'comprobantes': []}), 200
        
        files = []
        for filename in os.listdir(uploads_dir):
            if filename != '.gitkeep':
                file_path = os.path.join(uploads_dir, filename)
                if os.path.isfile(file_path):
                    # Obtener información del archivo
                    stat = os.stat(file_path)
                    files.append({
                        'filename': filename,
                        'size': stat.st_size,
                        'created': datetime.fromtimestamp(stat.st_ctime).isoformat(),
                        'url': f'/uploads/{filename}'
                    })
        
        # Ordenar por fecha de creación (más recientes primero)
        files.sort(key=lambda x: x['created'], reverse=True)
        
        return jsonify({'comprobantes': files}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
