# 💰 Integración Mercado Pago - Checkout Pro

## 📋 **Configuración Inicial**

### 1. **Credenciales del Cliente**
Reemplazar en `/backend/.env` con las credenciales reales:

```env
# Mercado Pago - TESTING
MP_ACCESS_TOKEN=TEST-1234567890-123456-abcdef...
MP_PUBLIC_KEY=TEST-abcdef12-3456-7890-abcd...

# Mercado Pago - PRODUCCIÓN (cuando esté listo)
MP_ACCESS_TOKEN=APP_USR-1234567890-123456-abcdef...
MP_PUBLIC_KEY=APP_USR-abcdef12-3456-7890-abcd...
```

### 2. **URLs de Retorno**
Las URLs están configuradas para desarrollo local. Para producción, cambiar:

```env
MP_SUCCESS_URL=https://tudominio.com/payment-success
MP_FAILURE_URL=https://tudominio.com/payment-failure
MP_PENDING_URL=https://tudominio.com/payment-pending
```

## 🚀 **Cómo Funciona**

### **Flujo del Usuario:**
1. **Checkout** → Usuario llena formulario y elige "Mercado Pago"
2. **Redirección** → Se crea preferencia y redirige a MP
3. **Pago** → Usuario paga en la plataforma de Mercado Pago
4. **Retorno** → MP redirige según resultado (éxito/fallo/pendiente)
5. **Webhook** → MP notifica el estado del pago a tu servidor
6. **Activación** → Si pago aprobado, se activa acceso al curso

### **Componentes Implementados:**

#### **Backend:**
- ✅ `mercadopago_service.py` - Servicio modular para MP
- ✅ `routes/auth.py` - Endpoints para crear preferencias y webhooks
- ✅ `config.py` - Configuración centralizada

#### **Frontend:**
- ✅ `CheckoutPage.jsx` - Formulario con opción MP
- ✅ `PaymentSuccess.jsx` - Página de éxito
- ✅ `PaymentFailure.jsx` - Página de error
- ✅ `PaymentPending.jsx` - Página de pendiente

## 🛠️ **Endpoints de API**

### **POST** `/api/auth/create-preference`
Crear preferencia de pago para Checkout Pro

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "nombre": "Juan",
  "apellido": "Pérez", 
  "email": "juan@email.com",
  "telefono": "1234567890",
  "documento": "12345678",
  "amount": 50000
}
```

**Response:**
```json
{
  "preference_id": "123456789-abcdef123-456789",
  "init_point": "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=..."
}
```

### **POST** `/webhook/mercadopago`
Webhook para notificaciones de MP (automático)

### **GET** `/api/auth/payment-status/{payment_id}`
Consultar estado de un pago específico

## 🔧 **Testing**

### **1. Credenciales de Prueba**
Usar credenciales TEST- para desarrollo:
- Pueden generar pagos de prueba
- No procesan dinero real
- Funcionan igual que las reales

### **2. Tarjetas de Prueba**
MP proporciona tarjetas para testing:
- **Visa:** 4509 9535 6623 3704
- **Mastercard:** 5031 7557 3453 0604
- **American Express:** 3711 803032 57522

### **3. Usuarios de Prueba**
Crear usuarios test en developers.mercadopago.com

## 🚨 **Seguridad**

### **Variables de Entorno:**
- ✅ `MP_ACCESS_TOKEN` - Solo en backend, NUNCA en frontend
- ✅ `MP_PUBLIC_KEY` - Se puede usar en frontend si es necesario
- ✅ Verificar webhooks con signature (opcional para mayor seguridad)

### **Validaciones:**
- ✅ Usuario autenticado para crear preferencias
- ✅ Webhook procesa solo pagos aprobados
- ✅ External reference único para cada compra

## 📱 **Producción**

### **Checklist para Deploy:**
1. ✅ Reemplazar credenciales TEST con PRODUCCIÓN
2. ✅ Actualizar URLs de retorno con dominio real
3. ✅ Configurar webhook URL en panel de MP
4. ✅ Probar flujo completo en ambiente real
5. ✅ Verificar que el webhook funciona
6. ✅ Configurar HTTPS (requerido por MP)

## 🎯 **Ventajas de Checkout Pro**

- ✅ **Fácil implementación** - Solo redirección
- ✅ **Seguro** - MP maneja datos sensibles
- ✅ **Múltiples métodos** - Tarjetas, efectivo, etc.
- ✅ **Responsive** - Funciona en móviles
- ✅ **Localized** - Idioma y moneda local
- ✅ **Menos PCI compliance** - MP se encarga de la seguridad

## 📞 **Soporte**

- **Documentación:** https://developers.mercadopago.com
- **Sandbox:** Usar credenciales TEST para pruebas
- **Webhooks:** Panel de desarrollador para configurar notificaciones
- **Status codes:** approved, pending, rejected, cancelled

---

**✨ Implementación completa y lista para usar con las credenciales reales del cliente.**
