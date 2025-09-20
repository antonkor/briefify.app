/**
 * Vibe Mode Integration Layer
 *
 * Main entry point for the Vibe Mode Quick Inspect system.
 * Provides factory functions, utilities, and simplified API for integration.
 */

// Core implementations
export { VibeInspectionManager } from './VibeInspectionManager'
export { ElementAnalyzer } from './ElementAnalyzer'
export { PerformanceMonitor, getGlobalPerformanceMonitor, resetGlobalPerformanceMonitor, measurePerformance, PerformanceUtils } from './PerformanceMonitor'

// React components
export { InspectionIcon, InspectionIconImpl } from '@/components/vibe-mode/InspectionIcon'
export { DevelopmentPopup, DevelopmentPopupImpl } from '@/components/vibe-mode/DevelopmentPopup'

// Type definitions and contracts
export type * from '@/specs/019-vibe-mode-quick/contracts/inspection-api'
export type * from '@/types/vibe-mode'

// Utilities
export * from '@/utils/elementAnalysis'

import { VibeInspectionManager } from './VibeInspectionManager'
import { ElementAnalyzer } from './ElementAnalyzer'
import { InspectionIconImpl } from '@/components/vibe-mode/InspectionIcon'
import { DevelopmentPopupImpl } from '@/components/vibe-mode/DevelopmentPopup'
import { getGlobalPerformanceMonitor } from './PerformanceMonitor'

import type {
  IVibeModeManager,
  VibeInspectionSettings
} from '@/specs/019-vibe-mode-quick/contracts/inspection-api'

import type {
  DEFAULT_INSPECTION_CONFIG
} from '@/types/vibe-mode'

/**
 * Factory function to create a fully configured Vibe Mode system
 */
export function createVibeMode(
  initialSettings?: Partial<VibeInspectionSettings>
): IVibeModeManager {
  // Create component instances
  const elementAnalyzer = new ElementAnalyzer()
  const inspectionIcon = new InspectionIconImpl()
  const developmentPopup = new DevelopmentPopupImpl()
  const performanceMonitor = getGlobalPerformanceMonitor()

  // Create and configure the main manager
  const manager = new VibeInspectionManager(
    elementAnalyzer,
    inspectionIcon,
    developmentPopup,
    performanceMonitor,
    initialSettings
  )

  // Configure component handlers
  inspectionIcon.setClickHandler((element: Element) => {
    manager.showInspection(element)
  })

  developmentPopup.setCloseHandler(() => {
    manager.hideInspection()
  })

  developmentPopup.setSettingsChangeHandler((settings) => {
    // Update manager settings based on popup settings
    manager.updateSettings({
      debugMode: settings.showPerformanceMetrics
    })
  })

  return manager
}

/**
 * Quick setup function for common use cases
 */
export function setupVibeMode(options?: {
  autoEnable?: boolean
  enableKeyboardShortcuts?: boolean
  debugMode?: boolean
}): IVibeModeManager {
  const {
    autoEnable = false,
    enableKeyboardShortcuts = true,
    debugMode = false
  } = options || {}

  const manager = createVibeMode({
    keyboardShortcuts: enableKeyboardShortcuts,
    debugMode,
    showOnHover: true,
    analysisLevel: 'detailed',
    autoPosition: true
  })

  if (autoEnable) {
    manager.enable()
  }

  return manager
}

/**
 * Hook-style API for React components
 * Note: Import React separately when using this function
 */
export function createUseVibeMode() {
  // This function returns a hook that can be used with React
  return function useVibeMode(
    enabled: boolean = false,
    settings?: Partial<VibeInspectionSettings>
  ) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const React = require('react')

    const [manager] = React.useState(() => createVibeMode(settings))

    React.useEffect(() => {
      if (enabled) {
        manager.enable()
      } else {
        manager.disable()
      }

      return () => {
        manager.destroy()
      }
    }, [enabled, manager])

    React.useEffect(() => {
      if (settings) {
        manager.updateSettings(settings)
      }
    }, [settings, manager])

    return {
      manager,
      enable: () => manager.enable(),
      disable: () => manager.disable(),
      toggle: () => manager.toggle(),
      state: manager.state
    }
  }
}

/**
 * Global Vibe Mode instance for simple usage
 */
let globalVibeMode: IVibeModeManager | null = null

/**
 * Get or create the global Vibe Mode instance
 */
export function getGlobalVibeMode(): IVibeModeManager {
  if (!globalVibeMode) {
    globalVibeMode = createVibeMode()
  }
  return globalVibeMode
}

/**
 * Enable Vibe Mode globally
 */
export function enableVibeMode(): void {
  const manager = getGlobalVibeMode()
  manager.enable()
}

/**
 * Disable Vibe Mode globally
 */
export function disableVibeMode(): void {
  if (globalVibeMode) {
    globalVibeMode.disable()
  }
}

/**
 * Toggle Vibe Mode globally
 */
export function toggleVibeMode(): void {
  const manager = getGlobalVibeMode()
  manager.toggle()
}

/**
 * Destroy the global Vibe Mode instance
 */
export function destroyGlobalVibeMode(): void {
  if (globalVibeMode) {
    globalVibeMode.destroy()
    globalVibeMode = null
  }
}

/**
 * Utility to add Vibe Mode to any element
 */
export function addVibeInspection(
  element: Element,
  options?: {
    showIcon?: boolean
    analysisLevel?: 'basic' | 'detailed' | 'comprehensive'
  }
): () => void {
  const { showIcon = true, analysisLevel = 'detailed' } = options || {}

  const manager = getGlobalVibeMode()
  if (!manager.state.isEnabled) {
    manager.enable()
  }

  let cleanup: (() => void) | null = null

  if (showIcon) {
    const handleMouseEnter = () => {
      manager.setHoverTarget(element)
    }

    const handleMouseLeave = () => {
      manager.setHoverTarget(null)
    }

    const handleClick = (e: MouseEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        e.stopPropagation()
        manager.showInspection(element)
      }
    }

    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)
    element.addEventListener('click', handleClick)

    cleanup = () => {
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
      element.removeEventListener('click', handleClick)
    }
  }

  // Return cleanup function
  return () => {
    cleanup?.()
  }
}

/**
 * Development utilities
 */
export const VibeDevUtils = {
  /**
   * Analyze any element on the page
   */
  async analyzeElement(
    element: Element,
    level: 'basic' | 'detailed' | 'comprehensive' = 'detailed'
  ) {
    const analyzer = new ElementAnalyzer()
    try {
      const metadata = await analyzer.analyzeElement(element, level)
      console.log('Element Analysis:', metadata)
      return metadata
    } finally {
      analyzer.destroy()
    }
  },

  /**
   * Get performance summary
   */
  getPerformanceSummary(): string {
    const monitor = getGlobalPerformanceMonitor()
    return monitor.getSummary()
  },

  /**
   * Test the inspection system
   */
  testInspection(): void {
    const testElement = document.createElement('div')
    testElement.className = 'vibe-test-element bg-blue-500 p-4 rounded'
    testElement.textContent = 'Test Element for Vibe Mode'
    testElement.id = 'vibe-test'

    document.body.appendChild(testElement)

    console.log('Test element added to page. Try inspecting it!')

    setTimeout(() => {
      if (document.body.contains(testElement)) {
        document.body.removeChild(testElement)
        console.log('Test element removed')
      }
    }, 10000) // Remove after 10 seconds
  },

  /**
   * Enable debug mode
   */
  enableDebug(): void {
    const manager = getGlobalVibeMode()
    manager.updateSettings({ debugMode: true })
    console.log('Vibe Mode debug enabled')
  },

  /**
   * Disable debug mode
   */
  disableDebug(): void {
    const manager = getGlobalVibeMode()
    manager.updateSettings({ debugMode: false })
    console.log('Vibe Mode debug disabled')
  },

  /**
   * Reset all performance counters
   */
  resetPerformance(): void {
    const monitor = getGlobalPerformanceMonitor()
    monitor.reset()
    console.log('Performance counters reset')
  }
}

/**
 * Browser extension utilities
 */
export const VibeBrowserUtils = {
  /**
   * Add global keyboard shortcuts
   */
  addGlobalShortcuts(): void {
    document.addEventListener('keydown', (e) => {
      // Ctrl+Shift+I or Cmd+Shift+I to toggle
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
        e.preventDefault()
        toggleVibeMode()
      }

      // Ctrl+Shift+D or Cmd+Shift+D for debug info
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        console.log(VibeDevUtils.getPerformanceSummary())
      }
    })
  },

  /**
   * Make Vibe Mode available globally on window
   */
  exposeGlobally(): void {
    ;(window as any).VibeMode = {
      enable: enableVibeMode,
      disable: disableVibeMode,
      toggle: toggleVibeMode,
      manager: getGlobalVibeMode,
      utils: VibeDevUtils
    }

    console.log('Vibe Mode exposed globally as window.VibeMode')
  },

  /**
   * Setup for development
   */
  setupDevelopment(): void {
    this.addGlobalShortcuts()
    this.exposeGlobally()
    VibeDevUtils.enableDebug()

    console.log(`
🔍 Vibe Mode Development Setup Complete!

Keyboard Shortcuts:
  Ctrl/Cmd + Shift + I: Toggle Vibe Mode
  Ctrl/Cmd + Shift + D: Show Performance Info

Global API:
  window.VibeMode.enable()
  window.VibeMode.disable()
  window.VibeMode.toggle()
  window.VibeMode.utils.testInspection()

Start inspecting by pressing Ctrl/Cmd + Shift + I and hovering over elements!
    `)
  }
}

/**
 * Default export for convenience
 */
export default {
  createVibeMode,
  setupVibeMode,
  createUseVibeMode,
  getGlobalVibeMode,
  enableVibeMode,
  disableVibeMode,
  toggleVibeMode,
  destroyGlobalVibeMode,
  addVibeInspection,
  utils: VibeDevUtils,
  browser: VibeBrowserUtils
}

// Auto-setup for development if in browser and not production
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Auto-expose for development convenience
  setTimeout(() => {
    VibeBrowserUtils.exposeGlobally()
  }, 100)
}