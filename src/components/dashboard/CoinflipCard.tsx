import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CoinflipGame } from '../../lib/api';
import '../../App.css';

interface CoinflipCardProps {
  onFlip: (amount: number, choice: 'heads' | 'tails') => Promise<CoinflipGame>;
  walletConnected: boolean;
  history: CoinflipGame[];
}

export function CoinflipCard({ onFlip, walletConnected, history }: CoinflipCardProps) {
  const [choice, setChoice] = useState<'heads' | 'tails'>('heads');
  const [betAmount, setBetAmount] = useState('0.1');
  const [isFlipping, setIsFlipping] = useState(false);
  const [lastResult, setLastResult] = useState<CoinflipGame | null>(null);

  const handleFlip = async () => {
    if (!walletConnected) {
      alert('Please connect your wallet first');
      return;
    }
    const amount = parseFloat(betAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid bet amount');
      return;
    }

    setIsFlipping(true);
    setLastResult(null);

    try {
      const result = await onFlip(amount, choice);
      setLastResult(result);
    } catch (error) {
      console.error('Flip failed:', error);
    } finally {
      setTimeout(() => setIsFlipping(false), 1500);
    }
  };

  const winRate = history.length > 0
    ? (history.filter((g) => g.won).length / history.length) * 100
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="game-card coinflip-card"
    >
      <div className="card-header">
        <h2 className="card-title">
          <span className="card-icon">🪙</span>
          Coinflip
        </h2>
        <div className="card-badge">50/50</div>
      </div>

      <div className="coinflip-game">
        <div className="coinflip-controls">
          <div className="choice-buttons">
            <button
              type="button"
              className={`choice-btn ${choice === 'heads' ? 'active' : ''}`}
              onClick={() => setChoice('heads')}
              disabled={isFlipping}
            >
              Heads
            </button>
            <button
              type="button"
              className={`choice-btn ${choice === 'tails' ? 'active' : ''}`}
              onClick={() => setChoice('tails')}
              disabled={isFlipping}
            >
              Tails
            </button>
          </div>

          <div className="bet-input-group">
            <label className="bet-label">Bet Amount (SOL)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              className="bet-input"
              disabled={isFlipping}
              placeholder="0.1"
            />
          </div>

          <button
            type="button"
            className="btn btn-primary btn-large"
            onClick={handleFlip}
            disabled={isFlipping || !walletConnected}
          >
            {isFlipping ? 'Flipping...' : walletConnected ? 'Flip Coin' : 'Connect Wallet'}
          </button>
        </div>

        <div className="coinflip-visual">
          <motion.div
            className="coin-container"
            animate={
              isFlipping
                ? {
                    rotateY: [0, 360, 720, 1080, 1440],
                    scale: [1, 1.1, 1, 1.1, 1],
                  }
                : lastResult
                  ? { rotateY: lastResult.result === 'tails' ? 180 : 0 }
                  : { rotateY: choice === 'tails' ? 180 : 0 }
            }
            transition={{ duration: isFlipping ? 1.5 : 0.5, ease: 'easeInOut' }}
          >
            <div className="coin">
              <div className="coin-face coin-heads">H</div>
              <div className="coin-face coin-tails">T</div>
            </div>
          </motion.div>

          <AnimatePresence>
            {lastResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`result-message ${lastResult.won ? 'win' : 'lose'}`}
              >
                {lastResult.won ? (
                  <>
                    <span className="result-icon">🎉</span>
                    <span>You won {lastResult.payout?.toFixed(2)} SOL!</span>
                  </>
                ) : (
                  <>
                    <span className="result-icon">😔</span>
                    <span>You lost {lastResult.betAmount.toFixed(2)} SOL</span>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {history.length > 0 && (
        <div className="coinflip-stats">
          <div className="stat-row">
            <span>Total Games</span>
            <span>{history.length}</span>
          </div>
          <div className="stat-row">
            <span>Win Rate</span>
            <span>{winRate.toFixed(1)}%</span>
          </div>
          <div className="stat-row">
            <span>Total Won</span>
            <span className="positive">
              +{history.filter((g) => g.won).reduce((sum, g) => sum + (g.payout || 0), 0).toFixed(2)} SOL
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
