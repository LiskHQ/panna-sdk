import { NATIVE_TOKEN_ADDRESS as THIRDWEB_NATIVE_TOKEN_ADDRESS } from 'thirdweb';
import { lisk } from './chains/chain-definitions/lisk';
import type { FiatCurrency } from './utils/types';

/**
 * Default currency used throughout the SDK when no currency is specified
 */
export const DEFAULT_CURRENCY: FiatCurrency = 'USD';

/**
 * Default country used throughout the SDK when no country is specified
 */
export const DEFAULT_COUNTRY_CODE = 'US';

/**
 * Default blockchain used throughout the SDK when no chain is specified
 */
export const DEFAULT_CHAIN = lisk;

/**
 * Standard address used to represent native token (ETH)
 */
export const NATIVE_TOKEN_ADDRESS = THIRDWEB_NATIVE_TOKEN_ADDRESS;
