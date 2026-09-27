"use client";

import React, { useState } from 'react';
import { GenerationRequest, GenerationMode, ModelProvider, AspectRatio, ReloopsWorkspace } from '@/types/agent';
import { Sparkles, Wand2, RefreshCw, Smartphone, Monitor, Square, Folder, Bot } from 'lucide-react';

interface StudioControlsProps {
  onGenerate: (req: GenerationRequest) => void;
  isGenerating: boolean;
  workspaces: ReloopsWorkspace[];
}

export function StudioControls({ onGenerate, isGenerating, workspaces }: StudioControlsProps) {
  const [prompt, setPrompt] = useState('Cinematic vertical UGC video of a woman in modern kitchen applying glowing skincare serum, smiling to camera, warm morning golden hour sunlight, ultra realistic 4k');
  const [mode, setMode] = useState<GenerationMode>('ugc-product-ad');
  const [provider, setProvider] = useState<ModelProvider>('hybrid-agent');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [duration, setDuration] = useState(5);
  const [motionStrength, setMotionStrength] = useState(6);
  const [autoSync, setAutoSync] = useState(true);
  
  const [selectedWorkspace, setSelectedWorkspace] = useState(workspaces[0]?.id || '');
  const currentWorkspace = workspaces.find(w => w.id === selectedWorkspace) || workspaces[0];
  const [selectedProject, setSelectedProject] = useState(currentWorkspace?.projects[0]?.id || '');
  const currentProject = currentWorkspace?.projects.find(p => p.id === selectedProject) || currentWorkspace?.projects[0];
  const [selectedFolder, setSelectedFolder] = useState(currentProject?.folders[0]?.id || '');

  const presetTemplates = [
    { label: "UGC Skincare Hook", prompt: "Cinematic vertical UGC video of a woman in modern kitchen applying glowing skincare serum, smiling to camera, warm morning golden hour sunlight, ultra realistic 4k" },
    { label: "Luxury Watch Spin", prompt: "Macro 4k slow motion shot of luxury titanium wristwatch with water droplets splashing off crystal glass, dark dramatic studio lighting" },
    { label: "Sneaker Streetwear Ad", prompt: "Dynamic low angle walking shot of modern neon streetwear sneakers stepping on wet reflective asphalt, moody cyberpunk city lighting, 9:16 vertical" },
    { label: "Matcha Latte Pour", prompt: "Crisp slow motion pour of vibrant green matcha foam into clear iced glass, aesthetic minimalist cafe table, soft daylight" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    onGenerate({
      prompt,
      mode,
      provider,
      aspectRatio,
      durationSeconds: duration,
      motionStrength,
      autoSyncReloops: autoSync,
      targetWorkspaceId: selectedWorkspace,
      targetProjectId: selectedProject,
      targetFolderId: selectedFolder
    });
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-indigo-400" />
          <h2 className="font-semibold text-white">Agent Prompt &amp; Generation Config</h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
          <Bot className="w-3.5 h-3.5" />
          <span>Autonomous Agent Mode</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Creative Brief / Prompt */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Creative Brief / Prompt
            </label>
            <span className="text-xs text-zinc-500">{prompt.length} chars</span>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 resize-none transition"
            placeholder="Describe your scene, camera motion, subject, lighting, and product action..."
          />
          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-xs text-zinc-400 flex items-center gap-1">Inspirations:</span>
            {presetTemplates.map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(t.prompt)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-800/60 hover:bg-zinc-700/60 text-zinc-300 hover:text-white border border-zinc-700/50 transition cursor-pointer"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mode & Engine Provider */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Generation Engine</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'hybrid-agent', label: 'Hybrid AI', sub: 'Fal + Higgs' },
                { id: 'fal-ai', label: 'Fal.ai', sub: 'Flux & Kling' },
                { id: 'higgsfield', label: 'Higgsfield', sub: 'Motion AI' }
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setProvider(p.id as ModelProvider)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition cursor-pointer ${
                    provider === p.id
                      ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-sm'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800/50'
                  }`}
                >
                  <span className="text-xs font-semibold">{p.label}</span>
                  <span className="text-[10px] text-zinc-400">{p.sub}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Aspect Ratio</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: '9:16', label: '9:16 Vertical', sub: 'TikTok / Reels', icon: Smartphone },
                { id: '16:9', label: '16:9 Cinema', sub: 'YouTube / Web', icon: Monitor },
                { id: '1:1', label: '1:1 Square', sub: 'Feed Post', icon: Square }
              ].map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setAspectRatio(r.id as AspectRatio)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition cursor-pointer ${
                      aspectRatio === r.id
                        ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-sm'
                        : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800/50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 mb-1 text-zinc-300" />
                    <span className="text-xs font-semibold">{r.id}</span>
                    <span className="text-[10px] text-zinc-400">{r.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reloops Auto-Sync Destination */}
        <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-zinc-200">Reloops DAM Auto-Ingest &amp; Review Hub</span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 bg-zinc-900 border-zinc-700 focus:ring-indigo-500"
              />
              <span className="text-xs text-zinc-300">Auto-Push to Reloops</span>
            </label>
          </div>

          {autoSync && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Workspace</label>
                <select
                  value={selectedWorkspace}
                  onChange={(e) => setSelectedWorkspace(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                >
                  {workspaces.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Project</label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                >
                  {currentWorkspace?.projects?.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Target Folder</label>
                <select
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                >
                  {currentProject?.folders?.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          disabled={isGenerating || !prompt.trim()}
          className="w-full bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-sm py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2.5 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>AI Agent Executing Multi-Step Pipeline...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Launch AI Agent &amp; Generate Content</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
