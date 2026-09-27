"use client";

import React from 'react';
import { ExternalLink, Copy, Check, Layers, MessageSquare } from 'lucide-react';
import { GenerationResult } from '@/types/agent';

interface ReloopsSyncCardProps {
  result?: GenerationResult | null;
}

export function ReloopsSyncCard({ result }: ReloopsSyncCardProps) {
  const [copied, setCopied] = React.useState(false);

  if (!result || !result.reloopsAssetId) {
    return null;
  }

  const handleCopy = () => {
    if (result.reloopsShareUrl) {
      navigator.clipboard.writeText(result.reloopsShareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-zinc-900 border border-indigo-500/30 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
          <Layers className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-white">Live on Reloops DAM</h4>
            <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
              v{result.reloopsVersion || 1} Stacked
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Asset ID: <span className="font-mono text-zinc-300">{result.reloopsAssetId}</span> &bull; Status: <span className="text-amber-400">Needs Review</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 w-full md:w-auto">
        {result.reloopsShareUrl && (
          <button
            onClick={handleCopy}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 px-3.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Client Link'}</span>
          </button>
        )}

        {result.reloopsReviewUrl && (
          <a
            href={result.reloopsReviewUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Open in Reloops Proofing</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        )}
      </div>
    </div>
  );
}
