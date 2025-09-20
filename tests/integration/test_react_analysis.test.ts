/**
 * Integration Test: User Story 4 - React Component Analysis
 *
 * "As a React developer, I want to see detailed React component information,
 * so that I can understand component structure, props, state, and performance characteristics."
 *
 * These tests verify comprehensive React-specific analysis and insights.
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals'

// Integration test - these will initially fail until implementations exist
describe('User Story 4: React Component Analysis', () => {
  let testContainer: HTMLDivElement
  let functionComponent: HTMLDivElement
  let classComponent: HTMLDivElement
  let hookComponent: HTMLDivElement
  let memoizedComponent: HTMLDivElement
  let contextComponent: HTMLDivElement

  beforeEach(() => {
    // Create comprehensive React testing environment
    testContainer = document.createElement('div')
    testContainer.id = 'react-analysis-container'
    testContainer.style.cssText = 'position: relative; width: 1400px; height: 1000px; padding: 50px;'
    document.body.appendChild(testContainer)

    // Function component with complex props and state
    functionComponent = document.createElement('div')
    functionComponent.id = 'function-component'
    functionComponent.className = 'user-profile-card bg-white rounded-lg shadow-lg p-6'
    functionComponent.style.cssText = 'position: absolute; top: 50px; left: 50px; width: 300px;'
    functionComponent.innerHTML = `
      <div class="avatar-section flex items-center mb-4">
        <img src="/api/avatar/123" alt="User Avatar" class="w-12 h-12 rounded-full">
        <div class="ml-3">
          <h3 class="font-semibold">John Doe</h3>
          <p class="text-gray-500 text-sm">Software Engineer</p>
        </div>
      </div>
      <div class="stats-section grid grid-cols-2 gap-4">
        <div class="stat">
          <span class="text-2xl font-bold text-blue-600">42</span>
          <p class="text-xs text-gray-500">Projects</p>
        </div>
        <div class="stat">
          <span class="text-2xl font-bold text-green-600">1.2k</span>
          <p class="text-xs text-gray-500">Commits</p>
        </div>
      </div>
    `

    // Mock function component fiber with hooks
    const mockFunctionFiber = {
      memoizedProps: {
        user: {
          id: 'user-123',
          name: 'John Doe',
          role: 'Software Engineer',
          avatar: '/api/avatar/123',
          stats: { projects: 42, commits: 1200, followers: 89 }
        },
        theme: 'light',
        variant: 'card',
        size: 'medium',
        onClick: () => console.log('Profile clicked'),
        onFollow: () => console.log('User followed'),
        className: 'user-profile-card bg-white rounded-lg shadow-lg p-6',
        isFollowing: false,
        showStats: true,
        editable: false
      },
      memoizedState: {
        // useState hooks
        memoizedState: false, // isExpanded
        queue: { dispatch: () => {} },
        next: {
          memoizedState: 'loading', // status
          queue: { dispatch: () => {} },
          next: {
            memoizedState: null, // error
            queue: { dispatch: () => {} },
            next: {
              // useEffect hook
              memoizedState: () => console.log('Effect cleanup'),
              deps: ['user.id'],
              next: {
                // useCallback hook
                memoizedState: () => console.log('Memoized callback'),
                deps: ['onClick', 'user.id'],
                next: {
                  // useMemo hook
                  memoizedState: { computed: 'value' },
                  deps: ['user.stats'],
                  next: null
                }
              }
            }
          }
        }
      },
      type: {
        name: 'UserProfileCard',
        displayName: 'UserProfileCard',
        $$typeof: Symbol.for('react.element')
      },
      key: 'user-profile-123',
      return: {
        type: { name: 'UserDashboard' },
        memoizedProps: { layout: 'grid' }
      },
      child: {
        type: { name: 'AvatarSection' },
        sibling: {
          type: { name: 'StatsSection' }
        }
      }
    }
    ;(functionComponent as any).__reactFiber$ = mockFunctionFiber

    // Class component
    classComponent = document.createElement('div')
    classComponent.id = 'class-component'
    classComponent.className = 'notification-panel bg-gray-50 border rounded p-4'
    classComponent.style.cssText = 'position: absolute; top: 50px; left: 400px; width: 280px;'
    classComponent.innerHTML = `
      <h4 class="font-medium mb-2">Notifications</h4>
      <div class="notification-list space-y-2">
        <div class="notification-item p-2 bg-white rounded border-l-4 border-blue-500">
          <p class="text-sm">New comment on your post</p>
        </div>
      </div>
    `

    const mockClassFiber = {
      memoizedProps: {
        notifications: [
          { id: 1, type: 'comment', message: 'New comment on your post', read: false },
          { id: 2, type: 'like', message: 'Someone liked your post', read: true }
        ],
        maxNotifications: 10,
        autoRefresh: true,
        onNotificationClick: () => {},
        onMarkAllRead: () => {},
        className: 'notification-panel bg-gray-50 border rounded p-4'
      },
      memoizedState: {
        unreadCount: 1,
        isPolling: true,
        lastFetch: Date.now(),
        filters: { type: 'all', read: false }
      },
      type: class NotificationPanel {},
      key: 'notifications-panel',
      return: {
        type: { name: 'AppLayout' }
      }
    }
    ;(classComponent as any).__reactFiber$ = mockClassFiber

    // Component with complex hooks
    hookComponent = document.createElement('div')
    hookComponent.id = 'hook-component'
    hookComponent.className = 'data-table-wrapper'
    hookComponent.style.cssText = 'position: absolute; top: 400px; left: 50px; width: 600px;'
    hookComponent.innerHTML = `
      <div class="table-controls mb-4 flex justify-between">
        <input type="search" placeholder="Search..." class="border rounded px-2 py-1">
        <select class="border rounded px-2 py-1">
          <option>Sort by Name</option>
          <option>Sort by Date</option>
        </select>
      </div>
      <table class="w-full border-collapse">
        <thead><tr><th>Name</th><th>Date</th><th>Status</th></tr></thead>
        <tbody><tr><td>Item 1</td><td>2024-01-01</td><td>Active</td></tr></tbody>
      </table>
    `

    const mockHookFiber = {
      memoizedProps: {
        data: [{ id: 1, name: 'Item 1', date: '2024-01-01', status: 'active' }],
        columns: [{ key: 'name', label: 'Name' }, { key: 'date', label: 'Date' }],
        sortable: true,
        filterable: true,
        pagination: { page: 1, pageSize: 10, total: 100 }
      },
      memoizedState: {
        // Multiple useState hooks
        memoizedState: '', // searchTerm
        next: {
          memoizedState: { field: 'name', direction: 'asc' }, // sortConfig
          next: {
            memoizedState: [], // selectedRows
            next: {
              memoizedState: false, // isLoading
              next: {
                // useReducer hook
                memoizedState: {
                  filters: {},
                  pagination: { page: 1, pageSize: 10 },
                  selection: []
                },
                next: {
                  // useRef hooks
                  memoizedState: { current: null }, // tableRef
                  next: {
                    memoizedState: { current: null }, // searchInputRef
                    next: {
                      // useContext hook
                      memoizedState: { theme: 'light', locale: 'en' },
                      next: {
                        // Custom hook
                        memoizedState: {
                          data: [],
                          loading: false,
                          error: null,
                          refetch: () => {}
                        },
                        next: null
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      type: {
        name: 'DataTable',
        displayName: 'DataTable'
      }
    }
    ;(hookComponent as any).__reactFiber$ = mockHookFiber

    // Memoized component
    memoizedComponent = document.createElement('div')
    memoizedComponent.id = 'memoized-component'
    memoizedComponent.className = 'chart-widget bg-white p-4 rounded shadow'
    memoizedComponent.style.cssText = 'position: absolute; top: 400px; left: 700px; width: 300px;'
    memoizedComponent.innerHTML = `
      <h5 class="font-medium mb-2">Performance Chart</h5>
      <div class="chart-area h-32 bg-gray-100 rounded flex items-center justify-center">
        <span class="text-gray-500">Chart Placeholder</span>
      </div>
    `

    const mockMemoFiber = {
      memoizedProps: {
        data: Array.from({ length: 100 }, (_, i) => ({ x: i, y: Math.random() * 100 })),
        type: 'line',
        config: {
          responsive: true,
          animation: { duration: 300 },
          scales: { x: { type: 'linear' }, y: { type: 'linear' } }
        },
        onDataPointClick: () => {},
        width: 300,
        height: 200,
        theme: 'light'
      },
      type: {
        $$typeof: Symbol.for('react.memo'),
        type: {
          name: 'ChartWidget',
          displayName: 'ChartWidget'
        },
        compare: (prevProps: any, nextProps: any) => {
          return JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data)
        }
      },
      return: {
        type: { name: 'DashboardGrid' }
      }
    }
    ;(memoizedComponent as any).__reactFiber$ = mockMemoFiber

    // Context provider component
    contextComponent = document.createElement('div')
    contextComponent.id = 'context-component'
    contextComponent.className = 'theme-provider'
    contextComponent.style.cssText = 'position: absolute; top: 700px; left: 50px; width: 400px;'
    contextComponent.innerHTML = `
      <div class="theme-controls p-4 border rounded">
        <h6 class="font-medium mb-2">Theme Settings</h6>
        <button class="btn mr-2">Light</button>
        <button class="btn">Dark</button>
      </div>
    `

    const mockContextFiber = {
      memoizedProps: {
        theme: 'light',
        accentColor: '#3b82f6',
        fontSize: 'medium',
        children: ['Theme controls content']
      },
      memoizedState: {
        theme: 'light',
        preferences: {
          accentColor: '#3b82f6',
          fontSize: 'medium',
          animations: true,
          highContrast: false
        }
      },
      type: {
        name: 'ThemeProvider',
        displayName: 'ThemeProvider',
        _context: {
          displayName: 'ThemeContext',
          _currentValue: {
            theme: 'light',
            setTheme: () => {},
            preferences: {}
          }
        }
      },
      child: {
        type: { name: 'ThemeControls' },
        child: {
          type: { name: 'Button' }
        }
      }
    }
    ;(contextComponent as any).__reactFiber$ = mockContextFiber

    testContainer.appendChild(functionComponent)
    testContainer.appendChild(classComponent)
    testContainer.appendChild(hookComponent)
    testContainer.appendChild(memoizedComponent)
    testContainer.appendChild(contextComponent)
  })

  afterEach(() => {
    document.body.removeChild(testContainer)

    // Clean up inspection UI
    const inspectionElements = document.querySelectorAll('[data-vibe-popup], [data-vibe-inspection-icon]')
    inspectionElements.forEach(el => el.remove())
  })

  describe('Component Type Detection and Analysis', () => {
    test('should detect and analyze function components comprehensively', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      functionComponent.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      const reactSection = popup.querySelector('[data-section-id="react-component"]')

      expect(reactSection).toBeTruthy()
      expect(reactSection?.textContent).toContain('UserProfileCard')
      expect(reactSection?.textContent).toContain('Function Component')

      // Should detect React element type
      const componentType = popup.querySelector('[data-component-type="function"]')
      expect(componentType).toBeTruthy()

      // Should show component metadata
      const metadata = popup.querySelector('[data-section-id="component-metadata"]')
      expect(metadata).toBeTruthy()
      expect(metadata?.textContent).toContain('React')
      expect(metadata?.textContent).toContain('Function')

      // Should indicate if component uses hooks
      const hooksIndicator = popup.querySelector('[data-uses-hooks="true"]')
      expect(hooksIndicator).toBeTruthy()
    })

    test('should detect and analyze class components', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      classComponent.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      const reactSection = popup.querySelector('[data-section-id="react-component"]')

      expect(reactSection).toBeTruthy()
      expect(reactSection?.textContent).toContain('NotificationPanel')
      expect(reactSection?.textContent).toContain('Class Component')

      // Should detect class component type
      const componentType = popup.querySelector('[data-component-type="class"]')
      expect(componentType).toBeTruthy()

      // Should show lifecycle methods information
      const lifecycleSection = popup.querySelector('[data-section-id="lifecycle-methods"]')
      if (lifecycleSection) {
        expect(lifecycleSection.textContent).toContain('lifecycle')
      }

      // Should indicate no hooks usage
      const hooksIndicator = popup.querySelector('[data-uses-hooks="false"]')
      expect(hooksIndicator).toBeTruthy()
    })

    test('should detect memoized components and optimization patterns', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      memoizedComponent.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      const optimizationSection = popup.querySelector('[data-section-id="optimization"]')

      expect(optimizationSection).toBeTruthy()

      // Should detect React.memo usage
      const memoDetection = popup.querySelector('[data-optimization="memo"]')
      expect(memoDetection).toBeTruthy()
      expect(memoDetection?.textContent).toContain('React.memo')

      // Should show memo comparison function if present
      const memoComparison = popup.querySelector('[data-memo-comparison]')
      if (memoComparison) {
        expect(memoComparison.textContent).toContain('custom comparison')
      }

      // Should analyze optimization effectiveness
      const optimizationAnalysis = popup.querySelector('[data-section-id="optimization-analysis"]')
      expect(optimizationAnalysis).toBeTruthy()
      expect(optimizationAnalysis?.textContent).toMatch(/effective|optimized|performance/)
    })

    test('should detect context providers and consumers', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      contextComponent.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      const contextSection = popup.querySelector('[data-section-id="react-context"]')

      expect(contextSection).toBeTruthy()

      // Should detect context provider
      const contextProvider = popup.querySelector('[data-context-role="provider"]')
      expect(contextProvider).toBeTruthy()
      expect(contextProvider?.textContent).toContain('ThemeContext')

      // Should show context value
      const contextValue = popup.querySelector('[data-context-value]')
      expect(contextValue).toBeTruthy()
      expect(contextValue?.textContent).toContain('theme')
      expect(contextValue?.textContent).toContain('light')

      // Should list context consumers
      const consumersSection = popup.querySelector('[data-section-id="context-consumers"]')
      if (consumersSection) {
        expect(consumersSection.textContent).toContain('consumer')
      }
    })
  })

  describe('Props Analysis and Visualization', () => {
    test('should provide comprehensive props analysis with type detection', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      functionComponent.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      const propsSection = popup.querySelector('[data-section-id="react-props"]')

      expect(propsSection).toBeTruthy()

      // Should categorize props by type
      const stringProps = popup.querySelectorAll('[data-prop-type="string"]')
      expect(stringProps.length).toBeGreaterThan(0)

      const objectProps = popup.querySelectorAll('[data-prop-type="object"]')
      expect(objectProps.length).toBeGreaterThan(0)

      const functionProps = popup.querySelectorAll('[data-prop-type="function"]')
      expect(functionProps.length).toBeGreaterThan(0)

      const booleanProps = popup.querySelectorAll('[data-prop-type="boolean"]')
      expect(booleanProps.length).toBeGreaterThan(0)

      // Should show prop values for simple types
      const themeProp = popup.querySelector('[data-prop-name="theme"]')
      expect(themeProp).toBeTruthy()
      expect(themeProp?.textContent).toContain('light')

      // Should indicate complex props can be expanded
      const userProp = popup.querySelector('[data-prop-name="user"]')
      expect(userProp).toBeTruthy()
      expect(userProp?.getAttribute('data-expandable')).toBe('true')
    })

    test('should provide interactive props exploration', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      functionComponent.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement

      // Should allow expanding complex props
      const expandableUserProp = popup.querySelector('[data-prop-name="user"][data-expandable="true"]') as HTMLElement
      expandableUserProp.click()
      await new Promise(resolve => setTimeout(resolve, 100))

      // Should show expanded object structure
      const expandedContent = popup.querySelector('[data-prop-expanded="user"]')
      expect(expandedContent).toBeTruthy()
      expect(expandedContent?.textContent).toContain('id')
      expect(expandedContent?.textContent).toContain('user-123')
      expect(expandedContent?.textContent).toContain('name')
      expect(expandedContent?.textContent).toContain('John Doe')

      // Should show nested object properties
      const statsProperty = popup.querySelector('[data-nested-prop="stats"]')
      if (statsProperty) {
        expect(statsProperty.textContent).toContain('projects')
        expect(statsProperty.textContent).toContain('42')
      }

      // Should provide JSON view option
      const jsonViewButton = popup.querySelector('[data-json-view="user"]') as HTMLElement
      if (jsonViewButton) {
        jsonViewButton.click()
        await new Promise(resolve => setTimeout(resolve, 100))

        const jsonView = popup.querySelector('[data-json-content]')
        expect(jsonView).toBeTruthy()
        expect(jsonView?.textContent).toMatch(/\{[\s\S]*\}/)
      }
    })

    test('should detect prop validation and TypeScript types', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      functionComponent.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      const typesSection = popup.querySelector('[data-section-id="prop-types"]')

      if (typesSection) {
        // Should show TypeScript interface or PropTypes
        expect(typesSection.textContent).toMatch(/interface|PropTypes|type/)

        // Should indicate required vs optional props
        const requiredProps = popup.querySelectorAll('[data-prop-required="true"]')
        const optionalProps = popup.querySelectorAll('[data-prop-required="false"]')

        expect(requiredProps.length + optionalProps.length).toBeGreaterThan(0)
      }

      // Should validate prop types against actual values
      const typeValidation = popup.querySelector('[data-section-id="prop-validation"]')
      if (typeValidation) {
        const validationIssues = popup.querySelectorAll('[data-validation-issue]')
        // Should show issues if any exist
        validationIssues.forEach(issue => {
          expect(issue.textContent).toMatch(/expected|received|type mismatch/)
        })
      }
    })

    test('should analyze prop drilling and optimization opportunities', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      functionComponent.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      const optimizationSection = popup.querySelector('[data-section-id="props-optimization"]')

      if (optimizationSection) {
        // Should detect prop drilling opportunities
        const propDrillingWarning = popup.querySelector('[data-optimization="prop-drilling"]')
        if (propDrillingWarning) {
          expect(propDrillingWarning.textContent).toContain('drilling')
          expect(propDrillingWarning.textContent).toMatch(/context|redux|state management/)
        }

        // Should suggest memo optimizations
        const memoSuggestion = popup.querySelector('[data-optimization="prop-memo"]')
        if (memoSuggestion) {
          expect(memoSuggestion.textContent).toContain('React.memo')
        }

        // Should identify stable vs unstable props
        const stableProps = popup.querySelectorAll('[data-prop-stability="stable"]')
        const unstableProps = popup.querySelectorAll('[data-prop-stability="unstable"]')

        expect(stableProps.length + unstableProps.length).toBeGreaterThan(0)
      }
    })
  })

  describe('State and Hooks Analysis', () => {
    test('should analyze useState hooks comprehensively', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      hookComponent.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      const hooksSection = popup.querySelector('[data-section-id="react-hooks"]')

      expect(hooksSection).toBeTruthy()

      // Should detect useState hooks
      const useStateHooks = popup.querySelectorAll('[data-hook-type="useState"]')
      expect(useStateHooks.length).toBeGreaterThan(0)

      // Should show state values
      const searchTermState = popup.querySelector('[data-state-name="searchTerm"]')
      expect(searchTermState).toBeTruthy()
      expect(searchTermState?.textContent).toContain('""')

      const sortConfigState = popup.querySelector('[data-state-name="sortConfig"]')
      expect(sortConfigState).toBeTruthy()
      expect(sortConfigState?.textContent).toContain('field')
      expect(sortConfigState?.textContent).toContain('name')

      // Should indicate state mutability
      const mutableStates = popup.querySelectorAll('[data-state-mutable="true"]')
      expect(mutableStates.length).toBeGreaterThan(0)
    })

    test('should analyze useEffect and side effect hooks', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      functionComponent.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement

      // Should detect useEffect hooks
      const useEffectHooks = popup.querySelectorAll('[data-hook-type="useEffect"]')
      expect(useEffectHooks.length).toBeGreaterThan(0)

      // Should show dependency arrays
      const effectDependencies = popup.querySelector('[data-effect-deps]')
      expect(effectDependencies).toBeTruthy()
      expect(effectDependencies?.textContent).toContain('user.id')

      // Should indicate cleanup functions
      const cleanupFunctions = popup.querySelectorAll('[data-has-cleanup="true"]')
      expect(cleanupFunctions.length).toBeGreaterThan(0)

      // Should warn about dependency issues
      const dependencyWarnings = popup.querySelectorAll('[data-dependency-warning]')
      dependencyWarnings.forEach(warning => {
        expect(warning.textContent).toMatch(/dependency|missing|stale/)
      })
    })

    test('should analyze performance hooks (useMemo, useCallback)', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      functionComponent.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement

      // Should detect useMemo hooks
      const useMemoHooks = popup.querySelectorAll('[data-hook-type="useMemo"]')
      expect(useMemoHooks.length).toBeGreaterThan(0)

      // Should detect useCallback hooks
      const useCallbackHooks = popup.querySelectorAll('[data-hook-type="useCallback"]')
      expect(useCallbackHooks.length).toBeGreaterThan(0)

      // Should show memoized values
      const memoizedValue = popup.querySelector('[data-memoized-value]')
      expect(memoizedValue).toBeTruthy()
      expect(memoizedValue?.textContent).toContain('computed')

      // Should analyze optimization effectiveness
      const optimizationAnalysis = popup.querySelector('[data-section-id="hook-optimization"]')
      if (optimizationAnalysis) {
        // Should identify over-optimization
        const overOptimization = popup.querySelector('[data-optimization-issue="unnecessary"]')
        if (overOptimization) {
          expect(overOptimization.textContent).toContain('unnecessary')
        }

        // Should suggest missing optimizations
        const missedOptimizations = popup.querySelectorAll('[data-optimization-suggestion]')
        missedOptimizations.forEach(suggestion => {
          expect(suggestion.textContent).toMatch(/useMemo|useCallback|optimization/)
        })
      }
    })

    test('should analyze useRef and DOM manipulation hooks', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      hookComponent.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement

      // Should detect useRef hooks
      const useRefHooks = popup.querySelectorAll('[data-hook-type="useRef"]')
      expect(useRefHooks.length).toBeGreaterThan(0)

      // Should show ref purposes
      const domRefs = popup.querySelectorAll('[data-ref-type="dom"]')
      const valueRefs = popup.querySelectorAll('[data-ref-type="value"]')

      expect(domRefs.length + valueRefs.length).toBeGreaterThan(0)

      // Should indicate current ref values
      const refValues = popup.querySelectorAll('[data-ref-current]')
      refValues.forEach(refValue => {
        expect(refValue.textContent).toMatch(/null|Element|function|object/)
      })

      // Should warn about ref misuse
      const refWarnings = popup.querySelectorAll('[data-ref-warning]')
      refWarnings.forEach(warning => {
        expect(warning.textContent).toMatch(/render|side effect|mutation/)
      })
    })

    test('should analyze custom hooks and hook composition', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      hookComponent.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement

      // Should detect custom hooks
      const customHooks = popup.querySelectorAll('[data-hook-type="custom"]')
      expect(customHooks.length).toBeGreaterThan(0)

      // Should show custom hook return values
      const customHookValue = popup.querySelector('[data-custom-hook-return]')
      expect(customHookValue).toBeTruthy()
      expect(customHookValue?.textContent).toContain('data')
      expect(customHookValue?.textContent).toContain('loading')
      expect(customHookValue?.textContent).toContain('error')

      // Should analyze hook composition
      const hookComposition = popup.querySelector('[data-section-id="hook-composition"]')
      if (hookComposition) {
        expect(hookComposition.textContent).toContain('composition')
        expect(hookComposition.textContent).toMatch(/hook.*hook/)
      }

      // Should suggest hook extraction opportunities
      const hookExtractionSuggestions = popup.querySelectorAll('[data-suggestion="extract-hook"]')
      hookExtractionSuggestions.forEach(suggestion => {
        expect(suggestion.textContent).toMatch(/extract|custom hook|reusable/)
      })
    })
  })

  describe('Component Hierarchy and Architecture Analysis', () => {
    test('should provide comprehensive component tree visualization', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      functionComponent.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      const hierarchySection = popup.querySelector('[data-section-id="component-hierarchy"]')

      expect(hierarchySection).toBeTruthy()

      // Should show parent components
      const parentComponents = popup.querySelectorAll('[data-hierarchy-level="parent"]')
      expect(parentComponents.length).toBeGreaterThan(0)

      const parentComponent = parentComponents[0]
      expect(parentComponent.textContent).toContain('UserDashboard')

      // Should show current component
      const currentComponent = popup.querySelector('[data-hierarchy-level="current"]')
      expect(currentComponent).toBeTruthy()
      expect(currentComponent?.textContent).toContain('UserProfileCard')

      // Should show child components
      const childComponents = popup.querySelectorAll('[data-hierarchy-level="child"]')
      expect(childComponents.length).toBeGreaterThan(0)

      expect(childComponents[0].textContent).toContain('AvatarSection')
      expect(childComponents[1].textContent).toContain('StatsSection')

      // Should show component nesting depth
      const nestingDepth = popup.querySelector('[data-nesting-depth]')
      expect(nestingDepth).toBeTruthy()
      expect(nestingDepth?.textContent).toMatch(/\d+/)
    })

    test('should analyze component composition patterns', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      functionComponent.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      const patternsSection = popup.querySelector('[data-section-id="composition-patterns"]')

      if (patternsSection) {
        // Should detect render props pattern
        const renderPropsPattern = popup.querySelector('[data-pattern="render-props"]')
        if (renderPropsPattern) {
          expect(renderPropsPattern.textContent).toContain('render props')
        }

        // Should detect compound components
        const compoundPattern = popup.querySelector('[data-pattern="compound"]')
        if (compoundPattern) {
          expect(compoundPattern.textContent).toContain('compound')
        }

        // Should detect higher-order components
        const hocPattern = popup.querySelector('[data-pattern="hoc"]')
        if (hocPattern) {
          expect(hocPattern.textContent).toContain('Higher-order')
        }

        // Should detect component composition
        const compositionScore = popup.querySelector('[data-composition-score]')
        if (compositionScore) {
          expect(compositionScore.textContent).toMatch(/\d+/)
        }
      }
    })

    test('should detect render optimization opportunities', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      functionComponent.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      const renderOptimization = popup.querySelector('[data-section-id="render-optimization"]')

      expect(renderOptimization).toBeTruthy()

      // Should suggest React.memo for stable props
      const memoSuggestion = popup.querySelector('[data-optimization="component-memo"]')
      if (memoSuggestion) {
        expect(memoSuggestion.textContent).toContain('React.memo')
      }

      // Should identify expensive renders
      const expensiveRenders = popup.querySelectorAll('[data-render-complexity="high"]')
      expensiveRenders.forEach(render => {
        expect(render.textContent).toMatch(/expensive|complex|optimization/)
      })

      // Should suggest component splitting
      const splittingSuggestions = popup.querySelectorAll('[data-suggestion="split-component"]')
      splittingSuggestions.forEach(suggestion => {
        expect(suggestion.textContent).toMatch(/split|extract|smaller/)
      })

      // Should show render frequency analysis
      const renderFrequency = popup.querySelector('[data-render-frequency]')
      if (renderFrequency) {
        expect(renderFrequency.textContent).toMatch(/\d+.*render/)
      }
    })

    test('should analyze component coupling and dependencies', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      functionComponent.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      const couplingSection = popup.querySelector('[data-section-id="component-coupling"]')

      if (couplingSection) {
        // Should analyze prop dependencies
        const propDependencies = popup.querySelectorAll('[data-dependency-type="prop"]')
        expect(propDependencies.length).toBeGreaterThan(0)

        // Should analyze context dependencies
        const contextDependencies = popup.querySelectorAll('[data-dependency-type="context"]')
        contextDependencies.forEach(dep => {
          expect(dep.textContent).toMatch(/context|provider/)
        })

        // Should show coupling score
        const couplingScore = popup.querySelector('[data-coupling-score]')
        if (couplingScore) {
          expect(couplingScore.textContent).toMatch(/low|medium|high/)
        }

        // Should suggest decoupling strategies
        const decouplingStrategies = popup.querySelectorAll('[data-suggestion="decouple"]')
        decouplingStrategies.forEach(strategy => {
          expect(strategy.textContent).toMatch(/interface|abstraction|injection/)
        })
      }
    })
  })

  describe('Performance Analysis and Optimization', () => {
    test('should provide comprehensive React performance insights', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      functionComponent.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      const performanceSection = popup.querySelector('[data-section-id="react-performance"]')

      expect(performanceSection).toBeTruthy()

      // Should show render performance metrics
      const renderMetrics = popup.querySelector('[data-performance-metric="render-time"]')
      if (renderMetrics) {
        expect(renderMetrics.textContent).toMatch(/\d+ms/)
      }

      // Should identify performance bottlenecks
      const bottlenecks = popup.querySelectorAll('[data-performance-issue]')
      bottlenecks.forEach(bottleneck => {
        expect(bottleneck.textContent).toMatch(/slow|bottleneck|optimization/)
      })

      // Should suggest specific optimizations
      const optimizations = popup.querySelectorAll('[data-performance-suggestion]')
      expect(optimizations.length).toBeGreaterThan(0)

      optimizations.forEach(opt => {
        expect(opt.textContent).toMatch(/memo|callback|virtualization|lazy/)
      })

      // Should show bundle impact
      const bundleImpact = popup.querySelector('[data-bundle-impact]')
      if (bundleImpact) {
        expect(bundleImpact.textContent).toMatch(/kb|size|import/)
      }
    })

    test('should analyze re-render patterns and causes', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      hookComponent.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      const rerenderSection = popup.querySelector('[data-section-id="rerender-analysis"]')

      if (rerenderSection) {
        // Should identify rerender triggers
        const rerenderTriggers = popup.querySelectorAll('[data-rerender-trigger]')
        expect(rerenderTriggers.length).toBeGreaterThan(0)

        rerenderTriggers.forEach(trigger => {
          expect(trigger.textContent).toMatch(/state|props|context|parent/)
        })

        // Should suggest rerender optimizations
        const rerenderOptimizations = popup.querySelectorAll('[data-rerender-optimization]')
        rerenderOptimizations.forEach(opt => {
          expect(opt.textContent).toMatch(/memo|split|stable|callback/)
        })

        // Should show rerender frequency
        const rerenderFrequency = popup.querySelector('[data-rerender-frequency]')
        if (rerenderFrequency) {
          expect(rerenderFrequency.textContent).toMatch(/\d+/)
        }
      }
    })

    test('should provide memory usage analysis', async () => {
      // This test MUST FAIL initially - integration requirement

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      hookComponent.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 100))

      const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
      inspectionIcon.click()
      await new Promise(resolve => setTimeout(resolve, 300))

      const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
      const memorySection = popup.querySelector('[data-section-id="memory-analysis"]')

      if (memorySection) {
        // Should detect memory leaks
        const memoryLeaks = popup.querySelectorAll('[data-memory-issue="leak"]')
        memoryLeaks.forEach(leak => {
          expect(leak.textContent).toMatch(/leak|cleanup|listener/)
        })

        // Should analyze state size
        const stateSize = popup.querySelector('[data-state-size]')
        if (stateSize) {
          expect(stateSize.textContent).toMatch(/\d+.*bytes?|kb/)
        }

        // Should suggest memory optimizations
        const memoryOptimizations = popup.querySelectorAll('[data-memory-optimization]')
        memoryOptimizations.forEach(opt => {
          expect(opt.textContent).toMatch(/cleanup|weak|dispose|unmount/)
        })
      }
    })

    test('should integrate with React DevTools profiler data', async () => {
      // This test MUST FAIL initially - integration requirement

      // Mock React DevTools hook
      ;(globalThis as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
        renderers: new Map(),
        profilerStore: {
          getCommitData: () => ({
            duration: 15.5,
            interactions: [],
            timestamp: Date.now()
          }),
          getProfilingData: () => ({
            rootID: 1,
            commits: [{ duration: 15.5, timestamp: Date.now() }]
          })
        }
      }

      document.documentElement.setAttribute('data-vibe-mode', 'true')

      try {
        functionComponent.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
        await new Promise(resolve => setTimeout(resolve, 100))

        const inspectionIcon = document.querySelector('[data-vibe-inspection-icon]') as HTMLElement
        inspectionIcon.click()
        await new Promise(resolve => setTimeout(resolve, 300))

        const popup = document.querySelector('[data-vibe-popup]') as HTMLElement
        const profilerSection = popup.querySelector('[data-section-id="profiler-data"]')

        if (profilerSection) {
          // Should show profiler metrics
          const profilerMetrics = popup.querySelector('[data-profiler-duration]')
          expect(profilerMetrics).toBeTruthy()
          expect(profilerMetrics?.textContent).toContain('15.5')

          // Should link to DevTools
          const devToolsLink = popup.querySelector('[data-devtools-link]')
          if (devToolsLink) {
            expect(devToolsLink.textContent).toMatch(/DevTools|profiler/)
          }
        }
      } finally {
        delete (globalThis as any).__REACT_DEVTOOLS_GLOBAL_HOOK__
      }
    })
  })
})