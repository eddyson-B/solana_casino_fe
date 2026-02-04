import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import '../../App.css';

export type CoinChoice = 'heads' | 'tails';

export function Dashboard() {
  const [coinChoice, setCoinChoice] = useState<CoinChoice>('heads');
  const [coinResult, setCoinResult] = useState<CoinChoice | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [betAmount, setBetAmount] = useState('0.1');

  const jackpotPot = useMemo(() => 12.34, []);
  const jackpotPlayers = useMemo(() => 32, []);
  const jackpotYourTickets = useMemo(() => 4, []);

  const handleFlip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setCoinResult(null);
    setTimeout(() => {
      const result: CoinChoice = Math.random() > 0.5 ? 'heads' : 'tails';
      setCoinResult(result);
      setIsFlipping(false);
    }, 1000);
  };

  return (
    <main className="app-main">
      <section className="hero-card">
        <div className="hero-grid">
          <HeroCopy />
          <HeroVisual jackpotPot={jackpotPot} />
        </div>
      </section>

      <section className="games-column">
        <JackpotCard
          jackpotPot={jackpotPot}
          jackpotPlayers={jackpotPlayers}
          jackpotYourTickets={jackpotYourTickets}
        />
        <CoinflipCard
          choice={coinChoice}
          setChoice={setCoinChoice}
          betAmount={betAmount}
          setBetAmount={setBetAmount}
          onFlip={handleFlip}
          result={coinResult}
          isFlipping={isFlipping}
        />
      </section>

      <section className="right-column">
        <SessionCard />
        <AuthCard />
      </section>
    </main>
  );
}

function HeroCopy() {
  return (
    <div>
      <div className="hero-kicker">
        <span>LIVE SOLANA CASINO</span>
        <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>JACKPOT · COINFLIP</span>
      </div>
      <h1 className="hero-title">
        High-voltage games.
        <br />
        <span>On-chain fairness.</span>
      </h1>
      <p className="hero-subtitle">
        Jackpot wheels and 50/50 coinflips powered by Solana. This dashboard is structured so you
        can plug in real contracts and APIs without touching the layout.
      </p>
      <div className="hero-cta">
        <button className="btn btn-primary" type="button">
          Enter jackpot lobby
        </button>
        <button className="btn btn-secondary" type="button">
          Play a quick coinflip
        </button>
        <button className="btn btn-ghost" type="button">
          View API &amp; contract
        </button>
      </div>
    </div>
  );
}

function HeroVisual({ jackpotPot }: { jackpotPot: number }) {
  return (
    <div className="hero-right">
      <div className="orbital" />
      <motion.div
        className="chip"
        animate={{ rotate: [0, 6, -4, 0], y: [0, -6, 2, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="chip-inner">
          <span className="chip-title">Current jackpot</span>
          <span className="chip-pot">{jackpotPot.toFixed(2)} SOL</span>
          <span className="chip-label">Simulated pool · devnet</span>
        </div>
        <div className="chip-ring" />
        <motion.div
          className="chip-orbit-dot"
          initial={{ top: '8%', left: '50%' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>
    </div>
  );
}

interface JackpotCardProps {
  jackpotPot: number;
  jackpotPlayers: number;
  jackpotYourTickets: number;
}

function JackpotCard({ jackpotPot, jackpotPlayers, jackpotYourTickets }: JackpotCardProps) {
  return (
    <div className="pane">
      <header className="pane-header">
        <div className="pane-title">
          <span>Jackpot</span>
          <span className="pill">Every 60 seconds · demo data</span>
        </div>
        <span className="muted">On-chain settlement via Anchor program (design)</span>
      </header>

      <div className="game-metrics">
        <div className="metric-card">
          <span className="metric-label">Current pot</span>
          <div className="metric-value">{jackpotPot.toFixed(2)} SOL</div>
        </div>
        <div className="metric-card">
          <span className="metric-label">Players</span>
          <div className="metric-value">{jackpotPlayers}</div>
        </div>
        <div className="metric-card">
          <span className="metric-label">Your tickets</span>
          <div className="metric-value">{jackpotYourTickets}</div>
        </div>
      </div>

      <div className="jackpot-wheel">
        <div className="jackpot-strip">
          {['eddyson-b', 'guest_01', 'vip_whale', 'anon777', 'demo-dev'].map((name, index) => (
            <div key={name} className={`ticket ${index === 2 ? 'ticket-highlight' : ''}`}>
              {name}
            </div>
          ))}
        </div>
        <div className="jackpot-indicator">
          <span />
        </div>
      </div>

      <div className="jackpot-cta">
        <div className="muted">
          Backend and contract will decide odds and settlement; this strip only visualizes how the
          draw will feel.
        </div>
        <button type="button" className="btn btn-primary">
          Join with 1 ticket
        </button>
      </div>
    </div>
  );
}

interface CoinflipCardProps {
  choice: CoinChoice;
  setChoice: (c: CoinChoice) => void;
  betAmount: string;
  setBetAmount: (v: string) => void;
  onFlip: () => void;
  result: CoinChoice | null;
  isFlipping: boolean;
}

function CoinflipCard({
  choice,
  setChoice,
  betAmount,
  setBetAmount,
  onFlip,
  result,
  isFlipping,
}: CoinflipCardProps) {
  const displayResult =
    result != null ? (result === choice ? 'You would win' : 'You would lose') : 'Awaiting flip…';

  return (
    <div className="pane">
      <header className="pane-header">
        <div className="pane-title">
          <span>Coinflip</span>
          <span className="pill">50 / 50 · simulated</span>
        </div>
        <span className="muted">Hook this up to the Anchor program + API.</span>
      </header>

      <div className="coinflip-grid">
        <div className="coin-card">
          <div className="coin-choices">
            <button
              type="button"
              className="chip-choice"
              data-active={choice === 'heads'}
              onClick={() => setChoice('heads')}
            >
              Heads
            </button>
            <button
              type="button"
              className="chip-choice"
              data-active={choice === 'tails'}
              onClick={() => setChoice('tails')}
            >
              Tails
            </button>
          </div>

          <div className="amount-input-row">
            <input
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              placeholder="Amount in SOL"
            />
            <button type="button" className="btn btn-secondary" onClick={onFlip} disabled={isFlipping}>
              {isFlipping ? 'Flipping…' : 'Flip coin'}
            </button>
          </div>

          <div className="coin-meta">
            <span>Result (simulated): {displayResult}</span>
            <span>House edge, fees, and randomness will live in on-chain logic.</span>
          </div>
        </div>

        <div className="coin-scene">
          <motion.div
            className="coin-visual"
            animate={
              isFlipping
                ? { rotateY: [0, 360, 720, 1080] }
                : { rotateY: result === 'tails' ? 180 : 0 }
            }
            transition={{ duration: isFlipping ? 1.0 : 0.5, ease: 'easeInOut' }}
          >
            {result ?? choice === 'heads' ? 'H' : 'T'}
          </motion.div>
        </div>
      </div>
      <div className="coin-face-label">Visual only · no real funds used</div>
    </div>
  );
}

function SessionCard() {
  return (
    <div className="session-card">
      <div className="pane-header">
        <div className="pane-title">
          <span>Session overview</span>
        </div>
        <span className="muted">Local-only metrics (no persistence yet)</span>
      </div>
      <div className="session-list">
        <div className="session-row">
          <span>Total games played</span>
          <span className="badge badge-positive">demo</span>
        </div>
        <div className="session-row">
          <span>Best streak</span>
          <span className="badge badge-positive">+3 (example)</span>
        </div>
        <div className="session-row">
          <span>Largest jackpot win</span>
          <span className="badge badge-positive">2.1 SOL (simulated)</span>
        </div>
        <div className="session-row">
          <span>Biggest drawdown</span>
          <span className="badge badge-negative">-1.4 SOL (simulated)</span>
        </div>
      </div>
    </div>
  );
}

function AuthCard() {
  return (
    <div className="auth-card">
      <div className="pane-header">
        <div className="pane-title">
          <span>Connect &amp; identity</span>
        </div>
      </div>
      <p className="small">
        Wallet connection is powered by Solana wallet adapter. Social login (Google via Privy) will
        be wired through the backend with token verification.
      </p>
      <div className="hero-cta">
        <WalletMultiButton className="btn btn-secondary" />
        <button type="button" className="btn btn-ghost">
          Continue with Google (Privy demo)
        </button>
      </div>
      <p className="small">
        To connect Privy, provide `VITE_PRIVY_APP_ID` and wrap the app with the Privy provider in
        `main.tsx`, then verify JWTs in the API.
      </p>
    </div>
  );
}
