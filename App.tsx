
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ConsoleMarket from './components/ConsoleMarket';
import ActiveSession from './components/ActiveSession';
import GameLibrary from './components/GameLibrary';
import TournamentHub from './components/TournamentHub';
import WalletView from './components/WalletView';
import LandingPage from './components/LandingPage';
import DashboardHub from './components/DashboardHub';
import Leaderboard from './components/Leaderboard';
import { ViewState, Session, ConsoleModel } from './types';
import { ToastProvider } from './contexts/ToastContext';

const AppContent: React.FC = () => {
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // App State
  const [view, setView] = useState<ViewState>('dashboard');
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [walletBalance, setWalletBalance] = useState(42.50);
  const [preSelectedGameId, setPreSelectedGameId] = useState<string | null>(null);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setView('dashboard');
  };

  const handleRent = (consoleModel: ConsoleModel, gameId: string) => {
    // Create a new session
    const newSession: Session = {
      id: Date.now().toString(),
      consoleId: consoleModel.id,
      gameId: gameId,
      startTime: Date.now(),
      isPartyMode: false,
      chatLog: []
    };
    setCurrentSession(newSession);
    setPreSelectedGameId(null);
    setView('session');
  };

  const handleEndSession = () => {
    setCurrentSession(null);
    setView('dashboard');
  };

  const handleLibraryPlayClick = (gameId: string) => {
    setPreSelectedGameId(gameId);
    setView('market');
  };

  const handleAddFunds = (amount: number) => {
    setWalletBalance(prev => prev + amount);
  };

  const setViewAndClearParams = (newView: ViewState) => {
    setView(newView);
    if (newView !== 'market') {
      setPreSelectedGameId(null);
    }
  };

  // 1. If not logged in, show Landing Page
  if (!isLoggedIn) {
    return <LandingPage onLogin={handleLogin} />;
  }

  // 2. If logged in and in a session, render immersive stream view
  if (view === 'session' && currentSession) {
    return <ActiveSession session={currentSession} onEndSession={handleEndSession} />;
  }

  // 3. Main Dashboard Layout
  return (
    <div className="flex h-screen bg-gaming-900 text-white font-sans">
      <Navbar currentView={view} setView={setViewAndClearParams} />
      
      <main className="flex-1 overflow-hidden relative">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-gaming-800 to-transparent pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gaming-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 -left-20 w-72 h-72 bg-gaming-neon/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative h-full z-10">
          {view === 'dashboard' && (
            <DashboardHub setView={setViewAndClearParams} />
          )}
          
          {view === 'market' && (
            <ConsoleMarket onRent={handleRent} preSelectedGameId={preSelectedGameId} />
          )}

          {view === 'library' && (
             <GameLibrary onPlayClick={handleLibraryPlayClick} />
          )}

          {view === 'tournaments' && (
            <TournamentHub />
          )}

          {view === 'leaderboard' && (
            <Leaderboard />
          )}

          {view === 'wallet' && (
            <WalletView balance={walletBalance} onAddFunds={handleAddFunds} />
          )}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;
