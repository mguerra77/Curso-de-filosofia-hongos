#!/usr/bin/env python3
"""
Script minimalista para crear la tabla de contenido del curso
"""

import sys
import os

# Agregar el directorio del backend al path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from models import db, CourseContent

def init_course_content():
    """Crear la tabla y contenido inicial"""
    app = create_app()
    
    with app.app_context():
        # Crear la tabla
        db.create_all()
        
        # Verificar si ya hay contenido
        if CourseContent.query.first():
            print("El contenido del curso ya existe.")
            return
        
        # Datos iniciales
        videos_data = [
            {
                'video_id': 1,
                'title': "Introducción a la Filosofía de los Hongos",
                'description': "En esta primera clase exploraremos los fundamentos filosóficos que sustentan nuestra aproximación al reino fungi y su relación con la consciencia humana.",
                'duration': "25:30",
                'module': "Módulo 1",
                'video_url': "",
                'reading_material': "Documentos y artículos complementarios para profundizar en el tema."
            },
            {
                'video_id': 2,
                'title': "Historia del Uso Ritual de los Psicodélicos",
                'description': "Un recorrido histórico por las diferentes culturas que han incorporado los hongos psicodélicos en sus prácticas espirituales y rituales.",
                'duration': "32:15",
                'module': "Módulo 1",
                'video_url': "",
                'reading_material': "Material complementario sobre historia de los psicodélicos."
            },
            {
                'video_id': 3,
                'title': "Neurociencia y Consciencia Alterada",
                'description': "Análisis de los mecanismos neurológicos involucrados en las experiencias psicodélicas y su impacto en la percepción de la realidad.",
                'duration': "28:45",
                'module': "Módulo 2",
                'video_url': "",
                'reading_material': "Estudios científicos sobre neurociencia y psicodélicos."
            },
            {
                'video_id': 4,
                'title': "Ética y Responsabilidad en el Uso de Psicodélicos",
                'description': "Discusión sobre las consideraciones éticas fundamentales para el uso responsable de sustancias psicodélicas en contextos terapéuticos y personales.",
                'duration': "30:20",
                'module': "Módulo 2",
                'video_url': "",
                'reading_material': "Guías éticas para el uso responsable."
            },
            {
                'video_id': 5,
                'title': "El Futuro de la Terapia Psicodélica",
                'description': "Perspectivas futuras sobre el desarrollo de la terapia asistida con psicodélicos y su integración en el sistema de salud mental.",
                'duration': "35:10",
                'module': "Módulo 3",
                'video_url': "",
                'reading_material': "Investigaciones sobre el futuro de la terapia psicodélica."
            }
        ]
        
        # Crear registros
        for video_data in videos_data:
            content = CourseContent(**video_data)
            db.session.add(content)
        
        db.session.commit()
        print(f"✅ Se crearon {len(videos_data)} contenidos iniciales del curso.")

if __name__ == '__main__':
    init_course_content()
