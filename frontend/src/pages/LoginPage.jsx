import { useState } from 'react'
import { Link } from 'react-router-dom'

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    confirmPassword: ''
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
    if (isLogin) {
      // Lógica de login
      console.log('Login:', { email: formData.email, password: formData.password })
      alert('¡Login exitoso! Redirigiendo al curso...')
    } else {
      // Lógica de registro
      if (formData.password !== formData.confirmPassword) {
        alert('Las contraseñas no coinciden')
        return
      }
      console.log('Registro:', formData)
      alert('¡Registro exitoso! Ahora puedes iniciar sesión.')
      setIsLogin(true)
    }
  }

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      nombre: '',
      apellido: '',
      confirmPassword: ''
    })
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    resetForm()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4 text-emerald-600 hover:text-emerald-700 transition-colors">
            ← Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isLogin ? 'Accede a tu curso' : 'Únete a nuestro curso'}
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required={!isLogin}
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
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

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
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required={!isLogin}
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 mt-6"
            >
              {isLogin ? '🔑 Iniciar Sesión' : '📝 Crear Cuenta'}
            </button>
          </form>

          {/* Toggle entre login y registro */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
              <button
                onClick={toggleMode}
                className="ml-2 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
              >
                {isLogin ? 'Crear cuenta' : 'Iniciar sesión'}
              </button>
            </p>
          </div>

          {isLogin && (
            <div className="mt-4 text-center">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          )}
        </div>

        {/* Demo de acceso rápido */}
        <div className="mt-6 bg-white/50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 mb-2">Para demo, usa:</p>
          <p className="text-xs text-gray-500">
            Email: demo@hongos.com | Contraseña: demo123
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
