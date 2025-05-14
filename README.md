# Smart Wallet Rescue

A Next.js application for rescuing funds from a Coinbase Smart Wallet using a recovery key. This application enables secure ETH transfers from a smart wallet to any destination address using the wallet's recovery mechanism.

## Features

- Direct smart wallet interaction using recovery key
- Secure ETH transfer functionality
- Base network support
- Real-time balance checking
- Transaction status monitoring

## Tech Stack

- Next.js with TypeScript
- Tailwind CSS for styling
- Viem for Ethereum interactions
- Base network integration

## Environment Variables Required

- `RECOVERY_MNEMONIC`: The recovery phrase for the smart wallet
- `NEXT_PUBLIC_SMART_WALLET_ADDRESS`: The address of the smart wallet to rescue
- `NEXT_PUBLIC_RPC_URL`: Base network RPC URL

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Next, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.


## Learn More

To learn more about OnchainKit, see our [documentation](https://docs.onchainkit.com).

To learn more about Next.js, see the [Next.js documentation](https://nextjs.org/docs).