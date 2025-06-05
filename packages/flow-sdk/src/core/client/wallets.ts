import { ecosystemWallet } from 'thirdweb/wallets';

export const liskEcosystemWallet = (partnerId: string) => {
  return ecosystemWallet('ecosystem.lisk', {
    partnerId
  });
};
