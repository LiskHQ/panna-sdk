import { getDefaultToken, PayEmbed } from "thirdweb/react";
import { FlowClient } from "../client";
import { Wallet } from "thirdweb/wallets";
import { liskSepolia } from "../lisk_network";
import gameAsset from "../test_game_asset.jpg";
import lskIcon from "../lsk.svg";

export function FlowPay({ wallet }: { wallet: Wallet }) {
  return (
    <PayEmbed
      client={FlowClient}
      theme={"dark"}
      activeWallet={wallet}
      connectOptions={{
        connectModal: { size: "wide", showThirdwebBranding: false },
      }}
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
      payOptions={{
        mode: "direct_payment",
        buyWithCrypto: { testMode: true },
        paymentInfo: {
          amount: "35",
          chain: liskSepolia,
          token: getDefaultToken(liskSepolia, "USDC"),
          sellerAddress: "0x50f8035dEf80Fc71C32497dD797d0DBD88E9Dd11",
        },
        metadata: {
          name: "Thor's Hammer",
          image: gameAsset,
        },
      }}
    />
  );
}
