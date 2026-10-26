"use client";

import React from "react";
import { LEADERBOARD_DATA } from "@/mocks/seed";
import {
  BarChart2,
  Crown,
  Medal,
  TrendingUp,
  TrendingDown,
  Minus,
  Globe,
  Star,
} from "lucide-react";

const Leaderboard: React.FC = () => {
  const topThree = LEADERBOARD_DATA.slice(0, 3);
  const rest = LEADERBOARD_DATA.slice(3);

  const handleAvatarError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    username: string,
  ) => {
    e.currentTarget.src = `https://placehold.co/100x100/16213e/ffffff?text=${encodeURIComponent(username[0])}`;
  };

  return (
    <div className="p-6 md:p-10 h-full overflow-y-auto bg-gaming-900 scrollbar-thin scrollbar-thumb-gaming-neon/20 scrollbar-track-gaming-900">
      <header className="mb-10 border-b border-gaming-700 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/30">
            <BarChart2 className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-retro text-white tracking-tight drop-shadow-[0_2px_0_rgba(0,0,0,1)]">
            Global <span className="text-gaming-neon">Rankings</span>
          </h1>
        </div>
        <p className="text-gray-400 font-mono text-sm flex items-center gap-2">
          <Globe className="w-4 h-4 text-gaming-accent" />
          SEASON_5_STANDINGS
        </p>
      </header>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end">
        {/* 2nd Place */}
        <div className="order-2 md:order-1 bg-gaming-800/50 rounded-2xl p-6 border border-gray-600 shadow-[0_0_20px_rgba(156,163,175,0.2)] relative flex flex-col items-center text-center transform md:translate-y-4">
          <div className="absolute -top-4 bg-gray-400 text-gaming-900 font-bold w-8 h-8 rounded-full flex items-center justify-center border-2 border-gaming-900 z-10 shadow-lg">
            2
          </div>
          <div className="w-20 h-20 rounded-full p-1 bg-gray-400 mb-4 overflow-hidden">
            <img
              src={topThree[1].avatar}
              alt={topThree[1].username}
              onError={(e) => handleAvatarError(e, topThree[1].username)}
              className="w-full h-full rounded-full object-cover border-2 border-gaming-900"
            />
          </div>
          <h3 className="text-lg font-bold text-white">
            {topThree[1].username}
          </h3>
          <p className="text-xs text-gray-400 font-bold uppercase mb-2">
            {topThree[1].tier}
          </p>
          <div className="text-2xl font-mono font-bold text-gray-300">
            {topThree[1].rating}
          </div>
        </div>

        {/* 1st Place */}
        <div className="order-1 md:order-2 bg-gradient-to-b from-yellow-500/20 to-gaming-800 rounded-2xl p-8 border border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.3)] relative flex flex-col items-center text-center z-10 scale-110">
          <div className="absolute -top-6">
            <Crown className="w-12 h-12 text-yellow-400 fill-yellow-400 animate-pulse" />
          </div>
          <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-b from-yellow-300 to-yellow-600 mb-4 mt-2 overflow-hidden">
            <img
              src={topThree[0].avatar}
              alt={topThree[0].username}
              onError={(e) => handleAvatarError(e, topThree[0].username)}
              className="w-full h-full rounded-full object-cover border-4 border-gaming-900"
            />
          </div>
          <h3 className="text-xl font-bold text-white">
            {topThree[0].username}
          </h3>
          <p className="text-xs text-yellow-400 font-bold uppercase mb-2 flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" /> {topThree[0].tier}{" "}
            <Star className="w-3 h-3 fill-current" />
          </p>
          <div className="text-3xl font-mono font-bold text-white drop-shadow-md">
            {topThree[0].rating}
          </div>
        </div>

        {/* 3rd Place */}
        <div className="order-3 md:order-3 bg-gaming-800/50 rounded-2xl p-6 border border-orange-700 shadow-[0_0_20px_rgba(194,65,12,0.2)] relative flex flex-col items-center text-center transform md:translate-y-8">
          <div className="absolute -top-4 bg-orange-700 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center border-2 border-gaming-900 z-10 shadow-lg">
            3
          </div>
          <div className="w-20 h-20 rounded-full p-1 bg-orange-700 mb-4 overflow-hidden">
            <img
              src={topThree[2].avatar}
              alt={topThree[2].username}
              onError={(e) => handleAvatarError(e, topThree[2].username)}
              className="w-full h-full rounded-full object-cover border-2 border-gaming-900"
            />
          </div>
          <h3 className="text-lg font-bold text-white">
            {topThree[2].username}
          </h3>
          <p className="text-xs text-orange-400 font-bold uppercase mb-2">
            {topThree[2].tier}
          </p>
          <div className="text-2xl font-mono font-bold text-orange-200">
            {topThree[2].rating}
          </div>
        </div>
      </div>

      {/* Rankings Table */}
      <div className="bg-gaming-800 rounded-2xl border border-gaming-700 overflow-hidden">
        <div className="p-4 border-b border-gaming-700 flex justify-between items-center bg-gaming-800/50">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Medal className="w-5 h-5 text-gaming-neon" /> Full Standings
          </h3>
        </div>

        <table className="w-full text-left">
          <thead className="bg-gaming-900 text-gray-400 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th scope="col" className="p-4 w-16 text-center">
                #
              </th>
              <th scope="col" className="p-4">
                Player
              </th>
              <th scope="col" className="p-4 hidden md:table-cell">
                Tier
              </th>
              <th scope="col" className="p-4 text-right">
                Rating
              </th>
              <th scope="col" className="p-4 w-16 text-center">
                Trend
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gaming-700">
            {rest.map((entry) => (
              <tr
                key={entry.rank}
                className="hover:bg-gaming-700/30 transition-colors group"
              >
                <td className="p-4 text-center font-mono font-bold text-gray-500 group-hover:text-white">
                  {entry.rank}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gaming-700 overflow-hidden border border-gaming-600">
                      <img
                        src={entry.avatar}
                        alt={entry.username}
                        onError={(e) => handleAvatarError(e, entry.username)}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p
                      className={`font-bold text-sm ${entry.username === "PlayerOne" ? "text-gaming-neon" : "text-white"}`}
                    >
                      {entry.username}
                    </p>
                  </div>
                </td>
                <td className="p-4 hidden md:table-cell">
                  <span className="text-xs font-bold px-2 py-1 rounded-sm bg-gaming-900 border border-gaming-700 text-gray-300">
                    {entry.tier}
                  </span>
                </td>
                <td className="p-4 text-right font-mono font-bold text-white">
                  {entry.rating}
                </td>
                <td className="p-4 flex justify-center">
                  {entry.trend === "UP" && (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  )}
                  {entry.trend === "DOWN" && (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  {entry.trend === "STABLE" && (
                    <Minus className="w-4 h-4 text-gray-500" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
