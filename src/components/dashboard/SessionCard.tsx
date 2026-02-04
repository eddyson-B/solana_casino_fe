import type { CoinflipGame } from '../../lib/api';
import '../../App.css';

interface SessionCardProps {
  history: CoinflipGame[];
}

export function SessionCard({ history }: SessionCardProps) {
  const totalGames = history.length;
  const wins = history.filter((g) => g.won).length;
  const losses = totalGames - wins;
  const totalWon = history.filter((g) => g.won).reduce((sum, g) => sum + (g.payout || 0), 0);
  const totalLost = history.filter((g) => !g.won).reduce((sum, g) => sum + g.betAmount, 0);
  const netProfit = totalWon - totalLost;

  const bestStreak = history.reduce(
    (acc, game) => {
      if (game.won) {
        acc.current += 1;
        acc.best = Math.max(acc.best, acc.current);
      } else {
        acc.current = 0;
      }
      return acc;
    },
    { current: 0, best: 0 }
  ).best;

  return (
    <div className="info-card session-card">
      <div className="card-header">
        <h3 className="card-title-small">Session Stats</h3>
      </div>
      <div className="session-stats">
        <div className="stat-box">
          <span className="stat-label">Total Games</span>
          <span className="stat-value-large">{totalGames}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Wins</span>
          <span className="stat-value positive">{wins}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Losses</span>
          <span className="stat-value negative">{losses}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Best Streak</span>
          <span className="stat-value">{bestStreak}</span>
        </div>
        <div className="stat-box highlight-box">
          <span className="stat-label">Net Profit</span>
          <span className={`stat-value-large ${netProfit >= 0 ? 'positive' : 'negative'}`}>
            {netProfit >= 0 ? '+' : ''}
            {netProfit.toFixed(2)} SOL
          </span>
        </div>
      </div>
    </div>
  );
}
