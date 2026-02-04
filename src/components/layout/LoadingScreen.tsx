import { motion } from 'framer-motion';

import '../../App.css';

export function LoadingScreen() {
  return (
    <motion.div
      className="loading-overlay"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="loading-inner">
        <div className="spinner-ring" />
        <div className="loading-title">CASINO</div>
        <div className="loading-sub">Booting Solana dashboard…</div>
      </div>
    </motion.div>
  );
}
