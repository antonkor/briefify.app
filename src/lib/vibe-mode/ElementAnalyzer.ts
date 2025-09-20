/**
 * Element Analyzer - DOM Element Analysis Implementation
 *
 * Handles comprehensive analysis of DOM elements including:
 * - Basic element metadata extraction
 * - React component analysis via Fiber
 * - CSS framework detection (Tailwind, etc.)
 * - Performance metrics and caching
 * - Accessibility information
 */

import type {
  IElementAnalyzer,
  AnalysisLevel
} from '@/specs/019-vibe-mode-quick/contracts/inspection-api'

import type {
  InspectionMetadata,
  ReactComponentInfo,
  HookInfo,
  UtilityClassAnalysis,
  TailwindClassInfo
} from '@/types/vibe-mode'

import {
  DEFAULT_INSPECTION_CONFIG
} from '@/types/vibe-mode'

import {
  extractElementMetadata,
  extractReactComponentInfo,
  parseTailwindClasses,
  analyzeUtilityClasses,
  extractLayoutInfo,
  isElementVisible,
  isElementInteractive,
  validateElement,
  calculateOptimalPosition,
  detectAccessibilityIssues,
  calculateElementMetrics,
  analyzeElementPosition
} from '@/utils/elementAnalysis'

/**
 * Comprehensive DOM element analysis implementation
 */
export class ElementAnalyzer implements IElementAnalyzer {
  private _cache = new Map<Element, InspectionMetadata>()
  private _observers = new Map<Element, MutationObserver>()
  private _performanceMetrics = {
    totalAnalyses: 0,
    cacheHits: 0,
    averageAnalysisTime: 0
  }
  private _isDestroyed = false

  constructor(
    private _config = DEFAULT_INSPECTION_CONFIG
  ) {}

  /**
   * Analyze a DOM element and return comprehensive metadata
   */
  async analyzeElement(
    element: Element,
    level: AnalysisLevel = 'basic'
  ): Promise<InspectionMetadata> {
    if (this._isDestroyed) {
      throw new Error('ElementAnalyzer has been destroyed')
    }

    if (!element || !document.contains(element)) {
      throw new Error('Element not found or not in document')
    }

    const startTime = performance.now()

    try {
      // Check cache first
      const cached = this.getCachedAnalysis(element)
      if (cached) {
        this._performanceMetrics.cacheHits++
        return cached
      }

      // Perform analysis based on level
      const metadata = await this._performAnalysis(element, level)

      // Cache the result
      this._cache.set(element, metadata)

      // Update performance metrics
      const duration = performance.now() - startTime
      this._updatePerformanceMetrics(duration)

      // Start observing element for changes if not already
      if (!this._observers.has(element)) {
        this.observeElement(element)
      }

      return metadata

    } catch (error) {
      const duration = performance.now() - startTime
      this._updatePerformanceMetrics(duration)

      console.error('[ElementAnalyzer] Analysis failed:', {
        element: element.tagName,
        error: error instanceof Error ? error.message : 'Unknown error'
      })

      throw error
    }
  }

  /**
   * Start observing element for changes
   */
  observeElement(element: Element): () => void {
    if (this._isDestroyed) {
      throw new Error('ElementAnalyzer has been destroyed')
    }

    if (this._observers.has(element)) {
      return () => {} // Already observing
    }

    const observer = new MutationObserver(() => {
      // Invalidate cache when element changes
      this._cache.delete(element)
    })

    observer.observe(element, {
      attributes: true,
      childList: true,
      subtree: false
    })

    this._observers.set(element, observer)

    // Return cleanup function
    return () => {
      observer.disconnect()
      this._observers.delete(element)
    }
  }

  /**
   * Get cached analysis if available
   */
  getCachedAnalysis(element: Element): InspectionMetadata | null {
    if (this._isDestroyed) {
      return null
    }

    return this._cache.get(element) || null
  }

  /**
   * Clear analysis cache
   */
  clearCache(): void {
    if (this._isDestroyed) {
      return
    }

    this._cache.clear()

    // Stop all observers
    this._observers.forEach(observer => observer.disconnect())
    this._observers.clear()
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    return { ...this._performanceMetrics }
  }

  /**
   * Destroy analyzer and clean up
   */
  destroy(): void {
    if (this._isDestroyed) {
      return
    }

    this.clearCache()
    this._isDestroyed = true
  }

  /**
   * Perform the actual element analysis
   */
  private async _performAnalysis(
    element: Element,
    level: AnalysisLevel
  ): Promise<InspectionMetadata> {
    const metadata: InspectionMetadata = {
      element: {
        tagName: element.tagName.toLowerCase(),
        id: element.id || undefined,
        classes: Array.from(element.classList),
        attributes: this._extractAttributes(element),
        textContent: element.textContent?.trim() || undefined
      },
      styles: {
        display: window.getComputedStyle(element).display,
        position: window.getComputedStyle(element).position,
        zIndex: window.getComputedStyle(element).zIndex,
        backgroundColor: window.getComputedStyle(element).backgroundColor,
        color: window.getComputedStyle(element).color,
        dimensions: element.getBoundingClientRect(),
        boxModel: this._getBoxModel(element)
      },
      cssFramework: {
        tailwindClasses: parseTailwindClasses(Array.from(element.classList)),
        customClasses: this._getCustomClasses(element),
        cssVariables: this._getCSSVariables(element)
      },
      layout: extractLayoutInfo(element),
      inspection: {
        timestamp: Date.now(),
        analysisLevel: level,
        isVisible: isElementVisible(element),
        isInteractive: isElementInteractive(element)
      }
    }

    // Add React analysis if available and requested
    if (level !== 'basic') {
      const reactInfo = this._analyzeReactComponent(element)
      if (reactInfo) {
        metadata.react = reactInfo
      }
    }

    // Add comprehensive analysis for detailed/comprehensive levels
    if (level === 'detailed' || level === 'comprehensive') {
      // Additional CSS analysis and performance data would be added here
      // This is handled by the main metadata structure above
    }

    return metadata
  }

  /**
   * Extract element attributes
   */
  private _extractAttributes(element: Element): Record<string, string> {
    const attributes: Record<string, string> = {}

    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i]
      attributes[attr.name] = attr.value
    }

    return attributes
  }

  /**
   * Get computed styles for important properties
   */
  private _getComputedStyles(element: Element): Record<string, string> {
    const computed = window.getComputedStyle(element)

    const importantStyles = [
      'display', 'position', 'width', 'height', 'margin', 'padding',
      'background-color', 'color', 'font-family', 'font-size',
      'border', 'border-radius', 'box-shadow', 'z-index',
      'flex-direction', 'justify-content', 'align-items',
      'grid-template-columns', 'grid-template-rows'
    ]

    const styles: Record<string, string> = {}

    importantStyles.forEach(prop => {
      const value = computed.getPropertyValue(prop)
      if (value && value !== 'auto' && value !== 'normal') {
        styles[prop] = value
      }
    })

    return styles
  }

  /**
   * Get box model information
   */
  private _getBoxModel(element: Element): any {
    const computed = window.getComputedStyle(element)
    return {
      content: element.getBoundingClientRect(),
      padding: {
        top: computed.paddingTop,
        right: computed.paddingRight,
        bottom: computed.paddingBottom,
        left: computed.paddingLeft
      },
      border: {
        top: computed.borderTopWidth,
        right: computed.borderRightWidth,
        bottom: computed.borderBottomWidth,
        left: computed.borderLeftWidth
      },
      margin: {
        top: computed.marginTop,
        right: computed.marginRight,
        bottom: computed.marginBottom,
        left: computed.marginLeft
      }
    }
  }

  /**
   * Get custom classes (non-framework classes)
   */
  private _getCustomClasses(element: Element): string[] {
    const classList = Array.from(element.classList)
    const tailwindClasses = parseTailwindClasses(classList)
    const tailwindClassNames = tailwindClasses.map(tc => tc.className)

    return classList.filter(cls => !tailwindClassNames.includes(cls))
  }

  /**
   * Get CSS custom properties
   */
  private _getCSSVariables(element: Element): Record<string, string> {
    const computed = window.getComputedStyle(element)
    const variables: Record<string, string> = {}

    for (let i = 0; i < computed.length; i++) {
      const property = computed[i]
      if (property.startsWith('--')) {
        variables[property] = computed.getPropertyValue(property)
      }
    }

    return variables
  }

  /**
   * Detect CSS framework being used
   */
  private _detectFramework(element: Element): string | undefined {
    const classList = Array.from(element.classList)

    // Tailwind CSS detection
    const tailwindPatterns = [
      /^(text|bg|border|p|m|w|h|flex|grid)-/,
      /^(sm|md|lg|xl|2xl):/,
      /^(hover|focus|active):/
    ]

    const hasTailwind = classList.some(cls =>
      tailwindPatterns.some(pattern => pattern.test(cls))
    )

    if (hasTailwind) return 'tailwind'

    // Bootstrap detection
    const hasBootstrap = classList.some(cls =>
      cls.startsWith('btn-') ||
      cls.startsWith('col-') ||
      cls.startsWith('row') ||
      cls === 'container' ||
      cls === 'container-fluid'
    )

    if (hasBootstrap) return 'bootstrap'

    return undefined
  }

  /**
   * Analyze React component if available
   */
  private _analyzeReactComponent(element: Element): ReactComponentInfo | null {
    try {
      // Look for React Fiber node
      const fiberKey = Object.keys(element).find(key =>
        key.startsWith('__reactFiber') || key.startsWith('__reactInternalInstance')
      )

      if (!fiberKey) return null

      const fiber = (element as any)[fiberKey]
      if (!fiber) return null

      const componentInfo: ReactComponentInfo = {
        isClassComponent: false,
        isFunctionComponent: false
      }

      // Extract component name
      if (fiber.type) {
        if (typeof fiber.type === 'function') {
          componentInfo.componentName = fiber.type.name || fiber.type.displayName
          componentInfo.isFunctionComponent = true
        } else if (typeof fiber.type === 'string') {
          componentInfo.componentName = fiber.type
        }
      }

      // Extract props
      if (fiber.memoizedProps) {
        componentInfo.props = this._sanitizeProps(fiber.memoizedProps)
      }

      // Extract state for class components
      if (fiber.memoizedState && !componentInfo.isFunctionComponent) {
        componentInfo.state = fiber.memoizedState
        componentInfo.isClassComponent = true
      }

      // Extract hooks for function components
      if (fiber.memoizedState && componentInfo.isFunctionComponent) {
        componentInfo.hooks = this._extractHooks(fiber.memoizedState)
      }

      componentInfo.fiberNode = fiber

      return componentInfo

    } catch (error) {
      // React analysis failed, return null
      return null
    }
  }

  /**
   * Sanitize props to remove functions and circular references
   */
  private _sanitizeProps(props: any): Record<string, any> {
    const sanitized: Record<string, any> = {}

    for (const [key, value] of Object.entries(props)) {
      if (typeof value === 'function') {
        sanitized[key] = '[Function]'
      } else if (value === null || value === undefined) {
        sanitized[key] = value
      } else if (typeof value === 'object') {
        try {
          // Basic circular reference check
          JSON.stringify(value)
          sanitized[key] = value
        } catch {
          sanitized[key] = '[Circular Reference]'
        }
      } else {
        sanitized[key] = value
      }
    }

    return sanitized
  }

  /**
   * Extract React hooks information
   */
  private _extractHooks(hookState: any): HookInfo[] {
    const hooks: HookInfo[] = []

    try {
      let current = hookState
      let index = 0

      while (current && index < 20) { // Limit to prevent infinite loops
        const hook: HookInfo = {
          type: this._getHookType(current, index)
        }

        if (current.memoizedState !== undefined) {
          hook.value = current.memoizedState
        }

        if (current.deps) {
          hook.deps = current.deps
        }

        hooks.push(hook)
        current = current.next
        index++
      }
    } catch (error) {
      // Hook extraction failed
    }

    return hooks
  }

  /**
   * Determine hook type based on structure
   */
  private _getHookType(hook: any, index: number): string {
    if (hook.queue) {
      return 'useState'
    }
    if (hook.deps !== undefined) {
      return hook.deps.length === 0 ? 'useEffect' : 'useEffect'
    }
    if (hook.create) {
      return 'useMemo'
    }
    return `unknown-${index}`
  }

  /**
   * Analyze CSS framework usage
   */
  private _analyzeCSSFramework(element: Element): UtilityClassAnalysis {
    const classList = Array.from(element.classList)

    const analysis: UtilityClassAnalysis = {
      totalClasses: classList.length,
      utilityClasses: 0,
      customClasses: 0,
      frameworkClasses: 0,
      unusedClasses: [],
      conflictingClasses: []
    }

    const tailwindPattern = /^(text|bg|border|p|m|w|h|flex|grid|space|divide)-/
    const bootstrapPattern = /^(btn|col|row|container|d-|text-|bg-|border-)/

    classList.forEach(cls => {
      if (tailwindPattern.test(cls) || bootstrapPattern.test(cls)) {
        analysis.frameworkClasses++
        analysis.utilityClasses++
      } else if (cls.includes('-') && cls.length < 20) {
        analysis.utilityClasses++
      } else {
        analysis.customClasses++
      }
    })

    return analysis
  }

  /**
   * Analyze element hierarchy
   */
  private _analyzeElementHierarchy(element: Element) {
    return {
      depth: this._getElementDepth(element),
      siblings: element.parentElement?.children.length || 0,
      children: element.children.length,
      parent: element.parentElement?.tagName.toLowerCase() || null
    }
  }

  /**
   * Get element depth in DOM tree
   */
  private _getElementDepth(element: Element): number {
    let depth = 0
    let current = element.parentElement

    while (current && depth < 100) { // Prevent infinite loops
      depth++
      current = current.parentElement
    }

    return depth
  }

  /**
   * Analyze element interactions
   */
  private _analyzeInteractions(element: Element) {
    const hasClickHandler = this._hasEventListener(element, 'click')
    const hasHoverEffects = this._hasHoverEffects(element)
    const isFocusable = this._isFocusable(element)

    return {
      hasClickHandler,
      hasHoverEffects,
      isFocusable,
      isInteractive: hasClickHandler || isFocusable
    }
  }

  /**
   * Check if element has event listeners (heuristic)
   */
  private _hasEventListener(element: Element, eventType: string): boolean {
    // Check for inline handlers
    if (element.getAttribute(`on${eventType}`)) {
      return true
    }

    // Check for cursor pointer (common indicator)
    const computed = window.getComputedStyle(element)
    if (computed.cursor === 'pointer') {
      return true
    }

    return false
  }

  /**
   * Check if element has hover effects
   */
  private _hasHoverEffects(element: Element): boolean {
    const classList = Array.from(element.classList)
    return classList.some(cls => cls.includes('hover'))
  }

  /**
   * Check if element is focusable
   */
  private _isFocusable(element: Element): boolean {
    const focusableElements = [
      'input', 'button', 'select', 'textarea', 'a', 'area'
    ]

    if (focusableElements.includes(element.tagName.toLowerCase())) {
      return true
    }

    return element.hasAttribute('tabindex')
  }

  /**
   * Generate optimization suggestions
   */
  private _generateOptimizationSuggestions(element: Element) {
    const suggestions: string[] = []

    // Check for missing alt text on images
    if (element.tagName.toLowerCase() === 'img' && !element.getAttribute('alt')) {
      suggestions.push('Add alt text for accessibility')
    }

    // Check for duplicate IDs
    if (element.id && document.querySelectorAll(`#${element.id}`).length > 1) {
      suggestions.push('Duplicate ID detected - ensure uniqueness')
    }

    // Check for excessive nesting
    const depth = this._getElementDepth(element)
    if (depth > 15) {
      suggestions.push('Consider reducing DOM depth for better performance')
    }

    // Check for large number of classes
    if (element.classList.length > 10) {
      suggestions.push('Consider consolidating CSS classes')
    }

    return suggestions
  }

  /**
   * Update performance metrics
   */
  private _updatePerformanceMetrics(duration: number): void {
    this._performanceMetrics.totalAnalyses++

    const count = this._performanceMetrics.totalAnalyses
    this._performanceMetrics.averageAnalysisTime =
      ((this._performanceMetrics.averageAnalysisTime * (count - 1)) + duration) / count
  }
}