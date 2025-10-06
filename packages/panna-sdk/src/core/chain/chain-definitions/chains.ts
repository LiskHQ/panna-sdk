import { lisk } from './lisk';
import { liskSepolia } from './lisk-sepolia';

export const chains = {
  [lisk.id]: lisk,
  [liskSepolia.id]: liskSepolia
};
