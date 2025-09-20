/**
 * Development Popup Component
 *
 * Comprehensive inspection popup that displays detailed element analysis.
 * Includes React component info, CSS analysis, accessibility data, and more.
 */

'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import type {
  IDevelopmentPopup,
  PopupSettings,
  InspectionPopupData,
  PopupPosition
} from '@/specs/019-vibe-mode-quick/contracts/inspection-api'

interface DevelopmentPopupProps {
  data?: InspectionPopupData
  isVisible?: boolean
  onClose?: () => void
  onSettingsChange?: (settings: PopupSettings) => void
}

/**
 * Main Development Popup Component
 */
export const DevelopmentPopup: React.FC<DevelopmentPopupProps> = ({
  data,
  isVisible = false,
  onClose,
  onSettingsChange
}) => {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  // Create portal container
  useEffect(() => {
    const container = document.createElement('div')
    container.setAttribute('data-vibe-popup-portal', 'true')
    container.style.position = 'absolute'
    container.style.top = '0'
    container.style.left = '0'
    container.style.pointerEvents = 'none'
    container.style.zIndex = '10001'

    document.body.appendChild(container)
    setPortalContainer(container)

    return () => {
      if (document.body.contains(container)) {
        document.body.removeChild(container)
      }
    }
  }, [])

  // Handle escape key
  useEffect(() => {
    if (!isVisible) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isVisible, onClose])

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose?.()
    }
  }, [onClose])

  if (!portalContainer || !isVisible || !data) {
    return null
  }

  const popupElement = (
    <div
      className="fixed inset-0 z-[10001] pointer-events-auto"
      onClick={handleBackdropClick}
    >
      <div
        ref={popupRef}
        data-vibe-popup="true"
        className={`
          absolute bg-white dark:bg-gray-900
          border border-gray-200 dark:border-gray-700
          rounded-lg shadow-2xl
          max-w-md w-96
          max-h-[600px]
          overflow-hidden
          transition-all duration-200 ease-out
          ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        `}
        style={{
          left: data.position.x,
          top: data.position.y
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <PopupHeader
          target={data.target}
          onClose={onClose}
        />

        {/* Content */}
        <div className="overflow-y-auto max-h-[500px]">
          <PopupContent
            metadata={data.metadata}
            content={data.content}
            settings={data.settings}
            onSettingsChange={onSettingsChange}
          />
        </div>
      </div>
    </div>
  )

  return createPortal(popupElement, portalContainer)
}

/**
 * Popup Header Component
 */
const PopupHeader: React.FC<{
  target: Element
  onClose?: () => void
}> = ({ target, onClose }) => {
  const elementInfo = `${target.tagName.toLowerCase()}${
    target.id ? `#${target.id}` : ''
  }${target.className ? `.${Array.from(target.classList).join('.')}` : ''}`

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
          Element Inspector
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate font-mono">
          {elementInfo}
        </p>
      </div>
      <button
        onClick={onClose}
        className="ml-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        title="Close inspector"
      >
        <CloseIcon className="w-4 h-4" />
      </button>
    </div>
  )
}

/**
 * Popup Content Component
 */
const PopupContent: React.FC<{
  metadata: any
  content: any
  settings: any
  onSettingsChange?: (settings: PopupSettings) => void
}> = ({ metadata, content, settings, onSettingsChange }) => {
  const [activeTab, setActiveTab] = useState('element')

  const tabs = [
    { id: 'element', label: 'Element', icon: '🏷️' },
    { id: 'styles', label: 'Styles', icon: '🎨' },
    { id: 'react', label: 'React', icon: '⚛️' },
    { id: 'accessibility', label: 'A11y', icon: '♿' },
    { id: 'performance', label: 'Perf', icon: '⚡' }
  ]

  return (
    <div className="p-4 space-y-4">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 text-xs py-2 px-3 rounded-md transition-colors
              ${activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }
            `}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {activeTab === 'element' && <ElementTab metadata={metadata} />}
        {activeTab === 'styles' && <StylesTab metadata={metadata} />}
        {activeTab === 'react' && <ReactTab metadata={metadata} />}
        {activeTab === 'accessibility' && <AccessibilityTab metadata={metadata} />}
        {activeTab === 'performance' && <PerformanceTab metadata={metadata} />}
      </div>

      {/* Settings */}
      <PopupSettings
        settings={settings}
        onSettingsChange={onSettingsChange}
      />
    </div>
  )
}

/**
 * Element Information Tab
 */
const ElementTab: React.FC<{ metadata: any }> = ({ metadata }) => {
  if (!metadata?.element) {
    return <div className="text-sm text-gray-500">No element data available</div>
  }

  const { element } = metadata

  return (
    <div className="space-y-3">
      <InfoSection title="Basic Info">
        <InfoRow label="Tag" value={element.tagName} />
        {element.id && <InfoRow label="ID" value={element.id} />}
        {element.className && (
          <InfoRow label="Classes" value={element.className} />
        )}
      </InfoSection>

      {element.attributes && Object.keys(element.attributes).length > 0 && (
        <InfoSection title="Attributes">
          {Object.entries(element.attributes).map(([key, value]) => (
            <InfoRow key={key} label={key} value={value as string} />
          ))}
        </InfoSection>
      )}

      {element.textContent && (
        <InfoSection title="Content">
          <div className="text-xs text-gray-600 dark:text-gray-400 break-words">
            {element.textContent}
          </div>
        </InfoSection>
      )}
    </div>
  )
}

/**
 * Styles Information Tab
 */
const StylesTab: React.FC<{ metadata: any }> = ({ metadata }) => {
  if (!metadata?.computed) {
    return <div className="text-sm text-gray-500">No computed styles available</div>
  }

  const { computed } = metadata

  return (
    <div className="space-y-3">
      {computed.styles && Object.keys(computed.styles).length > 0 && (
        <InfoSection title="Computed Styles">
          {Object.entries(computed.styles).map(([property, value]) => (
            <InfoRow key={property} label={property} value={value as string} />
          ))}
        </InfoSection>
      )}

      {computed.dimensions && (
        <InfoSection title="Dimensions">
          <InfoRow label="Width" value={`${computed.dimensions.width}px`} />
          <InfoRow label="Height" value={`${computed.dimensions.height}px`} />
          <InfoRow label="Top" value={`${computed.dimensions.top}px`} />
          <InfoRow label="Left" value={`${computed.dimensions.left}px`} />
        </InfoSection>
      )}

      {metadata.framework && (
        <InfoSection title="Framework">
          <InfoRow label="Detected" value={metadata.framework} />
        </InfoSection>
      )}
    </div>
  )
}

/**
 * React Information Tab
 */
const ReactTab: React.FC<{ metadata: any }> = ({ metadata }) => {
  if (!metadata?.react) {
    return (
      <div className="text-sm text-gray-500 text-center py-8">
        No React component detected
      </div>
    )
  }

  const { react } = metadata

  return (
    <div className="space-y-3">
      <InfoSection title="Component Info">
        {react.componentName && (
          <InfoRow label="Name" value={react.componentName} />
        )}
        <InfoRow
          label="Type"
          value={react.isFunctionComponent ? 'Function' : react.isClassComponent ? 'Class' : 'Unknown'}
        />
      </InfoSection>

      {react.props && Object.keys(react.props).length > 0 && (
        <InfoSection title="Props">
          <CodeBlock data={react.props} />
        </InfoSection>
      )}

      {react.hooks && react.hooks.length > 0 && (
        <InfoSection title="Hooks">
          {react.hooks.map((hook: any, index: number) => (
            <div key={index} className="text-xs">
              <span className="font-mono text-purple-600 dark:text-purple-400">
                {hook.type}
              </span>
              {hook.value !== undefined && (
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  {JSON.stringify(hook.value)}
                </span>
              )}
            </div>
          ))}
        </InfoSection>
      )}
    </div>
  )
}

/**
 * Accessibility Information Tab
 */
const AccessibilityTab: React.FC<{ metadata: any }> = ({ metadata }) => {
  if (!metadata?.accessibility) {
    return <div className="text-sm text-gray-500">No accessibility data available</div>
  }

  const { accessibility } = metadata

  return (
    <div className="space-y-3">
      <InfoSection title="Accessibility Status">
        <div className="space-y-2">
          {accessibility.map((issue: any, index: number) => (
            <div key={index} className="flex items-start space-x-2">
              <span className={`text-xs ${
                issue.severity === 'error' ? 'text-red-500' :
                issue.severity === 'warning' ? 'text-yellow-500' :
                'text-blue-500'
              }`}>
                {issue.severity === 'error' ? '❌' :
                 issue.severity === 'warning' ? '⚠️' : 'ℹ️'}
              </span>
              <div>
                <div className="text-xs font-medium text-gray-900 dark:text-white">
                  {issue.type}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {issue.message}
                </div>
              </div>
            </div>
          ))}
        </div>
      </InfoSection>
    </div>
  )
}

/**
 * Performance Information Tab
 */
const PerformanceTab: React.FC<{ metadata: any }> = ({ metadata }) => {
  if (!metadata?.performance) {
    return <div className="text-sm text-gray-500">No performance data available</div>
  }

  const { performance } = metadata

  return (
    <div className="space-y-3">
      <InfoSection title="Performance Metrics">
        {Object.entries(performance).map(([metric, value]) => (
          <InfoRow key={metric} label={metric} value={String(value)} />
        ))}
      </InfoSection>
    </div>
  )
}

/**
 * Popup Settings Component
 */
const PopupSettings: React.FC<{
  settings: any
  onSettingsChange?: (settings: PopupSettings) => void
}> = ({ settings, onSettingsChange }) => {
  const handleToggle = (key: keyof PopupSettings) => {
    if (onSettingsChange) {
      onSettingsChange({
        ...settings,
        [key]: !settings[key]
      })
    }
  }

  return (
    <InfoSection title="Settings">
      <div className="space-y-2">
        <ToggleOption
          label="Show React Info"
          checked={settings?.showReactInfo ?? true}
          onChange={() => handleToggle('showReactInfo')}
        />
        <ToggleOption
          label="Show CSS Analysis"
          checked={settings?.showCSSAnalysis ?? true}
          onChange={() => handleToggle('showCSSAnalysis')}
        />
        <ToggleOption
          label="Show Performance"
          checked={settings?.showPerformanceMetrics ?? true}
          onChange={() => handleToggle('showPerformanceMetrics')}
        />
      </div>
    </InfoSection>
  )
}

/**
 * Helper Components
 */
const InfoSection: React.FC<{
  title: string
  children: React.ReactNode
}> = ({ title, children }) => (
  <div>
    <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
      {title}
    </h4>
    <div className="space-y-1">
      {children}
    </div>
  </div>
)

const InfoRow: React.FC<{
  label: string
  value: string
}> = ({ label, value }) => (
  <div className="flex justify-between items-start">
    <span className="text-xs text-gray-600 dark:text-gray-400 truncate mr-2">
      {label}:
    </span>
    <span className="text-xs text-gray-900 dark:text-white font-mono truncate">
      {value}
    </span>
  </div>
)

const CodeBlock: React.FC<{ data: any }> = ({ data }) => (
  <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
    {JSON.stringify(data, null, 2)}
  </pre>
)

const ToggleOption: React.FC<{
  label: string
  checked: boolean
  onChange: () => void
}> = ({ label, checked, onChange }) => (
  <label className="flex items-center space-x-2 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-3 h-3 text-blue-600 rounded focus:ring-blue-500"
    />
    <span className="text-xs text-gray-700 dark:text-gray-300">{label}</span>
  </label>
)

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

/**
 * DevelopmentPopup Implementation Class
 */
export class DevelopmentPopupImpl implements IDevelopmentPopup {
  private _container: HTMLElement | null = null
  private _isVisible = false
  private _data: InspectionPopupData | null = null
  private _closeHandler?: () => void
  private _settingsChangeHandler?: (settings: PopupSettings) => void
  private _isDestroyed = false

  constructor() {
    this._setupContainer()
  }

  get props() {
    return {
      data: this._data!,
      isVisible: this._isVisible,
      onClose: () => this._closeHandler?.(),
      onSettingsChange: (settings: PopupSettings) => this._settingsChangeHandler?.(settings)
    }
  }

  /**
   * Show popup with data
   */
  async show(data: InspectionPopupData): Promise<void> {
    if (this._isDestroyed) {
      throw new Error('DevelopmentPopup has been destroyed')
    }

    this._data = data
    this._isVisible = true
    this._render()
  }

  /**
   * Hide popup
   */
  hide(): void {
    if (this._isDestroyed) {
      return
    }

    this._isVisible = false
    this._data = null
    this._render()
  }

  /**
   * Update popup content
   */
  updateContent(data: InspectionPopupData): void {
    if (this._isDestroyed) {
      return
    }

    this._data = data
    if (this._isVisible) {
      this._render()
    }
  }

  /**
   * Reposition popup if needed
   */
  repositionIfNeeded(): void {
    if (!this._isVisible || !this._data) {
      return
    }

    // Recalculate position if popup is outside viewport
    const popup = this._container?.querySelector('[data-vibe-popup]') as HTMLElement
    if (popup) {
      const rect = popup.getBoundingClientRect()
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      }

      let newX = this._data.position.x
      let newY = this._data.position.y

      if (rect.right > viewport.width) {
        newX = viewport.width - rect.width - 10
      }
      if (rect.bottom > viewport.height) {
        newY = viewport.height - rect.height - 10
      }

      if (newX !== this._data.position.x || newY !== this._data.position.y) {
        this._data.position.x = newX
        this._data.position.y = newY
        popup.style.left = `${newX}px`
        popup.style.top = `${newY}px`
      }
    }
  }

  /**
   * Set close handler
   */
  setCloseHandler(handler: () => void): void {
    this._closeHandler = handler
  }

  /**
   * Set settings change handler
   */
  setSettingsChangeHandler(handler: (settings: PopupSettings) => void): void {
    this._settingsChangeHandler = handler
  }

  /**
   * Destroy popup and clean up
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
    this._container.setAttribute('data-vibe-popup-container', 'true')
    this._container.style.position = 'absolute'
    this._container.style.top = '0'
    this._container.style.left = '0'
    this._container.style.pointerEvents = 'none'
    this._container.style.zIndex = '10001'

    document.body.appendChild(this._container)
  }

  /**
   * Render the popup (simplified DOM implementation)
   */
  private _render(): void {
    if (!this._container) {
      return
    }

    if (!this._isVisible || !this._data) {
      this._container.innerHTML = ''
      return
    }

    // Simplified DOM-based popup for non-React environments
    this._container.innerHTML = `
      <div class="fixed inset-0 z-[10001]" style="pointer-events: auto;">
        <div
          data-vibe-popup="true"
          style="
            position: absolute;
            left: ${this._data.position.x}px;
            top: ${this._data.position.y}px;
            width: 384px;
            max-height: 600px;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            overflow: hidden;
            pointer-events: auto;
          "
        >
          <div style="padding: 16px; border-bottom: 1px solid #e5e7eb;">
            <h3 style="font-size: 14px; font-weight: 600; margin: 0;">Element Inspector</h3>
            <p style="font-size: 12px; color: #6b7280; margin: 4px 0 0 0; font-family: monospace;">
              ${this._data.target.tagName.toLowerCase()}
            </p>
          </div>
          <div style="padding: 16px; max-height: 500px; overflow-y: auto;">
            <div style="font-size: 12px; color: #6b7280;">
              Element analysis complete. React component integration available in full implementation.
            </div>
          </div>
        </div>
      </div>
    `

    // Add event listeners
    const backdrop = this._container.querySelector('.fixed')
    const popup = this._container.querySelector('[data-vibe-popup]')

    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          this._closeHandler?.()
        }
      })
    }

    // Position popup within viewport
    this.repositionIfNeeded()
  }
}

export default DevelopmentPopup