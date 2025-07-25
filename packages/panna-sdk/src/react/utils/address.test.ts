import { truncateAddress } from './address';

describe('truncateAddress', () => {
  it('returns truncate address if address is valid', () => {
    expect(truncateAddress('0xbazzbf5rh6zpk6dsqw6rk9haqbsny6t9pp4vu5a')).toBe(
      '0xbazz...vu5a'
    );
  });

  it('returns empty string if no address is supplied', () => {
    expect(truncateAddress('')).toBe('');
  });
});
