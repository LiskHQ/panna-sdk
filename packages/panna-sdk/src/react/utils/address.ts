export const truncateAddress = (address: string): string => {
  if (!address) return address;
  return address.replace(/^(.{6})(.+)?(.{4})$/, '$1...$3');
};
