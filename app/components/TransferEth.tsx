import { useState } from 'react';
import { formatEther } from 'viem';
import { styles } from './shared/styles';

export default function TransferEth() {
  const [destinationAddress, setDestinationAddress] = useState('');
  const [balance, setBalance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const checkBalance = async () => {
    setError(null);
    setIsLoading(true);
    setBalance(null);
    setTxHash(null);

    try {
      const response = await fetch('/api/transfer-eth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch balance');
      }

      setBalance(data.balance);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const transfer = async () => {
    if (!destinationAddress) {
      setError('Please enter a destination address');
      return;
    }

    setError(null);
    setIsLoading(true);
    setTxHash(null);

    try {
      const response = await fetch('/api/transfer-eth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ destinationAddress }),
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
      <h2 className={styles.title}>Transfer ETH</h2>
      
      <div className={styles.inputGroup}>
        <button
          onClick={checkBalance}
          disabled={isLoading}
          className={styles.secondaryButton}
        >
          {isLoading ? 'Loading...' : 'Check Balance'}
        </button>

        {balance !== null && (
          <div className={styles.balanceDisplay}>
            Balance: {balance} ETH
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
          disabled={isLoading || !destinationAddress || balance === '0'}
          className={styles.primaryButton}
        >
          {isLoading ? 'Processing...' : 'Transfer All ETH'}
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