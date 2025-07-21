import { useState } from 'react'
import { Link } from 'react-router-dom'
import VideoPlayer from '../components/VideoPlayer'

function CoursePage() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Datos mock de los videos del curso
  const videos = [
    {
      id: 1,
      title: "Introducción a la Filosofía de los Hongos",
      description: "En esta primera clase exploraremos los fundamentos filosóficos que sustentan nuestra aproximación al reino fungi y su relación con la consciencia humana.",
      duration: "25:30",
      views: 1247,
      date: "Enero 2025",
      module: "Módulo 1"
    },
    {
      id: 2,
      title: "Historia del Uso Ritual de los Psicodélicos",
      description: "Un recorrido histórico por las diferentes culturas que han incorporado los hongos psicodélicos en sus prácticas espirituales y rituales.",
      duration: "32:15",
      views: 1156,
      date: "Enero 2025",
      module: "Módulo 1"
    },
    {
      id: 3,
      title: "Neurociencia y Consciencia Alterada",
      description: "Análisis de los mecanismos neurológicos involucrados en las experiencias psicodélicas y su impacto en la percepción de la realidad.",
      duration: "28:45",
      views: 1089,
      date: "Enero 2025",
      module: "Módulo 2"
    },
    {
      id: 4,
      title: "Ética y Responsabilidad en el Uso de Psicodélicos",
      description: "Discusión sobre las consideraciones éticas fundamentales para el uso responsable de sustancias psicodélicas en contextos terapéuticos y personales.",
      duration: "30:20",
      views: 967,
      date: "Febrero 2025",
      module: "Módulo 2"
    },
    {
      id: 5,
      title: "El Futuro de la Terapia Psicodélica",
      description: "Perspectivas futuras sobre el desarrollo de la terapia asistida con psicodélicos y su integración en el sistema de salud mental.",
      duration: "35:10",
      views: 832,
      date: "Febrero 2025",
      module: "Módulo 3"
    }
  ]

  const currentVideo = {
    ...videos[currentVideoIndex],
    currentIndex: currentVideoIndex + 1,
    totalVideos: videos.length
  }

  const handleNext = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1)
    }
  }

  const handleVideoSelect = (index) => {
    setCurrentVideoIndex(index)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <span className="text-xl">☰</span>
            </button>
            <h1 className="text-xl font-semibold">La Filosofía Secreta de los Hongos</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-emerald-200">👋 ¡Hola, Estudiante!</span>
            <Link 
              to="/" 
              className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-colors text-sm"
            >
              Salir
            </Link>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar con lista de videos */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-white border-r border-gray-200`}>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Contenido del Curso</h2>
            <div className="space-y-2">
              {videos.map((video, index) => (
                <div
                  key={video.id}
                  onClick={() => handleVideoSelect(index)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    index === currentVideoIndex
                      ? 'bg-emerald-50 border border-emerald-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        index === currentVideoIndex
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm font-medium truncate ${
                        index === currentVideoIndex ? 'text-emerald-700' : 'text-gray-800'
                      }`}>
                        {video.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {video.module} • {video.duration}
                      </p>
                    </div>
                    {index === currentVideoIndex && (
                      <div className="flex-shrink-0">
                        <span className="text-emerald-500 text-sm">▶️</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-800 mb-2">Tu Progreso</h3>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${((currentVideoIndex + 1) / videos.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {currentVideoIndex + 1} de {videos.length} videos completados
              </p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <VideoPlayer
              video={currentVideo}
              onNext={handleNext}
              onPrevious={handlePrevious}
              hasNext={currentVideoIndex < videos.length - 1}
              hasPrevious={currentVideoIndex > 0}
            />

            {/* Additional resources */}
            <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">📚 Recursos Adicionales</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">📄 Material de Lectura</h4>
                  <p className="text-sm text-gray-600">Documentos y artículos complementarios para profundizar en el tema.</p>
                  <button className="mt-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                    Descargar PDF →
                  </button>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">💬 Foro de Discusión</h4>
                  <p className="text-sm text-gray-600">Participa en discusiones con otros estudiantes del curso.</p>
                  <button className="mt-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                    Ir al Foro →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoursePage
