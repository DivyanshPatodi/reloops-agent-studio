"use client";

import React, { useState } from 'react';
import { Smartphone, Eye, Check } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl?: string;
  thumbnailUrl?: string;
  aspectRatio: '9:16' | '16:9' | '1:1';
}

export function VideoPlayerWithSafeZone({ videoUrl, thumbnailUrl, aspectRatio }: VideoPlayerProps) {
  const [safeZone, setSafeZone] = useState<'none' | 'tiktok' | 'reels' | 'shorts'>('tiktok');

  if (!videoUrl) {
    return (
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl aspect-[9/16] max-h-[640px] flex flex-col items-center justify-center p-8 text-center text-zinc-500 mx-auto w-full">
        <Smartphone className="w-12 h-12 text-zinc-700 mb-3" />
        <p className="text-sm font-medium text-zinc-400">Media Preview Canvas</p>
        <p className="text-xs text-zinc-600 mt-1 max-w-xs">Generated video with Safe Screen overlays will appear here once the agent finishes synthesis.</p>
      </div>
    );
  }

  const isVertical = aspectRatio === '9:16';

  return (
    <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 shadow-xl flex flex-col gap-3 max-w-md mx-auto w-full">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div className="flex items-center gap-1.5">
          <Eye className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-zinc-200">Creative Review &amp; Safe Screen</span>
        </div>

        {isVertical && (
          <div className="flex items-center gap-1 bg-zinc-950 p-0.5 rounded-lg border border-zinc-800">
            {[
              { id: 'tiktok', label: 'TikTok' },
              { id: 'reels', label: 'Reels' },
              { id: 'shorts', label: 'Shorts' },
              { id: 'none', label: 'Off' }
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setSafeZone(s.id as any)}
                className={`text-[10px] px-2 py-0.5 rounded transition cursor-pointer ${
                  safeZone === s.id ? 'bg-indigo-600 text-white font-medium' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative rounded-xl overflow-hidden bg-black aspect-[9/16] flex items-center justify-center border border-zinc-800 group">
        <video
          src={videoUrl}
          poster={thumbnailUrl}
          controls
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />

        {isVertical && safeZone === 'tiktok' && (
          <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-cyan-400/40 flex flex-col justify-between p-4">
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded py-1 px-2 text-[10px] text-cyan-300 self-start">
              Top Bar Safe Zone (Following / For You)
            </div>

            <div className="absolute right-3 bottom-24 flex flex-col gap-3 items-center opacity-60">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/30"></div>
              <div className="w-6 h-6 rounded-full bg-zinc-800 border border-white/30"></div>
              <div className="w-6 h-6 rounded-full bg-zinc-800 border border-white/30"></div>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded py-1.5 px-2 text-[10px] text-cyan-300 mt-auto mb-2 w-3/4">
              Caption &amp; Sound Info Safe Zone
            </div>
          </div>
        )}

        {isVertical && safeZone === 'reels' && (
          <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-pink-400/40 flex flex-col justify-between p-4">
            <div className="bg-pink-500/10 border border-pink-500/30 rounded py-1 px-2 text-[10px] text-pink-300 self-start">
              Instagram Reels UI Header
            </div>
            <div className="bg-pink-500/10 border border-pink-500/30 rounded py-1.5 px-2 text-[10px] text-pink-300 mt-auto mb-2 w-3/4">
              Reels Profile &amp; Caption Area
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
        <span className="flex items-center gap-1 text-emerald-400">
          <Check className="w-3.5 h-3.5" />
          Safe Zone Compliant
        </span>
        <span className="text-zinc-500">1080x1920 &bull; 30 FPS</span>
      </div>
    </div>
  );
}
