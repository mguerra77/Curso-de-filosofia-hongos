from flask import Blueprint, request, jsonify, current_app
from models import db, Usuario, UserRole
from email_service import generate_confirmation_token, send_confirmation_email, generate_password_reset_token, send_password_reset_email
import jwt
from datetime import datetime, timedelta
import time
from config import Config

auth_bp = Blueprint('auth', __name__)

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
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/resend-confirmation', methods=['POST'])
def reenviar_confirmacion():
    """
    Reenvía email de confirmación
    """
    try:
        data = request.get_json()
        
        if not data.get('email'):
            return jsonify({'error': 'Email es requerido'}), 400
        
        # Buscar usuario
        usuario = Usuario.query.filter_by(email=data['email']).first()
        
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
            return jsonify({'error': 'Error enviando email'}), 500
        
        return jsonify({
            'message': 'Email de confirmación reenviado'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
def perfil():
    """
    Obtiene el perfil del usuario autenticado
    """
    try:
        # Obtener token del header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Token requerido'}), 401
        
        token = auth_header.split(' ')[1]
        
        # Decodificar token
        try:
            payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=['HS256'])
            user_id = payload['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token inválido'}), 401
        
        # Obtener usuario
        usuario = Usuario.query.filter_by(id=user_id, activo=True).first()
        if not usuario:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        return jsonify(usuario.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/users', methods=['GET'])
def obtener_usuarios():
    """
    Obtiene todos los usuarios registrados (solo admin)
    """
    try:
        # Verificar que sea admin
        admin_user, error_response, status_code = require_admin()
        if error_response:
            return jsonify(error_response), status_code
        
        # Obtener todos los usuarios (incluyendo activos e inactivos)
        usuarios = Usuario.query.all()
        
        # Convertir a diccionario
        usuarios_data = []
        for usuario in usuarios:
            user_dict = usuario.to_dict()
            usuarios_data.append(user_dict)
        
        return jsonify({
            'usuarios': usuarios_data,
            'total': len(usuarios_data)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/admin/activate-user', methods=['POST'])
def activar_usuario():
    """
    Activa un usuario y le da acceso al curso (solo admin)
    """
    try:
        # Verificar que sea admin
        admin_user, error_response, status_code = require_admin()
        if error_response:
            return jsonify(error_response), status_code
        
        # Obtener datos de la petición
        data = request.get_json()
        if not data.get('user_id'):
            return jsonify({'error': 'user_id es requerido'}), 400
        
        # Buscar el usuario a activar
        usuario_a_activar = Usuario.query.filter_by(id=data['user_id']).first()
        if not usuario_a_activar:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        # Activar usuario y darle acceso al curso
        usuario_a_activar.activo = True
        usuario_a_activar.has_access = True
        db.session.commit()
        
        return jsonify({
            'message': f'Usuario {usuario_a_activar.nombre} {usuario_a_activar.apellido} activado con acceso al curso',
            'usuario': usuario_a_activar.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/admin/deactivate-user', methods=['POST'])
def desactivar_usuario():
    """
    Desactiva un usuario (solo admin)
    """
    try:
        # Verificar que sea admin
        admin_user, error_response, status_code = require_admin()
        if error_response:
            return jsonify(error_response), status_code
        
        # Obtener datos de la petición
        data = request.get_json()
        if not data.get('user_id'):
            return jsonify({'error': 'user_id es requerido'}), 400
        
        # No permitir que un admin se desactive a sí mismo
        if data['user_id'] == admin_user.id:
            return jsonify({'error': 'No puedes desactivarte a ti mismo'}), 400
        
        # Buscar el usuario a desactivar
        usuario_a_desactivar = Usuario.query.filter_by(id=data['user_id']).first()
        if not usuario_a_desactivar:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        # Desactivar usuario y remover acceso al curso
        usuario_a_desactivar.activo = False
        usuario_a_desactivar.has_access = False
        db.session.commit()
        
        return jsonify({
            'message': f'Usuario {usuario_a_desactivar.nombre} {usuario_a_desactivar.apellido} desactivado',
            'usuario': usuario_a_desactivar.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/admin/grant-access', methods=['POST'])
def otorgar_acceso():
    """
    Otorga acceso al curso a un usuario (solo admin)
    """
    try:
        # Verificar que sea admin
        admin_user, error_response, status_code = require_admin()
        if error_response:
            return jsonify(error_response), status_code
        
        # Obtener datos de la petición
        data = request.get_json()
        if not data.get('user_id'):
            return jsonify({'error': 'user_id es requerido'}), 400
        
        # Buscar el usuario
        usuario = Usuario.query.filter_by(id=data['user_id']).first()
        if not usuario:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        # Otorgar acceso al curso
        usuario.has_access = True
        db.session.commit()
        
        return jsonify({
            'message': f'Acceso al curso otorgado a {usuario.nombre} {usuario.apellido}',
            'usuario': usuario.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/admin/revoke-access', methods=['POST'])
def revocar_acceso():
    """
    Revoca acceso al curso a un usuario (solo admin)
    """
    try:
        # Verificar que sea admin
        admin_user, error_response, status_code = require_admin()
        if error_response:
            return jsonify(error_response), status_code
        
        # Obtener datos de la petición
        data = request.get_json()
        if not data.get('user_id'):
            return jsonify({'error': 'user_id es requerido'}), 400
        
        # Buscar el usuario
        usuario = Usuario.query.filter_by(id=data['user_id']).first()
        if not usuario:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        # Revocar acceso al curso
        usuario.has_access = False
        db.session.commit()
        
        return jsonify({
            'message': f'Acceso al curso revocado a {usuario.nombre} {usuario.apellido}',
            'usuario': usuario.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/check-course-access', methods=['GET'])
def verificar_acceso_curso():
    """
    Verifica si el usuario tiene acceso al contenido del curso
    """
    try:
        usuario = get_current_user()
        if not usuario:
            return jsonify({'error': 'Usuario no autenticado'}), 401
        
        has_access = usuario.has_course_access()
        
        return jsonify({
            'has_access': has_access,
            'user_info': {
                'nombre': usuario.nombre,
                'apellido': usuario.apellido,
                'email': usuario.email,
                'activo': usuario.activo,
                'rol': usuario.rol
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Rutas del contenido del curso (minimalistas)
@auth_bp.route('/course/content', methods=['GET'])
def get_course_content():
    """Obtener todo el contenido del curso"""
    from models import CourseContent
    
    user = get_current_user()
    if not user or not user.has_course_access():
        return jsonify({'error': 'Acceso denegado'}), 403
    
    # Datos por defecto si no hay contenido en BD
    default_videos = [
        {
            'id': 1,
            'title': "Introducción a la Filosofía de los Hongos",
            'description': "En esta primera clase exploraremos los fundamentos filosóficos que sustentan nuestra aproximación al reino fungi y su relación con la consciencia humana.",
            'duration': "25:30",
            'views': 1247,
            'date': "Enero 2025",
            'module': "Módulo 1",
            'video_url': "",
            'reading_material': "Documentos y artículos complementarios para profundizar en el tema."
        },
        {
            'id': 2,
            'title': "Historia del Uso Ritual de los Psicodélicos",
            'description': "Un recorrido histórico por las diferentes culturas que han incorporado los hongos psicodélicos en sus prácticas espirituales y rituales.",
            'duration': "32:15",
            'views': 1156,
            'date': "Enero 2025",
            'module': "Módulo 1",
            'video_url': "",
            'reading_material': "Material complementario sobre historia de los psicodélicos."
        },
        {
            'id': 3,
            'title': "Neurociencia y Consciencia Alterada",
            'description': "Análisis de los mecanismos neurológicos involucrados en las experiencias psicodélicas y su impacto en la percepción de la realidad.",
            'duration': "28:45",
            'views': 1089,
            'date': "Enero 2025",
            'module': "Módulo 2",
            'video_url': "",
            'reading_material': "Estudios científicos sobre neurociencia y psicodélicos."
        },
        {
            'id': 4,
            'title': "Ética y Responsabilidad en el Uso de Psicodélicos",
            'description': "Discusión sobre las consideraciones éticas fundamentales para el uso responsable de sustancias psicodélicas en contextos terapéuticos y personales.",
            'duration': "30:20",
            'views': 967,
            'date': "Febrero 2025",
            'module': "Módulo 2",
            'video_url': "",
            'reading_material': "Guías éticas para el uso responsable."
        },
        {
            'id': 5,
            'title': "El Futuro de la Terapia Psicodélica",
            'description': "Perspectivas futuras sobre el desarrollo de la terapia asistida con psicodélicos y su integración en el sistema de salud mental.",
            'duration': "35:10",
            'views': 832,
            'date': "Febrero 2025",
            'module': "Módulo 3",
            'video_url': "",
            'reading_material': "Investigaciones sobre el futuro de la terapia psicodélica."
        }
    ]
    
    # Buscar contenido existente en BD
    content_list = CourseContent.query.order_by(CourseContent.video_id).all()
    
    if content_list:
        # Si hay contenido en BD, usarlo
        videos = [content.to_dict() for content in content_list]
    else:
        # Si no hay contenido, usar datos por defecto
        videos = default_videos
    
    return jsonify({'videos': videos}), 200

@auth_bp.route('/course/content/<int:video_id>', methods=['PUT'])
def update_course_content(video_id):
    """Actualizar contenido específico - solo admins"""
    from models import CourseContent
    
    user = get_current_user()
    if not user or not user.is_admin():
        return jsonify({'error': 'Solo administradores pueden editar contenido'}), 403
    
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No hay datos para actualizar'}), 400
    
    # Buscar contenido existente
    content = CourseContent.query.filter_by(video_id=video_id).first()
    
    if not content:
        # Crear nuevo contenido
        content = CourseContent(video_id=video_id)
        db.session.add(content)
    
    # Actualizar campos
    if 'title' in data:
        content.title = data['title']
    if 'description' in data:
        content.description = data['description']
    if 'duration' in data:
        content.duration = data['duration']
    if 'module' in data:
        content.module = data['module']
    if 'video_url' in data:
        content.video_url = data['video_url']
    if 'reading_material' in data:
        content.reading_material = data['reading_material']
    
    try:
        db.session.commit()
        return jsonify(content.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error al guardar'}), 500

@auth_bp.route('/course/upload-video/<int:video_id>', methods=['POST'])
def upload_video_to_content(video_id):
    """Subir archivo de video - solo admins"""
    from models import CourseContent
    from werkzeug.utils import secure_filename
    import os
    
    user = get_current_user()
    if not user or not user.is_admin():
        return jsonify({'error': 'Solo administradores pueden subir videos'}), 403
    
    if 'video' not in request.files:
        return jsonify({'error': 'No se encontró archivo de video'}), 400
    
    file = request.files['video']
    if file.filename == '':
        return jsonify({'error': 'No se seleccionó archivo'}), 400
    
    # Verificar extensión
    allowed_extensions = {'.mp4', '.mov', '.avi', '.mkv'}
    if not any(file.filename.lower().endswith(ext) for ext in allowed_extensions):
        return jsonify({'error': 'Solo se permiten archivos de video (.mp4, .mov, .avi, .mkv)'}), 400

@auth_bp.route('/upload_video', methods=['POST'])
def upload_video():
    """Subir archivo de video genérico - solo admins"""
    from werkzeug.utils import secure_filename
    import os
    
    user = get_current_user()
    if not user or not user.is_admin():
        return jsonify({'error': 'Solo administradores pueden subir videos'}), 403
    
    if 'video' not in request.files:
        return jsonify({'error': 'No se encontró archivo de video'}), 400
    
    file = request.files['video']
    if file.filename == '':
        return jsonify({'error': 'No se seleccionó archivo'}), 400
    
    # Verificar extensión
    allowed_extensions = {'.mp4', '.mov', '.avi', '.mkv'}
    if not any(file.filename.lower().endswith(ext) for ext in allowed_extensions):
        return jsonify({'error': 'Solo se permiten archivos de video (.mp4, .mov, .avi, .mkv)'}), 400
    
    try:
        # Crear directorio si no existe
        upload_dir = os.path.join(current_app.root_path, 'uploads', 'videos')
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generar nombre seguro
        filename = secure_filename(file.filename)
        timestamp = str(int(time.time()))
        name, ext = os.path.splitext(filename)
        final_filename = f"{name}_{timestamp}{ext}"
        
        # Guardar archivo
        filepath = os.path.join(upload_dir, final_filename)
        file.save(filepath)
        
        # Devolver URL relativa
        video_url = f"/uploads/videos/{final_filename}"
        
        return jsonify({
            'success': True,
            'video_url': video_url,
            'filename': final_filename
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Error al subir archivo: {str(e)}'}), 500
    
    try:
        # Generar nombre de archivo seguro
        filename = secure_filename(file.filename)
        # Agregar prefijo con video_id para evitar conflictos
        filename = f"video_{video_id}_{filename}"
        
        # Guardar archivo
        upload_path = os.path.join('uploads', 'videos', filename)
        file.save(upload_path)
        
        # Actualizar base de datos
        content = CourseContent.query.filter_by(video_id=video_id).first()
        if not content:
            content = CourseContent(video_id=video_id)
            db.session.add(content)
        
        # URL relativa para el frontend
        content.video_url = f'/uploads/videos/{filename}'
        
        db.session.commit()
        
        return jsonify({
            'message': 'Video subido exitosamente',
            'video_url': content.video_url
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error al subir video: {str(e)}'}), 500

# ============================================================================
# MERCADO PAGO ENDPOINTS
# ============================================================================

@auth_bp.route('/mp-debug', methods=['GET'])
def mp_debug():
    """Debug de configuración de Mercado Pago - TEMPORAL"""
    from config import Config
    import os
    
    user = get_current_user()
    if not user or not user.is_admin():
        return jsonify({'error': 'Solo administradores'}), 403
    
    # Debug completo
    return jsonify({
        'access_token_set': bool(Config.MP_ACCESS_TOKEN),
        'access_token_prefix': Config.MP_ACCESS_TOKEN[:20] + '...' if Config.MP_ACCESS_TOKEN else None,
        'public_key_set': bool(Config.MP_PUBLIC_KEY),
        'public_key_prefix': Config.MP_PUBLIC_KEY[:20] + '...' if Config.MP_PUBLIC_KEY else None,
        'success_url': Config.MP_SUCCESS_URL,
        'failure_url': Config.MP_FAILURE_URL,
        'pending_url': Config.MP_PENDING_URL,
        'env_variables': {
            'MP_SUCCESS_URL': os.environ.get('MP_SUCCESS_URL'),
            'MP_FAILURE_URL': os.environ.get('MP_FAILURE_URL'),
            'MP_PENDING_URL': os.environ.get('MP_PENDING_URL'),
            'MP_ACCESS_TOKEN_SET': bool(os.environ.get('MP_ACCESS_TOKEN')),
            'MP_PUBLIC_KEY_SET': bool(os.environ.get('MP_PUBLIC_KEY'))
        }
    }), 200

@auth_bp.route('/create-preference', methods=['POST'])
def create_mp_preference():
    """Crear preferencia de pago de Mercado Pago"""
    from mercadopago_service import mp_service
    
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Usuario no autenticado'}), 401
    
    try:
        data = request.get_json()
        
        # Preparar datos del pago
        payment_data = {
            'title': 'Curso: La filosofía secreta de los hongos',
            'description': 'Acceso completo al curso online sobre filosofía y hongos',
            'price': data.get('amount', 1000),
            'quantity': 1,
            'payer': {
                'nombre': data.get('nombre', ''),
                'apellido': data.get('apellido', ''),
                'email': data.get('email', ''),
                'telefono': data.get('telefono', ''),
                'documento': data.get('documento', '')
            },
            'external_reference': f"user_{user.id}_course_purchase_{int(time.time())}"
        }
        
        # Crear preferencia
        result = mp_service.create_preference(payment_data)
        
        if result['success']:
            return jsonify({
                'preference_id': result['preference_id'],
                'init_point': result['init_point']
            }), 200
        else:
            return jsonify({'error': result['error']}), 400
            
    except Exception as e:
        return jsonify({'error': f'Error al crear preferencia: {str(e)}'}), 500

@auth_bp.route('/webhook/mercadopago', methods=['POST'])
def mercadopago_webhook():
    """Webhook para notificaciones de Mercado Pago"""
    from mercadopago_service import mp_service
    from models import Usuario
    
    try:
        webhook_data = request.get_json()
        
        # Procesar webhook
        result = mp_service.process_webhook(webhook_data)
        
        if result['success'] and result['payment_status'] == 'approved':
            # Extraer user_id de external_reference
            external_ref = result.get('external_reference', '')
            if 'user_' in external_ref:
                try:
                    user_id = int(external_ref.split('user_')[1].split('_')[0])
                    
                    # Activar acceso al usuario
                    user = Usuario.query.get(user_id)
                    if user:
                        user.has_access = True
                        db.session.commit()
                        
                        # Log del pago exitoso
                        current_app.logger.info(f"Payment approved for user {user_id}: {result['payment_id']}")
                        
                except (ValueError, IndexError):
                    current_app.logger.error(f"Error parsing user_id from external_reference: {external_ref}")
        
        return jsonify({'status': 'ok'}), 200
        
    except Exception as e:
        current_app.logger.error(f"Webhook error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/payment-status/<payment_id>', methods=['GET'])
def get_payment_status(payment_id):
    """Obtener estado de un pago específico"""
    from mercadopago_service import mp_service
    
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Usuario no autenticado'}), 401
    
    try:
        result = mp_service.get_payment_info(payment_id)
        
        if result['success']:
            payment = result['payment']
            return jsonify({
                'status': payment.get('status'),
                'status_detail': payment.get('status_detail'),
                'external_reference': payment.get('external_reference'),
                'amount': payment.get('transaction_amount'),
                'payment_method': payment.get('payment_method_id')
            }), 200
        else:
            return jsonify({'error': result['error']}), 400
            
    except Exception as e:
        return jsonify({'error': f'Error al obtener estado del pago: {str(e)}'}), 500

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
