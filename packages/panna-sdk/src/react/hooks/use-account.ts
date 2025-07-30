import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getEmail, getPhoneNumber, EcosystemId } from '../../core';
import { usePanna } from './use-panna';

type Account = {
  email?: string;
  phone?: string;
};

/**
 * Hook to fetch user account information including email, phone number, and address
 * @returns Object containing account data, loading state, error state, and error message
 */
export function useAccount(): UseQueryResult<Account, Error> {
  const { client, partnerId } = usePanna();

  const query = useQuery({
    queryKey: ['account', partnerId],
    queryFn: async (): Promise<Account> => {
      if (!client || !partnerId) {
        throw new Error('No active wallet address found');
      }

      const ecosystemConfig = {
        id: EcosystemId.LISK,
        partnerId
      };

      // Fetch both email and phone in parallel
      const [email, phone] = await Promise.all([
        getEmail({ client, ecosystem: ecosystemConfig }),
        getPhoneNumber({ client, ecosystem: ecosystemConfig })
      ]);

      return {
        email,
        phone
      };
    },
    enabled: !!(client && partnerId)
  });

  return query;
}
