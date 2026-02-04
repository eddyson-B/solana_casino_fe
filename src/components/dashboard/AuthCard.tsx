import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '../../App.css';

export function AuthCard() {
  const { publicKey, connected } = useWallet();

  return (
    <div className="info-card auth-card">
      <div className="card-header">
        <h3 className="card-title-small">Wallet Connection</h3>
      </div>
      <div className="auth-content">
        {connected && publicKey ? (
          <>
            <div className="wallet-info">
              <div className="wallet-status connected">
                <span className="status-dot" />
                Connected
              </div>
              <div className="wallet-address">
                {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
              </div>
            </div>
            <WalletMultiButton className="wallet-button" />
          </>
        ) : (
          <>
            <p className="auth-description">
              Connect your Solana wallet to start playing. We support Phantom, Solflare, and other popular wallets.
            </p>
            <WalletMultiButton className="wallet-button" />
          </>
        )}
      </div>
    </div>
  );
}
