/**
 * Inspection Icon Component
 *
 * Visual indicator that appears when hovering over inspectable elements.
 * Provides click interaction to trigger detailed inspection popup.
 */

'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import type { IInspectionIcon } from '@/specs/019-vibe-mode-quick/contracts/inspection-api'

interface InspectionIconProps {
  target?: Element
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  isVisible?: boolean
  onClick?: () => void
  onHover?: (hovering: boolean) => void
}

/**
 * InspectionIcon React Component
 *
 * Renders a floating icon that appears over inspectable elements
 */
export const InspectionIcon: React.FC<InspectionIconProps> = ({
  target,
  position = 'top-right',
  isVisible = false,
  onClick,
  onHover
}) => {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)
  const [iconPosition, setIconPosition] = useState({ x: 0, y: 0 })
  const iconRef = useRef<HTMLDivElement>(null)

  // Create portal container on mount
  useEffect(() => {
    const container = document.createElement('div')
    container.setAttribute('data-vibe-inspection-icon-portal', 'true')
    container.style.position = 'absolute'
    container.style.top = '0'
    container.style.left = '0'
    container.style.pointerEvents = 'none'
    container.style.zIndex = '10000'

    document.body.appendChild(container)
    setPortalContainer(container)

    return () => {
      if (document.body.contains(container)) {
        document.body.removeChild(container)
      }
    }
  }, [])

  // Update position when target or position changes
  useEffect(() => {
    if (!target || !isVisible) {
      return
    }

    const updatePosition = () => {
      const rect = target.getBoundingClientRect()
      const iconSize = 24
      const offset = 4

      let x = 0
      let y = 0

      switch (position) {
        case 'top-left':
          x = rect.left - iconSize - offset
          y = rect.top - iconSize - offset
          break
        case 'top-right':
          x = rect.right + offset
          y = rect.top - iconSize - offset
          break
        case 'bottom-left':
          x = rect.left - iconSize - offset
          y = rect.bottom + offset
          break
        case 'bottom-right':
          x = rect.right + offset
          y = rect.bottom + offset
          break
      }

      // Ensure icon stays within viewport
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      }

      x = Math.max(0, Math.min(x, viewport.width - iconSize))
      y = Math.max(0, Math.min(y, viewport.height - iconSize))

      setIconPosition({ x, y })
    }

    updatePosition()

    // Update position on scroll/resize
    const handleUpdate = () => updatePosition()
    window.addEventListener('scroll', handleUpdate, true)
    window.addEventListener('resize', handleUpdate)

    return () => {
      window.removeEventListener('scroll', handleUpdate, true)
      window.removeEventListener('resize', handleUpdate)
    }
  }, [target, position, isVisible])

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onClick?.()
  }, [onClick])

  const handleMouseEnter = useCallback(() => {
    onHover?.(true)
  }, [onHover])

  const handleMouseLeave = useCallback(() => {
    onHover?.(false)
  }, [onHover])

  if (!portalContainer || !isVisible || !target) {
    return null
  }

  const iconElement = (
    <div
      ref={iconRef}
      data-vibe-inspection-icon="true"
      className={`
        fixed transition-all duration-200 ease-out
        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
        cursor-pointer
        bg-blue-500 hover:bg-blue-600
        text-white
        rounded-lg
        shadow-lg hover:shadow-xl
        border border-blue-300
        flex items-center justify-center
        w-6 h-6
        z-[10000]
        pointer-events-auto
      `}
      style={{
        left: iconPosition.x,
        top: iconPosition.y,
        transform: 'translateZ(0)' // Force hardware acceleration
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title="Click to inspect element"
    >
      <InspectIcon className="w-4 h-4" />
    </div>
  )

  return createPortal(iconElement, portalContainer)
}

/**
 * Inspect SVG Icon
 */
const InspectIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M11.5 7a4.499 4.499 0 11-8.998 0A4.499 4.499 0 0111.5 7zm-.82 4.74a6 6 0 111.06-1.06l3.04 3.04a.75.75 0 11-1.06 1.06l-3.04-3.04z"
    />
  </svg>
)

/**
 * InspectionIcon Implementation Class
 *
 * Implements the IInspectionIcon interface for use with the VibeInspectionManager
 */
export class InspectionIconImpl implements IInspectionIcon {
  private _container: HTMLElement | null = null
  private _isVisible = false
  private _target: Element | null = null
  private _position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' = 'top-right'
  private _clickHandler?: (element: Element) => void
  private _hoverHandler?: (hovering: boolean) => void
  private _isDestroyed = false

  constructor() {
    this._setupContainer()
  }

  get props() {
    return {
      target: this._target!,
      position: this._position,
      isVisible: this._isVisible,
      onClick: () => {
        if (this._target && this._clickHandler) {
          this._clickHandler(this._target)
        }
      },
      onHover: (hovering: boolean) => {
        this._hoverHandler?.(hovering)
      }
    }
  }

  /**
   * Show icon for target element
   */
  show(target: Element): void {
    if (this._isDestroyed) {
      throw new Error('InspectionIcon has been destroyed')
    }

    this._target = target
    this._isVisible = true
    this._render()
  }

  /**
   * Hide icon
   */
  hide(): void {
    if (this._isDestroyed) {
      return
    }

    this._isVisible = false
    this._target = null
    this._render()
  }

  /**
   * Update icon position
   */
  updatePosition(): void {
    if (this._isDestroyed || !this._isVisible) {
      return
    }

    this._render()
  }

  /**
   * Set click handler
   */
  setClickHandler(handler: (element: Element) => void): void {
    this._clickHandler = handler
  }

  /**
   * Set hover handler
   */
  setHoverHandler(handler: (hovering: boolean) => void): void {
    this._hoverHandler = handler
  }

  /**
   * Destroy icon and clean up
   */
  destroy(): void {
    if (this._isDestroyed) {
      return
    }

    this.hide()

    if (this._container && document.body.contains(this._container)) {
      document.body.removeChild(this._container)
    }

    this._container = null
    this._isDestroyed = true
  }

  /**
   * Setup portal container
   */
  private _setupContainer(): void {
    this._container = document.createElement('div')
    this._container.setAttribute('data-vibe-inspection-icon-container', 'true')
    this._container.style.position = 'absolute'
    this._container.style.top = '0'
    this._container.style.left = '0'
    this._container.style.pointerEvents = 'none'
    this._container.style.zIndex = '10000'

    document.body.appendChild(this._container)
  }

  /**
   * Render the icon component
   */
  private _render(): void {
    if (!this._container) {
      return
    }

    // For now, we'll use a simple DOM-based implementation
    // In a full React app, this would integrate with the React render cycle

    if (!this._isVisible || !this._target) {
      this._container.innerHTML = ''
      return
    }

    const rect = this._target.getBoundingClientRect()
    const iconSize = 24
    const offset = 4

    let x = 0
    let y = 0

    switch (this._position) {
      case 'top-left':
        x = rect.left - iconSize - offset
        y = rect.top - iconSize - offset
        break
      case 'top-right':
        x = rect.right + offset
        y = rect.top - iconSize - offset
        break
      case 'bottom-left':
        x = rect.left - iconSize - offset
        y = rect.bottom + offset
        break
      case 'bottom-right':
        x = rect.right + offset
        y = rect.bottom + offset
        break
    }

    // Ensure icon stays within viewport
    x = Math.max(0, Math.min(x, window.innerWidth - iconSize))
    y = Math.max(0, Math.min(y, window.innerHeight - iconSize))

    this._container.innerHTML = `
      <div
        data-vibe-inspection-icon="true"
        style="
          position: fixed;
          left: ${x}px;
          top: ${y}px;
          width: ${iconSize}px;
          height: ${iconSize}px;
          background: #3b82f6;
          color: white;
          border-radius: 6px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid #93c5fd;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          pointer-events: auto;
          z-index: 10000;
          transition: all 0.2s ease-out;
          transform: translateZ(0);
        "
        title="Click to inspect element"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path fill-rule="evenodd" d="M11.5 7a4.499 4.499 0 11-8.998 0A4.499 4.499 0 0111.5 7zm-.82 4.74a6 6 0 111.06-1.06l3.04 3.04a.75.75 0 11-1.06 1.06l-3.04-3.04z"/>
        </svg>
      </div>
    `

    // Add click event listener
    const iconElement = this._container.querySelector('[data-vibe-inspection-icon]')
    if (iconElement) {
      iconElement.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (this._target && this._clickHandler) {
          this._clickHandler(this._target)
        }
      })

      iconElement.addEventListener('mouseenter', () => {
        this._hoverHandler?.(true)
      })

      iconElement.addEventListener('mouseleave', () => {
        this._hoverHandler?.(false)
      })
    }
  }
}

export default InspectionIcon