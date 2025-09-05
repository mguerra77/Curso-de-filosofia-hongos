from flask import Blueprint, request, jsonify, current_app
from models import db, Usuario
import jwt
from datetime import datetime
from config import Config

payments_bp = Blueprint('payments', __name__)

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

@payments_bp.route('/mp-debug', methods=['GET'])
def debug_mercadopago():
    """
    Debug endpoint para verificar configuración de MercadoPago
    """
    from mercadopago_service import mp_service
    
    try:
        debug_info = mp_service.get_debug_info()
        return jsonify(debug_info), 200
    except Exception as e:
        return jsonify({'error': f'Error en debug: {str(e)}'}), 500

@payments_bp.route('/create-preference', methods=['POST'])
def crear_preferencia_pago():
    """
    Crear preferencia de pago en MercadoPago
    """
    from mercadopago_service import mp_service
    
    try:
        user = get_current_user()
        if not user:
            return jsonify({'error': 'Usuario no autenticado'}), 401
        
        data = request.get_json()
        
        # Datos del producto
        item_data = {
            'title': data.get('title', 'Curso de Filosofía de los Hongos'),
            'quantity': 1,
            'unit_price': data.get('price', 10000),  # Precio por defecto
            'currency_id': 'ARS'
        }
        
        # Crear preferencia
        result = mp_service.create_preference(
            items=[item_data],
            external_reference=f"user_{user.id}",
            payer_email=user.email
        )
        
        if result['success']:
            return jsonify({
                'preference_id': result['preference_id'],
                'init_point': result['init_point'],
                'sandbox_init_point': result['sandbox_init_point']
            }), 200
        else:
            return jsonify({'error': result['error']}), 400
            
    except Exception as e:
        return jsonify({'error': f'Error creando preferencia: {str(e)}'}), 500

@payments_bp.route('/webhook', methods=['POST'])
def webhook_mercadopago():
    """
    Webhook para notificaciones de MercadoPago
    """
    from mercadopago_service import mp_service
    
    try:
        data = request.get_json()
        current_app.logger.info(f"Webhook recibido: {data}")
        
        # Verificar que es una notificación de pago
        if data.get('type') == 'payment':
            payment_id = data.get('data', {}).get('id')
            
            if payment_id:
                # Obtener información del pago
                result = mp_service.get_payment_info(payment_id)
                
                if result['success']:
                    payment = result['payment']
                    status = payment.get('status')
                    external_ref = payment.get('external_reference', '')
                    
                    current_app.logger.info(f"Payment {payment_id} status: {status}")
                    
                    # Si el pago fue aprobado y tenemos referencia de usuario
                    if status == 'approved' and external_ref.startswith('user_'):
                        try:
                            user_id = int(external_ref.split('_')[1])
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

@payments_bp.route('/status/<payment_id>', methods=['GET'])
def obtener_estado_pago(payment_id):
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
