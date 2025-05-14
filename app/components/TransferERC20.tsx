import { useState } from 'react';
import { formatUnits } from 'viem';
import { styles } from './shared/styles';

export default function TransferERC20() {
  const [tokenAddress, setTokenAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [balance, setBalance] = useState<string | null>(null);
  const [symbol, setSymbol] = useState<string | null>(null);
  const [decimals, setDecimals] = useState<number>(18);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const checkBalance = async () => {
    if (!tokenAddress) {
      setError('Please enter a token address');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    setBalance(null);
    setSymbol(null);
    setTxHash(null);

    try {
      const response = await fetch('/api/transfer-erc20', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tokenAddress }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch balance');
      }

      setBalance(data.balance);
      setSymbol(data.symbol);
      setDecimals(data.decimals);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const transfer = async () => {
    if (!tokenAddress || !destinationAddress) {
      setError('Please enter both token and destination addresses');
      return;
    }

    setError(null);
    setIsLoading(true);
    setTxHash(null);

    try {
      const response = await fetch('/api/transfer-erc20', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tokenAddress, destinationAddress }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Transfer failed');
      }

      setTxHash(data.transactionHash);
      setBalance('0'); // Reset balance after successful transfer
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Transfer ERC20 Tokens</h2>
      
      <div className={styles.inputGroup}>
        <input
          type="text"
          placeholder="Token Contract Address"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          className={styles.input}
          disabled={isLoading}
        />
        
        <button
          onClick={checkBalance}
          disabled={isLoading || !tokenAddress}
          className={styles.secondaryButton}
        >
          {isLoading ? 'Loading...' : 'Check Balance'}
        </button>

        {balance !== null && symbol && (
          <div className={styles.balanceDisplay}>
            Balance: {formatUnits(BigInt(balance), decimals)} {symbol}
          </div>
        )}
      </div>

      <div className={styles.inputGroup}>
        <input
          type="text"
          placeholder="Destination Address"
          value={destinationAddress}
          onChange={(e) => setDestinationAddress(e.target.value)}
          className={styles.input}
          disabled={isLoading}
        />

        <button
          onClick={transfer}
          disabled={isLoading || !tokenAddress || !destinationAddress || balance === '0'}
          className={styles.primaryButton}
        >
          {isLoading ? 'Processing...' : 'Transfer All Tokens'}
        </button>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      {txHash && (
        <div className={styles.successMessage}>
          <p className="text-[#098551] font-medium">Transaction successful!</p>
          <a
            href={`https://basescan.org/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            View on BaseScan
          </a>
        </div>
      )}
    </div>
  );
} 