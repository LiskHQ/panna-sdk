export type BuyFlowProps = { onClose: () => void };

export type Country = { code: string; name: string; flag: string };

export type Token = { symbol: string; name: string; icon?: string };

export type Provider = {
  id: string;
  name: string;
  description: string;
  price: string;
  best?: boolean;
  icon?: string;
};

export type BuyStepData = {
  country?: Country;
  token?: Token;
  amount?: number;
  provider?: Provider;
};
