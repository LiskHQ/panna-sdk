import {
  preAuthenticate,
  ecosystemWallet,
  inAppWallet,
  Account,
} from "thirdweb/wallets";

import { client } from "./client";
import { liskSepolia } from "./lisk_network";

export const preLogin = async (
  email: string,
  isEcosystemWallet = false
): Promise<Error | undefined> => {
  // send email verification code
  console.log("isEcosystemWallet:", isEcosystemWallet);
  console.log("preLogin called with email:", email);
  console.log("ecosystem id:", import.meta.env.VITE_ECOSYSTEM_ID);
  console.log("partner id:", import.meta.env.VITE_PARTNER_ID);
  const ecosystem = {
    id: import.meta.env.VITE_ECOSYSTEM_ID as `ecosystem.${string}`,
    partnerId: import.meta.env.VITE_PARTNER_ID,
  };

  if (isEcosystemWallet) {
    console.log("ecosystemWallet is true");
    await preAuthenticate({
      client,
      strategy: "email",
      email,
      ecosystem,
    })
      .catch((error) => {
        console.error("Error during pre-authentication:", error);
        return error;
      })
      .then(() => {
        console.log("preAuthenticate completed");
        return undefined;
      });

    return undefined;
  }

  // Normal wallet
  await preAuthenticate({
    client,
    strategy: "email",
    email,
  })
    .catch((error) => {
      console.error("Error during pre-authentication:", error);
      return error;
    })
    .then(() => {
      console.log("preAuthenticate completed");
      return null;
    });

  return;
};

export const handleLogin = async (
  email: string,
  verificationCode: string,
  isEcosystemWallet = false
): Promise<Account> => {
  // verify email and connect
  if (isEcosystemWallet) {
    const ecoWallet = ecosystemWallet(
      import.meta.env.VITE_ECOSYSTEM_ID as `ecosystem.${string}`,
      {
        partnerId: import.meta.env.VITE_PARTNER_ID,
      }
    );
    const account = await ecoWallet.connect({
      client,
      strategy: "email",
      email,
      verificationCode,
      chain: liskSepolia,
    });
    return account;
  }

  const ecoWallet = inAppWallet();
  // {smartAccount: {chain: liskSepolia, sponsorGas: false }}
  const account = await ecoWallet.connect({
    client,
    strategy: "email",
    email,
    verificationCode,
    chain: liskSepolia,
  });
  return account;
};

export const liskEcosystemWallet = () => {
  return ecosystemWallet(
    import.meta.env.VITE_ECOSYSTEM_ID as `ecosystem.${string}`,
    {
      partnerId: import.meta.env.VITE_PARTNER_ID,
    }
  );
};
