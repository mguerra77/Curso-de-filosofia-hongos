import { useState } from 'react'

function VideoPlayer({ video, onNext, onPrevious, hasNext, hasPrevious }) {
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Video Container */}
      <div className="relative bg-gray-900 aspect-video">
        {/* Placeholder del video */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-white/30 transition-colors" onClick={togglePlay}>
              <span className="text-3xl">
                {isPlaying ? '⏸️' : '▶️'}
              </span>
            </div>
            <p className="text-gray-300">
              {isPlaying ? 'Reproduciendo...' : 'Click para reproducir'}
            </p>
          </div>
        </div>
        
        {/* Progress bar placeholder */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
          <div className="w-full bg-gray-600 rounded-full h-1">
            <div className="bg-emerald-500 h-1 rounded-full" style={{ width: '30%' }}></div>
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{video.title}</h2>
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <span>📹 {video.duration}</span>
              <span>👁️ {video.views} visualizaciones</span>
              <span>📅 {video.date}</span>
            </div>
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
