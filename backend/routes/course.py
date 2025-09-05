from flask import Blueprint, request, jsonify, current_app
from models import db, Usuario, CourseContent
from werkzeug.utils import secure_filename
import jwt
import os
import uuid
from datetime import datetime
from config import Config

course_bp = Blueprint('course', __name__)

# Configuración para uploads
ALLOWED_VIDEO_EXTENSIONS = {'mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'}

def allowed_video_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_VIDEO_EXTENSIONS

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

@course_bp.route('/check-access', methods=['GET'])
def verificar_acceso_curso():
    """
    Verificar si el usuario actual tiene acceso al curso
    """
    try:
        usuario = get_current_user()
        if not usuario:
            return jsonify({'error': 'Usuario no autenticado'}), 401
        
        return jsonify({
            'has_access': usuario.has_course_access(),
            'usuario': usuario.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@course_bp.route('/content', methods=['GET'])
def obtener_contenido_curso():
    """
    Obtener el contenido del curso (videos y material)
    """
    try:
        from models import CourseContent
        
        usuario = get_current_user()
        if not usuario:
            return jsonify({'error': 'Usuario no autenticado'}), 401
        
        # Verificar acceso al curso
        if not usuario.has_course_access():
            return jsonify({'error': 'No tienes acceso al curso'}), 403
        
        # Obtener contenido del curso
        content_list = CourseContent.query.order_by(CourseContent.video_id).all()
        
        videos = []
        for content in content_list:
            videos.append(content.to_dict())
        
        return jsonify({
            'videos': videos,
            'usuario': usuario.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@course_bp.route('/content/<int:video_id>', methods=['PUT'])
def actualizar_contenido_curso(video_id):
    """
    Actualizar contenido del curso (solo para admins)
    """
    try:
        from models import CourseContent
        
        usuario, error, status = require_admin()
        if error:
            return jsonify(error), status
        
        data = request.get_json()
        
        # Buscar o crear contenido
        content = CourseContent.query.filter_by(video_id=video_id).first()
        
        if not content:
            content = CourseContent(video_id=video_id)
            db.session.add(content)
        
        # Actualizar campos permitidos
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
        
        db.session.commit()
        
        return jsonify({
            'message': 'Contenido actualizado exitosamente',
            'content': content.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@course_bp.route('/upload-video/<int:video_id>', methods=['POST'])
def upload_video_curso(video_id):
    """
    Subir video para un módulo específico del curso (solo para admins)
    """
    try:
        from models import CourseContent
        
        usuario, error, status = require_admin()
        if error:
            return jsonify(error), status
        
        if 'video' not in request.files:
            return jsonify({'error': 'No se encontró el archivo de video'}), 400
        
        file = request.files['video']
        
        if file.filename == '':
            return jsonify({'error': 'No se seleccionó ningún archivo'}), 400
        
        if file and allowed_video_file(file.filename):
            # Crear nombre seguro para el archivo
            timestamp = int(datetime.now().timestamp())
            filename = f"video_{video_id}_{timestamp}.{file.filename.rsplit('.', 1)[1].lower()}"
            
            # Crear directorio si no existe
            upload_dir = os.path.join(current_app.config['UPLOAD_FOLDER'], 'videos')
            os.makedirs(upload_dir, exist_ok=True)
            
            # Guardar archivo
            file_path = os.path.join(upload_dir, filename)
            file.save(file_path)
            
            # Actualizar o crear registro en la base de datos
            content = CourseContent.query.filter_by(video_id=video_id).first()
            if not content:
                content = CourseContent(video_id=video_id)
                db.session.add(content)
            
            content.video_url = f"/uploads/videos/{filename}"
            db.session.commit()
            
            return jsonify({
                'message': 'Video subido exitosamente',
                'filename': filename,
                'video_url': content.video_url,
                'content': content.to_dict()
            }), 200
        
        return jsonify({'error': 'Tipo de archivo no permitido'}), 400
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@course_bp.route('/upload-video', methods=['POST'])
def upload_video_general():
    """
    Subir video general (funcionalidad legacy, solo para admins)
    """
    try:
        usuario, error, status = require_admin()
        if error:
            return jsonify(error), status
        
        if 'video' not in request.files:
            return jsonify({'error': 'No video file'}), 400
        
        file = request.files['video']
        
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        if file and allowed_video_file(file.filename):
            # Generar nombre único
            timestamp = int(datetime.now().timestamp())
            unique_id = str(uuid.uuid4())[:8]
            original_name = secure_filename(file.filename.rsplit('.', 1)[0])
            extension = file.filename.rsplit('.', 1)[1].lower()
            filename = f"{original_name}_{timestamp}.{extension}"
            
            # Crear directorio si no existe
            upload_dir = os.path.join(current_app.config['UPLOAD_FOLDER'], 'videos')
            os.makedirs(upload_dir, exist_ok=True)
            
            # Guardar archivo
            file_path = os.path.join(upload_dir, filename)
            file.save(file_path)
            
            return jsonify({
                'message': 'Video uploaded successfully',
                'filename': filename,
                'file_path': f"/uploads/videos/{filename}"
            }), 200
        
        return jsonify({'error': 'Invalid file type'}), 400
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
