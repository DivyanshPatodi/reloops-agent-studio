"use client";

import React, { useRef } from 'react';
import { UploadedMediaItem } from '@/types/agent';
import { Image as ImageIcon, X, Plus } from 'lucide-react';

interface MediaUploadTrayProps {
  attachedMedia: UploadedMediaItem[];
  onAddMedia: (item: UploadedMediaItem) => void;
  onRemoveMedia: (id: string) => void;
}

export function MediaUploadTray({ attachedMedia, onAddMedia, onRemoveMedia }: MediaUploadTrayProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const samplePresets = [
    {
      name: 'Solis Serum Bottle',
      url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
      type: 'image' as const
    },
    {
      name: 'Athletic Sneaker',
      url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
      type: 'image' as const
    },
    {
      name: 'Luxury Watch',
      url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
      type: 'image' as const
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        onAddMedia({
          id: `upload_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: file.name,
          url: reader.result as string,
          type: file.type.startsWith('video') ? 'video' : 'image',
          sizeBytes: file.size
        });
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-semibold text-zinc-200">Source Asset Tray (For Image-to-Video &amp; Variations)</h3>
        </div>
        <span className="text-[11px] text-zinc-400">{attachedMedia.length} assets selected</span>
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 min-h-[72px]">
        {attachedMedia.map((media) => (
          <div key={media.id} className="relative group shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-950">
            <img src={media.url} alt={media.name} className="w-full h-full object-cover" />
            <button
              onClick={() => onRemoveMedia(media.id)}
              className="absolute top-1 right-1 p-0.5 rounded-full bg-black/70 text-zinc-300 hover:text-white transition opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
            <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[9px] text-zinc-300 px-1 truncate text-center">
              {media.name}
            </span>
          </div>
        ))}

        <button
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0 w-16 h-16 rounded-xl border border-dashed border-zinc-700 hover:border-indigo-500 bg-zinc-950/60 hover:bg-indigo-950/20 text-zinc-400 hover:text-indigo-300 flex flex-col items-center justify-center gap-1 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="text-[10px] font-medium">Upload</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      <div className="flex items-center gap-2 pt-1 border-t border-zinc-800/80 text-[11px] text-zinc-400">
        <span>Sample Assets:</span>
        {samplePresets.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onAddMedia({
              id: `sample_${idx}_${Date.now()}`,
              name: preset.name,
              url: preset.url,
              type: preset.type
            })}
            className="px-2 py-0.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition cursor-pointer"
          >
            + {preset.name}
          </button>
        ))}
      </div>
    </div>
  );
}
