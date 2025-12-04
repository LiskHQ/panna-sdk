import { Bridge } from 'thirdweb';
import { liskSepolia } from '../chain';
import type { PannaClient } from '../client';
import { getOnrampProviders, getTokenFiatPrices } from './onramp';

jest.mock('thirdweb', () => ({
  Bridge: {
    Onramp: {
      status: jest.fn(),
      prepare: jest.fn()
    },
    tokens: jest.fn()
  }
}));

describe('getOnrampProviders', () => {
  const expectedResultForDeAndUs = [
    {
      id: 'transak',
      displayName: 'Transak',
      description: 'Card, Apple Pay or bank transfer',
      websiteUrl: 'https://www.transak.com',
      logoUrl: 'https://www.transak.com/favicon.png'
    },
    {
      id: 'coinbase',
      displayName: 'Coinbase',
      description: 'Card, Apple Pay or bank transfer',
      websiteUrl: 'https://www.coinbase.com',
      logoUrl: 'https://www.coinbase.com/favicon.ico'
    },
    {
      id: 'stripe',
      displayName: 'Stripe',
      description: 'Card, Apple Pay or bank transfer',
      websiteUrl: 'https://www.stripe.com',
      logoUrl: 'https://www.stripe.com/favicon.ico'
    },
    {
      id: 'onrampmoney',
      displayName: 'Onramp Money',
      description: 'Fiat to crypto via Onramp Money',
      websiteUrl: 'https://onramp.money',
      logoUrl: 'https://onramp.money/assets/favicon.png'
    }
  ];
  const expectedResultForSA = [
    {
      id: 'coinbase',
      displayName: 'Coinbase',
      description: 'Card, Apple Pay or bank transfer',
      websiteUrl: 'https://www.coinbase.com',
      logoUrl: 'https://www.coinbase.com/favicon.ico'
    },
    {
      id: 'stripe',
      displayName: 'Stripe',
      description: 'Card, Apple Pay or bank transfer',
      websiteUrl: 'https://www.stripe.com',
      logoUrl: 'https://www.stripe.com/favicon.ico'
    },
    {
      id: 'onrampmoney',
      displayName: 'Onramp Money',
      description: 'Fiat to crypto via Onramp Money',
      websiteUrl: 'https://onramp.money',
      logoUrl: 'https://onramp.money/assets/favicon.png'
    }
  ];

  it('should get onramp providers for a specific country DE', async () => {
    const resultUS = await getOnrampProviders('US');
    const resultDE = await getOnrampProviders('DE');
    expect(resultUS).toEqual(expectedResultForDeAndUs);
    expect(resultDE).toEqual(expectedResultForDeAndUs);
  });

  it('should handle case insensitivity for country codes', async () => {
    const result1 = await getOnrampProviders('de');
    expect(result1).toEqual(expectedResultForDeAndUs);

    const result2 = await getOnrampProviders('De');
    expect(result2).toEqual(expectedResultForDeAndUs);
  });

  it('should return providers for a valid country code SA', async () => {
    const result = await getOnrampProviders('SA');
    expect(result).toEqual(expectedResultForSA);
  });

  it('should return only onrampmoney for unsupported countries', async () => {
    const result = await getOnrampProviders('aQ');
    expect(result).toEqual([
      {
        id: 'onrampmoney',
        displayName: 'Onramp Money',
        description: 'Fiat to crypto via Onramp Money',
        websiteUrl: 'https://onramp.money',
        logoUrl: 'https://onramp.money/assets/favicon.png'
      }
    ]);
  });

  it('should throw an error for invalid country codes', async () => {
    expect(() => getOnrampProviders('INVALID')).toThrow(
      'Invalid country code: INVALID'
    );
  });
});

describe('getTokenFiatPrices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return token fiat prices for a valid token address', async () => {
    const mockTokenPrices = [
      {
        chainId: 1,
        address: '0xTokenAddress',
        symbol: 'ETH',
        name: 'Ethereum',
        decimals: 18,
        iconUri: 'https://example.com/eth.png',
        prices: {
          USD: 3000,
          EUR: 2500
        }
      }
    ];

    (Bridge.tokens as jest.Mock).mockResolvedValue(mockTokenPrices);
    const params = {
      client: { clientId: 'test-client' } as PannaClient,
      tokenAddress: '0xTokenAddress',
      chainId: liskSepolia.id
    };

    const result = await getTokenFiatPrices(params);
    expect(result).toEqual(mockTokenPrices);
  });

  it('should return fiat prices for all tokens on a chain when tokenAddress is not provided', async () => {
    const mockTokenPrices = [
      {
        chainId: 1,
        address: '0xTokenAddress',
        symbol: 'ETH',
        name: 'Ethereum',
        decimals: 18,
        iconUri: 'https://example.com/eth.png',
        prices: {
          USD: 3000,
          EUR: 2500
        }
      },
      {
        chainId: 1,
        address: '0xAnotherTokenAddress',
        symbol: 'USDT',
        name: 'Tether',
        decimals: 6,
        iconUri: 'https://example.com/usdt.png',
        prices: {
          USD: 1,
          EUR: 0.85
        }
      }
    ];

    (Bridge.tokens as jest.Mock).mockResolvedValue(mockTokenPrices);
    const params = {
      client: { clientId: 'test-client' } as PannaClient,
      chainId: liskSepolia.id
    };
    const result = await getTokenFiatPrices(params);
    expect(result).toEqual(mockTokenPrices);
  });

  it('should throw an error for invalid token address', async () => {
    const invalidAddressError = new Error('Invalid token address');
    (Bridge.tokens as jest.Mock).mockRejectedValueOnce(invalidAddressError);
    // Mocking the error response for invalid token address
    const params = {
      client: { clientId: 'test-client' } as PannaClient,
      tokenAddress: 'invalid-address',
      chainId: liskSepolia.id
    };
    await expect(getTokenFiatPrices(params)).rejects.toThrow(
      'Invalid token address'
    );
  });

  it('should pass correct parameters to Bridge.tokens', async () => {
    const params = {
      client: { clientId: 'test-client' } as PannaClient,
      tokenAddress: '0xTokenAddress',
      chainId: liskSepolia.id
    };
    await getTokenFiatPrices(params);
    expect(Bridge.tokens).toHaveBeenCalledWith({
      chainId: liskSepolia.id,
      tokenAddress: '0xTokenAddress',
      client: params.client
    });
  });
});
