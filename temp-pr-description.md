## Summary

Fixed balance and activity functionality not working for Lisk Sepolia testnet by ensuring the correct chain parameter is passed to API queries and fixing token configuration issues.

## Issue Link

LISK-2469 - Balance and activity not working for Sepolia

## Root Cause Analysis

The root cause was identified as missing chain parameter in API calls for activities and collectibles queries. The SDK was making requests without specifying which chain to query, causing failures on Lisk Sepolia testnet. Additionally, there were hardcoded string references to `'NATIVE_TOKEN_ADDRESS'` instead of using the proper constant, and incorrect NFT name display logic.

Key issues found:
1. `useActivities` and `useCollectibles` hooks were not passing the `chain` parameter to API calls
2. Token configuration used hardcoded strings instead of the `NATIVE_TOKEN_ADDRESS` constant
3. Collectibles list was displaying instance name instead of token name

## Changes

1. **Activity List Component** (`packages/panna-sdk/src/react/components/activity/activity-list.tsx`):
   - Added import for `getEnvironmentChain` utility
   - Added `chain: getEnvironmentChain()` parameter to the `useActivities` hook call

2. **Collectibles List Component** (`packages/panna-sdk/src/react/components/collectibles/collectibles-list.tsx`):
   - Added import for `getEnvironmentChain` utility  
   - Added `chain: getEnvironmentChain()` parameter to the `useCollectibles` hook call
   - Fixed collectible display to show `item.token.name` instead of `firstInstance.name`

3. **Token Configuration** (`packages/panna-sdk/src/react/consts/token-config.ts`):
   - Added import for `NATIVE_TOKEN_ADDRESS` constant
   - Replaced hardcoded `'NATIVE_TOKEN_ADDRESS'` strings with the proper constant in both `liskTokenConfig` and `liskSepoliaTokenConfig`

## Impact

- ✅ Balance queries now work correctly on Lisk Sepolia testnet
- ✅ Activity history now loads properly on Lisk Sepolia testnet  
- ✅ Collectibles now load correctly on Lisk Sepolia testnet
- ✅ Token configurations now use proper constants instead of hardcoded strings
- ✅ Collectible names display correctly in the UI
- ⚠️ No breaking changes to existing API

## Testing Strategy

The fix ensures that:
1. The `getEnvironmentChain()` function correctly determines the chain based on `NODE_ENV`
2. In development/staging environments, queries use `liskSepolia` chain
3. In production environments, queries use `lisk` mainnet chain
4. Token configurations properly reference the native token address constant

## Regression Risk

**Low Risk** - The changes are minimal and focused:
- Only added missing required parameters to existing API calls
- Replaced hardcoded strings with proper constants (safer)
- Fixed display logic to use correct data source
- No changes to core SDK logic or API interfaces

## Checklist

- [x] The fix has been locally tested
- [ ] New unit tests have been added to prevent future regressions
- [ ] The documentation has been updated if necessary

## Additional Notes

This fix ensures that the Panna SDK works correctly across different environments (development with Sepolia testnet and production with mainnet) by properly passing chain context to all API queries. The `getEnvironmentChain()` utility automatically selects the appropriate chain based on the `NODE_ENV` environment variable.