import { useState } from 'react'

function VideoPlayer({ video, onNext, onPrevious, hasNext, hasPrevious }) {
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  // Función para obtener el ID de YouTube desde una URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null
    const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  // Función para obtener Google Drive embed URL
  const getGoogleDriveEmbedUrl = (fileId) => {
    if (!fileId) return null
    return `https://drive.google.com/file/d/${fileId}/preview`
  }

  // Función para verificar si es un archivo MP4
  const isMP4File = (url) => {
    if (!url) return false
    return url.toLowerCase().includes('.mp4') || url.startsWith('/uploads/videos/')
  }

  const videoUrl = video?.video_url
  const videoType = video?.video_type || 'youtube'
  const driveFileId = video?.drive_file_id
  const youtubeId = getYouTubeVideoId(videoUrl)
  const isMP4 = isMP4File(videoUrl)
  const driveEmbedUrl = getGoogleDriveEmbedUrl(driveFileId)

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Video Container */}
      <div className="relative bg-gray-900 aspect-video">
        {videoType === 'youtube' && youtubeId ? (
          // YouTube video
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        ) : videoType === 'drive' && driveEmbedUrl ? (
          // Google Drive video
          <iframe
            src={driveEmbedUrl}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        ) : videoType === 'local' && isMP4 && videoUrl ? (
          // MP4 video local
          <video
            controls
            className="w-full h-full"
            poster="/api/placeholder/800/450"
          >
            <source src={videoUrl.startsWith('/uploads/') ? `http://localhost:5000${videoUrl}` : videoUrl} type="video/mp4" />
            Tu navegador no soporta la reproducción de video.
          </video>
        ) : (
          // Placeholder cuando no hay video
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-white/30 transition-colors" onClick={togglePlay}>
                <span className="text-3xl">
                  {isPlaying ? '⏸️' : '▶️'}
                </span>
              </div>
              <p className="text-gray-300">
                {videoUrl ? 'URL de video no válida' : 'No hay video configurado'}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                El administrador puede agregar un video desde el botón de edición
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Soporta: YouTube, Google Drive y archivos MP4
              </p>
            </div>
          </div>
        )}
        
        {/* Progress bar placeholder - solo si no hay video real */}
        {(!youtubeId && !driveEmbedUrl && !isMP4) && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
            <div className="w-full bg-gray-600 rounded-full h-1">
              <div className="bg-emerald-500 h-1 rounded-full" style={{ width: '30%' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{video.title}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
              {video.module}
            </span>
          </div>
        </div>

        <p className="text-gray-700 leading-relaxed mb-6">
          {video.description}
        </p>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            onClick={onPrevious}
            disabled={!hasPrevious}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              hasPrevious
                ? 'text-emerald-600 hover:bg-emerald-50 cursor-pointer'
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>⬅️</span>
            <span>Video Anterior</span>
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Video {video.currentIndex} de {video.totalVideos}
            </p>
          </div>

          <button
            onClick={onNext}
            disabled={!hasNext}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              hasNext
                ? 'text-emerald-600 hover:bg-emerald-50 cursor-pointer'
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>Siguiente Video</span>
            <span>➡️</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer
