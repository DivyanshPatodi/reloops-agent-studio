"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UploadedMediaItem, GenerationResult } from '@/types/agent';
import { Send, Bot, User, Sparkles, RefreshCw, ExternalLink, Image as ImageIcon, Video } from 'lucide-react';

interface ChatAgentProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isProcessing: boolean;
  attachedMedia: UploadedMediaItem[];
  onSelectResult: (result: GenerationResult) => void;
}

export function ChatAgent({ messages, onSendMessage, isProcessing, attachedMedia, onSelectResult }: ChatAgentProps) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const samplePrompts = [
    "Animate this serum bottle into a 9:16 vertical TikTok ad with water splash and morning sunlight",
    "Create 3 new lifestyle variations of this product on luxury marble counters",
    "Turn this sneaker image into a dynamic rainy cyberpunk night ad with glowing neon lights"
  ];

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl flex flex-col h-[580px] shadow-xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-zinc-800 bg-zinc-950/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Reloops Creative Assistant</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </h3>
            <p className="text-[10px] text-zinc-400">Instruct in natural language &bull; Transform assets &bull; Stack in Reloops</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[92%] ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-indigo-400 border border-zinc-700'
            }`}>
              {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div className="flex flex-col gap-2">
              <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-tl-none'
              }`}>
                <p>{msg.text}</p>

                {msg.attachedMedia && msg.attachedMedia.length > 0 && (
                  <div className="flex gap-1.5 mt-2 pt-2 border-t border-white/15">
                    {msg.attachedMedia.map((m) => (
                      <img key={m.id} src={m.url} alt={m.name} className="w-12 h-12 rounded-lg object-cover border border-white/20" />
                    ))}
                  </div>
                )}
              </div>

              {msg.result && (
                <div
                  onClick={() => onSelectResult(msg.result!)}
                  className="bg-zinc-950 border border-indigo-500/40 rounded-xl p-3 flex flex-col gap-2 hover:border-indigo-400 transition cursor-pointer group shadow-lg"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      Generated Deliverable Ready
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      v{msg.result.reloopsVersion || 1} Stacked
                    </span>
                  </div>

                  <div className="relative rounded-lg overflow-hidden bg-black aspect-[9/16] max-h-[140px] flex items-center justify-center">
                    <img src={msg.result.thumbnailUrl} alt="Result" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {msg.result.reloopsShareUrl && (
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-zinc-800">
                      <span>Asset: {msg.result.reloopsAssetId}</span>
                      <span className="text-indigo-400 flex items-center gap-0.5 font-medium">
                        Open Preview <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex gap-3 mr-auto items-center">
            <div className="w-7 h-7 rounded-lg bg-zinc-800 text-indigo-400 border border-zinc-700 flex items-center justify-center">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl rounded-tl-none p-3 text-xs text-zinc-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
              <span>Agent is analyzing source assets &amp; synthesizing output...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 2 && (
        <div className="px-4 py-2 bg-zinc-950/40 border-t border-zinc-800/60 flex flex-wrap gap-1.5">
          {samplePrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => onSendMessage(p)}
              className="text-[10px] px-2 py-1 rounded-lg bg-zinc-800/70 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition cursor-pointer text-left truncate max-w-full"
            >
              💬 {p}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-3 border-t border-zinc-800 bg-zinc-950 flex items-center gap-2">
        {attachedMedia.length > 0 && (
          <span className="text-[10px] bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 px-2 py-1 rounded-lg shrink-0 flex items-center gap-1">
            <ImageIcon className="w-3 h-3" />
            {attachedMedia.length} Ref
          </span>
        )}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            attachedMedia.length > 0
              ? "Instruct what to generate from the attached image(s)..."
              : "Describe what to generate or drop an image above..."
          }
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isProcessing}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white p-2.5 rounded-xl transition cursor-pointer shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
