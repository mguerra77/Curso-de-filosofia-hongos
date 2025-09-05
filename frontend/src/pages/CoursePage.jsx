import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import VideoPlayer from '../components/VideoPlayer'

function CoursePage() {
  const navigate = useNavigate()
  const { isAuthenticated, logout, checkCourseAccess, user } = useAuth()
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(true)
  const [videos, setVideos] = useState([])
  const [editingVideo, setEditingVideo] = useState(null)
  const [editingMaterial, setEditingMaterial] = useState(null)

  // Obtener contenido del curso desde la API
  const fetchCourseContent = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch('http://localhost:5000/api/course/content', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setVideos(data.videos)
      } else {
        // Si falla, usar datos por defecto
        setVideos([
          {
            id: 1,
            title: "Introducción a la Filosofía de los Hongos",
            description: "En esta primera clase exploraremos los fundamentos filosóficos que sustentan nuestra aproximación al reino fungi y su relación con la consciencia humana.",
            duration: "25:30",
            views: 1247,
            date: "Enero 2025",
            module: "Módulo 1",
            reading_material: "Documentos y artículos complementarios para profundizar en el tema."
          },
          {
            id: 2,
            title: "Historia del Uso Ritual de los Psicodélicos",
            description: "Un recorrido histórico por las diferentes culturas que han incorporado los hongos psicodélicos en sus prácticas espirituales y rituales.",
            duration: "32:15",
            views: 1156,
            date: "Enero 2025",
            module: "Módulo 1",
            reading_material: "Material complementario sobre historia de los psicodélicos."
          },
          {
            id: 3,
            title: "Neurociencia y Consciencia Alterada",
            description: "Análisis de los mecanismos neurológicos involucrados en las experiencias psicodélicas y su impacto en la percepción de la realidad.",
            duration: "28:45",
            views: 1089,
            date: "Enero 2025",
            module: "Módulo 2",
            reading_material: "Estudios científicos sobre neurociencia y psicodélicos."
          },
          {
            id: 4,
            title: "Ética y Responsabilidad en el Uso de Psicodélicos",
            description: "Discusión sobre las consideraciones éticas fundamentales para el uso responsable de sustancias psicodélicos en contextos terapéuticos y personales.",
            duration: "30:20",
            views: 967,
            date: "Febrero 2025",
            module: "Módulo 2",
            reading_material: "Guías éticas para el uso responsable."
          },
          {
            id: 5,
            title: "El Futuro de la Terapia Psicodélica",
            description: "Perspectivas futuras sobre el desarrollo de la terapia asistida con psicodélicos y su integración en el sistema de salud mental.",
            duration: "35:10",
            views: 832,
            date: "Febrero 2025",
            module: "Módulo 3",
            reading_material: "Investigaciones sobre el futuro de la terapia psicodélica."
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching course content:', error)
    }
  }

  // Verificar acceso al curso y cargar contenido
  useEffect(() => {
    const verifyAccess = async () => {
      if (!isAuthenticated) {
        navigate('/login')
        return
      }

      try {
        const access = await checkCourseAccess()
        if (!access) {
          navigate('/restricted')
          return
        }
        
        // Cargar contenido del curso
        await fetchCourseContent()
      } catch (error) {
        console.error('Error verificando acceso:', error)
        navigate('/restricted')
      } finally {
        setLoading(false)
      }
    }

    verifyAccess()
  }, [isAuthenticated, navigate, checkCourseAccess])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Funciones para editar contenido (solo admins)
  const handleUpdateContent = async (videoId, updates) => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`http://localhost:5000/api/course/content/${videoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        // Recargar contenido
        await fetchCourseContent()
        return true
      }
      return false
    } catch (error) {
      console.error('Error updating content:', error)
      return false
    }
  }

  const isAdmin = user?.rol === 'admin'

  // Mostrar loading mientras se verifica el acceso o carga el contenido
  if (loading || videos.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Verificando acceso al curso...</p>
        </div>
      </div>
    )
  }

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
            <span className="text-emerald-200">👋 ¡Hola, {user?.nombre || 'Estudiante'}!</span>
            {isAdmin && (
              <span className="bg-yellow-500/20 text-yellow-100 px-2 py-1 rounded text-xs">
                Admin
              </span>
            )}
            <Link
              to="/"
              className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-colors text-sm"
            >
              🏠 Inicio
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-colors text-sm"
            >
              Cerrar Sesión
            </button>
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
            <div className="relative">
              <VideoPlayer
                video={currentVideo}
                onNext={handleNext}
                onPrevious={handlePrevious}
                hasNext={currentVideoIndex < videos.length - 1}
                hasPrevious={currentVideoIndex > 0}
              />
              
              {/* Botón de edición para admins */}
              {isAdmin && (
                <button
                  onClick={() => setEditingVideo(currentVideo)}
                  className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white p-2 rounded-lg transition-colors"
                  title="Editar video"
                >
                  ✏️
                </button>
              )}
            </div>

            {/* Additional resources - Solo Material de Lectura */}
            <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">📚 Recursos Adicionales</h3>
                {isAdmin && (
                  <button
                    onClick={() => setEditingMaterial(currentVideo)}
                    className="text-sm bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-lg transition-colors"
                    title="Editar material de lectura"
                  >
                    ✏️ Editar
                  </button>
                )}
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">📄 Material de Lectura</h4>
                <p className="text-sm text-gray-600">
                  {currentVideo?.reading_material || "Documentos y artículos complementarios para profundizar en el tema."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de edición de video */}
      {editingVideo && (
        <VideoEditModal 
          video={editingVideo}
          onSave={async (updates) => {
            const success = await handleUpdateContent(editingVideo.id, updates)
            if (success) {
              setEditingVideo(null)
            } else {
              alert('Error al actualizar el video')
            }
          }}
          onCancel={() => setEditingVideo(null)}
        />
      )}

      {/* Modal de edición de material */}
      {editingMaterial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-xl font-semibold mb-6">📄 Editar Material de Lectura</h3>
            
            <form onSubmit={async (e) => {
              e.preventDefault()
              const formData = new FormData(e.target)
              const updates = {
                reading_material: formData.get('reading_material')
              }
              
              const success = await handleUpdateContent(editingMaterial.id, updates)
              if (success) {
                setEditingMaterial(null)
              } else {
                alert('Error al actualizar el material')
              }
            }} className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contenido del Material</label>
                <textarea
                  name="reading_material"
                  defaultValue={editingMaterial.reading_material || ''}
                  rows="6"
                  placeholder="Describe el material de lectura para este video..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingMaterial(null)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  Guardar Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// Componente modal para editar videos
const VideoEditModal = ({ video, onSave, onCancel }) => {
  const [videoSource, setVideoSource] = useState('url') // 'url' o 'file'
  const [videoUrl, setVideoUrl] = useState(video.video_url || '')
  const [selectedFile, setSelectedFile] = useState(null)
  const [title, setTitle] = useState(video.title || '')
  const [description, setDescription] = useState(video.description || '')
  const [duration, setDuration] = useState(video.duration || '')
  const [uploading, setUploading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)

    try {
      let finalVideoUrl = videoUrl

      // Si se seleccionó un archivo, subirlo primero
      if (videoSource === 'file' && selectedFile) {
        const formData = new FormData()
        formData.append('video', selectedFile)

        const token = localStorage.getItem('authToken')
        const response = await fetch('http://localhost:5000/api/auth/upload_video', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })

        if (!response.ok) {
          throw new Error('Error al subir el video')
        }

        const result = await response.json()
        finalVideoUrl = result.video_url
      }

      await onSave({
        title,
        description,
        duration,
        video_url: finalVideoUrl
      })
    } catch (error) {
      alert(error.message || 'Error al guardar el video')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-6">✏️ Editar Video</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Selector de tipo de video */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Video</label>
            <div className="flex space-x-4 mb-4">
              <button
                type="button"
                onClick={() => setVideoSource('url')}
                className={`flex-1 py-2 px-4 rounded-lg border ${
                  videoSource === 'url' 
                    ? 'bg-emerald-500 text-white border-emerald-500' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                📺 URL de YouTube
              </button>
              <button
                type="button"
                onClick={() => setVideoSource('file')}
                className={`flex-1 py-2 px-4 rounded-lg border ${
                  videoSource === 'file' 
                    ? 'bg-emerald-500 text-white border-emerald-500' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                📁 Subir Archivo
              </button>
            </div>
          </div>

          {/* Input para URL de YouTube */}
          {videoSource === 'url' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL del Video</label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          {/* Input para subir archivo */}
          {videoSource === 'file' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Archivo de Video</label>
              <input
                type="file"
                accept=".mp4,.mov,.avi,.mkv"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {selectedFile && (
                <p className="text-sm text-gray-600 mt-2">
                  Archivo seleccionado: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(1)} MB)
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duración</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="25:30"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={uploading}
              className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={uploading || (videoSource === 'url' && !videoUrl) || (videoSource === 'file' && !selectedFile)}
              className="flex-1 bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              {uploading ? 'Subiendo...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CoursePage
