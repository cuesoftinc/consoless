"use client";

import React, { useState } from "react";
import { CONSOLES, GAMES } from "@/mocks/seed";
import { ConsoleModel, ConsoleType } from "@/models/types";
import {
  Cpu,
  Zap,
  Terminal,
  Users,
  X,
  Gamepad,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/controllers/toast";
import { useAppState } from "@/controllers/app-state";

interface ConsoleMarketProps {
  preSelectedGameId?: string | null;
}

const ConsoleMarket: React.FC<ConsoleMarketProps> = ({ preSelectedGameId }) => {
  const { startSession: onRent } = useAppState();
  const [filter, setFilter] = useState<ConsoleType | "ALL">("ALL");
  const [selectedConsole, setSelectedConsole] = useState<ConsoleModel | null>(
    null,
  );
  const { addToast } = useToast();

  const targetGame = preSelectedGameId
    ? GAMES.find((g) => g.id === preSelectedGameId)
    : null;

  const filteredConsoles = CONSOLES.filter((c) => {
    const matchesFilter = filter === "ALL" || c.type === filter;
    const matchesGame = targetGame
      ? c.supportedGames.includes(targetGame.id)
      : true;
    return matchesFilter && matchesGame;
  });

  const handleConsoleClick = (consoleModel: ConsoleModel) => {
    if (targetGame) {
      addToast(
        `Allocating ${consoleModel.name} for ${targetGame.title}...`,
        "info",
      );
      setTimeout(() => {
        onRent(consoleModel, targetGame.id);
      }, 800);
    } else {
      setSelectedConsole(consoleModel);
    }
  };

  const handleGameConfirm = (gameId: string) => {
    if (!selectedConsole) return;

    addToast(`Allocating ${selectedConsole.name} instance...`, "info");
    setTimeout(() => {
      onRent(selectedConsole, gameId);
      setSelectedConsole(null);
    }, 800);
  };

  const getActivePlayers = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash % 500) + 50;
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    e.currentTarget.src = `https://placehold.co/800x600/1a1a2e/ffffff?text=V-CONSOLE+${encodeURIComponent(e.currentTarget.alt)}`;
  };

  return (
    <div className="p-6 md:p-10 h-full overflow-y-auto bg-gaming-900 scrollbar-thin scrollbar-thumb-gaming-neon/20 scrollbar-track-gaming-900 relative">
      <header className="mb-10 flex items-end justify-between border-b border-gaming-700 pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-retro text-white mb-2 tracking-tight drop-shadow-[0_2px_0_var(--black)]">
            {targetGame ? (
              <>
                Play{" "}
                <span className="text-gaming-neon">{targetGame.title}</span>
              </>
            ) : (
              <>
                Console <span className="text-gaming-neon">Market</span>
              </>
            )}
          </h1>
          <p className="text-gray-400 font-mono text-sm flex items-center gap-2">
            <Terminal className="w-4 h-4 text-gaming-accent" />
            {targetGame
              ? "SELECT_HARDWARE_PLATFORM"
              : "SELECT_SYSTEM_FOR_DEPLOYMENT"}
          </p>
        </div>
      </header>

      {/* Filters */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2 no-scrollbar">
        {["ALL", ConsoleType.MODERN, ConsoleType.RETRO, ConsoleType.PC].map(
          (type) => (
            <button
              key={type}
              onClick={() => setFilter(type as ConsoleType | "ALL")}
              aria-pressed={filter === type}
              className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all border-2 ${
                filter === type
                  ? "bg-gaming-accent border-gaming-accent text-white shadow-[0_0_15px_color-mix(in_oklab,var(--gaming-accent)_50%,transparent)]"
                  : "bg-gaming-800 border-gaming-700 text-gray-400 hover:border-gaming-neon hover:text-white hover:bg-gaming-800"
              }`}
            >
              {type === "ALL" ? "ALL_SYSTEMS" : type}
            </button>
          ),
        )}
      </div>

      {/* Grid */}
      {filteredConsoles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredConsoles.map((item) => {
            const activePlayers = getActivePlayers(item.id);

            return (
              <div
                key={item.id}
                className="bg-gaming-800 rounded-xl overflow-hidden border border-gaming-700 hover:border-gaming-neon hover:shadow-[0_0_25px_color-mix(in_oklab,var(--gaming-neon)_15%,transparent)] transition-all duration-300 group flex flex-col relative"
              >
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gaming-700 group-hover:border-gaming-neon transition-colors rounded-tl-xl z-10" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gaming-700 group-hover:border-gaming-neon transition-colors rounded-br-xl z-10" />

                <div className="relative h-48 overflow-hidden bg-gaming-900">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    onError={handleImageError}
                    className="w-full h-full object-cover group-hover:scale-110 group-hover:opacity-80 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gaming-800 opacity-90" />

                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-sm border border-gaming-neon/30 flex items-center gap-1 shadow-lg">
                    <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-[10px] font-bold text-white tracking-wider uppercase">
                      {item.tier}
                    </span>
                  </div>

                  {item.type === ConsoleType.RETRO && (
                    <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col relative z-0">
                  <div className="mb-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold text-white group-hover:text-gaming-neon transition-colors tracking-wide">
                        {item.name}
                      </h3>
                    </div>
                    <p className="text-[10px] text-gaming-retro font-mono mt-1 border-l-2 border-gaming-retro pl-2 opacity-80">
                      {item.specs}
                    </p>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 bg-gaming-900/50 p-1.5 rounded-sm border border-gaming-700/50">
                      <Cpu className="w-3 h-3 text-gaming-neon" />
                      <span>Instant Provisioning</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 bg-gaming-900/50 p-1.5 rounded-sm border border-gaming-700/50">
                      <Users className="w-3 h-3 text-blue-400" />
                      <span>{activePlayers} Active Peers</span>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-end justify-between mb-4 border-b border-gaming-700 pb-2">
                      <span className="text-xs text-gray-500 font-mono uppercase">
                        Rate
                      </span>
                      <span className="text-xl font-bold text-white font-mono">
                        ${item.hourlyRate.toFixed(2)}
                        <span className="text-xs text-gray-500">/hr</span>
                      </span>
                    </div>
                    <button
                      onClick={() => handleConsoleClick(item)}
                      className={`w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-xs shadow-lg ${targetGame ? "bg-gaming-accent text-white hover:bg-red-600 shadow-gaming-accent/30" : "bg-white text-gaming-900 hover:bg-gaming-neon hover:shadow-gaming-neon/50"}`}
                    >
                      <Gamepad className="w-4 h-4" />
                      {targetGame ? "Launch Game" : "Select & Play"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-gaming-800/30 rounded-2xl border border-gaming-700 border-dashed text-center p-8">
          <AlertCircle className="w-12 h-12 text-gray-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">
            No Consoles Found
          </h3>
          <p className="text-gray-500 max-w-md">
            {targetGame
              ? `There are no available consoles matching your filter that support "${targetGame.title}". Try switching the console type filter above.`
              : "Try adjusting your filters to see available hardware."}
          </p>
          <button
            onClick={() => setFilter("ALL")}
            className="mt-6 px-6 py-2 bg-gaming-700 hover:bg-gaming-600 text-white rounded-lg font-bold text-sm transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Game Selection Modal (Only if no game pre-selected) */}
      {selectedConsole && !targetGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in-up">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="console-library-title"
            className="bg-gaming-900 border border-gaming-neon w-full max-w-4xl max-h-[80vh] rounded-2xl shadow-[0_0_50px_color-mix(in_oklab,var(--gaming-neon)_20%,transparent)] flex flex-col overflow-hidden"
          >
            <div className="p-6 border-b border-gaming-800 flex justify-between items-center bg-gaming-800/50">
              <div>
                <h2
                  id="console-library-title"
                  className="text-xl font-bold text-white flex items-center gap-2 font-retro"
                >
                  {selectedConsole.name}{" "}
                  <span className="text-gaming-neon text-sm font-sans tracking-normal opacity-70">
                    {"// Library"}
                  </span>
                </h2>
                <p className="text-xs text-gray-400 uppercase mt-1">
                  Select a title to begin your session
                </p>
              </div>
              <button
                onClick={() => setSelectedConsole(null)}
                aria-label="Close"
                className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gaming-900/90 custom-scrollbar">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {selectedConsole.supportedGames.length > 0 ? (
                  selectedConsole.supportedGames.map((gameId) => {
                    const game = GAMES.find((g) => g.id === gameId);
                    if (!game) return null;
                    return (
                      <button
                        key={game.id}
                        onClick={() => handleGameConfirm(game.id)}
                        className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-gaming-800 border border-gaming-700 hover:border-gaming-accent text-left transition-all hover:scale-105 hover:shadow-[0_0_20px_color-mix(in_oklab,var(--gaming-accent)_30%,transparent)]"
                      >
                        <img
                          src={game.coverUrl}
                          alt={game.title}
                          onError={(e) => {
                            e.currentTarget.src = `https://placehold.co/600x800/1a1a2e/ffffff?text=${encodeURIComponent(game.title)}`;
                          }}
                          className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gaming-900 via-gaming-900/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 w-full p-3">
                          <h3 className="text-xs font-bold text-white leading-tight mb-1 line-clamp-2">
                            {game.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] bg-gaming-accent px-1.5 rounded-sm text-white font-bold uppercase">
                              Play
                            </span>
                            <span className="text-[9px] text-gray-400">
                              {game.genre}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-10 text-gray-500">
                    No games available for this system currently.
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gaming-800 bg-gaming-800/30 text-center">
              <p className="text-[10px] text-gray-500 uppercase font-mono">
                Session rates apply immediately upon game launch.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsoleMarket;
