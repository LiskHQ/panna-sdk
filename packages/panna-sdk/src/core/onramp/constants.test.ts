import { getCountry } from 'iso-3166-1-alpha-2';
import { COUNTRY_PROVIDER_MAP, PROVIDERS } from './constants';

describe('Onramp Constants', () => {
  it('should have the correct values for PROVIDERS', () => {
    expect(PROVIDERS).toEqual({
      coinbase: {
        id: 'coinbase',
        displayName: 'Coinbase',
        websiteUrl: 'https://www.coinbase.com'
      },
      stripe: {
        id: 'stripe',
        displayName: 'Stripe',
        websiteUrl: 'https://www.stripe.com'
      },
      transak: {
        id: 'transak',
        displayName: 'Transak',
        websiteUrl: 'https://www.transak.com'
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
