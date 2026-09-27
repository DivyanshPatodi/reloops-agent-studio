"use client";

import React, { useState } from 'react';
import { X, Key, Check, Lock } from 'lucide-react';

interface ApiKeysModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApiKeysModal({ isOpen, onClose }: ApiKeysModalProps) {
  const [falKey, setFalKey] = useState('');
  const [higgsKey, setHiggsKey] = useState('');
  const [reloopsKey, setReloopsKey] = useState('reloops_live_de06e923b377405c7e889c5b43f57ebd07dbbc7be0b28f51dc130dab978d526e');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-white">API Credentials &amp; Services</h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Fal.ai API Key</label>
            <input
              type="password"
              value={falKey}
              onChange={(e) => setFalKey(e.target.value)}
              placeholder="fal_key_..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 font-mono"
            />
            <span className="text-[10px] text-zinc-500 mt-1 block">Used for Flux 1.1 Pro, Kling 1.5, and Minimax Video models.</span>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Higgsfield AI API Key</label>
            <input
              type="password"
              value={higgsKey}
              onChange={(e) => setHiggsKey(e.target.value)}
              placeholder="hf_api_..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 font-mono"
            />
            <span className="text-[10px] text-zinc-500 mt-1 block">Used for cinematic character animation &amp; UGC camera physics.</span>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Reloops API Key</label>
            <input
              type="password"
              value={reloopsKey}
              onChange={(e) => setReloopsKey(e.target.value)}
              placeholder="reloops_live_..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 font-mono"
            />
            <span className="text-[10px] text-emerald-400 mt-1 block">&bull; Active Reloops live key configured.</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2 rounded-xl text-xs shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5 cursor-pointer"
          >
            {saved ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Lock className="w-3.5 h-3.5" />}
            <span>{saved ? 'Saved' : 'Save Credentials'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
