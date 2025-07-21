import { useState } from 'react'
import { Link } from 'react-router-dom'

function CheckoutPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    pais: 'Argentina',
    documento: '',
    metodoPago: 'cbu'
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí iría la lógica de procesamiento del pago
    console.log('Datos del formulario:', formData)
    alert('¡Compra procesada! Serás redirigido al curso.')
  }

  const precio = formData.pais === 'Argentina' ? '30.000' : '40.000'

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Header simple */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-8">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <Link to="/" className="inline-block mb-4 text-emerald-100 hover:text-white transition-colors">
            ← Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold">Finalizar Compra</h1>
          <p className="text-emerald-100 mt-2">Completa tus datos para acceder al curso</p>
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
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="metodoPago"
                      value="mercadopago"
                      checked={formData.metodoPago === 'mercadopago'}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <span>💰 Mercado Pago</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 mt-6"
              >
                Procesar Pago - ${precio} ARS
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
                  <span className="font-semibold">${precio} ARS</span>
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
                  <div className="text-sm text-blue-700">
                    <p><strong>CBU:</strong> 0123456789012345678901</p>
                    <p><strong>Alias:</strong> CURSO.HONGOS</p>
                    <p><strong>Titular:</strong> Maximiliano Zeller</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
