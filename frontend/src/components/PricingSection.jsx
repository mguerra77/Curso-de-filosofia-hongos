import { Link } from 'react-router-dom'

function PricingSection() {
  return (
    <div className="w-full bg-white py-20">
      <div className="max-w-6xl mx-auto px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">ARANCEL</h2>
          
          <div className="flex flex-col md:flex-row justify-center gap-12 mb-16">
            {/* Precio Estudiante Argentina */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 shadow-lg border border-emerald-100 min-w-[280px]">
              <h3 className="text-xl font-semibold text-emerald-800 mb-4">
                Estudiante de Argentina
              </h3>
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                $30.000,00
              </div>
              <p className="text-emerald-700 text-sm">
                Pesos Argentinos
              </p>
            </div>

            {/* Precio Estudiante Extranjero */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 shadow-lg border border-teal-100 min-w-[280px]">
              <h3 className="text-xl font-semibold text-teal-800 mb-4">
                Estudiante Extranjero
              </h3>
              <div className="text-4xl font-bold text-teal-600 mb-2">
                $40.000,00
              </div>
              <p className="text-teal-700 text-sm">
                Pesos Argentinos
              </p>
            </div>
          </div>

          {/* Botón de Adquisición */}
          <div className="text-center mb-16">
            <Link 
              to="/checkout"
              className="inline-block bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 px-12 rounded-full text-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🚀 Adquirir Ahora
            </Link>
            <p className="text-gray-600 text-sm mt-3">
              Inscripción inmediata • Acceso de por vida
            </p>
          </div>

          {/* Información adicional */}
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl p-6 shadow-lg">
              <h3 className="text-2xl font-bold mb-2">
                🎓 CURSO PERMANENTE PARA TODA LA VIDA
              </h3>
              <p className="text-emerald-100">
                Acceso ilimitado a todo el contenido y actualizaciones futuras
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                💻 MODALIDAD VIRTUAL
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
                <div className="text-center">
                  <div className="text-emerald-500 text-2xl mb-2">📹</div>
                  <p><strong>Clases Grabadas</strong><br/>Acceso 24/7</p>
                </div>
                <div className="text-center">
                  <div className="text-teal-500 text-2xl mb-2">👥</div>
                  <p><strong>Supervisión Virtual</strong><br/>Apoyo personalizado</p>
                </div>
                <div className="text-center">
                  <div className="text-cyan-500 text-2xl mb-2">📚</div>
                  <p><strong>Bibliografía Específica</strong><br/>Material especializado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingSection
