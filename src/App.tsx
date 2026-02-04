import { useEffect, useState } from 'react';
import './App.css';
import { AnimatePresence } from 'framer-motion';
import { AppShell } from './components/layout/AppShell';
import { Landing } from './components/landing/Landing';
import { Dashboard } from './components/dashboard/Dashboard';
import { LoadingScreen } from './components/layout/LoadingScreen';

type View = 'landing' | 'dashboard';

function App() {
  const [view, setView] = useState<View>('landing');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>{loading && <LoadingScreen />}</AnimatePresence>
      <AppShell onLaunchDashboard={() => setView('dashboard')}>
        {view === 'landing' ? <Landing onLaunch={() => setView('dashboard')} /> : <Dashboard />}
      </AppShell>
    </>
  );
}

export default App;
