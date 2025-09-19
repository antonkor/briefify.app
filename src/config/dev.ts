export const isDev = process.env.NODE_ENV === 'development';

export const devConfig = {
  enableDebugLogs: isDev,
  enableVerboseErrors: isDev,
  enablePerformanceMonitoring: isDev,
  enableNetworkRetries: true,
  defaultRetryCount: isDev ? 1 : 3,
  defaultRetryDelay: isDev ? 500 : 1000,
  enableMockData: false, // Set to true to use mock data instead of fetching
  enableWorkshopMode: isDev,
  enableConsoleWarnings: isDev,
};

export const logger = {
  debug: (...args: any[]) => {
    if (devConfig.enableDebugLogs) {
      console.log('[DEBUG]', ...args);
    }
  },
  dev: (...args: any[]) => {
    if (devConfig.enableDebugLogs) {
      console.log('[DEV]', ...args);
    }
  },
  error: (...args: any[]) => {
    if (devConfig.enableVerboseErrors) {
      console.error('[ERROR]', ...args);
    }
  },
  warn: (...args: any[]) => {
    if (devConfig.enableConsoleWarnings) {
      console.warn('[WARN]', ...args);
    }
  },
  performance: (label: string, fn: () => void) => {
    if (devConfig.enablePerformanceMonitoring) {
      console.time(label);
      fn();
      console.timeEnd(label);
    } else {
      fn();
    }
  },
};

export const devTools = {
  logFetchAttempt: (url: string, attempt: number, maxAttempts: number) => {
    logger.debug(`Fetch attempt ${attempt}/${maxAttempts} for ${url}`);
  },
  logFetchSuccess: (url: string, responseTime: number) => {
    logger.debug(`Fetch succeeded for ${url} in ${responseTime}ms`);
  },
  logFetchError: (url: string, error: Error, attempt: number) => {
    logger.error(`Fetch failed for ${url} (attempt ${attempt}):`, error);
  },
};