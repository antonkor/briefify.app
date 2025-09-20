/**
 * Vibe Inspection Manager - Core Implementation
 *
 * Primary implementation of the IVibeModeManager interface.
 * Manages global vibe mode state, hover detection, and coordinates
 * the inspection system components.
 */

import type {
  IVibeModeManager,
  IElementAnalyzer,
  IInspectionIcon,
  IDevelopmentPopup,
  IPerformanceMonitor
} from '@/specs/019-vibe-mode-quick/contracts/inspection-api'

import type {
  VibeInspectionState,
  VibeInspectionSettings,
  InspectionPopupData,
  AnalysisLevel
} from '@/types/vibe-mode'

import {
  DEFAULT_INSPECTION_CONFIG
} from '@/types/vibe-mode'

import { debounce, calculateOptimalPosition } from '@/utils/elementAnalysis'

/**
 * Core implementation of the vibe mode inspection manager.
 * Coordinates all inspection system components and manages global state.
 */
export class VibeInspectionManager implements IVibeModeManager {
  private _state: VibeInspectionState
  private _subscribers: Set<(state: VibeInspectionState) => void>
  private _elementAnalyzer: IElementAnalyzer
  private _inspectionIcon: IInspectionIcon
  private _developmentPopup: IDevelopmentPopup
  private _performanceMonitor: IPerformanceMonitor
  private _hoverDebounced: (element: Element | null) => void
  private _isDestroyed = false

  constructor(
    elementAnalyzer: IElementAnalyzer,
    inspectionIcon: IInspectionIcon,
    developmentPopup: IDevelopmentPopup,
    performanceMonitor: IPerformanceMonitor,
    initialSettings?: Partial<VibeInspectionSettings>
  ) {
    this._elementAnalyzer = elementAnalyzer
    this._inspectionIcon = inspectionIcon
    this._developmentPopup = developmentPopup
    this._performanceMonitor = performanceMonitor
    this._subscribers = new Set()

    // Initialize state with defaults
    this._state = {
      isEnabled: false,
      currentTarget: undefined,
      activePopup: undefined,
      hoveredElement: undefined,
      settings: {
        showOnHover: initialSettings?.showOnHover ?? true,
        analysisLevel: initialSettings?.analysisLevel ?? 'basic',
        autoPosition: initialSettings?.autoPosition ?? true,
        keyboardShortcuts: initialSettings?.keyboardShortcuts ?? true,
        debugMode: initialSettings?.debugMode ?? false
      },
      cache: new Map(),
      performance: {
        analysisCount: 0,
        averageAnalysisTime: 0,
        cacheHitRate: 0
      }
    }

    // Set up debounced hover handler
    this._hoverDebounced = debounce(
      (element: Element | null) => this._handleHover(element),
      DEFAULT_INSPECTION_CONFIG.debounceDelay
    )

    // Set up inspection icon click handler
    this._inspectionIcon.setClickHandler((element: Element) => {
      this.showInspection(element)
    })

    // Initialize DOM event listeners
    this._setupEventListeners()
  }

  /**
   * Get current inspection state (readonly)
   */
  get state(): VibeInspectionState {
    if (this._isDestroyed) {
      throw new Error('VibeInspectionManager has been destroyed')
    }

    // Return a deep clone to prevent mutation
    return {
      ...this._state,
      settings: { ...this._state.settings },
      cache: new Map(this._state.cache),
      performance: { ...this._state.performance }
    }
  }

  /**
   * Enable vibe mode inspection
   */
  enable(): void {
    if (this._isDestroyed) {
      throw new Error('VibeInspectionManager has been destroyed')
    }

    if (this._state.isEnabled) {
      return // Already enabled
    }

    this._performanceMonitor.startTimer('vibe-mode-enable')

    try {
      this._state.isEnabled = true
      document.documentElement.setAttribute('data-vibe-mode', 'true')

      // Setup global mouse event listeners
      document.addEventListener('mouseover', this._onMouseOver, { capture: true })
      document.addEventListener('mouseout', this._onMouseOut, { capture: true })

      // Setup keyboard shortcuts if enabled
      if (this._state.settings.keyboardShortcuts) {
        document.addEventListener('keydown', this._onKeyDown)
      }

      this._notifySubscribers()

      if (this._state.settings.debugMode) {
        console.log('[VibeMode] Inspection enabled')
      }
    } finally {
      this._performanceMonitor.endTimer('vibe-mode-enable')
    }
  }

  /**
   * Disable vibe mode inspection and clean up
   */
  disable(): void {
    if (this._isDestroyed) {
      throw new Error('VibeInspectionManager has been destroyed')
    }

    if (!this._state.isEnabled) {
      return // Already disabled
    }

    this._performanceMonitor.startTimer('vibe-mode-disable')

    try {
      this._state.isEnabled = false
      document.documentElement.removeAttribute('data-vibe-mode')

      // Clean up active UI
      this._inspectionIcon.hide()
      this._developmentPopup.hide()

      // Clear state
      this._state.currentTarget = undefined
      this._state.activePopup = undefined
      this._state.hoveredElement = undefined

      // Remove event listeners
      document.removeEventListener('mouseover', this._onMouseOver, { capture: true })
      document.removeEventListener('mouseout', this._onMouseOut, { capture: true })
      document.removeEventListener('keydown', this._onKeyDown)

      this._notifySubscribers()

      if (this._state.settings.debugMode) {
        console.log('[VibeMode] Inspection disabled')
      }
    } finally {
      this._performanceMonitor.endTimer('vibe-mode-disable')
    }
  }

  /**
   * Toggle vibe mode on/off
   */
  toggle(): void {
    if (this._isDestroyed) {
      throw new Error('VibeInspectionManager has been destroyed')
    }

    if (this._state.isEnabled) {
      this.disable()
    } else {
      this.enable()
    }
  }

  /**
   * Set the currently hovered element for inspection
   */
  setHoverTarget(element: Element | null): void {
    if (this._isDestroyed) {
      throw new Error('VibeInspectionManager has been destroyed')
    }

    if (!this._state.isEnabled) {
      return // Only work when enabled
    }

    this._hoverDebounced(element)
  }

  /**
   * Show inspection popup for the specified element
   */
  async showInspection(element: Element): Promise<void> {
    if (this._isDestroyed) {
      throw new Error('VibeInspectionManager has been destroyed')
    }

    if (!this._state.isEnabled) {
      throw new Error('Vibe mode is not enabled')
    }

    if (!element || !document.contains(element)) {
      throw new Error('Element not found or not in document')
    }

    const timerId = this._performanceMonitor.startTimer('show-inspection')

    try {
      // Close any existing popup
      if (this._state.activePopup) {
        this.hideInspection()
      }

      // Analyze the element
      const metadata = await this._elementAnalyzer.analyzeElement(
        element,
        this._state.settings.analysisLevel
      )

      // Update performance metrics
      this._state.performance.analysisCount++
      const duration = this._performanceMonitor.endTimer(timerId)
      this._updatePerformanceMetrics(duration)

      // Calculate optimal popup position
      const popupSize = { width: 400, height: 500 }
      const position = calculateOptimalPosition(element, popupSize)

      // Create popup data
      const popupData: InspectionPopupData = {
        target: element,
        metadata,
        position,
        content: this._generatePopupContent(metadata),
        settings: {
          showAdvanced: false,
          includeReactInfo: metadata.react !== undefined,
          includeCSSAnalysis: true,
          includePerformanceMetrics: true
        }
      }

      // Show the popup
      await this._developmentPopup.show(popupData)

      // Update state
      this._state.currentTarget = element
      this._state.activePopup = popupData

      this._notifySubscribers()

      if (this._state.settings.debugMode) {
        console.log('[VibeMode] Inspection popup shown for:', element.tagName)
      }

    } catch (error) {
      this._performanceMonitor.endTimer(timerId)
      this._performanceMonitor.reportPerformanceIssue(
        'Failed to show inspection popup',
        { element: element.tagName, error: (error as Error).message }
      )
      throw error
    }
  }

  /**
   * Hide the current inspection popup
   */
  hideInspection(): void {
    if (this._isDestroyed) {
      throw new Error('VibeInspectionManager has been destroyed')
    }

    if (!this._state.activePopup) {
      return // No popup to hide
    }

    this._developmentPopup.hide()

    this._state.currentTarget = undefined
    this._state.activePopup = undefined

    this._notifySubscribers()

    if (this._state.settings.debugMode) {
      console.log('[VibeMode] Inspection popup hidden')
    }
  }

  /**
   * Update inspection settings
   */
  updateSettings(settings: Partial<VibeInspectionSettings>): void {
    if (this._isDestroyed) {
      throw new Error('VibeInspectionManager has been destroyed')
    }

    // Validate settings
    if (settings.analysisLevel && !['basic', 'detailed', 'comprehensive'].includes(settings.analysisLevel)) {
      throw new Error(`Invalid analysis level: ${settings.analysisLevel}`)
    }

    // Update settings
    this._state.settings = {
      ...this._state.settings,
      ...settings
    }

    // Apply keyboard shortcut changes
    if ('keyboardShortcuts' in settings) {
      if (this._state.isEnabled) {
        if (settings.keyboardShortcuts) {
          document.addEventListener('keydown', this._onKeyDown)
        } else {
          document.removeEventListener('keydown', this._onKeyDown)
        }
      }
    }

    this._notifySubscribers()

    if (this._state.settings.debugMode) {
      console.log('[VibeMode] Settings updated:', settings)
    }
  }

  /**
   * Subscribe to state changes
   */
  subscribe(callback: (state: VibeInspectionState) => void): () => void {
    if (this._isDestroyed) {
      throw new Error('VibeInspectionManager has been destroyed')
    }

    this._subscribers.add(callback)

    // Return unsubscribe function
    return () => {
      this._subscribers.delete(callback)
    }
  }

  /**
   * Clean up and destroy the manager
   */
  destroy(): void {
    if (this._isDestroyed) {
      return
    }

    // Disable if currently enabled
    if (this._state.isEnabled) {
      this.disable()
    }

    // Clean up components
    this._inspectionIcon.destroy()
    this._developmentPopup.destroy()

    // Clear state
    this._subscribers.clear()
    this._state.cache.clear()

    this._isDestroyed = true

    if (this._state.settings.debugMode) {
      console.log('[VibeMode] Manager destroyed')
    }
  }

  /**
   * Setup global event listeners
   */
  private _setupEventListeners(): void {
    // Listen for Escape key to close popups
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this._state.activePopup) {
        this.hideInspection()
      }
    })

    // Listen for click outside popup to close
    document.addEventListener('click', (event) => {
      if (this._state.activePopup && !this._isClickInsidePopup(event)) {
        this.hideInspection()
      }
    }, true)
  }

  /**
   * Handle mouse over events
   */
  private _onMouseOver = (event: MouseEvent): void => {
    const element = event.target as Element
    if (this._isInspectableElement(element)) {
      this.setHoverTarget(element)
    }
  }

  /**
   * Handle mouse out events
   */
  private _onMouseOut = (event: MouseEvent): void => {
    const element = event.target as Element
    if (element === this._state.hoveredElement) {
      this.setHoverTarget(null)
    }
  }

  /**
   * Handle keyboard shortcuts
   */
  private _onKeyDown = (event: KeyboardEvent): void => {
    // Ctrl+Shift+I to toggle vibe mode
    if (event.ctrlKey && event.shiftKey && event.key === 'I') {
      event.preventDefault()
      this.toggle()
    }

    // Space to inspect currently hovered element
    if (event.key === ' ' && event.ctrlKey && this._state.hoveredElement) {
      event.preventDefault()
      this.showInspection(this._state.hoveredElement)
    }
  }

  /**
   * Handle debounced hover events
   */
  private async _handleHover(element: Element | null): Promise<void> {
    const previousElement = this._state.hoveredElement

    if (element === previousElement) {
      return // No change
    }

    this._state.hoveredElement = element

    if (element) {
      // Show inspection icon
      this._inspectionIcon.show(element)

      // Start element observation for cache invalidation
      this._elementAnalyzer.observeElement(element)
    } else {
      // Hide inspection icon
      this._inspectionIcon.hide()
    }

    this._notifySubscribers()
  }

  /**
   * Check if element is suitable for inspection
   */
  private _isInspectableElement(element: Element): boolean {
    // Skip non-element nodes
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
      return false
    }

    // Skip script and style elements
    const tagName = element.tagName.toLowerCase()
    if (['script', 'style', 'link', 'meta'].includes(tagName)) {
      return false
    }

    // Skip our own UI elements
    if (element.hasAttribute('data-vibe-inspection-icon') ||
        element.hasAttribute('data-vibe-popup') ||
        element.closest('[data-vibe-popup]')) {
      return false
    }

    return true
  }

  /**
   * Check if click was inside popup
   */
  private _isClickInsidePopup(event: MouseEvent): boolean {
    const popup = document.querySelector('[data-vibe-popup]')
    return popup ? popup.contains(event.target as Node) : false
  }

  /**
   * Generate popup content from metadata
   */
  private _generatePopupContent(metadata: any) {
    // This would generate the structured content for the popup
    // Implementation would parse metadata and create InsightSection arrays
    return {
      primary: [],
      secondary: [],
      comingSoon: []
    }
  }

  /**
   * Update performance metrics
   */
  private _updatePerformanceMetrics(duration: number): void {
    const { performance } = this._state
    const count = performance.analysisCount

    // Update average analysis time
    performance.averageAnalysisTime =
      ((performance.averageAnalysisTime * (count - 1)) + duration) / count

    // Update cache hit rate
    const cacheStats = this._elementAnalyzer.getCachedAnalysis ?
      this._performanceMonitor.getCacheStats() : { hitRate: 0 }
    performance.cacheHitRate = cacheStats.hitRate
  }

  /**
   * Notify all subscribers of state changes
   */
  private _notifySubscribers(): void {
    const state = this.state // Get readonly copy

    this._subscribers.forEach(callback => {
      try {
        callback(state)
      } catch (error) {
        console.error('[VibeMode] Subscriber callback error:', error)
        // Continue notifying other subscribers
      }
    })
  }
}