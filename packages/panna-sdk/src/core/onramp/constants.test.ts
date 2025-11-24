import { getCountry } from 'iso-3166-1-alpha-2';
import { COUNTRY_PROVIDER_MAP, PROVIDERS } from './constants';

describe('Onramp Constants', () => {
  it('should have the correct values for PROVIDERS', () => {
    expect(PROVIDERS).toEqual({
      coinbase: {
        id: 'coinbase',
        displayName: 'Coinbase',
        description: 'Card, Apple Pay or bank transfer',
        websiteUrl: 'https://www.coinbase.com',
        logoUrl: 'https://www.coinbase.com/favicon.ico'
      },
      stripe: {
        id: 'stripe',
        displayName: 'Stripe',
        description: 'Card, Apple Pay or bank transfer',
        websiteUrl: 'https://www.stripe.com',
        logoUrl: 'https://www.stripe.com/favicon.ico'
      },
      transak: {
        id: 'transak',
        displayName: 'Transak',
        description: 'Card, Apple Pay or bank transfer',
        websiteUrl: 'https://www.transak.com',
        logoUrl: 'https://www.transak.com/favicon.png'
      },
      'onramp-money': {
        id: 'onramp-money',
        displayName: 'Onramp Money',
        description: 'Fiat to crypto via Onramp Money',
        websiteUrl: 'https://onramp.money',
        logoUrl: 'https://onramp.money/favicon.ico'
      }
    });
  });

  it('should have the correct structure for each provider', () => {
    Object.values(PROVIDERS).forEach((provider) => {
      expect(provider).toHaveProperty('id');
      expect(provider).toHaveProperty('displayName');
      expect(provider).toHaveProperty('websiteUrl');
    });
  });

  it('should have correct structure when accessing COUNTRY_PROVIDER_MAP by country code', () => {
    expect(COUNTRY_PROVIDER_MAP['US']).toEqual([
      'transak',
      'coinbase',
      'stripe'
    ]);
  });

  it('should contain entries for valid countries', () => {
    Object.keys(COUNTRY_PROVIDER_MAP).forEach((countryCode) => {
      expect(countryCode).toHaveLength(2);

      const countryName = getCountry(countryCode);
      expect(countryName).toBeDefined();
    });
  });
});
