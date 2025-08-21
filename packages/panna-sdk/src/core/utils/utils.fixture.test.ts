import { DEFAULT_CURRENCY } from '../defaults';
import {
  AccountBalanceResult,
  AccountBalanceInFiatResult,
  TokenFiatPrice
} from './types';

export const fixture_fiatBalanceSample: TokenFiatPrice[] = [
  {
    chainId: 1135,
    address: '0xF242275d3a6527d877f2c927a82D9b057609cc71',
    symbol: 'USDC.e',
    name: 'Lisk Bridged USDC (Lisk)',
    decimals: 6,
    iconUri:
      'https://coin-images.coingecko.com/coins/images/52209/small/usdc.png?1732740070',
    prices: {
      USD: 0.998152,
      EUR: 0.8523020409130093,
      GBP: 0.7357724401764957,
      JPY: 146.670451184,
      KRW: 1384.590645529329,
      CNY: 7.168960566133333,
      INR: 87.33410643073067,
      NOK: 10.159207243618983,
      SEK: 9.530608433181648,
      CHF: 0.8034747629413334,
      AUD: 1.5309731790018364,
      CAD: 1.3768675046666667,
      NZD: 1.6821409267937926,
      MXN: 18.665606072867263,
      BRL: 5.382707409384749,
      CLP: 962.4637659043588,
      CZK: 20.852147886608,
      DKK: 6.361223028717334,
      HKD: 7.807593188013334,
      HUF: 336.3790073366933,
      IDR: 16135.83721291138,
      ILS: 3.371698565032,
      ISK: 122.05402656000001
    }
  },
  {
    chainId: 1135,
    address: '0x05D032ac25d322df992303dCa074EE7392C117b9',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    prices: {
      USD: 0,
      EUR: 0,
      GBP: 0,
      JPY: 0,
      KRW: 0,
      CNY: 0,
      INR: 0,
      NOK: 0,
      SEK: 0,
      CHF: 0,
      AUD: 0,
      CAD: 0,
      NZD: 0,
      MXN: 0,
      BRL: 0,
      CLP: 0,
      CZK: 0,
      DKK: 0,
      HKD: 0,
      HUF: 0,
      IDR: 0,
      ILS: 0,
      ISK: 0
    }
  },
  {
    chainId: 1135,
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    symbol: 'ETH',
    name: 'Ether',
    decimals: 18,
    iconUri: 'https://assets.relay.link/icons/1/light.png',
    prices: {
      USD: 4575.129756,
      EUR: 3906.611847174216,
      GBP: 3372.4867401920906,
      JPY: 672278.7166061521,
      KRW: 6346410.027972174,
      CNY: 32859.6494378684,
      INR: 400304.6320048518,
      NOK: 46565.74485414241,
      SEK: 43684.499189936905,
      CHF: 3682.8071236925243,
      AUD: 7017.369044884163,
      CAD: 6311.010237589001,
      NZD: 7710.261571343541,
      MXN: 85555.67664819518,
      BRL: 24672.179023352994,
      CLP: 4411549.157303547,
      CZK: 95577.91025067604,
      DKK: 29157.303460031257,
      HKD: 35786.88608270354,
      HUF: 1541826.9018745117,
      IDR: 73960227.47112961,
      ILS: 15454.518383112396,
      ISK: 559446.86656368
    }
  },
  {
    chainId: 1135,
    address: '0x4200000000000000000000000000000000000006',
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
    iconUri:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
    prices: {
      USD: 4564.861173,
      EUR: 3897.843709407439,
      GBP: 3364.9174117019757,
      JPY: 670769.830482966,
      KRW: 6332165.920897659,
      CNY: 32785.8980787597,
      INR: 399406.1741340919,
      NOK: 46461.23104983675,
      SEK: 43586.45215528023,
      CHF: 3674.541301160817,
      AUD: 7001.619013667118,
      CAD: 6296.8455830557505,
      NZD: 7692.956387639577,
      MXN: 85363.6524622951,
      BRL: 24616.80391234988,
      CLP: 4401647.720383437,
      CZK: 95363.39180929445,
      DKK: 29091.861777149395,
      HKD: 35706.564730162696,
      HUF: 1538366.371057267,
      IDR: 73794228.5213752,
      ILS: 15419.831715584793,
      ISK: 558191.22423444
    }
  },
  {
    chainId: 1135,
    address: '0xac485391EB2d7D88253a7F1eF18C37f4242D1A24',
    symbol: 'LSK',
    name: 'Lisk',
    decimals: 18,
    iconUri:
      'https://coin-images.coingecko.com/coins/images/385/small/Lisk_logo.png?1722338450',
    prices: {
      USD: 0.409838,
      EUR: 0.3499524760193897,
      GBP: 0.30210579684963274,
      JPY: 60.222415396,
      KRW: 568.5084646250763,
      CNY: 2.9435521448666666,
      INR: 35.85910313394933,
      NOK: 4.171337810584276,
      SEK: 3.9132371613124053,
      CHF: 0.32990415276866664,
      AUD: 0.6286126619350104,
      CAD: 0.5653373678333333,
      NZD: 0.6906816528497807,
      MXN: 7.664037803552738,
      BRL: 2.2101223453416177,
      CLP: 395.1845258945637,
      CZK: 8.561824837852,
      DKK: 2.611897710612667,
      HKD: 3.2057726448366664,
      HUF: 138.116138232309,
      IDR: 6625.322848288811,
      ILS: 1.3844085835579998,
      ISK: 50.114990639999995
    }
  },
  {
    chainId: 1135,
    address: '0x03C7054BCB39f7b2e5B2c7AcB37583e32D70Cfa3',
    symbol: 'WBTC',
    name: 'Lisk Bridged Wrapped Bitcoin (Lisk)',
    decimals: 8,
    iconUri:
      'https://coin-images.coingecko.com/coins/images/52117/small/btc.png?1732604228',
    prices: {
      USD: 118609,
      EUR: 101277.85424529642,
      GBP: 87430.80548543105,
      JPY: 17428643.678,
      KRW: 164528961.39624843,
      CNY: 851877.5134333334,
      INR: 10377789.184054667,
      NOK: 1207204.3255520242,
      SEK: 1132508.8119356993,
      CHF: 95475.77739433333,
      AUD: 181923.3922170459,
      CAD: 163611.23141666668,
      NZD: 199886.443333365,
      MXN: 2218007.7490168964,
      BRL: 639619.560066719,
      CLP: 114368217.27567552,
      CZK: 2477831.441186,
      DKK: 755895.1965363334,
      HKD: 927765.3307683333,
      HUF: 39971444.911394104,
      IDR: 1917398869.0962956,
      ILS: 400654.20406899997,
      ISK: 14503508.52
    }
  }
];

export const fixture_convertBalanceToFiat = (
  balances: AccountBalanceResult[],
  allTokensPrices: TokenFiatPrice[]
) => {
  let fiatBalances: AccountBalanceInFiatResult[] = [];
  balances.forEach((balance) => {
    const tokenPrice = allTokensPrices.find(
      (token) => token.symbol === balance.symbol
    );
    let balanceWithFiat = {
      token: {
        symbol: balance.symbol,
        name: balance.name,
        decimals: balance.decimals
      },
      tokenBalance: {
        value: balance.value,
        displayValue: balance.displayValue
      },
      fiatBalance: {
        amount: 0, // Will be calculated below
        currency: DEFAULT_CURRENCY
      }
    };
    if (tokenPrice) {
      balanceWithFiat.fiatBalance.amount =
        (Number(balanceWithFiat.tokenBalance.value) *
          tokenPrice.prices[DEFAULT_CURRENCY]) /
        10 ** balanceWithFiat.token.decimals;
      fiatBalances.push(balanceWithFiat);
    }
  });

  return fiatBalances;
};
export const fixture_getTotalValue = (balances: AccountBalanceInFiatResult[]) =>
  balances.reduce((total, balance) => total + balance.fiatBalance.amount, 0);

export const fixture_getPriceInCurrency = (
  symbol: string,
  amount: bigint,
  allTokensPrices: TokenFiatPrice[]
) => {
  const tokenPrice = allTokensPrices.find((token) => token.symbol === symbol);
  if (tokenPrice) {
    return (
      (tokenPrice.prices[DEFAULT_CURRENCY] * Number(amount)) /
      10 ** tokenPrice.decimals
    ); // Convert to fiat value based on decimals
  }
  return 0;
};
