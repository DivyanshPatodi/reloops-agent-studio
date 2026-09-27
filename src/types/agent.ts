export type GenerationMode = 'text-to-video' | 'image-to-video' | 'image-to-image' | 'ugc-product-ad' | 'character-motion';
export type ModelProvider = 'hybrid-agent' | 'fal-ai' | 'higgsfield';
export type AspectRatio = '9:16' | '16:9' | '1:1';

export interface UploadedMediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  sizeBytes?: number;
}

export interface GenerationRequest {
  id?: string;
  prompt: string;
  negativePrompt?: string;
  mode: GenerationMode;
  provider: ModelProvider;
  falModel?: string;
  higgsfieldPreset?: string;
  aspectRatio: AspectRatio;
  durationSeconds: number;
  motionStrength: number;
  sourceImages?: UploadedMediaItem[];
  sourceImageUrl?: string;
  autoSyncReloops: boolean;
  targetWorkspaceId?: string;
  targetProjectId?: string;
  targetFolderId?: string;
  parentAssetIdToStack?: string;
}

export interface AgentStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  details?: string;
  outputUrl?: string;
  startedAt?: number;
  completedAt?: number;
}

export interface GenerationResult {
  id: string;
  request: GenerationRequest;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  sourceMediaUrl?: string;
  steps: AgentStep[];
  error?: string;
  reloopsAssetId?: string;
  reloopsVersion?: number;
  reloopsReviewUrl?: string;
  reloopsShareUrl?: string;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  attachedMedia?: UploadedMediaItem[];
  result?: GenerationResult;
  timestamp: number;
}

export interface ReloopsWorkspace {
  id: string;
  name: string;
  projects: ReloopsProject[];
}

export interface ReloopsProject {
  id: string;
  name: string;
  workspaceId: string;
  folders: ReloopsFolder[];
}

export interface ReloopsFolder {
  id: string;
  name: string;
  projectId: string;
}