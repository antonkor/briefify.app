'use client'

import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  onClick?: (e: React.MouseEvent) => void
  variant?: 'default' | 'interactive'
}

export function GlassCard({
  children,
  className = '',
  onClick,
  variant = 'default'
}: GlassCardProps) {
  const baseClasses = "relative bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-md rounded-xl border border-slate-600/30 overflow-hidden"

  const variantClasses = {
    default: "",
    interactive: "hover:border-slate-400/50 hover:shadow-lg hover:shadow-slate-900/30 transition-all duration-500 group cursor-pointer"
  }

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`

  return (
    <div className={combinedClasses} onClick={onClick}>
      {/* Grainy texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[length:24px_24px] opacity-20"></div>

      {/* Subtle glow gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent via-transparent to-purple-500/5 opacity-60"></div>

      {/* Light gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-400/20 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}