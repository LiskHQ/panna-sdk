import { getOnrampNetworkName } from './onramp';

describe('getOnrampNetworkName', () => {
  it('returns lisk for the mainnet chain id', () => {
    expect(getOnrampNetworkName(1135)).toBe('lisk');
  });

  it('returns lisk-sepolia for the sepolia testnet chain id', () => {
    expect(getOnrampNetworkName(4202)).toBe('lisk-sepolia');
  });

  it('falls back to lisk when chain id is unknown', () => {
    expect(getOnrampNetworkName(9999)).toBe('lisk');
  });

  it('falls back to lisk when chain id is undefined', () => {
    expect(getOnrampNetworkName(undefined)).toBe('lisk');
  });
});
