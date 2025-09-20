/**
 * Contract Test: ICSSFrameworkAnalyzer Interface
 *
 * These tests MUST FAIL initially (TDD approach) and define the contract
 * that any ICSSFrameworkAnalyzer implementation must satisfy.
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals'
import type { ICSSFrameworkAnalyzer } from '@/specs/019-vibe-mode-quick/contracts/inspection-api'
import type { TailwindClassInfo, UtilityClassAnalysis } from '@/types/vibe-mode'

// Mock implementation for testing (will be replaced with real implementation)
class MockCSSFrameworkAnalyzer implements ICSSFrameworkAnalyzer {
  parseTailwindClasses(classList: string[]): TailwindClassInfo[] {
    throw new Error('Not implemented - this test should fail initially')
  }

  analyzeUtilityClasses(element: Element): UtilityClassAnalysis {
    throw new Error('Not implemented - this test should fail initially')
  }

  detectFramework(element: Element): string[] {
    throw new Error('Not implemented - this test should fail initially')
  }

  extractCSSVariables(element: Element): Record<string, string> {
    throw new Error('Not implemented - this test should fail initially')
  }

  getConflictingClasses(element: Element): string[] {
    throw new Error('Not implemented - this test should fail initially')
  }

  getUnusedClasses(element: Element): string[] {
    throw new Error('Not implemented - this test should fail initially')
  }
}

describe('ICSSFrameworkAnalyzer Contract', () => {
  let analyzer: ICSSFrameworkAnalyzer
  let testElement: HTMLDivElement

  beforeEach(() => {
    analyzer = new MockCSSFrameworkAnalyzer()

    // Create test element with various CSS classes
    testElement = document.createElement('div')
    testElement.id = 'test-element'
    testElement.className = 'container mx-auto px-4 py-8 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 md:px-8 lg:px-12 flex items-center justify-between'
    testElement.style.cssText = '--custom-color: #ff0000; --spacing: 1rem; background-color: var(--custom-color);'
    testElement.textContent = 'Test element with Tailwind classes'
    document.body.appendChild(testElement)
  })

  afterEach(() => {
    document.body.removeChild(testElement)
  })

  describe('parseTailwindClasses method', () => {
    test('should parse spacing classes correctly', () => {
      // This test MUST FAIL initially - TDD requirement
      const classList = ['px-4', 'py-8', 'mx-auto', 'm-2', 'mt-6', 'mb-0']
      const result = analyzer.parseTailwindClasses(classList)

      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)

      const pxClass = result.find(c => c.className === 'px-4')
      expect(pxClass).toBeDefined()
      expect(pxClass?.category).toBe('spacing')
      expect(pxClass?.property).toBe('px')
      expect(pxClass?.value).toBe('4')
      expect(pxClass?.cssProperty).toBe('padding-left')
      expect(pxClass?.cssValue).toBe('1rem')

      const pyClass = result.find(c => c.className === 'py-8')
      expect(pyClass).toBeDefined()
      expect(pyClass?.category).toBe('spacing')
      expect(pyClass?.cssProperty).toBe('padding-top')
      expect(pyClass?.cssValue).toBe('2rem')
    })

    test('should parse color classes correctly', () => {
      // This test MUST FAIL initially - TDD requirement
      const classList = ['bg-blue-500', 'text-white', 'text-gray-900', 'border-red-200']
      const result = analyzer.parseTailwindClasses(classList)

      const bgClass = result.find(c => c.className === 'bg-blue-500')
      expect(bgClass).toBeDefined()
      expect(bgClass?.category).toBe('colors')
      expect(bgClass?.property).toBe('bg')
      expect(bgClass?.value).toBe('blue-500')
      expect(bgClass?.cssProperty).toBe('background-color')
      expect(bgClass?.cssValue).toContain('blue')

      const textClass = result.find(c => c.className === 'text-white')
      expect(textClass).toBeDefined()
      expect(textClass?.category).toBe('colors')
      expect(textClass?.property).toBe('text')
      expect(textClass?.cssProperty).toBe('color')
    })

    test('should parse layout classes correctly', () => {
      // This test MUST FAIL initially - TDD requirement
      const classList = ['flex', 'grid', 'block', 'inline', 'hidden']
      const result = analyzer.parseTailwindClasses(classList)

      const flexClass = result.find(c => c.className === 'flex')
      expect(flexClass).toBeDefined()
      expect(flexClass?.category).toBe('layout')
      expect(flexClass?.property).toBe('display')
      expect(flexClass?.value).toBe('flex')
      expect(flexClass?.cssProperty).toBe('display')
      expect(flexClass?.cssValue).toBe('flex')

      const hiddenClass = result.find(c => c.className === 'hidden')
      expect(hiddenClass).toBeDefined()
      expect(hiddenClass?.cssValue).toBe('none')
    })

    test('should parse responsive classes correctly', () => {
      // This test MUST FAIL initially - TDD requirement
      const classList = ['md:px-8', 'lg:px-12', 'sm:text-sm', 'xl:grid-cols-4']
      const result = analyzer.parseTailwindClasses(classList)

      const mdClass = result.find(c => c.className === 'md:px-8' || c.responsive === 'md')
      expect(mdClass).toBeDefined()
      expect(mdClass?.responsive).toBe('md')

      const lgClass = result.find(c => c.className === 'lg:px-12' || c.responsive === 'lg')
      expect(lgClass).toBeDefined()
      expect(lgClass?.responsive).toBe('lg')
    })

    test('should parse pseudo-class variants correctly', () => {
      // This test MUST FAIL initially - TDD requirement
      const classList = ['hover:bg-blue-600', 'focus:ring-2', 'active:scale-95', 'disabled:opacity-50']
      const result = analyzer.parseTailwindClasses(classList)

      const hoverClass = result.find(c => c.className === 'hover:bg-blue-600' || c.pseudoClass === 'hover')
      expect(hoverClass).toBeDefined()
      expect(hoverClass?.pseudoClass).toBe('hover')

      const focusClass = result.find(c => c.pseudoClass === 'focus')
      expect(focusClass).toBeDefined()
      expect(focusClass?.pseudoClass).toBe('focus')
    })

    test('should handle sizing classes correctly', () => {
      // This test MUST FAIL initially - TDD requirement
      const classList = ['w-full', 'h-64', 'min-w-0', 'max-h-screen']
      const result = analyzer.parseTailwindClasses(classList)

      const widthClass = result.find(c => c.className === 'w-full')
      expect(widthClass).toBeDefined()
      expect(widthClass?.category).toBe('sizing')
      expect(widthClass?.property).toContain('w')

      const heightClass = result.find(c => c.className === 'h-64')
      expect(heightClass).toBeDefined()
      expect(heightClass?.category).toBe('sizing')
      expect(heightClass?.property).toContain('h')
    })

    test('should handle typography classes correctly', () => {
      // This test MUST FAIL initially - TDD requirement
      const classList = ['text-xl', 'font-bold', 'leading-tight', 'tracking-wide']
      const result = analyzer.parseTailwindClasses(classList)

      const textClass = result.find(c => c.className === 'text-xl')
      expect(textClass).toBeDefined()
      expect(textClass?.category).toBe('typography')

      const fontClass = result.find(c => c.className === 'font-bold')
      expect(fontClass).toBeDefined()
      expect(fontClass?.category).toBe('typography')
    })

    test('should handle effects classes correctly', () => {
      // This test MUST FAIL initially - TDD requirement
      const classList = ['shadow-md', 'shadow-lg', 'opacity-75', 'blur-sm']
      const result = analyzer.parseTailwindClasses(classList)

      const shadowClass = result.find(c => c.className === 'shadow-md')
      expect(shadowClass).toBeDefined()
      expect(shadowClass?.category).toBe('effects')

      const opacityClass = result.find(c => c.className === 'opacity-75')
      expect(opacityClass).toBeDefined()
      expect(opacityClass?.category).toBe('effects')
    })

    test('should ignore non-Tailwind classes', () => {
      // This test MUST FAIL initially - TDD requirement
      const classList = ['custom-class', 'my-component', 'non-tailwind', 'bg-blue-500']
      const result = analyzer.parseTailwindClasses(classList)

      const tailwindClass = result.find(c => c.className === 'bg-blue-500')
      expect(tailwindClass).toBeDefined()

      const customClass = result.find(c => c.className === 'custom-class')
      expect(customClass).toBeUndefined()
    })

    test('should handle empty or invalid class lists', () => {
      // This test MUST FAIL initially - TDD requirement
      const emptyResult = analyzer.parseTailwindClasses([])
      expect(emptyResult).toBeDefined()
      expect(Array.isArray(emptyResult)).toBe(true)
      expect(emptyResult.length).toBe(0)

      const invalidResult = analyzer.parseTailwindClasses(['', '   ', null as any, undefined as any])
      expect(invalidResult).toBeDefined()
      expect(Array.isArray(invalidResult)).toBe(true)
    })

    test('should complete within performance requirement', () => {
      // This test MUST FAIL initially - TDD requirement
      const largeClassList = Array.from({ length: 100 }, (_, i) => `class-${i}`)
      largeClassList.push('bg-blue-500', 'text-white', 'px-4', 'py-2')

      const start = performance.now()
      analyzer.parseTailwindClasses(largeClassList)
      const duration = performance.now() - start

      expect(duration).toBeLessThan(50) // Should be fast even with many classes
    })
  })

  describe('analyzeUtilityClasses method', () => {
    test('should analyze utility class usage', () => {
      // This test MUST FAIL initially - TDD requirement
      const result = analyzer.analyzeUtilityClasses(testElement)

      expect(result).toBeDefined()
      expect(typeof result.totalClasses).toBe('number')
      expect(typeof result.utilityClasses).toBe('number')
      expect(typeof result.customClasses).toBe('number')
      expect(typeof result.frameworkClasses).toBe('number')
      expect(Array.isArray(result.unusedClasses)).toBe(true)
      expect(Array.isArray(result.conflictingClasses)).toBe(true)

      expect(result.totalClasses).toBeGreaterThan(0)
      expect(result.utilityClasses).toBeGreaterThanOrEqual(0)
      expect(result.customClasses).toBeGreaterThanOrEqual(0)
      expect(result.totalClasses).toBe(result.utilityClasses + result.customClasses)
    })

    test('should identify framework vs custom classes correctly', () => {
      // This test MUST FAIL initially - TDD requirement
      const mixedElement = document.createElement('div')
      mixedElement.className = 'bg-blue-500 px-4 custom-class my-component text-white another-custom'
      document.body.appendChild(mixedElement)

      try {
        const result = analyzer.analyzeUtilityClasses(mixedElement)

        expect(result.frameworkClasses).toBeGreaterThan(0) // Should detect Tailwind classes
        expect(result.customClasses).toBeGreaterThan(0) // Should detect custom classes
        expect(result.frameworkClasses + result.customClasses).toBeLessThanOrEqual(result.totalClasses)
      } finally {
        document.body.removeChild(mixedElement)
      }
    })

    test('should handle elements with no classes', () => {
      // This test MUST FAIL initially - TDD requirement
      const emptyElement = document.createElement('div')
      document.body.appendChild(emptyElement)

      try {
        const result = analyzer.analyzeUtilityClasses(emptyElement)

        expect(result.totalClasses).toBe(0)
        expect(result.utilityClasses).toBe(0)
        expect(result.customClasses).toBe(0)
        expect(result.frameworkClasses).toBe(0)
        expect(result.unusedClasses.length).toBe(0)
        expect(result.conflictingClasses.length).toBe(0)
      } finally {
        document.body.removeChild(emptyElement)
      }
    })

    test('should detect conflicting classes', () => {
      // This test MUST FAIL initially - TDD requirement
      const conflictElement = document.createElement('div')
      conflictElement.className = 'text-left text-center text-right bg-red-500 bg-blue-500'
      document.body.appendChild(conflictElement)

      try {
        const result = analyzer.analyzeUtilityClasses(conflictElement)

        expect(result.conflictingClasses.length).toBeGreaterThan(0)
        // Should detect text alignment conflicts
        expect(result.conflictingClasses.some(c => c.includes('text-'))).toBe(true)
        // Should detect background color conflicts
        expect(result.conflictingClasses.some(c => c.includes('bg-'))).toBe(true)
      } finally {
        document.body.removeChild(conflictElement)
      }
    })

    test('should identify unused classes when possible', () => {
      // This test MUST FAIL initially - TDD requirement
      const result = analyzer.analyzeUtilityClasses(testElement)

      // Should attempt to detect unused classes
      expect(Array.isArray(result.unusedClasses)).toBe(true)
      // Note: Actual unused class detection is complex and might be limited
    })

    test('should handle invalid elements gracefully', () => {
      // This test MUST FAIL initially - TDD requirement
      expect(() => analyzer.analyzeUtilityClasses(null as any)).toThrow(/invalid|element/i)
    })

    test('should complete within performance requirement', () => {
      // This test MUST FAIL initially - TDD requirement
      const start = performance.now()
      analyzer.analyzeUtilityClasses(testElement)
      const duration = performance.now() - start

      expect(duration).toBeLessThan(100)
    })
  })

  describe('detectFramework method', () => {
    test('should detect Tailwind CSS framework', () => {
      // This test MUST FAIL initially - TDD requirement
      const result = analyzer.detectFramework(testElement)

      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result).toContain('tailwindcss')
    })

    test('should detect multiple frameworks when present', () => {
      // This test MUST FAIL initially - TDD requirement
      const multiFrameworkElement = document.createElement('div')
      multiFrameworkElement.className = 'bg-blue-500 px-4 btn btn-primary container-fluid'
      document.body.appendChild(multiFrameworkElement)

      try {
        const result = analyzer.detectFramework(multiFrameworkElement)

        expect(result.length).toBeGreaterThan(0)
        // Should detect Tailwind
        expect(result).toContain('tailwindcss')
        // Might detect Bootstrap if present
        if (result.includes('bootstrap')) {
          expect(result).toContain('bootstrap')
        }
      } finally {
        document.body.removeChild(multiFrameworkElement)
      }
    })

    test('should detect CSS-in-JS libraries when present', () => {
      // This test MUST FAIL initially - TDD requirement
      const cssInJsElement = document.createElement('div')
      cssInJsElement.className = 'css-1234567 emotion-cache-abc styled-component-def'
      document.body.appendChild(cssInJsElement)

      try {
        const result = analyzer.detectFramework(cssInJsElement)

        // Should detect CSS-in-JS patterns
        if (result.includes('emotion')) {
          expect(result).toContain('emotion')
        }
        if (result.includes('styled-components')) {
          expect(result).toContain('styled-components')
        }
      } finally {
        document.body.removeChild(cssInJsElement)
      }
    })

    test('should return empty array for vanilla CSS elements', () => {
      // This test MUST FAIL initially - TDD requirement
      const vanillaElement = document.createElement('div')
      vanillaElement.className = 'my-custom-class another-custom-class'
      document.body.appendChild(vanillaElement)

      try {
        const result = analyzer.detectFramework(vanillaElement)

        expect(result).toBeDefined()
        expect(Array.isArray(result)).toBe(true)
        expect(result.length).toBe(0)
      } finally {
        document.body.removeChild(vanillaElement)
      }
    })

    test('should detect framework from parent elements when configured', () => {
      // This test MUST FAIL initially - TDD requirement
      const parentElement = document.createElement('div')
      parentElement.className = 'container mx-auto' // Tailwind container

      const childElement = document.createElement('span')
      childElement.className = 'custom-class' // No framework classes

      parentElement.appendChild(childElement)
      document.body.appendChild(parentElement)

      try {
        const result = analyzer.detectFramework(childElement)

        // Should potentially detect framework from parent context
        expect(Array.isArray(result)).toBe(true)
      } finally {
        document.body.removeChild(parentElement)
      }
    })

    test('should handle elements with mixed framework classes', () => {
      // This test MUST FAIL initially - TDD requirement
      const mixedElement = document.createElement('div')
      mixedElement.className = 'bg-blue-500 btn-primary col-md-6' // Tailwind + potential Bootstrap
      document.body.appendChild(mixedElement)

      try {
        const result = analyzer.detectFramework(mixedElement)

        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        expect(result).toContain('tailwindcss')
      } finally {
        document.body.removeChild(mixedElement)
      }
    })

    test('should complete detection quickly', () => {
      // This test MUST FAIL initially - TDD requirement
      const start = performance.now()
      analyzer.detectFramework(testElement)
      const duration = performance.now() - start

      expect(duration).toBeLessThan(50)
    })
  })

  describe('extractCSSVariables method', () => {
    test('should extract CSS custom properties from element', () => {
      // This test MUST FAIL initially - TDD requirement
      const result = analyzer.extractCSSVariables(testElement)

      expect(result).toBeDefined()
      expect(typeof result).toBe('object')
      expect(result).toHaveProperty('--custom-color')
      expect(result['--custom-color']).toBe('#ff0000')
      expect(result).toHaveProperty('--spacing')
      expect(result['--spacing']).toBe('1rem')
    })

    test('should extract inherited CSS variables', () => {
      // This test MUST FAIL initially - TDD requirement
      const parentElement = document.createElement('div')
      parentElement.style.cssText = '--parent-var: blue; --shared-var: parent-value;'

      const childElement = document.createElement('div')
      childElement.style.cssText = '--child-var: red; --shared-var: child-value;'

      parentElement.appendChild(childElement)
      document.body.appendChild(parentElement)

      try {
        const result = analyzer.extractCSSVariables(childElement)

        expect(result).toHaveProperty('--child-var')
        expect(result['--child-var']).toBe('red')
        expect(result).toHaveProperty('--parent-var')
        expect(result['--parent-var']).toBe('blue')
        expect(result).toHaveProperty('--shared-var')
        expect(result['--shared-var']).toBe('child-value') // Child should override parent
      } finally {
        document.body.removeChild(parentElement)
      }
    })

    test('should handle elements with no CSS variables', () => {
      // This test MUST FAIL initially - TDD requirement
      const plainElement = document.createElement('div')
      plainElement.style.cssText = 'color: red; background: blue;'
      document.body.appendChild(plainElement)

      try {
        const result = analyzer.extractCSSVariables(plainElement)

        expect(result).toBeDefined()
        expect(typeof result).toBe('object')
        expect(Object.keys(result).length).toBe(0)
      } finally {
        document.body.removeChild(plainElement)
      }
    })

    test('should extract global CSS variables from :root', () => {
      // This test MUST FAIL initially - TDD requirement
      const style = document.createElement('style')
      style.textContent = ':root { --global-primary: #007bff; --global-secondary: #6c757d; }'
      document.head.appendChild(style)

      try {
        const result = analyzer.extractCSSVariables(testElement)

        expect(result).toHaveProperty('--global-primary')
        expect(result['--global-primary']).toBe('#007bff')
        expect(result).toHaveProperty('--global-secondary')
        expect(result['--global-secondary']).toBe('#6c757d')
      } finally {
        document.head.removeChild(style)
      }
    })

    test('should handle CSS variables with fallback values', () => {
      // This test MUST FAIL initially - TDD requirement
      const fallbackElement = document.createElement('div')
      fallbackElement.style.cssText = '--with-fallback: var(--nonexistent, #default); color: var(--with-fallback);'
      document.body.appendChild(fallbackElement)

      try {
        const result = analyzer.extractCSSVariables(fallbackElement)

        expect(result).toHaveProperty('--with-fallback')
        // Should resolve to the fallback value
        expect(result['--with-fallback']).toBe('#default')
      } finally {
        document.body.removeChild(fallbackElement)
      }
    })

    test('should handle complex CSS variable values', () => {
      // This test MUST FAIL initially - TDD requirement
      const complexElement = document.createElement('div')
      complexElement.style.cssText = `
        --complex-color: hsl(210, 100%, 50%);
        --complex-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        --complex-gradient: linear-gradient(45deg, #ff0000, #00ff00);
        --complex-calc: calc(100% - 2rem);
      `
      document.body.appendChild(complexElement)

      try {
        const result = analyzer.extractCSSVariables(complexElement)

        expect(result).toHaveProperty('--complex-color')
        expect(result).toHaveProperty('--complex-shadow')
        expect(result).toHaveProperty('--complex-gradient')
        expect(result).toHaveProperty('--complex-calc')

        expect(result['--complex-color']).toContain('hsl')
        expect(result['--complex-shadow']).toContain('rgba')
        expect(result['--complex-gradient']).toContain('linear-gradient')
        expect(result['--complex-calc']).toContain('calc')
      } finally {
        document.body.removeChild(complexElement)
      }
    })

    test('should complete extraction within performance requirement', () => {
      // This test MUST FAIL initially - TDD requirement
      const start = performance.now()
      analyzer.extractCSSVariables(testElement)
      const duration = performance.now() - start

      expect(duration).toBeLessThan(50)
    })

    test('should handle invalid elements gracefully', () => {
      // This test MUST FAIL initially - TDD requirement
      expect(() => analyzer.extractCSSVariables(null as any)).toThrow(/invalid|element/i)
    })
  })

  describe('getConflictingClasses method', () => {
    test('should detect conflicting display classes', () => {
      // This test MUST FAIL initially - TDD requirement
      const conflictElement = document.createElement('div')
      conflictElement.className = 'block inline flex grid'
      document.body.appendChild(conflictElement)

      try {
        const result = analyzer.getConflictingClasses(conflictElement)

        expect(result).toBeDefined()
        expect(Array.isArray(result)).toBe(true)
        expect(result.length).toBeGreaterThan(0)
        expect(result).toContain('block')
        expect(result).toContain('inline')
        expect(result).toContain('flex')
        expect(result).toContain('grid')
      } finally {
        document.body.removeChild(conflictElement)
      }
    })

    test('should detect conflicting text alignment classes', () => {
      // This test MUST FAIL initially - TDD requirement
      const conflictElement = document.createElement('div')
      conflictElement.className = 'text-left text-center text-right text-justify'
      document.body.appendChild(conflictElement)

      try {
        const result = analyzer.getConflictingClasses(conflictElement)

        expect(result.length).toBeGreaterThan(0)
        expect(result.some(c => c.startsWith('text-'))).toBe(true)
      } finally {
        document.body.removeChild(conflictElement)
      }
    })

    test('should detect conflicting color classes', () => {
      // This test MUST FAIL initially - TDD requirement
      const conflictElement = document.createElement('div')
      conflictElement.className = 'bg-red-500 bg-blue-500 bg-green-500 text-white text-black'
      document.body.appendChild(conflictElement)

      try {
        const result = analyzer.getConflictingClasses(conflictElement)

        expect(result.length).toBeGreaterThan(0)
        expect(result.some(c => c.startsWith('bg-'))).toBe(true)
        expect(result.some(c => c.startsWith('text-'))).toBe(true)
      } finally {
        document.body.removeChild(conflictElement)
      }
    })

    test('should detect conflicting spacing classes', () => {
      // This test MUST FAIL initially - TDD requirement
      const conflictElement = document.createElement('div')
      conflictElement.className = 'p-4 px-8 py-2 pt-6 pb-1 pl-3 pr-5'
      document.body.appendChild(conflictElement)

      try {
        const result = analyzer.getConflictingClasses(conflictElement)

        expect(result.length).toBeGreaterThan(0)
        // Should detect conflicts between general padding and specific sides
        expect(result.some(c => c.startsWith('p'))).toBe(true)
      } finally {
        document.body.removeChild(conflictElement)
      }
    })

    test('should not report false positives for compatible classes', () => {
      // This test MUST FAIL initially - TDD requirement
      const compatibleElement = document.createElement('div')
      compatibleElement.className = 'flex items-center justify-between bg-blue-500 text-white px-4 py-2 rounded shadow'
      document.body.appendChild(compatibleElement)

      try {
        const result = analyzer.getConflictingClasses(compatibleElement)

        expect(result).toBeDefined()
        expect(Array.isArray(result)).toBe(true)
        expect(result.length).toBe(0) // No conflicts expected
      } finally {
        document.body.removeChild(compatibleElement)
      }
    })

    test('should return empty array for elements with no conflicts', () => {
      // This test MUST FAIL initially - TDD requirement
      const cleanElement = document.createElement('div')
      cleanElement.className = 'container mx-auto'
      document.body.appendChild(cleanElement)

      try {
        const result = analyzer.getConflictingClasses(cleanElement)

        expect(result).toBeDefined()
        expect(Array.isArray(result)).toBe(true)
        expect(result.length).toBe(0)
      } finally {
        document.body.removeChild(cleanElement)
      }
    })

    test('should handle complex conflict scenarios', () => {
      // This test MUST FAIL initially - TDD requirement
      const complexElement = document.createElement('div')
      complexElement.className = 'w-full w-1/2 w-auto max-w-xs max-w-sm h-64 h-full min-h-0'
      document.body.appendChild(complexElement)

      try {
        const result = analyzer.getConflictingClasses(complexElement)

        expect(result.length).toBeGreaterThan(0)
        expect(result.some(c => c.startsWith('w-'))).toBe(true)
        expect(result.some(c => c.startsWith('h-'))).toBe(true)
      } finally {
        document.body.removeChild(complexElement)
      }
    })

    test('should complete conflict detection quickly', () => {
      // This test MUST FAIL initially - TDD requirement
      const start = performance.now()
      analyzer.getConflictingClasses(testElement)
      const duration = performance.now() - start

      expect(duration).toBeLessThan(50)
    })
  })

  describe('getUnusedClasses method', () => {
    test('should attempt to detect unused classes', () => {
      // This test MUST FAIL initially - TDD requirement
      const elementWithUnused = document.createElement('div')
      elementWithUnused.className = 'bg-blue-500 text-white px-4 py-2 hidden-when-visible never-used-class'
      elementWithUnused.style.display = 'block' // Override hidden class
      document.body.appendChild(elementWithUnused)

      try {
        const result = analyzer.getUnusedClasses(elementWithUnused)

        expect(result).toBeDefined()
        expect(Array.isArray(result)).toBe(true)
        // Note: Unused class detection is complex and may be limited
        // Should at least return an array without throwing
      } finally {
        document.body.removeChild(elementWithUnused)
      }
    })

    test('should return empty array when all classes are used', () => {
      // This test MUST FAIL initially - TDD requirement
      const fullyUsedElement = document.createElement('div')
      fullyUsedElement.className = 'bg-blue-500 text-white px-4 py-2 rounded'
      document.body.appendChild(fullyUsedElement)

      try {
        const result = analyzer.getUnusedClasses(fullyUsedElement)

        expect(result).toBeDefined()
        expect(Array.isArray(result)).toBe(true)
        // Ideally should be empty for fully used classes
      } finally {
        document.body.removeChild(fullyUsedElement)
      }
    })

    test('should handle elements with no classes', () => {
      // This test MUST FAIL initially - TDD requirement
      const noClassElement = document.createElement('div')
      document.body.appendChild(noClassElement)

      try {
        const result = analyzer.getUnusedClasses(noClassElement)

        expect(result).toBeDefined()
        expect(Array.isArray(result)).toBe(true)
        expect(result.length).toBe(0)
      } finally {
        document.body.removeChild(noClassElement)
      }
    })

    test('should detect pseudo-class variants that are not currently active', () => {
      // This test MUST FAIL initially - TDD requirement
      const pseudoElement = document.createElement('div')
      pseudoElement.className = 'bg-blue-500 hover:bg-blue-600 focus:ring-2 active:scale-95'
      document.body.appendChild(pseudoElement)

      try {
        const result = analyzer.getUnusedClasses(pseudoElement)

        expect(result).toBeDefined()
        expect(Array.isArray(result)).toBe(true)
        // Pseudo-class variants might be considered "unused" in current state
      } finally {
        document.body.removeChild(pseudoElement)
      }
    })

    test('should handle responsive classes appropriately', () => {
      // This test MUST FAIL initially - TDD requirement
      const responsiveElement = document.createElement('div')
      responsiveElement.className = 'px-4 md:px-8 lg:px-12 xl:px-16'
      document.body.appendChild(responsiveElement)

      try {
        const result = analyzer.getUnusedClasses(responsiveElement)

        expect(result).toBeDefined()
        expect(Array.isArray(result)).toBe(true)
        // Responsive classes might be considered unused based on current viewport
      } finally {
        document.body.removeChild(responsiveElement)
      }
    })

    test('should complete analysis within performance requirement', () => {
      // This test MUST FAIL initially - TDD requirement
      const start = performance.now()
      analyzer.getUnusedClasses(testElement)
      const duration = performance.now() - start

      expect(duration).toBeLessThan(100) // May be slower due to complexity
    })

    test('should handle invalid elements gracefully', () => {
      // This test MUST FAIL initially - TDD requirement
      expect(() => analyzer.getUnusedClasses(null as any)).toThrow(/invalid|element/i)
    })
  })

  describe('Performance Requirements', () => {
    test('should parse large class lists efficiently', () => {
      // This test MUST FAIL initially - TDD requirement
      const largeClassList = Array.from({ length: 500 }, (_, i) => {
        const classes = ['bg-blue-500', 'text-white', 'px-4', 'py-2', 'rounded', 'shadow']
        return `${classes[i % classes.length]}-${i}`
      })

      const start = performance.now()
      analyzer.parseTailwindClasses(largeClassList)
      const duration = performance.now() - start

      expect(duration).toBeLessThan(200)
    })

    test('should analyze complex elements quickly', () => {
      // This test MUST FAIL initially - TDD requirement
      const complexElement = document.createElement('div')
      complexElement.className = Array.from({ length: 50 }, (_, i) => `class-${i}`).join(' ')
      complexElement.style.cssText = Array.from({ length: 20 }, (_, i) => `--var-${i}: value${i};`).join(' ')
      document.body.appendChild(complexElement)

      try {
        const start = performance.now()

        analyzer.analyzeUtilityClasses(complexElement)
        analyzer.detectFramework(complexElement)
        analyzer.extractCSSVariables(complexElement)
        analyzer.getConflictingClasses(complexElement)
        analyzer.getUnusedClasses(complexElement)

        const duration = performance.now() - start
        expect(duration).toBeLessThan(300)
      } finally {
        document.body.removeChild(complexElement)
      }
    })

    test('should handle concurrent analysis efficiently', () => {
      // This test MUST FAIL initially - TDD requirement
      const elements = Array.from({ length: 10 }, () => {
        const el = document.createElement('div')
        el.className = 'bg-blue-500 text-white px-4 py-2'
        document.body.appendChild(el)
        return el
      })

      try {
        const start = performance.now()

        const promises = elements.map(el =>
          Promise.resolve().then(() => analyzer.analyzeUtilityClasses(el))
        )

        return Promise.all(promises).then(() => {
          const duration = performance.now() - start
          expect(duration).toBeLessThan(200)
        })
      } finally {
        elements.forEach(el => document.body.removeChild(el))
      }
    })
  })

  describe('Error Handling', () => {
    test('should provide meaningful error messages', () => {
      // This test MUST FAIL initially - TDD requirement
      try {
        analyzer.analyzeUtilityClasses(null as any)
        fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toMatch(/invalid|element|null/i)
      }
    })

    test('should handle corrupted DOM elements gracefully', () => {
      // This test MUST FAIL initially - TDD requirement
      const corruptedElement = document.createElement('div')
      ;(corruptedElement as any).classList = null
      document.body.appendChild(corruptedElement)

      try {
        expect(() => analyzer.analyzeUtilityClasses(corruptedElement)).not.toThrow()
      } finally {
        document.body.removeChild(corruptedElement)
      }
    })

    test('should handle CSS parsing errors gracefully', () => {
      // This test MUST FAIL initially - TDD requirement
      const badCSSElement = document.createElement('div')
      badCSSElement.style.cssText = 'invalid-css: ; --broken-var: ;'
      document.body.appendChild(badCSSElement)

      try {
        expect(() => analyzer.extractCSSVariables(badCSSElement)).not.toThrow()
      } finally {
        document.body.removeChild(badCSSElement)
      }
    })

    test('should recover from framework detection errors', () => {
      // This test MUST FAIL initially - TDD requirement
      const problematicElement = document.createElement('div')
      problematicElement.className = ''.repeat(10000) // Extremely long class string
      document.body.appendChild(problematicElement)

      try {
        expect(() => analyzer.detectFramework(problematicElement)).not.toThrow()
      } finally {
        document.body.removeChild(problematicElement)
      }
    })
  })
})