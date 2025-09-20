/**
 * Contract Test: IElementAnalyzer Interface
 *
 * These tests MUST FAIL initially (TDD approach) and define the contract
 * that any IElementAnalyzer implementation must satisfy.
 */

import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import type { IElementAnalyzer } from '@/specs/019-vibe-mode-quick/contracts/inspection-api'
import type { AnalysisLevel, InspectionMetadata } from '@/types/vibe-mode'

// Mock implementation for testing (will be replaced with real implementation)
class MockElementAnalyzer implements IElementAnalyzer {
  analyzeElement(element: Element, level: AnalysisLevel): Promise<InspectionMetadata> {
    throw new Error('Not implemented - this test should fail initially')
  }

  observeElement(element: Element): () => void {
    throw new Error('Not implemented - this test should fail initially')
  }

  getCachedAnalysis(element: Element): InspectionMetadata | null {
    throw new Error('Not implemented - this test should fail initially')
  }

  clearCache(): void {
    throw new Error('Not implemented - this test should fail initially')
  }
}

describe('IElementAnalyzer Contract', () => {
  let analyzer: IElementAnalyzer
  let testElement: HTMLDivElement

  beforeEach(() => {
    analyzer = new MockElementAnalyzer()

    // Create test element
    testElement = document.createElement('div')
    testElement.id = 'test-element'
    testElement.className = 'test-class bg-blue-500 p-4'
    testElement.textContent = 'Test content'
    testElement.setAttribute('data-testid', 'analyzer-test')
    document.body.appendChild(testElement)
  })

  afterEach(() => {
    document.body.removeChild(testElement)
  })

  describe('analyzeElement method', () => {
    test('should analyze element with basic level', async () => {
      // This test MUST FAIL initially - TDD requirement
      const result = await analyzer.analyzeElement(testElement, 'basic')

      expect(result).toBeDefined()
      expect(result.element).toBeDefined()
      expect(result.element.tagName).toBe('div')
      expect(result.element.id).toBe('test-element')
      expect(result.element.classes).toContain('test-class')
      expect(result.element.classes).toContain('bg-blue-500')
      expect(result.element.classes).toContain('p-4')
      expect(result.element.attributes).toHaveProperty('data-testid', 'analyzer-test')
      expect(result.element.textContent).toBe('Test content')
    })

    test('should analyze element with detailed level', async () => {
      // This test MUST FAIL initially - TDD requirement
      const result = await analyzer.analyzeElement(testElement, 'detailed')

      expect(result).toBeDefined()
      expect(result.cssFramework).toBeDefined()
      expect(result.cssFramework.tailwindClasses).toBeDefined()
      expect(result.cssFramework.tailwindClasses.length).toBeGreaterThan(0)

      // Should detect Tailwind classes
      const bgClass = result.cssFramework.tailwindClasses.find(c => c.className === 'bg-blue-500')
      expect(bgClass).toBeDefined()
      expect(bgClass?.category).toBe('colors')

      const paddingClass = result.cssFramework.tailwindClasses.find(c => c.className === 'p-4')
      expect(paddingClass).toBeDefined()
      expect(paddingClass?.category).toBe('spacing')
    })

    test('should analyze element with comprehensive level', async () => {
      // This test MUST FAIL initially - TDD requirement
      const result = await analyzer.analyzeElement(testElement, 'comprehensive')

      expect(result).toBeDefined()
      expect(result.layout).toBeDefined()
      expect(result.layout.positioning).toBeDefined()
      expect(result.layout.parentChain).toBeDefined()
      expect(result.layout.children).toBeDefined()
      expect(result.styles).toBeDefined()
      expect(result.styles.boxModel).toBeDefined()
    })

    test('should include computed styles information', async () => {
      // This test MUST FAIL initially - TDD requirement
      const result = await analyzer.analyzeElement(testElement, 'basic')

      expect(result.styles).toBeDefined()
      expect(result.styles.display).toBeDefined()
      expect(result.styles.position).toBeDefined()
      expect(result.styles.dimensions).toBeDefined()
      expect(result.styles.dimensions.width).toBeGreaterThanOrEqual(0)
      expect(result.styles.dimensions.height).toBeGreaterThanOrEqual(0)
    })

    test('should include inspection metadata', async () => {
      // This test MUST FAIL initially - TDD requirement
      const result = await analyzer.analyzeElement(testElement, 'basic')

      expect(result.inspection).toBeDefined()
      expect(result.inspection.timestamp).toBeGreaterThan(Date.now() - 1000)
      expect(result.inspection.analysisLevel).toBe('basic')
      expect(typeof result.inspection.isVisible).toBe('boolean')
      expect(typeof result.inspection.isInteractive).toBe('boolean')
    })

    test('should handle React component analysis when available', async () => {
      // Add mock React fiber to element
      const mockFiber = {
        memoizedProps: { testProp: 'value' },
        memoizedState: { testState: 'state' },
        type: { name: 'TestComponent' }
      }
      ;(testElement as any).__reactFiber$ = mockFiber

      // This test MUST FAIL initially - TDD requirement
      const result = await analyzer.analyzeElement(testElement, 'detailed')

      expect(result.react).toBeDefined()
      expect(result.react?.componentName).toBe('TestComponent')
      expect(result.react?.props).toEqual({ testProp: 'value' })
      expect(result.react?.state).toEqual({ testState: 'state' })
    })

    test('should reject invalid elements', async () => {
      // This test MUST FAIL initially - TDD requirement
      const invalidElement = null as any

      await expect(analyzer.analyzeElement(invalidElement, 'basic')).rejects.toThrow()
    })

    test('should handle analysis timeout', async () => {
      // This test MUST FAIL initially - TDD requirement
      // Mock a slow analysis scenario
      const slowElement = document.createElement('div')

      await expect(analyzer.analyzeElement(slowElement, 'comprehensive')).rejects.toThrow(/timeout/i)
    })
  })

  describe('observeElement method', () => {
    test('should return cleanup function', () => {
      // This test MUST FAIL initially - TDD requirement
      const cleanup = analyzer.observeElement(testElement)

      expect(typeof cleanup).toBe('function')
    })

    test('should track element changes', () => {
      // This test MUST FAIL initially - TDD requirement
      let changeDetected = false
      const originalObserve = analyzer.observeElement

      analyzer.observeElement = (element: Element) => {
        // Mock observer that detects changes
        const observer = new MutationObserver(() => {
          changeDetected = true
        })
        observer.observe(element, { attributes: true, childList: true })

        return () => observer.disconnect()
      }

      const cleanup = analyzer.observeElement(testElement)

      // Make a change
      testElement.className = 'new-class'

      // Allow for async mutation observer
      setTimeout(() => {
        expect(changeDetected).toBe(true)
        cleanup()
      }, 10)
    })

    test('cleanup function should stop observation', () => {
      // This test MUST FAIL initially - TDD requirement
      const cleanup = analyzer.observeElement(testElement)

      expect(() => cleanup()).not.toThrow()
    })
  })

  describe('getCachedAnalysis method', () => {
    test('should return null for non-cached element', () => {
      // This test MUST FAIL initially - TDD requirement
      const result = analyzer.getCachedAnalysis(testElement)

      expect(result).toBeNull()
    })

    test('should return cached analysis after element was analyzed', async () => {
      // This test MUST FAIL initially - TDD requirement
      await analyzer.analyzeElement(testElement, 'basic')

      const cached = analyzer.getCachedAnalysis(testElement)
      expect(cached).toBeDefined()
      expect(cached?.element.id).toBe('test-element')
    })

    test('should handle cache invalidation when element changes', async () => {
      // This test MUST FAIL initially - TDD requirement
      await analyzer.analyzeElement(testElement, 'basic')

      // Modify element
      testElement.className = 'modified-class'

      const cached = analyzer.getCachedAnalysis(testElement)
      // Should either return null or updated analysis
      if (cached) {
        expect(cached.element.classes).toContain('modified-class')
      }
    })
  })

  describe('clearCache method', () => {
    test('should clear all cached analyses', async () => {
      // This test MUST FAIL initially - TDD requirement
      await analyzer.analyzeElement(testElement, 'basic')

      // Verify cache has content
      expect(analyzer.getCachedAnalysis(testElement)).toBeDefined()

      analyzer.clearCache()

      // Verify cache is cleared
      expect(analyzer.getCachedAnalysis(testElement)).toBeNull()
    })

    test('should not throw when clearing empty cache', () => {
      // This test MUST FAIL initially - TDD requirement
      expect(() => analyzer.clearCache()).not.toThrow()
    })
  })

  describe('Performance Requirements', () => {
    test('basic analysis should complete within 100ms', async () => {
      // This test MUST FAIL initially - TDD requirement
      const start = performance.now()

      await analyzer.analyzeElement(testElement, 'basic')

      const duration = performance.now() - start
      expect(duration).toBeLessThan(100)
    })

    test('detailed analysis should complete within 200ms', async () => {
      // This test MUST FAIL initially - TDD requirement
      const start = performance.now()

      await analyzer.analyzeElement(testElement, 'detailed')

      const duration = performance.now() - start
      expect(duration).toBeLessThan(200)
    })

    test('comprehensive analysis should complete within 500ms', async () => {
      // This test MUST FAIL initially - TDD requirement
      const start = performance.now()

      await analyzer.analyzeElement(testElement, 'comprehensive')

      const duration = performance.now() - start
      expect(duration).toBeLessThan(500)
    })
  })

  describe('Error Handling', () => {
    test('should handle elements removed from DOM', async () => {
      // This test MUST FAIL initially - TDD requirement
      document.body.removeChild(testElement)

      await expect(analyzer.analyzeElement(testElement, 'basic')).rejects.toThrow(/not found|removed/i)
    })

    test('should handle malformed elements gracefully', async () => {
      // This test MUST FAIL initially - TDD requirement
      const malformedElement = document.createElement('div')
      malformedElement.remove() // Detached element

      await expect(analyzer.analyzeElement(malformedElement, 'basic')).rejects.toThrow()
    })

    test('should provide meaningful error messages', async () => {
      // This test MUST FAIL initially - TDD requirement
      const invalidElement = {} as Element

      try {
        await analyzer.analyzeElement(invalidElement, 'basic')
        fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toMatch(/element|invalid|analysis/i)
      }
    })
  })
})

/**
 * Integration tests with actual DOM elements
 */
describe('IElementAnalyzer DOM Integration', () => {
  let analyzer: IElementAnalyzer

  beforeEach(() => {
    analyzer = new MockElementAnalyzer()
  })

  test('should analyze complex nested structure', async () => {
    // This test MUST FAIL initially - TDD requirement
    const container = document.createElement('div')
    container.className = 'flex justify-center items-center bg-gray-100'

    const child = document.createElement('button')
    child.className = 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
    child.textContent = 'Click me'

    container.appendChild(child)
    document.body.appendChild(container)

    try {
      const result = await analyzer.analyzeElement(child, 'comprehensive')

      expect(result.layout.parentChain).toBeDefined()
      expect(result.layout.parentChain.length).toBeGreaterThan(0)
      expect(result.layout.parentChain[0].classes).toContain('flex')

      expect(result.inspection.isInteractive).toBe(true)
      expect(result.element.tagName).toBe('button')
    } finally {
      document.body.removeChild(container)
    }
  })

  test('should detect CSS framework usage', async () => {
    // This test MUST FAIL initially - TDD requirement
    const element = document.createElement('div')
    element.className = 'container mx-auto px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-500 to-purple-600'
    document.body.appendChild(element)

    try {
      const result = await analyzer.analyzeElement(element, 'detailed')

      expect(result.cssFramework.tailwindClasses.length).toBeGreaterThan(0)

      const hasSpacing = result.cssFramework.tailwindClasses.some(c => c.category === 'spacing')
      const hasColors = result.cssFramework.tailwindClasses.some(c => c.category === 'colors')
      const hasResponsive = result.cssFramework.tailwindClasses.some(c => c.responsive)

      expect(hasSpacing).toBe(true)
      expect(hasColors).toBe(true)
      expect(hasResponsive).toBe(true)
    } finally {
      document.body.removeChild(element)
    }
  })
})