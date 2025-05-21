import { liskEcosystemWallet } from "./wallet";
import { ConnectButton } from "./component/connect-button";
import { FlowPay } from "./component/pay";
import { useState } from "react";
import { Header } from "./component/header";

const mainwallets = [liskEcosystemWallet()];

export function App() {
  const [wallets] = useState(mainwallets);
  return (
    <main className="p-4 pb-10 min-h-[100vh] flex flex-col items-center justify-center container max-w-screen-lg mx-auto">
      <div className="absolute top-0 right-0 p-4">
        <ConnectButton wallets={wallets} />
      </div>
      <Header />
      <div className="mt-10">
        <FlowPay wallet={wallets[0]} />
      </div>
    </main>
  );
}
