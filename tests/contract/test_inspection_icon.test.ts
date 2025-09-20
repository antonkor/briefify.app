/**
 * Contract Test: IInspectionIcon Interface
 *
 * These tests MUST FAIL initially (TDD approach) and define the contract
 * that any IInspectionIcon implementation must satisfy.
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals'
import type { IInspectionIcon } from '@/specs/019-vibe-mode-quick/contracts/inspection-api'

// Mock implementation for testing (will be replaced with real implementation)
class MockInspectionIcon implements IInspectionIcon {
  show(element: Element): void {
    throw new Error('Not implemented - this test should fail initially')
  }

  hide(): void {
    throw new Error('Not implemented - this test should fail initially')
  }

  updatePosition(element: Element): void {
    throw new Error('Not implemented - this test should fail initially')
  }

  setClickHandler(handler: (element: Element) => void): void {
    throw new Error('Not implemented - this test should fail initially')
  }

  destroy(): void {
    throw new Error('Not implemented - this test should fail initially')
  }
}

describe('IInspectionIcon Contract', () => {
  let icon: IInspectionIcon
  let testElement: HTMLDivElement
  let secondElement: HTMLSpanElement

  beforeEach(() => {
    icon = new MockInspectionIcon()

    // Create test elements
    testElement = document.createElement('div')
    testElement.id = 'test-element'
    testElement.className = 'test-class'
    testElement.style.position = 'absolute'
    testElement.style.top = '100px'
    testElement.style.left = '100px'
    testElement.style.width = '200px'
    testElement.style.height = '100px'
    testElement.textContent = 'Test content'
    document.body.appendChild(testElement)

    secondElement = document.createElement('span')
    secondElement.id = 'second-element'
    secondElement.className = 'second-class'
    secondElement.style.position = 'absolute'
    secondElement.style.top = '300px'
    secondElement.style.left = '300px'
    secondElement.style.width = '150px'
    secondElement.style.height = '50px'
    secondElement.textContent = 'Second element'
    document.body.appendChild(secondElement)
  })

  afterEach(() => {
    document.body.removeChild(testElement)
    document.body.removeChild(secondElement)
  })

  describe('show method', () => {
    test('should display inspection icon for target element', () => {
      // This test MUST FAIL initially - TDD requirement
      icon.show(testElement)

      // Verify icon is visible in DOM
      const iconElement = document.querySelector('[data-vibe-inspection-icon]')
      expect(iconElement).toBeTruthy()
      expect(iconElement?.getAttribute('data-target-id')).toBe('test-element')
    })

    test('should position icon relative to target element', () => {
      // This test MUST FAIL initially - TDD requirement
      icon.show(testElement)

      const iconElement = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      expect(iconElement).toBeTruthy()

      const iconRect = iconElement.getBoundingClientRect()
      const targetRect = testElement.getBoundingClientRect()

      // Icon should be positioned near the target element
      expect(iconRect.top).toBeGreaterThanOrEqual(targetRect.top - 30)
      expect(iconRect.top).toBeLessThanOrEqual(targetRect.bottom + 30)
      expect(iconRect.left).toBeGreaterThanOrEqual(targetRect.left - 30)
      expect(iconRect.left).toBeLessThanOrEqual(targetRect.right + 30)
    })

    test('should have proper visual styling', () => {
      // This test MUST FAIL initially - TDD requirement
      icon.show(testElement)

      const iconElement = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      expect(iconElement).toBeTruthy()

      // Check icon styling requirements
      const computedStyles = window.getComputedStyle(iconElement)
      expect(computedStyles.position).toBe('fixed')
      expect(computedStyles.zIndex).toBe('9999')
      expect(computedStyles.cursor).toBe('pointer')
      expect(iconElement.style.width).toBe('20px')
      expect(iconElement.style.height).toBe('20px')
    })

    test('should be accessible with proper ARIA attributes', () => {
      // This test MUST FAIL initially - TDD requirement
      icon.show(testElement)

      const iconElement = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      expect(iconElement).toBeTruthy()

      expect(iconElement.getAttribute('role')).toBe('button')
      expect(iconElement.getAttribute('aria-label')).toContain('Inspect element')
      expect(iconElement.getAttribute('tabindex')).toBe('0')
    })

    test('should only show one icon at a time', () => {
      // This test MUST FAIL initially - TDD requirement
      icon.show(testElement)
      icon.show(secondElement)

      const iconElements = document.querySelectorAll('[data-vibe-inspection-icon]')
      expect(iconElements.length).toBe(1)

      const visibleIcon = iconElements[0] as HTMLElement
      expect(visibleIcon.getAttribute('data-target-id')).toBe('second-element')
    })

    test('should handle elements at viewport edge', () => {
      // This test MUST FAIL initially - TDD requirement
      // Position element at viewport edge
      testElement.style.top = '0px'
      testElement.style.left = '0px'

      icon.show(testElement)

      const iconElement = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      expect(iconElement).toBeTruthy()

      const iconRect = iconElement.getBoundingClientRect()

      // Icon should stay within viewport bounds
      expect(iconRect.left).toBeGreaterThanOrEqual(0)
      expect(iconRect.top).toBeGreaterThanOrEqual(0)
      expect(iconRect.right).toBeLessThanOrEqual(window.innerWidth)
      expect(iconRect.bottom).toBeLessThanOrEqual(window.innerHeight)
    })

    test('should handle invalid elements gracefully', () => {
      // This test MUST FAIL initially - TDD requirement
      const invalidElement = null as any

      expect(() => icon.show(invalidElement)).toThrow(/invalid|element/i)
    })

    test('should handle elements removed from DOM', () => {
      // This test MUST FAIL initially - TDD requirement
      document.body.removeChild(testElement)

      expect(() => icon.show(testElement)).toThrow(/not found|removed/i)
    })
  })

  describe('hide method', () => {
    test('should remove inspection icon from DOM', () => {
      // This test MUST FAIL initially - TDD requirement
      icon.show(testElement)

      // Verify icon exists
      expect(document.querySelector('[data-vibe-inspection-icon]')).toBeTruthy()

      icon.hide()

      // Verify icon is removed
      expect(document.querySelector('[data-vibe-inspection-icon]')).toBeNull()
    })

    test('should be safe to call when no icon is shown', () => {
      // This test MUST FAIL initially - TDD requirement
      expect(() => icon.hide()).not.toThrow()
    })

    test('should be safe to call multiple times', () => {
      // This test MUST FAIL initially - TDD requirement
      icon.show(testElement)
      icon.hide()
      icon.hide()
      icon.hide()

      expect(document.querySelector('[data-vibe-inspection-icon]')).toBeNull()
    })

    test('should clean up event listeners', () => {
      // This test MUST FAIL initially - TDD requirement
      const clickHandler = jest.fn()
      icon.setClickHandler(clickHandler)
      icon.show(testElement)

      const iconElement = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement

      icon.hide()

      // Try to trigger click after hide - should not call handler
      if (iconElement && iconElement.parentNode) {
        iconElement.click()
        expect(clickHandler).not.toHaveBeenCalled()
      }
    })
  })

  describe('updatePosition method', () => {
    test('should update icon position when target element moves', () => {
      // This test MUST FAIL initially - TDD requirement
      icon.show(testElement)

      const iconElement = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      const initialRect = iconElement.getBoundingClientRect()

      // Move target element
      testElement.style.top = '300px'
      testElement.style.left = '300px'

      icon.updatePosition(testElement)

      const updatedRect = iconElement.getBoundingClientRect()

      // Icon should have moved
      expect(updatedRect.top).not.toBe(initialRect.top)
      expect(updatedRect.left).not.toBe(initialRect.left)
    })

    test('should handle target element resize', () => {
      // This test MUST FAIL initially - TDD requirement
      icon.show(testElement)

      // Resize target element
      testElement.style.width = '400px'
      testElement.style.height = '200px'

      icon.updatePosition(testElement)

      const iconElement = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      const iconRect = iconElement.getBoundingClientRect()
      const targetRect = testElement.getBoundingClientRect()

      // Icon should still be positioned relative to resized element
      expect(iconRect.top).toBeGreaterThanOrEqual(targetRect.top - 30)
      expect(iconRect.left).toBeGreaterThanOrEqual(targetRect.left - 30)
    })

    test('should handle scroll changes', () => {
      // This test MUST FAIL initially - TDD requirement
      icon.show(testElement)

      // Simulate scroll by changing element position
      const originalTop = testElement.offsetTop
      testElement.style.top = (originalTop + 100) + 'px'

      icon.updatePosition(testElement)

      const iconElement = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      expect(iconElement).toBeTruthy()

      // Icon should have updated position
      const iconRect = iconElement.getBoundingClientRect()
      const targetRect = testElement.getBoundingClientRect()

      expect(Math.abs(iconRect.top - targetRect.top)).toBeLessThan(50)
    })

    test('should throw error when no icon is shown', () => {
      // This test MUST FAIL initially - TDD requirement
      expect(() => icon.updatePosition(testElement)).toThrow(/no icon|not shown/i)
    })

    test('should handle invalid element gracefully', () => {
      // This test MUST FAIL initially - TDD requirement
      icon.show(testElement)

      const invalidElement = null as any
      expect(() => icon.updatePosition(invalidElement)).toThrow(/invalid|element/i)
    })

    test('should maintain viewport boundaries after update', () => {
      // This test MUST FAIL initially - TDD requirement
      icon.show(testElement)

      // Move element to edge of viewport
      testElement.style.top = (window.innerHeight - 10) + 'px'
      testElement.style.left = (window.innerWidth - 10) + 'px'

      icon.updatePosition(testElement)

      const iconElement = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      const iconRect = iconElement.getBoundingClientRect()

      expect(iconRect.right).toBeLessThanOrEqual(window.innerWidth)
      expect(iconRect.bottom).toBeLessThanOrEqual(window.innerHeight)
    })
  })

  describe('setClickHandler method', () => {
    test('should register click handler for icon', () => {
      // This test MUST FAIL initially - TDD requirement
      const clickHandler = jest.fn()
      icon.setClickHandler(clickHandler)
      icon.show(testElement)

      const iconElement = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      iconElement.click()

      expect(clickHandler).toHaveBeenCalledTimes(1)
      expect(clickHandler).toHaveBeenCalledWith(testElement)
    })

    test('should replace previous click handler', () => {
      // This test MUST FAIL initially - TDD requirement
      const firstHandler = jest.fn()
      const secondHandler = jest.fn()

      icon.setClickHandler(firstHandler)
      icon.setClickHandler(secondHandler)
      icon.show(testElement)

      const iconElement = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      iconElement.click()

      expect(firstHandler).not.toHaveBeenCalled()
      expect(secondHandler).toHaveBeenCalledTimes(1)
    })

    test('should handle keyboard activation (Enter/Space)', () => {
      // This test MUST FAIL initially - TDD requirement
      const clickHandler = jest.fn()
      icon.setClickHandler(clickHandler)
      icon.show(testElement)

      const iconElement = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement

      // Simulate Enter key press
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' })
      iconElement.dispatchEvent(enterEvent)

      expect(clickHandler).toHaveBeenCalledWith(testElement)

      // Simulate Space key press
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' })
      iconElement.dispatchEvent(spaceEvent)

      expect(clickHandler).toHaveBeenCalledTimes(2)
    })

    test('should prevent default behavior for handled events', () => {
      // This test MUST FAIL initially - TDD requirement
      const clickHandler = jest.fn()
      icon.setClickHandler(clickHandler)
      icon.show(testElement)

      const iconElement = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement

      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true })
      const preventDefault = jest.spyOn(clickEvent, 'preventDefault')
      const stopPropagation = jest.spyOn(clickEvent, 'stopPropagation')

      iconElement.dispatchEvent(clickEvent)

      expect(preventDefault).toHaveBeenCalled()
      expect(stopPropagation).toHaveBeenCalled()
    })

    test('should handle null handler gracefully', () => {
      // This test MUST FAIL initially - TDD requirement
      icon.setClickHandler(null as any)
      icon.show(testElement)

      const iconElement = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement

      expect(() => iconElement.click()).not.toThrow()
    })
  })

  describe('destroy method', () => {
    test('should remove icon and clean up all resources', () => {
      // This test MUST FAIL initially - TDD requirement
      const clickHandler = jest.fn()
      icon.setClickHandler(clickHandler)
      icon.show(testElement)

      // Verify icon exists
      expect(document.querySelector('[data-vibe-inspection-icon]')).toBeTruthy()

      icon.destroy()

      // Verify complete cleanup
      expect(document.querySelector('[data-vibe-inspection-icon]')).toBeNull()
    })

    test('should be safe to call multiple times', () => {
      // This test MUST FAIL initially - TDD requirement
      icon.show(testElement)

      expect(() => {
        icon.destroy()
        icon.destroy()
        icon.destroy()
      }).not.toThrow()
    })

    test('should be safe to call when no icon exists', () => {
      // This test MUST FAIL initially - TDD requirement
      expect(() => icon.destroy()).not.toThrow()
    })

    test('should prevent future operations after destroy', () => {
      // This test MUST FAIL initially - TDD requirement
      icon.show(testElement)
      icon.destroy()

      // Operations after destroy should fail gracefully or throw appropriate errors
      expect(() => icon.show(testElement)).toThrow(/destroyed|disposed/i)
      expect(() => icon.hide()).toThrow(/destroyed|disposed/i)
      expect(() => icon.updatePosition(testElement)).toThrow(/destroyed|disposed/i)
    })

    test('should remove all event listeners', () => {
      // This test MUST FAIL initially - TDD requirement
      const clickHandler = jest.fn()
      icon.setClickHandler(clickHandler)
      icon.show(testElement)

      const iconElement = document.querySelector('[data-vibe-inspection-icon]')

      icon.destroy()

      // Try to trigger events after destroy - should not call handlers
      if (iconElement && iconElement.parentNode) {
        const clickEvent = new MouseEvent('click')
        iconElement.dispatchEvent(clickEvent)
        expect(clickHandler).not.toHaveBeenCalled()
      }
    })
  })

  describe('Performance Requirements', () => {
    test('should show icon within 50ms', () => {
      // This test MUST FAIL initially - TDD requirement
      const start = performance.now()

      icon.show(testElement)

      const duration = performance.now() - start
      expect(duration).toBeLessThan(50)
    })

    test('should update position within 16ms for smooth animations', () => {
      // This test MUST FAIL initially - TDD requirement
      icon.show(testElement)

      const start = performance.now()

      icon.updatePosition(testElement)

      const duration = performance.now() - start
      expect(duration).toBeLessThan(16) // 60fps requirement
    })

    test('should handle rapid position updates efficiently', () => {
      // This test MUST FAIL initially - TDD requirement
      icon.show(testElement)

      const start = performance.now()

      // Simulate rapid mouse movement causing position updates
      for (let i = 0; i < 100; i++) {
        testElement.style.left = (100 + i) + 'px'
        icon.updatePosition(testElement)
      }

      const duration = performance.now() - start
      expect(duration).toBeLessThan(100) // Should handle 100 updates in <100ms
    })
  })

  describe('Error Handling', () => {
    test('should provide meaningful error messages', () => {
      // This test MUST FAIL initially - TDD requirement
      try {
        icon.show(null as any)
        fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toMatch(/invalid|element|null/i)
      }
    })

    test('should handle DOM mutations gracefully', () => {
      // This test MUST FAIL initially - TDD requirement
      icon.show(testElement)

      // Remove target element while icon is shown
      document.body.removeChild(testElement)

      // Icon should handle this gracefully
      expect(() => icon.updatePosition(testElement)).toThrow(/not found|removed/i)
      expect(() => icon.hide()).not.toThrow()
    })

    test('should handle CSS conflicts gracefully', () => {
      // This test MUST FAIL initially - TDD requirement
      // Add conflicting CSS
      const style = document.createElement('style')
      style.textContent = `
        [data-vibe-inspection-icon] {
          position: static !important;
          z-index: 1 !important;
        }
      `
      document.head.appendChild(style)

      try {
        icon.show(testElement)

        const iconElement = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
        expect(iconElement).toBeTruthy()

        // Should still function despite CSS conflicts
        expect(() => icon.hide()).not.toThrow()
      } finally {
        document.head.removeChild(style)
      }
    })
  })

  describe('Accessibility Requirements', () => {
    test('should be focusable via keyboard navigation', () => {
      // This test MUST FAIL initially - TDD requirement
      icon.show(testElement)

      const iconElement = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      iconElement.focus()

      expect(document.activeElement).toBe(iconElement)
    })

    test('should have proper focus indicators', () => {
      // This test MUST FAIL initially - TDD requirement
      icon.show(testElement)

      const iconElement = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      iconElement.focus()

      const computedStyles = window.getComputedStyle(iconElement, ':focus')
      // Should have visible focus indicator
      expect(computedStyles.outline).not.toBe('none')
    })

    test('should work with screen readers', () => {
      // This test MUST FAIL initially - TDD requirement
      icon.show(testElement)

      const iconElement = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement

      expect(iconElement.getAttribute('aria-describedby')).toBeTruthy()
      expect(iconElement.getAttribute('aria-label')).toContain('element')
    })

    test('should respect reduced motion preferences', () => {
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

      icon.show(testElement)

      const iconElement = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      const computedStyles = window.getComputedStyle(iconElement)

      // Should disable animations when reduced motion is preferred
      expect(computedStyles.transition).toBe('none')
    })
  })
})