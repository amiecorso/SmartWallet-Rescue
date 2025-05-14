import { createPublicClient, createWalletClient, http, formatEther } from 'viem';
import { mnemonicToAccount } from 'viem/accounts';
import { base } from 'viem/chains';

// The execute function ABI is all we need
const EXECUTE_ABI = {
  type: "function",
  name: "execute",
  inputs: [
    { name: "target", type: "address", internalType: "address" },
    { name: "value", type: "uint256", internalType: "uint256" },
    { name: "data", type: "bytes", internalType: "bytes" }
  ],
  outputs: [],
  stateMutability: "payable"
} as const;

export async function POST(request: Request) {
  try {
    const { destinationAddress } = await request.json();

    if (!process.env.RECOVERY_MNEMONIC) {
      return new Response('Recovery mnemonic not configured', { status: 500 });
    }

    const smartWalletAddress = process.env.NEXT_PUBLIC_SMART_WALLET_ADDRESS;
    if (!smartWalletAddress) {
      return new Response('Smart wallet address not configured', { status: 500 });
    }

    // Create public client for Base
    const publicClient = createPublicClient({
      chain: base,
      transport: http(process.env.NEXT_PUBLIC_RPC_URL),
    });

    // Get current ETH balance
    const balance = await publicClient.getBalance({
      address: smartWalletAddress as `0x${string}`,
    });

    if (balance === 0n) {
      return new Response('No ETH balance to transfer', { status: 400 });
    }

    // If no destination address provided, just return the balance
    if (!destinationAddress) {
      return new Response(JSON.stringify({
        balance: formatEther(balance),
      }));
    }

    // Process the mnemonic string - remove quotes and normalize spaces
    const cleanMnemonic = process.env.RECOVERY_MNEMONIC
      .replace(/^["']|["']$/g, '') // Remove any surrounding quotes
      .split(/\s+/)  // Split on any number of spaces
      .join(' ')     // Join with single spaces
      .replace(/^wallet\s+/, ''); // Remove "wallet" prefix if present

    // Create wallet client with recovery mnemonic
    const account = mnemonicToAccount(cleanMnemonic);
    const walletClient = createWalletClient({
      account,
      chain: base,
      transport: http(process.env.NEXT_PUBLIC_RPC_URL),
    });

    // Call execute on the smart wallet to transfer the full balance
    const hash = await walletClient.writeContract({
      address: smartWalletAddress as `0x${string}`,
      abi: [EXECUTE_ABI],
      functionName: 'execute',
      args: [
        destinationAddress as `0x${string}`,
        balance,
        '0x' as const
      ]
    });

    // Wait for the transaction to be mined
    await publicClient.waitForTransactionReceipt({ hash });

    return new Response(JSON.stringify({
      balance: formatEther(balance),
      transactionHash: hash,
      status: 'Transaction sent successfully'
    }));

  } catch (error) {
    console.error('Error in transfer-eth route:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Internal server error'
    }), { status: 500 });
  }
} 