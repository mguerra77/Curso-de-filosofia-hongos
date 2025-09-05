import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Footer from '../components/Footer'

function CheckoutPage() {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    pais: 'Argentina',
    documento: '',
    metodoPago: 'cbu'
  })
  // const [loading, setLoading] = useState(false) // No necesario sin Mercado Pago

  // Verificar autenticación y redirigir si no está logueado
  useEffect(() => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para acceder al checkout')
      navigate('/login')
      return
    }
    
    // Si está logueado, precargar algunos datos del usuario
    if (user) {
      setFormData(prev => ({
        ...prev,
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        email: user.email || ''
      }))
    }
  }, [isAuthenticated, user, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Función de Mercado Pago comentada temporalmente por temas de permisos
  /*
  const handleMercadoPagoPayment = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        alert('Debes iniciar sesión para continuar')
        return
      }

      const response = await fetch('http://localhost:5000/api/payments/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          amount: formData.pais === 'Argentina' ? 50000 : 50
        })
      })

      const data = await response.json()
      
      if (data.preference_id && data.init_point) {
        // Redirigir al checkout de Mercado Pago
        window.location.href = data.init_point
      } else {
        alert('Error al crear el pago: ' + (data.error || 'Error desconocido'))
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al procesar el pago con Mercado Pago')
    } finally {
      setLoading(false)
    }
  }
  */

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Solo CBU por ahora - Mercado Pago temporalmente deshabilitado
    console.log('Datos del formulario:', formData)
    alert(`¡Datos registrados!\n\n📋 PASOS A SEGUIR:\n1. Transferir $${precio} ${formData.pais === 'Argentina' ? 'ARS' : 'USD'} a:\n   • CBU: 0123456789012345678901\n   • Alias: CURSO.HONGOS\n   • Titular: Maximiliano Zeller\n\n2. Enviar comprobante de pago a:\n   📧 espaciothaumazein@gmail.com\n   ✏️ Incluir: ${formData.nombre} ${formData.apellido}\n\n¡Te activaremos el acceso en menos de 24 horas!`)
  }

  const precio = formData.pais === 'Argentina' ? '50000' : '50'

  // Si no está autenticado, mostrar mensaje de carga mientras redirige
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Acceso Restringido</h2>
          <p className="text-gray-600">Redirigiendo al login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header simple */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-8">
        <div className="max-w-4xl mx-auto px-8">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="text-emerald-100 hover:text-white transition-colors">
              ← Volver al inicio
            </Link>
            <Link to="/login" className="text-emerald-100 hover:text-white transition-colors">
              Mi Cuenta
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold">Finalizar Compra</h1>
            <p className="text-emerald-100 mt-2">
              {user ? `¡Hola ${user.nombre}! ` : ''}Completa tus datos para acceder al curso
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 mt-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Formulario */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Datos del Estudiante</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
                <select
                  name="pais"
                  value={formData.pais}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="Argentina">Argentina</option>
                  <option value="Otro">Otro País</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Documento</label>
                <input
                  type="text"
                  name="documento"
                  value={formData.documento}
                  onChange={handleInputChange}
                  placeholder="DNI, Pasaporte, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Método de Pago</label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="metodoPago"
                      value="cbu"
                      checked={formData.metodoPago === 'cbu'}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <span>💳 Transferencia Bancaria (CBU)</span>
                  </label>
                  {/* Mercado Pago temporalmente deshabilitado por temas de permisos */}
                  {/* <label className="flex items-center">
                    <input
                      type="radio"
                      name="metodoPago"
                      value="mercadopago"
                      checked={formData.metodoPago === 'mercadopago'}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <span>💰 Mercado Pago</span>
                  </label> */}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 mt-6"
              >
                Procesar Pago - ${precio} {formData.pais === 'Argentina' ? 'ARS' : 'USD'}
              </button>
            </form>
          </div>

          {/* Resumen de compra */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Resumen de Compra</h2>
            
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-semibold text-gray-800">La filosofía secreta de los hongos</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Una introducción a la exploración de la mente, la naturaleza y lo sagrado a través del reino fungi
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo:</span>
                  <span className="font-semibold">
                    {formData.pais === 'Argentina' ? 'Estudiante Argentino' : 'Estudiante Extranjero'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Precio:</span>
                  <span className="font-semibold">${precio} {formData.pais === 'Argentina' ? 'ARS' : 'USD'}</span>
                </div>
              </div>

              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                <h4 className="font-semibold text-emerald-800 mb-2">✅ Incluye:</h4>
                <ul className="text-sm text-emerald-700 space-y-1">
                  <li>• Acceso de por vida al curso</li>
                  <li>• Clases asincrónicas grabadas</li>
                  <li>• Supervisión virtual</li>
                  <li>• Bibliografía específica</li>
                  <li>• Actualizaciones futuras gratuitas</li>
                </ul>
              </div>

              {formData.metodoPago === 'cbu' && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Datos para transferencia:</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p><strong>CBU:</strong> 0123456789012345678901</p>
                    <p><strong>Alias:</strong> CURSO.HONGOS</p>
                    <p><strong>Titular:</strong> Maximiliano Zeller</p>
                    <p className="mt-3 pt-2 border-t border-blue-200">
                      <strong>Enviar comprobante, nombre y apellido a:</strong>
                    </p>
                    <p>
                      <a 
                        href="mailto:espaciothaumazein@gmail.com" 
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                       espaciothaumazein@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default CheckoutPage
