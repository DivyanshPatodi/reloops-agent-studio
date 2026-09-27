"use client";

import React from 'react';
import { FolderGit2, CheckCircle2, ChevronDown, RefreshCw } from 'lucide-react';
import { ReloopsWorkspace } from '@/types/agent';

interface DestinationSelectorProps {
  workspaces: ReloopsWorkspace[];
  selectedWorkspaceId: string;
  selectedProjectId: string;
  selectedFolderId?: string;
  onSelectWorkspace: (workspaceId: string) => void;
  onSelectProject: (projectId: string) => void;
  onSelectFolder: (folderId: string) => void;
  onRefresh?: () => void;
}

export function DestinationSelector({
  workspaces,
  selectedWorkspaceId,
  selectedProjectId,
  selectedFolderId,
  onSelectWorkspace,
  onSelectProject,
  onSelectFolder,
  onRefresh
}: DestinationSelectorProps) {
  const currentWorkspace = workspaces.find(w => w.id === selectedWorkspaceId) || workspaces[0];
  const projects = currentWorkspace?.projects || [];
  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];
  const folders = currentProject?.folders || [];

  return (
    <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-indigo-950/40 border border-indigo-500/30 rounded-xl p-4 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 text-sm">
      <div className="flex items-center gap-3 text-zinc-300 font-medium">
        <div className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
          <FolderGit2 className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold">Reloops DAM Target Destination</span>
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              <CheckCircle2 className="w-3 h-3" /> Live DAM Sync
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">Choose the workspace & project where outputs will be stacked and shared</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Workspace Dropdown */}
        <div className="relative flex-1 md:flex-initial min-w-[175px]">
          <label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1 font-bold">
            1. Workspace
          </label>
          <div className="relative">
            <select
              value={selectedWorkspaceId}
              onChange={(e) => {
                const newWsId = e.target.value;
                onSelectWorkspace(newWsId);
                const foundWs = workspaces.find(w => w.id === newWsId);
                if (foundWs && foundWs.projects.length > 0) {
                  onSelectProject(foundWs.projects[0].id);
                  onSelectFolder(foundWs.projects[0].folders?.[0]?.id || '');
                }
              }}
              aria-label="Target Workspace"
              className="w-full bg-zinc-950 border border-zinc-700 hover:border-indigo-500 text-zinc-100 rounded-lg px-3 py-1.5 text-xs appearance-none pr-8 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium transition shadow-inner"
            >
              {workspaces.map((ws) => (
                <option key={ws.id} value={ws.id} className="bg-zinc-900 text-zinc-100">
                  🏢 {ws.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Project Dropdown */}
        <div className="relative flex-1 md:flex-initial min-w-[200px]">
          <label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1 font-bold">
            2. Project
          </label>
          <div className="relative">
            <select
              value={selectedProjectId}
              onChange={(e) => {
                const newProjId = e.target.value;
                onSelectProject(newProjId);
                const foundProj = projects.find(p => p.id === newProjId);
                onSelectFolder(foundProj?.folders?.[0]?.id || '');
              }}
              aria-label="Target Project"
              className="w-full bg-zinc-950 border border-zinc-700 hover:border-indigo-500 text-zinc-100 rounded-lg px-3 py-1.5 text-xs appearance-none pr-8 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium transition shadow-inner"
            >
              {projects.length > 0 ? (
                projects.map((proj) => (
                  <option key={proj.id} value={proj.id} className="bg-zinc-900 text-zinc-100">
                    📁 {proj.name}
                  </option>
                ))
              ) : (
                <option value="" className="bg-zinc-900 text-zinc-100">No Projects Found</option>
              )}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Folder Dropdown */}
        <div className="relative flex-1 md:flex-initial min-w-[165px]">
          <label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1 font-bold">
            3. Folder
          </label>
          <div className="relative">
            <select
              value={selectedFolderId || ''}
              onChange={(e) => onSelectFolder(e.target.value)}
              aria-label="Target Folder"
              className="w-full bg-zinc-950 border border-zinc-700 hover:border-indigo-500 text-zinc-100 rounded-lg px-3 py-1.5 text-xs appearance-none pr-8 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium transition shadow-inner"
            >
              <option value="" className="bg-zinc-900 text-zinc-100">Root Folder</option>
              {folders.map((fld) => (
                <option key={fld.id} value={fld.id} className="bg-zinc-900 text-zinc-100">
                  🗂️ {fld.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {onRefresh && (
          <div className="self-end mb-0.5">
            <button
              onClick={onRefresh}
              title="Refresh Reloops Workspaces"
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition cursor-pointer flex items-center justify-center"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
