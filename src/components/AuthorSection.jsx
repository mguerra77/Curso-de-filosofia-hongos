function AuthorSection() {
  return (
    <div className="w-full bg-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-12">
        <div className="flex flex-col lg:flex-row items-start gap-20">
          {/* Contenido descriptivo - IZQUIERDA */}
          <div className="lg:w-7/12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Sobre el Autor
            </h2>
            <h3 className="text-2xl font-semibold text-emerald-700 mb-8">
              Maximiliano Zeller Echenique
            </h3>
            
            <div className="space-y-6 text-gray-700 leading-relaxed text-justify">
              <p className="text-base">
                <strong>Profesor de Filosofía (UBA, 2018)</strong> y <strong>doctor en Filosofía (UBA, 2024)</strong>. 
                Becario doctoral UBACyT (2018-2023). Docente de Fundamentos de Filosofía en la carrera de Filosofía (FFyL-UBA) desde 2017.
              </p>
              
              <p className="text-base">
                Miembro de grupos de investigación sobre <strong>filosofía de la mente y de la psiquiatría</strong>. Su tesis doctoral 
                se enfoca en un análisis de las investigaciones de tratamientos con uso de psicodélicos desde la filosofía de la psiquiatría.
              </p>
              
              <p className="text-base">
                Coordina el <strong>grupo de análisis filosófico de estudios sobre psicodélicos (SADAF)</strong> desde 2022. 
                Coordinador del programa <strong>Filosofía y Territorio</strong> de la FFyL UBA.
              </p>

              <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border-l-4 border-emerald-500">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Especialización:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-3 mt-1">•</span>
                    <span>Filosofía de la mente y psiquiatría</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-3 mt-1">•</span>
                    <span>Investigación en tratamientos psicodélicos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-3 mt-1">•</span>
                    <span>Análisis filosófico de estudios sobre psicodélicos</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Imagen del autor - DERECHA */}
          <div className="lg:w-5/12">
            <div className="relative h-96 rounded-lg shadow-xl overflow-hidden mr-6">
              <img
                src="/Zeller.jpg"
                alt="Dr. Maximiliano Zeller Echenique"
                className="w-full h-full object-cover"
              />
              
              {/* Overlay con información */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Información superpuesta */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-semibold mb-1">Dr. Maximiliano</h3>
                <h3 className="text-xl font-semibold mb-2">Zeller Echenique</h3>
                <p className="text-sm opacity-90">Profesor y Doctor en Filosofía</p>
                <p className="text-sm opacity-90">Universidad de Buenos Aires</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthorSection
