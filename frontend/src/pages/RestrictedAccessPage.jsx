import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function RestrictedAccessPage() {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header simple */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold hover:text-emerald-200 transition-colors">
            🍄 Filosofía de los Hongos
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-emerald-200">👋 {user?.nombre}</span>
            <button
              onClick={handleLogout}
              className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-colors text-sm"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex items-center justify-center py-16">
        <div className="max-w-2xl mx-auto text-center bg-white rounded-xl shadow-lg p-12">
          {/* Icono principal */}
          <div className="text-8xl mb-6">🔒</div>
          
          {/* Título */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            ¡Desbloquea el Conocimiento Secreto!
          </h1>
          
          {/* Descripción */}
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Hola <strong>{user?.nombre}</strong>, tu cuenta está activa pero aún no tienes acceso al contenido exclusivo del curso. 
            Para acceder a las clases, bibliografía y material especializado, necesitas adquirir el curso completo.
          </p>

          {/* Beneficios del curso */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              🌟 ¿Qué incluye el curso completo?
            </h3>
            <ul className="space-y-2 text-gray-700 max-w-md mx-auto">
              <li className="flex items-center">
                <span className="text-emerald-500 mr-2">✓</span>
                Clases asincrónicas grabadas en alta calidad
              </li>
              <li className="flex items-center">
                <span className="text-emerald-500 mr-2">✓</span>
                Supervisión virtual personalizada
              </li>
              <li className="flex items-center">
                <span className="text-emerald-500 mr-2">✓</span>
                Bibliografía específica y materiales exclusivos
              </li>
              <li className="flex items-center">
                <span className="text-emerald-500 mr-2">✓</span>
                Acceso de por vida al contenido
              </li>
              <li className="flex items-center">
                <span className="text-emerald-500 mr-2">✓</span>
                Comunidad privada de estudiantes
              </li>
            </ul>
          </div>

          {/* Botones de acción */}
          <div className="space-y-4">
            <Link
              to="/checkout"
              className="block w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 text-lg transform hover:scale-105"
            >
              🚀 ¡Comprar Curso Ahora!
            </Link>
            
            <Link
              to="/"
              className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-all duration-300"
            >
              ← Volver al Inicio
            </Link>
          </div>

          {/* Mensaje adicional */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>¿Ya compraste el curso?</strong> Envía tu comprobante de pago por email y 
              te habilitaremos el acceso en menos de 24 horas.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestrictedAccessPage
