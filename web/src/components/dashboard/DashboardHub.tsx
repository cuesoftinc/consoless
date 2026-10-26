"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GAMES } from "@/mocks/seed";
import {
  Edit3,
  Clock,
  Trophy,
  Activity,
  ChevronRight,
  Play,
  Settings,
  Target,
  X,
} from "lucide-react";
import { AreaChart } from "@/components/ui/charts/AreaChart";
import { useToast } from "@/controllers/toast";

const MOCK_ACTIVITY_DATA = [
  { day: "Mon", hours: 2.5, xp: 1200 },
  { day: "Tue", hours: 1.0, xp: 800 },
  { day: "Wed", hours: 3.8, xp: 2400 },
  { day: "Thu", hours: 0.5, xp: 300 },
  { day: "Fri", hours: 4.2, xp: 3100 },
  { day: "Sat", hours: 6.5, xp: 4500 },
  { day: "Sun", hours: 5.0, xp: 3800 },
];

const ACTIVITY_SERIES = [
  { key: "hours", name: "Hours Played", color: "var(--gaming-neon)" },
  { key: "xp", name: "XP Gained", color: "var(--gaming-accent)" },
] as const;

const AVATAR_OPTIONS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
];

const DashboardHub: React.FC = () => {
  const { addToast } = useToast();
  const username = "PlayerOne";
  const title = "Cloud Pioneer";
  const [avatar, setAvatar] = useState(AVATAR_OPTIONS[0]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const recentGames = [GAMES[0], GAMES[7], GAMES[12], GAMES[3]];

  const handleSaveProfile = () => {
    setIsEditModalOpen(false);
    addToast("Profile updated successfully", "success");
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    title: string,
  ) => {
    e.currentTarget.src = `https://placehold.co/600x800/1a1a2e/ffffff?text=${encodeURIComponent(title)}`;
  };

  return (
    <div className="p-6 md:p-10 h-full overflow-y-auto bg-gaming-900 scrollbar-thin scrollbar-thumb-gaming-accent/50 scrollbar-track-gaming-900">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-retro text-white mb-2 tracking-tight drop-shadow-[0_2px_0_var(--black)]">
            Command <span className="text-gaming-neon">Center</span>
          </h1>
          <p className="text-gray-400 font-mono text-sm">
            WELCOME_BACK_OPERATIVE ::{" "}
            <span className="text-gaming-accent">{username.toUpperCase()}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-gaming-800 border border-gaming-700 rounded-lg flex flex-col items-end">
            <span className="text-[10px] text-gray-500 uppercase font-bold">
              Platform Rank
            </span>
            <span className="text-yellow-400 font-bold flex items-center gap-1">
              <Trophy className="w-3 h-3" /> Diamond II
            </span>
          </div>
          <div className="px-4 py-2 bg-gaming-800 border border-gaming-700 rounded-lg flex flex-col items-end">
            <span className="text-[10px] text-gray-500 uppercase font-bold">
              Total Playtime
            </span>
            <span className="text-gaming-neon font-bold flex items-center gap-1">
              <Clock className="w-3 h-3" /> 142h 30m
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gaming-800 rounded-2xl p-1 border border-gaming-700 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-gaming-accent/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
            <div className="bg-gaming-900/80 backdrop-blur-sm rounded-xl p-6 relative z-10">
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  aria-label="Customize Persona"
                  className="relative mb-4 group/avatar cursor-pointer"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <div className="w-24 h-24 rounded-full border-4 border-gaming-800 overflow-hidden shadow-[0_0_20px_color-mix(in_oklab,var(--gaming-accent)_50%,transparent)] group-hover/avatar:shadow-[0_0_30px_color-mix(in_oklab,var(--gaming-neon)_60%,transparent)] transition-all">
                    <img
                      src={avatar}
                      alt="Avatar"
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/200x200/e94560/ffffff?text=${username[0]}`;
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 bg-gaming-neon text-gaming-900 p-1.5 rounded-full border-2 border-gaming-900 group-hover/avatar:scale-110 transition-transform">
                    <Edit3 className="w-3 h-3" />
                  </div>
                </button>
                <h2 className="text-xl font-bold text-white">{username}</h2>
                <p className="text-xs text-gaming-accent font-bold uppercase tracking-wider mb-4">
                  {title}
                </p>
                <div className="w-full space-y-1 mb-6">
                  <div className="flex justify-between text-[10px] font-bold uppercase text-gray-400">
                    <span>Lvl 42</span>
                    <span>XP: 8,450 / 10,000</span>
                  </div>
                  <div className="w-full h-2 bg-gaming-900 rounded-full overflow-hidden border border-gaming-700">
                    <div className="h-full bg-gradient-to-r from-gaming-accent to-purple-500 w-[84%] shadow-[0_0_10px_color-mix(in_oklab,var(--gaming-accent)_50%,transparent)]"></div>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="w-full py-2 bg-gaming-800 hover:bg-gaming-700 border border-gaming-700 rounded-lg text-xs font-bold uppercase text-gray-300 hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <Settings className="w-3 h-3" /> Customize Persona
                </button>
              </div>
            </div>
          </div>
          <div className="bg-gaming-800 rounded-2xl p-6 border border-gaming-700">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-400" /> Network Status
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Region</span>
                <span className="text-white font-mono">US-EAST-1</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Latency</span>
                <span className="text-green-400 font-mono">14ms</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Packet Loss</span>
                <span className="text-green-400 font-mono">0.0%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-gaming-neon" /> Jump Back In
              </h2>
              <Link
                href="/dashboard/library"
                className="text-xs font-bold text-gray-500 hover:text-white flex items-center gap-1 transition-colors"
              >
                View All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recentGames.map((game, idx) => (
                <div
                  key={game.id}
                  className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-gaming-800 border border-gaming-700 hover:border-gaming-neon transition-all"
                >
                  <img
                    src={game.coverUrl}
                    alt={game.title}
                    onError={(e) => handleImageError(e, game.title)}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gaming-900 via-transparent to-transparent opacity-90" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-xs font-bold text-white truncate mb-1">
                      {game.title}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-gray-400">
                        {idx === 0 ? "2h ago" : "Yesterday"}
                      </span>
                      <Link
                        href="/dashboard/rentals"
                        aria-label={`Play ${game.title}`}
                        className="bg-gaming-accent p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transform translate-y-2 group-hover:translate-y-0 focus-visible:translate-y-0 transition-all shadow-lg"
                      >
                        <Play className="w-3 h-3 fill-current" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gaming-800 rounded-2xl p-6 border border-gaming-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" /> Weekly Activity
              </h2>
            </div>
            <div className="h-64 w-full">
              <AreaChart
                data={MOCK_ACTIVITY_DATA}
                xKey="day"
                series={ACTIVITY_SERIES}
                label="Hours played and XP gained per day this week"
              />
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gaming-800/50 rounded-xl p-5 border border-gaming-700">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-gaming-retro" /> Active Quest
              </h3>
              <div className="flex items-start gap-3">
                <img
                  src={GAMES[0].coverUrl}
                  alt="Quest"
                  onError={(e) => handleImageError(e, GAMES[0].title)}
                  className="w-12 h-12 rounded-sm object-cover opacity-80"
                />
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">Cyber Samurai</p>
                  <p className="text-xs text-gray-400 mb-2">
                    Complete 3 missions without dying.
                  </p>
                  <div className="w-full h-1.5 bg-gaming-900 rounded-full overflow-hidden">
                    <div className="h-full bg-gaming-retro w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="persona-dialog-title"
            className="bg-gaming-900 border border-gaming-neon rounded-2xl w-full max-w-md overflow-hidden shadow-[0_0_50px_color-mix(in_oklab,var(--gaming-neon)_20%,transparent)] animate-fade-in-up"
          >
            <div className="p-5 border-b border-gaming-800 flex justify-between items-center bg-gaming-800/50">
              <h2
                id="persona-dialog-title"
                className="text-lg font-bold text-white flex items-center gap-2"
              >
                <Edit3 className="w-5 h-5 text-gaming-neon" /> Customize Persona
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                aria-label="Close"
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <p
                  id="avatar-picker-label"
                  className="block text-xs font-bold text-gray-400 uppercase mb-3"
                >
                  Select Avatar
                </p>
                <div
                  role="group"
                  aria-labelledby="avatar-picker-label"
                  className="grid grid-cols-4 gap-3"
                >
                  {AVATAR_OPTIONS.map((src, idx) => (
                    <button
                      key={idx}
                      onClick={() => setAvatar(src)}
                      aria-pressed={avatar === src}
                      className={`relative rounded-lg overflow-hidden aspect-square border-2 transition-all ${avatar === src ? "border-gaming-neon shadow-[0_0_15px_color-mix(in_oklab,var(--gaming-neon)_50%,transparent)] scale-105" : "border-transparent opacity-60 hover:opacity-100 hover:border-gray-500"}`}
                    >
                      <img
                        src={src}
                        alt={`Avatar ${idx}`}
                        onError={(e) => {
                          e.currentTarget.src = `https://placehold.co/200x200/e94560/ffffff?text=${idx}`;
                        }}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-gaming-800 bg-gaming-800/30 flex justify-end gap-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-lg font-bold text-gray-400 hover:text-white text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-6 py-2 bg-gaming-accent hover:bg-red-600 text-white rounded-lg font-bold shadow-lg transition-all text-sm uppercase"
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHub;
