/**
 * Element Analysis Utilities for Vibe Mode Quick Inspect
 * Core utilities for DOM element analysis and metadata extraction
 */

import type {
  InspectionMetadata,
  TailwindClassInfo,
  BoxModel,
  PositioningInfo,
  FlexboxInfo,
  GridInfo,
  ElementInfo,
  ReactComponentInfo,
  HookInfo,
  UtilityClassAnalysis,
  AnalysisLevel,
  InspectionErrorCode
} from '@/types/vibe-mode'

import {
  InspectionError
} from '@/types/vibe-mode'

// ============================================================================
// CORE ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Extract comprehensive metadata from a DOM element
 */
export function extractElementMetadata(element: Element): Partial<InspectionMetadata> {
  try {
    const rect = element.getBoundingClientRect()
    const computedStyles = window.getComputedStyle(element)

    return {
      element: {
        tagName: element.tagName.toLowerCase(),
        id: element.id || undefined,
        classes: Array.from(element.classList),
        attributes: getElementAttributes(element),
        textContent: element.textContent?.trim() || undefined
      },
      styles: {
        display: computedStyles.display,
        position: computedStyles.position,
        zIndex: computedStyles.zIndex,
        backgroundColor: computedStyles.backgroundColor,
        color: computedStyles.color,
        dimensions: rect,
        boxModel: extractBoxModel(element, computedStyles)
      },
      inspection: {
        timestamp: Date.now(),
        analysisLevel: 'basic',
        isVisible: isElementVisible(element),
        isInteractive: isElementInteractive(element)
      }
    }
  } catch (error) {
    throw new InspectionError(
      `Failed to extract element metadata: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'ANALYSIS_FAILED',
      element
    )
  }
}

/**
 * Get all attributes from an element as a record
 */
export function getElementAttributes(element: Element): Record<string, string> {
  const attrs: Record<string, string> = {}

  for (const attr of element.attributes) {
    attrs[attr.name] = attr.value
  }

  return attrs
}

/**
 * Extract box model information from element
 */
export function extractBoxModel(element: Element, computedStyles: CSSStyleDeclaration): BoxModel {
  const rect = element.getBoundingClientRect()

  return {
    content: rect,
    padding: {
      top: computedStyles.paddingTop,
      right: computedStyles.paddingRight,
      bottom: computedStyles.paddingBottom,
      left: computedStyles.paddingLeft
    },
    border: {
      top: computedStyles.borderTopWidth,
      right: computedStyles.borderRightWidth,
      bottom: computedStyles.borderBottomWidth,
      left: computedStyles.borderLeftWidth
    },
    margin: {
      top: computedStyles.marginTop,
      right: computedStyles.marginRight,
      bottom: computedStyles.marginBottom,
      left: computedStyles.marginLeft
    }
  }
}

/**
 * Check if element is visible in viewport
 */
export function isElementVisible(element: Element): boolean {
  const rect = element.getBoundingClientRect()
  const computedStyles = window.getComputedStyle(element)

  return (
    rect.width > 0 &&
    rect.height > 0 &&
    computedStyles.visibility !== 'hidden' &&
    computedStyles.display !== 'none' &&
    parseFloat(computedStyles.opacity) > 0
  )
}

/**
 * Check if element is interactive (clickable, focusable, etc.)
 */
export function isElementInteractive(element: Element): boolean {
  const interactiveTags = ['button', 'a', 'input', 'select', 'textarea', 'details', 'summary']
  const tagName = element.tagName.toLowerCase()

  if (interactiveTags.includes(tagName)) return true

  // Check for interactive attributes
  if (element.hasAttribute('onclick') ||
      element.hasAttribute('onmousedown') ||
      element.hasAttribute('tabindex') ||
      element.hasAttribute('role')) {
    return true
  }

  // Check for click event listeners (simplified check)
  const computedStyles = window.getComputedStyle(element)
  if (computedStyles.cursor === 'pointer') return true

  return false
}

// ============================================================================
// REACT FIBER ANALYSIS
// ============================================================================

/**
 * Find React Fiber node from DOM element
 */
export function findReactFiber(element: Element): any {
  const key = Object.keys(element).find(key =>
    key.startsWith('__reactInternalInstance$') ||
    key.startsWith('__reactFiber$')
  )

  if (key) {
    return (element as any)[key]
  }

  return null
}

/**
 * Extract React component information from fiber node
 */
export function extractReactComponentInfo(element: Element): ReactComponentInfo | null {
  try {
    const fiber = findReactFiber(element)
    if (!fiber) return null

    const componentInfo = extractReactProps(fiber)
    if (!componentInfo) return null

    return {
      ...componentInfo,
      hooks: extractHookState(fiber),
      isClassComponent: typeof fiber.type === 'function' && fiber.type.prototype?.isReactComponent,
      isFunctionComponent: typeof fiber.type === 'function' && !fiber.type.prototype?.isReactComponent
    }
  } catch (error) {
    console.warn('Failed to extract React component info:', error)
    return null
  }
}

/**
 * Extract props and state from React fiber
 */
function extractReactProps(fiber: any): any {
  if (!fiber) return null

  let currentFiber = fiber
  while (currentFiber) {
    if (currentFiber.memoizedProps) {
      return {
        props: currentFiber.memoizedProps,
        state: currentFiber.memoizedState,
        componentName: currentFiber.type?.name || currentFiber.type?.displayName,
        displayName: currentFiber.type?.displayName,
        key: currentFiber.key
      }
    }
    currentFiber = currentFiber.return
  }

  return null
}

/**
 * Extract hooks information from fiber (simplified)
 */
function extractHookState(fiber: any): HookInfo[] {
  const hooks: HookInfo[] = []

  try {
    if (fiber?.memoizedState) {
      let hook = fiber.memoizedState
      let hookIndex = 0

      while (hook && hookIndex < 10) { // Limit to prevent infinite loops
        hooks.push({
          type: `Hook ${hookIndex}`,
          value: hook.memoizedState,
          deps: hook.deps
        })

        hook = hook.next
        hookIndex++
      }
    }
  } catch (error) {
    console.warn('Failed to extract hook state:', error)
  }

  return hooks
}

// ============================================================================
// CSS FRAMEWORK ANALYSIS
// ============================================================================

/**
 * Parse Tailwind CSS classes from class list
 */
export function parseTailwindClasses(classList: string[]): TailwindClassInfo[] {
  const tailwindClasses: TailwindClassInfo[] = []

  const tailwindPatterns = {
    spacing: /^(m|p)(t|r|b|l|x|y)?-(\d+|auto|px)$/,
    sizing: /^(w|h|min-w|min-h|max-w|max-h)-(.+)$/,
    colors: /^(text|bg|border)-(gray|blue|red|green|yellow|purple|pink|indigo|slate)-(\d+)$/,
    display: /^(block|inline|flex|grid|hidden)$/,
    positioning: /^(static|fixed|absolute|relative|sticky)$/,
    responsive: /^(sm|md|lg|xl|2xl):(.+)$/,
    pseudoClass: /^(hover|focus|active|disabled):(.+)$/
  }

  classList.forEach(className => {
    // Check for responsive prefixes
    const responsiveMatch = className.match(tailwindPatterns.responsive)
    if (responsiveMatch) {
      const [, breakpoint, actualClass] = responsiveMatch
      const parsed = parseSingleTailwindClass(actualClass)
      if (parsed) {
        tailwindClasses.push({ ...parsed, responsive: breakpoint as any })
      }
      return
    }

    // Check for pseudo-class prefixes
    const pseudoMatch = className.match(tailwindPatterns.pseudoClass)
    if (pseudoMatch) {
      const [, pseudoClass, actualClass] = pseudoMatch
      const parsed = parseSingleTailwindClass(actualClass)
      if (parsed) {
        tailwindClasses.push({ ...parsed, pseudoClass: pseudoClass as any })
      }
      return
    }

    const parsed = parseSingleTailwindClass(className)
    if (parsed) {
      tailwindClasses.push(parsed)
    }
  })

  return tailwindClasses
}

/**
 * Parse a single Tailwind class
 */
function parseSingleTailwindClass(className: string): TailwindClassInfo | null {
  // Spacing classes (margin, padding)
  const spacingMatch = className.match(/^(m|p)(t|r|b|l|x|y)?-(\d+|auto|px)$/)
  if (spacingMatch) {
    const [, type, direction, value] = spacingMatch
    return {
      className,
      category: 'spacing',
      property: direction ? `${type}${direction}` : type,
      value: value,
      cssProperty: `${type === 'm' ? 'margin' : 'padding'}${direction ? `-${direction}` : ''}`,
      cssValue: value === 'px' ? '1px' : value === 'auto' ? 'auto' : `${parseInt(value) * 0.25}rem`
    }
  }

  // Color classes
  const colorMatch = className.match(/^(text|bg|border)-(gray|blue|red|green|yellow|purple|pink|indigo|slate)-(\d+)$/)
  if (colorMatch) {
    const [, type, color, shade] = colorMatch
    return {
      className,
      category: 'colors',
      property: type,
      value: `${color}-${shade}`,
      cssProperty: type === 'text' ? 'color' : type === 'bg' ? 'background-color' : 'border-color',
      cssValue: `var(--${color}-${shade})`
    }
  }

  // Display classes
  const displayMatch = className.match(/^(block|inline|flex|grid|hidden)$/)
  if (displayMatch) {
    const [, display] = displayMatch
    return {
      className,
      category: 'layout',
      property: 'display',
      value: display,
      cssProperty: 'display',
      cssValue: display === 'hidden' ? 'none' : display
    }
  }

  return null
}

/**
 * Extract CSS custom properties from element
 */
export function extractCSSVariables(element: Element): Record<string, string> {
  const computedStyles = window.getComputedStyle(element)
  const cssVariables: Record<string, string> = {}

  for (const property of Array.from(computedStyles)) {
    if (property.startsWith('--')) {
      cssVariables[property] = computedStyles.getPropertyValue(property)
    }
  }

  return cssVariables
}

/**
 * Analyze utility class usage patterns
 */
export function analyzeUtilityClasses(element: Element): UtilityClassAnalysis {
  const classList = Array.from(element.classList)
  const tailwindClasses = parseTailwindClasses(classList)

  return {
    totalClasses: classList.length,
    utilityClasses: tailwindClasses.length,
    customClasses: classList.length - tailwindClasses.length,
    frameworkClasses: tailwindClasses.length,
    unusedClasses: [], // Would require runtime analysis
    conflictingClasses: [] // Would require CSS conflict detection
  }
}

// ============================================================================
// LAYOUT ANALYSIS
// ============================================================================

/**
 * Get parent element chain
 */
export function getParentChain(element: Element, maxDepth: number = 10): ElementInfo[] {
  const parents: ElementInfo[] = []
  let current = element.parentElement

  while (current && parents.length < maxDepth) {
    parents.push({
      tagName: current.tagName.toLowerCase(),
      id: current.id || undefined,
      classes: Array.from(current.classList),
      textContent: current.textContent?.trim().slice(0, 50) || undefined
    })
    current = current.parentElement
  }

  return parents
}

/**
 * Get direct children elements
 */
export function getDirectChildren(element: Element, maxCount: number = 20): ElementInfo[] {
  return Array.from(element.children)
    .slice(0, maxCount)
    .map(child => ({
      tagName: child.tagName.toLowerCase(),
      id: child.id || undefined,
      classes: Array.from(child.classList),
      textContent: child.textContent?.trim().slice(0, 50) || undefined
    }))
}

/**
 * Extract layout information from element
 */
export function extractLayoutInfo(element: Element) {
  const computedStyles = window.getComputedStyle(element)

  const positioning: PositioningInfo = {
    position: computedStyles.position,
    top: computedStyles.top,
    right: computedStyles.right,
    bottom: computedStyles.bottom,
    left: computedStyles.left,
    zIndex: computedStyles.zIndex
  }

  const flexbox: FlexboxInfo | undefined = computedStyles.display === 'flex' ? {
    direction: computedStyles.flexDirection,
    wrap: computedStyles.flexWrap,
    justifyContent: computedStyles.justifyContent,
    alignItems: computedStyles.alignItems
  } : undefined

  const grid: GridInfo | undefined = computedStyles.display === 'grid' ? {
    templateColumns: computedStyles.gridTemplateColumns,
    templateRows: computedStyles.gridTemplateRows,
    gap: computedStyles.gap
  } : undefined

  return {
    positioning,
    flexbox,
    grid,
    parentChain: getParentChain(element),
    children: getDirectChildren(element)
  }
}

// ============================================================================
// POPUP POSITIONING UTILITIES
// ============================================================================

/**
 * Calculate optimal popup position to stay within viewport
 */
export function calculateOptimalPosition(
  triggerElement: Element,
  popupSize: { width: number; height: number }
) {
  const rect = triggerElement.getBoundingClientRect()
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  // Prefer right-bottom placement
  let position = {
    top: rect.bottom + 8,
    left: rect.right + 8,
    placement: 'bottom' as const
  }

  // Adjust if popup would overflow viewport
  if (position.left + popupSize.width > viewport.width) {
    position.left = rect.left - popupSize.width - 8
    position.placement = 'left'
  }

  if (position.top + popupSize.height > viewport.height) {
    position.top = rect.top - popupSize.height - 8
    position.placement = position.placement === 'left' ? 'left' : 'top'
  }

  // Ensure position is within viewport bounds
  position.left = Math.max(8, Math.min(position.left, viewport.width - popupSize.width - 8))
  position.top = Math.max(8, Math.min(position.top, viewport.height - popupSize.height - 8))

  return {
    x: position.left,
    y: position.top,
    placement: position.placement,
    strategy: 'fixed' as const
  }
}

// ============================================================================
// PERFORMANCE UTILITIES
// ============================================================================

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | undefined

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = window.setTimeout(() => {
      func.apply(null, args)
    }, wait)
  }
}

/**
 * Create performance timer
 */
export function createPerformanceTimer(operation: string) {
  const start = performance.now()

  return {
    end: () => {
      const duration = performance.now() - start
      console.debug(`[Vibe Mode] ${operation}: ${duration.toFixed(2)}ms`)
      return duration
    }
  }
}

// ============================================================================
// ACCESSIBILITY ANALYSIS
// ============================================================================

/**
 * Detect accessibility issues with element
 */
export function detectAccessibilityIssues(element: Element): Array<{
  type: string
  message: string
  severity: 'error' | 'warning' | 'info'
}> {
  const issues: Array<{
    type: string
    message: string
    severity: 'error' | 'warning' | 'info'
  }> = []

  // Check for missing alt text on images
  if (element.tagName.toLowerCase() === 'img' && !element.getAttribute('alt')) {
    issues.push({
      type: 'missing-alt-text',
      message: 'Image missing alt text for screen readers',
      severity: 'error'
    })
  }

  // Check for missing labels on form inputs
  if (['input', 'select', 'textarea'].includes(element.tagName.toLowerCase())) {
    const id = element.getAttribute('id')
    const ariaLabel = element.getAttribute('aria-label')
    const ariaLabelledBy = element.getAttribute('aria-labelledby')

    if (!ariaLabel && !ariaLabelledBy && (!id || !document.querySelector(`label[for="${id}"]`))) {
      issues.push({
        type: 'missing-label',
        message: 'Form control missing accessible label',
        severity: 'error'
      })
    }
  }

  // Check for insufficient color contrast (simplified check)
  const computedStyles = window.getComputedStyle(element)
  const backgroundColor = computedStyles.backgroundColor
  const color = computedStyles.color

  if (backgroundColor !== 'rgba(0, 0, 0, 0)' && color !== 'rgba(0, 0, 0, 0)') {
    // This is a simplified check - real contrast checking would require color parsing
    if (backgroundColor === color) {
      issues.push({
        type: 'poor-contrast',
        message: 'Text and background colors may have poor contrast',
        severity: 'warning'
      })
    }
  }

  // Check for clickable elements without proper roles
  const isClickable = element.hasAttribute('onclick') ||
                     computedStyles.cursor === 'pointer'

  if (isClickable && !['button', 'a', 'input'].includes(element.tagName.toLowerCase()) &&
      !element.getAttribute('role')) {
    issues.push({
      type: 'missing-role',
      message: 'Interactive element missing appropriate role',
      severity: 'warning'
    })
  }

  return issues
}

/**
 * Calculate element performance metrics
 */
export function calculateElementMetrics(element: Element): Record<string, any> {
  const rect = element.getBoundingClientRect()
  const computedStyles = window.getComputedStyle(element)

  return {
    renderTime: 0, // Would require performance measurement
    layoutCost: rect.width * rect.height, // Simplified layout cost
    paintCost: computedStyles.boxShadow !== 'none' ||
               computedStyles.borderRadius !== '0px' ? 'high' : 'low',
    memoryUsage: element.outerHTML.length, // Rough estimate
    domDepth: getElementDepth(element),
    childrenCount: element.children.length
  }
}

/**
 * Get element depth in DOM tree
 */
function getElementDepth(element: Element): number {
  let depth = 0
  let current = element.parentElement

  while (current && depth < 100) { // Prevent infinite loops
    depth++
    current = current.parentElement
  }

  return depth
}

/**
 * Analyze element position in layout
 */
export function analyzeElementPosition(element: Element): Record<string, any> {
  const rect = element.getBoundingClientRect()
  const computedStyles = window.getComputedStyle(element)

  return {
    inViewport: rect.top >= 0 && rect.left >= 0 &&
                rect.bottom <= window.innerHeight &&
                rect.right <= window.innerWidth,
    position: computedStyles.position,
    zIndex: computedStyles.zIndex,
    transform: computedStyles.transform,
    offsetParent: (element as HTMLElement).offsetParent?.tagName.toLowerCase()
  }
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validate that element is safe to analyze
 */
export function validateElement(element: Element): boolean {
  if (!element || !element.nodeType || element.nodeType !== Node.ELEMENT_NODE) {
    return false
  }

  // Check if element is still in the document
  if (!document.contains(element)) {
    return false
  }

  return true
}

/**
 * Create inspection error with context
 */
export function createInspectionError(
  message: string,
  code: InspectionErrorCode,
  element?: Element
): InspectionError {
  return new InspectionError(message, code, element)
}