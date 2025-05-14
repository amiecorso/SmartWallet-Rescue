import { createPublicClient, createWalletClient, http, parseAbi, encodeFunctionData } from 'viem';
import { mnemonicToAccount } from 'viem/accounts';
import { base } from 'viem/chains';

// ERC20 interface functions we need
const ERC20_ABI = parseAbi([
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)'
] as const);

// Smart Wallet execute function
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
    const { tokenAddress, destinationAddress } = await request.json();

    if (!tokenAddress) {
      return new Response('Token address is required', { status: 400 });
    }

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

    // Get token details
    const [balance, symbol, decimals] = await Promise.all([
      publicClient.readContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [smartWalletAddress as `0x${string}`],
      }),
      publicClient.readContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'symbol',
      }),
      publicClient.readContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'decimals',
      }),
    ]);

    // If no destination address provided, just return the balance and token info
    if (!destinationAddress) {
      return new Response(JSON.stringify({
        balance: balance.toString(),
        symbol,
        decimals,
      }));
    }

    // Only check for 0 balance if attempting a transfer
    if (balance === 0n && destinationAddress) {
      return new Response(`No ${symbol} balance to transfer`, { status: 400 });
    }

    // Process the mnemonic string
    const cleanMnemonic = process.env.RECOVERY_MNEMONIC
      .replace(/^["']|["']$/g, '')
      .split(/\s+/)
      .join(' ')
      .replace(/^wallet\s+/, '');

    // Create wallet client with recovery mnemonic
    const account = mnemonicToAccount(cleanMnemonic);
    const walletClient = createWalletClient({
      account,
      chain: base,
      transport: http(process.env.NEXT_PUBLIC_RPC_URL),
    });

    // Encode the transfer function call
    const data = encodeFunctionData({
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [destinationAddress as `0x${string}`, balance],
    });

    // Call execute on the smart wallet to transfer the tokens
    const hash = await walletClient.writeContract({
      address: smartWalletAddress as `0x${string}`,
      abi: [EXECUTE_ABI],
      functionName: 'execute',
      args: [
        tokenAddress as `0x${string}`,
        0n,
        data
      ]
    });

    // Wait for the transaction to be mined
    await publicClient.waitForTransactionReceipt({ hash });

    return new Response(JSON.stringify({
      balance: balance.toString(),
      symbol,
      decimals,
      transactionHash: hash,
      status: 'Transaction sent successfully'
    }));

  } catch (error) {
    console.error('Error in transfer-erc20 route:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Internal server error'
    }), { status: 500 });
  }
} 