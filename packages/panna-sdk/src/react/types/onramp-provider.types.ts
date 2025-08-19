import type { OnrampPrepareResult } from '../../core/onramp/types';

export type OnrampProvider = {
  id: string;
  name: string;
  description?: string;
  price: string;
  best?: boolean;
  icon?: string;
  prepareResult?: OnrampPrepareResult;
};
