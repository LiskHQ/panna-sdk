export function formatWithCommas(value: number | string): string {
  const str = typeof value === 'number' ? value.toString() : value;

  if (str === '' || str === '.') return str;

  const [integerPart, decimalPart] = str.split('.');
  const digitsOnly = integerPart.replace(/\D/g, '');

  if (digitsOnly === '') return decimalPart ? `0.${decimalPart}` : '0';

  const withCommas = digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return decimalPart !== undefined
    ? `${withCommas}.${decimalPart}`
    : withCommas;
}
