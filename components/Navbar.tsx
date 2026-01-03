
import React from 'react';
import { LayoutGrid, Gamepad2, Library, MonitorPlay, UserCircle, Trophy, Wallet, BarChart2 } from 'lucide-react';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Hub', icon: LayoutGrid },
    { id: 'market', label: 'Rentals', icon: MonitorPlay },
    { id: 'library', label: 'Game Library', icon: Library },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy },
    { id: 'leaderboard', label: 'Leaderboard', icon: BarChart2 },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
  ];

  return (
    <nav className="w-20 md:w-64 flex-shrink-0 bg-gaming-900 border-r border-gaming-700 flex flex-col justify-between h-full transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] z-50">
      <div>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gaming-accent rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(233,69,96,0.5)] border border-gaming-accent/50">
            <Gamepad2 className="text-white w-6 h-6" />
          </div>
          <span className="hidden md:block font-retro text-sm tracking-tighter text-gaming-neon drop-shadow-[0_0_5px_rgba(15,240,252,0.5)]">
            V-CONSOLE
          </span>
        </div>

        <div className="mt-8 px-3 space-y-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewState)}
              className={`relative w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 group overflow-hidden ${
                currentView === item.id
                  ? 'bg-gaming-800 text-white shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] border-l-4 border-gaming-neon'
                  : 'text-gray-400 hover:bg-gaming-800/50 hover:text-white border-l-4 border-transparent'
              }`}
            >
              {currentView === item.id && (
                 <div className="absolute inset-0 bg-gaming-neon/5 pointer-events-none" />
              )}
              
              <item.icon className={`w-6 h-6 z-10 transition-colors ${
                  currentView === item.id ? 'text-gaming-neon drop-shadow-[0_0_8px_rgba(15,240,252,0.8)]' : 'group-hover:text-gray-200'
              }`} />
              <span className={`hidden md:block font-bold tracking-wide z-10 ${currentView === item.id ? 'text-gaming-neon' : ''}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gaming-800 bg-black/20">
        <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gaming-800/50 text-gray-400 hover:text-white transition-colors group border border-transparent hover:border-gaming-700">
          <div className="relative">
            <UserCircle className="w-8 h-8 group-hover:text-gaming-accent transition-colors" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gaming-900"></div>
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-bold text-white group-hover:text-gaming-accent transition-colors">PlayerOne</p>
            <p className="text-[10px] uppercase tracking-wider text-gaming-neon bg-gaming-neon/10 px-2 py-0.5 rounded mt-0.5 inline-block border border-gaming-neon/20">Pro Member</p>
          </div>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
