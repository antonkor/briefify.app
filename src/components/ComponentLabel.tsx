interface ComponentLabelProps {
  name: string
  isVisible: boolean
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

export const ComponentLabel = ({ name, isVisible, position = 'top-left' }: ComponentLabelProps) => {
  if (!isVisible) return null

  const positionClasses = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2'
  }

  return (
    <div className={`absolute ${positionClasses[position]} z-50 pointer-events-none`}>
      <div className="bg-blue-500/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md font-mono shadow-lg border border-blue-400/30">
        {name}
      </div>
    </div>
  )
}