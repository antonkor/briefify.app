/**
 * Error Handling and Edge Cases Test Suite
 *
 * Comprehensive tests for error scenarios, edge cases, and system boundaries
 * that all implementations must handle gracefully.
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals'

describe('Error Handling and Edge Cases', () => {
  let testContainer: HTMLDivElement

  beforeEach(() => {
    testContainer = document.createElement('div')
    testContainer.id = 'error-test-container'
    document.body.appendChild(testContainer)

    // Reset any global state
    document.documentElement.removeAttribute('data-vibe-mode')
  })

  afterEach(() => {
    document.body.removeChild(testContainer)

    // Clean up any orphaned elements
    const orphanedElements = document.querySelectorAll('[data-vibe-inspection-icon], [data-vibe-popup]')
    orphanedElements.forEach(el => el.remove())
  })

  describe('DOM Manipulation Edge Cases', () => {
    test('should handle elements removed during analysis', async () => {
      // This test MUST FAIL initially - error handling requirement

      const element = document.createElement('div')
      element.className = 'test-element'
      testContainer.appendChild(element)

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      // Start hover
      element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 50))

      // Remove element while inspection might be in progress
      testContainer.removeChild(element)

      // Should not crash or throw unhandled errors
      expect(() => {
        element.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
      }).not.toThrow()

      // Should clean up any associated UI
      await new Promise(resolve => setTimeout(resolve, 100))
      const orphanedIcons = document.querySelectorAll('[data-vibe-inspection-icon]')
      expect(orphanedIcons.length).toBe(0)
    })

    test('should handle elements moved between parents', async () => {
      // This test MUST FAIL initially - error handling requirement

      const element = document.createElement('div')
      element.className = 'moveable-element'
      testContainer.appendChild(element)

      const newParent = document.createElement('div')
      newParent.id = 'new-parent'
      testContainer.appendChild(newParent)

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 50))

      // Move element to new parent
      newParent.appendChild(element)

      // Should update analysis to reflect new hierarchy
      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      if (inspectionIcon) {
        inspectionIcon.click()
        await new Promise(resolve => setTimeout(resolve, 200))

        const popup = document.querySelector('[data-vibe-popup]')
        if (popup) {
          const hierarchySection = popup.querySelector('[data-section-id="hierarchy"]')
          expect(hierarchySection?.textContent).toContain('new-parent')
        }
      }
    })

    test('should handle circular DOM references', () => {
      // This test MUST FAIL initially - error handling requirement

      const element = document.createElement('div')
      element.className = 'circular-test'

      // Create circular reference
      ;(element as any).circularRef = element
      testContainer.appendChild(element)

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      // Should not cause infinite loops or stack overflow
      expect(() => {
        element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      }).not.toThrow()
    })

    test('should handle malformed HTML structures', async () => {
      // This test MUST FAIL initially - error handling requirement

      const malformedHTML = `
        <div class="malformed">
          <p>Unclosed paragraph
          <span>Nested span</div>
        </div>
      `

      testContainer.innerHTML = malformedHTML
      const malformedElement = testContainer.querySelector('.malformed') as HTMLElement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      // Should handle gracefully without crashing
      expect(() => {
        malformedElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      }).not.toThrow()
    })
  })

  describe('Performance Boundary Conditions', () => {
    test('should handle extremely deep DOM nesting', async () => {
      // This test MUST FAIL initially - error handling requirement

      let currentElement = testContainer

      // Create 100-level deep nesting
      for (let i = 0; i < 100; i++) {
        const child = document.createElement('div')
        child.className = `level-${i}`
        currentElement.appendChild(child)
        currentElement = child
      }

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      const start = performance.now()
      currentElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 300))
      const duration = performance.now() - start

      // Should complete within reasonable time despite depth
      expect(duration).toBeLessThan(1000)

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]')
      expect(inspectionIcon).toBeTruthy()
    })

    test('should handle elements with massive class lists', async () => {
      // This test MUST FAIL initially - error handling requirement

      const element = document.createElement('div')

      // Create element with 1000+ classes
      const classes = Array.from({ length: 1000 }, (_, i) => `class-${i}`)
      element.className = classes.join(' ')
      testContainer.appendChild(element)

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      const start = performance.now()
      element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 300))
      const duration = performance.now() - start

      // Should handle large class lists efficiently
      expect(duration).toBeLessThan(500)

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]')
      expect(inspectionIcon).toBeTruthy()
    })

    test('should handle rapid DOM mutations', async () => {
      // This test MUST FAIL initially - error handling requirement

      const element = document.createElement('div')
      element.className = 'mutation-test'
      testContainer.appendChild(element)

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 50))

      // Rapidly mutate element
      for (let i = 0; i < 100; i++) {
        element.className = `mutation-test-${i}`
        element.style.left = `${i}px`

        if (i % 10 === 0) {
          await new Promise(resolve => setTimeout(resolve, 1))
        }
      }

      // Should maintain stability despite mutations
      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]')
      expect(inspectionIcon).toBeTruthy()

      // Should not create duplicate icons
      const allIcons = document.querySelectorAll('[data-vibe-inspection-icon]')
      expect(allIcons.length).toBeLessThanOrEqual(1)
    })

    test('should handle memory pressure scenarios', async () => {
      // This test MUST FAIL initially - error handling requirement

      const elements = []

      // Create many elements to simulate memory pressure
      for (let i = 0; i < 1000; i++) {
        const element = document.createElement('div')
        element.className = `pressure-test-${i}`
        element.innerHTML = `<span>Content ${i}</span>`.repeat(10)
        testContainer.appendChild(element)
        elements.push(element)
      }

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      // Hover over multiple elements rapidly
      for (let i = 0; i < 100; i++) {
        const element = elements[i * 10]
        element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
        await new Promise(resolve => setTimeout(resolve, 10))
        element.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
      }

      // Should maintain functionality under pressure
      const lastElement = elements[elements.length - 1]
      lastElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]')
      expect(inspectionIcon).toBeTruthy()
    })
  })

  describe('Browser API Limitations', () => {
    test('should handle missing browser APIs gracefully', () => {
      // This test MUST FAIL initially - error handling requirement

      // Mock missing ResizeObserver
      const originalResizeObserver = (globalThis as any).ResizeObserver
      delete (globalThis as any).ResizeObserver

      try {
        const element = document.createElement('div')
        testContainer.appendChild(element)

        document.documentElement.setAttribute('data-vibe-mode', 'true')

        // Should fallback gracefully
        expect(() => {
          element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
        }).not.toThrow()

      } finally {
        if (originalResizeObserver) {
          (globalThis as any).ResizeObserver = originalResizeObserver
        }
      }
    })

    test('should handle CSS.supports unavailability', () => {
      // This test MUST FAIL initially - error handling requirement

      const originalSupports = CSS.supports
      delete (CSS as any).supports

      try {
        const element = document.createElement('div')
        element.className = 'css-test bg-blue-500'
        testContainer.appendChild(element)

        document.documentElement.setAttribute('data-vibe-mode', 'true')

        // Should still analyze CSS without supports API
        expect(() => {
          element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
        }).not.toThrow()

      } finally {
        (CSS as any).supports = originalSupports
      }
    })

    test('should handle getComputedStyle failures', () => {
      // This test MUST FAIL initially - error handling requirement

      const originalGetComputedStyle = window.getComputedStyle
      window.getComputedStyle = () => {
        throw new Error('getComputedStyle failed')
      }

      try {
        const element = document.createElement('div')
        testContainer.appendChild(element)

        document.documentElement.setAttribute('data-vibe-mode', 'true')

        // Should handle style analysis failure gracefully
        expect(() => {
          element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
        }).not.toThrow()

      } finally {
        window.getComputedStyle = originalGetComputedStyle
      }
    })

    test('should handle clipboard API unavailability', async () => {
      // This test MUST FAIL initially - error handling requirement

      const originalClipboard = navigator.clipboard
      delete (navigator as any).clipboard

      try {
        const element = document.createElement('div')
        element.className = 'clipboard-test'
        testContainer.appendChild(element)

        document.documentElement.setAttribute('data-vibe-mode', 'true')

        element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
        await new Promise(resolve => setTimeout(resolve, 100))

        const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
        if (inspectionIcon) {
          inspectionIcon.click()
          await new Promise(resolve => setTimeout(resolve, 200))

          const popup = document.querySelector('[data-vibe-popup]')
          expect(popup).toBeTruthy()

          // Copy buttons should either be hidden or use fallback
          const copyButtons = popup?.querySelectorAll('[data-copy-button]')
          copyButtons?.forEach(button => {
            expect(() => (button as HTMLElement).click()).not.toThrow()
          })
        }

      } finally {
        if (originalClipboard) {
          (navigator as any).clipboard = originalClipboard
        }
      }
    })
  })

  describe('React Fiber Edge Cases', () => {
    test('should handle corrupted React fiber data', () => {
      // This test MUST FAIL initially - error handling requirement

      const element = document.createElement('div')
      element.className = 'corrupted-fiber'

      // Attach corrupted fiber
      ;(element as any).__reactFiber$ = {
        corrupted: true,
        memoizedProps: null,
        type: undefined,
        return: { corrupted: true }
      }

      testContainer.appendChild(element)
      document.documentElement.setAttribute('data-vibe-mode', 'true')

      // Should handle corrupted fiber gracefully
      expect(() => {
        element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      }).not.toThrow()
    })

    test('should handle circular React fiber references', () => {
      // This test MUST FAIL initially - error handling requirement

      const element = document.createElement('div')

      const circularFiber: any = {
        type: { name: 'CircularComponent' },
        memoizedProps: { test: 'prop' }
      }
      circularFiber.return = circularFiber
      circularFiber.child = circularFiber

      ;(element as any).__reactFiber$ = circularFiber
      testContainer.appendChild(element)

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      // Should handle circular references without infinite loops
      expect(() => {
        element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      }).not.toThrow()
    })

    test('should handle React development vs production builds', () => {
      // This test MUST FAIL initially - error handling requirement

      const element = document.createElement('div')

      // Mock production React fiber (minified names)
      ;(element as any).__reactFiber$ = {
        type: function t() {}, // Minified function name
        memoizedProps: { className: 'test' },
        _debugSource: undefined // Production build
      }

      testContainer.appendChild(element)
      document.documentElement.setAttribute('data-vibe-mode', 'true')

      // Should handle production builds gracefully
      expect(() => {
        element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      }).not.toThrow()
    })

    test('should handle React version compatibility', () => {
      // This test MUST FAIL initially - error handling requirement

      const element = document.createElement('div')

      // Mock React 15 style fiber
      ;(element as any).__reactInternalInstance = {
        _currentElement: {
          type: 'div',
          props: { className: 'react-15-style' }
        }
      }

      testContainer.appendChild(element)
      document.documentElement.setAttribute('data-vibe-mode', 'true')

      // Should handle different React versions
      expect(() => {
        element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      }).not.toThrow()
    })
  })

  describe('CSS Framework Edge Cases', () => {
    test('should handle invalid CSS class names', () => {
      // This test MUST FAIL initially - error handling requirement

      const element = document.createElement('div')
      element.className = '123invalid-class @#$%invalid --css-var-as-class'
      testContainer.appendChild(element)

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      // Should handle invalid classes without crashing
      expect(() => {
        element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      }).not.toThrow()
    })

    test('should handle extremely long CSS values', () => {
      // This test MUST FAIL initially - error handling requirement

      const element = document.createElement('div')
      const longValue = 'A'.repeat(10000)
      element.style.cssText = `--long-var: ${longValue}; content: "${longValue}";`
      testContainer.appendChild(element)

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      const start = performance.now()
      element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))

      // Should handle without performance degradation
      const duration = performance.now() - start
      expect(duration).toBeLessThan(100)
    })

    test('should handle CSS parsing errors', () => {
      // This test MUST FAIL initially - error handling requirement

      const element = document.createElement('div')

      // Add invalid CSS
      const style = document.createElement('style')
      style.textContent = `
        .invalid-css {
          color: rgb(999, 999, 999);
          background: invalid-function();
          transform: matrix(invalid);
        }
      `
      document.head.appendChild(style)
      element.className = 'invalid-css'
      testContainer.appendChild(element)

      try {
        document.documentElement.setAttribute('data-vibe-mode', 'true')

        // Should handle CSS parsing errors gracefully
        expect(() => {
          element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
        }).not.toThrow()

      } finally {
        document.head.removeChild(style)
      }
    })

    test('should handle conflicting CSS frameworks', () => {
      // This test MUST FAIL initially - error handling requirement

      const element = document.createElement('div')
      element.className = 'btn btn-primary px-4 py-2 button is-primary' // Bootstrap + Tailwind + Bulma
      testContainer.appendChild(element)

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))

      // Should detect and handle multiple frameworks
      expect(() => {
        const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
        if (inspectionIcon) {
          inspectionIcon.click()
        }
      }).not.toThrow()
    })
  })

  describe('Security and Sanitization', () => {
    test('should sanitize potentially dangerous content', () => {
      // This test MUST FAIL initially - error handling requirement

      const element = document.createElement('div')
      element.innerHTML = '<script>alert("XSS")</script><img src="x" onerror="alert(1)">'
      element.setAttribute('onmouseover', 'alert("attribute XSS")')
      testContainer.appendChild(element)

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      // Should not execute any scripts or unsafe content
      expect(() => {
        element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      }).not.toThrow()

      // Should not expose raw HTML in analysis
      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      if (inspectionIcon) {
        inspectionIcon.click()

        const popup = document.querySelector('[data-vibe-popup]')
        expect(popup?.innerHTML).not.toContain('<script>')
        expect(popup?.innerHTML).not.toContain('onerror=')
      }
    })

    test('should handle CSP restrictions', () => {
      // This test MUST FAIL initially - error handling requirement

      // Mock CSP violation
      const originalCreateElement = document.createElement
      document.createElement = (tagName: string) => {
        const element = originalCreateElement.call(document, tagName)
        if (tagName.toLowerCase() === 'style') {
          throw new Error('CSP violation: inline styles not allowed')
        }
        return element
      }

      try {
        const element = document.createElement('div')
        element.className = 'csp-test'
        testContainer.appendChild(element)

        document.documentElement.setAttribute('data-vibe-mode', 'true')

        // Should handle CSP restrictions gracefully
        expect(() => {
          element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
        }).not.toThrow()

      } finally {
        document.createElement = originalCreateElement
      }
    })
  })

  describe('Accessibility Edge Cases', () => {
    test('should handle screen reader compatibility', () => {
      // This test MUST FAIL initially - error handling requirement

      // Mock screen reader environment
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 NVDA/2021.1',
        configurable: true
      })

      const element = document.createElement('div')
      element.className = 'sr-test'
      testContainer.appendChild(element)

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))

      // Should provide appropriate ARIA attributes
      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      if (inspectionIcon) {
        expect(inspectionIcon.getAttribute('aria-label')).toBeTruthy()
        expect(inspectionIcon.getAttribute('role')).toBe('button')

        // Should have live region announcements
        const liveRegion = document.querySelector('[aria-live]')
        expect(liveRegion).toBeTruthy()
      }
    })

    test('should handle high contrast mode', () => {
      // This test MUST FAIL initially - error handling requirement

      // Mock high contrast media query
      Object.defineProperty(window, 'matchMedia', {
        value: jest.fn(() => ({
          matches: true,
          media: '(prefers-contrast: high)',
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
        })),
      })

      const element = document.createElement('div')
      element.className = 'contrast-test'
      testContainer.appendChild(element)

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      if (inspectionIcon) {
        const styles = window.getComputedStyle(inspectionIcon)

        // Should adapt for high contrast
        expect(styles.border).toBeTruthy()
        expect(styles.outline).toBeTruthy()
      }
    })

    test('should handle focus trap edge cases', async () => {
      // This test MUST FAIL initially - error handling requirement

      const element = document.createElement('div')
      testContainer.appendChild(element)

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      if (inspectionIcon) {
        inspectionIcon.click()
        await new Promise(resolve => setTimeout(resolve, 200))

        const popup = document.querySelector('[data-vibe-popup]') as HTMLElement

        // Remove all focusable elements to test edge case
        const focusable = popup.querySelectorAll('button, input, [tabindex]')
        focusable.forEach(el => el.remove())

        // Should handle missing focusable elements gracefully
        expect(() => {
          const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' })
          popup.dispatchEvent(tabEvent)
        }).not.toThrow()
      }
    })
  })

  describe('Concurrent Operation Handling', () => {
    test('should handle rapid mode toggling', async () => {
      // This test MUST FAIL initially - error handling requirement

      const element = document.createElement('div')
      testContainer.appendChild(element)

      // Rapidly toggle vibe mode
      for (let i = 0; i < 20; i++) {
        document.documentElement.setAttribute('data-vibe-mode', i % 2 === 0 ? 'true' : 'false')
        element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
        await new Promise(resolve => setTimeout(resolve, 10))
      }

      // Should stabilize without errors
      expect(() => {
        const icons = document.querySelectorAll('[data-vibe-inspection-icon]')
        expect(icons.length).toBeLessThanOrEqual(1)
      }).not.toThrow()
    })

    test('should handle concurrent analysis requests', async () => {
      // This test MUST FAIL initially - error handling requirement

      const elements = Array.from({ length: 10 }, (_, i) => {
        const el = document.createElement('div')
        el.className = `concurrent-${i}`
        testContainer.appendChild(el)
        return el
      })

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      // Trigger concurrent analyses
      const promises = elements.map(async (el, i) => {
        el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
        await new Promise(resolve => setTimeout(resolve, i * 10))

        const icon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
        if (icon) {
          icon.click()
        }
      })

      // Should handle concurrency gracefully
      await expect(Promise.all(promises)).resolves.toBeDefined()

      // Should not create excessive UI elements
      const popups = document.querySelectorAll('[data-vibe-popup]')
      expect(popups.length).toBeLessThanOrEqual(1)
    })
  })
})