/**
 * Integration Test: User Story 1 - Quick Element Inspection
 *
 * "As a developer, I want to quickly inspect any DOM element by clicking on it,
 * so that I can understand its structure and styling without opening DevTools."
 *
 * These tests verify the complete user flow for quick element inspection.
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals'

// Integration test - these will initially fail until implementations exist
describe('User Story 1: Quick Element Inspection', () => {
  let testContainer: HTMLDivElement
  let targetElement: HTMLDivElement
  let childElement: HTMLSpanElement

  beforeEach(() => {
    // Create test environment
    testContainer = document.createElement('div')
    testContainer.id = 'integration-test-container'
    testContainer.style.cssText = 'position: relative; width: 800px; height: 600px; margin: 20px;'
    document.body.appendChild(testContainer)

    // Create target element for inspection
    targetElement = document.createElement('div')
    targetElement.id = 'target-element'
    targetElement.className = 'container mx-auto px-4 py-8 bg-blue-500 text-white rounded-lg shadow-md'
    targetElement.style.cssText = 'position: relative; width: 300px; height: 200px; top: 100px; left: 100px;'
    targetElement.innerHTML = '<span class="text-lg font-bold">Inspect Me</span>'

    childElement = targetElement.querySelector('span') as HTMLSpanElement
    testContainer.appendChild(targetElement)

    // Mock React fiber for testing React inspection
    const mockFiber = {
      memoizedProps: {
        title: 'Test Component',
        onClick: () => console.log('clicked'),
        className: 'container mx-auto px-4 py-8 bg-blue-500 text-white rounded-lg shadow-md'
      },
      memoizedState: { isActive: true, count: 5 },
      type: { name: 'TestComponent', displayName: 'TestComponent' }
    }
    ;(targetElement as any).__reactFiber$ = mockFiber
  })

  afterEach(() => {
    document.body.removeChild(testContainer)

    // Clean up any inspection UI elements
    const inspectionElements = document.querySelectorAll('[data-vibe-inspection-icon], [data-vibe-popup]')
    inspectionElements.forEach(el => el.remove())
  })

  describe('Vibe Mode Activation', () => {
    test('should enable vibe mode inspection when activated', async () => {
      // This test MUST FAIL initially - integration requirement

      // Simulate vibe mode activation (keyboard shortcut or workshop controls)
      const vibeModeEvent = new KeyboardEvent('keydown', {
        key: 'i',
        ctrlKey: true,
        shiftKey: true
      })
      document.dispatchEvent(vibeModeEvent)

      // Verify vibe mode is enabled
      await new Promise(resolve => setTimeout(resolve, 100))

      // Should show visual indicator that inspection mode is active
      const vibeModeIndicator = document.querySelector('[data-vibe-mode-active]')
      expect(vibeModeIndicator).toBeTruthy()

      // Should enable hover detection
      const mouseEnterEvent = new MouseEvent('mouseenter', {
        bubbles: true,
        clientX: 250, // Within target element bounds
        clientY: 200
      })
      targetElement.dispatchEvent(mouseEnterEvent)

      // Should show inspection icon
      await new Promise(resolve => setTimeout(resolve, 50))
      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]')
      expect(inspectionIcon).toBeTruthy()
    })

    test('should integrate with existing workshop controls', async () => {
      // This test MUST FAIL initially - integration requirement

      // Simulate existing vibe mode toggle from workshop
      const workshopToggle = document.createElement('button')
      workshopToggle.setAttribute('data-workshop-vibe-toggle', 'true')
      workshopToggle.click()

      await new Promise(resolve => setTimeout(resolve, 100))

      // Should activate inspection mode
      const isVibeMode = document.documentElement.hasAttribute('data-vibe-mode')
      expect(isVibeMode).toBe(true)

      // Should maintain existing vibe mode behavior while adding inspection
      const existingVibeElements = document.querySelectorAll('[data-component-label]')
      // Should not interfere with existing component labels
      expect(() => {
        existingVibeElements.forEach(el => el.getAttribute('data-component-label'))
      }).not.toThrow()
    })

    test('should handle rapid mode toggling gracefully', async () => {
      // This test MUST FAIL initially - integration requirement

      // Rapidly toggle vibe mode on/off multiple times
      for (let i = 0; i < 10; i++) {
        const toggleEvent = new KeyboardEvent('keydown', { key: 'i', ctrlKey: true, shiftKey: true })
        document.dispatchEvent(toggleEvent)
        await new Promise(resolve => setTimeout(resolve, 10))
      }

      // Should stabilize without errors
      expect(() => {
        const finalState = document.documentElement.hasAttribute('data-vibe-mode')
        expect(typeof finalState).toBe('boolean')
      }).not.toThrow()

      // Should clean up any orphaned UI elements
      const orphanedElements = document.querySelectorAll('[data-vibe-inspection-icon]')
      expect(orphanedElements.length).toBeLessThanOrEqual(1)
    })
  })

  describe('Element Hover Detection', () => {
    test('should detect mouse hover over target elements', async () => {
      // This test MUST FAIL initially - integration requirement

      // Enable vibe mode first
      document.documentElement.setAttribute('data-vibe-mode', 'true')

      // Simulate mouse enter
      const mouseEnterEvent = new MouseEvent('mouseenter', {
        bubbles: true,
        clientX: 250,
        clientY: 200
      })
      targetElement.dispatchEvent(mouseEnterEvent)

      await new Promise(resolve => setTimeout(resolve, 100))

      // Should show inspection icon positioned near element
      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      expect(inspectionIcon).toBeTruthy()
      expect(inspectionIcon.getAttribute('data-target-id')).toBe('target-element')

      const iconRect = inspectionIcon.getBoundingClientRect()
      const targetRect = targetElement.getBoundingClientRect()

      // Icon should be positioned near target element
      expect(iconRect.top).toBeGreaterThanOrEqual(targetRect.top - 50)
      expect(iconRect.top).toBeLessThanOrEqual(targetRect.bottom + 50)
      expect(iconRect.left).toBeGreaterThanOrEqual(targetRect.left - 50)
      expect(iconRect.left).toBeLessThanOrEqual(targetRect.right + 50)
    })

    test('should update hover target as mouse moves between elements', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      // Hover over first element
      targetElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 50))

      let inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      expect(inspectionIcon.getAttribute('data-target-id')).toBe('target-element')

      // Move to child element
      targetElement.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
      childElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 50))

      // Should update icon target
      inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      expect(inspectionIcon).toBeTruthy()

      // Should target the most specific element (child)
      const targetId = inspectionIcon.getAttribute('data-target-id')
      expect(targetId).not.toBe('target-element')
    })

    test('should handle nested element hovering correctly', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      // Create nested structure
      const nestedElement = document.createElement('div')
      nestedElement.className = 'nested-element p-2 m-1 bg-red-300'
      nestedElement.textContent = 'Nested'
      childElement.appendChild(nestedElement)

      // Hover over deeply nested element
      nestedElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 50))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      expect(inspectionIcon).toBeTruthy()

      // Should target the most specific (deepest) element
      const targetElement = document.querySelector(`[data-target-id="${inspectionIcon.getAttribute('data-target-id')}"]`)
      expect(targetElement).toBe(nestedElement)
    })

    test('should ignore non-inspectable elements', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      // Create non-inspectable elements
      const scriptElement = document.createElement('script')
      const styleElement = document.createElement('style')
      const commentNode = document.createComment('test comment')

      testContainer.appendChild(scriptElement)
      testContainer.appendChild(styleElement)
      testContainer.appendChild(commentNode)

      // Hover over non-inspectable elements
      scriptElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 50))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]')
      expect(inspectionIcon).toBeNull()

      // Should work normally when hovering inspectable elements
      targetElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 50))

      const validIcon = document.querySelector('[data-vibe-inspection-icon]')
      expect(validIcon).toBeTruthy()
    })

    test('should handle mouse leave events properly', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      // Hover over element
      targetElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(document.querySelector('[data-vibe-inspection-icon]')).toBeTruthy()

      // Leave element
      targetElement.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      // Icon should be removed after a brief delay
      const iconAfterLeave = document.querySelector('[data-vibe-inspection-icon]')
      expect(iconAfterLeave).toBeNull()
    })
  })

  describe('Click to Inspect', () => {
    test('should trigger inspection popup when clicking inspection icon', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      // Hover to show icon
      targetElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 50))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      expect(inspectionIcon).toBeTruthy()

      // Click the inspection icon
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 100))

      // Should show developer insights popup
      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      expect(popup).toBeTruthy()
      expect(popup.getAttribute('aria-label')).toContain('Developer insights')

      // Popup should be positioned appropriately
      const popupRect = popup.getBoundingClientRect()
      expect(popupRect.width).toBeGreaterThan(200)
      expect(popupRect.height).toBeGreaterThan(100)
      expect(popupRect.top).toBeGreaterThanOrEqual(0)
      expect(popupRect.left).toBeGreaterThanOrEqual(0)
    })

    test('should populate popup with element analysis data', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      // Trigger inspection
      targetElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 50))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 200)) // Allow time for analysis

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      expect(popup).toBeTruthy()

      // Should show element information
      const elementInfo = popup.querySelector('[data-section-id="element-info"]')
      expect(elementInfo).toBeTruthy()
      expect(elementInfo?.textContent).toContain('div#target-element')

      // Should show CSS class analysis
      const cssAnalysis = popup.querySelector('[data-section-id="css-analysis"]')
      expect(cssAnalysis).toBeTruthy()
      expect(cssAnalysis?.textContent).toContain('Tailwind')

      // Should show React component info (if applicable)
      const reactInfo = popup.querySelector('[data-section-id="react-info"]')
      if (reactInfo) {
        expect(reactInfo.textContent).toContain('TestComponent')
      }
    })

    test('should handle analysis performance within requirements', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      targetElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 50))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement

      const analysisStart = performance.now()
      inspectionIcon.click()

      // Wait for popup to appear
      await new Promise(resolve => {
        const checkForPopup = () => {
          if (document.querySelector('[data-vibe-popup]')) {
            resolve(undefined)
          } else {
            setTimeout(checkForPopup, 10)
          }
        }
        checkForPopup()
      })

      const analysisDuration = performance.now() - analysisStart
      expect(analysisDuration).toBeLessThan(200) // 200ms requirement from spec

      const popup = document.querySelector('[data-vibe-popup]')
      expect(popup).toBeTruthy()
    })

    test('should close previous popup when inspecting new element', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      // Inspect first element
      targetElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 50))

      let inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(document.querySelector('[data-vibe-popup]')).toBeTruthy()

      // Inspect second element
      childElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 50))

      inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 100))

      // Should only have one popup
      const popups = document.querySelectorAll('[data-vibe-popup]')
      expect(popups.length).toBe(1)

      // Popup should be for the new element
      const popup = popups[0] as HTMLElement
      expect(popup.getAttribute('data-target-element')).not.toBe('target-element')
    })

    test('should provide keyboard accessibility for inspection', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      // Show inspection icon
      targetElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 50))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      expect(inspectionIcon).toBeTruthy()

      // Should be focusable
      inspectionIcon.focus()
      expect(document.activeElement).toBe(inspectionIcon)

      // Should respond to Enter key
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' })
      inspectionIcon.dispatchEvent(enterEvent)
      await new Promise(resolve => setTimeout(resolve, 100))

      const popup = document.querySelector('[data-vibe-popup]')
      expect(popup).toBeTruthy()

      // Should respond to Space key
      inspectionIcon.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }))
      // Should not create duplicate popup
      const popups = document.querySelectorAll('[data-vibe-popup]')
      expect(popups.length).toBe(1)
    })
  })

  describe('User Experience Flow', () => {
    test('should provide smooth complete user journey', async () => {
      // This test MUST FAIL initially - integration requirement

      // Step 1: User activates vibe mode
      const activateEvent = new KeyboardEvent('keydown', { key: 'i', ctrlKey: true, shiftKey: true })
      document.dispatchEvent(activateEvent)
      await new Promise(resolve => setTimeout(resolve, 100))

      // Should show activation feedback
      expect(document.documentElement.hasAttribute('data-vibe-mode')).toBe(true)

      // Step 2: User hovers over element
      const hoverEvent = new MouseEvent('mouseenter', {
        bubbles: true,
        clientX: 250,
        clientY: 200
      })
      targetElement.dispatchEvent(hoverEvent)
      await new Promise(resolve => setTimeout(resolve, 100))

      // Should show inspection icon with smooth transition
      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      expect(inspectionIcon).toBeTruthy()

      const iconStyles = window.getComputedStyle(inspectionIcon)
      expect(iconStyles.opacity).toBe('1')
      expect(iconStyles.visibility).toBe('visible')

      // Step 3: User clicks to inspect
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 200))

      // Should show detailed popup with analysis
      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      expect(popup).toBeTruthy()

      // Should contain meaningful information
      expect(popup.textContent).toContain('div')
      expect(popup.textContent).toContain('target-element')
      expect(popup.textContent).toContain('Tailwind')

      // Step 4: User explores information
      const sections = popup.querySelectorAll('[data-section-type]')
      expect(sections.length).toBeGreaterThan(0)

      // Step 5: User closes popup (Escape key)
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' })
      document.dispatchEvent(escapeEvent)
      await new Promise(resolve => setTimeout(resolve, 100))

      // Should close popup cleanly
      const closedPopup = document.querySelector('[data-vibe-popup]')
      expect(closedPopup).toBeNull()

      // Should maintain vibe mode for continued use
      expect(document.documentElement.hasAttribute('data-vibe-mode')).toBe(true)
    })

    test('should handle edge cases gracefully', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      // Test rapid hover/unhover
      for (let i = 0; i < 10; i++) {
        targetElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
        await new Promise(resolve => setTimeout(resolve, 5))
        targetElement.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
        await new Promise(resolve => setTimeout(resolve, 5))
      }

      // Should not create multiple icons or cause errors
      const icons = document.querySelectorAll('[data-vibe-inspection-icon]')
      expect(icons.length).toBeLessThanOrEqual(1)

      // Test rapid clicks
      targetElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 50))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement

      for (let i = 0; i < 5; i++) {
        inspectionIcon.click()
        await new Promise(resolve => setTimeout(resolve, 10))
      }

      // Should only show one popup
      const popups = document.querySelectorAll('[data-vibe-popup]')
      expect(popups.length).toBe(1)
    })

    test('should integrate with existing page functionality', async () => {
      // This test MUST FAIL initially - integration requirement

      // Add existing page interactions
      targetElement.addEventListener('click', jest.fn())
      targetElement.addEventListener('mousedown', jest.fn())

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      // Inspection should not interfere with existing interactions
      targetElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 50))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement

      // Clicking inspection icon should not trigger element's click handlers
      const elementClickSpy = jest.fn()
      targetElement.addEventListener('click', elementClickSpy)

      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(elementClickSpy).not.toHaveBeenCalled()

      // Popup should not interfere with scrolling or other page interactions
      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      expect(popup).toBeTruthy()

      // Should allow normal page scrolling
      const scrollEvent = new Event('scroll')
      window.dispatchEvent(scrollEvent)

      // Popup should remain visible and positioned correctly
      expect(popup.style.position).toBe('fixed')
      expect(popup.style.zIndex).toBe('10000')
    })

    test('should provide performance feedback for slow operations', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      // Mock slow analysis
      const originalAnalyze = window.performance.now
      let callCount = 0
      window.performance.now = () => {
        callCount++
        // Simulate slow analysis on first few calls
        if (callCount < 5) {
          return originalAnalyze.call(performance) + 1000 // Add 1 second
        }
        return originalAnalyze.call(performance)
      }

      try {
        targetElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
        await new Promise(resolve => setTimeout(resolve, 50))

        const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
        inspectionIcon.click()
        await new Promise(resolve => setTimeout(resolve, 300))

        // Should show performance warning in popup or console
        const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
        if (popup) {
          const performanceWarning = popup.querySelector('[data-performance-warning]')
          expect(performanceWarning).toBeTruthy()
        }
      } finally {
        window.performance.now = originalAnalyze
      }
    })
  })
})