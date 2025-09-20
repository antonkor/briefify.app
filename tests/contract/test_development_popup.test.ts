/**
 * Contract Test: IDevelopmentPopup Interface
 *
 * These tests MUST FAIL initially (TDD approach) and define the contract
 * that any IDevelopmentPopup implementation must satisfy.
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals'
import type { IDevelopmentPopup } from '@/specs/019-vibe-mode-quick/contracts/inspection-api'
import type { InspectionPopupData, PopupPosition, InsightSection, ComingSoonFeature } from '@/types/vibe-mode'

// Mock implementation for testing (will be replaced with real implementation)
class MockDevelopmentPopup implements IDevelopmentPopup {
  show(data: InspectionPopupData): Promise<void> {
    throw new Error('Not implemented - this test should fail initially')
  }

  hide(): void {
    throw new Error('Not implemented - this test should fail initially')
  }

  updateContent(data: Partial<InspectionPopupData>): void {
    throw new Error('Not implemented - this test should fail initially')
  }

  updatePosition(position: PopupPosition): void {
    throw new Error('Not implemented - this test should fail initially')
  }

  isVisible(): boolean {
    throw new Error('Not implemented - this test should fail initially')
  }

  destroy(): void {
    throw new Error('Not implemented - this test should fail initially')
  }
}

describe('IDevelopmentPopup Contract', () => {
  let popup: IDevelopmentPopup
  let testElement: HTMLDivElement
  let mockPopupData: InspectionPopupData

  beforeEach(() => {
    popup = new MockDevelopmentPopup()

    // Create test element
    testElement = document.createElement('div')
    testElement.id = 'test-target'
    testElement.className = 'test-class bg-blue-500 p-4'
    testElement.textContent = 'Test target element'
    testElement.style.position = 'absolute'
    testElement.style.top = '100px'
    testElement.style.left = '100px'
    testElement.style.width = '200px'
    testElement.style.height = '100px'
    document.body.appendChild(testElement)

    // Mock popup data
    mockPopupData = {
      target: testElement,
      metadata: {
        element: {
          tagName: 'div',
          id: 'test-target',
          classes: ['test-class', 'bg-blue-500', 'p-4'],
          attributes: { id: 'test-target', class: 'test-class bg-blue-500 p-4' },
          textContent: 'Test target element'
        },
        styles: {
          display: 'block',
          position: 'absolute',
          zIndex: '1',
          backgroundColor: 'rgb(59, 130, 246)',
          color: 'rgb(0, 0, 0)',
          dimensions: testElement.getBoundingClientRect(),
          boxModel: {
            content: testElement.getBoundingClientRect(),
            padding: { top: '16px', right: '16px', bottom: '16px', left: '16px' },
            border: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
            margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
          }
        },
        cssFramework: {
          tailwindClasses: [
            {
              className: 'bg-blue-500',
              category: 'colors',
              property: 'bg',
              value: 'blue-500',
              cssProperty: 'background-color',
              cssValue: 'var(--blue-500)'
            },
            {
              className: 'p-4',
              category: 'spacing',
              property: 'p',
              value: '4',
              cssProperty: 'padding',
              cssValue: '1rem'
            }
          ],
          customClasses: ['test-class'],
          cssVariables: {}
        },
        layout: {
          positioning: {
            position: 'absolute',
            top: '100px',
            right: 'auto',
            bottom: 'auto',
            left: '100px',
            zIndex: '1'
          },
          parentChain: [],
          children: []
        },
        inspection: {
          timestamp: Date.now(),
          analysisLevel: 'basic',
          isVisible: true,
          isInteractive: false
        }
      },
      position: {
        x: 320,
        y: 120,
        placement: 'right',
        strategy: 'fixed'
      },
      content: {
        primary: [
          {
            id: 'element-info',
            title: 'Element Information',
            priority: 'high',
            type: 'info',
            content: {
              summary: 'div#test-target with Tailwind classes',
              details: ['Tag: div', 'ID: test-target', 'Classes: test-class, bg-blue-500, p-4']
            },
            category: 'component'
          }
        ],
        secondary: [
          {
            id: 'css-analysis',
            title: 'CSS Framework Analysis',
            priority: 'medium',
            type: 'info',
            content: {
              summary: 'Using Tailwind CSS classes',
              details: ['Background: blue-500', 'Padding: 1rem (p-4)']
            },
            category: 'styling'
          }
        ],
        comingSoon: [
          {
            id: 'performance-insights',
            title: 'Performance Insights',
            description: 'Real-time performance metrics and optimization suggestions',
            category: 'performance',
            priority: 'high'
          }
        ]
      },
      settings: {
        showAdvanced: false,
        includeReactInfo: true,
        includeCSSAnalysis: true,
        includePerformanceMetrics: false
      }
    }
  })

  afterEach(() => {
    document.body.removeChild(testElement)

    // Clean up any popup elements that might exist
    const popupElements = document.querySelectorAll('[data-vibe-popup]')
    popupElements.forEach(el => el.remove())
  })

  describe('show method', () => {
    test('should display popup with provided data', async () => {
      // This test MUST FAIL initially - TDD requirement
      await popup.show(mockPopupData)

      const popupElement = document.querySelector('[data-vibe-popup]')
      expect(popupElement).toBeTruthy()
      expect(popup.isVisible()).toBe(true)
    })

    test('should position popup according to position data', async () => {
      // This test MUST FAIL initially - TDD requirement
      await popup.show(mockPopupData)

      const popupElement = document.querySelector('[data-vibe-popup]') as HTMLElement
      expect(popupElement).toBeTruthy()

      const computedStyles = window.getComputedStyle(popupElement)
      expect(computedStyles.position).toBe('fixed')
      expect(popupElement.style.left).toBe('320px')
      expect(popupElement.style.top).toBe('120px')
    })

    test('should render primary content sections', async () => {
      // This test MUST FAIL initially - TDD requirement
      await popup.show(mockPopupData)

      const primarySections = document.querySelectorAll('[data-section-type="primary"]')
      expect(primarySections.length).toBeGreaterThan(0)

      const elementInfoSection = document.querySelector('[data-section-id="element-info"]')
      expect(elementInfoSection).toBeTruthy()
      expect(elementInfoSection?.textContent).toContain('Element Information')
      expect(elementInfoSection?.textContent).toContain('div#test-target')
    })

    test('should render secondary content sections', async () => {
      // This test MUST FAIL initially - TDD requirement
      await popup.show(mockPopupData)

      const secondarySections = document.querySelectorAll('[data-section-type="secondary"]')
      expect(secondarySections.length).toBeGreaterThan(0)

      const cssSection = document.querySelector('[data-section-id="css-analysis"]')
      expect(cssSection).toBeTruthy()
      expect(cssSection?.textContent).toContain('CSS Framework Analysis')
    })

    test('should render coming soon features', async () => {
      // This test MUST FAIL initially - TDD requirement
      await popup.show(mockPopupData)

      const comingSoonSection = document.querySelector('[data-section-type="coming-soon"]')
      expect(comingSoonSection).toBeTruthy()

      const performanceFeature = document.querySelector('[data-feature-id="performance-insights"]')
      expect(performanceFeature).toBeTruthy()
      expect(performanceFeature?.textContent).toContain('Performance Insights')
    })

    test('should apply correct styling and theme', async () => {
      // This test MUST FAIL initially - TDD requirement
      await popup.show(mockPopupData)

      const popupElement = document.querySelector('[data-vibe-popup]') as HTMLElement
      const computedStyles = window.getComputedStyle(popupElement)

      expect(computedStyles.zIndex).toBe('10000')
      expect(computedStyles.backgroundColor).toBeTruthy()
      expect(computedStyles.borderRadius).toBeTruthy()
      expect(computedStyles.boxShadow).toBeTruthy()
      expect(popupElement.style.maxWidth).toBe('400px')
      expect(popupElement.style.maxHeight).toBe('600px')
    })

    test('should handle viewport overflow gracefully', async () => {
      // This test MUST FAIL initially - TDD requirement
      // Position popup near viewport edge
      const edgeData = {
        ...mockPopupData,
        position: {
          x: window.innerWidth - 50,
          y: window.innerHeight - 50,
          placement: 'right' as const,
          strategy: 'fixed' as const
        }
      }

      await popup.show(edgeData)

      const popupElement = document.querySelector('[data-vibe-popup]') as HTMLElement
      const rect = popupElement.getBoundingClientRect()

      expect(rect.right).toBeLessThanOrEqual(window.innerWidth)
      expect(rect.bottom).toBeLessThanOrEqual(window.innerHeight)
    })

    test('should hide previous popup when showing new one', async () => {
      // This test MUST FAIL initially - TDD requirement
      await popup.show(mockPopupData)
      expect(popup.isVisible()).toBe(true)

      const secondData = { ...mockPopupData, position: { ...mockPopupData.position, x: 500 } }
      await popup.show(secondData)

      const popupElements = document.querySelectorAll('[data-vibe-popup]')
      expect(popupElements.length).toBe(1)
      expect(popup.isVisible()).toBe(true)
    })

    test('should complete within performance requirement', async () => {
      // This test MUST FAIL initially - TDD requirement
      const start = performance.now()

      await popup.show(mockPopupData)

      const duration = performance.now() - start
      expect(duration).toBeLessThan(200) // 200ms requirement from spec
    })

    test('should handle invalid data gracefully', async () => {
      // This test MUST FAIL initially - TDD requirement
      const invalidData = null as any

      await expect(popup.show(invalidData)).rejects.toThrow(/invalid|data/i)
    })

    test('should be accessible with proper ARIA attributes', async () => {
      // This test MUST FAIL initially - TDD requirement
      await popup.show(mockPopupData)

      const popupElement = document.querySelector('[data-vibe-popup]') as HTMLElement
      expect(popupElement.getAttribute('role')).toBe('dialog')
      expect(popupElement.getAttribute('aria-label')).toContain('Developer insights')
      expect(popupElement.getAttribute('aria-modal')).toBe('false') // Non-modal popup
    })
  })

  describe('hide method', () => {
    test('should remove popup from DOM', async () => {
      // This test MUST FAIL initially - TDD requirement
      await popup.show(mockPopupData)
      expect(popup.isVisible()).toBe(true)

      popup.hide()

      expect(document.querySelector('[data-vibe-popup]')).toBeNull()
      expect(popup.isVisible()).toBe(false)
    })

    test('should be safe to call when no popup is shown', () => {
      // This test MUST FAIL initially - TDD requirement
      expect(() => popup.hide()).not.toThrow()
      expect(popup.isVisible()).toBe(false)
    })

    test('should be safe to call multiple times', async () => {
      // This test MUST FAIL initially - TDD requirement
      await popup.show(mockPopupData)

      popup.hide()
      popup.hide()
      popup.hide()

      expect(document.querySelector('[data-vibe-popup]')).toBeNull()
      expect(popup.isVisible()).toBe(false)
    })

    test('should clean up event listeners', async () => {
      // This test MUST FAIL initially - TDD requirement
      await popup.show(mockPopupData)

      const popupElement = document.querySelector('[data-vibe-popup]') as HTMLElement
      const clickSpy = jest.fn()
      popupElement.addEventListener('click', clickSpy)

      popup.hide()

      // Popup should be removed, event should not fire
      const clickEvent = new MouseEvent('click')
      if (popupElement.parentNode) {
        popupElement.dispatchEvent(clickEvent)
        expect(clickSpy).not.toHaveBeenCalled()
      }
    })

    test('should animate hide transition', async () => {
      // This test MUST FAIL initially - TDD requirement
      await popup.show(mockPopupData)

      const start = performance.now()
      popup.hide()
      const duration = performance.now() - start

      // Hide animation should complete within reasonable time
      expect(duration).toBeLessThan(300)
    })
  })

  describe('updateContent method', () => {
    test('should update popup content without re-rendering entire popup', async () => {
      // This test MUST FAIL initially - TDD requirement
      await popup.show(mockPopupData)

      const updatedData = {
        content: {
          primary: [
            {
              id: 'updated-info',
              title: 'Updated Information',
              priority: 'high' as const,
              type: 'info' as const,
              content: {
                summary: 'Content has been updated'
              },
              category: 'component' as const
            }
          ]
        }
      }

      popup.updateContent(updatedData)

      const updatedSection = document.querySelector('[data-section-id="updated-info"]')
      expect(updatedSection).toBeTruthy()
      expect(updatedSection?.textContent).toContain('Updated Information')

      // Original popup should still be visible
      expect(popup.isVisible()).toBe(true)
    })

    test('should preserve existing content when partially updating', async () => {
      // This test MUST FAIL initially - TDD requirement
      await popup.show(mockPopupData)

      const partialUpdate = {
        settings: {
          showAdvanced: true
        }
      }

      popup.updateContent(partialUpdate)

      // Original content should still exist
      const originalSection = document.querySelector('[data-section-id="element-info"]')
      expect(originalSection).toBeTruthy()

      // Settings should be updated
      const popupElement = document.querySelector('[data-vibe-popup]') as HTMLElement
      expect(popupElement.getAttribute('data-show-advanced')).toBe('true')
    })

    test('should handle empty updates gracefully', async () => {
      // This test MUST FAIL initially - TDD requirement
      await popup.show(mockPopupData)

      expect(() => popup.updateContent({})).not.toThrow()
      expect(popup.isVisible()).toBe(true)
    })

    test('should throw error when no popup is shown', () => {
      // This test MUST FAIL initially - TDD requirement
      expect(() => popup.updateContent({})).toThrow(/no popup|not shown/i)
    })

    test('should update content efficiently', async () => {
      // This test MUST FAIL initially - TDD requirement
      await popup.show(mockPopupData)

      const start = performance.now()

      popup.updateContent({
        content: {
          primary: [mockPopupData.content.primary[0]]
        }
      })

      const duration = performance.now() - start
      expect(duration).toBeLessThan(50) // Fast content updates
    })
  })

  describe('updatePosition method', () => {
    test('should update popup position', async () => {
      // This test MUST FAIL initially - TDD requirement
      await popup.show(mockPopupData)

      const newPosition: PopupPosition = {
        x: 500,
        y: 300,
        placement: 'left',
        strategy: 'fixed'
      }

      popup.updatePosition(newPosition)

      const popupElement = document.querySelector('[data-vibe-popup]') as HTMLElement
      expect(popupElement.style.left).toBe('500px')
      expect(popupElement.style.top).toBe('300px')
    })

    test('should handle viewport overflow during position update', async () => {
      // This test MUST FAIL initially - TDD requirement
      await popup.show(mockPopupData)

      const offscreenPosition: PopupPosition = {
        x: window.innerWidth + 100,
        y: window.innerHeight + 100,
        placement: 'right',
        strategy: 'fixed'
      }

      popup.updatePosition(offscreenPosition)

      const popupElement = document.querySelector('[data-vibe-popup]') as HTMLElement
      const rect = popupElement.getBoundingClientRect()

      expect(rect.right).toBeLessThanOrEqual(window.innerWidth)
      expect(rect.bottom).toBeLessThanOrEqual(window.innerHeight)
    })

    test('should animate position changes', async () => {
      // This test MUST FAIL initially - TDD requirement
      await popup.show(mockPopupData)

      const newPosition: PopupPosition = {
        x: 600,
        y: 400,
        placement: 'bottom',
        strategy: 'fixed'
      }

      const start = performance.now()
      popup.updatePosition(newPosition)
      const duration = performance.now() - start

      expect(duration).toBeLessThan(100) // Smooth position updates
    })

    test('should throw error when no popup is shown', () => {
      // This test MUST FAIL initially - TDD requirement
      const position: PopupPosition = {
        x: 100,
        y: 100,
        placement: 'top',
        strategy: 'fixed'
      }

      expect(() => popup.updatePosition(position)).toThrow(/no popup|not shown/i)
    })

    test('should handle invalid position data', async () => {
      // This test MUST FAIL initially - TDD requirement
      await popup.show(mockPopupData)

      const invalidPosition = null as any

      expect(() => popup.updatePosition(invalidPosition)).toThrow(/invalid|position/i)
    })

    test('should update placement class on popup element', async () => {
      // This test MUST FAIL initially - TDD requirement
      await popup.show(mockPopupData)

      const newPosition: PopupPosition = {
        x: 100,
        y: 100,
        placement: 'top',
        strategy: 'fixed'
      }

      popup.updatePosition(newPosition)

      const popupElement = document.querySelector('[data-vibe-popup]') as HTMLElement
      expect(popupElement.getAttribute('data-placement')).toBe('top')
    })
  })

  describe('isVisible method', () => {
    test('should return false when no popup is shown', () => {
      // This test MUST FAIL initially - TDD requirement
      expect(popup.isVisible()).toBe(false)
    })

    test('should return true when popup is shown', async () => {
      // This test MUST FAIL initially - TDD requirement
      await popup.show(mockPopupData)

      expect(popup.isVisible()).toBe(true)
    })

    test('should return false after popup is hidden', async () => {
      // This test MUST FAIL initially - TDD requirement
      await popup.show(mockPopupData)
      popup.hide()

      expect(popup.isVisible()).toBe(false)
    })

    test('should detect when popup is removed from DOM externally', async () => {
      // This test MUST FAIL initially - TDD requirement
      await popup.show(mockPopupData)
      expect(popup.isVisible()).toBe(true)

      // Externally remove popup
      const popupElement = document.querySelector('[data-vibe-popup]')
      popupElement?.remove()

      expect(popup.isVisible()).toBe(false)
    })
  })

  describe('destroy method', () => {
    test('should remove popup and clean up all resources', async () => {
      // This test MUST FAIL initially - TDD requirement
      await popup.show(mockPopupData)

      popup.destroy()

      expect(document.querySelector('[data-vibe-popup]')).toBeNull()
      expect(popup.isVisible()).toBe(false)
    })

    test('should be safe to call multiple times', async () => {
      // This test MUST FAIL initially - TDD requirement
      await popup.show(mockPopupData)

      expect(() => {
        popup.destroy()
        popup.destroy()
        popup.destroy()
      }).not.toThrow()
    })

    test('should be safe to call when no popup exists', () => {
      // This test MUST FAIL initially - TDD requirement
      expect(() => popup.destroy()).not.toThrow()
    })

    test('should prevent future operations after destroy', async () => {
      // This test MUST FAIL initially - TDD requirement
      await popup.show(mockPopupData)
      popup.destroy()

      // Operations after destroy should fail gracefully
      expect(() => popup.show(mockPopupData)).toThrow(/destroyed|disposed/i)
      expect(() => popup.hide()).toThrow(/destroyed|disposed/i)
      expect(() => popup.updateContent({})).toThrow(/destroyed|disposed/i)
      expect(() => popup.updatePosition(mockPopupData.position)).toThrow(/destroyed|disposed/i)
    })

    test('should remove all event listeners and observers', async () => {
      // This test MUST FAIL initially - TDD requirement
      await popup.show(mockPopupData)

      const popupElement = document.querySelector('[data-vibe-popup]')
      const clickSpy = jest.fn()

      if (popupElement) {
        popupElement.addEventListener('click', clickSpy)
      }

      popup.destroy()

      // Events should not fire after destroy
      if (popupElement && popupElement.parentNode) {
        const clickEvent = new MouseEvent('click')
        popupElement.dispatchEvent(clickEvent)
        expect(clickSpy).not.toHaveBeenCalled()
      }
    })
  })

  describe('Performance Requirements', () => {
    test('should render popup within 200ms', async () => {
      // This test MUST FAIL initially - TDD requirement
      const start = performance.now()

      await popup.show(mockPopupData)

      const duration = performance.now() - start
      expect(duration).toBeLessThan(200)
    })

    test('should handle large content efficiently', async () => {
      // This test MUST FAIL initially - TDD requirement
      const largeData = {
        ...mockPopupData,
        content: {
          primary: Array.from({ length: 20 }, (_, i) => ({
            id: `section-${i}`,
            title: `Section ${i}`,
            priority: 'medium' as const,
            type: 'info' as const,
            content: {
              summary: `Summary for section ${i}`,
              details: Array.from({ length: 10 }, (_, j) => `Detail ${j} for section ${i}`)
            },
            category: 'component' as const
          })),
          secondary: [],
          comingSoon: []
        }
      }

      const start = performance.now()
      await popup.show(largeData)
      const duration = performance.now() - start

      expect(duration).toBeLessThan(500) // Should handle large content efficiently
    })

    test('should update content within 50ms', async () => {
      // This test MUST FAIL initially - TDD requirement
      await popup.show(mockPopupData)

      const start = performance.now()

      popup.updateContent({
        content: {
          primary: [mockPopupData.content.primary[0]]
        }
      })

      const duration = performance.now() - start
      expect(duration).toBeLessThan(50)
    })

    test('should update position within 16ms for smooth animations', async () => {
      // This test MUST FAIL initially - TDD requirement
      await popup.show(mockPopupData)

      const start = performance.now()

      popup.updatePosition({
        x: 400,
        y: 200,
        placement: 'left',
        strategy: 'fixed'
      })

      const duration = performance.now() - start
      expect(duration).toBeLessThan(16) // 60fps requirement
    })
  })

  describe('Error Handling', () => {
    test('should provide meaningful error messages', async () => {
      // This test MUST FAIL initially - TDD requirement
      try {
        await popup.show(null as any)
        fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toMatch(/invalid|data|null/i)
      }
    })

    test('should handle corrupted popup data gracefully', async () => {
      // This test MUST FAIL initially - TDD requirement
      const corruptedData = {
        ...mockPopupData,
        metadata: null as any
      }

      await expect(popup.show(corruptedData)).rejects.toThrow(/invalid|corrupted|metadata/i)
    })

    test('should handle DOM manipulation errors gracefully', async () => {
      // This test MUST FAIL initially - TDD requirement
      // Mock DOM error
      const originalQuerySelector = document.querySelector
      document.querySelector = () => { throw new Error('DOM error') }

      try {
        await expect(popup.show(mockPopupData)).rejects.toThrow()
      } finally {
        document.querySelector = originalQuerySelector
      }
    })

    test('should recover from CSS loading failures', async () => {
      // This test MUST FAIL initially - TDD requirement
      // Simulate CSS not loaded
      const style = document.createElement('style')
      style.textContent = `
        [data-vibe-popup] {
          display: none !important;
        }
      `
      document.head.appendChild(style)

      try {
        await popup.show(mockPopupData)

        // Popup should still function despite CSS issues
        expect(popup.isVisible()).toBe(true)
      } finally {
        document.head.removeChild(style)
      }
    })
  })

  describe('Accessibility Requirements', () => {
    test('should be keyboard navigable', async () => {
      // This test MUST FAIL initially - TDD requirement
      await popup.show(mockPopupData)

      const popupElement = document.querySelector('[data-vibe-popup]') as HTMLElement
      const focusableElements = popupElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )

      expect(focusableElements.length).toBeGreaterThan(0)

      // First focusable element should be reachable
      const firstFocusable = focusableElements[0] as HTMLElement
      firstFocusable.focus()
      expect(document.activeElement).toBe(firstFocusable)
    })

    test('should handle Escape key to close popup', async () => {
      // This test MUST FAIL initially - TDD requirement
      await popup.show(mockPopupData)

      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' })
      document.dispatchEvent(escapeEvent)

      expect(popup.isVisible()).toBe(false)
    })

    test('should have proper color contrast', async () => {
      // This test MUST FAIL initially - TDD requirement
      await popup.show(mockPopupData)

      const popupElement = document.querySelector('[data-vibe-popup]') as HTMLElement
      const computedStyles = window.getComputedStyle(popupElement)

      // Should have sufficient contrast (simplified check)
      expect(computedStyles.color).not.toBe(computedStyles.backgroundColor)
    })

    test('should work with screen readers', async () => {
      // This test MUST FAIL initially - TDD requirement
      await popup.show(mockPopupData)

      const popupElement = document.querySelector('[data-vibe-popup]') as HTMLElement

      expect(popupElement.getAttribute('aria-live')).toBeTruthy()
      expect(popupElement.getAttribute('aria-describedby')).toBeTruthy()

      // Content should be properly labeled
      const sections = popupElement.querySelectorAll('[data-section-type]')
      sections.forEach(section => {
        expect(section.getAttribute('aria-labelledby')).toBeTruthy()
      })
    })

    test('should respect reduced motion preferences', async () => {
      // This test MUST FAIL initially - TDD requirement
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        value: jest.fn(() => ({
          matches: true, // prefers-reduced-motion: reduce
          media: '(prefers-reduced-motion: reduce)',
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
        })),
      })

      await popup.show(mockPopupData)

      const popupElement = document.querySelector('[data-vibe-popup]') as HTMLElement
      const computedStyles = window.getComputedStyle(popupElement)

      // Should disable animations when reduced motion is preferred
      expect(computedStyles.transition).toBe('none')
    })
  })
})