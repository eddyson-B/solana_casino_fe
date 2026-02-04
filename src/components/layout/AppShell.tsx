import type { ReactNode } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import '../../App.css';

interface AppShellProps {
  children: ReactNode;
  onLaunchDashboard: () => void;
}

export function AppShell({ children, onLaunchDashboard }: AppShellProps) {
  return (
    <div className="app-root">
      <div className="app-shell">
        <div className="app-shell-inner">
          <TopNav onLaunch={onLaunchDashboard} />
          {children}
        </div>
      </div>
    </div>
  );
}

interface TopNavProps {
  onLaunch: () => void;
}

function TopNav({ onLaunch }: TopNavProps) {
  return (
    <header className="nav">
      <div className="nav-left">
        <div className="nav-logo" />
        <div className="nav-title">
          <span className="nav-title-main">Solana Casino</span>
          <span className="nav-title-sub">Jackpot &amp; coinflip · demo stack</span>
        </div>
      </div>
      <div className="nav-actions">
        <button type="button" className="btn btn-ghost" onClick={onLaunch}>
          Launch app
        </button>
        <WalletMultiButton className="btn btn-secondary" />
      </div>
    </header>
  );
}
