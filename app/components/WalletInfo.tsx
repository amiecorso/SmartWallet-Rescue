import { styles } from './shared/styles';

export default function WalletInfo() {
  const smartWalletAddress = process.env.NEXT_PUBLIC_SMART_WALLET_ADDRESS;
  const recoverySignerAddress = process.env.NEXT_PUBLIC_RECOVERY_SIGNER_ADDRESS;

  const formatAddress = (address: string | undefined) => {
    if (!address) return 'Not configured';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Wallet Information</h2>
      <div className="space-y-3">
        <div className="flex flex-col space-y-1">
          <span className="text-[#777E90] text-sm">Smart Wallet Address</span>
          <div className="font-mono text-[#FAFBFB] bg-[#1E2025] p-2 rounded-lg break-all">
            {smartWalletAddress || 'Not configured'}
          </div>
        </div>
        <div className="flex flex-col space-y-1">
          <span className="text-[#777E90] text-sm">Recovery Signer Address</span>
          <div className="font-mono text-[#FAFBFB] bg-[#1E2025] p-2 rounded-lg break-all">
            {recoverySignerAddress || 'Not configured'}
          </div>
        </div>
      </div>
    </div>
  );
} 