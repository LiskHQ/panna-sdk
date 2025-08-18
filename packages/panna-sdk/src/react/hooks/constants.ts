/**
 * Default configuration constants for React Query hooks
 */

// Time constants (in milliseconds)
export const DEFAULT_STALE_TIME = 30 * 1000; // 30 seconds
export const DEFAULT_REFETCH_INTERVAL = 60 * 1000; // 1 minute
export const DEFAULT_RETRY_DELAY = 1000; // 1 second

// Retry configuration
export const DEFAULT_MAX_RETRIES = 2;

/**
 * Default retry function for price-related data
 * @param failureCount - Number of failed attempts
 * @param hasValidClient - Whether the client is available
 * @param hasValidData - Whether the input data is valid
 * @returns Whether to retry the request
 */
export const createDefaultRetryFn = (
  hasValidClient: boolean,
  hasValidData: boolean
) => {
  return (failureCount: number) => {
    // Don't retry on client/validation errors
    if (!hasValidClient || !hasValidData) {
      return false;
    }
    return failureCount < DEFAULT_MAX_RETRIES;
  };
};
