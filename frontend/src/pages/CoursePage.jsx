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
    // Videos del curso con enlaces reales de Google Drive
    setVideos([
      {
        id: 1,
        title: "Unidad 1: Hongos Filosofía y Biología Parte 1",
        description: "Primera parte de la introducción fundamental al mundo de los hongos desde una perspectiva filosófica y biológica.",
        duration: "45:30",
        views: 1247,
        date: "Septiembre 2025",
        module: "Unidad 1: Fundamentos",
        video_type: "drive",
        drive_file_id: "13pzuEBYsO1zYuZSncZdkE2wwwLRjbhtU",
        reading_material: "Material complementario sobre filosofía y biología de los hongos."
      },
      {
        id: 2,
        title: "Unidad 1: Hongos Filosofía y Biología Parte 2",
        description: "Continuación de los fundamentos filosóficos y biológicos del reino fungi y su impacto en la consciencia.",
        duration: "48:15",
        views: 1156,
        date: "Septiembre 2025",
        module: "Unidad 1: Fundamentos",
        video_type: "drive",
        drive_file_id: "1FV9j1ibKz-WYIiqKJBv94ieFvBkRby3P",
        reading_material: "Documentos complementarios sobre filosofía fúngica."
      },
      {
        id: 3,
        title: "Unidad 2: Conocimiento y mente fúngica Parte 1",
        description: "Exploración de los mecanismos de conocimiento y la naturaleza de la mente fúngica en el contexto de la consciencia.",
        duration: "52:22",
        views: 1089,
        date: "Septiembre 2025",
        module: "Unidad 2: Consciencia",
        video_type: "drive",
        drive_file_id: "1OiJy9xULiIXmLoqyzegLNppLrgDuo6S1",
        reading_material: "Estudios sobre la mente fúngica y procesos de conocimiento."
      },
      {
        id: 4,
        title: "Unidad 2: Conocimiento y mente fúngica parte 2",
        description: "Segunda parte del análisis profundo sobre los procesos cognitivos y la inteligencia en el reino fungi.",
        duration: "47:18",
        views: 967,
        date: "Septiembre 2025",
        module: "Unidad 2: Consciencia",
        video_type: "drive",
        drive_file_id: "1vC4f8_PR8MXWBy4u8992DlUxcMXIEir-",
        reading_material: "Investigaciones sobre cognición fúngica."
      },
      {
        id: 5,
        title: "Unidad 3: Hacia una nueva salud Parte 1",
        description: "Primera parte de la exploración de nuevos paradigmas de salud y bienestar a través de la perspectiva fúngica.",
        duration: "44:45",
        views: 832,
        date: "Septiembre 2025",
        module: "Unidad 3: Salud",
        video_type: "drive",
        drive_file_id: "11DZhgzy1ssaOEbMGEE3RtXXo8GwUrXhP",
        reading_material: "Materiales sobre nuevos enfoques de salud integral."
      },
      {
        id: 6,
        title: "Unidad 3: Hacia una nueva salud Parte 2",
        description: "Continuación del análisis sobre los aportes de los hongos a la medicina y el bienestar holístico.",
        duration: "49:12",
        views: 756,
        date: "Septiembre 2025",
        module: "Unidad 3: Salud",
        video_type: "drive",
        drive_file_id: "1yw0xYeXaclH6MqoT0aVPdN9D3hgCM3MR",
        reading_material: "Documentos sobre medicina integrativa y hongos."
      },
      {
        id: 7,
        title: "Unidad 4: Lo sagrado y la conciencia",
        description: "Exploración profunda de la dimensión sagrada y espiritual de la experiencia con hongos y su relación con la consciencia expandida.",
        duration: "56:33",
        views: 689,
        date: "Septiembre 2025",
        module: "Unidad 4: Espiritualidad",
        video_type: "drive",
        drive_file_id: "186y9qniFgG3vKyq7_nOfFmhEa5HV5IQD",
        reading_material: "Textos sobre espiritualidad y estados expandidos de consciencia."
      }
    ])
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
  }, [isAuthenticated, navigate]) // eslint-disable-line react-hooks/exhaustive-deps

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

  // Mostrar loading mientras se verifica el acceso
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Verificando acceso al curso...</p>
        </div>
      </div>
    )
  }

  // Si no hay videos, mostrar contenido del curso con mensaje
  if (videos.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Curso de Filosofía de los Hongos</h1>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-6xl mb-4">🍄</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Contenido en Preparación</h2>
            <p className="text-gray-600">Los videos del curso se están preparando.</p>
            <p className="text-gray-500 text-sm mt-2">Pronto estará disponible todo el contenido.</p>
          </div>
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
  const [videoSource, setVideoSource] = useState('url') // 'url', 'drive' o 'file'
  const [videoUrl, setVideoUrl] = useState(video.video_url || '')
  const [driveFileId, setDriveFileId] = useState(video.drive_file_id || '')
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
      let videoType = 'youtube'
      let finalDriveFileId = null

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
        videoType = 'file'
      } else if (videoSource === 'drive') {
        videoType = 'drive'
        finalDriveFileId = driveFileId
        finalVideoUrl = null // Para Google Drive no usamos video_url
      }

      await onSave({
        title,
        description,
        duration,
        video_url: finalVideoUrl,
        video_type: videoType,
        drive_file_id: finalDriveFileId
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
            <div className="flex space-x-2 mb-4">
              <button
                type="button"
                onClick={() => setVideoSource('url')}
                className={`flex-1 py-2 px-3 rounded-lg border text-sm ${
                  videoSource === 'url' 
                    ? 'bg-emerald-500 text-white border-emerald-500' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                📺 YouTube
              </button>
              <button
                type="button"
                onClick={() => setVideoSource('drive')}
                className={`flex-1 py-2 px-3 rounded-lg border text-sm ${
                  videoSource === 'drive' 
                    ? 'bg-emerald-500 text-white border-emerald-500' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                ☁️ Google Drive
              </button>
              <button
                type="button"
                onClick={() => setVideoSource('file')}
                className={`flex-1 py-2 px-3 rounded-lg border text-sm ${
                  videoSource === 'file' 
                    ? 'bg-emerald-500 text-white border-emerald-500' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                📁 Archivo
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

          {/* Input para Google Drive */}
          {videoSource === 'drive' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Google Drive File ID</label>
              <input
                type="text"
                value={driveFileId}
                onChange={(e) => setDriveFileId(e.target.value)}
                placeholder="1Ab2Cd3Ef4Gh5Ij6Kl7Mn8Op9Qr0St1Uv2Wx3Yz"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Copia el ID del enlace de Google Drive: drive.google.com/file/d/[ID]/view
              </p>
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
