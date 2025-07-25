import { useState, useEffect } from 'react';
import { getFiatPrice } from '../..';
import { lisk } from '../../core';
import type { Chain } from '../../core/chains/types';
import type { FiatCurrency } from '../../core/utils/types';
import { usePanna } from './use-panna';

type UseFiatBalanceParams = {
  balance?: string; // The display value from account balance
  chain?: Chain;
  currency?: FiatCurrency;
};

type UseFiatBalanceResult = {
  fiatBalance: number;
  isLoading: boolean;
  error: string | null;
};

/**
 * Hook to convert crypto balance to fiat currency
 * @param params - Parameters for fiat conversion
 * @returns Object containing fiat balance, loading state, and error
 */
export function useFiatBalance({
  balance,
  chain = lisk,
  currency = 'USD'
}: UseFiatBalanceParams): UseFiatBalanceResult {
  const [fiatBalance, setFiatBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { client } = usePanna();

  useEffect(() => {
    const convertToFiat = async () => {
      // Reset previous error
      setError(null);

      // If no balance or client, reset to 0
      if (!balance || !client) {
        setFiatBalance(0);
        setIsLoading(false);
        return;
      }

      const numericBalance = parseFloat(balance);

      // If balance is 0 or invalid, no need to convert
      if (numericBalance <= 0 || isNaN(numericBalance)) {
        setFiatBalance(0);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const fiatValue = await getFiatPrice({
          client,
          chain,
          amount: numericBalance,
          currency
        });

        setFiatBalance(fiatValue.price);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to convert balance to fiat';
        console.error('Failed to convert balance to fiat:', err);
        setError(errorMessage);
        setFiatBalance(0);
      } finally {
        setIsLoading(false);
      }
    };

    convertToFiat();
  }, [balance, chain, currency, client]);

  return {
    fiatBalance,
    isLoading,
    error
  };
}
