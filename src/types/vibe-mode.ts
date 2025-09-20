/**
 * TypeScript type definitions for Vibe Mode Quick Inspect
 * Based on data-model.md from spec 019-vibe-mode-quick
 */

// ============================================================================
// CORE DATA TYPES
// ============================================================================

/**
 * Analysis depth levels for inspection system
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
 * Complete box model information for layout analysis
 */
export interface BoxModel {
  content: DOMRect
  padding: {
    top: string
    right: string
    bottom: string
    left: string
  }
  border: {
    top: string
    right: string
    bottom: string
    left: string
  }
  margin: {
    top: string
    right: string
    bottom: string
    left: string
  }
}

/**
 * Element positioning information
 */
export interface PositioningInfo {
  position: string
  top: string
  right: string
  bottom: string
  left: string
  zIndex: string
}

/**
 * Flexbox layout information
 */
export interface FlexboxInfo {
  direction: string
  wrap: string
  justifyContent: string
  alignItems: string
}

/**
 * Grid layout information
 */
export interface GridInfo {
  templateColumns: string
  templateRows: string
  gap: string
}

/**
 * Basic element information
 */
export interface ElementInfo {
  tagName: string
  id?: string
  classes: string[]
  textContent?: string
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
 * Structured representation of Tailwind CSS classes with semantic meaning
 */
export interface TailwindClassInfo {
  className: string
  category: 'spacing' | 'sizing' | 'colors' | 'layout' | 'typography' | 'effects'
  property: string
  value: string
  responsive?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  pseudoClass?: 'hover' | 'focus' | 'active' | 'disabled'
  cssProperty: string
  cssValue: string
}

/**
 * Comprehensive data structure containing all analysis information for a DOM element
 */
export interface InspectionMetadata {
  // Basic DOM information
  element: {
    tagName: string
    id?: string
    classes: string[]
    attributes: Record<string, string>
    textContent?: string
  }

  // Computed styling information
  styles: {
    display: string
    position: string
    zIndex: string
    backgroundColor: string
    color: string
    dimensions: DOMRect
    boxModel: BoxModel
  }

  // React component information (when available)
  react?: {
    componentName?: string
    props?: Record<string, any>
    state?: any
    hooks?: HookInfo[]
    fiberNode?: any
  }

  // CSS framework analysis
  cssFramework: {
    tailwindClasses: TailwindClassInfo[]
    customClasses: string[]
    cssVariables: Record<string, string>
  }

  // Layout and positioning
  layout: {
    positioning: PositioningInfo
    flexbox?: FlexboxInfo
    grid?: GridInfo
    parentChain: ElementInfo[]
    children: ElementInfo[]
  }

  // Inspection metadata
  inspection: {
    timestamp: number
    analysisLevel: AnalysisLevel
    isVisible: boolean
    isInteractive: boolean
  }
}

/**
 * Structured content sections for the inspection popup
 */
export interface InsightSection {
  id: string
  title: string
  priority: 'high' | 'medium' | 'low'
  type: 'info' | 'warning' | 'error' | 'tip'
  content: {
    summary: string
    details?: string[]
    codeSnippet?: string
    links?: { text: string; url: string }[]
  }
  category: 'component' | 'styling' | 'performance' | 'accessibility' | 'layout'
}

/**
 * Future features to display in "Coming Soon" section
 */
export interface ComingSoonFeature {
  id: string
  title: string
  description: string
  category: 'analytics' | 'feedback' | 'ai-insights' | 'performance' | 'collaboration'
  estimatedRelease?: string
  priority: 'high' | 'medium' | 'low'
  dependencies?: string[]
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
 * Data structure for rendering the developer insights popup
 */
export interface InspectionPopupData {
  target: Element
  metadata: InspectionMetadata
  position: PopupPosition
  content: {
    primary: InsightSection[]
    secondary: InsightSection[]
    comingSoon: ComingSoonFeature[]
  }
  settings: {
    showAdvanced: boolean
    includeReactInfo: boolean
    includeCSSAnalysis: boolean
    includePerformanceMetrics: boolean
  }
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

/**
 * Global state management for the inspection system
 */
export interface VibeInspectionState {
  isEnabled: boolean
  currentTarget?: Element
  activePopup?: InspectionPopupData
  hoveredElement?: Element
  settings: {
    showOnHover: boolean
    analysisLevel: AnalysisLevel
    autoPosition: boolean
    keyboardShortcuts: boolean
    debugMode: boolean
  }
  cache: Map<Element, InspectionMetadata>
  performance: {
    analysisCount: number
    averageAnalysisTime: number
    cacheHitRate: number
  }
}

// ============================================================================
// UTILITY AND ANALYSIS TYPES
// ============================================================================

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
// ERROR TYPES
// ============================================================================

/**
 * Error codes for inspection system
 */
export type InspectionErrorCode =
  | 'ELEMENT_NOT_FOUND'
  | 'ANALYSIS_FAILED'
  | 'REACT_FIBER_NOT_FOUND'
  | 'POPUP_POSITIONING_FAILED'
  | 'CACHE_OVERFLOW'
  | 'INVALID_SETTINGS'

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

// ============================================================================
// CONFIGURATION TYPES
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

// ============================================================================
// EVENT TYPES
// ============================================================================

/**
 * Inspection system events
 */
export interface InspectionEvents {
  'inspection:analysis-start': {
    element: Element
    level: AnalysisLevel
  }
  'inspection:analysis-complete': {
    element: Element
    metadata: InspectionMetadata
    duration: number
  }
  'inspection:analysis-error': {
    element: Element
    error: Error
  }
  'inspection:popup-open': {
    element: Element
    data: InspectionPopupData
  }
  'inspection:popup-close': {
    element: Element
  }
  'inspection:mode-toggle': {
    enabled: boolean
  }
  'inspection:hover-change': {
    previous: Element | null
    current: Element | null
  }
}