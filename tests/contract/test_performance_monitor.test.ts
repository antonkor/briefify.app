/**
 * Contract Test: IPerformanceMonitor Interface
 *
 * These tests MUST FAIL initially (TDD approach) and define the contract
 * that any IPerformanceMonitor implementation must satisfy.
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals'
import type { IPerformanceMonitor } from '@/specs/019-vibe-mode-quick/contracts/inspection-api'
import type { PerformanceMetrics } from '@/types/vibe-mode'

// Mock implementation for testing (will be replaced with real implementation)
class MockPerformanceMonitor implements IPerformanceMonitor {
  startTimer(operation: string): string {
    throw new Error('Not implemented - this test should fail initially')
  }

  endTimer(timerId: string): number {
    throw new Error('Not implemented - this test should fail initially')
  }

  recordMetric(name: string, value: number, category?: string): void {
    throw new Error('Not implemented - this test should fail initially')
  }

  getMetrics(): PerformanceMetrics {
    throw new Error('Not implemented - this test should fail initially')
  }

  getCacheStats(): { size: number; hitRate: number; maxSize: number } {
    throw new Error('Not implemented - this test should fail initially')
  }

  clearMetrics(): void {
    throw new Error('Not implemented - this test should fail initially')
  }

  startMemoryProfiling(): void {
    throw new Error('Not implemented - this test should fail initially')
  }

  stopMemoryProfiling(): number {
    throw new Error('Not implemented - this test should fail initially')
  }

  reportPerformanceIssue(issue: string, context?: any): void {
    throw new Error('Not implemented - this test should fail initially')
  }
}

describe('IPerformanceMonitor Contract', () => {
  let monitor: IPerformanceMonitor
  let consoleWarnSpy: jest.SpyInstance
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    monitor = new MockPerformanceMonitor()

    // Spy on console methods to verify logging
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleWarnSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  describe('startTimer method', () => {
    test('should start a performance timer and return timer ID', () => {
      // This test MUST FAIL initially - TDD requirement
      const timerId = monitor.startTimer('element-analysis')

      expect(timerId).toBeDefined()
      expect(typeof timerId).toBe('string')
      expect(timerId.length).toBeGreaterThan(0)
    })

    test('should generate unique timer IDs for concurrent operations', () => {
      // This test MUST FAIL initially - TDD requirement
      const timerId1 = monitor.startTimer('operation-1')
      const timerId2 = monitor.startTimer('operation-2')
      const timerId3 = monitor.startTimer('operation-3')

      expect(timerId1).not.toBe(timerId2)
      expect(timerId2).not.toBe(timerId3)
      expect(timerId1).not.toBe(timerId3)
    })

    test('should handle the same operation name for multiple timers', () => {
      // This test MUST FAIL initially - TDD requirement
      const timerId1 = monitor.startTimer('analysis')
      const timerId2 = monitor.startTimer('analysis')

      expect(timerId1).not.toBe(timerId2)
      expect(typeof timerId1).toBe('string')
      expect(typeof timerId2).toBe('string')
    })

    test('should validate operation name parameter', () => {
      // This test MUST FAIL initially - TDD requirement
      expect(() => monitor.startTimer('')).toThrow(/empty|invalid|operation/i)
      expect(() => monitor.startTimer(null as any)).toThrow(/null|invalid|operation/i)
      expect(() => monitor.startTimer(undefined as any)).toThrow(/undefined|invalid|operation/i)
    })

    test('should handle special characters in operation names', () => {
      // This test MUST FAIL initially - TDD requirement
      const specialNames = [
        'operation-with-dashes',
        'operation_with_underscores',
        'operation.with.dots',
        'operation with spaces',
        'operation:with:colons'
      ]

      specialNames.forEach(name => {
        const timerId = monitor.startTimer(name)
        expect(timerId).toBeDefined()
        expect(typeof timerId).toBe('string')
      })
    })

    test('should be performant for rapid timer creation', () => {
      // This test MUST FAIL initially - TDD requirement
      const start = performance.now()

      const timerIds = []
      for (let i = 0; i < 1000; i++) {
        timerIds.push(monitor.startTimer(`operation-${i}`))
      }

      const duration = performance.now() - start
      expect(duration).toBeLessThan(100) // Should create 1000 timers in <100ms
      expect(timerIds.length).toBe(1000)
    })

    test('should handle memory constraints gracefully', () => {
      // This test MUST FAIL initially - TDD requirement
      const timerIds = []

      // Create many timers to test memory handling
      for (let i = 0; i < 10000; i++) {
        const timerId = monitor.startTimer(`stress-test-${i}`)
        timerIds.push(timerId)
      }

      expect(timerIds.length).toBe(10000)
      expect(() => monitor.startTimer('additional-timer')).not.toThrow()
    })
  })

  describe('endTimer method', () => {
    test('should end timer and return elapsed time in milliseconds', () => {
      // This test MUST FAIL initially - TDD requirement
      const timerId = monitor.startTimer('test-operation')

      // Add small delay
      const startTime = Date.now()
      while (Date.now() - startTime < 10) {
        // Busy wait for 10ms
      }

      const duration = monitor.endTimer(timerId)

      expect(typeof duration).toBe('number')
      expect(duration).toBeGreaterThan(0)
      expect(duration).toBeGreaterThanOrEqual(10)
      expect(duration).toBeLessThan(1000) // Should be reasonable
    })

    test('should handle invalid timer IDs gracefully', () => {
      // This test MUST FAIL initially - TDD requirement
      expect(() => monitor.endTimer('invalid-timer-id')).toThrow(/invalid|not found|timer/i)
      expect(() => monitor.endTimer('')).toThrow(/empty|invalid|timer/i)
      expect(() => monitor.endTimer(null as any)).toThrow(/null|invalid|timer/i)
    })

    test('should prevent double-ending of timers', () => {
      // This test MUST FAIL initially - TDD requirement
      const timerId = monitor.startTimer('single-use-timer')
      const duration1 = monitor.endTimer(timerId)

      expect(typeof duration1).toBe('number')
      expect(() => monitor.endTimer(timerId)).toThrow(/already ended|invalid|timer/i)
    })

    test('should maintain timer accuracy for various durations', () => {
      // This test MUST FAIL initially - TDD requirement
      const shortTimerId = monitor.startTimer('short-operation')
      const shortDuration = monitor.endTimer(shortTimerId)
      expect(shortDuration).toBeGreaterThanOrEqual(0)
      expect(shortDuration).toBeLessThan(10)

      const mediumTimerId = monitor.startTimer('medium-operation')
      const startTime = Date.now()
      while (Date.now() - startTime < 50) {
        // Busy wait for ~50ms
      }
      const mediumDuration = monitor.endTimer(mediumTimerId)
      expect(mediumDuration).toBeGreaterThanOrEqual(45)
      expect(mediumDuration).toBeLessThan(100)
    })

    test('should handle concurrent timer endings', () => {
      // This test MUST FAIL initially - TDD requirement
      const timerIds = []
      for (let i = 0; i < 10; i++) {
        timerIds.push(monitor.startTimer(`concurrent-${i}`))
      }

      const durations = timerIds.map(id => monitor.endTimer(id))

      expect(durations.length).toBe(10)
      durations.forEach(duration => {
        expect(typeof duration).toBe('number')
        expect(duration).toBeGreaterThanOrEqual(0)
      })
    })

    test('should record metrics automatically when timer ends', () => {
      // This test MUST FAIL initially - TDD requirement
      const timerId = monitor.startTimer('auto-record-test')
      monitor.endTimer(timerId)

      const metrics = monitor.getMetrics()
      expect(metrics.totalAnalyses).toBeGreaterThan(0)
    })
  })

  describe('recordMetric method', () => {
    test('should record performance metric with name and value', () => {
      // This test MUST FAIL initially - TDD requirement
      monitor.recordMetric('analysis-time', 150.5)
      monitor.recordMetric('cache-hit-rate', 0.85)
      monitor.recordMetric('memory-usage', 1024000)

      const metrics = monitor.getMetrics()
      expect(metrics).toBeDefined()
      expect(typeof metrics.totalAnalyses).toBe('number')
      expect(typeof metrics.averageAnalysisTime).toBe('number')
    })

    test('should support optional category parameter', () => {
      // This test MUST FAIL initially - TDD requirement
      monitor.recordMetric('dom-traversal', 25.3, 'performance')
      monitor.recordMetric('react-analysis', 45.7, 'analysis')
      monitor.recordMetric('cache-size', 100, 'memory')

      // Should not throw and should be categorized properly
      expect(() => monitor.getMetrics()).not.toThrow()
    })

    test('should validate metric parameters', () => {
      // This test MUST FAIL initially - TDD requirement
      expect(() => monitor.recordMetric('', 100)).toThrow(/empty|invalid|name/i)
      expect(() => monitor.recordMetric('test', NaN)).toThrow(/invalid|value|number/i)
      expect(() => monitor.recordMetric('test', Infinity)).toThrow(/invalid|value|finite/i)
      expect(() => monitor.recordMetric(null as any, 100)).toThrow(/null|invalid|name/i)
    })

    test('should handle negative values appropriately', () => {
      // This test MUST FAIL initially - TDD requirement
      // Some metrics might legitimately be negative (e.g., performance deltas)
      expect(() => monitor.recordMetric('delta-time', -10.5)).not.toThrow()

      // But some should be validated as positive only
      expect(() => monitor.recordMetric('memory-usage', -1024)).toThrow(/negative|invalid|memory/i)
    })

    test('should handle very large metric values', () => {
      // This test MUST FAIL initially - TDD requirement
      const largeValue = Number.MAX_SAFE_INTEGER - 1
      expect(() => monitor.recordMetric('large-metric', largeValue)).not.toThrow()

      const tooLarge = Number.MAX_VALUE
      expect(() => monitor.recordMetric('too-large', tooLarge)).toThrow(/too large|overflow/i)
    })

    test('should maintain performance for high-frequency recording', () => {
      // This test MUST FAIL initially - TDD requirement
      const start = performance.now()

      for (let i = 0; i < 1000; i++) {
        monitor.recordMetric(`metric-${i}`, Math.random() * 100, 'batch')
      }

      const duration = performance.now() - start
      expect(duration).toBeLessThan(100) // Should record 1000 metrics in <100ms
    })

    test('should aggregate metrics correctly', () => {
      // This test MUST FAIL initially - TDD requirement
      monitor.recordMetric('analysis-time', 100)
      monitor.recordMetric('analysis-time', 200)
      monitor.recordMetric('analysis-time', 300)

      const metrics = monitor.getMetrics()
      expect(metrics.totalAnalyses).toBeGreaterThanOrEqual(3)
      expect(metrics.averageAnalysisTime).toBe(200) // (100 + 200 + 300) / 3
    })
  })

  describe('getMetrics method', () => {
    test('should return current performance metrics', () => {
      // This test MUST FAIL initially - TDD requirement
      const metrics = monitor.getMetrics()

      expect(metrics).toBeDefined()
      expect(typeof metrics.totalAnalyses).toBe('number')
      expect(typeof metrics.averageAnalysisTime).toBe('number')
      expect(typeof metrics.cacheHitRate).toBe('number')
      expect(typeof metrics.memoryUsage).toBe('number')
      expect(typeof metrics.largestAnalysis).toBe('number')

      expect(metrics.totalAnalyses).toBeGreaterThanOrEqual(0)
      expect(metrics.averageAnalysisTime).toBeGreaterThanOrEqual(0)
      expect(metrics.cacheHitRate).toBeGreaterThanOrEqual(0)
      expect(metrics.cacheHitRate).toBeLessThanOrEqual(1)
      expect(metrics.memoryUsage).toBeGreaterThanOrEqual(0)
    })

    test('should return consistent metrics across multiple calls', () => {
      // This test MUST FAIL initially - TDD requirement
      monitor.recordMetric('test-metric', 100)

      const metrics1 = monitor.getMetrics()
      const metrics2 = monitor.getMetrics()

      expect(metrics1.totalAnalyses).toBe(metrics2.totalAnalyses)
      expect(metrics1.averageAnalysisTime).toBe(metrics2.averageAnalysisTime)
      expect(metrics1.cacheHitRate).toBe(metrics2.cacheHitRate)
    })

    test('should reflect real-time changes', () => {
      // This test MUST FAIL initially - TDD requirement
      const initialMetrics = monitor.getMetrics()

      monitor.recordMetric('analysis-time', 150)

      const updatedMetrics = monitor.getMetrics()
      expect(updatedMetrics.totalAnalyses).toBeGreaterThan(initialMetrics.totalAnalyses)
    })

    test('should be performant for frequent access', () => {
      // This test MUST FAIL initially - TDD requirement
      const start = performance.now()

      for (let i = 0; i < 1000; i++) {
        monitor.getMetrics()
      }

      const duration = performance.now() - start
      expect(duration).toBeLessThan(50) // Should handle 1000 calls in <50ms
    })

    test('should handle empty metrics gracefully', () => {
      // This test MUST FAIL initially - TDD requirement
      monitor.clearMetrics()

      const metrics = monitor.getMetrics()
      expect(metrics.totalAnalyses).toBe(0)
      expect(metrics.averageAnalysisTime).toBe(0)
      expect(metrics.cacheHitRate).toBeGreaterThanOrEqual(0)
    })

    test('should provide meaningful default values', () => {
      // This test MUST FAIL initially - TDD requirement
      const freshMonitor = new MockPerformanceMonitor()
      const metrics = freshMonitor.getMetrics()

      expect(metrics.totalAnalyses).toBe(0)
      expect(metrics.averageAnalysisTime).toBe(0)
      expect(metrics.memoryUsage).toBeGreaterThanOrEqual(0)
      expect(metrics.largestAnalysis).toBe(0)
    })
  })

  describe('getCacheStats method', () => {
    test('should return cache statistics', () => {
      // This test MUST FAIL initially - TDD requirement
      const stats = monitor.getCacheStats()

      expect(stats).toBeDefined()
      expect(typeof stats.size).toBe('number')
      expect(typeof stats.hitRate).toBe('number')
      expect(typeof stats.maxSize).toBe('number')

      expect(stats.size).toBeGreaterThanOrEqual(0)
      expect(stats.hitRate).toBeGreaterThanOrEqual(0)
      expect(stats.hitRate).toBeLessThanOrEqual(1)
      expect(stats.maxSize).toBeGreaterThan(0)
      expect(stats.size).toBeLessThanOrEqual(stats.maxSize)
    })

    test('should reflect cache configuration limits', () => {
      // This test MUST FAIL initially - TDD requirement
      const stats = monitor.getCacheStats()

      expect(stats.maxSize).toBe(100) // From DEFAULT_INSPECTION_CONFIG
    })

    test('should update size as cache is used', () => {
      // This test MUST FAIL initially - TDD requirement
      const initialStats = monitor.getCacheStats()

      // Simulate cache usage through timer operations
      const timerId = monitor.startTimer('cache-test')
      monitor.endTimer(timerId)

      const updatedStats = monitor.getCacheStats()
      // Cache might have grown or hit rate might have changed
      expect(updatedStats.size).toBeGreaterThanOrEqual(initialStats.size)
    })

    test('should calculate hit rate correctly', () => {
      // This test MUST FAIL initially - TDD requirement
      const stats = monitor.getCacheStats()

      if (stats.size > 0) {
        expect(stats.hitRate).toBeGreaterThan(0)
        expect(stats.hitRate).toBeLessThanOrEqual(1)
      } else {
        expect(stats.hitRate).toBeGreaterThanOrEqual(0)
      }
    })

    test('should handle cache overflow scenarios', () => {
      // This test MUST FAIL initially - TDD requirement
      // Simulate many operations to potentially fill cache
      for (let i = 0; i < 150; i++) {
        const timerId = monitor.startTimer(`overflow-test-${i}`)
        monitor.endTimer(timerId)
      }

      const stats = monitor.getCacheStats()
      expect(stats.size).toBeLessThanOrEqual(stats.maxSize)
    })
  })

  describe('clearMetrics method', () => {
    test('should reset all performance metrics', () => {
      // This test MUST FAIL initially - TDD requirement
      // Record some metrics first
      monitor.recordMetric('test-metric', 100)
      monitor.recordMetric('another-metric', 200)

      const beforeClear = monitor.getMetrics()
      expect(beforeClear.totalAnalyses).toBeGreaterThan(0)

      monitor.clearMetrics()

      const afterClear = monitor.getMetrics()
      expect(afterClear.totalAnalyses).toBe(0)
      expect(afterClear.averageAnalysisTime).toBe(0)
      expect(afterClear.largestAnalysis).toBe(0)
    })

    test('should not affect cache statistics', () => {
      // This test MUST FAIL initially - TDD requirement
      const beforeClear = monitor.getCacheStats()

      monitor.clearMetrics()

      const afterClear = monitor.getCacheStats()
      expect(afterClear.size).toBe(beforeClear.size)
      expect(afterClear.maxSize).toBe(beforeClear.maxSize)
    })

    test('should be safe to call multiple times', () => {
      // This test MUST FAIL initially - TDD requirement
      expect(() => {
        monitor.clearMetrics()
        monitor.clearMetrics()
        monitor.clearMetrics()
      }).not.toThrow()

      const metrics = monitor.getMetrics()
      expect(metrics.totalAnalyses).toBe(0)
    })

    test('should allow fresh metric recording after clear', () => {
      // This test MUST FAIL initially - TDD requirement
      monitor.recordMetric('before-clear', 100)
      monitor.clearMetrics()
      monitor.recordMetric('after-clear', 200)

      const metrics = monitor.getMetrics()
      expect(metrics.totalAnalyses).toBe(1)
      expect(metrics.averageAnalysisTime).toBe(200)
    })
  })

  describe('startMemoryProfiling method', () => {
    test('should initiate memory profiling session', () => {
      // This test MUST FAIL initially - TDD requirement
      expect(() => monitor.startMemoryProfiling()).not.toThrow()
    })

    test('should handle concurrent profiling sessions', () => {
      // This test MUST FAIL initially - TDD requirement
      monitor.startMemoryProfiling()

      // Starting another session should either work or provide clear feedback
      expect(() => monitor.startMemoryProfiling()).not.toThrow()
    })

    test('should be performant to start', () => {
      // This test MUST FAIL initially - TDD requirement
      const start = performance.now()
      monitor.startMemoryProfiling()
      const duration = performance.now() - start

      expect(duration).toBeLessThan(10) // Should start quickly
    })

    test('should work with limited memory API support', () => {
      // This test MUST FAIL initially - TDD requirement
      // Mock absence of memory API
      const originalMemory = (performance as any).memory
      delete (performance as any).memory

      try {
        expect(() => monitor.startMemoryProfiling()).not.toThrow()
      } finally {
        if (originalMemory) {
          (performance as any).memory = originalMemory
        }
      }
    })
  })

  describe('stopMemoryProfiling method', () => {
    test('should end profiling and return memory usage delta', () => {
      // This test MUST FAIL initially - TDD requirement
      monitor.startMemoryProfiling()

      // Simulate some memory usage
      const largeArray = new Array(1000).fill('memory-test')

      const memoryDelta = monitor.stopMemoryProfiling()

      expect(typeof memoryDelta).toBe('number')
      expect(memoryDelta).toBeGreaterThanOrEqual(0)

      // Clean up
      largeArray.length = 0
    })

    test('should handle stop without start gracefully', () => {
      // This test MUST FAIL initially - TDD requirement
      expect(() => monitor.stopMemoryProfiling()).toThrow(/not started|no profiling/i)
    })

    test('should prevent double stopping', () => {
      // This test MUST FAIL initially - TDD requirement
      monitor.startMemoryProfiling()
      const delta1 = monitor.stopMemoryProfiling()

      expect(typeof delta1).toBe('number')
      expect(() => monitor.stopMemoryProfiling()).toThrow(/already stopped|not started/i)
    })

    test('should record memory metrics automatically', () => {
      // This test MUST FAIL initially - TDD requirement
      monitor.startMemoryProfiling()
      const memoryDelta = monitor.stopMemoryProfiling()

      const metrics = monitor.getMetrics()
      expect(metrics.memoryUsage).toBeGreaterThanOrEqual(0)
    })

    test('should handle memory API unavailability', () => {
      // This test MUST FAIL initially - TDD requirement
      const originalMemory = (performance as any).memory
      delete (performance as any).memory

      try {
        monitor.startMemoryProfiling()
        const delta = monitor.stopMemoryProfiling()

        expect(typeof delta).toBe('number')
        expect(delta).toBeGreaterThanOrEqual(0)
      } finally {
        if (originalMemory) {
          (performance as any).memory = originalMemory
        }
      }
    })
  })

  describe('reportPerformanceIssue method', () => {
    test('should log performance issue with description', () => {
      // This test MUST FAIL initially - TDD requirement
      monitor.reportPerformanceIssue('Analysis timeout exceeded')

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Performance issue'),
        expect.stringContaining('Analysis timeout exceeded')
      )
    })

    test('should include context information when provided', () => {
      // This test MUST FAIL initially - TDD requirement
      const context = {
        operation: 'element-analysis',
        duration: 500,
        elementTag: 'div',
        classCount: 50
      }

      monitor.reportPerformanceIssue('Slow analysis detected', context)

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Performance issue'),
        expect.stringContaining('Slow analysis detected'),
        expect.objectContaining(context)
      )
    })

    test('should handle various context types', () => {
      // This test MUST FAIL initially - TDD requirement
      const contexts = [
        'string context',
        123,
        { object: 'context' },
        ['array', 'context'],
        null,
        undefined
      ]

      contexts.forEach((context, index) => {
        expect(() =>
          monitor.reportPerformanceIssue(`Issue ${index}`, context)
        ).not.toThrow()
      })

      expect(consoleWarnSpy).toHaveBeenCalledTimes(6)
    })

    test('should rate limit excessive issue reporting', () => {
      // This test MUST FAIL initially - TDD requirement
      // Report many identical issues rapidly
      for (let i = 0; i < 100; i++) {
        monitor.reportPerformanceIssue('Repeated issue')
      }

      // Should not have logged all 100 instances
      expect(consoleWarnSpy.mock.calls.length).toBeLessThan(100)
      expect(consoleWarnSpy.mock.calls.length).toBeGreaterThan(0)
    })

    test('should categorize critical vs warning issues', () => {
      // This test MUST FAIL initially - TDD requirement
      monitor.reportPerformanceIssue('Memory leak detected')
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Critical performance issue')
      )

      monitor.reportPerformanceIssue('Slow operation')
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Performance issue')
      )
    })

    test('should include stack trace for critical issues', () => {
      // This test MUST FAIL initially - TDD requirement
      monitor.reportPerformanceIssue('System performance degraded')

      const lastCall = consoleErrorSpy.mock.calls[consoleErrorSpy.mock.calls.length - 1]
      if (lastCall) {
        expect(lastCall.some(arg =>
          typeof arg === 'string' && arg.includes('stack')
        )).toBe(true)
      }
    })

    test('should integrate with external monitoring services', () => {
      // This test MUST FAIL initially - TDD requirement
      // Mock external service
      const mockService = { reportError: jest.fn() }
      ;(globalThis as any).performanceMonitoringService = mockService

      try {
        monitor.reportPerformanceIssue('External service test')

        expect(mockService.reportError).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'External service test'
          })
        )
      } finally {
        delete (globalThis as any).performanceMonitoringService
      }
    })
  })

  describe('Performance Requirements', () => {
    test('should maintain low overhead for monitoring operations', () => {
      // This test MUST FAIL initially - TDD requirement
      const start = performance.now()

      // Perform many monitoring operations
      for (let i = 0; i < 1000; i++) {
        const timerId = monitor.startTimer(`perf-test-${i}`)
        monitor.recordMetric(`metric-${i}`, Math.random() * 100)
        monitor.endTimer(timerId)
        monitor.getMetrics()
        monitor.getCacheStats()
      }

      const duration = performance.now() - start
      expect(duration).toBeLessThan(500) // Should handle 1000 operations in <500ms
    })

    test('should scale with increasing metric count', () => {
      // This test MUST FAIL initially - TDD requirement
      // Test with different metric counts
      const testScales = [100, 500, 1000, 2000]

      testScales.forEach(scale => {
        const start = performance.now()

        for (let i = 0; i < scale; i++) {
          monitor.recordMetric(`scale-test-${scale}-${i}`, i)
        }

        const duration = performance.now() - start
        expect(duration).toBeLessThan(scale * 0.1) // Linear scaling expectation
      })
    })

    test('should handle memory pressure gracefully', () => {
      // This test MUST FAIL initially - TDD requirement
      monitor.startMemoryProfiling()

      // Create significant memory pressure
      const memoryHogs = []
      for (let i = 0; i < 100; i++) {
        memoryHogs.push(new Array(1000).fill(`memory-${i}`))
      }

      const memoryDelta = monitor.stopMemoryProfiling()
      expect(typeof memoryDelta).toBe('number')
      expect(memoryDelta).toBeGreaterThan(0)

      // Monitor should still function
      expect(() => monitor.getMetrics()).not.toThrow()

      // Clean up
      memoryHogs.length = 0
    })

    test('should maintain accuracy under concurrent load', () => {
      // This test MUST FAIL initially - TDD requirement
      const promises = []

      for (let i = 0; i < 50; i++) {
        promises.push(
          Promise.resolve().then(() => {
            const timerId = monitor.startTimer(`concurrent-${i}`)
            monitor.recordMetric(`concurrent-metric-${i}`, i * 10)
            return monitor.endTimer(timerId)
          })
        )
      }

      return Promise.all(promises).then(durations => {
        expect(durations.length).toBe(50)
        durations.forEach(duration => {
          expect(typeof duration).toBe('number')
          expect(duration).toBeGreaterThanOrEqual(0)
        })

        const metrics = monitor.getMetrics()
        expect(metrics.totalAnalyses).toBeGreaterThanOrEqual(50)
      })
    })
  })

  describe('Error Handling', () => {
    test('should provide meaningful error messages', () => {
      // This test MUST FAIL initially - TDD requirement
      try {
        monitor.endTimer('nonexistent-timer')
        fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toMatch(/timer|not found|invalid/i)
      }
    })

    test('should handle system resource exhaustion', () => {
      // This test MUST FAIL initially - TDD requirement
      // Mock system resource exhaustion
      const originalNow = performance.now
      let callCount = 0
      performance.now = () => {
        callCount++
        if (callCount > 1000) {
          throw new Error('System resources exhausted')
        }
        return originalNow.call(performance)
      }

      try {
        expect(() => {
          for (let i = 0; i < 2000; i++) {
            monitor.startTimer(`stress-${i}`)
          }
        }).not.toThrow()
      } finally {
        performance.now = originalNow
      }
    })

    test('should recover from corrupted metric data', () => {
      // This test MUST FAIL initially - TDD requirement
      // Simulate data corruption
      monitor.recordMetric('normal-metric', 100)
      monitor.recordMetric('corrupted-metric', NaN)
      monitor.recordMetric('another-normal', 200)

      const metrics = monitor.getMetrics()
      expect(metrics).toBeDefined()
      expect(typeof metrics.totalAnalyses).toBe('number')
      expect(isNaN(metrics.averageAnalysisTime)).toBe(false)
    })

    test('should handle browser API unavailability', () => {
      // This test MUST FAIL initially - TDD requirement
      // Mock performance API unavailability
      const originalPerformance = globalThis.performance
      delete (globalThis as any).performance

      try {
        expect(() => {
          const freshMonitor = new MockPerformanceMonitor()
          freshMonitor.recordMetric('test', 100)
          freshMonitor.getMetrics()
        }).not.toThrow()
      } finally {
        globalThis.performance = originalPerformance
      }
    })

    test('should handle storage quota exceeded gracefully', () => {
      // This test MUST FAIL initially - TDD requirement
      // Mock storage quota exceeded
      const originalLocalStorage = globalThis.localStorage
      globalThis.localStorage = {
        ...originalLocalStorage,
        setItem: () => {
          throw new Error('QuotaExceededError: Storage quota exceeded')
        }
      } as any

      try {
        expect(() => {
          for (let i = 0; i < 100; i++) {
            monitor.recordMetric(`storage-test-${i}`, i)
          }
        }).not.toThrow()
      } finally {
        globalThis.localStorage = originalLocalStorage
      }
    })
  })
})