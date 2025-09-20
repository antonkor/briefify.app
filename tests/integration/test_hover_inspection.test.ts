/**
 * Integration Test: User Story 2 - Hover to Inspect
 *
 * "As a developer, I want to see inspection hints when hovering over elements,
 * so that I can quickly preview element information without clicking."
 *
 * These tests verify the hover-based inspection workflow and preview functionality.
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals'

// Integration test - these will initially fail until implementations exist
describe('User Story 2: Hover to Inspect', () => {
  let testContainer: HTMLDivElement
  let primaryElement: HTMLDivElement
  let secondaryElement: HTMLButtonElement
  let nestedElement: HTMLSpanElement

  beforeEach(() => {
    // Create test environment with multiple inspectable elements
    testContainer = document.createElement('div')
    testContainer.id = 'hover-test-container'
    testContainer.style.cssText = 'position: relative; width: 1000px; height: 800px; padding: 50px;'
    document.body.appendChild(testContainer)

    // Primary test element - complex Tailwind styling
    primaryElement = document.createElement('div')
    primaryElement.id = 'primary-target'
    primaryElement.className = 'relative w-80 h-48 bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300'
    primaryElement.style.cssText = 'position: absolute; top: 100px; left: 100px;'
    primaryElement.innerHTML = `
      <h2 class="text-white text-xl font-bold mb-2">Primary Element</h2>
      <p class="text-blue-100 text-sm">Complex styling for testing</p>
      <span class="inline-block mt-2 px-3 py-1 bg-white bg-opacity-20 rounded-full text-white text-xs">Tag</span>
    `

    // Secondary element - button with interactions
    secondaryElement = document.createElement('button')
    secondaryElement.id = 'secondary-target'
    secondaryElement.className = 'px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-400'
    secondaryElement.style.cssText = 'position: absolute; top: 300px; left: 500px;'
    secondaryElement.textContent = 'Interactive Button'

    // Nested element for hierarchy testing
    nestedElement = primaryElement.querySelector('span') as HTMLSpanElement

    testContainer.appendChild(primaryElement)
    testContainer.appendChild(secondaryElement)

    // Mock React fiber for React component testing
    const mockPrimaryFiber = {
      memoizedProps: {
        className: primaryElement.className,
        children: ['Primary Element', 'Complex styling for testing'],
        variant: 'gradient-card'
      },
      memoizedState: { isHovered: false, isActive: true },
      type: { name: 'GradientCard', displayName: 'GradientCard' }
    }
    ;(primaryElement as any).__reactFiber$ = mockPrimaryFiber

    const mockButtonFiber = {
      memoizedProps: {
        onClick: () => console.log('button clicked'),
        variant: 'primary',
        size: 'md'
      },
      memoizedState: null,
      type: { name: 'Button', displayName: 'PrimaryButton' }
    }
    ;(secondaryElement as any).__reactFiber$ = mockButtonFiber
  })

  afterEach(() => {
    document.body.removeChild(testContainer)

    // Clean up any hover inspection UI
    const inspectionElements = document.querySelectorAll(
      '[data-vibe-inspection-icon], [data-vibe-popup], [data-hover-preview]'
    )
    inspectionElements.forEach(el => el.remove())
  })

  describe('Hover Detection and Visual Feedback', () => {
    test('should show inspection icon on hover with proper positioning', async () => {
      // This test MUST FAIL initially - integration requirement

      // Enable hover inspection mode
      document.documentElement.setAttribute('data-vibe-mode', 'true')
      document.documentElement.setAttribute('data-hover-inspection', 'true')

      // Simulate mouse hover over primary element
      const hoverEvent = new MouseEvent('mouseenter', {
        bubbles: true,
        clientX: 250, // Within primary element
        clientY: 200
      })
      primaryElement.dispatchEvent(hoverEvent)

      // Allow for hover detection and icon positioning
      await new Promise(resolve => setTimeout(resolve, 100))

      // Should display inspection icon
      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      expect(inspectionIcon).toBeTruthy()
      expect(inspectionIcon.getAttribute('data-target-id')).toBe('primary-target')

      // Icon should be properly positioned relative to element
      const iconRect = inspectionIcon.getBoundingClientRect()
      const elementRect = primaryElement.getBoundingClientRect()

      expect(iconRect.top).toBeGreaterThanOrEqual(elementRect.top - 30)
      expect(iconRect.top).toBeLessThanOrEqual(elementRect.bottom + 30)
      expect(iconRect.left).toBeGreaterThanOrEqual(elementRect.left - 30)
      expect(iconRect.left).toBeLessThanOrEqual(elementRect.right + 30)

      // Icon should have proper visual styling
      const computedStyles = window.getComputedStyle(inspectionIcon)
      expect(computedStyles.position).toBe('fixed')
      expect(computedStyles.zIndex).toBe('9999')
      expect(computedStyles.cursor).toBe('pointer')
      expect(inspectionIcon.style.width).toBe('20px')
      expect(inspectionIcon.style.height).toBe('20px')
    })

    test('should show hover preview with element information', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')
      document.documentElement.setAttribute('data-hover-preview', 'true')

      // Hover over element with delay to trigger preview
      primaryElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 500)) // Wait for preview delay

      // Should show hover preview tooltip
      const hoverPreview = document.querySelector('[data-hover-preview]') as HTMLElement
      expect(hoverPreview).toBeTruthy()

      // Preview should contain basic element information
      expect(hoverPreview.textContent).toContain('div#primary-target')
      expect(hoverPreview.textContent).toContain('Tailwind')
      expect(hoverPreview.textContent).toContain('GradientCard')

      // Preview should be positioned near cursor/element
      const previewRect = hoverPreview.getBoundingClientRect()
      expect(previewRect.width).toBeGreaterThan(100)
      expect(previewRect.height).toBeGreaterThan(50)

      // Should be visible and styled appropriately
      const previewStyles = window.getComputedStyle(hoverPreview)
      expect(previewStyles.position).toBe('fixed')
      expect(previewStyles.backgroundColor).toBeTruthy()
      expect(previewStyles.border).toBeTruthy()
      expect(previewStyles.borderRadius).toBeTruthy()
    })

    test('should handle smooth hover transitions between elements', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      // Hover over first element
      primaryElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      let inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      expect(inspectionIcon.getAttribute('data-target-id')).toBe('primary-target')

      // Transition to second element
      primaryElement.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
      secondaryElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      // Should update icon for new target
      inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      expect(inspectionIcon).toBeTruthy()
      expect(inspectionIcon.getAttribute('data-target-id')).toBe('secondary-target')

      // Should only have one icon at a time
      const allIcons = document.querySelectorAll('[data-vibe-inspection-icon]')
      expect(allIcons.length).toBe(1)

      // Icon should smoothly transition position
      const newIconRect = inspectionIcon.getBoundingClientRect()
      const buttonRect = secondaryElement.getBoundingClientRect()

      expect(newIconRect.top).toBeGreaterThanOrEqual(buttonRect.top - 30)
      expect(newIconRect.left).toBeGreaterThanOrEqual(buttonRect.left - 30)
    })

    test('should handle rapid hover movements efficiently', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      const startTime = performance.now()

      // Rapidly move between elements
      for (let i = 0; i < 20; i++) {
        const target = i % 2 === 0 ? primaryElement : secondaryElement
        target.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
        await new Promise(resolve => setTimeout(resolve, 10))

        const otherTarget = i % 2 === 0 ? secondaryElement : primaryElement
        target.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
        otherTarget.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
        await new Promise(resolve => setTimeout(resolve, 10))
      }

      const totalTime = performance.now() - startTime

      // Should handle rapid movements without performance issues
      expect(totalTime).toBeLessThan(2000)

      // Should not create multiple icons
      const icons = document.querySelectorAll('[data-vibe-inspection-icon]')
      expect(icons.length).toBeLessThanOrEqual(1)

      // Should stabilize on final target
      const finalIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      if (finalIcon) {
        expect(['primary-target', 'secondary-target']).toContain(
          finalIcon.getAttribute('data-target-id')
        )
      }
    })

    test('should respect hover delay settings', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')
      document.documentElement.setAttribute('data-hover-delay', '300')

      // Hover briefly (less than delay)
      primaryElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      // Should not show icon yet
      let inspectionIcon = document.querySelector('[data-vibe-inspection-icon]')
      expect(inspectionIcon).toBeNull()

      // Continue hovering past delay
      await new Promise(resolve => setTimeout(resolve, 250))

      // Should now show icon
      inspectionIcon = document.querySelector('[data-vibe-inspection-icon]')
      expect(inspectionIcon).toBeTruthy()

      // Test rapid hover/unhover
      primaryElement.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 50))

      secondaryElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      secondaryElement.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 350))

      // Should not have created icon for brief hover
      const finalIcons = document.querySelectorAll('[data-vibe-inspection-icon]')
      expect(finalIcons.length).toBe(0)
    })
  })

  describe('Element Hierarchy Detection', () => {
    test('should detect and highlight element hierarchy on hover', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')
      document.documentElement.setAttribute('data-show-hierarchy', 'true')

      // Hover over nested element
      nestedElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      // Should highlight element hierarchy
      const hierarchyHighlights = document.querySelectorAll('[data-hierarchy-highlight]')
      expect(hierarchyHighlights.length).toBeGreaterThan(1)

      // Should highlight the target element and its parents
      const targetHighlight = document.querySelector('[data-hierarchy-target]')
      expect(targetHighlight).toBeTruthy()

      // Should show hierarchy information in preview
      const hoverPreview = document.querySelector('[data-hover-preview]') as HTMLElement
      if (hoverPreview) {
        expect(hoverPreview.textContent).toContain('Parent')
        expect(hoverPreview.textContent).toContain('div#primary-target')
      }

      // Hierarchy highlights should have distinct visual styling
      hierarchyHighlights.forEach((highlight, index) => {
        const styles = window.getComputedStyle(highlight as HTMLElement)
        expect(styles.outline).toBeTruthy()
        expect(styles.outlineColor).toBeTruthy()
      })
    })

    test('should show parent-child relationships clearly', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      // Create deeper nesting
      const deepChild = document.createElement('em')
      deepChild.className = 'italic text-blue-200'
      deepChild.textContent = 'Deeply nested'
      nestedElement.appendChild(deepChild)

      deepChild.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      expect(inspectionIcon).toBeTruthy()

      // Click to see full hierarchy
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 200))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      expect(popup).toBeTruthy()

      // Should show complete parent chain
      const hierarchySection = popup.querySelector('[data-section-id="hierarchy"]')
      expect(hierarchySection).toBeTruthy()
      expect(hierarchySection?.textContent).toContain('em')
      expect(hierarchySection?.textContent).toContain('span')
      expect(hierarchySection?.textContent).toContain('div#primary-target')

      // Should show nesting levels
      const nestingLevels = popup.querySelectorAll('[data-nesting-level]')
      expect(nestingLevels.length).toBeGreaterThanOrEqual(3)
    })

    test('should handle complex DOM structures efficiently', async () => {
      // This test MUST FAIL initially - integration requirement

      // Create complex nested structure
      const complexContainer = document.createElement('div')
      complexContainer.className = 'complex-container grid grid-cols-3 gap-4 p-6'

      for (let i = 0; i < 9; i++) {
        const card = document.createElement('div')
        card.className = `card-${i} bg-white p-4 rounded shadow hover:shadow-md`

        const header = document.createElement('h3')
        header.className = 'text-lg font-semibold mb-2'
        header.textContent = `Card ${i + 1}`

        const content = document.createElement('div')
        content.className = 'content space-y-2'

        for (let j = 0; j < 3; j++) {
          const item = document.createElement('p')
          item.className = 'text-sm text-gray-600'
          item.textContent = `Item ${j + 1}`
          content.appendChild(item)
        }

        card.appendChild(header)
        card.appendChild(content)
        complexContainer.appendChild(card)
      }

      testContainer.appendChild(complexContainer)
      document.documentElement.setAttribute('data-vibe-mode', 'true')

      try {
        // Hover over deeply nested element
        const deepTarget = complexContainer.querySelector('p') as HTMLElement
        deepTarget.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))

        const analysisStart = performance.now()
        await new Promise(resolve => setTimeout(resolve, 200))
        const analysisTime = performance.now() - analysisStart

        // Should complete hierarchy analysis within performance requirements
        expect(analysisTime).toBeLessThan(300)

        const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]')
        expect(inspectionIcon).toBeTruthy()

        // Should handle complex structure without errors
        inspectionIcon?.click && (inspectionIcon as HTMLElement).click()
        await new Promise(resolve => setTimeout(resolve, 100))

        const popup = document.querySelector('[data-vibe-popup]')
        expect(popup).toBeTruthy()
      } finally {
        testContainer.removeChild(complexContainer)
      }
    })
  })

  describe('Interactive Element Detection', () => {
    test('should identify and highlight interactive elements', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      // Hover over interactive button
      secondaryElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      expect(inspectionIcon).toBeTruthy()

      // Should indicate element is interactive
      expect(inspectionIcon.getAttribute('data-interactive')).toBe('true')

      // Icon should have different styling for interactive elements
      const iconStyles = window.getComputedStyle(inspectionIcon)
      expect(inspectionIcon.classList.contains('interactive-element')).toBe(true)

      // Hover preview should indicate interactivity
      await new Promise(resolve => setTimeout(resolve, 400)) // Wait for preview
      const hoverPreview = document.querySelector('[data-hover-preview]') as HTMLElement
      if (hoverPreview) {
        expect(hoverPreview.textContent).toContain('Interactive')
        expect(hoverPreview.textContent).toContain('Button')
      }
    })

    test('should detect event handlers and interaction patterns', async () => {
      // This test MUST FAIL initially - integration requirement

      // Add various event handlers
      secondaryElement.addEventListener('click', () => console.log('clicked'))
      secondaryElement.addEventListener('mousedown', () => console.log('mousedown'))
      secondaryElement.addEventListener('focus', () => console.log('focused'))

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      secondaryElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 200))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      expect(popup).toBeTruthy()

      // Should show interaction analysis
      const interactionSection = popup.querySelector('[data-section-id="interactions"]')
      expect(interactionSection).toBeTruthy()
      expect(interactionSection?.textContent).toContain('Event handlers')
      expect(interactionSection?.textContent).toContain('click')
      expect(interactionSection?.textContent).toContain('focus')

      // Should show accessibility information
      const a11ySection = popup.querySelector('[data-section-id="accessibility"]')
      if (a11ySection) {
        expect(a11ySection.textContent).toContain('button')
        expect(a11ySection.textContent).toContain('focusable')
      }
    })

    test('should detect form elements and their properties', async () => {
      // This test MUST FAIL initially - integration requirement

      // Create form elements
      const form = document.createElement('form')
      form.className = 'space-y-4 p-6 bg-gray-50 rounded-lg'

      const input = document.createElement('input')
      input.type = 'email'
      input.placeholder = 'Enter your email'
      input.className = 'w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500'
      input.required = true

      const select = document.createElement('select')
      select.className = 'w-full px-3 py-2 border rounded'
      select.innerHTML = '<option>Option 1</option><option>Option 2</option>'

      form.appendChild(input)
      form.appendChild(select)
      testContainer.appendChild(form)

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      try {
        // Test input field
        input.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
        await new Promise(resolve => setTimeout(resolve, 100))

        let inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
        inspectionIcon.click()
        await new Promise(resolve => setTimeout(resolve, 200))

        let popup = document.querySelector('[data-vibe-popup]') as HTMLElement
        expect(popup).toBeTruthy()

        // Should detect form input properties
        const formSection = popup.querySelector('[data-section-id="form-info"]')
        expect(formSection).toBeTruthy()
        expect(formSection?.textContent).toContain('email')
        expect(formSection?.textContent).toContain('required')

        // Clear popup
        popup.remove()

        // Test select element
        select.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
        await new Promise(resolve => setTimeout(resolve, 100))

        inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
        inspectionIcon.click()
        await new Promise(resolve => setTimeout(resolve, 200))

        popup = document.querySelector('[data-vibe-popup]') as HTMLElement
        expect(popup.querySelector('[data-section-id="form-info"]')?.textContent).toContain('select')
      } finally {
        testContainer.removeChild(form)
      }
    })
  })

  describe('Performance and Optimization', () => {
    test('should use debouncing for hover events', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      let iconCreationCount = 0
      const originalQuerySelector = document.querySelector.bind(document)
      document.querySelector = (selector: string) => {
        if (selector.includes('vibe-inspection-icon')) {
          iconCreationCount++
        }
        return originalQuerySelector(selector)
      }

      try {
        // Rapidly hover over element multiple times
        for (let i = 0; i < 10; i++) {
          primaryElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
          await new Promise(resolve => setTimeout(resolve, 10))
          primaryElement.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
          await new Promise(resolve => setTimeout(resolve, 10))
        }

        // Final hover to trigger icon
        primaryElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
        await new Promise(resolve => setTimeout(resolve, 150))

        // Should have debounced and not created excessive icons
        expect(iconCreationCount).toBeLessThan(10)

        const finalIcon = document.querySelector('[data-vibe-inspection-icon]')
        expect(finalIcon).toBeTruthy()
      } finally {
        document.querySelector = originalQuerySelector
      }
    })

    test('should cache analysis results for performance', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      // First hover - should perform analysis
      const firstHoverStart = performance.now()
      primaryElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      let inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 200))

      const firstAnalysisTime = performance.now() - firstHoverStart
      let popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      expect(popup).toBeTruthy()

      // Close popup
      popup.remove()

      // Second hover on same element - should use cache
      const secondHoverStart = performance.now()
      primaryElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 200))

      const secondAnalysisTime = performance.now() - secondHoverStart

      popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      expect(popup).toBeTruthy()

      // Second analysis should be significantly faster due to caching
      expect(secondAnalysisTime).toBeLessThan(firstAnalysisTime * 0.8)
    })

    test('should handle memory cleanup for removed elements', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      // Create temporary element
      const tempElement = document.createElement('div')
      tempElement.className = 'temp-element bg-red-500 p-4'
      tempElement.textContent = 'Temporary element'
      testContainer.appendChild(tempElement)

      // Hover and analyze
      tempElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 200))

      expect(document.querySelector('[data-vibe-popup]')).toBeTruthy()

      // Remove element from DOM
      testContainer.removeChild(tempElement)

      // Should handle cleanup gracefully
      await new Promise(resolve => setTimeout(resolve, 100))

      // Try to hover other elements - should work normally
      primaryElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const newIcon = document.querySelector('[data-vibe-inspection-icon]')
      expect(newIcon).toBeTruthy()

      // Should not have memory leaks or stale references
      expect(() => {
        newIcon && (newIcon as HTMLElement).click()
      }).not.toThrow()
    })

    test('should throttle analysis for rapid element changes', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      const elements = [primaryElement, secondaryElement]
      let analysisCount = 0

      // Mock analysis to count invocations
      const originalGetComputedStyle = window.getComputedStyle
      window.getComputedStyle = (...args) => {
        analysisCount++
        return originalGetComputedStyle.apply(window, args)
      }

      try {
        // Rapidly switch between elements
        for (let i = 0; i < 20; i++) {
          const element = elements[i % 2]
          element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
          await new Promise(resolve => setTimeout(resolve, 25))
        }

        // Should have throttled analysis calls
        expect(analysisCount).toBeLessThan(40) // Should be significantly less than 20 * 2

        // Final result should still be correct
        const finalIcon = document.querySelector('[data-vibe-inspection-icon]')
        expect(finalIcon).toBeTruthy()
      } finally {
        window.getComputedStyle = originalGetComputedStyle
      }
    })
  })

  describe('User Experience and Accessibility', () => {
    test('should provide clear visual feedback for hover states', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      // Test different hover feedback modes
      const feedbackModes = ['icon', 'outline', 'both']

      for (const mode of feedbackModes) {
        document.documentElement.setAttribute('data-hover-feedback', mode)

        primaryElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
        await new Promise(resolve => setTimeout(resolve, 100))

        if (mode === 'icon' || mode === 'both') {
          const icon = document.querySelector('[data-vibe-inspection-icon]')
          expect(icon).toBeTruthy()
        }

        if (mode === 'outline' || mode === 'both') {
          const computedStyles = window.getComputedStyle(primaryElement)
          expect(computedStyles.outline).toBeTruthy()
          expect(computedStyles.outlineColor).toBeTruthy()
        }

        // Clear state
        primaryElement.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
        await new Promise(resolve => setTimeout(resolve, 50))
      }
    })

    test('should support keyboard navigation for inspection', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      // Tab to focusable elements
      secondaryElement.focus()
      expect(document.activeElement).toBe(secondaryElement)

      // Should show inspection option for focused element
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]')
      expect(inspectionIcon).toBeTruthy()

      // Should be able to activate inspection via keyboard
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ', ctrlKey: true })
      secondaryElement.dispatchEvent(spaceEvent)
      await new Promise(resolve => setTimeout(resolve, 200))

      const popup = document.querySelector('[data-vibe-popup]')
      expect(popup).toBeTruthy()

      // Should be able to navigate within popup
      const popupFocusable = popup?.querySelectorAll('button, [tabindex="0"]')
      expect(popupFocusable && popupFocusable.length).toBeGreaterThan(0)
    })

    test('should respect accessibility preferences', async () => {
      // This test MUST FAIL initially - integration requirement

      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        value: jest.fn(() => ({
          matches: true,
          media: '(prefers-reduced-motion: reduce)',
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
        })),
      })

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      primaryElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      expect(inspectionIcon).toBeTruthy()

      // Should disable animations when reduced motion is preferred
      const iconStyles = window.getComputedStyle(inspectionIcon)
      expect(iconStyles.transition).toBe('none')

      // Should still provide full functionality
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 100))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      expect(popup).toBeTruthy()

      const popupStyles = window.getComputedStyle(popup)
      expect(popupStyles.transition).toBe('none')
    })

    test('should provide screen reader support', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      primaryElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      expect(inspectionIcon).toBeTruthy()

      // Should have proper ARIA attributes
      expect(inspectionIcon.getAttribute('role')).toBe('button')
      expect(inspectionIcon.getAttribute('aria-label')).toContain('Inspect element')
      expect(inspectionIcon.getAttribute('aria-describedby')).toBeTruthy()

      // Should announce hover information
      const liveRegion = document.querySelector('[aria-live="polite"]')
      expect(liveRegion).toBeTruthy()
      expect(liveRegion?.textContent).toContain('div')

      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 200))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      expect(popup.getAttribute('role')).toBe('dialog')
      expect(popup.getAttribute('aria-label')).toContain('Developer insights')
      expect(popup.getAttribute('aria-describedby')).toBeTruthy()
    })
  })
})