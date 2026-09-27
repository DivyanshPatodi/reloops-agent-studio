"use client";

import React, { useState } from 'react';
import { Layers, Eye, Smartphone } from 'lucide-react';

interface VersionComparisonSliderProps {
  sourceUrl?: string;
  outputVideoUrl?: string;
  outputThumbnailUrl?: string;
  aspectRatio: '9:16' | '16:9' | '1:1';
}

export function VersionComparisonSlider({ sourceUrl, outputVideoUrl, outputThumbnailUrl, aspectRatio }: VersionComparisonSliderProps) {
  const [viewMode, setViewMode] = useState<'video' | 'side-by-side' | 'source'>('video');
  const [safeZone, setSafeZone] = useState<'none' | 'tiktok' | 'reels' | 'shorts'>('tiktok');

  const isVertical = aspectRatio === '9:16';

  if (!outputVideoUrl && !sourceUrl) {
    return (
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl aspect-[9/16] max-h-[600px] flex flex-col items-center justify-center p-8 text-center text-zinc-500 mx-auto w-full">
        <Smartphone className="w-12 h-12 text-zinc-700 mb-3" />
        <p className="text-sm font-medium text-zinc-400">Interactive Canvas</p>
        <p className="text-xs text-zinc-600 mt-1 max-w-xs">Upload source images or chat with the agent to render and compare new variations here.</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 shadow-xl flex flex-col gap-3 max-w-md mx-auto w-full">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div className="flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-zinc-200">Creative Canvas &amp; Stacks</span>
        </div>

        <div className="flex items-center gap-1 bg-zinc-950 p-0.5 rounded-lg border border-zinc-800">
          {[
            { id: 'video', label: 'AI Output (v2)' },
            { id: 'side-by-side', label: 'Compare v1/v2' },
            { id: 'source', label: 'Source (v1)' }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setViewMode(m.id as any)}
              className={`text-[10px] px-2 py-0.5 rounded transition cursor-pointer ${
                viewMode === m.id ? 'bg-indigo-600 text-white font-medium' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {viewMode === 'side-by-side' && sourceUrl ? (
        <div className="grid grid-cols-2 gap-2 aspect-[9/16] rounded-xl overflow-hidden bg-black p-1">
          <div className="relative rounded-lg overflow-hidden border border-zinc-800">
            <img src={sourceUrl} alt="Source v1" className="w-full h-full object-cover" />
            <span className="absolute bottom-1 left-1 bg-black/80 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
              Source v1
            </span>
          </div>
          <div className="relative rounded-lg overflow-hidden border border-indigo-500/50">
            {outputVideoUrl ? (
              <video src={outputVideoUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
            ) : (
              <img src={outputThumbnailUrl} alt="Generated v2" className="w-full h-full object-cover" />
            )}
            <span className="absolute bottom-1 left-1 bg-indigo-600 text-white text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold">
              AI Output v2
            </span>
          </div>
        </div>
      ) : viewMode === 'source' && sourceUrl ? (
        <div className="relative rounded-xl overflow-hidden bg-black aspect-[9/16] flex items-center justify-center border border-zinc-800">
          <img src={sourceUrl} alt="Source v1" className="w-full h-full object-cover" />
          <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] px-2 py-1 rounded font-mono">
            Original Source Asset (v1)
          </span>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden bg-black aspect-[9/16] flex items-center justify-center border border-zinc-800 group">
          {outputVideoUrl ? (
            <video
              src={outputVideoUrl}
              poster={outputThumbnailUrl}
              controls
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img src={outputThumbnailUrl || sourceUrl} alt="Preview" className="w-full h-full object-cover" />
          )}

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
                Caption &amp; Sound Safe Zone
              </div>
            </div>
          )}

          {isVertical && safeZone === 'reels' && (
            <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-pink-400/40 flex flex-col justify-between p-4">
              <div className="bg-pink-500/10 border border-pink-500/30 rounded py-1 px-2 text-[10px] text-pink-300 self-start">
                Instagram Reels UI Header
              </div>
              <div className="bg-pink-500/10 border border-pink-500/30 rounded py-1.5 px-2 text-[10px] text-pink-300 mt-auto mb-2 w-3/4">
                Profile &amp; Caption Area
              </div>
            </div>
          )}
        </div>
      )}

      {isVertical && (
        <div className="flex items-center justify-between pt-1 border-t border-zinc-800/80">
          <span className="text-[11px] text-zinc-400 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            Safe Zone Overlay:
          </span>
          <div className="flex items-center gap-1 bg-zinc-950 p-0.5 rounded-lg border border-zinc-800">
            {[
              { id: 'tiktok', label: 'TikTok' },
              { id: 'reels', label: 'Reels' },
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
        </div>
      )}
    </div>
  );
}
