/**
 * Performance Monitor - Performance Tracking Implementation
 *
 * Monitors and tracks performance metrics for the vibe mode inspection system.
 * Provides timing utilities, cache statistics, and performance reporting.
 */

import type {
  IPerformanceMonitor,
  PerformanceMetrics
} from '@/specs/019-vibe-mode-quick/contracts/inspection-api'

import {
  DEFAULT_INSPECTION_CONFIG
} from '@/types/vibe-mode'

interface TimingEntry {
  startTime: number
  operation: string
}

interface CacheStats {
  hits: number
  misses: number
  hitRate: number
  totalRequests: number
}

interface PerformanceIssue {
  timestamp: number
  operation: string
  message: string
  details?: Record<string, any>
}

/**
 * Performance monitoring implementation for the inspection system
 */
export class PerformanceMonitor implements IPerformanceMonitor {
  private _timers = new Map<string, TimingEntry>()
  private _completedTimings = new Map<string, number[]>()
  private _cacheStats: CacheStats = {
    hits: 0,
    misses: 0,
    hitRate: 0,
    totalRequests: 0
  }
  private _issues: PerformanceIssue[] = []
  private _memoryBaseline: number = 0
  private _isDestroyed = false

  constructor(
    private _config = DEFAULT_INSPECTION_CONFIG
  ) {
    this._memoryBaseline = this._getCurrentMemoryUsage()
    this._setupPerformanceObserver()
  }

  /**
   * Start timing an operation
   */
  startTimer(operation: string): string {
    if (this._isDestroyed) {
      throw new Error('PerformanceMonitor has been destroyed')
    }

    const timerId = `${operation}-${Date.now()}-${Math.random().toString(36).slice(2)}`

    this._timers.set(timerId, {
      startTime: performance.now(),
      operation
    })

    if (this._config.debugMode) {
      console.log(`[PerformanceMonitor] Started timer: ${operation} (${timerId})`)
    }

    return timerId
  }

  /**
   * End timing an operation and return duration
   */
  endTimer(timerId: string): number {
    if (this._isDestroyed) {
      return 0
    }

    const timer = this._timers.get(timerId)
    if (!timer) {
      console.warn(`[PerformanceMonitor] Timer not found: ${timerId}`)
      return 0
    }

    const duration = performance.now() - timer.startTime
    this._timers.delete(timerId)

    // Store timing data
    const operationTimings = this._completedTimings.get(timer.operation) || []
    operationTimings.push(duration)
    this._completedTimings.set(timer.operation, operationTimings)

    // Check for performance issues
    this._checkPerformanceThresholds(timer.operation, duration)

    if (this._config.debugMode) {
      console.log(`[PerformanceMonitor] Completed timer: ${timer.operation} (${duration.toFixed(2)}ms)`)
    }

    return duration
  }

  /**
   * Start timing an operation (convenience method)
   */
  startTiming(operation: string): void {
    this.startTimer(operation)
  }

  /**
   * End timing an operation (convenience method)
   */
  endTiming(operation: string): number {
    // Find the most recent timer for this operation
    const recentTimer = Array.from(this._timers.entries())
      .filter(([_, timer]) => timer.operation === operation)
      .sort(([_, a], [__, b]) => b.startTime - a.startTime)[0]

    if (recentTimer) {
      return this.endTimer(recentTimer[0])
    }

    console.warn(`[PerformanceMonitor] No active timer found for operation: ${operation}`)
    return 0
  }

  /**
   * Record cache hit/miss
   */
  recordCacheHit(hit: boolean): void {
    if (this._isDestroyed) {
      return
    }

    this._cacheStats.totalRequests++

    if (hit) {
      this._cacheStats.hits++
    } else {
      this._cacheStats.misses++
    }

    this._cacheStats.hitRate = this._cacheStats.hits / this._cacheStats.totalRequests
  }

  /**
   * Get comprehensive performance metrics
   */
  getMetrics(): PerformanceMetrics {
    if (this._isDestroyed) {
      return this._getEmptyMetrics()
    }

    const totalAnalyses = this._getTotalAnalyses()
    const averageAnalysisTime = this._getAverageAnalysisTime()
    const memoryUsage = this._getCurrentMemoryUsage() - this._memoryBaseline
    const largestAnalysis = this._getLargestAnalysisTime()

    return {
      totalAnalyses,
      averageAnalysisTime,
      cacheHitRate: this._cacheStats.hitRate,
      memoryUsage,
      largestAnalysis
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): CacheStats {
    return { ...this._cacheStats }
  }

  /**
   * Get performance issues
   */
  getIssues(): PerformanceIssue[] {
    return [...this._issues]
  }

  /**
   * Report a performance issue
   */
  reportPerformanceIssue(
    message: string,
    details?: Record<string, any>
  ): void {
    if (this._isDestroyed) {
      return
    }

    const issue: PerformanceIssue = {
      timestamp: Date.now(),
      operation: 'manual-report',
      message,
      details
    }

    this._issues.push(issue)
    this._limitIssuesHistory()

    if (this._config.debugMode) {
      console.warn(`[PerformanceMonitor] Performance issue: ${message}`, details)
    }
  }

  /**
   * Reset performance counters
   */
  reset(): void {
    if (this._isDestroyed) {
      return
    }

    this._timers.clear()
    this._completedTimings.clear()
    this._cacheStats = {
      hits: 0,
      misses: 0,
      hitRate: 0,
      totalRequests: 0
    }
    this._issues = []
    this._memoryBaseline = this._getCurrentMemoryUsage()

    if (this._config.debugMode) {
      console.log('[PerformanceMonitor] Performance counters reset')
    }
  }

  /**
   * Get timing data for specific operation
   */
  getOperationTimings(operation: string): number[] {
    return [...(this._completedTimings.get(operation) || [])]
  }

  /**
   * Get average timing for specific operation
   */
  getAverageOperationTime(operation: string): number {
    const timings = this._completedTimings.get(operation)
    if (!timings || timings.length === 0) {
      return 0
    }

    return timings.reduce((sum, time) => sum + time, 0) / timings.length
  }

  /**
   * Get performance summary
   */
  getSummary(): string {
    const metrics = this.getMetrics()

    return `
Performance Summary:
- Total Analyses: ${metrics.totalAnalyses}
- Average Analysis Time: ${metrics.averageAnalysisTime.toFixed(2)}ms
- Cache Hit Rate: ${(metrics.cacheHitRate * 100).toFixed(1)}%
- Memory Usage: ${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB
- Largest Analysis: ${metrics.largestAnalysis.toFixed(2)}ms
- Active Timers: ${this._timers.size}
- Performance Issues: ${this._issues.length}
    `.trim()
  }

  /**
   * Destroy monitor and clean up
   */
  destroy(): void {
    if (this._isDestroyed) {
      return
    }

    this._timers.clear()
    this._completedTimings.clear()
    this._issues = []
    this._isDestroyed = true

    if (this._config.debugMode) {
      console.log('[PerformanceMonitor] Monitor destroyed')
    }
  }

  /**
   * Setup performance observer for additional metrics
   */
  private _setupPerformanceObserver(): void {
    try {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'measure' && entry.name.startsWith('vibe-')) {
              // Record custom measurements
              const operation = entry.name.replace('vibe-', '')
              const timings = this._completedTimings.get(operation) || []
              timings.push(entry.duration)
              this._completedTimings.set(operation, timings)
            }
          }
        })

        observer.observe({ entryTypes: ['measure'] })
      }
    } catch (error) {
      // PerformanceObserver not supported or failed to setup
      if (this._config.debugMode) {
        console.warn('[PerformanceMonitor] Failed to setup PerformanceObserver:', error)
      }
    }
  }

  /**
   * Check if operation exceeds performance thresholds
   */
  private _checkPerformanceThresholds(operation: string, duration: number): void {
    const thresholds = {
      'element-analysis': 50, // 50ms
      'react-inspection': 100, // 100ms
      'popup-render': 16, // 16ms (60fps)
      'cache-lookup': 5, // 5ms
      default: 100 // Default threshold
    }

    const threshold = thresholds[operation as keyof typeof thresholds] || thresholds.default

    if (duration > threshold) {
      this.reportPerformanceIssue(
        `Operation "${operation}" exceeded threshold`,
        {
          operation,
          duration: `${duration.toFixed(2)}ms`,
          threshold: `${threshold}ms`,
          severity: duration > threshold * 2 ? 'high' : 'medium'
        }
      )
    }
  }

  /**
   * Get current memory usage
   */
  private _getCurrentMemoryUsage(): number {
    try {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize || 0
      }
    } catch (error) {
      // Memory API not available
    }
    return 0
  }

  /**
   * Get total number of analyses performed
   */
  private _getTotalAnalyses(): number {
    const analysisOperations = [
      'element-analysis',
      'react-inspection',
      'css-analysis',
      'accessibility-check'
    ]

    return analysisOperations.reduce((total, operation) => {
      const timings = this._completedTimings.get(operation)
      return total + (timings ? timings.length : 0)
    }, 0)
  }

  /**
   * Get average analysis time across all operations
   */
  private _getAverageAnalysisTime(): number {
    const analysisOperations = [
      'element-analysis',
      'react-inspection',
      'css-analysis'
    ]

    let totalTime = 0
    let totalCount = 0

    analysisOperations.forEach(operation => {
      const timings = this._completedTimings.get(operation)
      if (timings && timings.length > 0) {
        totalTime += timings.reduce((sum, time) => sum + time, 0)
        totalCount += timings.length
      }
    })

    return totalCount > 0 ? totalTime / totalCount : 0
  }

  /**
   * Get the longest analysis time recorded
   */
  private _getLargestAnalysisTime(): number {
    let largest = 0

    this._completedTimings.forEach(timings => {
      const max = Math.max(...timings)
      if (max > largest) {
        largest = max
      }
    })

    return largest
  }

  /**
   * Limit the number of stored performance issues
   */
  private _limitIssuesHistory(): void {
    const maxIssues = 100
    if (this._issues.length > maxIssues) {
      this._issues = this._issues.slice(-maxIssues)
    }
  }

  /**
   * Get empty metrics for destroyed state
   */
  private _getEmptyMetrics(): PerformanceMetrics {
    return {
      totalAnalyses: 0,
      averageAnalysisTime: 0,
      cacheHitRate: 0,
      memoryUsage: 0,
      largestAnalysis: 0
    }
  }
}

/**
 * Singleton performance monitor instance
 */
let globalPerformanceMonitor: PerformanceMonitor | null = null

/**
 * Get or create the global performance monitor instance
 */
export function getGlobalPerformanceMonitor(): PerformanceMonitor {
  if (!globalPerformanceMonitor) {
    globalPerformanceMonitor = new PerformanceMonitor()
  }
  return globalPerformanceMonitor
}

/**
 * Reset the global performance monitor
 */
export function resetGlobalPerformanceMonitor(): void {
  if (globalPerformanceMonitor) {
    globalPerformanceMonitor.destroy()
    globalPerformanceMonitor = null
  }
}

/**
 * Performance measurement decorator
 */
export function measurePerformance(operation: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const monitor = getGlobalPerformanceMonitor()
      const timerId = monitor.startTimer(operation)

      try {
        const result = await originalMethod.apply(this, args)
        return result
      } finally {
        monitor.endTimer(timerId)
      }
    }

    return descriptor
  }
}

/**
 * Performance utility functions
 */
export const PerformanceUtils = {
  /**
   * Mark the start of a performance measurement
   */
  mark(name: string): void {
    try {
      performance.mark(`vibe-${name}-start`)
    } catch (error) {
      // Performance API not available
    }
  },

  /**
   * Measure time since mark
   */
  measure(name: string): number {
    try {
      const startMark = `vibe-${name}-start`
      const endMark = `vibe-${name}-end`

      performance.mark(endMark)
      performance.measure(`vibe-${name}`, startMark, endMark)

      const entries = performance.getEntriesByName(`vibe-${name}`)
      const entry = entries[entries.length - 1]

      return entry ? entry.duration : 0
    } catch (error) {
      return 0
    }
  },

  /**
   * Clear performance marks and measures
   */
  clear(name?: string): void {
    try {
      if (name) {
        performance.clearMarks(`vibe-${name}-start`)
        performance.clearMarks(`vibe-${name}-end`)
        performance.clearMeasures(`vibe-${name}`)
      } else {
        // Clear all vibe-related marks
        performance.getEntriesByType('mark')
          .filter(entry => entry.name.startsWith('vibe-'))
          .forEach(entry => performance.clearMarks(entry.name))

        performance.getEntriesByType('measure')
          .filter(entry => entry.name.startsWith('vibe-'))
          .forEach(entry => performance.clearMeasures(entry.name))
      }
    } catch (error) {
      // Performance API not available
    }
  }
}

export default PerformanceMonitor