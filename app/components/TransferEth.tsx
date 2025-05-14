import { useState, useEffect } from 'react';
import { isAddress } from 'viem';

export default function TransferEth() {
  const [destinationAddress, setDestinationAddress] = useState('');
  const [currentBalance, setCurrentBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch current balance on component mount
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch('/api/transfer-eth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ destinationAddress: null }), // Just to get balance
        });
        
        if (!response.ok) throw new Error('Failed to fetch balance');
        
        const data = await response.json();
        setCurrentBalance(data.balance);
      } catch (err) {
        setError('Failed to fetch current balance');
        console.error(err);
      }
    };

    fetchBalance();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!isAddress(destinationAddress)) {
      setError('Invalid Ethereum address');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/transfer-eth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ destinationAddress }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Transfer failed');
      }

      const data = await response.json();
      setSuccess(`Successfully initiated transfer of ${data.balance} ETH`);
      setCurrentBalance('0'); // Assuming transfer was successful
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transfer failed');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-900 rounded-lg shadow-xl border border-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-white">Transfer ETH from Smart Wallet</h2>
      
      {currentBalance !== null && (
        <div className="mb-4 p-3 bg-gray-800 rounded">
          <p className="text-gray-300">Current Balance: <span className="text-white font-medium">{currentBalance} ETH</span></p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="destination" className="block text-sm font-medium text-gray-300 mb-2">
            Destination Address
          </label>
          <input
            id="destination"
            type="text"
            value={destinationAddress}
            onChange={(e) => setDestinationAddress(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
            placeholder="0x..."
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !currentBalance || Number(currentBalance) === 0}
          className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors duration-200 ${
            isLoading || !currentBalance || Number(currentBalance) === 0
              ? 'bg-gray-700 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Processing...' : 'Transfer All ETH'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-900/50 text-red-300 rounded border border-red-800">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 bg-green-900/50 text-green-300 rounded border border-green-800">
          {success}
        </div>
      )}
    </div>
  );
} 