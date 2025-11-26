import type { PannaClient } from '../client';
import type { OnrampProvider } from './thirdweb/types';

export type ProviderId = OnrampProvider | 'onrampmoney';

export interface ProviderInfo {
  id: ProviderId;
  displayName: string;
  description?: string;
  logoUrl?: string;
  websiteUrl: string;
}

export interface GetTokenFiatPricesParams {
  chainId: number;
  tokenAddress?: string;
  client: PannaClient;
}
