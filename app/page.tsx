'use client';

import TransferEth from './components/TransferEth';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white">Smart Wallet Rescue</h1>
          <p className="mt-4 text-xl text-gray-400">
            Transfer assets from your Coinbase Smart Wallet using your recovery key
          </p>
        </div>
        
        <TransferEth />
      </div>
    </div>
  );
}
