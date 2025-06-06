'use client';

import { LoginButton, EcosystemId, createAccount } from 'flow-sdk';

export default function Home() {
  const wallets = [
    createAccount(EcosystemId.LISK, process.env.NEXT_PUBLIC_PARTNER_ID || '')
  ];

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
        <div className="flex justify-center">
          <span className="font-bold">Lisk Flow POC</span>
        </div>
        <LoginButton wallets={wallets} />
      </main>
    </div>
  );
}
