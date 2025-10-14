import { Address } from 'thirdweb';

export const truncateAddress = (address: Address | string): string => {
  if (!address) {
    return '';
  }
  return address.replace(/^(.{6})(.+)?(.{4})$/, '$1...$3');
};
