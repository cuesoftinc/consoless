"use client";

import React, { useState } from "react";
import { TOURNAMENTS, GAMES } from "@/mocks/seed";
import {
  Trophy,
  Users,
  Globe,
  Swords,
  Calendar,
  Zap,
  Plus,
  Gamepad,
  X,
} from "lucide-react";
import { TournamentStatus } from "@/models/types";

const TournamentHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"ALL" | "MY">("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal Form State
  const [newEventName, setNewEventName] = useState("");
  const [selectedGameId, setSelectedGameId] = useState(GAMES[0].id);
  const [format, setFormat] = useState("2v2 Tag Team");
  const [region, setRegion] = useState("Global");

  const handleCreateTournament = () => {
    alert("Tournament Created! Invites sent to your party.");
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 md:p-10 h-full overflow-y-auto bg-gaming-900 scrollbar-thin scrollbar-thumb-gaming-neon/20 scrollbar-track-gaming-900 relative">
      {/* Hero Header */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-end border-b border-gaming-700 pb-6 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
              <Trophy className="w-8 h-8 text-yellow-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-retro text-white tracking-tight drop-shadow-[0_2px_0_rgba(0,0,0,1)]">
              Tourna<span className="text-gaming-neon">ments</span>
            </h1>
          </div>
          <p className="text-gray-400 font-mono text-sm flex items-center gap-2">
            <Globe className="w-4 h-4 text-gaming-accent" />
            GLOBAL_NETWORK_STATUS:{" "}
            <span className="text-green-400">ONLINE</span>
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gaming-accent hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(233,69,96,0.4)] hover:shadow-[0_0_30px_rgba(233,69,96,0.6)] transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" /> Host Tag Team Event
        </button>
      </header>

      {/* Filters */}
      <div className="flex gap-4 mb-8 border-b border-gaming-800">
        {["ALL", "MY"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as "ALL" | "MY")}
            aria-pressed={activeTab === tab}
            className={`pb-3 px-4 font-bold text-sm uppercase tracking-wider transition-colors border-b-2 ${activeTab === tab ? "border-gaming-neon text-white" : "border-transparent text-gray-500 hover:text-gray-300"}`}
          >
            {tab === "ALL" ? "All Events" : "My Events"}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {TOURNAMENTS.map((t) => (
          <div
            key={t.id}
            className="bg-gaming-800 rounded-xl overflow-hidden border border-gaming-700 hover:border-gaming-neon group transition-all duration-300 relative"
          >
            {/* Status Badge */}
            <div
              className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest z-10 border ${
                t.status === TournamentStatus.LIVE
                  ? "bg-red-600 text-white border-red-400 animate-pulse"
                  : t.status === TournamentStatus.REGISTRATION
                    ? "bg-green-600 text-white border-green-400"
                    : "bg-gray-600 text-gray-300 border-gray-500"
              }`}
            >
              {t.status}
            </div>

            {/* Card Image */}
            <div className="h-40 relative">
              <img
                src={t.imageUrl}
                alt={t.title}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gaming-800 to-transparent" />
              <div className="absolute bottom-3 left-4">
                <h3 className="text-xl font-bold text-white shadow-black drop-shadow-lg">
                  {t.title}
                </h3>
                <div className="flex items-center gap-2 text-gaming-neon text-xs font-mono mt-1">
                  <Swords className="w-3 h-3" /> {t.format}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gaming-900/50 p-2 rounded-sm border border-gaming-700">
                  <div className="text-[10px] text-gray-500 uppercase flex items-center gap-1">
                    <Users className="w-3 h-3" /> Players
                  </div>
                  <div className="text-lg font-mono text-white font-bold">
                    {t.participants}
                    <span className="text-gray-500 text-xs">
                      /{t.maxParticipants}
                    </span>
                  </div>
                </div>
                <div className="bg-gaming-900/50 p-2 rounded-sm border border-gaming-700">
                  <div className="text-[10px] text-gray-500 uppercase flex items-center gap-1">
                    <Trophy className="w-3 h-3" /> Prize Pool
                  </div>
                  <div className="text-lg font-mono text-yellow-400 font-bold">
                    {t.prizePool}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gaming-700 pt-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {t.startTime}
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-3 h-3" /> {t.region}
                </div>
              </div>

              <button
                onClick={() =>
                  alert(`Simulating joining lobby for: ${t.title}`)
                }
                className="w-full bg-white hover:bg-gaming-neon text-gaming-900 font-bold py-3 rounded-lg uppercase tracking-widest text-xs transition-colors shadow-lg active:scale-95 transform"
              >
                {t.status === TournamentStatus.LIVE ? "Spectate" : "Join Lobby"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="host-event-title"
            className="bg-gaming-900 border border-gaming-neon rounded-2xl w-full max-w-lg overflow-hidden shadow-[0_0_50px_rgba(15,240,252,0.2)]"
          >
            <div className="p-6 border-b border-gaming-800 flex justify-between items-center bg-gaming-800/50">
              <h2
                id="host-event-title"
                className="text-xl font-bold text-white flex items-center gap-2"
              >
                <Zap className="w-5 h-5 text-gaming-neon" /> Host Event
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label
                  htmlFor="host-event-name"
                  className="block text-xs font-bold text-gray-400 uppercase mb-2"
                >
                  Tournament Name
                </label>
                <input
                  id="host-event-name"
                  type="text"
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  placeholder="e.g. Friday Night Tag Team"
                  className="w-full bg-gaming-800 border border-gaming-700 rounded-lg px-4 py-3 text-white focus:border-gaming-neon focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="host-event-game"
                    className="block text-xs font-bold text-gray-400 uppercase mb-2"
                  >
                    Game
                  </label>
                  <select
                    id="host-event-game"
                    value={selectedGameId}
                    onChange={(e) => setSelectedGameId(e.target.value)}
                    className="w-full bg-gaming-800 border border-gaming-700 rounded-lg px-4 py-3 text-white focus:border-gaming-neon focus:outline-hidden appearance-none"
                  >
                    {GAMES.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="host-event-mode"
                    className="block text-xs font-bold text-gray-400 uppercase mb-2"
                  >
                    Mode
                  </label>
                  <select
                    id="host-event-mode"
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full bg-gaming-800 border border-gaming-700 rounded-lg px-4 py-3 text-white focus:border-gaming-neon focus:outline-hidden appearance-none"
                  >
                    <option>2v2 Tag Team</option>
                    <option>1v1 Duel</option>
                    <option>Squad Battle</option>
                    <option>Battle Royale</option>
                  </select>
                </div>
              </div>

              <div>
                <p
                  id="host-event-region"
                  className="block text-xs font-bold text-gray-400 uppercase mb-2"
                >
                  Region
                </p>
                <div
                  role="group"
                  aria-labelledby="host-event-region"
                  className="flex gap-2"
                >
                  {["Global", "NA", "EU", "ASIA"].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRegion(r)}
                      aria-pressed={region === r}
                      className={`flex-1 py-2 rounded-sm border text-xs font-bold transition-all ${region === r ? "bg-gaming-neon text-gaming-900 border-gaming-neon" : "bg-gaming-800 text-gray-400 border-gaming-700 hover:border-gray-500"}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg flex items-start gap-3">
                <Gamepad className="w-5 h-5 text-blue-400 shrink-0 mt-1" />
                <p className="text-xs text-blue-200 leading-relaxed">
                  Hosting a <strong>Tag Team</strong> event allows friends to
                  join your lobby directly. You will be assigned as the Lobby
                  Leader.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gaming-800 bg-gaming-800/30 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 rounded-lg font-bold text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTournament}
                className="px-8 py-3 bg-gaming-accent hover:bg-red-600 text-white rounded-lg font-bold shadow-lg transition-all"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentHub;
