import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Box, 
  Rotate3d, 
  Layers, 
  Sparkles, 
  QrCode, 
  Sliders, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Printer, 
  Check, 
  Copy, 
  RefreshCw, 
  Maximize2, 
  Flame, 
  ThermometerSnowflake,
  PackageCheck,
  Cpu,
  Info
} from 'lucide-react';

interface PackagingStudioViewProps {
  onSendToQuote: (specsSummary: string) => void;
  onNavigateToTracking?: (trackingId: string) => void;
}

export type BoxStyle = 'rigid-magnetic' | 'sliding-drawer' | 'standup-pouch' | 'tuck-carton' | 'corrugated-shipper';

export type MaterialType = 'greyboard-artpaper' | 'recycled-kraft' | 'virgin-sbs' | 'eco-barrier-film' | 'corrugated-eflute';

export type FoilFinish = 'gold-24k' | 'maroon-qatar' | 'spot-uv' | 'blind-emboss' | 'soft-touch-matte' | 'holographic';

interface BoxPreset {
  id: BoxStyle;
  name: string;
  category: string;
  defaultL: number;
  defaultW: number;
  defaultH: number;
  description: string;
  bestFor: string;
  moq: number;
  basePriceQar: number;
  defaultMaterial: MaterialType;
  defaultFinish: FoilFinish;
}

const BOX_PRESETS: Record<BoxStyle, BoxPreset> = {
  'rigid-magnetic': {
    id: 'rigid-magnetic',
    name: 'Luxury Rigid Magnetic Box',
    category: 'Premium Luxury & Gifting',
    defaultL: 220,
    defaultW: 160,
    defaultH: 70,
    description: '1200 GSM heavy rigid greyboard with concealed neodymium magnets and custom precision EVA foam insert.',
    bestFor: 'Oud perfumes, bespoke jewelry, VIP hospitality gifts, luxury dates',
    moq: 500,
    basePriceQar: 14.5,
    defaultMaterial: 'greyboard-artpaper',
    defaultFinish: 'gold-24k'
  },
  'sliding-drawer': {
    id: 'sliding-drawer',
    name: 'Sliding Matchbox Drawer',
    category: 'Confectionery & Boutique',
    defaultL: 180,
    defaultW: 120,
    defaultH: 45,
    description: 'Smooth telescopic sliding sleeve with woven grosgrain ribbon pull and gold hot-stamped exterior sleeve.',
    bestFor: 'Artisan chocolates, saffron sets, cosmetics, luxury stationery',
    moq: 750,
    basePriceQar: 8.8,
    defaultMaterial: 'greyboard-artpaper',
    defaultFinish: 'maroon-qatar'
  },
  'standup-pouch': {
    id: 'standup-pouch',
    name: 'High-Barrier Stand-Up Pouch',
    category: 'Specialty Food & Beverage',
    defaultL: 140,
    defaultW: 80,
    defaultH: 220,
    description: 'Food-grade multi-layer barrier with one-way degassing aroma valve, resealable zip lock, and tear notches.',
    bestFor: 'Specialty Qatari roasted coffee, dry fruits, spices, organic teas',
    moq: 1000,
    basePriceQar: 3.2,
    defaultMaterial: 'eco-barrier-film',
    defaultFinish: 'spot-uv'
  },
  'tuck-carton': {
    id: 'tuck-carton',
    name: 'Reverse-Tuck Folding Carton',
    category: 'Cosmetics & Pharma',
    defaultL: 60,
    defaultW: 60,
    defaultH: 140,
    description: 'High-speed automated packaging folding carton with anti-scratch coating and tamper-evident locking flap.',
    bestFor: 'Organic skincare, perfumes, pharmaceuticals, retail dropship items',
    moq: 1000,
    basePriceQar: 2.1,
    defaultMaterial: 'virgin-sbs',
    defaultFinish: 'soft-touch-matte'
  },
  'corrugated-shipper': {
    id: 'corrugated-shipper',
    name: 'Secondary E-Flute Shipper',
    category: 'B2B & E-Commerce Logistics',
    defaultL: 320,
    defaultW: 240,
    defaultH: 160,
    description: 'Heavy-duty crush-resistant corrugated flute carton designed for local Qatar courier dispatch and regional freight.',
    bestFor: 'E-commerce subscription boxes, bulk distribution, master shippers',
    moq: 500,
    basePriceQar: 4.6,
    defaultMaterial: 'corrugated-eflute',
    defaultFinish: 'recycled-kraft' as any
  }
};

const MATERIALS: { id: MaterialType; name: string; gsm: string; eco: string }[] = [
  { id: 'greyboard-artpaper', name: '1200 GSM Rigid Greyboard + 157 GSM Art Paper', gsm: '1357 GSM', eco: 'Recyclable Core' },
  { id: 'virgin-sbs', name: '400 GSM Solid Bleached Sulfate (SBS)', gsm: '400 GSM', eco: 'FSC Certified' },
  { id: 'recycled-kraft', name: '350 GSM Unbleached Virgin Kraft Cardstock', gsm: '350 GSM', eco: '100% Biodegradable' },
  { id: 'eco-barrier-film', name: 'Tri-Layer EVOH High Barrier Foil (Compostable Option)', gsm: '120 Micron', eco: 'Food Safe ISO 22000' },
  { id: 'corrugated-eflute', name: 'Double-Wall E/B Flute Corrugated Board (3.2mm)', gsm: '550 GSM', eco: 'High Crush Strength' },
];

const FINISHES: { id: FoilFinish; name: string; badge: string; colorClass: string }[] = [
  { id: 'gold-24k', name: '24K Metallic Hot Foil Stamping', badge: 'Ultra Luxury', colorClass: 'from-amber-300 via-yellow-500 to-amber-600' },
  { id: 'maroon-qatar', name: 'Qatar Heritage Maroon Foil', badge: 'Signature Qatar', colorClass: 'from-rose-800 via-red-900 to-amber-900' },
  { id: 'spot-uv', name: 'Raised 3D Spot UV Varnish', badge: 'Tactile Contrast', colorClass: 'from-neutral-200 via-neutral-400 to-neutral-200' },
  { id: 'soft-touch-matte', name: 'Soft-Touch Velvet Matte Lamination', badge: 'Anti-Fingerprint', colorClass: 'from-neutral-800 to-neutral-900' },
  { id: 'blind-emboss', name: 'Deep Blind Embossing / Debossing', badge: 'Sculptural', colorClass: 'from-neutral-400 via-neutral-500 to-neutral-600' },
  { id: 'holographic', name: 'Prismatic Holographic Foil', badge: 'Anti-Counterfeit', colorClass: 'from-cyan-400 via-fuchsia-400 to-yellow-400' },
];

export const PackagingStudioView: React.FC<PackagingStudioViewProps> = ({
  onSendToQuote
}) => {
  const [selectedStyle, setSelectedStyle] = useState<BoxStyle>('rigid-magnetic');
  const [lengthMm, setLengthMm] = useState<number>(220);
  const [widthMm, setWidthMm] = useState<number>(160);
  const [heightMm, setHeightMm] = useState<number>(70);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialType>('greyboard-artpaper');
  const [selectedFinish, setSelectedFinish] = useState<FoilFinish>('gold-24k');
  const [boxColor, setBoxColor] = useState<string>('#171717'); // Dark minimalist default
  const [foldProgress, setFoldProgress] = useState<number>(100); // 0 = 2D die-line, 100 = 3D box
  const [rotationX, setRotationX] = useState<number>(-22);
  const [rotationY, setRotationY] = useState<number>(38);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [enableSmartQr, setEnableSmartQr] = useState<boolean>(true);
  const [enableNfcSeal, setEnableNfcSeal] = useState<boolean>(true);
  const [enableTempIndicator, setEnableTempIndicator] = useState<boolean>(true);
  const [customBrandText, setCustomBrandText] = useState<string>('NASPACK LUXURY QATAR');
  const [copiedBatch, setCopiedBatch] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'3d-builder' | 'smart-tech' | 'spec-sheet'>('3d-builder');

  // Drag interaction for 3D box
  const boxContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Handle Preset change
  const handleSelectPreset = (styleId: BoxStyle) => {
    setSelectedStyle(styleId);
    const preset = BOX_PRESETS[styleId];
    setLengthMm(preset.defaultL);
    setWidthMm(preset.defaultW);
    setHeightMm(preset.defaultH);
    setSelectedMaterial(preset.defaultMaterial);
    setSelectedFinish(preset.defaultFinish);
  };

  // Auto rotation effect
  useEffect(() => {
    if (!isAutoRotating || foldProgress < 40) return;
    const interval = setInterval(() => {
      setRotationY(prev => (prev + 0.6) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [isAutoRotating, foldProgress]);

  // Calculations
  const volumeCm3 = Math.round((lengthMm * widthMm * heightMm) / 1000);
  const volumeLiters = (volumeCm3 / 1000).toFixed(2);
  const surfaceAreaM2 = (2 * (lengthMm * widthMm + lengthMm * heightMm + widthMm * heightMm)) / 1000000;
  const estimatedGramsPerBox = Math.round(surfaceAreaM2 * 850);
  const currentPreset = BOX_PRESETS[selectedStyle];
  const unitPriceEst = (currentPreset.basePriceQar * (1 + (lengthMm * widthMm * heightMm) / (250 * 180 * 90) * 0.25)).toFixed(2);

  const smartBatchId = `NP-QC-${lengthMm}-${selectedStyle.slice(0, 3).toUpperCase()}-2026`;

  const handleCopyBatch = () => {
    navigator.clipboard.writeText(smartBatchId);
    setCopiedBatch(true);
    setTimeout(() => setCopiedBatch(false), 2000);
  };

  const handleApplyToQuote = () => {
    const summary = `${currentPreset.name} (${lengthMm}x${widthMm}x${heightMm}mm, ${selectedMaterial}, ${selectedFinish}, Smart QR: ${enableSmartQr ? 'Yes' : 'No'})`;
    onSendToQuote(summary);
  };

  // Mouse drag handlers for interactive 3D rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsAutoRotating(false);
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastMousePosRef.current.x;
    const deltaY = e.clientY - lastMousePosRef.current.y;
    setRotationY(prev => (prev + deltaX * 0.7) % 360);
    setRotationX(prev => Math.max(-80, Math.min(80, prev - deltaY * 0.5)));
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-neutral-50/60 dark:bg-neutral-950 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-200 dark:border-neutral-800 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Packaging Technology • Made in Qatar</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
              Interactive 3D Packaging Studio & Smart Tech
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base max-w-2xl">
              Simulate 3D structural folding, calculate exact volumetric capacities, test 24K hot gold foil finishes, and embed smart anti-counterfeit QR tracking for the Qatari market.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center p-1 rounded-xl bg-neutral-200/80 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800">
            <button
              onClick={() => setActiveTab('3d-builder')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === '3d-builder'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              <Rotate3d className="w-4 h-4 text-amber-500" />
              <span>3D Box Simulator</span>
            </button>
            <button
              onClick={() => setActiveTab('smart-tech')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'smart-tech'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              <Cpu className="w-4 h-4 text-amber-500" />
              <span>Smart QR & NFC Tech</span>
            </button>
            <button
              onClick={() => setActiveTab('spec-sheet')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'spec-sheet'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4 text-amber-500" />
              <span>Die-Line Specs</span>
            </button>
          </div>
        </div>

        {/* TAB 1: 3D BUILDER & FOLD SIMULATOR */}
        {activeTab === '3d-builder' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 7 Cols: Interactive 3D Canvas Viewport */}
            <div className="lg:col-span-7 space-y-4">
              <div 
                ref={boxContainerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="relative h-[480px] sm:h-[560px] rounded-3xl bg-gradient-to-b from-neutral-100 via-neutral-200 to-neutral-300 dark:from-neutral-900 dark:via-neutral-900/90 dark:to-neutral-950 border border-neutral-200 dark:border-neutral-800 overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none shadow-inner"
              >
                {/* Floating Viewport Status Tags */}
                <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 shadow-xs flex items-center gap-1.5">
                    <Box className="w-3.5 h-3.5 text-amber-500" />
                    {currentPreset.name}
                  </span>
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 backdrop-blur-md font-semibold">
                    {lengthMm} × {widthMm} × {heightMm} mm
                  </span>
                </div>

                <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                  <button
                    onClick={() => setIsAutoRotating(!isAutoRotating)}
                    className={`p-2 rounded-xl text-xs font-semibold backdrop-blur-md border transition-all cursor-pointer ${
                      isAutoRotating 
                        ? 'bg-amber-600 text-white border-amber-500 shadow-sm' 
                        : 'bg-white/90 dark:bg-neutral-800/90 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700'
                    }`}
                    title="Toggle auto orbit rotation"
                  >
                    <RefreshCw className={`w-4 h-4 ${isAutoRotating ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={() => {
                      setRotationX(-22);
                      setRotationY(38);
                    }}
                    className="p-2 rounded-xl text-xs font-semibold bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 transition-all cursor-pointer"
                    title="Reset 3D Camera"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Simulated 3D Isometric / CSS 3D Box */}
                <div 
                  className="w-full h-full flex items-center justify-center"
                  style={{ perspective: 1200 }}
                >
                  <div
                    style={{
                      transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
                      transformStyle: 'preserve-3d',
                      transition: isDraggingRef.current ? 'none' : 'transform 0.1s ease-out'
                    }}
                    className="relative transition-all duration-300 flex items-center justify-center"
                  >
                    {/* Flat CAD Die-Line View when foldProgress < 30 */}
                    {foldProgress < 30 ? (
                      <div className="w-72 sm:w-96 p-6 rounded-xl bg-neutral-900/90 border-2 border-dashed border-amber-500/60 shadow-2xl text-white font-mono text-xs space-y-4">
                        <div className="flex justify-between items-center border-b border-neutral-700 pb-2">
                          <span className="text-amber-400 font-bold">FLAT CAD DIE-LINE (0% FOLD)</span>
                          <span className="text-[10px] text-neutral-400">CUT & CREASE MATRIX</span>
                        </div>
                        <div className="h-44 border border-dashed border-neutral-600 relative flex items-center justify-center p-4 text-center">
                          <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 border-t border-amber-500/40" />
                          <div className="absolute inset-y-8 left-1/2 -translate-x-1/2 w-0.5 border-l border-amber-500/40" />
                          <div className="relative z-10 bg-neutral-950/80 px-3 py-1.5 rounded border border-neutral-700">
                            <p className="font-bold text-neutral-200">{customBrandText}</p>
                            <p className="text-[10px] text-amber-500">Bleed: +3mm | Score Line: 0.71mm</p>
                          </div>
                        </div>
                        <div className="flex justify-between text-[11px] text-neutral-400">
                          <span>Substrate: {selectedMaterial}</span>
                          <span>Grain: Machine Direction</span>
                        </div>
                      </div>
                    ) : (
                      /* 3D Assembled Box Representation */
                      <div 
                        className="relative"
                        style={{
                          width: `${Math.min(240, Math.max(160, lengthMm * 0.9))}px`,
                          height: `${Math.min(200, Math.max(120, heightMm * 1.5))}px`,
                          transformStyle: 'preserve-3d',
                          transform: `scale(${foldProgress / 100})`
                        }}
                      >
                        {/* Front Face */}
                        <div
                          className="absolute inset-0 rounded-xl p-5 flex flex-col justify-between shadow-2xl border border-white/10"
                          style={{
                            backgroundColor: boxColor,
                            transform: `translateZ(${Math.min(100, widthMm * 0.5)}px)`,
                            backfaceVisibility: 'hidden'
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500/90 font-brand">
                              NasPack Luxury
                            </span>
                            {enableSmartQr && (
                              <div className="p-1 bg-white rounded shadow-sm">
                                <QrCode className="w-5 h-5 text-neutral-950" />
                              </div>
                            )}
                          </div>

                          <div className="text-center my-auto space-y-1">
                            <div className={`font-brand font-black text-sm sm:text-base tracking-wider ${
                              selectedFinish === 'gold-24k' 
                                ? 'bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 bg-clip-text text-transparent drop-shadow-sm font-extrabold'
                                : selectedFinish === 'maroon-qatar'
                                ? 'bg-gradient-to-r from-rose-300 via-rose-500 to-red-800 bg-clip-text text-transparent drop-shadow-sm font-extrabold'
                                : selectedFinish === 'holographic'
                                ? 'bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent font-extrabold'
                                : 'text-white'
                            }`}>
                              {customBrandText}
                            </div>
                            <div className="text-[9px] uppercase tracking-widest text-neutral-400">
                              Doha • Qatar
                            </div>
                          </div>

                          <div className="flex justify-between items-end text-[9px] text-neutral-400 border-t border-neutral-800 pt-2 font-mono">
                            <span>{smartBatchId}</span>
                            <span>{volumeCm3} cc</span>
                          </div>
                        </div>

                        {/* Top Face */}
                        <div
                          className="absolute inset-x-0 top-0 rounded-xl p-4 flex items-center justify-center border border-white/10"
                          style={{
                            height: `${Math.min(120, widthMm * 0.7)}px`,
                            backgroundColor: boxColor,
                            transform: `rotateX(90deg) translateZ(${Math.min(60, (widthMm * 0.7) / 2)}px)`,
                            filter: 'brightness(1.18)',
                            backfaceVisibility: 'hidden'
                          }}
                        >
                          <div className="text-center opacity-75">
                            <div className="w-12 h-1 bg-amber-500/40 rounded-full mx-auto mb-1" />
                            <span className="text-[10px] font-mono text-neutral-400">TOP LID • MAGNETIC SEAL</span>
                          </div>
                        </div>

                        {/* Right Face */}
                        <div
                          className="absolute inset-y-0 right-0 rounded-xl p-4 flex flex-col justify-between border border-white/10"
                          style={{
                            width: `${Math.min(120, widthMm * 0.7)}px`,
                            backgroundColor: boxColor,
                            transform: `rotateY(90deg) translateZ(${Math.min(60, (widthMm * 0.7) / 2)}px)`,
                            filter: 'brightness(0.82)',
                            backfaceVisibility: 'hidden'
                          }}
                        >
                          <div className="text-[8px] font-mono text-neutral-400">ZONE 57 QA</div>
                          <div className="text-center">
                            <span className="text-[10px] font-bold text-amber-500">{lengthMm}mm</span>
                          </div>
                          <div className="text-[8px] text-right text-neutral-500">ISO 9001</div>
                        </div>

                        {/* Shadow plane beneath box */}
                        <div 
                          className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-20 rounded-full bg-black/40 blur-xl pointer-events-none"
                          style={{ transform: 'rotateX(90deg) translateZ(-60px)' }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Canvas Controls: Fold Slider & Rotation Angle */}
                <div className="absolute bottom-4 inset-x-4 z-10 p-3.5 rounded-2xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                  <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-sm">
                    <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 shrink-0">
                      Die-Line Fold:
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={foldProgress}
                      onChange={(e) => setFoldProgress(Number(e.target.value))}
                      className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                    <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 w-10 text-right">
                      {foldProgress}%
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                    <span>Drag with mouse to inspect 360°</span>
                  </div>
                </div>
              </div>

              {/* Quick Preset Selector Cards */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Select Packaging Architecture Archetype:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(Object.keys(BOX_PRESETS) as BoxStyle[]).map((styleId) => {
                    const preset = BOX_PRESETS[styleId];
                    const isSelected = selectedStyle === styleId;
                    return (
                      <button
                        key={styleId}
                        onClick={() => handleSelectPreset(styleId)}
                        className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500 text-neutral-950 dark:text-white shadow-xs'
                            : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700'
                        }`}
                      >
                        <div className="font-bold text-xs truncate">{preset.name}</div>
                        <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium truncate mt-0.5">
                          {preset.category.split('&')[0]}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Engineering Controls & Instant Calculation */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Dimensions & Substrate Card */}
              <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <div className="flex items-center gap-2 font-heading font-bold text-sm text-neutral-950 dark:text-white">
                    <Sliders className="w-4 h-4 text-amber-500" />
                    <span>Dimensions & Substrate Tuning</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    CAD Verified
                  </span>
                </div>

                {/* Length x Width x Height Sliders */}
                <div className="space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between mb-1 font-semibold text-neutral-700 dark:text-neutral-300">
                      <span>Length (X)</span>
                      <span className="font-mono text-amber-600 dark:text-amber-400">{lengthMm} mm</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="400"
                      value={lengthMm}
                      onChange={(e) => setLengthMm(Number(e.target.value))}
                      className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 font-semibold text-neutral-700 dark:text-neutral-300">
                      <span>Width (Y)</span>
                      <span className="font-mono text-amber-600 dark:text-amber-400">{widthMm} mm</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="350"
                      value={widthMm}
                      onChange={(e) => setWidthMm(Number(e.target.value))}
                      className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 font-semibold text-neutral-700 dark:text-neutral-300">
                      <span>Height / Depth (Z)</span>
                      <span className="font-mono text-amber-600 dark:text-amber-400">{heightMm} mm</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="250"
                      value={heightMm}
                      onChange={(e) => setHeightMm(Number(e.target.value))}
                      className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                  </div>
                </div>

                {/* Material Selection */}
                <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Industrial Substrate:
                  </label>
                  <select
                    value={selectedMaterial}
                    onChange={(e) => setSelectedMaterial(e.target.value as MaterialType)}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500"
                  >
                    {MATERIALS.map((mat) => (
                      <option key={mat.id} value={mat.id}>
                        {mat.name} ({mat.eco})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Finish & Foil Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Embellishment & Foil Stamping:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {FINISHES.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setSelectedFinish(f.id)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                          selectedFinish === f.id
                            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-amber-500 font-bold shadow-xs'
                            : 'bg-neutral-50 dark:bg-neutral-800/60 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${f.colorClass}`} />
                          <span className="truncate">{f.badge}</span>
                        </div>
                        <div className="text-[11px] opacity-75 truncate">{f.name.split(' ')[0]}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Box Base Shade Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Box Canvas Palette:
                  </label>
                  <div className="flex items-center gap-3">
                    {[
                      { color: '#171717', label: 'Midnight Black' },
                      { color: '#f5f5f5', label: 'Pearl White' },
                      { color: '#8a4b2a', label: 'Raw Kraft' },
                      { color: '#58111A', label: 'Qatar Burgundy' },
                      { color: '#1B3B2B', label: 'Emerald Forest' }
                    ].map((c) => (
                      <button
                        key={c.color}
                        type="button"
                        onClick={() => setBoxColor(c.color)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                          boxColor === c.color ? 'scale-110 border-amber-500' : 'border-neutral-300 dark:border-neutral-700'
                        }`}
                        style={{ backgroundColor: c.color }}
                        title={c.label}
                      />
                    ))}
                    <div className="flex-1 ml-2">
                      <input
                        type="text"
                        value={customBrandText}
                        onChange={(e) => setCustomBrandText(e.target.value)}
                        placeholder="Custom Brand Name"
                        className="w-full px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Instant Technical Metrics & Pricing Estimation */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 text-white border border-neutral-800 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <h3 className="font-heading font-bold text-sm text-neutral-200 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Real-Time Volumetric & Unit Matrix</span>
                  </h3>
                  <span className="text-[11px] font-mono text-amber-400">Doha Zone 57 Plant</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-neutral-800/60 border border-neutral-700/60">
                    <span className="text-neutral-400 block mb-0.5">Volumetric Capacity</span>
                    <span className="font-bold text-base font-mono text-white">{volumeCm3.toLocaleString()} cc</span>
                    <span className="text-[10px] text-neutral-400 block">({volumeLiters} Liters)</span>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-800/60 border border-neutral-700/60">
                    <span className="text-neutral-400 block mb-0.5">Substrate Grammage</span>
                    <span className="font-bold text-base font-mono text-white">~{estimatedGramsPerBox} g</span>
                    <span className="text-[10px] text-neutral-400 block">per unit box</span>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-800/60 border border-neutral-700/60">
                    <span className="text-neutral-400 block mb-0.5">Min Order (MOQ)</span>
                    <span className="font-bold text-base font-mono text-amber-400">{currentPreset.moq.toLocaleString()} pcs</span>
                    <span className="text-[10px] text-neutral-400 block">Contract scale</span>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-800/60 border border-neutral-700/60">
                    <span className="text-neutral-400 block mb-0.5">Est. Unit Rate</span>
                    <span className="font-bold text-base font-mono text-emerald-400">~{unitPriceEst} QAR</span>
                    <span className="text-[10px] text-neutral-400 block">ex-works Doha</span>
                  </div>
                </div>

                {/* Direct Action Button to Quote */}
                <button
                  id="transfer-studio-specs-btn"
                  onClick={handleApplyToQuote}
                  className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <span>Request Official Production Quote For These Specs</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SMART PACKAGING & ANTI-COUNTERFEITING TECH */}
        {activeTab === 'smart-tech' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-3">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Qatar Regulatory & GCC Supply Chain Ready
                  </div>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-neutral-950 dark:text-white">
                    Smart Packaging & Anti-Counterfeit Verification
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1 leading-relaxed">
                    Protect your luxury brand and comply with Qatar Ministry of Commerce standards using serialized QR batch authentication, tamper-evident digital seals, and climate-safe cold-chain thermal monitoring.
                  </p>
                </div>

                {/* Interactive Toggles */}
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/80 flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <QrCode className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-sm text-neutral-900 dark:text-white">
                          Serialized Cryptographic QR Code
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          Each individual box prints a unique scanned hash to verify authentic Qatari origin.
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setEnableSmartQr(!enableSmartQr)}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        enableSmartQr ? 'bg-amber-600' : 'bg-neutral-300 dark:bg-neutral-700'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        enableSmartQr ? 'right-1' : 'left-1'
                      }`} />
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/80 flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <Cpu className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-sm text-neutral-900 dark:text-white">
                          Tamper-Evident NFC Seal
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          Embeds high-frequency NFC tag inside the box flap that detects unauthorized opening.
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setEnableNfcSeal(!enableNfcSeal)}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        enableNfcSeal ? 'bg-amber-600' : 'bg-neutral-300 dark:bg-neutral-700'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        enableNfcSeal ? 'right-1' : 'left-1'
                      }`} />
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/80 flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <ThermometerSnowflake className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-sm text-neutral-900 dark:text-white">
                          Qatar Climate Temperature Indicator
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          Thermochromic ink changes color if package temperature surpasses 28°C in Doha summer logistics.
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setEnableTempIndicator(!enableTempIndicator)}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        enableTempIndicator ? 'bg-amber-600' : 'bg-neutral-300 dark:bg-neutral-700'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        enableTempIndicator ? 'right-1' : 'left-1'
                      }`} />
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2.5">
                  <Info className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                  <span>
                    Our cleanroom co-packaging line in Doha Zone 57 can encode over 25,000 smart units per shift, integrated directly with your ERP or warehouse logistics.
                  </span>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Live Smart Label & QR Visualizer */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 text-white border border-neutral-800 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <span className="text-xs uppercase font-mono tracking-widest text-amber-400 font-bold">
                    DIGITAL AUTHENTICATION SEAL
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Active Cryptotag
                  </span>
                </div>

                <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 text-center space-y-4">
                  {/* Generated QR Code SVG */}
                  <div className="inline-block p-4 bg-white rounded-2xl shadow-lg">
                    <svg className="w-36 h-36" viewBox="0 0 100 100">
                      <rect width="100" height="100" fill="white" />
                      {/* Stylized QR Matrix */}
                      <rect x="10" y="10" width="25" height="25" fill="#171717" />
                      <rect x="14" y="14" width="17" height="17" fill="white" />
                      <rect x="18" y="18" width="9" height="9" fill="#d97706" />

                      <rect x="65" y="10" width="25" height="25" fill="#171717" />
                      <rect x="69" y="14" width="17" height="17" fill="white" />
                      <rect x="73" y="18" width="9" height="9" fill="#d97706" />

                      <rect x="10" y="65" width="25" height="25" fill="#171717" />
                      <rect x="14" y="69" width="17" height="17" fill="white" />
                      <rect x="18" y="73" width="9" height="9" fill="#d97706" />

                      {/* Random aesthetic QR bits */}
                      <rect x="42" y="12" width="6" height="6" fill="#171717" />
                      <rect x="52" y="18" width="6" height="12" fill="#171717" />
                      <rect x="42" y="28" width="16" height="6" fill="#171717" />
                      <rect x="42" y="42" width="16" height="16" fill="#d97706" />
                      <rect x="15" y="42" width="8" height="14" fill="#171717" />
                      <rect x="70" y="42" width="12" height="8" fill="#171717" />
                      <rect x="65" y="60" width="8" height="20" fill="#171717" />
                      <rect x="80" y="75" width="10" height="12" fill="#171717" />
                      <rect x="45" y="70" width="12" height="18" fill="#171717" />
                    </svg>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs font-mono font-bold text-neutral-300">
                      Scan URL: qa.naspack.track/{smartBatchId}
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      Direct verification on customer smartphones without an app.
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-center gap-2">
                    <button
                      onClick={handleCopyBatch}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer text-neutral-300"
                    >
                      {copiedBatch ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedBatch ? 'Copied' : smartBatchId}</span>
                    </button>
                  </div>
                </div>

                {/* Features list */}
                <div className="space-y-2 text-xs text-neutral-400">
                  <div className="flex items-center justify-between py-1 border-b border-neutral-800">
                    <span>Tamper Status:</span>
                    <span className="font-bold text-emerald-400">SEALED (Factory Origin)</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-neutral-800">
                    <span>Thermal Log:</span>
                    <span className="font-bold text-white">21.4°C (Compliant &lt; 28°C)</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span>Co-Packaging Line:</span>
                    <span className="font-bold text-white">Zone 57 Cleanroom ISO-8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DIE-LINE TECHNICAL SPEC SHEET */}
        {activeTab === 'spec-sheet' && (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <div>
                <h3 className="font-heading text-xl font-bold text-neutral-950 dark:text-white">
                  CAD Die-Line Technical Specification
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Production ready template data for die-maker and offset printing press
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-amber-500" />
                <span>Print Spec Sheet</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/80">
                <span className="text-[11px] text-neutral-500 block mb-1">Structural Style</span>
                <span className="font-bold text-sm text-neutral-900 dark:text-white">{currentPreset.name}</span>
              </div>
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/80">
                <span className="text-[11px] text-neutral-500 block mb-1">Dimensions (L × W × H)</span>
                <span className="font-bold font-mono text-sm text-neutral-900 dark:text-white">{lengthMm} × {widthMm} × {heightMm} mm</span>
              </div>
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/80">
                <span className="text-[11px] text-neutral-500 block mb-1">Substrate Grammage</span>
                <span className="font-bold text-sm text-neutral-900 dark:text-white">{selectedMaterial}</span>
              </div>
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/80">
                <span className="text-[11px] text-neutral-500 block mb-1">Foil Embellishment</span>
                <span className="font-bold text-sm text-neutral-900 dark:text-white">{selectedFinish}</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900 text-white font-mono text-xs space-y-2">
              <div className="text-amber-400 font-bold border-b border-neutral-800 pb-1">
                MACHINE PROFILE & TOOLING MATRIX (NASPACK DOHA)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1 text-neutral-300">
                <div>Cut Rule Height: 23.80 mm</div>
                <div>Crease Channel: 0.71 × 2.1 mm</div>
                <div>Offset Press: Heidelberg XL 106</div>
                <div>Hot Foil Stamping: Bobst BMA Line</div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleApplyToQuote}
                className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>Submit Technical Specs to Quotation Desk</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
