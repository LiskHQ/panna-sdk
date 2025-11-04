import { lisk, liskSepolia } from '../../core';

/**
 * Panna API environment base URLs
 * Can be overridden via environment variables for custom deployments
 */
enum ChainEnvironment {
  MAINNET = 'https://panna-app.lisk.com',
  SEPOLIA = 'https://stg-panna-app.lisk.com',
  DEVELOPMENT = 'http://localhost:8080'
}

/**
 * API version string used in URL construction
 */
const PANNA_API_VERSION = 'v1';

/**
 * Get base URL for a specific environment with optional environment variable override
 * @param env - The chain environment enum value
 * @param envVarName - Optional environment variable name to check for override
 * @returns The base URL for the environment
 */
function getBaseUrl(env: ChainEnvironment, envVarName?: string): string {
  // Check for environment variable override (works in both Node.js and bundled environments)
  if (envVarName) {
    try {
      // Check if process.env exists (Node.js or bundled with env vars)
      // Using globalThis to safely access process in cross-platform code
      const globalProcess = (
        globalThis as unknown as {
          process?: { env?: Record<string, string | undefined> };
        }
      ).process;
      if (globalProcess?.env) {
        const envValue = globalProcess.env[envVarName];
        if (envValue) {
          return envValue;
        }
      }
    } catch {
      // Ignore errors when process is not available (browser environment)
    }
  }
  return env;
}

/**
 * Mapping of chain IDs to their respective API environments
 */
const CHAIN_TO_ENV: Record<string, { env: ChainEnvironment; envVar?: string }> =
  {
    [String(lisk.id)]: {
      env: ChainEnvironment.MAINNET,
      envVar: 'PANNA_API_URL_MAINNET'
    },
    [String(liskSepolia.id)]: {
      env: ChainEnvironment.SEPOLIA,
      envVar: 'PANNA_API_URL_SEPOLIA'
    }
  };

/**
 * Development environment configuration
 */
const DEV_CONFIG = {
  env: ChainEnvironment.DEVELOPMENT,
  envVar: 'PANNA_API_URL_DEV'
};

/**
 * Determines the Panna API URL based on chain ID and environment mode
 *
 * @param chainId - The blockchain chain ID as a string
 * @param isDevMode - Whether development mode is enabled (uses localhost or custom dev URL)
 * @returns The complete Panna API URL with version path
 * @throws {Error} If the chain ID is not supported and no dev mode is enabled
 *
 * @remarks
 * Supported chains:
 * - Lisk mainnet (4202): Uses production API (https://panna-app.lisk.com/v1)
 * - Lisk Sepolia (4202): Uses staging API (https://stg-panna-app.lisk.com/v1)
 * - Dev mode: Uses localhost (http://localhost:8080/v1) or custom URL
 *
 * Environment variable overrides:
 * - `PANNA_API_URL_MAINNET`: Override mainnet API URL
 * - `PANNA_API_URL_SEPOLIA`: Override sepolia API URL
 * - `PANNA_API_URL_DEV`: Override development API URL
 *
 * @example
 * ```ts
 * // Get mainnet URL
 * const url = getPannaApiUrl(String(lisk.id), false);
 * // Returns: 'https://panna-app.lisk.com/v1'
 *
 * // Get dev URL
 * const devUrl = getPannaApiUrl(String(lisk.id), true);
 * // Returns: 'http://localhost:8080/v1'
 *
 * // Unsupported chain throws error
 * const invalid = getPannaApiUrl('999999', false);
 * // Throws: Error with supported chains message
 * ```
 */
export function getPannaApiUrl(chainId: string, isDevMode: boolean): string {
  // Development mode takes precedence
  if (isDevMode) {
    const baseUrl = getBaseUrl(DEV_CONFIG.env, DEV_CONFIG.envVar);
    return `${baseUrl}/${PANNA_API_VERSION}`;
  }

  // Look up chain configuration
  const config = CHAIN_TO_ENV[chainId];

  if (!config) {
    // Chain not supported - log warning and throw error
    console.warn(
      `Unsupported chain ID: ${chainId}. Panna API URL could not be determined.\n` +
        `Supported chains:\n` +
        `  - Lisk mainnet: ${lisk.id}\n` +
        `  - Lisk Sepolia: ${liskSepolia.id}\n` +
        `Tip: Enable dev mode with enableDevMode=true to use localhost.`
    );

    throw new Error(
      `Unsupported chain ID: ${chainId}. ` +
        `Supported chains are Lisk mainnet (${lisk.id}) and Lisk Sepolia (${liskSepolia.id}). ` +
        `Enable dev mode with enableDevMode=true to use localhost.`
    );
  }

  const baseUrl = getBaseUrl(config.env, config.envVar);
  return `${baseUrl}/${PANNA_API_VERSION}`;
}
