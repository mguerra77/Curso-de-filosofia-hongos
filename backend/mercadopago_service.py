import mercadopago
from config import Config
from flask import current_app

class MercadoPagoService:
    def __init__(self):
        """Inicializar el SDK de Mercado Pago"""
        self.sdk = mercadopago.SDK(Config.MP_ACCESS_TOKEN)
    
    def create_preference(self, payment_data):
        """
        Crear una preferencia de pago para Checkout Pro
        
        Args:
            payment_data (dict): Datos del pago con la siguiente estructura:
                - title (str): Título del producto/curso
                - price (float): Precio del producto
                - quantity (int): Cantidad (normalmente 1)
                - payer (dict): Datos del pagador
                - external_reference (str): Referencia externa para identificar el pago
        
        Returns:
            dict: Respuesta con preference_id e init_point
        """
        try:
            # Debug: Log de las URLs de configuración
            current_app.logger.info(f"MP URLs - Success: {Config.MP_SUCCESS_URL}")
            current_app.logger.info(f"MP URLs - Failure: {Config.MP_FAILURE_URL}")
            current_app.logger.info(f"MP URLs - Pending: {Config.MP_PENDING_URL}")
            current_app.logger.info(f"MP Access Token: {Config.MP_ACCESS_TOKEN[:20]}..." if Config.MP_ACCESS_TOKEN else "NO TOKEN")
            
            # Estructura de la preferencia SIN auto_return
            preference_data = {
                "items": [
                    {
                        "title": payment_data.get('title', 'Curso: La filosofía secreta de los hongos'),
                        "quantity": payment_data.get('quantity', 1),
                        "unit_price": float(payment_data.get('price', 1000)),
                        "currency_id": "ARS",
                        "description": payment_data.get('description', 'Acceso completo al curso online')
                    }
                ],
                "payer": {
                    "name": payment_data.get('payer', {}).get('nombre', ''),
                    "surname": payment_data.get('payer', {}).get('apellido', ''),
                    "email": payment_data.get('payer', {}).get('email', ''),
                    "phone": {
                        "number": payment_data.get('payer', {}).get('telefono', '')
                    },
                    "identification": {
                        "type": "DNI",
                        "number": payment_data.get('payer', {}).get('documento', '')
                    }
                },
                "back_urls": {
                    "success": "http://localhost:5173/payment-success",
                    "failure": "http://localhost:5173/payment-failure", 
                    "pending": "http://localhost:5173/payment-pending"
                },
                "external_reference": payment_data.get('external_reference', ''),
                "notification_url": "http://localhost:5000/api/auth/webhook/mercadopago",
                "statement_descriptor": "CURSO HONGOS"
            }
            
            # Debug: Log de la estructura completa que se enviará
            current_app.logger.info(f"Preference data: {preference_data}")
            
            # Crear la preferencia
            preference_response = self.sdk.preference().create(preference_data)
            
            # Debug: Log de la respuesta completa
            current_app.logger.info(f"MP Response: {preference_response}")
            
            # Verificar si la respuesta es exitosa
            if preference_response.get("status") == 201:
                preference = preference_response["response"]
                
                return {
                    'success': True,
                    'preference_id': preference['id'],
                    'init_point': preference['init_point'],
                    'sandbox_init_point': preference.get('sandbox_init_point')
                }
            else:
                # Error en la respuesta de MP
                error_msg = preference_response.get('response', {}).get('message', 'Error desconocido de MP')
                current_app.logger.error(f"MP Error: {preference_response}")
                return {
                    'success': False,
                    'error': f'Error de Mercado Pago: {error_msg}'
                }
            
        except Exception as e:
            current_app.logger.error(f"Error creating MP preference: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_payment_info(self, payment_id):
        """
        Obtener información de un pago específico
        
        Args:
            payment_id (str): ID del pago en Mercado Pago
            
        Returns:
            dict: Información del pago
        """
        try:
            payment_response = self.sdk.payment().get(payment_id)
            return {
                'success': True,
                'payment': payment_response["response"]
            }
        except Exception as e:
            current_app.logger.error(f"Error getting payment info: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def process_webhook(self, webhook_data):
        """
        Procesar webhook de Mercado Pago
        
        Args:
            webhook_data (dict): Datos del webhook
            
        Returns:
            dict: Resultado del procesamiento
        """
        try:
            if webhook_data.get('type') == 'payment':
                payment_id = webhook_data.get('data', {}).get('id')
                if payment_id:
                    payment_info = self.get_payment_info(payment_id)
                    if payment_info['success']:
                        payment = payment_info['payment']
                        return {
                            'success': True,
                            'payment_status': payment.get('status'),
                            'external_reference': payment.get('external_reference'),
                            'payment_id': payment_id,
                            'amount': payment.get('transaction_amount'),
                            'payer_email': payment.get('payer', {}).get('email')
                        }
            
            return {'success': False, 'error': 'Invalid webhook data'}
            
        except Exception as e:
            current_app.logger.error(f"Error processing webhook: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }

# Instancia global del servicio
mp_service = MercadoPagoService()