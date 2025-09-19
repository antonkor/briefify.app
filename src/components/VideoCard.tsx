import { ComponentLabel } from './ComponentLabel'

interface VideoCardProps {
  videoData: any
  loadingStage: string
  isFavorited: boolean
  isVibeMode?: boolean
  onToggleFavorite: () => void
}

export const VideoCard = ({ videoData, loadingStage, isFavorited, isVibeMode = false, onToggleFavorite }: VideoCardProps) => {
  if (!videoData || !(loadingStage === 'hero' || loadingStage === 'insights' || loadingStage === 'comments' || loadingStage === 'complete')) {
    return null
  }

  return (
    <div
      className="relative rounded-2xl overflow-hidden mb-6 bg-gray-900 transition-all duration-1000 ease-out"
      style={{
        animation: loadingStage === 'hero'
          ? 'fadeInScale 1s ease-out forwards'
          : 'none'
      }}
    >
      <ComponentLabel name="VideoCard" isVisible={isVibeMode} position="top-left" />
      {/* Gradient Background */}
      <div
        className="absolute transition-all duration-1500 ease-out"
        style={{
          top: '-20px',
          right: '-20px',
          bottom: '-20px',
          left: '-20px',
          background: loadingStage === 'hero'
            ? 'linear-gradient(135deg, #1e293b 0%, #334155 25%, #475569 50%, #334155 75%, #1e293b 100%)'
            : 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)',
          transform: loadingStage === 'hero' ? 'scale(1.2)' : 'scale(1.1)',
          transition: 'transform 1.5s ease-out, background 1.5s ease-out'
        }}
      ></div>

      {/* Noise Effect Overlay */}
      <div className="absolute inset-0 opacity-15">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            mixBlendMode: 'overlay'
          }}
        ></div>
      </div>

      {/* Accent Gradient Overlay */}
      <div className={`absolute inset-0 transition-all duration-1500 ease-out ${
        loadingStage === 'hero'
          ? 'bg-gradient-to-br from-blue-900/20 via-purple-900/15 to-slate-900/20'
          : 'bg-gradient-to-br from-blue-800/10 via-purple-800/8 to-slate-800/10'
      }`}></div>

      {/* Bottom gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

      {/* Loading shimmer effect */}
      {loadingStage === 'hero' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"
             style={{
               animation: 'shimmer 2s ease-in-out infinite',
               backgroundSize: '200% 100%'
             }}>
        </div>
      )}

      {/* Dot Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.15]">
        <div className="w-full h-full bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-[length:24px_24px]"></div>
      </div>

      {/* Additional subtle dot pattern */}
      <div className="absolute inset-0 opacity-[0.08]">
        <div className="w-full h-full bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.4)_0.5px,transparent_0)] bg-[length:12px_12px]"></div>
      </div>

      {/* Favorite Star - Upper Right */}
      <div className="absolute top-3 right-3 z-20">
        <button
          onClick={onToggleFavorite}
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors group"
          title={isFavorited ? "Remove from favorites" : "Favorite this video"}
        >
          <svg className={`w-4 h-4 transition-colors ${
            isFavorited
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300 group-hover:text-yellow-400'
          }`} fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 px-3 md:px-6 py-1 md:py-3 pb-4 md:pb-6 min-h-[160px] flex flex-col justify-end">
        <h2
          className="text-lg font-bold text-white mb-3 leading-tight drop-shadow-lg"
          style={{
            animation: loadingStage === 'hero'
              ? 'slideInUp 1s ease-out 0.3s forwards'
              : 'none',
            opacity: loadingStage === 'hero' ? '0' : '1'
          }}
        >
          {videoData?.title}
        </h2>
        <div
          className="space-y-1"
          style={{
            animation: loadingStage === 'hero'
              ? 'slideInUp 1s ease-out 0.6s forwards'
              : 'none',
            opacity: loadingStage === 'hero' ? '0' : '1'
          }}
        >
          <p className="text-sm text-gray-200">
            By {videoData?.author}
          </p>
          <div className="flex items-center space-x-3 text-xs text-gray-300">
            <span>{videoData?.viewCount?.toLocaleString()} views</span>
            <span>•</span>
            <span>{Math.floor(videoData?.length / 60)}:{(videoData?.length % 60)?.toString().padStart(2, '0')} min</span>
          </div>
        </div>
      </div>
    </div>
  )
}