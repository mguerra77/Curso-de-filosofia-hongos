from flask_mail import Mail, Message
import secrets
import jwt
from datetime import datetime, timedelta
from config import Config

mail = Mail()

def init_mail(app):
    """Inicializar Flask-Mail con la aplicación"""
    mail.init_app(app)

def generate_confirmation_token():
    """Generar un token único para confirmación de email"""
    return secrets.token_urlsafe(32)

def generate_password_reset_token():
    """Generar un token único para reset de contraseña"""
    return secrets.token_urlsafe(32)

def send_confirmation_email(user_email, user_name, confirmation_token):
    """Enviar email de confirmación"""
    try:
        from flask import current_app
        
        # Verificar que estamos en contexto de aplicación
        if not current_app:
            print("Error: No hay contexto de aplicación Flask")
            return False
            
        # URL de confirmación
        confirmation_url = f"http://localhost:5173/confirm-email?token={confirmation_token}"
        
        # Crear mensaje
        msg = Message(
            subject='Confirma tu email - Curso de Hongos',
            sender=Config.MAIL_DEFAULT_SENDER,
            recipients=[user_email]
        )
        
        # Contenido del email
        msg.html = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2c5530;">¡Bienvenido al Curso de Hongos!</h2>
                <p>Hola <strong>{user_name}</strong>,</p>
                <p>Gracias por registrarte en nuestro curso. Para completar tu registro, necesitas confirmar tu dirección de email.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{confirmation_url}" 
                       style="background-color: #2c5530; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                        Confirmar Email
                    </a>
                </div>
                
                <p>Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:</p>
                <p style="word-break: break-all; color: #666;">{confirmation_url}</p>
                
                <p style="margin-top: 30px; color: #666; font-size: 14px;">
                    Si no te registraste en nuestro curso, puedes ignorar este email.
                </p>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                <p style="color: #666; font-size: 12px;">
                    Espacio Thaumazein - Curso de Hongos
                </p>
            </div>
        </body>
        </html>
        """
        
        # Agregar versión de texto plano
        msg.body = f"""
        ¡Bienvenido al Curso de Hongos!
        
        Hola {user_name},
        
        Gracias por registrarte en nuestro curso. Para completar tu registro, necesitas confirmar tu dirección de email.
        
        Haz clic en este enlace para confirmar: {confirmation_url}
        
        Si no te registraste en nuestro curso, puedes ignorar este email.
        
        Espacio Thaumazein - Curso de Hongos
        """
        
        # Enviar email
        mail.send(msg)
        print(f"Email de confirmación enviado exitosamente a {user_email}")
        return True
        
    except Exception as e:
        print(f"Error enviando email de confirmación: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def send_password_reset_email(user_email, user_name, reset_token):
    """Enviar email de reset de contraseña"""
    try:
        from flask import current_app
        
        # Verificar que estamos en contexto de aplicación
        if not current_app:
            print("Error: No hay contexto de aplicación Flask")
            return False
            
        # URL de reset
        reset_url = f"http://localhost:5173/reset-password?token={reset_token}"
        
        # Crear mensaje
        msg = Message(
            subject='Restablece tu contraseña - Curso de Hongos',
            sender=Config.MAIL_DEFAULT_SENDER,
            recipients=[user_email]
        )
        
        # Contenido del email
        msg.html = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2c5530;">Restablece tu contraseña</h2>
                <p>Hola <strong>{user_name}</strong>,</p>
                <p>Has solicitado restablecer tu contraseña para acceder al Curso de Hongos.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{reset_url}" 
                       style="background-color: #2c5530; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                        Restablecer Contraseña
                    </a>
                </div>
                
                <p>Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:</p>
                <p style="word-break: break-all; color: #666;">{reset_url}</p>
                
                <p style="color: #e74c3c; font-weight: bold;">Este enlace expirará en 1 hora por seguridad.</p>
                
                <p style="margin-top: 30px; color: #666; font-size: 14px;">
                    Si no solicitaste este cambio de contraseña, puedes ignorar este email. Tu contraseña actual seguirá siendo válida.
                </p>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                <p style="color: #666; font-size: 12px;">
                    Espacio Thaumazein - Curso de Hongos
                </p>
            </div>
        </body>
        </html>
        """
        
        # Agregar versión de texto plano
        msg.body = f"""
        Restablece tu contraseña - Curso de Hongos
        
        Hola {user_name},
        
        Has solicitado restablecer tu contraseña para acceder al Curso de Hongos.
        
        Haz clic en este enlace para restablecer tu contraseña: {reset_url}
        
        Este enlace expirará en 1 hora por seguridad.
        
        Si no solicitaste este cambio de contraseña, puedes ignorar este email.
        
        Espacio Thaumazein - Curso de Hongos
        """
        
        # Enviar email
        mail.send(msg)
        print(f"Email de reset de contraseña enviado exitosamente a {user_email}")
        return True
        
    except Exception as e:
        print(f"Error enviando email de reset de contraseña: {str(e)}")
        import traceback
        traceback.print_exc()
        return False
