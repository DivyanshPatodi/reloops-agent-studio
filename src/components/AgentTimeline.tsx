"use client";

import React from 'react';
import { AgentStep } from '@/types/agent';
import { CheckCircle2, CircleDashed, AlertCircle, Loader2 } from 'lucide-react';

interface AgentTimelineProps {
  steps: AgentStep[];
  isGenerating: boolean;
}

export function AgentTimeline({ steps, isGenerating }: AgentTimelineProps) {
  if (!steps || steps.length === 0) {
    return (
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 text-center text-zinc-500 flex flex-col items-center justify-center min-h-[220px]">
        <CircleDashed className="w-8 h-8 text-zinc-600 mb-2 animate-pulse" />
        <p className="text-sm font-medium text-zinc-400">Agent Ready to Orchestrate</p>
        <p className="text-xs text-zinc-500 mt-1 max-w-sm">Submit your prompt to watch the autonomous multi-step pipeline generate video and sync to Reloops.</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <h3 className="text-sm font-semibold text-white">Live Agent Pipeline Stepper</h3>
        {isGenerating && (
          <span className="flex items-center gap-1.5 text-xs text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Autonomous Pipeline Running</span>
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3.5">
        {steps.map((step) => {
          const isDone = step.status === 'completed';
          const isRunning = step.status === 'running';
          const isFailed = step.status === 'failed';

          return (
            <div
              key={step.id}
              className={`p-3.5 rounded-xl border transition flex items-start gap-3 ${
                isRunning
                  ? 'bg-indigo-950/30 border-indigo-500/40 text-indigo-200'
                  : isDone
                  ? 'bg-zinc-950/60 border-zinc-800/80 text-zinc-300'
                  : 'bg-zinc-950/20 border-zinc-900 text-zinc-500'
              }`}
            >
              <div className="pt-0.5">
                {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {isRunning && <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />}
                {!isDone && !isRunning && !isFailed && <CircleDashed className="w-4 h-4 text-zinc-600" />}
                {isFailed && <AlertCircle className="w-4 h-4 text-rose-400" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-zinc-100">{step.name}</h4>
                  {isDone && <span className="text-[10px] text-emerald-400 font-mono">DONE</span>}
                  {isRunning && <span className="text-[10px] text-indigo-400 font-mono animate-pulse">PROCESSING</span>}
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">{step.description}</p>
                {step.details && (
                  <p className="text-[11px] text-zinc-300 bg-zinc-900/90 border border-zinc-800/60 rounded px-2 py-1 mt-1.5 font-mono">
                    {step.details}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
