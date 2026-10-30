"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Gamepad2, UserCircle, BarChart2 } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Hub", icon: LayoutGrid },
  { href: "/dashboard/leaderboard", label: "Leaderboard", icon: BarChart2 },
];

const Navbar: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="w-20 md:w-64 shrink-0 bg-gaming-900 border-r border-gaming-700 flex flex-col justify-between h-full transition-all duration-300 shadow-[0_0_20px_color-mix(in_oklab,var(--black)_50%,transparent)] z-50">
      <div>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gaming-accent rounded-xl flex items-center justify-center shadow-[0_0_15px_color-mix(in_oklab,var(--gaming-accent)_50%,transparent)] border border-gaming-accent/50">
            <Gamepad2 className="text-white w-6 h-6" />
          </div>
          <span className="hidden md:block font-retro text-sm tracking-tighter text-gaming-neon drop-shadow-[0_0_5px_color-mix(in_oklab,var(--gaming-neon)_50%,transparent)]">
            CONSOLESS
          </span>
        </div>

        <div className="mt-8 px-3 space-y-3">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                className={`relative w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 group overflow-hidden ${
                  active
                    ? "bg-gaming-800 text-white shadow-[inset_0_0_10px_color-mix(in_oklab,var(--black)_50%,transparent)] border-l-4 border-gaming-neon"
                    : "text-gray-400 hover:bg-gaming-800/50 hover:text-white border-l-4 border-transparent"
                }`}
              >
                {active && (
                  <div className="absolute inset-0 bg-gaming-neon/5 pointer-events-none" />
                )}

                <item.icon
                  className={`w-6 h-6 z-10 transition-colors ${
                    active
                      ? "text-gaming-neon drop-shadow-[0_0_8px_color-mix(in_oklab,var(--gaming-neon)_80%,transparent)]"
                      : "group-hover:text-gray-200"
                  }`}
                />
                <span
                  className={`hidden md:block font-bold tracking-wide z-10 ${active ? "text-gaming-neon" : ""}`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-gaming-800 bg-black/20">
        <button
          aria-label="PlayerOne, Creator"
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gaming-800/50 text-gray-400 hover:text-white transition-colors group border border-transparent hover:border-gaming-700"
        >
          <div className="relative">
            <UserCircle className="w-8 h-8 group-hover:text-gaming-accent transition-colors" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gaming-900"></div>
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-bold text-white group-hover:text-gaming-accent transition-colors">
              PlayerOne
            </p>
            <p className="text-[10px] uppercase tracking-wider text-gaming-neon bg-gaming-neon/10 px-2 py-0.5 rounded-sm mt-0.5 inline-block border border-gaming-neon/20">
              Creator
            </p>
          </div>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
