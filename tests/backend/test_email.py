#!/usr/bin/env python3
"""
Script para testear el envío de emails por consola
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from email_service import send_confirmation_email, generate_confirmation_token
from flask_mail import Mail, Message
from config import Config

def test_email_config():
    """Testear configuración de email"""
    print("📧 Configuración de Email:")
    print(f"   Server: {Config.MAIL_SERVER}")
    print(f"   Port: {Config.MAIL_PORT}")
    print(f"   TLS: {Config.MAIL_USE_TLS}")
    print(f"   Username: {Config.MAIL_USERNAME}")
    print(f"   Sender: {Config.MAIL_DEFAULT_SENDER}")
    print(f"   Password: {'*' * len(Config.MAIL_PASSWORD) if Config.MAIL_PASSWORD else 'NO CONFIGURADO'}")

def test_simple_email(recipient_email):
    """Enviar email de prueba simple"""
    app = create_app()
    
    with app.app_context():
        try:
            from email_service import mail
            
            print(f"\n📨 Enviando email de prueba a: {recipient_email}")
            
            # Crear mensaje simple
            msg = Message(
                subject='Test - Curso de Hongos',
                sender=Config.MAIL_DEFAULT_SENDER,
                recipients=[recipient_email]
            )
            
            msg.html = """
            <html>
            <body style="font-family: Arial, sans-serif;">
                <h2 style="color: #2c5530;">¡Test de Email Exitoso!</h2>
                <p>Este es un email de prueba del sistema de confirmación.</p>
                <p>Si recibes este mensaje, la configuración de email está funcionando correctamente.</p>
                <hr>
                <p style="color: #666; font-size: 12px;">
                    Espacio Thaumazein - Curso de Hongos
                </p>
            </body>
            </html>
            """
            
            msg.body = "Test de email - Si recibes este mensaje, la configuración está funcionando."
            
            # Enviar email
            mail.send(msg)
            print("✅ Email enviado exitosamente")
            return True
            
        except Exception as e:
            print(f"❌ Error enviando email: {str(e)}")
            return False

def test_confirmation_email(recipient_email):
    """Testear email de confirmación completo"""
    print(f"\n🔐 Enviando email de confirmación a: {recipient_email}")
    
    try:
        # Generar token
        token = generate_confirmation_token()
        print(f"   Token generado: {token[:20]}...")
        
        # Enviar email de confirmación
        success = send_confirmation_email(
            user_email=recipient_email,
            user_name="Usuario Test",
            confirmation_token=token
        )
        
        if success:
            print("✅ Email de confirmación enviado exitosamente")
            print(f"   URL de confirmación: http://localhost:5173/confirm-email?token={token}")
        else:
            print("❌ Error enviando email de confirmación")
            
        return success
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def check_admin_email_usage():
    """Verificar si ADMIN_EMAIL se usa en el código"""
    print("\n🔍 Verificando uso de ADMIN_EMAIL...")
    
    import glob
    
    files_to_check = glob.glob("*.py") + glob.glob("routes/*.py")
    admin_email_used = False
    
    for file_path in files_to_check:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                if 'ADMIN_EMAIL' in content:
                    print(f"   📄 Encontrado en: {file_path}")
                    admin_email_used = True
        except:
            continue
    
    if not admin_email_used:
        print("   ❌ ADMIN_EMAIL no se usa en ningún archivo Python")
        print("   💡 Recomendación: Se puede eliminar del .env")
    else:
        print("   ✅ ADMIN_EMAIL se usa en el código")
    
    return admin_email_used

def main():
    print("🧪 Test de Sistema de Emails")
    print("=" * 50)
    
    # 1. Mostrar configuración
    test_email_config()
    
    # 2. Verificar uso de ADMIN_EMAIL
    check_admin_email_usage()
    
    # 3. Email de destino
    recipient = "scania.2000@hotmail.com"
    
    # 4. Test email simple
    print(f"\n1️⃣ Test de email simple...")
    simple_success = test_simple_email(recipient)
    
    # 5. Test email de confirmación
    print(f"\n2️⃣ Test de email de confirmación...")
    confirmation_success = test_confirmation_email(recipient)
    
    # Resumen
    print("\n" + "=" * 50)
    print("📊 RESUMEN DE TESTS:")
    print(f"   Email simple: {'✅ OK' if simple_success else '❌ FALLO'}")
    print(f"   Email confirmación: {'✅ OK' if confirmation_success else '❌ FALLO'}")
    
    if simple_success and confirmation_success:
        print("\n🎉 ¡Sistema de emails funcionando correctamente!")
    else:
        print("\n⚠️  Hay problemas con el sistema de emails")
        print("💡 Verifica:")
        print("   - App Password de Gmail esté correcto")
        print("   - 2FA activado en la cuenta de Gmail")
        print("   - No hay restricciones de firewall")

if __name__ == "__main__":
    main()
