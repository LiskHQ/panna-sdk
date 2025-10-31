## Summary

This PR implements a comprehensive "Add Funds" UI flow that enables users to add assets to their Panna SDK wallet through two methods: buying crypto with fiat currency via on-ramp providers, or transferring assets from external wallets (MetaMask, Coinbase Wallet, etc.).

## Rationale

Users need seamless ways to fund their wallets within dApps. Previously, the buy flow existed in isolation, and there was no way to transfer assets from external wallets. This feature consolidates funding options into a unified, intuitive flow that:

- Provides a centralized entry point for all funding methods
- Leverages existing external wallet connections to enable asset transfers
- Improves the overall user experience by offering multiple funding options
- Reduces friction in the onboarding process by supporting various user preferences

## Changes

### New Features

1. **Add Funds Entry Flow**
   - Created unified entry point (`AddFundsEntryStep`) with two options:
     - Buy crypto with fiat
     - Transfer from connected external wallet
   - Auto-detects connected external wallets and displays wallet information
   - Provides helpful tips when no external wallet is connected

2. **Transfer from Wallet Flow**
   - Token selection step showing user's external wallet balances
   - Amount input with real-time fiat/crypto conversion
   - Processing step with transaction status
   - Success and error handling screens
   - Full schema validation for transfer parameters
   - Support for both native tokens (ETH) and ERC-20 tokens

3. **Enhanced Wallet Support**
   - Added support for ecosystem wallets with dynamic wallet IDs (`ecosystem.*`)
   - Improved wallet name detection and formatting
   - Better wallet ID normalization and validation
   - Pre-connected account reuse to avoid redundant wallet connections

### Refactoring

4. **Reorganized Buy Flow**
   - Moved buy components from `components/buy/` to `components/add-funds/buy/`
   - Integrated buy flow into the add-funds parent form
   - Updated all import paths and references

5. **Core Transaction Improvements**
   - Enhanced `transferBalanceFromExternalWallet` to accept pre-connected accounts
   - Better error handling for wallet connection failures
   - Improved wallet ID type safety with `WalletIdValue`

### Activity & UI Enhancements

6. **Activity List Improvements**
   - Added timestamp display for each activity with relative time formatting ("2 minutes ago", "3 hours ago", etc.)
   - Fixed duplicate transaction filtering
   - Enhanced pagination with `keepPreviousData` for smoother page transitions
   - Better empty state handling for paginated results
   - Loading state improvements with spinner animation

7. **Account Dialog Updates**
   - Renamed "Buy" button to "Add funds" with updated icon
   - Re-enabled the add funds button (was previously disabled)
   - Updated view enumeration from `Buy` to `AddFunds`
   - Improved navigation and back button handling

### Bug Fixes

8. **Activity Data Fixes**
   - Added missing timestamps to fixture test data
   - Fixed activity deduplication logic
   - Improved metadata calculation for pagination

### Type Safety

9. **Enhanced Type Definitions**
   - New `TransferFormData` type with comprehensive validation
   - Extended `WalletIdValue` to support dynamic ecosystem wallets
   - Updated `TransferBalanceFromExternalWalletParams` with optional account parameter
   - Proper token balance schema validation

## Impact

### Positive Impacts
- **User Experience**: Provides multiple convenient options for funding wallets
- **Reduced Friction**: Users can transfer existing assets instead of only buying new ones
- **Better Integration**: Leverages existing external wallet connections
- **Improved Activity Tracking**: Users can now see when transactions occurred
- **Enhanced Navigation**: Smoother pagination experience in activity lists

### Potential Considerations
- Users need to have a connected external wallet with sufficient balance to use the transfer feature
- Transfer flow requires wallet approval which may require user education
- Additional complexity in wallet ID handling and normalization
- Pagination changes may affect existing activity list behavior

### Breaking Changes
- None - all changes are additive or internal refactorings

## Testing

### Automated Testing
- ✅ Updated existing tests for refactored buy flow components
- ✅ Added test coverage for wallet ID validation (ecosystem wallets)
- ✅ Updated activity item tests to include timestamp validation
- ✅ Activity fixture tests updated with timestamp data

### Manual Testing Performed
- ✅ Tested add funds entry step with and without connected external wallet
- ✅ Verified transfer flow with MetaMask, Coinbase Wallet
- ✅ Tested token selection from external wallet balances
- ✅ Validated amount input with max balance and insufficient balance scenarios
- ✅ Tested transfer processing with successful and failed transactions
- ✅ Verified error handling for rejected transactions and network errors
- ✅ Tested buy flow integration within add funds form
- ✅ Validated activity timestamps with various time ranges
- ✅ Tested pagination with keepPreviousData behavior
- ✅ Verified account dialog navigation and back button functionality

### Test Scenarios Covered
1. **Transfer Flow**:
   - Select token from external wallet
   - Enter transfer amount (partial and full balance)
   - Approve transaction in external wallet
   - View success confirmation
   - Handle user rejection
   - Handle insufficient balance
   - Handle network errors

2. **Buy Flow**:
   - Access buy flow from add funds entry
   - Complete region, token, amount, and provider selection
   - Process on-ramp transaction

3. **Activity Display**:
   - View activities with relative timestamps
   - Navigate through paginated activities
   - Observe smooth loading states

## Screenshots/Video

_Screenshots/video demonstrating the add funds flow would be added here_

**Recommended captures:**
- Add funds entry screen showing both options
- Transfer token selection with wallet balances
- Transfer amount input with fiat/crypto conversion
- Transfer processing screen
- Transfer success confirmation
- Activity list with timestamps
- Buy flow within add funds

## Checklist

- [x] Code follows the project's coding standards
- [x] Unit tests covering the new feature have been added
- [x] All existing tests pass
- [ ] The documentation has been updated to reflect the new feature _(pending)_

## Additional Notes

### Implementation Details

1. **Wallet ID Normalization**: The transfer flow includes extensive wallet ID normalization logic to handle various wallet formats and ensure compatibility with the `transferBalanceFromExternalWallet` function.

2. **Ecosystem Wallet Support**: Added support for dynamic ecosystem wallets (e.g., `ecosystem.lisk`) which are automatically formatted as "Lisk Ecosystem Wallet" in the UI.

3. **Account Reuse**: The transfer flow reuses pre-connected accounts from external wallets to avoid redundant connection prompts, improving UX.

4. **Token Address Handling**: Special handling for native tokens (ETH) vs ERC-20 tokens, with proper address validation and conversion.

5. **Timestamp Formatting**: Activity timestamps use intelligent relative formatting for recent activities and absolute dates for older ones.

### Future Enhancements

- Add more detailed transaction status tracking during transfers
- Support for batch transfers
- Enhanced error messages with recovery suggestions
- Transaction history for transfers
- Gas estimation and display before transfer confirmation
- Multi-token transfer in a single transaction

### Dependencies

- Builds on existing Thirdweb wallet integration
- Uses existing `transferBalanceFromExternalWallet` core function
- Leverages `useExternalWallet` hook for wallet detection
- Requires `useTokenBalances` hook for balance fetching
