"use client";

import React from 'react';
import { Sparkles, Key } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
}

export function Header({ onOpenSettings }: HeaderProps) {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white tracking-tight">Reloops Agent Studio</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
              v1.0
            </span>
          </div>
          <p className="text-xs text-zinc-400">Autonomous Creative Engine &bull; Fal.ai &bull; Higgsfield &bull; Reloops Sync</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Fal.ai (Flux + Kling)
          </span>
          <span className="text-zinc-600">&bull;</span>
          <span className="flex items-center gap-1.5 text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
            Higgsfield Video
          </span>
          <span className="text-zinc-600">&bull;</span>
          <span className="flex items-center gap-1.5 text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Reloops DAM Connected
          </span>
        </div>

        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer"
        >
          <Key className="w-3.5 h-3.5 text-zinc-400" />
          <span>API Keys</span>
        </button>
      </div>
    </header>
  );
}
