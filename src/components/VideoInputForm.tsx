import { ComponentLabel } from './ComponentLabel'

interface VideoInputFormProps {
  url: string
  isLoading: boolean
  loadingText: string
  currentHeroText: string
  isWorkshopMode: boolean
  loadingStage: string
  isVibeMode?: boolean
  onUrlChange: (url: string) => void
  onGetStarted: () => void
  onHoverLoader: (hovering: boolean) => void
}

export const VideoInputForm = ({
  url,
  isLoading,
  loadingText,
  currentHeroText,
  isWorkshopMode,
  loadingStage,
  isVibeMode = false,
  onUrlChange,
  onGetStarted,
  onHoverLoader
}: VideoInputFormProps) => {
  const shouldHideUrlInput = loadingStage === 'hero' || loadingStage === 'insights' || loadingStage === 'comments' || loadingStage === 'complete'
  const isFetching = loadingStage === 'fetching'

  return (
    <div className="space-y-4 relative">
      {!shouldHideUrlInput && (
        <>
          <ComponentLabel name="VideoInputForm" isVisible={isVibeMode} position="top-right" />
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {isFetching ? "Processing URL" : "YouTube URL"}
          </label>
          <div className="relative">
            <input
              type="url"
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=8s6nGMcyr7k"
              className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm font-mono transition-all duration-500 ${
                isFetching
                  ? 'border-blue-400 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 pointer-events-none'
                  : isLoading
                    ? 'opacity-20 pointer-events-none'
                    : 'opacity-100'
              }`}
              disabled={isLoading}
              readOnly={isFetching}
            />
            {isFetching && (
              <>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent animate-pulse"></div>
              </>
            )}
            {isLoading && !isFetching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>
        </>
      )}

      {!shouldHideUrlInput && (
        !isLoading ? (
          <div className="space-y-3">
            <button
              onClick={onGetStarted}
              className="w-full bg-gradient-to-br from-slate-700/90 via-slate-800/95 to-slate-900/90 hover:from-slate-600/95 hover:via-slate-700/98 hover:to-slate-800/95 backdrop-blur-sm border border-slate-600/30 hover:border-slate-500/40 text-white font-medium py-4 px-4 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-slate-900/60 relative overflow-hidden group"
            >
              {/* Inner grain texture */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[length:15px_15px] opacity-40"></div>
              {/* Glass highlight */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
              {/* Bottom highlight */}
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-400/30 to-transparent"></div>
              <span className="relative z-10 font-semibold tracking-wide">Get Started</span>
            </button>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3 transition-all duration-500">
              {currentHeroText}
            </p>
          </div>
        ) : (
          <div className="py-4">
            {isFetching ? (
              <div className="space-y-4">
                {/* Progress bar */}
                <div className="relative">
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse" style={{ width: '25%', animation: 'progressGlow 2s ease-in-out infinite' }}></div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">Connecting to video source...</div>
                </div>

              </div>
            ) : (
              <div
                className="text-gray-500 dark:text-gray-400 text-sm font-mono transition-all duration-300"
                style={{ marginLeft: '2px' }}
                onMouseEnter={() => onHoverLoader(true)}
                onMouseLeave={() => onHoverLoader(false)}
              >
                {(loadingText === "..." || (isWorkshopMode && loadingStage === 'idle')) ? (
                  <div className="flex items-center space-x-0">
                    <span className="inline-block" style={{ animation: 'floatDots 2s ease-in-out infinite', animationDelay: '0s' }}>.</span>
                    <span className="inline-block" style={{ animation: 'floatDots 2s ease-in-out infinite', animationDelay: '0.3s' }}>.</span>
                    <span className="inline-block" style={{ animation: 'floatDots 2s ease-in-out infinite', animationDelay: '0.6s' }}>.</span>
                  </div>
                ) : (
                  loadingText
                )}
              </div>
            )}
          </div>
        )
      )}
    </div>
  )
}