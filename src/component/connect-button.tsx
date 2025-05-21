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
      theme={"dark"}
      connectModal={{
        size: "compact",
        showThirdwebBranding: false,
        title: "Connect your wallet",
        welcomeScreen() {
          return <span>blabla</span>;
        },
      }}
      connectButton={{ label: "Connect your wallet" }}
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
            // icon: lskIcon,
          },
        ],
      }}
      appMetadata={{ name: "Lisk App", description: "Lisk App" }}
      // detailsButton={{ render: () => { return <button>Bla </button>} }} // render the details button after logged in
      signInButton={{
        label: "Sign in",
        style: { backgroundColor: "#000000", color: "#ffffff" },
      }}
      detailsModal={{}}
      accountAbstraction={{
        chain: liskSepolia, // replace with the chain you want
        sponsorGas: true,
      }}
    />
  );
}
