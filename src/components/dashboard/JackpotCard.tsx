import { useState } from 'react';
import { motion } from 'framer-motion';
import type { JackpotState } from '../../lib/api';
import '../../App.css';

interface JackpotCardProps {
  state: JackpotState;
  onJoin: (tickets: number) => Promise<void>;
  walletConnected: boolean;
}

export function JackpotCard({ state, onJoin, walletConnected }: JackpotCardProps) {
  const [ticketCount, setTicketCount] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!walletConnected) {
      alert('Please connect your wallet first');
      return;
    }
    setLoading(true);
    try {
      await onJoin(ticketCount);
    } finally {
      setLoading(false);
    }
  };

  const timeUntilDraw = Math.max(0, Math.floor((new Date(state.nextDrawAt).getTime() - Date.now()) / 1000));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="game-card jackpot-card"
    >
      <div className="card-header">
        <h2 className="card-title">
          <span className="card-icon">🎰</span>
          Jackpot
        </h2>
        <div className="card-badge">Live</div>
      </div>

      <div className="jackpot-stats">
        <div className="stat-item">
          <span className="stat-label">Current Pot</span>
          <span className="stat-value highlight">{state.currentPot.toFixed(2)} SOL</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Players</span>
          <span className="stat-value">{state.totalPlayers}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Tickets</span>
          <span className="stat-value">{state.totalTickets}</span>
        </div>
      </div>

      <div className="jackpot-timer">
        <div className="timer-label">Next Draw In</div>
        <div className="timer-value">{Math.floor(timeUntilDraw / 60)}:{(timeUntilDraw % 60).toString().padStart(2, '0')}</div>
      </div>

      <div className="jackpot-participants">
        <div className="participants-label">Recent Entries</div>
        <div className="participants-list">
          {state.entries.slice(-5).map((entry, idx) => (
            <div key={idx} className="participant-item">
              <span className="participant-address">
                {entry.playerAddress.slice(0, 4)}...{entry.playerAddress.slice(-4)}
              </span>
              <span className="participant-tickets">{entry.ticketCount} tickets</span>
            </div>
          ))}
        </div>
      </div>

      <div className="jackpot-join">
        <div className="join-controls">
          <button
            type="button"
            className="ticket-btn"
            onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
            disabled={ticketCount <= 1}
          >
            −
          </button>
          <input
            type="number"
            min="1"
            max="100"
            value={ticketCount}
            onChange={(e) => setTicketCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
            className="ticket-input"
          />
          <button
            type="button"
            className="ticket-btn"
            onClick={() => setTicketCount(Math.min(100, ticketCount + 1))}
            disabled={ticketCount >= 100}
          >
            +
          </button>
        </div>
        <div className="join-cost">
          Cost: {(ticketCount * 0.1).toFixed(2)} SOL ({ticketCount} ticket{ticketCount !== 1 ? 's' : ''})
        </div>
        <button
          type="button"
          className="btn btn-primary btn-large"
          onClick={handleJoin}
          disabled={loading || !walletConnected}
        >
          {loading ? 'Joining...' : walletConnected ? 'Join Jackpot' : 'Connect Wallet'}
        </button>
      </div>
    </motion.div>
  );
}
