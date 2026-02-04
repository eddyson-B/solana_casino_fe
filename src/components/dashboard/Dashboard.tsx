import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { apiClient } from '../../lib/api';
import type { JackpotState, CoinflipGame } from '../../lib/api';
import { JackpotCard } from './JackpotCard';
import { CoinflipCard } from './CoinflipCard';
import { SessionCard } from './SessionCard';
import { AuthCard } from './AuthCard';

import '../../App.css';

export function Dashboard() {
  const { publicKey } = useWallet();
  const [jackpotState, setJackpotState] = useState<JackpotState | null>(null);
  const [coinflipHistory, setCoinflipHistory] = useState<CoinflipGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, [publicKey]);

  const loadData = async () => {
    try {
      const [jackpot, history] = await Promise.all([
        apiClient.getJackpotState(),
        publicKey ? apiClient.getCoinflipHistory(publicKey.toString()) : Promise.resolve([]),
      ]);
      setJackpotState(jackpot);
      setCoinflipHistory(history);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJackpotJoin = async (ticketCount: number) => {
    if (!publicKey) return;
    try {
      const updated = await apiClient.joinJackpot(publicKey.toString(), ticketCount);
      setJackpotState(updated);
    } catch (error) {
      console.error('Failed to join jackpot:', error);
      alert('Failed to join jackpot. Check console for details.');
    }
  };

  const handleCoinflip = async (betAmount: number, choice: 'heads' | 'tails'): Promise<CoinflipGame> => {
    if (!publicKey) throw new Error('Wallet not connected');
    try {
      const game = await apiClient.createCoinflip(publicKey.toString(), betAmount, choice);
      setCoinflipHistory((prev) => [game, ...prev]);
      return game;
    } catch (error) {
      console.error('Failed to create coinflip:', error);
      alert('Failed to create coinflip. Check console for details.');
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner-ring" />
        <p>Loading casino data...</p>
      </div>
    );
  }

  return (
    <main className="dashboard-main">
      <div className="dashboard-hero">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hero-content"
        >
          <h1 className="hero-title">
            Welcome to <span className="gradient-text">Solana Casino</span>
          </h1>
          <p className="hero-subtitle">
            Play jackpot and coinflip games powered by Solana blockchain. Fast, fair, and transparent.
          </p>
        </motion.div>
        {jackpotState && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hero-jackpot"
          >
            <div className="jackpot-display">
              <span className="jackpot-label">Current Jackpot</span>
              <span className="jackpot-amount">{jackpotState.currentPot.toFixed(2)} SOL</span>
              <span className="jackpot-meta">
                {jackpotState.totalPlayers} players · {jackpotState.totalTickets} tickets
              </span>
            </div>
          </motion.div>
        )}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-left">
          {jackpotState && (
            <JackpotCard state={jackpotState} onJoin={handleJackpotJoin} walletConnected={!!publicKey} />
          )}
          <CoinflipCard onFlip={handleCoinflip} walletConnected={!!publicKey} history={coinflipHistory} />
        </div>
        <div className="dashboard-right">
          <SessionCard history={coinflipHistory} />
          <AuthCard />
        </div>
      </div>
    </main>
  );
}
