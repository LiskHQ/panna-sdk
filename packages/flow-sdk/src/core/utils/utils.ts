import { getWalletBalance } from 'thirdweb/wallets';
import { getSocialIcon as thirdwebGetSocialIcon } from 'thirdweb/wallets/in-app';
import {
  type AccountBalanceParams,
  type AccountBalanceResult,
  type SocialProvider
} from './types';

/**
 * Get the balance of an account
 * @param params - Parameters for getting account balance
 * @returns Account balance information
 */
export async function accountBalance(
  params: AccountBalanceParams
): Promise<AccountBalanceResult> {
  const result = await getWalletBalance({
    address: params.address,
    client: params.client,
    chain: params.chain,
    tokenAddress: params.tokenAddress
  });

  return {
    value: result.value,
    decimals: result.decimals,
    symbol: result.symbol,
    name: result.name,
    displayValue: result.displayValue
  };
}

/**
 * Get the icon URI for a social authentication provider
 * @param provider - The social provider name
 * @returns The icon URI string
 */
export function getSocialIcon(provider: SocialProvider): string {
  return thirdwebGetSocialIcon(provider);
}
