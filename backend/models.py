from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from enum import Enum

db = SQLAlchemy()

class UserRole(Enum):
    USER = "user"
    ADMIN = "admin"

class Usuario(db.Model):
    __tablename__ = 'usuarios'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    nombre = db.Column(db.String(100), nullable=False)
    apellido = db.Column(db.String(100), nullable=False)
    fecha_registro = db.Column(db.DateTime, default=datetime.utcnow)
    activo = db.Column(db.Boolean, default=True)
    # Nuevos campos
    rol = db.Column(db.String(10), default=UserRole.USER.value, nullable=False)
    has_access = db.Column(db.Boolean, default=False)  # Acceso al contenido del curso
    email_confirmed = db.Column(db.Boolean, default=False)  # Confirmación de email
    email_confirmation_token = db.Column(db.String(255), nullable=True)  # Token de confirmación
    password_reset_token = db.Column(db.String(255), nullable=True)  # Token de reset de contraseña
    password_reset_expires = db.Column(db.DateTime, nullable=True)  # Expiración del token
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def is_admin(self):
        return self.rol == UserRole.ADMIN.value
    
    def has_course_access(self):
        return self.has_access and self.activo
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'nombre': self.nombre,
            'apellido': self.apellido,
            'fecha_registro': self.fecha_registro.isoformat(),
            'activo': self.activo,
            'rol': self.rol,
            'has_access': self.has_access,
            'email_confirmed': self.email_confirmed
        }

class CourseContent(db.Model):
    __tablename__ = 'course_content'
    
    id = db.Column(db.Integer, primary_key=True)
    video_id = db.Column(db.Integer, unique=True, nullable=False)  # ID del video (1-5)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    duration = db.Column(db.String(10))  # "25:30"
    module = db.Column(db.String(50))    # "Módulo 1"
    video_url = db.Column(db.String(500))  # URL del video
    reading_material = db.Column(db.Text)  # Material de lectura
    fecha_actualizacion = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.video_id,
            'title': self.title,
            'description': self.description,
            'duration': self.duration,
            'module': self.module,
            'video_url': self.video_url,
            'reading_material': self.reading_material,
            'views': 1247 - (self.video_id * 80),  # Mock views
            'date': "Enero 2025" if self.video_id <= 2 else "Febrero 2025"
        }
