"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Link as LinkIcon, 
  Sparkles, 
  Play, 
  Pause,
  Download, 
  RotateCw, 
  Check, 
  ChevronDown, 
  X, 
  Upload, 
  AlertCircle,
  Loader2,
  Film,
  Plus,
  KeyRound,
  ShieldCheck,
  LogOut,
  Sliders,
  Camera,
  ArrowLeft,
  ArrowRight,
  ArrowUpDown
} from 'lucide-react';

interface UploadedAsset {
  id: string;
  name: string;
  dataUrl: string;
  size?: number;
}

interface GenerationResult {
  id: string;
  prompt: string;
  model: string;
  input_urls: string[];
  output_url: string | null;
  thumbnail_url: string;
  type: 'video' | 'image';
  created_at: string;
  api_notice?: string | null;
}

export default function MultiAssetVideoStudio() {
  // Guest BYOK Connection State
  const [userApiKey, setUserApiKey] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [keyHint, setKeyHint] = useState<string>('');
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  
  // Connect input fields
  const [keyInputType, setKeyInputType] = useState<'single' | 'split'>('single');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [keyIdInput, setKeyIdInput] = useState('');
  const [keySecretInput, setKeySecretInput] = useState('');

  // Assets list (flexible: any number of images)
  const [assets, setAssets] = useState<UploadedAsset[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Form State
  const [prompt, setPrompt] = useState('Smooth continuous cinematic push-in shot traveling from across the river, moving across the illuminated stone bridge archway, and seamlessly transitioning into the bustling downtown street with glowing neon lights and passing yellow cabs, 4k, photorealistic motion');
  const [model, setModel] = useState('Kling 3');
  const [motionStyle, setMotionStyle] = useState<'push_in' | 'smooth_pan' | 'hyperlapse'>('push_in');
  const [importLink, setImportLink] = useState('');

  // Player & Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isRecordingExport, setIsRecordingExport] = useState(false);

  // Result state
  const [result, setResult] = useState<GenerationResult | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const resultSectionRef = useRef<HTMLDivElement>(null);
  const loadedImagesRef = useRef<HTMLImageElement[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load guest's saved API key from localStorage on mount
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem('higgsfield_guest_api_key');
      if (savedKey && savedKey.trim()) {
        const clean = savedKey.trim();
        setUserApiKey(clean);
        setApiKeyInput(clean);
        setIsConnected(true);
        const hint = clean.length > 8 
          ? clean.substring(0, 5) + '...' + clean.substring(clean.length - 4)
          : clean;
        setKeyHint(hint);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (successToast) {
      const t = setTimeout(() => setSuccessToast(null), 5000);
      return () => clearTimeout(t);
    }
  }, [successToast]);

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleAddFiles = async (files: FileList | File[]) => {
    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/') || /\.(png|jpe?g|webp|gif|bmp|svg|avif)$/i.test(file.name)) {
        if (file.size <= 20 * 1024 * 1024) {
          validFiles.push(file);
        }
      }
    }

    if (validFiles.length === 0) {
      setErrorMessage('Please select valid image files (PNG, JPG, WEBP).');
      return;
    }

    // Automatic Natural Numerical Sort: 1.png -> 2.png -> 3.png
    validFiles.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

    setErrorMessage(null);

    try {
      const newAssets: UploadedAsset[] = await Promise.all(
        validFiles.map(async (file, idx) => ({
          id: `${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
          name: file.name,
          dataUrl: await readFileAsDataUrl(file),
          size: file.size
        }))
      );

      setAssets(prev => [...prev, ...newAssets]);
      setSuccessToast(`Added and sorted ${newAssets.length} image${newAssets.length > 1 ? 's' : ''} in forward sequence!`);
    } catch (err: any) {
      setErrorMessage('Error reading image files.');
    }
  };

  // Clipboard paste support
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const imageFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) imageFiles.push(file);
        }
      }
      if (imageFiles.length > 0) {
        handleAddFiles(imageFiles);
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [assets]);

  const handleRemoveAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  const handleMoveLeft = (index: number) => {
    if (index <= 0) return;
    setAssets(prev => {
      const arr = [...prev];
      const temp = arr[index];
      arr[index] = arr[index - 1];
      arr[index - 1] = temp;
      return arr;
    });
  };

  const handleMoveRight = (index: number) => {
    if (index >= assets.length - 1) return;
    setAssets(prev => {
      const arr = [...prev];
      const temp = arr[index];
      arr[index] = arr[index + 1];
      arr[index + 1] = temp;
      return arr;
    });
  };

  const handleReverseOrder = () => {
    setAssets(prev => [...prev].reverse());
    setSuccessToast('Sequence order inverted!');
  };

  const handleClearAllAssets = () => {
    setAssets([]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleAddFiles(e.dataTransfer.files);
    }
  };

  const handleConnect = async () => {
    let effectiveKey = apiKeyInput.trim();

    if (keyInputType === 'split') {
      if (!keyIdInput.trim() || !keySecretInput.trim()) {
        setErrorMessage('Please enter both Key ID and Key Secret.');
        return;
      }
      effectiveKey = `${keyIdInput.trim()}:${keySecretInput.trim()}`;
    }

    if (!effectiveKey) {
      setErrorMessage('Please enter your Higgsfield API Key.');
      return;
    }

    setIsConnecting(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: effectiveKey })
      });
      const data = await res.json();
      if (data.connected && data.apiKey) {
        setUserApiKey(data.apiKey);
        setApiKeyInput(data.apiKey);
        try {
          localStorage.setItem('higgsfield_guest_api_key', data.apiKey);
        } catch (e) {}
        setIsConnected(true);
        setKeyHint(data.keyHint);
        setShowConnectDialog(false);
        setSuccessToast('Your Higgsfield API key has been connected securely!');
      } else {
        setErrorMessage(data.error || 'Failed to connect. Please check your key.');
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Connection error');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setUserApiKey('');
    setApiKeyInput('');
    setKeyIdInput('');
    setKeySecretInput('');
    setIsConnected(false);
    setKeyHint('');
    try {
      localStorage.removeItem('higgsfield_guest_api_key');
    } catch (e) {}
    setShowConnectDialog(false);
    setSuccessToast('API key disconnected.');
  };

  const handleGenerate = async () => {
    if (assets.length === 0 && !prompt.trim()) {
      setErrorMessage('Please add at least one image or enter a prompt.');
      return;
    }

    setErrorMessage(null);
    setIsGenerating(true);
    setIsPlaying(false);

    const effectivePrompt = prompt.trim() || (assets.length > 0 
      ? `Cohesive cinematic motion video created from ${assets.length} image assets` 
      : 'Cinematic video animation');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: effectivePrompt,
          imageUrls: assets.map(a => a.dataUrl),
          model,
          apiKey: userApiKey || undefined,
          duration: Math.max(6, assets.length * 3)
        })
      });

      const data = await res.json();
      if (data.success && data.generation) {
        setResult(data.generation);
        if (data.notice) {
          setErrorMessage(data.notice);
        } else {
          setSuccessToast(`Video created from ${assets.length} image${assets.length > 1 ? 's' : ''}!`);
        }

        setTimeout(() => {
          resultSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (!data.generation.output_url && assets.length > 0) {
            initCanvasPlayer(assets.map(a => a.dataUrl));
          }
        }, 200);
      } else {
        setErrorMessage(data.error || 'Generation failed.');
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Error occurred during generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Continuous Cinematic Push-In & Flythrough Compositor Engine
  const initCanvasPlayer = (imageUrls: string[]) => {
    if (imageUrls.length === 0) return;
    const imgs: HTMLImageElement[] = [];
    let loadedCount = 0;

    imageUrls.forEach((url) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === imageUrls.length) {
          loadedImagesRef.current = imgs;
          startCanvasAnimation();
        }
      };
      imgs.push(img);
    });
  };

  const startCanvasAnimation = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setIsPlaying(true);
    const startTime = performance.now();
    const images = loadedImagesRef.current;
    if (images.length === 0) return;

    // Segment duration: 3.2 seconds per keyframe shot
    const segmentDuration = 3200;
    const totalDurationMs = images.length * segmentDuration;
    const transitionWindow = 1400;

    const render = (time: number) => {
      const elapsed = (time - startTime) % totalDurationMs;
      const progress = elapsed / totalDurationMs;
      setPlaybackProgress(progress);

      const segmentIndex = Math.floor(elapsed / segmentDuration) % images.length;
      const segmentElapsed = elapsed % segmentDuration;

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const w = canvas.width;
          const h = canvas.height;
          ctx.fillStyle = '#020617';
          ctx.fillRect(0, 0, w, h);

          const currentImg = images[segmentIndex];
          const nextIndex = (segmentIndex + 1) % images.length;
          const nextImg = images[nextIndex];

          const t = segmentElapsed / segmentDuration;
          const easeT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

          // Focal vanishing point (center skyscraper: 50% X, 38% Y)
          const focalX = w * 0.50;
          const focalY = h * 0.38;

          if (motionStyle === 'push_in') {
            // Forward Push-In / Flythrough into the green tower / archway
            const scaleCurrent = 1.0 + easeT * 0.95;

            ctx.save();
            ctx.translate(focalX, focalY);
            ctx.scale(scaleCurrent, scaleCurrent);
            ctx.translate(-focalX, -focalY);
            if (currentImg && currentImg.complete) {
              drawImageCover(ctx, currentImg, 0, 0, w, h);
            }
            ctx.restore();

            if (segmentElapsed > segmentDuration - transitionWindow && images.length > 1) {
              const transRaw = (segmentElapsed - (segmentDuration - transitionWindow)) / transitionWindow;
              const transSmooth = transRaw * transRaw * (3 - 2 * transRaw);
              const scaleNext = 0.68 + transSmooth * 0.32;

              ctx.save();
              ctx.globalAlpha = transSmooth;
              ctx.translate(focalX, focalY);
              ctx.scale(scaleNext, scaleNext);
              ctx.translate(-focalX, -focalY);
              if (nextImg && nextImg.complete) {
                drawImageCover(ctx, nextImg, 0, 0, w, h);
              }
              ctx.restore();
            }
          } else if (motionStyle === 'smooth_pan') {
            const panX = Math.sin(easeT * Math.PI) * 30;
            const scale = 1.05 + Math.sin(easeT * Math.PI) * 0.05;

            ctx.save();
            ctx.translate(w / 2 + panX, h / 2);
            ctx.scale(scale, scale);
            ctx.translate(-w / 2, -h / 2);
            if (currentImg && currentImg.complete) {
              drawImageCover(ctx, currentImg, 0, 0, w, h);
            }
            ctx.restore();

            if (segmentElapsed > segmentDuration - transitionWindow && images.length > 1) {
              const trans = (segmentElapsed - (segmentDuration - transitionWindow)) / transitionWindow;
              ctx.save();
              ctx.globalAlpha = trans;
              if (nextImg && nextImg.complete) {
                drawImageCover(ctx, nextImg, 0, 0, w, h);
              }
              ctx.restore();
            }
          } else {
            const scale = 1.0 + easeT * 0.4;
            ctx.save();
            ctx.translate(w / 2, h / 2);
            ctx.scale(scale, scale);
            ctx.translate(-w / 2, -h / 2);
            if (currentImg && currentImg.complete) {
              drawImageCover(ctx, currentImg, 0, 0, w, h);
            }
            ctx.restore();

            if (segmentElapsed > segmentDuration - transitionWindow && images.length > 1) {
              const trans = (segmentElapsed - (segmentDuration - transitionWindow)) / transitionWindow;
              ctx.save();
              ctx.globalAlpha = trans;
              if (nextImg && nextImg.complete) {
                drawImageCover(ctx, nextImg, 0, 0, w, h);
              }
              ctx.restore();
            }
          }

          const gradient = ctx.createRadialGradient(w / 2, h / 2, w * 0.35, w / 2, h / 2, w * 0.75);
          gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, w, h);
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
  };

  const drawImageCover = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) => {
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = w / h;
    let sWidth = img.naturalWidth;
    let sHeight = img.naturalHeight;
    let sx = 0;
    let sy = 0;

    if (imgRatio > canvasRatio) {
      sWidth = img.naturalHeight * canvasRatio;
      sx = (img.naturalWidth - sWidth) / 2;
    } else {
      sHeight = img.naturalWidth / canvasRatio;
      sy = (img.naturalHeight - sHeight) / 2;
    }

    ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, w, h);
  };

  const togglePlay = () => {
    if (isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (videoRef.current) videoRef.current.pause();
      setIsPlaying(false);
    } else {
      if (result?.output_url && videoRef.current) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      } else if (assets.length > 0) {
        initCanvasPlayer(assets.map(a => a.dataUrl));
      }
    }
  };

  const handleDownloadVideo = () => {
    if (result?.output_url && !result.output_url.startsWith('blob:')) {
      const a = document.createElement('a');
      a.href = result.output_url;
      a.download = `video_output_${Date.now()}.mp4`;
      a.target = '_blank';
      a.click();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      setIsRecordingExport(true);
      setSuccessToast('Encoding high-definition video deliverable...');
      const stream = canvas.captureStream(30);
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cinematic_pushin_video_${Date.now()}.webm`;
        a.click();
        setIsRecordingExport(false);
        setSuccessToast('Video downloaded successfully!');
      };

      const durationMs = Math.max(6000, assets.length * 3200);
      recorder.start();
      setTimeout(() => {
        recorder.stop();
      }, durationMs);
    } catch (err: any) {
      setIsRecordingExport(false);
      setErrorMessage('Export error: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-8 px-4 sm:px-6 lg:px-8 font-sans antialiased flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-6">

        {/* 1. Header with BYOK indicator */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-950 tracking-tight">Higgsfield Multi-Shot Studio</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Sequence multiple reference images to generate continuous cinematic motion videos.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            {isConnected ? (
              <button
                onClick={() => setShowConnectDialog(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition shadow-xs cursor-pointer bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Connected ({keyHint})</span>
              </button>
            ) : (
              <button
                onClick={() => setShowConnectDialog(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition shadow-xs cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Connect Your API Key</span>
              </button>
            )}
          </div>
        </header>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-950">Notice</p>
                <p className="text-xs text-amber-800 leading-relaxed mt-0.5">{errorMessage}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => setShowConnectDialog(true)}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition cursor-pointer"
              >
                {isConnected ? 'Change Key' : 'Enter Key'}
              </button>
              <button onClick={() => setErrorMessage(null)} className="p-1 text-amber-700 hover:text-amber-950 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Global Success Toast */}
        {successToast && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium text-xs sm:text-sm">{successToast}</span>
            </div>
            <button onClick={() => setSuccessToast(null)} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 2. Reference Images Tray */}
        <section className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Reference Images (In Sequence)</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload your images in order (Shot 1: River Wide ➔ Shot 2: Bridge Arch ➔ Shot 3: Downtown Street).
              </p>
            </div>
            {assets.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReverseOrder}
                  className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-blue-600 font-semibold px-2 py-1 bg-slate-100 hover:bg-blue-50 rounded-lg cursor-pointer transition"
                  title="Invert shot sequence order"
                >
                  <ArrowUpDown className="w-3 h-3" />
                  <span>Reverse Order</span>
                </button>
                <button
                  onClick={handleClearAllAssets}
                  className="text-xs text-slate-400 hover:text-red-600 font-medium px-2 py-1 cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Full-Surface Multi-Image Dropzone & Picker */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition ${
              isDragging
                ? 'border-blue-500 bg-blue-50/60 scale-[0.99]'
                : 'border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50/80'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleAddFiles(e.target.files);
                }
                e.target.value = '';
              }}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
              title="Click or drop images here"
            />

            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2 pointer-events-none">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-slate-800 pointer-events-none">
              {isDragging ? 'Drop your images here!' : 'Click or drag and drop your 3 sequence images here'}
            </p>
            <p className="text-xs text-slate-400 mt-1 pointer-events-none">
              Files are automatically sorted (1.png ➔ 2.png ➔ 3.png) &bull; or Paste (Ctrl+V)
            </p>

            <button
              type="button"
              className="mt-3 px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition pointer-events-none"
            >
              Browse files
            </button>
          </div>

          {/* Display Uploaded Image Cards with Reorder Arrows */}
          {assets.length > 0 && (
            <div className="pt-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {assets.map((asset, index) => (
                  <div
                    key={asset.id}
                    className="relative group rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs"
                  >
                    <div className="aspect-[16/9] bg-slate-900 relative">
                      <img
                        src={asset.dataUrl}
                        alt={asset.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <span className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                        Shot #{index + 1}
                      </span>
                      <button
                        onClick={() => handleRemoveAsset(asset.id)}
                        className="absolute top-2 right-2 bg-black/70 hover:bg-red-600 text-white p-1 rounded transition cursor-pointer"
                        title="Remove image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      {/* Move Left / Right Buttons */}
                      <div className="absolute inset-x-2 bottom-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => handleMoveLeft(index)}
                          disabled={index === 0}
                          className="p-1 bg-black/80 hover:bg-blue-600 text-white rounded disabled:opacity-30 cursor-pointer"
                          title="Move earlier"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveRight(index)}
                          disabled={index === assets.length - 1}
                          className="p-1 bg-black/80 hover:bg-blue-600 text-white rounded disabled:opacity-30 cursor-pointer"
                          title="Move later"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="p-2 truncate bg-white">
                      <p className="text-[11px] font-medium text-slate-700 truncate">{asset.name}</p>
                    </div>
                  </div>
                ))}

                {/* Add More Card */}
                <label className="relative border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl aspect-[16/9] flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50 hover:bg-blue-50/30 transition group">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleAddFiles(e.target.files);
                      }
                      e.target.value = '';
                    }}
                  />
                  <div className="w-7 h-7 rounded-full bg-slate-200 group-hover:bg-blue-100 text-slate-500 group-hover:text-blue-600 flex items-center justify-center mb-1 transition">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-600 group-hover:text-blue-600">Add more</span>
                </label>
              </div>
            </div>
          )}
        </section>

        {/* 3. Prompt Card */}
        <section className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-slate-900">Motion Prompt</h2>
            <span className="text-xs text-slate-400">Describe the camera trajectory and motion details.</span>
          </div>

          <div className="relative">
            <textarea
              rows={3}
              maxLength={1000}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Smooth continuous cinematic push-in shot traveling from across the river, moving across the illuminated stone bridge archway, and seamlessly transitioning into the bustling downtown street with glowing neon lights and passing yellow cabs, 4k, photorealistic motion"
              className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none leading-relaxed"
            />
            <div className="absolute right-3.5 bottom-3.5 text-xs text-slate-400 font-mono select-none">
              {prompt.length}/1000
            </div>
          </div>
        </section>

        {/* 4. Motion Dynamics & Generate Controls */}
        <section className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
          <div className="grid grid-cols-2 gap-3 flex-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-blue-600" />
                <span>Motion Trajectory</span>
              </label>
              <div className="relative">
                <select
                  value={motionStyle}
                  onChange={(e) => setMotionStyle(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 appearance-none pr-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs transition"
                >
                  <option value="push_in">Cinematic Push-In (Flythrough)</option>
                  <option value="smooth_pan">Smooth Sweeping Pan</option>
                  <option value="hyperlapse">Dynamic Hyperlapse</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Model Engine</label>
              <div className="relative">
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 appearance-none pr-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs transition"
                >
                  <option value="Kling 3">Kling 3 (Photorealistic)</option>
                  <option value="Seedance">Seedance (Fluid Trajectory)</option>
                  <option value="Higgsfield Motion v1.0">Higgsfield Motion v1.0</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="sm:w-1/2">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Continuous Video...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Video{assets.length > 0 ? ` (${assets.length} Images)` : ''}</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* 5. Result Card */}
        <div ref={resultSectionRef}>
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Result Deliverable</h2>
              <span className="text-xs text-slate-400">Continuous photorealistic motion output.</span>
            </div>

            {result ? (
              <div className="space-y-4">
                {/* Widescreen Video Player Display */}
                <div 
                  onClick={togglePlay}
                  className="relative rounded-xl overflow-hidden bg-slate-950 aspect-[16/9] max-h-[460px] flex items-center justify-center group cursor-pointer border border-slate-800 shadow-inner"
                >
                  {result.output_url ? (
                    <video
                      ref={videoRef}
                      src={result.output_url}
                      autoPlay
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <canvas
                      ref={canvasRef}
                      width={1280}
                      height={720}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Big Center Play Button Overlay */}
                  {!isPlaying && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition">
                      <div className="w-14 h-14 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white flex items-center justify-center shadow-lg transition backdrop-blur-xs">
                        <Play className="w-6 h-6 fill-white ml-1" />
                      </div>
                    </div>
                  )}

                  {/* Scrubber bottom bar */}
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col gap-1.5">
                    <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full rounded-full transition-all duration-75"
                        style={{ width: `${playbackProgress * 100}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-white text-[11px] font-mono">
                      <span>Motion: {motionStyle === 'push_in' ? 'Cinematic Push-In Flythrough' : motionStyle}</span>
                      <span>0:0{Math.floor(playbackProgress * Math.max(6, assets.length * 3.2))}s</span>
                    </div>
                  </div>
                </div>

                {/* Actions: [ Download ] [ Generate variation ] */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={handleDownloadVideo}
                    disabled={isRecordingExport}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition cursor-pointer disabled:opacity-50"
                  >
                    {isRecordingExport ? (
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    ) : (
                      <Download className="w-4 h-4 text-slate-500" />
                    )}
                    <span>{isRecordingExport ? 'Encoding Deliverable...' : 'Download Video'}</span>
                  </button>

                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition cursor-pointer disabled:opacity-50"
                  >
                    <RotateCw className="w-4 h-4 text-slate-500" />
                    <span>Generate variation</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center text-center text-slate-400">
                <Film className="w-10 h-10 mb-2 stroke-1 opacity-50 text-slate-400" />
                <p className="text-sm font-medium text-slate-600">Your generated video will appear here.</p>
                <p className="text-xs text-slate-400 mt-1">Upload 1.png, 2.png, 3.png above and click Generate Video.</p>
              </div>
            )}
          </section>
        </div>

        {/* 6. Import Existing Higgsfield Result Card */}
        <section className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-slate-900">Import existing Higgsfield result</h2>
            <span className="text-xs text-slate-400">Paste a Higgsfield link to import and preview it here.</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={importLink}
                onChange={(e) => setImportLink(e.target.value)}
                placeholder="Paste Higgsfield link..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-normal shadow-2xs transition"
              />
            </div>

            <button
              onClick={async () => {
                if (!importLink.trim()) return;
                setIsImporting(true);
                try {
                  const res = await fetch('/api/import', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ link: importLink.trim() })
                  });
                  const data = await res.json();
                  if (data.success && data.generation) {
                    setResult(data.generation);
                    setImportLink('');
                    setSuccessToast('Higgsfield asset imported!');
                  }
                } catch (e: any) {
                  setErrorMessage('Import failed.');
                } finally {
                  setIsImporting(false);
                }
              }}
              disabled={isImporting || !importLink.trim()}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-xs flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>Import</span>
            </button>
          </div>
        </section>

      </div>

      {/* Guest BYOK Connect Modal */}
      {showConnectDialog && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Connect Your Higgsfield Key</h3>
              </div>
              <button onClick={() => setShowConnectDialog(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold text-slate-600">
              <button
                onClick={() => setKeyInputType('single')}
                className={`flex-1 py-1.5 rounded-md transition cursor-pointer ${
                  keyInputType === 'single' ? 'bg-white text-blue-600 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Paste Key (Any Format)
              </button>
              <button
                onClick={() => setKeyInputType('split')}
                className={`flex-1 py-1.5 rounded-md transition cursor-pointer ${
                  keyInputType === 'split' ? 'bg-white text-blue-600 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Enter ID & Secret Separately
              </button>
            </div>

            {keyInputType === 'single' ? (
              <div className="space-y-2">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Paste your API key from <a href="https://console.higgsfield.ai/api-keys" target="_blank" className="text-blue-600 underline font-semibold">console.higgsfield.ai</a>.
                </p>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Paste KEY_ID:KEY_SECRET here..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Key ID</label>
                  <input
                    type="text"
                    value={keyIdInput}
                    onChange={(e) => setKeyIdInput(e.target.value)}
                    placeholder="e.g. 6c8b3f60-db51-4a50..."
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Key Secret</label>
                  <input
                    type="password"
                    value={keySecretInput}
                    onChange={(e) => setKeySecretInput(e.target.value)}
                    placeholder="e.g. 796e7b7dcd656a72..."
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
                  />
                </div>
              </div>
            )}

            <p className="text-[11px] text-slate-400">
              🔒 Your key is stored solely in your local browser and sent directly with generation requests.
            </p>

            <div className="flex items-center justify-between pt-2">
              {isConnected ? (
                <button
                  onClick={handleDisconnect}
                  className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Disconnect Key</span>
                </button>
              ) : <div />}
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowConnectDialog(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {isConnecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Save Key</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
