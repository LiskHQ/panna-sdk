import { ConnectButton as PrimitiveConnectButton } from "thirdweb/react";
import { FlowClient } from "../client";
import { liskSepolia } from "../lisk_network";
import lskIcon from "../lsk.svg";
import { Wallet } from "thirdweb/wallets";

type Props = {
  wallets: Wallet[];
};

export function ConnectButton({ wallets }: Props) {
  return (
    <PrimitiveConnectButton
      client={FlowClient}
      wallets={wallets}
      theme="dark"
      connectModal={{
        size: "compact",
        showThirdwebBranding: false,
      }}
      connectButton={{ label: "Sign in" }}
      supportedTokens={{
        "4202": [
          {
            address: "0x8a21CF9Ba08Ae709D64Cb25AfAA951183EC9FF6D",
            name: "Lisk",
            symbol: "LSK",
            icon: lskIcon,
          },
          {
            address: "0xed875CABEE46D734F38B5ED453ED1569347c0da8",
            name: "USDC",
            symbol: "usdc",
          },
        ],
      }}
      appMetadata={{ name: "Lisk App", description: "Lisk App" }}
      signInButton={{
        label: "Sign in",
        style: { backgroundColor: "#000000", color: "#ffffff" },
      }}
      detailsModal={{
        showBalanceInFiat: "USD",
      }}
      accountAbstraction={{
        chain: liskSepolia,
        sponsorGas: true,
      }}
    />
  );
}
