import React, { useEffect, useRef, useState } from 'react';
import {
  Upload,
  X,
  Check,
  Loader2,
  Crop,
  ZoomIn,
  Move,
  RotateCcw,
  ChevronUp,
} from 'lucide-react';

export type ImageFrameShape = 'circle' | 'square' | 'landscape';

interface ImageUploadInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  shape?: ImageFrameShape;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  label = 'Image',
  value,
  onChange,
  placeholder = 'Enter image URL or upload from device',
  className = '',
  shape = 'landscape',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewBoxRef = useRef<HTMLDivElement>(null);
  const lastEmittedCropRef = useRef<string | null>(null);

  const defaultPanY = shape === 'circle' || shape === 'square' ? 12 : 25;

  const [sourceUrl, setSourceUrl] = useState<string>(value);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isApplyingCrop, setIsApplyingCrop] = useState(false);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [cropSavedFeedback, setCropSavedFeedback] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [zoom, setZoom] = useState<number>(1);
  const [panX, setPanX] = useState<number>(50);
  const [panY, setPanY] = useState<number>(defaultPanY);
  const [natSize, setNatSize] = useState<{ w: number; h: number }>({ w: 1200, h: 800 });

  // Sync external URL changes (e.g., modal switched item or user pasted URL),
  // but preserve uncropped sourceUrl during the same session when we just emitted a crop.
  useEffect(() => {
    if (value !== lastEmittedCropRef.current) {
      setSourceUrl(value);
      setZoom(1);
      setPanX(50);
      setPanY(defaultPanY);
    }
  }, [value, defaultPanY]);

  const dragStateRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    startPanX: number;
    startPanY: number;
    boxW: number;
    boxH: number;
  } | null>(null);

  const targetRatio = shape === 'landscape' ? 1.5 : 1;
  const imgRatio = natSize.h > 0 ? natSize.w / natSize.h : 1;

  // Base cover fractions relative to preview viewport
  const baseFracW = imgRatio > targetRatio ? imgRatio / targetRatio : 1;
  const baseFracH = imgRatio > targetRatio ? 1 : targetRatio / imgRatio;

  const drawFracW = baseFracW * zoom;
  const drawFracH = baseFracH * zoom;
  const slackFracX = Math.max(0, drawFracW - 1);
  const slackFracY = Math.max(0, drawFracH - 1);

  const leftPct = -(panX / 100) * slackFracX * 100;
  const topPct = -(panY / 100) * slackFracY * 100;

  // Resize and compress newly uploaded image to a clean baseline (max 1400px)
  // while keeping quality high before the admin adjusts crop/framing.
  const readAndOptimizeFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;

          const maxDim = 1400;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      const dataUrl = await readAndOptimizeFile(file);
      setSourceUrl(dataUrl);
      setZoom(1);
      setPanX(50);
      setPanY(defaultPanY);
      lastEmittedCropRef.current = dataUrl;
      onChange(dataUrl);
      setIsCropperOpen(true);
    } catch (err) {
      console.error('Image upload failed:', err);
      setError('Failed to process image. Please try another photo or URL.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleApplyCrop = () => {
    if (!sourceUrl) return;
    setError(null);
    setIsApplyingCrop(true);

    const img = new Image();
    // Allow canvas export for same-origin and CORS-enabled external URLs
    if (!sourceUrl.startsWith('data:') && !sourceUrl.startsWith('/')) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => {
      try {
        const outW = shape === 'landscape' ? 1200 : 720;
        const outH = shape === 'landscape' ? 800 : 720;

        const naturalW = img.naturalWidth || img.width;
        const naturalH = img.naturalHeight || img.height;
        const ratio = naturalH > 0 ? naturalW / naturalH : 1;

        const bFracW = ratio > targetRatio ? ratio / targetRatio : 1;
        const bFracH = ratio > targetRatio ? 1 : targetRatio / ratio;
        const dW = bFracW * zoom * outW;
        const dH = bFracH * zoom * outH;
        const dx = -(panX / 100) * Math.max(0, dW - outW);
        const dy = -(panY / 100) * Math.max(0, dH - outH);

        const canvas = document.createElement('canvas');
        canvas.width = outW;
        canvas.height = outH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Canvas 2D context unavailable');
        }

        ctx.fillStyle = '#24140e';
        ctx.fillRect(0, 0, outW, outH);
        ctx.drawImage(img, dx, dy, dW, dH);

        const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        lastEmittedCropRef.current = croppedDataUrl;
        onChange(croppedDataUrl);
        setCropSavedFeedback(true);
        setTimeout(() => setCropSavedFeedback(false), 2500);
      } catch (err) {
        console.error('Canvas crop error:', err);
        setError(
          'External image blocks browser cropping (CORS). Upload the image file directly to crop and save it.'
        );
      } finally {
        setIsApplyingCrop(false);
      }
    };

    img.onerror = () => {
      setIsApplyingCrop(false);
      setError('Could not load source image for cropping. Please verify the file or URL.');
    };

    img.src = sourceUrl;
  };

  const handleResetFraming = () => {
    setZoom(1);
    setPanX(50);
    setPanY(defaultPanY);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!previewBoxRef.current) return;
    const rect = previewBoxRef.current.getBoundingClientRect();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStateRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      startPanX: panX,
      startPanY: panY,
      boxW: rect.width,
      boxH: rect.height,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const ds = dragStateRef.current;
    if (!ds || !ds.active) return;

    const deltaX = e.clientX - ds.startX;
    const deltaY = e.clientY - ds.startY;

    if (slackFracX > 0.001 && ds.boxW > 0) {
      const nextPanX = ds.startPanX - (deltaX / (slackFracX * ds.boxW)) * 100;
      setPanX(Math.max(0, Math.min(100, Math.round(nextPanX))));
    }
    if (slackFracY > 0.001 && ds.boxH > 0) {
      const nextPanY = ds.startPanY - (deltaY / (slackFracY * ds.boxH)) * 100;
      setPanY(Math.max(0, Math.min(100, Math.round(nextPanY))));
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStateRef.current?.active) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore if already released
      }
      dragStateRef.current = null;
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-[#F2C14E] uppercase tracking-wider">
          {label}
        </label>
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={value}
              onChange={(e) => {
                lastEmittedCropRef.current = null;
                setSourceUrl(e.target.value);
                onChange(e.target.value);
              }}
              placeholder={placeholder}
              className="w-full pl-3 pr-8 py-2 rounded-lg border border-[#D9A62E]/35 bg-[#120B08] text-xs text-[#F9F5F0] placeholder-[#A89585] focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
            />
            {value && (
              <button
                type="button"
                onClick={() => {
                  lastEmittedCropRef.current = null;
                  setSourceUrl('');
                  onChange('');
                  setIsCropperOpen(false);
                }}
                className="absolute right-2 top-2.5 text-[#A89585] hover:text-[#F9F5F0]"
                title="Clear image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="px-3.5 py-2 rounded-lg bg-[#281912] hover:bg-[#362218] text-[#F2C14E] border border-[#D9A62E]/45 text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 shadow-sm disabled:opacity-50"
            title="Upload photo from computer or phone"
          >
            {isProcessing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5 text-[#F2C14E]" />
            )}
            <span>{isProcessing ? 'Optimizing...' : 'Upload File'}</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {error && <p className="text-[11px] text-rose-400 font-medium">{error}</p>}

        {/* Live Preview Strip + Framing Toggle */}
        {value && (
          <div className="flex items-center justify-between gap-3 p-2.5 bg-[#120B08] border border-[#D9A62E]/30 rounded-xl">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-12 h-12 overflow-hidden bg-[#281912] shrink-0 border-2 border-[#D9A62E] shadow-sm ${
                  shape === 'circle' ? 'rounded-full' : 'rounded-lg'
                }`}
              >
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      '/assets/aistudio/RUSIZI_FOUNDATION_afe2877a.png';
                  }}
                />
              </div>
              <div className="min-w-0 text-[11px]">
                <span className="font-semibold text-[#F9F5F0] block truncate max-w-[180px] sm:max-w-[240px]">
                  {value.startsWith('data:') ? 'Uploaded & Optimized Photo' : value}
                </span>
                <span className="text-[#D6C7B8] flex items-center gap-1 font-medium">
                  <Check className="w-3 h-3 text-[#F2C14E]" /> Ready · Face-first framing
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCropperOpen((prev) => !prev)}
              className="px-2.5 py-1.5 rounded-lg bg-[#281912] hover:bg-[#362218] text-[#F2C14E] border border-[#D9A62E]/40 text-[11px] font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
            >
              {isCropperOpen ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5 text-[#F2C14E]" />
                  <span>Hide Framing</span>
                </>
              ) : (
                <>
                  <Crop className="w-3.5 h-3.5 text-[#F2C14E]" />
                  <span>Adjust Crop</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Interactive Image Framing & Crop Studio */}
        {isCropperOpen && sourceUrl && (
          <div className="p-4 rounded-xl bg-[#281912] border border-[#D9A62E]/35 space-y-3.5 shadow-inner">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#F9F5F0]">
                <Move className="w-3.5 h-3.5 text-[#F2C14E]" />
                <span>Drag photo or adjust sliders to center face</span>
              </div>
              <button
                type="button"
                onClick={handleResetFraming}
                className="text-[11px] font-semibold text-[#D6C7B8] hover:text-[#F2C14E] flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Interactive Preview Viewport */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div
                ref={previewBoxRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className={`relative overflow-hidden bg-[#120B08] border-2 border-[#D9A62E]/60 shadow-md select-none touch-none shrink-0 cursor-grab active:cursor-grabbing ${
                  shape === 'landscape'
                    ? 'w-full sm:w-56 aspect-[3/2] rounded-xl'
                    : 'w-44 h-44 rounded-xl'
                }`}
              >
                <img
                  src={sourceUrl}
                  alt="Framing preview"
                  draggable={false}
                  onLoad={(e) => {
                    const el = e.currentTarget;
                    if (el.naturalWidth && el.naturalHeight) {
                      setNatSize({ w: el.naturalWidth, h: el.naturalHeight });
                    }
                  }}
                  style={{
                    position: 'absolute',
                    width: `${drawFracW * 100}%`,
                    height: `${drawFracH * 100}%`,
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    maxWidth: 'none',
                  }}
                  className="pointer-events-none select-none"
                />

                {/* Circular Portrait Guide Mask */}
                {shape === 'circle' && (
                  <div
                    className="absolute inset-1 rounded-full border-2 border-[#F2C14E] pointer-events-none"
                    style={{ boxShadow: '0 0 0 9999px rgba(18, 11, 8, 0.58)' }}
                  />
                )}

                <div className="absolute inset-0 pointer-events-none opacity-25 border border-[#D9A62E]/30" />
              </div>

              {/* Zoom & Position Sliders */}
              <div className="flex-1 w-full space-y-2.5 text-[11px]">
                <div>
                  <div className="flex justify-between font-semibold text-[#F9F5F0] mb-0.5">
                    <span className="flex items-center gap-1">
                      <ZoomIn className="w-3 h-3 text-[#F2C14E]" /> Zoom
                    </span>
                    <span className="font-mono text-[#F2C14E] tabular-nums">{zoom.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={2.5}
                    step={0.05}
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full accent-[#D9A62E] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-[#F9F5F0] mb-0.5">
                    <span>Horizontal Position (Left / Right)</span>
                    <span className="font-mono text-[#F2C14E] tabular-nums">{panX}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={panX}
                    onChange={(e) => setPanX(parseInt(e.target.value, 10))}
                    disabled={slackFracX <= 0.001}
                    className="w-full accent-[#D9A62E] cursor-pointer disabled:opacity-40"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-[#F9F5F0] mb-0.5">
                    <span>Vertical Position (Top / Face / Bottom)</span>
                    <span className="font-mono text-[#F2C14E] tabular-nums">{panY}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={panY}
                    onChange={(e) => setPanY(parseInt(e.target.value, 10))}
                    disabled={slackFracY <= 0.001}
                    className="w-full accent-[#D9A62E] cursor-pointer disabled:opacity-40"
                  />
                </div>

                <div className="pt-1 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleApplyCrop}
                    disabled={isApplyingCrop}
                    className="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-[#D9A62E] to-[#F2C14E] hover:brightness-110 text-[#120B08] font-extrabold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    {isApplyingCrop ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : cropSavedFeedback ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Crop className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {isApplyingCrop
                        ? 'Applying...'
                        : cropSavedFeedback
                        ? 'Framing Applied!'
                        : 'Apply & Save Framing'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
