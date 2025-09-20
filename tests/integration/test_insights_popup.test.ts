/**
 * Integration Test: User Story 3 - Developer Insights Popup
 *
 * "As a developer, I want to see detailed insights about an element in a popup,
 * so that I can understand its styling, React props, and optimization opportunities."
 *
 * These tests verify the complete developer insights popup experience.
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals'

// Integration test - these will initially fail until implementations exist
describe('User Story 3: Developer Insights Popup', () => {
  let testContainer: HTMLDivElement
  let complexElement: HTMLDivElement
  let reactElement: HTMLDivElement
  let formElement: HTMLFormElement

  beforeEach(() => {
    // Create comprehensive test environment
    testContainer = document.createElement('div')
    testContainer.id = 'insights-test-container'
    testContainer.style.cssText = 'position: relative; width: 1200px; height: 900px; padding: 50px;'
    document.body.appendChild(testContainer)

    // Complex element with extensive Tailwind styling
    complexElement = document.createElement('div')
    complexElement.id = 'complex-element'
    complexElement.className = 'relative flex flex-col md:flex-row items-center justify-between gap-6 p-8 mx-auto max-w-4xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 ease-in-out transform hover:scale-105'
    complexElement.style.cssText = `
      position: absolute;
      top: 100px;
      left: 100px;
      --custom-primary: #6366f1;
      --custom-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      box-shadow: var(--custom-shadow);
    `
    complexElement.innerHTML = `
      <div class="flex-1 space-y-4">
        <h2 class="text-3xl font-bold tracking-tight">Complex Component</h2>
        <p class="text-lg text-indigo-100 leading-relaxed">This element demonstrates complex styling patterns with Tailwind CSS, custom properties, and responsive design.</p>
        <div class="flex flex-wrap gap-2">
          <span class="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium">Feature 1</span>
          <span class="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium">Feature 2</span>
        </div>
      </div>
      <div class="flex-shrink-0">
        <button class="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-lg hover:bg-gray-50 transition-colors">
          Action Button
        </button>
      </div>
    `

    // React element with complex state and props
    reactElement = document.createElement('div')
    reactElement.id = 'react-component'
    reactElement.className = 'card p-6 bg-white rounded-lg shadow-md'
    reactElement.style.cssText = 'position: absolute; top: 400px; left: 600px;'
    reactElement.innerHTML = `
      <h3 class="text-xl font-semibold mb-4">React Component</h3>
      <div class="space-y-2">
        <p class="text-gray-600">Interactive React component with state management</p>
        <button class="btn btn-primary">Click me</button>
      </div>
    `

    // Mock complex React fiber
    const mockReactFiber = {
      memoizedProps: {
        title: 'Interactive Dashboard Card',
        variant: 'primary',
        size: 'large',
        onClick: () => console.log('Card clicked'),
        onHover: () => console.log('Card hovered'),
        data: {
          id: 'card-123',
          type: 'dashboard',
          metrics: {
            views: 1250,
            interactions: 89,
            conversionRate: 0.071
          }
        },
        children: ['Interactive React component with state management'],
        className: 'card p-6 bg-white rounded-lg shadow-md',
        isActive: true,
        theme: 'light'
      },
      memoizedState: {
        isLoading: false,
        isExpanded: true,
        selectedTab: 'overview',
        userPreferences: {
          theme: 'light',
          layout: 'grid',
          showDetails: true
        },
        cache: new Map([
          ['metrics', { timestamp: Date.now(), data: { views: 1250 } }],
          ['user', { timestamp: Date.now(), data: { id: 'user-456' } }]
        ])
      },
      type: {
        name: 'DashboardCard',
        displayName: 'DashboardCard',
        $$typeof: Symbol.for('react.element')
      },
      key: 'dashboard-card-123',
      return: {
        type: { name: 'Dashboard' },
        memoizedProps: { layout: 'responsive' }
      },
      child: {
        type: { name: 'CardHeader' },
        sibling: {
          type: { name: 'CardBody' },
          sibling: {
            type: { name: 'CardFooter' }
          }
        }
      }
    }
    ;(reactElement as any).__reactFiber$ = mockReactFiber

    // Form element for accessibility testing
    formElement = document.createElement('form')
    formElement.className = 'form-container space-y-4 p-6 bg-gray-50 rounded-lg'
    formElement.style.cssText = 'position: absolute; top: 100px; left: 700px;'
    formElement.innerHTML = `
      <div class="form-group">
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" id="email" name="email" required
               class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
               placeholder="Enter your email">
      </div>
      <div class="form-group">
        <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
        <select id="role" name="role" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
          <option value="developer">Developer</option>
          <option value="designer">Designer</option>
          <option value="manager">Manager</option>
        </select>
      </div>
    `

    testContainer.appendChild(complexElement)
    testContainer.appendChild(reactElement)
    testContainer.appendChild(formElement)
  })

  afterEach(() => {
    document.body.removeChild(testContainer)

    // Clean up popup and inspection UI
    const popupElements = document.querySelectorAll('[data-vibe-popup], [data-vibe-inspection-icon]')
    popupElements.forEach(el => el.remove())
  })

  describe('Popup Structure and Layout', () => {
    test('should create well-structured popup with organized sections', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      // Trigger inspection
      complexElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      expect(popup).toBeTruthy()

      // Should have proper structure
      expect(popup.getAttribute('role')).toBe('dialog')
      expect(popup.getAttribute('aria-label')).toContain('Developer insights')

      // Should contain primary sections
      const primarySections = popup.querySelectorAll('[data-section-type="primary"]')
      expect(primarySections.length).toBeGreaterThan(0)

      // Should have element information section
      const elementSection = popup.querySelector('[data-section-id="element-info"]')
      expect(elementSection).toBeTruthy()
      expect(elementSection?.textContent).toContain('div#complex-element')

      // Should have CSS analysis section
      const cssSection = popup.querySelector('[data-section-id="css-analysis"]')
      expect(cssSection).toBeTruthy()
      expect(cssSection?.textContent).toContain('Tailwind')

      // Should have layout analysis section
      const layoutSection = popup.querySelector('[data-section-id="layout-info"]')
      expect(layoutSection).toBeTruthy()
      expect(layoutSection?.textContent).toContain('Flexbox')

      // Should be properly sized and positioned
      const popupRect = popup.getBoundingClientRect()
      expect(popupRect.width).toBeGreaterThan(300)
      expect(popupRect.width).toBeLessThanOrEqual(400)
      expect(popupRect.height).toBeGreaterThan(200)
      expect(popupRect.height).toBeLessThanOrEqual(600)
    })

    test('should organize content into logical sections with priorities', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      complexElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement

      // Primary sections should be most prominent
      const primarySections = popup.querySelectorAll('[data-section-type="primary"]')
      primarySections.forEach(section => {
        const priority = section.getAttribute('data-priority')
        expect(['high', 'medium'].includes(priority || '')).toBe(true)
      })

      // Secondary sections should be present but less prominent
      const secondarySections = popup.querySelectorAll('[data-section-type="secondary"]')
      expect(secondarySections.length).toBeGreaterThan(0)

      // Coming soon section should be at the bottom
      const comingSoonSection = popup.querySelector('[data-section-type="coming-soon"]')
      expect(comingSoonSection).toBeTruthy()

      // Sections should be visually distinct
      const allSections = popup.querySelectorAll('[data-section-type]')
      allSections.forEach(section => {
        const styles = window.getComputedStyle(section as HTMLElement)
        expect(styles.padding).toBeTruthy()
        expect(styles.marginBottom).toBeTruthy()
      })
    })

    test('should adapt layout based on viewport constraints', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      // Test near viewport edge
      const edgeElement = document.createElement('div')
      edgeElement.className = 'edge-test bg-red-500 p-4'
      edgeElement.style.cssText = `position: absolute; top: ${window.innerHeight - 100}px; left: ${window.innerWidth - 100}px;`
      testContainer.appendChild(edgeElement)

      try {
        edgeElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
        await new Promise(resolve => setTimeout(resolve, 100))

        const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
        inspectionIcon.click()
        await new Promise(resolve => setTimeout(resolve, 300))

        const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
        expect(popup).toBeTruthy()

        // Should adjust position to stay within viewport
        const popupRect = popup.getBoundingClientRect()
        expect(popupRect.right).toBeLessThanOrEqual(window.innerWidth)
        expect(popupRect.bottom).toBeLessThanOrEqual(window.innerHeight)
        expect(popupRect.left).toBeGreaterThanOrEqual(0)
        expect(popupRect.top).toBeGreaterThanOrEqual(0)

        // Should have appropriate placement indicator
        const placement = popup.getAttribute('data-placement')
        expect(['top', 'bottom', 'left', 'right'].includes(placement || '')).toBe(true)
      } finally {
        testContainer.removeChild(edgeElement)
      }
    })

    test('should provide smooth animations and transitions', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      const animationStart = performance.now()

      complexElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()

      // Wait for popup to appear with animation
      await new Promise(resolve => {
        const checkForPopup = () => {
          const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
          if (popup && popup.style.opacity === '1') {
            resolve(undefined)
          } else {
            setTimeout(checkForPopup, 10)
          }
        }
        checkForPopup()
      })

      const animationDuration = performance.now() - animationStart
      expect(animationDuration).toBeLessThan(500) // Should animate in quickly

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      const popupStyles = window.getComputedStyle(popup)

      // Should have smooth transitions
      expect(popupStyles.transition).toBeTruthy()
      expect(popupStyles.opacity).toBe('1')

      // Test closing animation
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' })
      document.dispatchEvent(escapeEvent)

      await new Promise(resolve => setTimeout(resolve, 300))

      // Should be removed or hidden
      const closedPopup = document.querySelector('[data-vibe-popup]')
      expect(closedPopup).toBeNull()
    })
  })

  describe('Element Analysis Content', () => {
    test('should provide comprehensive element information', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      complexElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      const elementSection = popup.querySelector('[data-section-id="element-info"]')

      expect(elementSection?.textContent).toContain('div')
      expect(elementSection?.textContent).toContain('complex-element')
      expect(elementSection?.textContent).toContain('Complex Component')

      // Should show dimensions
      const dimensionsInfo = popup.querySelector('[data-info-type="dimensions"]')
      expect(dimensionsInfo).toBeTruthy()
      expect(dimensionsInfo?.textContent).toMatch(/\d+px.*\d+px/)

      // Should show position information
      const positionInfo = popup.querySelector('[data-info-type="position"]')
      expect(positionInfo).toBeTruthy()
      expect(positionInfo?.textContent).toContain('absolute')
    })

    test('should analyze CSS framework usage comprehensively', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      complexElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      const cssSection = popup.querySelector('[data-section-id="css-analysis"]')

      expect(cssSection).toBeTruthy()

      // Should detect Tailwind usage
      expect(cssSection?.textContent).toContain('Tailwind')

      // Should categorize classes
      const spacingClasses = popup.querySelector('[data-category="spacing"]')
      expect(spacingClasses).toBeTruthy()
      expect(spacingClasses?.textContent).toContain('p-8')

      const colorClasses = popup.querySelector('[data-category="colors"]')
      expect(colorClasses).toBeTruthy()
      expect(colorClasses?.textContent).toContain('indigo')

      const layoutClasses = popup.querySelector('[data-category="layout"]')
      expect(layoutClasses).toBeTruthy()
      expect(layoutClasses?.textContent).toContain('flex')

      // Should detect responsive classes
      const responsiveClasses = popup.querySelector('[data-responsive="true"]')
      expect(responsiveClasses).toBeTruthy()
      expect(responsiveClasses?.textContent).toContain('md:flex-row')

      // Should show pseudo-class variants
      const pseudoClasses = popup.querySelector('[data-pseudo-class="hover"]')
      expect(pseudoClasses).toBeTruthy()
      expect(pseudoClasses?.textContent).toContain('hover:')
    })

    test('should detect and explain CSS custom properties', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      complexElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      const customPropsSection = popup.querySelector('[data-section-id="custom-properties"]')

      expect(customPropsSection).toBeTruthy()
      expect(customPropsSection?.textContent).toContain('--custom-primary')
      expect(customPropsSection?.textContent).toContain('--custom-shadow')

      // Should show resolved values
      const resolvedValues = popup.querySelectorAll('[data-css-var-resolved]')
      expect(resolvedValues.length).toBeGreaterThan(0)

      resolvedValues.forEach(value => {
        expect(value.textContent).toMatch(/#[0-9a-fA-F]{6}|rgba?\(|[0-9]+px/)
      })
    })

    test('should provide layout analysis and hierarchy information', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      // Get nested element for hierarchy testing
      const nestedButton = complexElement.querySelector('button') as HTMLElement

      nestedButton.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      const layoutSection = popup.querySelector('[data-section-id="layout-info"]')

      expect(layoutSection).toBeTruthy()

      // Should show layout type
      expect(layoutSection?.textContent).toContain('Flexbox')

      // Should show hierarchy
      const hierarchySection = popup.querySelector('[data-section-id="hierarchy"]')
      expect(hierarchySection).toBeTruthy()
      expect(hierarchySection?.textContent).toContain('button')
      expect(hierarchySection?.textContent).toContain('div#complex-element')

      // Should show positioning context
      const positioningSection = popup.querySelector('[data-section-id="positioning"]')
      expect(positioningSection).toBeTruthy()
      expect(positioningSection?.textContent).toContain('relative')

      // Should indicate box model information
      const boxModelSection = popup.querySelector('[data-section-id="box-model"]')
      expect(boxModelSection).toBeTruthy()
      expect(boxModelSection?.textContent).toContain('padding')
      expect(boxModelSection?.textContent).toContain('margin')
    })

    test('should identify performance insights and optimization opportunities', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      complexElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      const performanceSection = popup.querySelector('[data-section-id="performance-insights"]')

      expect(performanceSection).toBeTruthy()

      // Should detect heavy effects
      const heavyEffects = popup.querySelector('[data-performance-warning="heavy-effects"]')
      expect(heavyEffects).toBeTruthy()
      expect(heavyEffects?.textContent).toContain('gradient')
      expect(heavyEffects?.textContent).toContain('shadow')

      // Should suggest optimizations
      const optimizations = popup.querySelectorAll('[data-optimization-suggestion]')
      expect(optimizations.length).toBeGreaterThan(0)

      // Should show complexity metrics
      const complexityInfo = popup.querySelector('[data-info-type="complexity"]')
      expect(complexityInfo).toBeTruthy()
      expect(complexityInfo?.textContent).toMatch(/\d+.*classes/)
    })
  })

  describe('React Component Analysis', () => {
    test('should provide comprehensive React component insights', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      reactElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      const reactSection = popup.querySelector('[data-section-id="react-component"]')

      expect(reactSection).toBeTruthy()
      expect(reactSection?.textContent).toContain('DashboardCard')
      expect(reactSection?.textContent).toContain('React component')

      // Should show component type
      const componentType = popup.querySelector('[data-react-type]')
      expect(componentType).toBeTruthy()
      expect(componentType?.textContent).toContain('Function component')

      // Should display component hierarchy
      const componentHierarchy = popup.querySelector('[data-section-id="component-hierarchy"]')
      expect(componentHierarchy).toBeTruthy()
      expect(componentHierarchy?.textContent).toContain('Dashboard')
      expect(componentHierarchy?.textContent).toContain('DashboardCard')
    })

    test('should analyze props with type information and values', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      reactElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      const propsSection = popup.querySelector('[data-section-id="react-props"]')

      expect(propsSection).toBeTruthy()

      // Should show prop types and values
      const propEntries = popup.querySelectorAll('[data-prop-entry]')
      expect(propEntries.length).toBeGreaterThan(0)

      // Should show string props
      const titleProp = popup.querySelector('[data-prop-name="title"]')
      expect(titleProp).toBeTruthy()
      expect(titleProp?.textContent).toContain('Interactive Dashboard Card')

      // Should show boolean props
      const booleanProp = popup.querySelector('[data-prop-name="isActive"]')
      expect(booleanProp).toBeTruthy()
      expect(booleanProp?.textContent).toContain('true')

      // Should show function props
      const functionProp = popup.querySelector('[data-prop-name="onClick"]')
      expect(functionProp).toBeTruthy()
      expect(functionProp?.textContent).toContain('function')

      // Should show object props
      const objectProp = popup.querySelector('[data-prop-name="data"]')
      expect(objectProp).toBeTruthy()
      expect(objectProp?.textContent).toContain('Object')

      // Should allow expanding complex props
      const expandableProps = popup.querySelectorAll('[data-expandable="true"]')
      expect(expandableProps.length).toBeGreaterThan(0)
    })

    test('should analyze component state and hooks information', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      reactElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      const stateSection = popup.querySelector('[data-section-id="react-state"]')

      expect(stateSection).toBeTruthy()

      // Should show state values
      const stateEntries = popup.querySelectorAll('[data-state-entry]')
      expect(stateEntries.length).toBeGreaterThan(0)

      // Should show loading state
      const loadingState = popup.querySelector('[data-state-name="isLoading"]')
      expect(loadingState).toBeTruthy()
      expect(loadingState?.textContent).toContain('false')

      // Should show expanded state
      const expandedState = popup.querySelector('[data-state-name="isExpanded"]')
      expect(expandedState).toBeTruthy()
      expect(expandedState?.textContent).toContain('true')

      // Should show complex state objects
      const userPreferences = popup.querySelector('[data-state-name="userPreferences"]')
      expect(userPreferences).toBeTruthy()
      expect(userPreferences?.textContent).toContain('Object')

      // Should detect and show hooks
      const hooksSection = popup.querySelector('[data-section-id="react-hooks"]')
      if (hooksSection) {
        expect(hooksSection.textContent).toContain('useState')
      }
    })

    test('should provide React performance insights', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      reactElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      const performanceSection = popup.querySelector('[data-section-id="react-performance"]')

      expect(performanceSection).toBeTruthy()

      // Should detect memo opportunities
      const memoSuggestion = popup.querySelector('[data-optimization="memo"]')
      if (memoSuggestion) {
        expect(memoSuggestion.textContent).toContain('React.memo')
      }

      // Should detect callback optimization opportunities
      const callbackSuggestion = popup.querySelector('[data-optimization="callback"]')
      if (callbackSuggestion) {
        expect(callbackSuggestion.textContent).toContain('useCallback')
      }

      // Should show render count or performance metrics
      const renderMetrics = popup.querySelector('[data-performance-metric="renders"]')
      if (renderMetrics) {
        expect(renderMetrics.textContent).toMatch(/\d+/)
      }
    })
  })

  describe('Interactive Features and User Experience', () => {
    test('should provide expandable sections for detailed information', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      complexElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement

      // Should have expandable sections
      const expandableHeaders = popup.querySelectorAll('[data-expandable-header]')
      expect(expandableHeaders.length).toBeGreaterThan(0)

      // Test expanding a section
      const firstExpandable = expandableHeaders[0] as HTMLElement
      firstExpandable.click()
      await new Promise(resolve => setTimeout(resolve, 100))

      // Should show expanded content
      const expandedContent = popup.querySelector('[data-expanded="true"]')
      expect(expandedContent).toBeTruthy()

      // Should have collapse functionality
      firstExpandable.click()
      await new Promise(resolve => setTimeout(resolve, 100))

      const collapsedContent = popup.querySelector('[data-expanded="false"]')
      expect(collapsedContent).toBeTruthy()
    })

    test('should provide copy-to-clipboard functionality for code snippets', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      complexElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement

      // Should have copyable code snippets
      const codeSnippets = popup.querySelectorAll('[data-code-snippet]')
      expect(codeSnippets.length).toBeGreaterThan(0)

      // Should have copy buttons
      const copyButtons = popup.querySelectorAll('[data-copy-button]')
      expect(copyButtons.length).toBeGreaterThan(0)

      // Test copy functionality
      const firstCopyButton = copyButtons[0] as HTMLElement

      // Mock clipboard API
      Object.assign(navigator, {
        clipboard: {
          writeText: jest.fn().mockResolvedValue(undefined)
        }
      })

      firstCopyButton.click()
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(navigator.clipboard.writeText).toHaveBeenCalled()

      // Should show copy feedback
      const copyFeedback = popup.querySelector('[data-copy-feedback]')
      expect(copyFeedback).toBeTruthy()
      expect(copyFeedback?.textContent).toContain('Copied')
    })

    test('should provide filtering and search within popup content', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      complexElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement

      // Should have search/filter capability
      const searchInput = popup.querySelector('[data-popup-search]') as HTMLInputElement
      if (searchInput) {
        expect(searchInput.type).toBe('search')

        // Test filtering
        searchInput.value = 'flex'
        searchInput.dispatchEvent(new Event('input'))
        await new Promise(resolve => setTimeout(resolve, 100))

        // Should highlight matching content
        const highlightedItems = popup.querySelectorAll('[data-search-highlight]')
        expect(highlightedItems.length).toBeGreaterThan(0)

        // Should hide non-matching content
        const hiddenItems = popup.querySelectorAll('[data-search-hidden="true"]')
        expect(hiddenItems.length).toBeGreaterThan(0)
      }

      // Should have category filters
      const categoryFilters = popup.querySelectorAll('[data-category-filter]')
      if (categoryFilters.length > 0) {
        const colorFilter = popup.querySelector('[data-category-filter="colors"]') as HTMLElement
        colorFilter?.click()
        await new Promise(resolve => setTimeout(resolve, 100))

        // Should show only color-related information
        const visibleColorItems = popup.querySelectorAll('[data-category="colors"]:not([hidden])')
        expect(visibleColorItems.length).toBeGreaterThan(0)
      }
    })

    test('should support keyboard navigation within popup', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      complexElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement

      // Should focus on popup when opened
      expect(document.activeElement).toBe(popup)

      // Should have focusable elements
      const focusableElements = popup.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      expect(focusableElements.length).toBeGreaterThan(0)

      // Test tab navigation
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' })
      popup.dispatchEvent(tabEvent)

      // Should move focus to next element
      expect(focusableElements).toContain(document.activeElement)

      // Test Escape key
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' })
      popup.dispatchEvent(escapeEvent)
      await new Promise(resolve => setTimeout(resolve, 100))

      // Should close popup
      const closedPopup = document.querySelector('[data-vibe-popup]')
      expect(closedPopup).toBeNull()
    })

    test('should provide contextual help and documentation links', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      complexElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement

      // Should have help buttons or links
      const helpButtons = popup.querySelectorAll('[data-help-button]')
      expect(helpButtons.length).toBeGreaterThan(0)

      // Should have documentation links
      const docLinks = popup.querySelectorAll('[data-doc-link]')
      expect(docLinks.length).toBeGreaterThan(0)

      // Links should be relevant to content
      docLinks.forEach(link => {
        const href = (link as HTMLAnchorElement).href
        expect(href).toMatch(/tailwindcss\.com|reactjs\.org|developer\.mozilla\.org/)
      })

      // Should have tooltips for technical terms
      const tooltipTriggers = popup.querySelectorAll('[data-tooltip]')
      expect(tooltipTriggers.length).toBeGreaterThan(0)

      // Test tooltip functionality
      const firstTooltip = tooltipTriggers[0] as HTMLElement
      firstTooltip.dispatchEvent(new MouseEvent('mouseenter'))
      await new Promise(resolve => setTimeout(resolve, 100))

      const tooltip = document.querySelector('[data-tooltip-content]')
      expect(tooltip).toBeTruthy()
      expect(tooltip?.textContent).toBeTruthy()
    })
  })

  describe('Accessibility and Form Analysis', () => {
    test('should analyze form elements and accessibility features', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      const emailInput = formElement.querySelector('#email') as HTMLInputElement

      emailInput.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      const formSection = popup.querySelector('[data-section-id="form-analysis"]')

      expect(formSection).toBeTruthy()

      // Should detect form field type
      expect(formSection?.textContent).toContain('email')
      expect(formSection?.textContent).toContain('required')

      // Should show validation rules
      const validationSection = popup.querySelector('[data-section-id="validation"]')
      expect(validationSection).toBeTruthy()
      expect(validationSection?.textContent).toContain('Email format')

      // Should analyze accessibility
      const a11ySection = popup.querySelector('[data-section-id="accessibility"]')
      expect(a11ySection).toBeTruthy()
      expect(a11ySection?.textContent).toContain('label')
      expect(a11ySection?.textContent).toContain('associated')

      // Should check ARIA attributes
      const ariaSection = popup.querySelector('[data-section-id="aria-attributes"]')
      if (ariaSection) {
        expect(ariaSection.textContent).toContain('ARIA')
      }
    })

    test('should provide accessibility recommendations', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      // Create element with accessibility issues
      const problemElement = document.createElement('div')
      problemElement.style.cssText = 'color: #ccc; background-color: #ddd; cursor: pointer;'
      problemElement.textContent = 'Clickable but not accessible'
      testContainer.appendChild(problemElement)

      try {
        problemElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
        await new Promise(resolve => setTimeout(resolve, 100))

        const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
        inspectionIcon.click()
        await new Promise(resolve => setTimeout(resolve, 300))

        const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
        const a11ySection = popup.querySelector('[data-section-id="accessibility"]')

        expect(a11ySection).toBeTruthy()

        // Should detect contrast issues
        const contrastWarning = popup.querySelector('[data-a11y-issue="contrast"]')
        expect(contrastWarning).toBeTruthy()
        expect(contrastWarning?.textContent).toContain('contrast')

        // Should detect missing interactive semantics
        const semanticsWarning = popup.querySelector('[data-a11y-issue="semantics"]')
        expect(semanticsWarning).toBeTruthy()
        expect(semanticsWarning?.textContent).toContain('role')

        // Should provide recommendations
        const recommendations = popup.querySelectorAll('[data-a11y-recommendation]')
        expect(recommendations.length).toBeGreaterThan(0)

        recommendations.forEach(rec => {
          expect(rec.textContent).toMatch(/Add|Use|Consider|Include/)
        })
      } finally {
        testContainer.removeChild(problemElement)
      }
    })

    test('should analyze semantic HTML structure', async () => {
      // This test MUST FAIL initially - integration requirement

      // Create semantic structure
      const semanticElement = document.createElement('article')
      semanticElement.innerHTML = `
        <header class="article-header">
          <h1>Article Title</h1>
          <time datetime="2024-01-15">January 15, 2024</time>
        </header>
        <main class="article-content">
          <p>Article content goes here.</p>
        </main>
        <footer class="article-footer">
          <p>Article footer</p>
        </footer>
      `
      testContainer.appendChild(semanticElement)

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      try {
        semanticElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
        await new Promise(resolve => setTimeout(resolve, 100))

        const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
        inspectionIcon.click()
        await new Promise(resolve => setTimeout(resolve, 300))

        const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
        const semanticsSection = popup.querySelector('[data-section-id="semantics"]')

        expect(semanticsSection).toBeTruthy()

        // Should recognize semantic elements
        expect(semanticsSection?.textContent).toContain('article')
        expect(semanticsSection?.textContent).toContain('Semantic HTML')

        // Should show document outline contribution
        const outlineSection = popup.querySelector('[data-section-id="document-outline"]')
        if (outlineSection) {
          expect(outlineSection.textContent).toContain('heading')
          expect(outlineSection.textContent).toContain('structure')
        }

        // Should validate semantic correctness
        const validationSection = popup.querySelector('[data-section-id="semantic-validation"]')
        if (validationSection) {
          expect(validationSection.textContent).toMatch(/correct|valid|appropriate/)
        }
      } finally {
        testContainer.removeChild(semanticElement)
      }
    })
  })
})