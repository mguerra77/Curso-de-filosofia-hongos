from flask import Flask, send_from_directory
from flask_cors import CORS
from config import Config
from models import db
from routes.auth import auth_bp
from routes.admin import admin_bp
from routes.course import course_bp
from routes.payments import payments_bp
from email_service import init_mail
import os

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Crear directorios necesarios
    os.makedirs('data', exist_ok=True)
    os.makedirs('uploads', exist_ok=True)
    os.makedirs('uploads/videos', exist_ok=True)
    
    # Inicializar extensiones
    db.init_app(app)
    CORS(app)
    init_mail(app)  # Inicializar Flask-Mail
    
    # Registrar blueprints organizados
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(course_bp, url_prefix='/api/course')
    app.register_blueprint(payments_bp, url_prefix='/api/payments')
    
    # Ruta para servir archivos subidos
    @app.route('/uploads/<filename>')
    def uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    
    # Ruta para servir videos
    @app.route('/uploads/videos/<filename>')
    def video_file(filename):
        return send_from_directory(os.path.join(app.config['UPLOAD_FOLDER'], 'videos'), filename)
    
    # Crear las tablas en la primera ejecución
    with app.app_context():
        db.create_all()
    
    @app.route('/api/health')
    def health_check():
        return {'status': 'ok', 'message': 'Backend funcionando correctamente'}
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
