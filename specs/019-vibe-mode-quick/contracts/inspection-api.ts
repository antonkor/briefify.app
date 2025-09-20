/**
 * API Contracts for Vibe Mode Quick Inspect
 *
 * These interfaces define the contracts between components and services
 * for the developer inspection system.
 */

// ============================================================================
// CORE INSPECTION CONTRACTS
// ============================================================================

/**
 * Contract: Element Analysis Service
 * Purpose: Analyze DOM elements and extract metadata
 */
export interface IElementAnalyzer {
  /**
   * Analyze a DOM element and return comprehensive metadata
   * @param element - Target DOM element to analyze
   * @param level - Analysis depth level
   * @returns Promise resolving to analysis metadata
   */
  analyzeElement(
    element: Element,
    level: AnalysisLevel
  ): Promise<InspectionMetadata>

  /**
   * Start observing element for changes
   * @param element - Element to observe
   * @returns Cleanup function
   */
  observeElement(element: Element): () => void

  /**
   * Get cached analysis if available
   * @param element - Element to get cache for
   * @returns Cached metadata or null
   */
  getCachedAnalysis(element: Element): InspectionMetadata | null

  /**
   * Clear analysis cache
   */
  clearCache(): void
}

/**
 * Contract: Inspection Icon Component
 * Purpose: Visual indicator that appears on hover over elements
 */
export interface IInspectionIcon {
  /**
   * Props for the inspection icon component
   */
  props: {
    target: Element
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    isVisible: boolean
    onClick: () => void
    onHover: (hovering: boolean) => void
  }

  /**
   * Show icon with animation
   */
  show(): void

  /**
   * Hide icon with animation
   */
  hide(): void

  /**
   * Update icon position relative to target element
   */
  updatePosition(): void
}

/**
 * Contract: Development Popup Component
 * Purpose: Display detailed inspection information
 */
export interface IDevelopmentPopup {
  /**
   * Props for the development popup component
   */
  props: {
    data: InspectionPopupData
    isVisible: boolean
    onClose: () => void
    onSettingsChange: (settings: PopupSettings) => void
  }

  /**
   * Show popup with data
   */
  show(data: InspectionPopupData): void

  /**
   * Hide popup
   */
  hide(): void

  /**
   * Update popup content
   */
  updateContent(data: InspectionPopupData): void

  /**
   * Reposition popup if needed
   */
  repositionIfNeeded(): void
}

/**
 * Contract: Vibe Mode State Manager
 * Purpose: Manage global state for inspection system
 */
export interface IVibeModeManager {
  /**
   * Current vibe mode state
   */
  readonly state: VibeInspectionState

  /**
   * Enable vibe mode inspection
   */
  enable(): void

  /**
   * Disable vibe mode inspection
   */
  disable(): void

  /**
   * Toggle vibe mode
   */
  toggle(): void

  /**
   * Set hover target element
   */
  setHoverTarget(element: Element | null): void

  /**
   * Show inspection popup for element
   */
  showInspection(element: Element): Promise<void>

  /**
   * Hide current inspection popup
   */
  hideInspection(): void

  /**
   * Update inspection settings
   */
  updateSettings(settings: Partial<VibeInspectionSettings>): void

  /**
   * Subscribe to state changes
   */
  subscribe(callback: (state: VibeInspectionState) => void): () => void
}

// ============================================================================
// DATA TYPE CONTRACTS
// ============================================================================

/**
 * Analysis depth levels
 */
export type AnalysisLevel = 'basic' | 'detailed' | 'comprehensive'

/**
 * Popup positioning preferences
 */
export interface PopupPosition {
  x: number
  y: number
  placement: 'top' | 'bottom' | 'left' | 'right'
  strategy: 'absolute' | 'fixed'
}

/**
 * Popup settings that user can configure
 */
export interface PopupSettings {
  showReactInfo: boolean
  showCSSAnalysis: boolean
  showPerformanceMetrics: boolean
  autoPosition: boolean
  theme: 'dark' | 'light' | 'auto'
}

/**
 * Vibe mode global settings
 */
export interface VibeInspectionSettings {
  showOnHover: boolean
  analysisLevel: AnalysisLevel
  autoPosition: boolean
  keyboardShortcuts: boolean
  debugMode: boolean
  popupSettings: PopupSettings
}

// ============================================================================
// EVENT CONTRACTS
// ============================================================================

/**
 * Contract: Inspection Events
 * Purpose: Define custom events for inspection system
 */
export interface InspectionEvents {
  /**
   * Fired when element analysis starts
   */
  'inspection:analysis-start': {
    element: Element
    level: AnalysisLevel
  }

  /**
   * Fired when element analysis completes
   */
  'inspection:analysis-complete': {
    element: Element
    metadata: InspectionMetadata
    duration: number
  }

  /**
   * Fired when analysis fails
   */
  'inspection:analysis-error': {
    element: Element
    error: Error
  }

  /**
   * Fired when inspection popup opens
   */
  'inspection:popup-open': {
    element: Element
    data: InspectionPopupData
  }

  /**
   * Fired when inspection popup closes
   */
  'inspection:popup-close': {
    element: Element
  }

  /**
   * Fired when vibe mode is toggled
   */
  'inspection:mode-toggle': {
    enabled: boolean
  }

  /**
   * Fired when hover target changes
   */
  'inspection:hover-change': {
    previous: Element | null
    current: Element | null
  }
}

/**
 * Contract: Event Emitter for Inspection System
 */
export interface IInspectionEventEmitter {
  /**
   * Emit an inspection event
   */
  emit<K extends keyof InspectionEvents>(
    event: K,
    data: InspectionEvents[K]
  ): void

  /**
   * Subscribe to inspection events
   */
  on<K extends keyof InspectionEvents>(
    event: K,
    callback: (data: InspectionEvents[K]) => void
  ): () => void

  /**
   * Subscribe to inspection events (one-time)
   */
  once<K extends keyof InspectionEvents>(
    event: K,
    callback: (data: InspectionEvents[K]) => void
  ): void

  /**
   * Remove all listeners for an event
   */
  removeAllListeners<K extends keyof InspectionEvents>(event?: K): void
}

// ============================================================================
// INTEGRATION CONTRACTS
// ============================================================================

/**
 * Contract: React Component Inspector
 * Purpose: Extract React-specific information from components
 */
export interface IReactInspector {
  /**
   * Extract React component information from element
   */
  extractComponentInfo(element: Element): ReactComponentInfo | null

  /**
   * Get component props
   */
  getComponentProps(fiber: any): Record<string, any> | null

  /**
   * Get component state
   */
  getComponentState(fiber: any): any

  /**
   * Get hooks information
   */
  getHooksInfo(fiber: any): HookInfo[]

  /**
   * Check if element is a React component
   */
  isReactComponent(element: Element): boolean
}

/**
 * Contract: CSS Framework Analyzer
 * Purpose: Analyze CSS frameworks (Tailwind, etc.)
 */
export interface ICSSFrameworkAnalyzer {
  /**
   * Parse Tailwind CSS classes
   */
  parseTailwindClasses(classList: string[]): TailwindClassInfo[]

  /**
   * Extract CSS custom properties
   */
  extractCSSVariables(element: Element): Record<string, string>

  /**
   * Analyze utility class usage
   */
  analyzeUtilityClasses(element: Element): UtilityClassAnalysis

  /**
   * Detect CSS framework being used
   */
  detectFramework(element: Element): 'tailwind' | 'bootstrap' | 'bulma' | 'custom' | null
}

/**
 * Contract: Performance Monitor
 * Purpose: Monitor inspection system performance
 */
export interface IPerformanceMonitor {
  /**
   * Start timing an operation
   */
  startTiming(operation: string): void

  /**
   * End timing an operation
   */
  endTiming(operation: string): number

  /**
   * Record cache hit/miss
   */
  recordCacheHit(hit: boolean): void

  /**
   * Get performance metrics
   */
  getMetrics(): PerformanceMetrics

  /**
   * Reset performance counters
   */
  reset(): void
}

// ============================================================================
// UTILITY TYPE CONTRACTS
// ============================================================================

/**
 * React component information structure
 */
export interface ReactComponentInfo {
  componentName?: string
  props?: Record<string, any>
  state?: any
  hooks?: HookInfo[]
  fiberNode?: any
  displayName?: string
  isClassComponent: boolean
  isFunctionComponent: boolean
}

/**
 * React hook information
 */
export interface HookInfo {
  type: string
  value?: any
  deps?: any[]
}

/**
 * Utility class analysis results
 */
export interface UtilityClassAnalysis {
  totalClasses: number
  utilityClasses: number
  customClasses: number
  frameworkClasses: number
  unusedClasses: string[]
  conflictingClasses: string[]
}

/**
 * Performance metrics for inspection system
 */
export interface PerformanceMetrics {
  totalAnalyses: number
  averageAnalysisTime: number
  cacheHitRate: number
  memoryUsage: number
  largestAnalysis: number
}

// ============================================================================
// ERROR CONTRACTS
// ============================================================================

/**
 * Custom error types for inspection system
 */
export class InspectionError extends Error {
  constructor(
    message: string,
    public code: InspectionErrorCode,
    public element?: Element
  ) {
    super(message)
    this.name = 'InspectionError'
  }
}

export type InspectionErrorCode =
  | 'ELEMENT_NOT_FOUND'
  | 'ANALYSIS_FAILED'
  | 'REACT_FIBER_NOT_FOUND'
  | 'POPUP_POSITIONING_FAILED'
  | 'CACHE_OVERFLOW'
  | 'INVALID_SETTINGS'

// ============================================================================
// CONFIGURATION CONTRACTS
// ============================================================================

/**
 * Configuration for inspection system
 */
export interface InspectionConfig {
  // Performance settings
  debounceDelay: number
  cacheMaxSize: number
  analysisTimeout: number

  // UI settings
  iconSize: number
  popupMaxWidth: number
  popupMaxHeight: number
  animationDuration: number

  // Feature flags
  enableReactInspection: boolean
  enableCSSAnalysis: boolean
  enablePerformanceMetrics: boolean
  enableKeyboardShortcuts: boolean

  // Developer settings
  debugMode: boolean
  logLevel: 'error' | 'warn' | 'info' | 'debug'
}

/**
 * Default configuration values
 */
export const DEFAULT_INSPECTION_CONFIG: InspectionConfig = {
  debounceDelay: 100,
  cacheMaxSize: 100,
  analysisTimeout: 1000,
  iconSize: 20,
  popupMaxWidth: 400,
  popupMaxHeight: 600,
  animationDuration: 200,
  enableReactInspection: true,
  enableCSSAnalysis: true,
  enablePerformanceMetrics: true,
  enableKeyboardShortcuts: true,
  debugMode: false,
  logLevel: 'warn'
}