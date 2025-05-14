'use client';

import TransferEth from './components/TransferEth';
import TransferERC20 from './components/TransferERC20';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0B0D] p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-[#FAFBFB]">Smart Wallet Rescue</h1>
          <p className="text-[#777E90]">Transfer your assets from a Coinbase Smart Wallet using your recovery key</p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <TransferEth />
          <TransferERC20 />
        </div>
      </div>
    </main>
  );
}
