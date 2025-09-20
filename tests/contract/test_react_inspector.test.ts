/**
 * Contract Test: IReactInspector Interface
 *
 * These tests MUST FAIL initially (TDD approach) and define the contract
 * that any IReactInspector implementation must satisfy.
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals'
import type { IReactInspector } from '@/specs/019-vibe-mode-quick/contracts/inspection-api'
import type { ReactComponentInfo, HookInfo } from '@/types/vibe-mode'

// Mock implementation for testing (will be replaced with real implementation)
class MockReactInspector implements IReactInspector {
  inspectComponent(element: Element): ReactComponentInfo | null {
    throw new Error('Not implemented - this test should fail initially')
  }

  getHookState(element: Element): HookInfo[] {
    throw new Error('Not implemented - this test should fail initially')
  }

  getComponentHierarchy(element: Element): ReactComponentInfo[] {
    throw new Error('Not implemented - this test should fail initially')
  }

  detectReactVersion(): string | null {
    throw new Error('Not implemented - this test should fail initially')
  }

  isReactElement(element: Element): boolean {
    throw new Error('Not implemented - this test should fail initially')
  }
}

describe('IReactInspector Contract', () => {
  let inspector: IReactInspector
  let testElement: HTMLDivElement
  let reactElement: HTMLDivElement
  let nonReactElement: HTMLDivElement

  beforeEach(() => {
    inspector = new MockReactInspector()

    // Create non-React test element
    testElement = document.createElement('div')
    testElement.id = 'test-element'
    testElement.className = 'test-class'
    testElement.textContent = 'Non-React element'
    document.body.appendChild(testElement)

    // Create mock React element with fiber
    reactElement = document.createElement('div')
    reactElement.id = 'react-element'
    reactElement.className = 'react-component'
    reactElement.textContent = 'React component'

    // Mock React fiber data
    const mockFiber = {
      memoizedProps: {
        title: 'Test Component',
        isActive: true,
        onClick: () => {},
        children: 'Test content'
      },
      memoizedState: {
        count: 5,
        isLoading: false,
        user: { name: 'John', id: 123 }
      },
      type: {
        name: 'TestComponent',
        displayName: 'TestComponent'
      },
      key: 'test-key',
      return: {
        type: {
          name: 'ParentComponent'
        },
        memoizedProps: { parentProp: 'value' }
      },
      child: {
        type: {
          name: 'ChildComponent'
        },
        memoizedProps: { childProp: 'child-value' }
      }
    }

    // Add React Fiber properties (React 16+)
    ;(reactElement as any).__reactInternalInstance$ = mockFiber
    ;(reactElement as any).__reactFiber$ = mockFiber

    document.body.appendChild(reactElement)

    // Create non-React element
    nonReactElement = document.createElement('span')
    nonReactElement.id = 'non-react'
    nonReactElement.textContent = 'Not a React element'
    document.body.appendChild(nonReactElement)
  })

  afterEach(() => {
    document.body.removeChild(testElement)
    document.body.removeChild(reactElement)
    document.body.removeChild(nonReactElement)
  })

  describe('inspectComponent method', () => {
    test('should extract React component information from element', () => {
      // This test MUST FAIL initially - TDD requirement
      const result = inspector.inspectComponent(reactElement)

      expect(result).toBeDefined()
      expect(result?.componentName).toBe('TestComponent')
      expect(result?.props).toBeDefined()
      expect(result?.props?.title).toBe('Test Component')
      expect(result?.props?.isActive).toBe(true)
      expect(result?.state).toBeDefined()
      expect(result?.state?.count).toBe(5)
      expect(result?.state?.isLoading).toBe(false)
    })

    test('should identify component type correctly', () => {
      // This test MUST FAIL initially - TDD requirement
      const result = inspector.inspectComponent(reactElement)

      expect(result).toBeDefined()
      expect(typeof result?.isClassComponent).toBe('boolean')
      expect(typeof result?.isFunctionComponent).toBe('boolean')
      expect(result?.isClassComponent || result?.isFunctionComponent).toBe(true)
    })

    test('should extract component display name when available', () => {
      // This test MUST FAIL initially - TDD requirement
      const result = inspector.inspectComponent(reactElement)

      expect(result).toBeDefined()
      expect(result?.displayName).toBe('TestComponent')
    })

    test('should handle components without display name', () => {
      // This test MUST FAIL initially - TDD requirement
      // Create element with anonymous component
      const anonymousElement = document.createElement('div')
      const anonymousFiber = {
        memoizedProps: { test: 'value' },
        memoizedState: null,
        type: function() {}, // Anonymous function component
        key: null
      }
      ;(anonymousElement as any).__reactFiber$ = anonymousFiber
      document.body.appendChild(anonymousElement)

      try {
        const result = inspector.inspectComponent(anonymousElement)

        expect(result).toBeDefined()
        expect(result?.componentName).toBeUndefined()
        expect(result?.props?.test).toBe('value')
      } finally {
        document.body.removeChild(anonymousElement)
      }
    })

    test('should return null for non-React elements', () => {
      // This test MUST FAIL initially - TDD requirement
      const result = inspector.inspectComponent(nonReactElement)

      expect(result).toBeNull()
    })

    test('should handle elements with corrupted fiber data', () => {
      // This test MUST FAIL initially - TDD requirement
      const corruptedElement = document.createElement('div')
      ;(corruptedElement as any).__reactFiber$ = { corrupted: true }
      document.body.appendChild(corruptedElement)

      try {
        const result = inspector.inspectComponent(corruptedElement)

        // Should either return null or handle gracefully
        expect(result === null || typeof result === 'object').toBe(true)
      } finally {
        document.body.removeChild(corruptedElement)
      }
    })

    test('should handle circular references in props/state', () => {
      // This test MUST FAIL initially - TDD requirement
      const circularElement = document.createElement('div')
      const circularObj: any = { name: 'circular' }
      circularObj.self = circularObj

      const circularFiber = {
        memoizedProps: { circular: circularObj },
        memoizedState: { circular: circularObj },
        type: { name: 'CircularComponent' }
      }
      ;(circularElement as any).__reactFiber$ = circularFiber
      document.body.appendChild(circularElement)

      try {
        const result = inspector.inspectComponent(circularElement)

        expect(result).toBeDefined()
        expect(result?.componentName).toBe('CircularComponent')
        // Should handle circular references without crashing
        expect(result?.props).toBeDefined()
        expect(result?.state).toBeDefined()
      } finally {
        document.body.removeChild(circularElement)
      }
    })

    test('should extract key property when available', () => {
      // This test MUST FAIL initially - TDD requirement
      const result = inspector.inspectComponent(reactElement)

      expect(result).toBeDefined()
      expect(result?.fiberNode?.key).toBe('test-key')
    })

    test('should handle invalid elements gracefully', () => {
      // This test MUST FAIL initially - TDD requirement
      const invalidElement = null as any

      expect(() => inspector.inspectComponent(invalidElement)).toThrow(/invalid|element/i)
    })

    test('should complete within performance requirement', () => {
      // This test MUST FAIL initially - TDD requirement
      const start = performance.now()

      inspector.inspectComponent(reactElement)

      const duration = performance.now() - start
      expect(duration).toBeLessThan(100) // 100ms requirement
    })
  })

  describe('getHookState method', () => {
    test('should extract hook information from function components', () => {
      // This test MUST FAIL initially - TDD requirement
      // Mock function component with hooks
      const hookElement = document.createElement('div')
      const mockHookFiber = {
        memoizedState: {
          memoizedState: 'useState value',
          next: {
            memoizedState: ['useEffect', 'dependency'],
            deps: ['dep1', 'dep2'],
            next: {
              memoizedState: { current: 'useRef value' },
              next: null
            }
          }
        },
        type: function FunctionComponent() {}
      }
      ;(hookElement as any).__reactFiber$ = mockHookFiber
      document.body.appendChild(hookElement)

      try {
        const hooks = inspector.getHookState(hookElement)

        expect(hooks).toBeDefined()
        expect(Array.isArray(hooks)).toBe(true)
        expect(hooks.length).toBeGreaterThan(0)

        const firstHook = hooks[0]
        expect(firstHook.type).toBeDefined()
        expect(firstHook.value).toBe('useState value')
      } finally {
        document.body.removeChild(hookElement)
      }
    })

    test('should return empty array for class components', () => {
      // This test MUST FAIL initially - TDD requirement
      // Mock class component
      const classElement = document.createElement('div')
      const mockClassFiber = {
        memoizedState: { classState: 'value' },
        type: class ClassComponent {}
      }
      ;(classElement as any).__reactFiber$ = mockClassFiber
      document.body.appendChild(classElement)

      try {
        const hooks = inspector.getHookState(classElement)

        expect(hooks).toBeDefined()
        expect(Array.isArray(hooks)).toBe(true)
        expect(hooks.length).toBe(0)
      } finally {
        document.body.removeChild(classElement)
      }
    })

    test('should return empty array for non-React elements', () => {
      // This test MUST FAIL initially - TDD requirement
      const hooks = inspector.getHookState(nonReactElement)

      expect(hooks).toBeDefined()
      expect(Array.isArray(hooks)).toBe(true)
      expect(hooks.length).toBe(0)
    })

    test('should handle hook dependencies correctly', () => {
      // This test MUST FAIL initially - TDD requirement
      const hookElement = document.createElement('div')
      const mockHookFiber = {
        memoizedState: {
          memoizedState: 'hook value',
          deps: ['dependency1', 'dependency2'],
          next: null
        },
        type: function ComponentWithDeps() {}
      }
      ;(hookElement as any).__reactFiber$ = mockHookFiber
      document.body.appendChild(hookElement)

      try {
        const hooks = inspector.getHookState(hookElement)

        expect(hooks.length).toBeGreaterThan(0)
        const hookWithDeps = hooks.find(h => h.deps)
        expect(hookWithDeps).toBeDefined()
        expect(hookWithDeps?.deps).toEqual(['dependency1', 'dependency2'])
      } finally {
        document.body.removeChild(hookElement)
      }
    })

    test('should limit hook extraction to prevent infinite loops', () => {
      // This test MUST FAIL initially - TDD requirement
      const hookElement = document.createElement('div')

      // Create circular hook chain
      const circularHook: any = {
        memoizedState: 'circular hook'
      }
      circularHook.next = circularHook

      const mockHookFiber = {
        memoizedState: circularHook,
        type: function CircularHookComponent() {}
      }
      ;(hookElement as any).__reactFiber$ = mockHookFiber
      document.body.appendChild(hookElement)

      try {
        const start = performance.now()
        const hooks = inspector.getHookState(hookElement)
        const duration = performance.now() - start

        expect(hooks).toBeDefined()
        expect(duration).toBeLessThan(1000) // Should not hang
        expect(hooks.length).toBeLessThanOrEqual(10) // Should limit hook extraction
      } finally {
        document.body.removeChild(hookElement)
      }
    })

    test('should handle corrupted hook state gracefully', () => {
      // This test MUST FAIL initially - TDD requirement
      const hookElement = document.createElement('div')
      const mockHookFiber = {
        memoizedState: null, // Corrupted state
        type: function CorruptedComponent() {}
      }
      ;(hookElement as any).__reactFiber$ = mockHookFiber
      document.body.appendChild(hookElement)

      try {
        const hooks = inspector.getHookState(hookElement)

        expect(hooks).toBeDefined()
        expect(Array.isArray(hooks)).toBe(true)
        // Should handle gracefully without throwing
      } finally {
        document.body.removeChild(hookElement)
      }
    })

    test('should identify hook types when possible', () => {
      // This test MUST FAIL initially - TDD requirement
      const hookElement = document.createElement('div')
      const mockHookFiber = {
        memoizedState: {
          memoizedState: 'state value',
          queue: { dispatch: () => {} }, // useState pattern
          next: {
            memoizedState: 'effect cleanup',
            deps: [], // useEffect pattern
            next: null
          }
        },
        type: function TypedHooksComponent() {}
      }
      ;(hookElement as any).__reactFiber$ = mockHookFiber
      document.body.appendChild(hookElement)

      try {
        const hooks = inspector.getHookState(hookElement)

        expect(hooks.length).toBeGreaterThan(0)
        // Should try to identify hook types
        hooks.forEach(hook => {
          expect(hook.type).toBeDefined()
          expect(typeof hook.type).toBe('string')
        })
      } finally {
        document.body.removeChild(hookElement)
      }
    })
  })

  describe('getComponentHierarchy method', () => {
    test('should return component hierarchy from element upward', () => {
      // This test MUST FAIL initially - TDD requirement
      const hierarchy = inspector.getComponentHierarchy(reactElement)

      expect(hierarchy).toBeDefined()
      expect(Array.isArray(hierarchy)).toBe(true)
      expect(hierarchy.length).toBeGreaterThan(0)

      const targetComponent = hierarchy[0]
      expect(targetComponent.componentName).toBe('TestComponent')
    })

    test('should include parent components in hierarchy', () => {
      // This test MUST FAIL initially - TDD requirement
      const hierarchy = inspector.getComponentHierarchy(reactElement)

      expect(hierarchy.length).toBeGreaterThanOrEqual(1)

      // Should include parent if available
      if (hierarchy.length > 1) {
        const parentComponent = hierarchy[1]
        expect(parentComponent.componentName).toBe('ParentComponent')
      }
    })

    test('should return empty array for non-React elements', () => {
      // This test MUST FAIL initially - TDD requirement
      const hierarchy = inspector.getComponentHierarchy(nonReactElement)

      expect(hierarchy).toBeDefined()
      expect(Array.isArray(hierarchy)).toBe(true)
      expect(hierarchy.length).toBe(0)
    })

    test('should limit hierarchy depth to prevent infinite traversal', () => {
      // This test MUST FAIL initially - TDD requirement
      const deepElement = document.createElement('div')

      // Create deeply nested fiber structure
      let currentFiber: any = {
        type: { name: 'DeepComponent0' },
        memoizedProps: { level: 0 }
      }

      // Create circular parent chain
      for (let i = 1; i < 20; i++) {
        const parentFiber = {
          type: { name: `DeepComponent${i}` },
          memoizedProps: { level: i },
          child: currentFiber
        }
        currentFiber.return = parentFiber
        currentFiber = parentFiber
      }

      // Make it circular
      currentFiber.return = currentFiber

      ;(deepElement as any).__reactFiber$ = currentFiber.child
      document.body.appendChild(deepElement)

      try {
        const start = performance.now()
        const hierarchy = inspector.getComponentHierarchy(deepElement)
        const duration = performance.now() - start

        expect(hierarchy).toBeDefined()
        expect(duration).toBeLessThan(1000) // Should not hang
        expect(hierarchy.length).toBeLessThanOrEqual(15) // Should limit depth
      } finally {
        document.body.removeChild(deepElement)
      }
    })

    test('should handle missing parent references gracefully', () => {
      // This test MUST FAIL initially - TDD requirement
      const orphanElement = document.createElement('div')
      const orphanFiber = {
        type: { name: 'OrphanComponent' },
        memoizedProps: { orphaned: true },
        return: null // No parent
      }
      ;(orphanElement as any).__reactFiber$ = orphanFiber
      document.body.appendChild(orphanElement)

      try {
        const hierarchy = inspector.getComponentHierarchy(orphanElement)

        expect(hierarchy).toBeDefined()
        expect(hierarchy.length).toBe(1)
        expect(hierarchy[0].componentName).toBe('OrphanComponent')
      } finally {
        document.body.removeChild(orphanElement)
      }
    })

    test('should preserve component props in hierarchy', () => {
      // This test MUST FAIL initially - TDD requirement
      const hierarchy = inspector.getComponentHierarchy(reactElement)

      expect(hierarchy.length).toBeGreaterThan(0)
      const component = hierarchy[0]

      expect(component.props).toBeDefined()
      expect(component.props?.title).toBe('Test Component')
      expect(component.props?.isActive).toBe(true)
    })

    test('should handle invalid elements gracefully', () => {
      // This test MUST FAIL initially - TDD requirement
      const invalidElement = null as any

      expect(() => inspector.getComponentHierarchy(invalidElement)).toThrow(/invalid|element/i)
    })
  })

  describe('detectReactVersion method', () => {
    test('should detect React version when available', () => {
      // This test MUST FAIL initially - TDD requirement
      // Mock React on window
      ;(window as any).React = {
        version: '18.2.0'
      }

      try {
        const version = inspector.detectReactVersion()

        expect(version).toBeDefined()
        expect(typeof version).toBe('string')
        expect(version).toMatch(/^\d+\.\d+\.\d+/)
      } finally {
        delete (window as any).React
      }
    })

    test('should detect React version from ReactDOM', () => {
      // This test MUST FAIL initially - TDD requirement
      // Mock ReactDOM on window
      ;(window as any).ReactDOM = {
        version: '18.2.0'
      }

      try {
        const version = inspector.detectReactVersion()

        expect(version).toBeDefined()
        expect(version).toBe('18.2.0')
      } finally {
        delete (window as any).ReactDOM
      }
    })

    test('should return null when React is not available', () => {
      // This test MUST FAIL initially - TDD requirement
      // Ensure React is not on window
      const originalReact = (window as any).React
      const originalReactDOM = (window as any).ReactDOM
      delete (window as any).React
      delete (window as any).ReactDOM

      try {
        const version = inspector.detectReactVersion()

        expect(version).toBeNull()
      } finally {
        if (originalReact) (window as any).React = originalReact
        if (originalReactDOM) (window as any).ReactDOM = originalReactDOM
      }
    })

    test('should detect version from fiber properties', () => {
      // This test MUST FAIL initially - TDD requirement
      // Mock React fiber with version info
      const fiberElement = document.createElement('div')
      const fiberWithVersion = {
        _reactInternalFiber: {
          tag: 1,
          version: '17.0.2'
        }
      }
      ;(fiberElement as any).__reactInternalInstance$ = fiberWithVersion
      document.body.appendChild(fiberElement)

      try {
        const version = inspector.detectReactVersion()

        // Should be able to detect from fiber when available
        expect(version === null || typeof version === 'string').toBe(true)
      } finally {
        document.body.removeChild(fiberElement)
      }
    })

    test('should handle version detection errors gracefully', () => {
      // This test MUST FAIL initially - TDD requirement
      // Mock React with corrupted version
      ;(window as any).React = {
        version: null
      }

      try {
        const version = inspector.detectReactVersion()

        // Should handle gracefully
        expect(version === null || typeof version === 'string').toBe(true)
      } finally {
        delete (window as any).React
      }
    })

    test('should cache version detection result', () => {
      // This test MUST FAIL initially - TDD requirement
      ;(window as any).React = {
        version: '18.2.0'
      }

      try {
        const version1 = inspector.detectReactVersion()

        // Modify React version
        ;(window as any).React.version = '19.0.0'

        const version2 = inspector.detectReactVersion()

        // Should return cached result for performance
        expect(version1).toBe(version2)
      } finally {
        delete (window as any).React
      }
    })
  })

  describe('isReactElement method', () => {
    test('should return true for React elements', () => {
      // This test MUST FAIL initially - TDD requirement
      const isReact = inspector.isReactElement(reactElement)

      expect(isReact).toBe(true)
    })

    test('should return false for non-React elements', () => {
      // This test MUST FAIL initially - TDD requirement
      const isReact = inspector.isReactElement(nonReactElement)

      expect(isReact).toBe(false)
    })

    test('should detect React elements with different fiber property names', () => {
      // This test MUST FAIL initially - TDD requirement
      // Test React 15 style
      const react15Element = document.createElement('div')
      ;(react15Element as any).__reactInternalInstance = { test: 'fiber' }
      document.body.appendChild(react15Element)

      // Test React 16+ style
      const react16Element = document.createElement('div')
      ;(react16Element as any).__reactInternalInstance$ = { test: 'fiber' }
      document.body.appendChild(react16Element)

      try {
        const is15React = inspector.isReactElement(react15Element)
        const is16React = inspector.isReactElement(react16Element)

        expect(is15React).toBe(true)
        expect(is16React).toBe(true)
      } finally {
        document.body.removeChild(react15Element)
        document.body.removeChild(react16Element)
      }
    })

    test('should handle elements with partial React data', () => {
      // This test MUST FAIL initially - TDD requirement
      const partialElement = document.createElement('div')
      ;(partialElement as any).__reactFiber$ = null
      document.body.appendChild(partialElement)

      try {
        const isReact = inspector.isReactElement(partialElement)

        expect(typeof isReact).toBe('boolean')
      } finally {
        document.body.removeChild(partialElement)
      }
    })

    test('should be performant for rapid checks', () => {
      // This test MUST FAIL initially - TDD requirement
      const start = performance.now()

      // Check many elements rapidly
      for (let i = 0; i < 1000; i++) {
        inspector.isReactElement(reactElement)
        inspector.isReactElement(nonReactElement)
      }

      const duration = performance.now() - start
      expect(duration).toBeLessThan(100) // Should be very fast
    })

    test('should handle null and undefined elements', () => {
      // This test MUST FAIL initially - TDD requirement
      expect(() => inspector.isReactElement(null as any)).toThrow(/invalid|element/i)
      expect(() => inspector.isReactElement(undefined as any)).toThrow(/invalid|element/i)
    })

    test('should handle document and window objects', () => {
      // This test MUST FAIL initially - TDD requirement
      const isDocumentReact = inspector.isReactElement(document.body)

      expect(isDocumentReact).toBe(false)
    })
  })

  describe('Performance Requirements', () => {
    test('component inspection should complete within 100ms', () => {
      // This test MUST FAIL initially - TDD requirement
      const start = performance.now()

      inspector.inspectComponent(reactElement)

      const duration = performance.now() - start
      expect(duration).toBeLessThan(100)
    })

    test('hook extraction should complete within 50ms', () => {
      // This test MUST FAIL initially - TDD requirement
      const start = performance.now()

      inspector.getHookState(reactElement)

      const duration = performance.now() - start
      expect(duration).toBeLessThan(50)
    })

    test('React element detection should complete within 10ms', () => {
      // This test MUST FAIL initially - TDD requirement
      const start = performance.now()

      for (let i = 0; i < 100; i++) {
        inspector.isReactElement(reactElement)
      }

      const duration = performance.now() - start
      expect(duration).toBeLessThan(10)
    })

    test('hierarchy extraction should handle deep nesting efficiently', () => {
      // This test MUST FAIL initially - TDD requirement
      const start = performance.now()

      inspector.getComponentHierarchy(reactElement)

      const duration = performance.now() - start
      expect(duration).toBeLessThan(100)
    })
  })

  describe('Error Handling', () => {
    test('should provide meaningful error messages', () => {
      // This test MUST FAIL initially - TDD requirement
      try {
        inspector.inspectComponent(null as any)
        fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toMatch(/invalid|element|null/i)
      }
    })

    test('should handle React DevTools conflicts gracefully', () => {
      // This test MUST FAIL initially - TDD requirement
      // Mock React DevTools presence
      ;(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
        renderers: new Map(),
        onCommitFiberRoot: () => {},
        onCommitFiberUnmount: () => {}
      }

      try {
        const result = inspector.inspectComponent(reactElement)

        // Should still work despite DevTools presence
        expect(result).toBeDefined()
      } finally {
        delete (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__
      }
    })

    test('should handle memory pressure gracefully', () => {
      // This test MUST FAIL initially - TDD requirement
      // Create many React elements to simulate memory pressure
      const elements: HTMLElement[] = []

      try {
        for (let i = 0; i < 100; i++) {
          const el = document.createElement('div')
          ;(el as any).__reactFiber$ = {
            type: { name: `Component${i}` },
            memoizedProps: { id: i }
          }
          elements.push(el)
          document.body.appendChild(el)
        }

        // Should handle many inspections without issues
        elements.forEach(el => {
          expect(() => inspector.inspectComponent(el)).not.toThrow()
        })
      } finally {
        elements.forEach(el => document.body.removeChild(el))
      }
    })

    test('should handle concurrent access safely', () => {
      // This test MUST FAIL initially - TDD requirement
      const promises = []

      // Simulate concurrent access
      for (let i = 0; i < 10; i++) {
        promises.push(
          Promise.resolve().then(() => inspector.inspectComponent(reactElement))
        )
      }

      return Promise.all(promises).then(results => {
        results.forEach(result => {
          expect(result).toBeDefined()
        })
      })
    })
  })
})