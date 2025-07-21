import { Link } from 'react-router-dom'

function Header() {
  return (
    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-20 text-center relative">
      {/* Login button */}
      <div className="absolute top-4 right-4">
        <Link 
          to="/login"
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          🔑 Iniciar Sesión
        </Link>
      </div>
      
      <div className="max-w-4xl mx-auto px-8">
        <h2 className="text-2xl mb-8 font-light">
          La filosofía secreta de los hongos: Una introducción a la exploración de la mente, la naturaleza y lo sagrado a través del reino fungi
        </h2>
        <div className="inline-block bg-pink-500 text-white px-8 py-3 rounded-full text-sm font-medium max-w-3xl">
          CLASES ASINCRÓNICAS GRABADAS, SUPERVISIÓN VIRTUAL Y BIBLIOGRAFÍA ESPECÍFICA
        </div>
      </div>
    </div>
  )
}

export default Header
