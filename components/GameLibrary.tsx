
import React, { useState } from 'react';
import { Game, LinkedAccount } from '../types';
import { GAMES } from '../constants';
import { Link2, Unlink, Search, Play, Plus, CheckCircle, Filter, Gamepad, Calendar, Mail } from 'lucide-react';

interface GameLibraryProps {
  onPlayClick: (gameId: string) => void;
}

const INITIAL_ACCOUNTS: LinkedAccount[] = [
  { id: 'steam', provider: 'Steam', username: 'RetroKing_99', connected: true, color: 'bg-[#171a21]' },
  { id: 'psn', provider: 'PlayStation Network', username: '', connected: false, color: 'bg-[#003791]' },
  { id: 'retro', provider: 'Retro Archive (Email)', username: '', connected: false, color: 'bg-[#d35400]' },
  { id: 'epic', provider: 'Epic Games', username: '', connected: false, color: 'bg-[#313131]' },
  { id: 'ubisoft', provider: 'Ubisoft', username: '', connected: false, color: 'bg-[#00589d]' },
];

const ERAS = [
  { label: 'All Time', min: 0, max: 9999 },
  { label: '80s', min: 1980, max: 1989 },
  { label: '90s', min: 1990, max: 1999 },
  { label: '2000s', min: 2000, max: 2009 },
  { label: '2010s', min: 2010, max: 2019 },
  { label: 'Modern', min: 2020, max: 2029 },
];

const GameLibrary: React.FC<GameLibraryProps> = ({ onPlayClick }) => {
  const [accounts, setAccounts] = useState<LinkedAccount[]>(INITIAL_ACCOUNTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedEra, setSelectedEra] = useState('All Time');

  const toggleConnection = (id: string) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.id === id) {
        const isRetro = id === 'retro';
        return {
          ...acc,
          connected: !acc.connected,
          username: !acc.connected ? (isRetro ? 'player@retrohub.com' : 'PlayerOne') : ''
        };
      }
      return acc;
    }));
  };

  const genres = ['All', ...Array.from(new Set(GAMES.map(g => g.genre)))];

  const filteredGames = GAMES.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.genre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || g.genre === selectedGenre;
    
    const era = ERAS.find(e => e.label === selectedEra);
    const matchesEra = era ? (g.releaseYear >= era.min && g.releaseYear <= era.max) : true;
    
    return matchesSearch && matchesGenre && matchesEra;
  });

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, title: string) => {
    e.currentTarget.src = `https://placehold.co/600x800/1a1a2e/ffffff?text=${encodeURIComponent(title)}`;
  };

  return (
    <div className="p-6 md:p-10 h-full overflow-y-auto bg-gaming-900 scrollbar-thin scrollbar-thumb-gaming-accent/50 scrollbar-track-gaming-900">
      <header className="mb-10 flex items-center gap-4 border-b border-gaming-700 pb-6">
        <div className="p-3 bg-gaming-800 rounded-lg border border-gaming-700 shadow-lg shadow-black/50">
            <Gamepad className="w-8 h-8 text-gaming-retro" />
        </div>
        <div>
            <h1 className="text-3xl md:text-4xl font-retro text-white mb-1 tracking-tight drop-shadow-[0_2px_0_rgba(0,0,0,1)]">Game Library</h1>
            <p className="text-gray-400 font-mono text-sm">SYNCED_STATUS: <span className="text-green-400">ONLINE</span></p>
        </div>
      </header>

      {/* Linked Accounts Section */}
      <section className="mb-12">
        <h2 className="text-sm font-bold text-gaming-neon uppercase tracking-widest mb-4 flex items-center gap-2">
          <Link2 className="w-4 h-4" />
          Neural Links
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {accounts.map((acc) => (
            <div 
              key={acc.id} 
              className={`relative overflow-hidden rounded-xl p-1 transition-all group ${
                acc.connected 
                  ? 'bg-gradient-to-br from-gaming-700 to-gaming-900' 
                  : 'bg-gaming-900 border border-dashed border-gaming-700'
              }`}
            >
              {acc.connected && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 animate-pulse pointer-events-none" />}
              
              <div className={`h-full rounded-lg p-4 relative z-10 ${acc.connected ? 'bg-gaming-800/80 backdrop-blur border border-gaming-600' : 'hover:bg-gaming-800/50 transition-colors'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-lg border border-white/10 ${acc.color}`}>
                        {acc.id === 'retro' ? <Mail className="w-5 h-5 text-white" /> : <span className="font-bold text-white">{acc.provider.charAt(0)}</span>}
                      </div>
                      <div>
                        <h3 className="font-bold text-white tracking-wide text-sm">{acc.provider}</h3>
                        {acc.connected ? (
                          <p className="text-[10px] text-green-400 flex items-center gap-1 font-mono bg-green-400/10 px-1.5 rounded border border-green-400/20 mt-1">
                            <CheckCircle className="w-3 h-3" /> {acc.username}
                          </p>
                        ) : (
                          <p className="text-[10px] text-gray-500 font-mono mt-1">LINK_REQUIRED</p>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => toggleConnection(acc.id)}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all border active:scale-95 ${
                        acc.connected
                          ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500 hover:text-white'
                          : 'bg-gaming-neon/10 text-gaming-neon border-gaming-neon/30 hover:bg-gaming-neon hover:text-gaming-900'
                      }`}
                    >
                      {acc.connected ? 'Unlink' : (acc.id === 'retro' ? 'Sync Email' : 'Connect')}
                    </button>
                  </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Games Grid */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 bg-gaming-800/30 p-4 rounded-xl border border-gaming-700/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-gaming-accent">///</span> DATABASE <span className="text-gray-500 text-sm font-mono">[{filteredGames.length}]</span>
          </h2>
          
          <div className="relative w-full md:w-64 group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-gaming-accent to-gaming-neon rounded-lg blur opacity-20 group-hover:opacity-75 transition duration-200"></div>
            <div className="relative flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-gray-400 group-hover:text-gaming-neon transition-colors" />
                <input 
                type="text" 
                placeholder="SEARCH_DATABASE..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gaming-900 border border-gaming-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-gaming-neon focus:ring-1 focus:ring-gaming-neon transition-all placeholder-gray-600 font-mono"
                />
            </div>
          </div>
        </div>

        {/* Filters Container */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
             <div className="flex-shrink-0 flex items-center gap-2 text-gaming-neon mr-2 bg-gaming-neon/10 px-3 rounded-lg border border-gaming-neon/20 h-8">
               <Filter className="w-4 h-4" />
               <span className="text-xs font-bold uppercase tracking-wider">Genre</span>
             </div>
             {genres.map(genre => (
               <button
                 key={genre}
                 onClick={() => setSelectedGenre(genre)}
                 className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border flex-shrink-0 ${
                   selectedGenre === genre
                   ? 'bg-gaming-accent text-white border-gaming-accent shadow-[0_0_10px_rgba(233,69,96,0.4)]'
                   : 'bg-gaming-800 text-gray-400 border-gaming-700 hover:border-gaming-neon hover:text-white'
                 }`}
               >
                 {genre}
               </button>
             ))}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
             <div className="flex-shrink-0 flex items-center gap-2 text-gaming-retro mr-2 bg-gaming-retro/10 px-3 rounded-lg border border-gaming-retro/20 h-8">
               <Calendar className="w-4 h-4" />
               <span className="text-xs font-bold uppercase tracking-wider">Era</span>
             </div>
             {ERAS.map(era => (
               <button
                 key={era.label}
                 onClick={() => setSelectedEra(era.label)}
                 className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border flex-shrink-0 ${
                   selectedEra === era.label
                   ? 'bg-gaming-retro text-white border-gaming-retro shadow-[0_0_10px_rgba(255,142,60,0.4)]'
                   : 'bg-gaming-800 text-gray-400 border-gaming-700 hover:border-gaming-retro hover:text-white'
                 }`}
               >
                 {era.label}
               </button>
             ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          <button 
             onClick={() => alert('Redeem Code feature coming soon!')}
             className="aspect-[3/4] rounded-xl border-2 border-dashed border-gaming-700 hover:border-gaming-neon hover:bg-gaming-800/50 transition-all group flex flex-col items-center justify-center gap-3 relative overflow-hidden active:scale-95"
          >
             <div className="absolute inset-0 bg-gaming-neon/5 opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="w-14 h-14 rounded-full bg-gaming-800 group-hover:bg-gaming-neon/20 flex items-center justify-center transition-all duration-300 border border-gaming-700 group-hover:border-gaming-neon group-hover:shadow-[0_0_15px_rgba(15,240,252,0.3)] z-10">
               <Plus className="w-6 h-6 text-gray-500 group-hover:text-gaming-neon" />
             </div>
             <span className="text-xs font-bold text-gray-500 group-hover:text-white uppercase tracking-wider z-10">Redeem Code</span>
          </button>

          {filteredGames.map((game) => (
            <div key={game.id} className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-gaming-800 border border-gaming-700 hover:border-gaming-accent/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(233,69,96,0.2)]">
              <img 
                src={game.coverUrl} 
                alt={game.title} 
                onError={(e) => handleImageError(e, game.title)}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gaming-900 via-gaming-900/20 to-transparent opacity-90" />
              
              <div className="absolute bottom-0 left-0 w-full p-4 z-10">
                <h3 className="font-bold text-white text-sm leading-tight mb-2 drop-shadow-md line-clamp-2 h-10">{game.title}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-gaming-neon bg-gaming-neon/10 border border-gaming-neon/20 px-2 py-0.5 rounded uppercase">{game.genre}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={`text-[8px] ${i < Math.round(game.rating) ? 'text-yellow-400' : 'text-gray-700'}`}>★</span>
                    ))}
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-gray-400 font-mono bg-black/40 inline-block px-1 rounded">
                   {game.releaseYear}
                </div>
              </div>

              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 border-2 border-gaming-accent rounded-xl m-[-2px]">
                <button 
                  onClick={() => onPlayClick(game.id)}
                  className="bg-gaming-accent text-white px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-red-600 hover:scale-105 transition-all duration-200 shadow-[0_0_15px_rgba(233,69,96,0.6)] uppercase tracking-wide active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current" /> Play
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default GameLibrary;
