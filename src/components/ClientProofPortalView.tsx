import React, { useState, useRef, useEffect } from 'react';
import { Order, ClientProof, ProofAnnotation } from '../types';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  Search, 
  PenTool, 
  Eye, 
  Layers, 
  Maximize2, 
  Minimize2, 
  Download, 
  Printer, 
  Check, 
  X, 
  MessageSquare, 
  ArrowRight, 
  Info, 
  Building2, 
  User, 
  Calendar, 
  ChevronRight, 
  Hash, 
  RefreshCw, 
  Trash2, 
  FileCheck, 
  ExternalLink 
} from 'lucide-react';

interface ClientProofPortalViewProps {
  orders: Order[];
  initialTrackingNumber?: string;
  onSaveProofSignOff: (
    trackingNumber: string,
    payload: {
      signedBy: string;
      jobTitle: string;
      company: string;
      email: string;
      signatureDataUrl: string;
      notes?: string;
    }
  ) => Promise<{ success: boolean; certificateId: string; order: Order }>;
  onRequestRevisions: (
    trackingNumber: string,
    payload: {
      requestedBy: string;
      feedback: string;
      annotations: ProofAnnotation[];
    }
  ) => Promise<{ success: boolean; order: Order }>;
  onNavigateToTracking: (trackingNumber: string) => void;
  onNavigateToContact: () => void;
}

export const ClientProofPortalView: React.FC<ClientProofPortalViewProps> = ({
  orders,
  initialTrackingNumber = 'NP-QA-8941',
  onSaveProofSignOff,
  onRequestRevisions,
  onNavigateToTracking,
  onNavigateToContact
}) => {
  const [searchQuery, setSearchQuery] = useState(initialTrackingNumber);
  const [selectedTracking, setSelectedTracking] = useState(initialTrackingNumber);

  // Active order
  const currentOrder = orders.find(
    (o) => o.trackingNumber.toLowerCase().replace(/\s+/g, '') === selectedTracking.toLowerCase().replace(/\s+/g, '')
  ) || orders[0];

  // View mode for proof image
  const [viewMode, setViewMode] = useState<'artwork' | 'dieline' | 'render3d'>('artwork');
  
  // Annotation state
  const [isPinModeActive, setIsPinModeActive] = useState(false);
  const [activeAnnotations, setActiveAnnotations] = useState<ProofAnnotation[]>(
    currentOrder?.proof?.annotations || []
  );
  const [pendingPinCoords, setPendingPinCoords] = useState<{ x: number; y: number } | null>(null);
  const [newPinText, setNewPinText] = useState('');
  const [newPinAuthor, setNewPinAuthor] = useState('');

  // Sign-off modal & form state
  const [isSignOffModalOpen, setIsSignOffModalOpen] = useState(false);
  const [isRevisionsModalOpen, setIsRevisionsModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Sign-off form inputs
  const [signerName, setSignerName] = useState(currentOrder?.customerName || '');
  const [signerTitle, setSignerTitle] = useState('Brand & Packaging Director');
  const [signerCompany, setSignerCompany] = useState(currentOrder?.company || '');
  const [signerEmail, setSignerEmail] = useState(currentOrder?.email || '');
  const [signerNotes, setSignerNotes] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Signature pad state
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type'>('draw');
  const [typedSignature, setTypedSignature] = useState(currentOrder?.customerName || '');
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Revision Form state
  const [revisionFeedback, setRevisionFeedback] = useState('');
  const [revisionAuthor, setRevisionAuthor] = useState(currentOrder?.customerName || '');

  // Fullscreen preview
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);

  // Sync annotations when active order changes
  useEffect(() => {
    if (currentOrder) {
      setActiveAnnotations(currentOrder.proof?.annotations || []);
      setSignerName(currentOrder.customerName || '');
      setSignerCompany(currentOrder.company || '');
      setSignerEmail(currentOrder.email || '');
      setTypedSignature(currentOrder.customerName || '');
      setRevisionAuthor(currentOrder.customerName || '');
      // If proof has dieline or render3d, reset viewMode to artwork
      setViewMode('artwork');
    }
  }, [currentOrder?.trackingNumber]);

  // Handle Canvas Drawing
  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a';
    setIsDrawing(true);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const getSignatureDataUrl = (): string => {
    if (signatureMode === 'draw' && canvasRef.current && hasDrawn) {
      return canvasRef.current.toDataURL('image/png');
    } else if (signatureMode === 'type' && typedSignature.trim()) {
      // Create SVG script representation
      const encoded = encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="300" height="80">
          <text x="20" y="50" font-family="'Brush Script MT', cursive, sans-serif" font-size="34" fill="#0f172a">
            ${typedSignature.trim()}
          </text>
        </svg>
      `);
      return `data:image/svg+xml;utf8,${encoded}`;
    }
    return '';
  };

  // Click on Proof image to drop a pin
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPinModeActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPendingPinCoords({
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10
    });
  };

  const handleSaveNewPin = () => {
    if (!pendingPinCoords || !newPinText.trim()) return;

    const newAnnotation: ProofAnnotation = {
      id: `pin-${Date.now()}`,
      xPercent: pendingPinCoords.x,
      yPercent: pendingPinCoords.y,
      note: newPinText.trim(),
      author: newPinAuthor.trim() || currentOrder?.customerName || 'Client Reviewer',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'pending'
    };

    setActiveAnnotations(prev => [...prev, newAnnotation]);
    setPendingPinCoords(null);
    setNewPinText('');
    setIsPinModeActive(false);
  };

  const handleDeleteAnnotation = (id: string) => {
    setActiveAnnotations(prev => prev.filter(p => p.id !== id));
  };

  // Submit Approval Sign-Off
  const handleConfirmSignOff = async () => {
    if (!currentOrder || !agreedToTerms) return;
    const sigData = getSignatureDataUrl();
    if (!sigData) {
      alert('Please provide a signature (draw or type) before authorizing press run.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await onSaveProofSignOff(currentOrder.trackingNumber, {
        signedBy: signerName.trim() || currentOrder.customerName,
        jobTitle: signerTitle.trim() || 'Director',
        company: signerCompany.trim() || currentOrder.company,
        email: signerEmail.trim() || currentOrder.email,
        signatureDataUrl: sigData,
        notes: signerNotes.trim()
      });

      if (res.success) {
        setIsSignOffModalOpen(false);
        setActionSuccessMessage(`Order ${currentOrder.trackingNumber} proof approved! Certificate: ${res.certificateId}`);
        setIsCertificateModalOpen(true);
      }
    } catch (err) {
      console.error(err);
      alert('Could not submit sign-off. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Revision Feedback
  const handleConfirmRevisions = async () => {
    if (!currentOrder || !revisionFeedback.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await onRequestRevisions(currentOrder.trackingNumber, {
        requestedBy: revisionAuthor.trim() || currentOrder.customerName,
        feedback: revisionFeedback.trim(),
        annotations: activeAnnotations
      });

      if (res.success) {
        setIsRevisionsModalOpen(false);
        setRevisionFeedback('');
        setActionSuccessMessage(`Pre-Press team notified! Revisions logged for ${currentOrder.trackingNumber}.`);
      }
    } catch (err) {
      console.error(err);
      alert('Could not submit revisions. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Active Proof Image source based on viewMode
  const proof = currentOrder?.proof;
  const activeImage = (() => {
    if (!proof) return 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1400&q=85';
    if (viewMode === 'dieline') return proof.dielineImageUrl || proof.artworkImageUrl;
    if (viewMode === 'render3d') return proof.rendering3dUrl || proof.artworkImageUrl;
    return proof.artworkImageUrl;
  })();

  const isApproved = proof?.status === 'approved';
  const isRevisions = proof?.status === 'revisions_requested';

  return (
    <div className="w-full bg-neutral-50 dark:bg-neutral-950 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title & Breadcrumb */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Pre-Press CAD & Artwork Digital Sign-Off
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
              Interactive Client Proof Portal
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl">
              Inspect your precision die-line cuts, CMYK/Pantone color balances, and luxury foil embellishments. Drop revision pins or authorize with a legal digital signature for immediate press release in Doha Zone 57.
            </p>
          </div>

          {/* Quick Tracking Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedTracking(searchQuery.trim())}
                placeholder="Enter NP-QA-XXXX..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs font-mono text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <button
              onClick={() => setSelectedTracking(searchQuery.trim())}
              className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-bold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              Load Proof
            </button>
          </div>
        </div>

        {/* Demo Quick Selectors Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs text-neutral-500 dark:text-neutral-400 scrollbar-none">
          <span className="font-semibold whitespace-nowrap">Demo Projects in Qatar:</span>
          {orders.map((o) => (
            <button
              key={o.trackingNumber}
              onClick={() => {
                setSelectedTracking(o.trackingNumber);
                setSearchQuery(o.trackingNumber);
              }}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                currentOrder?.trackingNumber === o.trackingNumber
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                  : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-amber-400'
              }`}
            >
              <span>{o.trackingNumber}</span>
              <span className="opacity-60 text-[10px]">({o.company.split(' ')[0]})</span>
              {o.proof?.status === 'approved' && <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
              {o.proof?.status === 'revisions_requested' && <Clock className="w-3 h-3 text-rose-500" />}
            </button>
          ))}
        </div>

        {/* Action Success Alert Notification */}
        {actionSuccessMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-medium">{actionSuccessMessage}</span>
            </div>
            <button
              onClick={() => setActionSuccessMessage(null)}
              className="text-emerald-700 dark:text-emerald-300 hover:opacity-75 cursor-pointer ml-3"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Order & Proof Header Bar */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <FileCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-extrabold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                  {currentOrder.trackingNumber}
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  {proof?.version || 'v1.0 Production Proof'}
                </span>
                
                {/* Status Badge */}
                {isApproved ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approved & Released for Press Run
                  </span>
                ) : isRevisions ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300 border border-rose-300 dark:border-rose-700">
                    <Clock className="w-3.5 h-3.5" />
                    Revisions Requested (In Pre-Press)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Pending Client Sign-Off
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                {currentOrder.items[0]?.name || 'Custom Packaging Production Run'}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Client: <span className="font-medium text-neutral-800 dark:text-neutral-200">{currentOrder.customerName}</span> ({currentOrder.company}) • Destination: {currentOrder.destinationCity}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            {isApproved ? (
              <button
                onClick={() => setIsCertificateModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                View Digital Certificate
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsRevisionsModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-750 text-neutral-800 dark:text-neutral-200 font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-rose-500" />
                  Request Revisions
                </button>
                <button
                  onClick={() => setIsSignOffModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <PenTool className="w-4 h-4" />
                  Approve & Sign Off Proof
                </button>
              </>
            )}

            <button
              onClick={() => onNavigateToTracking(currentOrder.trackingNumber)}
              className="px-3 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Track Production & Logistics"
            >
              <span>Track Order</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Main Grid: Interactive Proof Canvas + Specifications Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Interactive Proof Viewer (7 cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Toolbar for the Proof Canvas */}
            <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              
              {/* Layer / View Toggles */}
              <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('artwork')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'artwork'
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-bold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Finished Artwork & Foil</span>
                </button>
                <button
                  onClick={() => setViewMode('dieline')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'dieline'
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-bold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>CAD Structural Die-Line</span>
                </button>
                <button
                  onClick={() => setViewMode('render3d')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'render3d'
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-bold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>3D Realistic Render</span>
                </button>
              </div>

              {/* Pin Annotation Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsPinModeActive(!isPinModeActive);
                    setPendingPinCoords(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isPinModeActive
                      ? 'bg-rose-500 text-white shadow-sm ring-2 ring-rose-300 dark:ring-rose-900'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                  title="Click anywhere on the proof image to drop a revision note"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>{isPinModeActive ? 'Click on Proof to Pin Note' : 'Add Revision Pin'}</span>
                </button>

                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
                  title="Toggle Fullscreen"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Interactive Proof Canvas Container */}
            <div 
              ref={imageContainerRef}
              className={`relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-900 select-none shadow-md transition-all ${
                isFullscreen ? 'fixed inset-4 z-50 rounded-2xl shadow-2xl flex items-center justify-center bg-black/95' : 'aspect-4/3'
              }`}
            >
              {/* Proof Image */}
              <div 
                onClick={handleImageClick}
                className={`w-full h-full relative cursor-${isPinModeActive ? 'crosshair' : 'default'}`}
              >
                <img
                  src={activeImage}
                  alt={currentOrder.items[0]?.name || 'Packaging proof'}
                  className="w-full h-full object-contain pointer-events-none"
                />

                {/* Die-Line Technical Overlay grid if in dieline mode */}
                {viewMode === 'dieline' && (
                  <div className="absolute inset-0 pointer-events-none border border-cyan-500/30">
                    <div className="absolute top-4 left-4 bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono px-2.5 py-1 rounded backdrop-blur-xs space-y-0.5">
                      <div>CAD CUT TOLERANCE: ±0.25mm</div>
                      <div>BLEED ZONE: 3.0mm (RED DASH)</div>
                      <div>CREASE RULE: 2pt SCORE (BLUE)</div>
                    </div>
                  </div>
                )}

                {/* Rendered Existing Pin Markers */}
                {activeAnnotations.map((pin, idx) => (
                  <div
                    key={pin.id}
                    style={{ left: `${pin.xPercent}%`, top: `${pin.yPercent}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group z-20"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="w-7 h-7 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center shadow-lg border-2 border-white dark:border-neutral-900 cursor-pointer transform hover:scale-115 transition-transform animate-pulse">
                      {idx + 1}
                    </div>

                    {/* Tooltip on Hover */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden group-hover:block w-56 p-3 rounded-xl bg-neutral-950/95 text-white border border-neutral-700 shadow-xl text-xs z-30 pointer-events-none backdrop-blur-md">
                      <div className="flex items-center justify-between font-bold text-rose-400 mb-1">
                        <span>Pin #{idx + 1}</span>
                        <span className="text-[10px] text-neutral-400 font-normal">{pin.createdAt}</span>
                      </div>
                      <p className="text-neutral-200 text-xs leading-relaxed">{pin.note}</p>
                      <div className="mt-1.5 text-[10px] text-neutral-400 italic">By: {pin.author}</div>
                    </div>
                  </div>
                ))}

                {/* Pending New Pin Drop Popover */}
                {pendingPinCoords && (
                  <div
                    style={{ left: `${pendingPinCoords.x}%`, top: `${pendingPinCoords.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="w-7 h-7 rounded-full bg-amber-500 text-neutral-950 font-black text-xs flex items-center justify-center shadow-lg border-2 border-white ring-4 ring-amber-500/30 animate-bounce">
                      +
                    </div>
                    
                    {/* Popover Form */}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 w-64 p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 shadow-2xl text-xs space-y-2.5 z-40">
                      <div className="font-bold text-neutral-900 dark:text-white flex items-center justify-between">
                        <span>Add Revision Note</span>
                        <button 
                          onClick={() => setPendingPinCoords(null)}
                          className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <textarea
                        value={newPinText}
                        onChange={(e) => setNewPinText(e.target.value)}
                        placeholder="e.g. Move foil logo 2mm left; check Arabic typography kerning..."
                        rows={3}
                        className="w-full p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={newPinAuthor}
                        onChange={(e) => setNewPinAuthor(e.target.value)}
                        placeholder="Your name or title"
                        className="w-full p-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => setPendingPinCoords(null)}
                          className="px-2.5 py-1 rounded-md text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 text-xs font-medium cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveNewPin}
                          disabled={!newPinText.trim()}
                          className="px-3 py-1 rounded-md bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-xs disabled:opacity-50 cursor-pointer"
                        >
                          Place Pin
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Close fullscreen button */}
              {isFullscreen && (
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-neutral-900/80 text-white hover:bg-neutral-800 cursor-pointer z-40"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Pin Annotations List Panel */}
            <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                    Client Pin Annotations ({activeAnnotations.length})
                  </span>
                </div>
                {activeAnnotations.length > 0 && !isApproved && (
                  <span className="text-[11px] text-neutral-400">Click pin to review position</span>
                )}
              </div>

              {activeAnnotations.length === 0 ? (
                <p className="text-xs text-neutral-500 dark:text-neutral-400 italic py-2">
                  No revision pins placed yet. Turn on <span className="font-semibold text-rose-500">"Add Revision Pin"</span> above to highlight specific packaging areas that require adjustments.
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {activeAnnotations.map((pin, idx) => (
                    <div
                      key={pin.id}
                      className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-750 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-neutral-900 dark:text-neutral-100 leading-snug">{pin.note}</p>
                          <p className="text-[10px] text-neutral-400 mt-1">
                            By {pin.author} • {pin.createdAt} • Position: ({pin.xPercent}%, {pin.yPercent}%)
                          </p>
                        </div>
                      </div>
                      {!isApproved && (
                        <button
                          onClick={() => handleDeleteAnnotation(pin.id)}
                          className="text-neutral-400 hover:text-rose-500 p-1 cursor-pointer"
                          title="Remove pin"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Pre-Press Technical Specifications (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Technical Verification Checklist */}
            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <FileCheck className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                  Pre-Press Spec Verification
                </h3>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* Dimensions */}
                <div>
                  <span className="text-neutral-400 block text-[11px] uppercase tracking-wider font-semibold">Cavity & Box Dimensions</span>
                  <div className="font-mono text-neutral-900 dark:text-white font-bold mt-0.5">
                    {proof?.dimensions || '160mm (L) x 160mm (W) x 65mm (H)'}
                  </div>
                </div>

                {/* Substrate */}
                <div>
                  <span className="text-neutral-400 block text-[11px] uppercase tracking-wider font-semibold">Substrate & Board Weight</span>
                  <div className="text-neutral-800 dark:text-neutral-200 font-medium mt-0.5">
                    {proof?.substrate || '1400gsm Grade-A Dutch Greyboard + 157gsm Art Wrap'}
                  </div>
                </div>

                {/* Color Reproduction */}
                <div>
                  <span className="text-neutral-400 block text-[11px] uppercase tracking-wider font-semibold">Color Matching System</span>
                  <div className="text-neutral-800 dark:text-neutral-200 font-medium mt-0.5 space-y-1">
                    <div>{proof?.colorSpecs.cmyk || 'CMYK Euroscale Process'}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(proof?.colorSpecs.pantone || ['Pantone 871 C Gold']).map((p, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-mono text-[10px] font-bold">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Luxury Finishing Effects */}
                <div>
                  <span className="text-neutral-400 block text-[11px] uppercase tracking-wider font-semibold">Finishing & Embellishments</span>
                  <ul className="mt-1 space-y-1">
                    {(proof?.colorSpecs.finishingEffects || [
                      'Kurz Luxor 24k Gold Hot Foil',
                      'Soft-Touch Velvet Matte Scratch-Resistant Film'
                    ]).map((effect, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
                        <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                        <span>{effect}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pre-Press CAD Parameters */}
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 dark:text-neutral-400">Bleed Allowance:</span>
                    <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">{proof?.bleed || '3.0 mm'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 dark:text-neutral-400">Cutting Tolerance:</span>
                    <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">{proof?.tolerance || '±0.25 mm'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 dark:text-neutral-400">GCC Barcode Verified:</span>
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                      <Check className="w-3 h-3" />
                      Compliant (Grade A)
                    </span>
                  </div>
                </div>

                {/* Pre-Press Engineer Notes */}
                {proof?.notesFromPrePress && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-neutral-800 dark:text-neutral-200">
                    <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold text-[11px] mb-1">
                      <Info className="w-3.5 h-3.5" />
                      <span>Note from NasPack Pre-Press Lab</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-neutral-600 dark:text-neutral-300">
                      {proof.notesFromPrePress}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sign-Off Status / Digital Authorization Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                    Sign-Off Status
                  </h3>
                </div>
                {isApproved && (
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    LOCKED & READY
                  </span>
                )}
              </div>

              {isApproved && proof?.signOff ? (
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-2">
                    <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
                      <span>Authorized By:</span>
                      <span className="font-mono text-[10px]">{proof.signOff.signedAt}</span>
                    </div>
                    <div className="text-neutral-800 dark:text-neutral-100 font-semibold text-sm">
                      {proof.signOff.signedBy}
                    </div>
                    <div className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                      {proof.signOff.jobTitle} • {proof.signOff.company}
                    </div>
                    <div className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 pt-1 border-t border-emerald-200 dark:border-emerald-900">
                      Cert ID: {proof.signOff.approvalCertificateId}
                    </div>
                  </div>

                  {/* Signature Image Preview */}
                  {proof.signOff.signatureDataUrl && (
                    <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-center">
                      <span className="text-[10px] text-neutral-400 block mb-1 uppercase tracking-wider">Digital Signature Stamp</span>
                      <img
                        src={proof.signOff.signatureDataUrl}
                        alt="Client Signature"
                        className="h-12 max-w-full mx-auto object-contain dark:invert"
                      />
                    </div>
                  )}

                  <button
                    onClick={() => setIsCertificateModalOpen(true)}
                    className="w-full py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold text-xs hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Open Certificate & Print Spec Sheet
                  </button>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed">
                    By signing this digital proof, you confirm that artwork dimensions, die-lines, and finishing embellishments have been inspected and authorized for printing on Heidelberg Speedmaster and Kongsberg die-cutters in Doha.
                  </p>

                  <div className="space-y-2">
                    <button
                      onClick={() => setIsSignOffModalOpen(true)}
                      className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <PenTool className="w-4 h-4" />
                      Sign Proof & Authorize Production
                    </button>
                    <button
                      onClick={() => setIsRevisionsModalOpen(true)}
                      className="w-full py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-rose-500" />
                      Request Pre-Press Changes
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Assistance card */}
            <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 flex items-center justify-between">
              <span>Need engineering assistance in Doha?</span>
              <a
                href="https://wa.me/97477315415?text=Hello%20NasPack%20Pre-Press%20team%2C%20I%20have%20a%20question%20regarding%20proof%20approval."
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
              >
                <span>WhatsApp 77315415</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* DIGITAL SIGN-OFF & APPROVAL MODAL */}
      {/* ============================================================ */}
      {isSignOffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden my-8">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-amber-500/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-neutral-950 flex items-center justify-center font-bold">
                  <PenTool className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    Digital Pre-Press Sign-Off
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Order: <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">{currentOrder?.trackingNumber}</span> • {currentOrder?.company}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSignOffModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              
              {/* Review Summary */}
              <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700 space-y-1">
                <div className="font-bold text-neutral-900 dark:text-white">
                  Approving: {currentOrder?.items[0]?.name}
                </div>
                <div className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                  Specs: {currentOrder?.packagingSpecs.boxStyle} • {currentOrder?.packagingSpecs.material}
                </div>
                <div className="text-amber-600 dark:text-amber-400 font-mono text-[11px]">
                  Proof Version: {proof?.version || 'v1.4 Master Proof'}
                </div>
              </div>

              {/* Form Inputs: Name, Title, Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300">Authorized Legal Name *</label>
                  <input
                    type="text"
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                    placeholder="e.g. Sheikh Tariq Al-Thani"
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300">Job Title / Role *</label>
                  <input
                    type="text"
                    value={signerTitle}
                    onChange={(e) => setSignerTitle(e.target.value)}
                    placeholder="e.g. Creative Director / Brand Lead"
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300">Company Name *</label>
                  <input
                    type="text"
                    value={signerCompany}
                    onChange={(e) => setSignerCompany(e.target.value)}
                    placeholder="e.g. Al Noor Parfums Qatar"
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300">Work Email *</label>
                  <input
                    type="email"
                    value={signerEmail}
                    onChange={(e) => setSignerEmail(e.target.value)}
                    placeholder="e.g. director@company.qa"
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Signature Pad Mode Switcher */}
              <div className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300">
                    Digital Signature *
                  </label>
                  <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg text-[11px]">
                    <button
                      type="button"
                      onClick={() => setSignatureMode('draw')}
                      className={`px-2 py-0.5 rounded ${signatureMode === 'draw' ? 'bg-white dark:bg-neutral-900 font-bold text-neutral-950 dark:text-white shadow-xs' : 'text-neutral-500'}`}
                    >
                      Draw with Finger/Mouse
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignatureMode('type')}
                      className={`px-2 py-0.5 rounded ${signatureMode === 'type' ? 'bg-white dark:bg-neutral-900 font-bold text-neutral-950 dark:text-white shadow-xs' : 'text-neutral-500'}`}
                    >
                      Type Signature
                    </button>
                  </div>
                </div>

                {signatureMode === 'draw' ? (
                  <div className="space-y-1.5">
                    <div className="relative border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-100 overflow-hidden">
                      <canvas
                        ref={canvasRef}
                        width={500}
                        height={120}
                        onPointerDown={startDrawing}
                        onPointerMove={draw}
                        onPointerUp={stopDrawing}
                        onPointerLeave={stopDrawing}
                        className="w-full h-[120px] touch-none cursor-crosshair"
                      />
                      {!hasDrawn && (
                        <div className="absolute inset-0 flex items-center justify-center text-neutral-400 pointer-events-none text-xs">
                          Sign with finger, stylus, or mouse here
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={clearCanvas}
                        className="text-[11px] text-neutral-500 hover:text-rose-500 transition-colors cursor-pointer"
                      >
                        Clear Signature
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={typedSignature}
                      onChange={(e) => setTypedSignature(e.target.value)}
                      placeholder="Type your full name to generate digital signature"
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                    {typedSignature && (
                      <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-center">
                        <span className="font-serif italic text-2xl text-neutral-900 dark:text-neutral-100 tracking-wider">
                          {typedSignature}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Approval Notes (Optional) */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300">
                  Production Instructions / Batch Notes (Optional)
                </label>
                <textarea
                  value={signerNotes}
                  onChange={(e) => setSignerNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. Please send 10 advance sample copies to Lusail Marina office prior to bulk dispatch."
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Legal Terms Checkbox */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 rounded text-amber-500 focus:ring-amber-400"
                />
                <span className="text-[11px] text-neutral-600 dark:text-neutral-300 leading-snug">
                  I confirm that I have reviewed the structural CAD die-lines, CMYK/Pantone separations, foil stamping placements, and typography. I authorize NasPack Qatar to proceed with die-board tooling, offset/gravure printing plates, and the full manufacturing run.
                </span>
              </label>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-850">
              <button
                type="button"
                onClick={() => setIsSignOffModalOpen(false)}
                className="px-4 py-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSignOff}
                disabled={isSubmitting || !agreedToTerms || (!hasDrawn && !typedSignature.trim())}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Authorizing Press Run...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authorize & Issue Digital Certificate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* REQUEST REVISIONS MODAL */}
      {/* ============================================================ */}
      {isRevisionsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-8">
            
            <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-rose-500/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    Submit Pre-Press Revisions
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Order: <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">{currentOrder?.trackingNumber}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsRevisionsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Describe the modifications required for your packaging. Our structural engineers and pre-press design team in Doha Zone 57 will update the proof and issue a new revision version within 24 hours.
              </p>

              {activeAnnotations.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-neutral-800 dark:text-neutral-200 text-xs flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>{activeAnnotations.length} revision pin(s)</strong> attached from your inspection will be submitted along with this feedback.
                  </span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300">Your Name & Title *</label>
                <input
                  type="text"
                  value={revisionAuthor}
                  onChange={(e) => setRevisionAuthor(e.target.value)}
                  placeholder="e.g. Fatima Al-Mansoor (Brand Director)"
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300">Revision Details & Adjustment Request *</label>
                <textarea
                  value={revisionFeedback}
                  onChange={(e) => setRevisionFeedback(e.target.value)}
                  rows={4}
                  placeholder="e.g. Please shift the hot foil Arabic crest 3mm higher on the front face. Verify that the spine crease does not overlap the typography. Request test swatch for Pantone 871 C."
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-850">
              <button
                type="button"
                onClick={() => setIsRevisionsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRevisions}
                disabled={isSubmitting || !revisionFeedback.trim()}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Submitting to Pre-Press...</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4" />
                    <span>Submit Revisions to Engineering</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* DIGITAL APPROVAL CERTIFICATE MODAL */}
      {/* ============================================================ */}
      {isCertificateModalOpen && proof?.signOff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
          <div className="bg-white text-neutral-900 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8 border-4 border-double border-amber-500/40 print:border-none print:shadow-none">
            
            {/* Certificate Header Banner */}
            <div className="p-6 bg-neutral-950 text-white flex items-center justify-between border-b-2 border-amber-500">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500 text-neutral-950 font-black text-xl flex items-center justify-center">
                  NP
                </div>
                <div>
                  <h2 className="text-lg font-black tracking-tight font-serif uppercase">
                    NasPack Packaging Qatar
                  </h2>
                  <p className="text-[11px] text-amber-400 font-mono">
                    Pre-Press & Plate Release Official Certificate
                  </p>
                </div>
              </div>
              <div className="text-right font-mono text-[10px] text-neutral-400">
                <div>Doha Zone 57</div>
                <div>Industrial Production Hub</div>
              </div>
            </div>

            {/* Certificate Content */}
            <div className="p-8 space-y-6 text-neutral-900">
              
              <div className="text-center space-y-1 border-b border-neutral-200 pb-4">
                <div className="text-[11px] font-bold uppercase tracking-widest text-amber-700">
                  Digital Certificate of Approval & Authorization
                </div>
                <h1 className="text-2xl font-serif font-black text-neutral-950">
                  Certificate of Pre-Press Sign-Off
                </h1>
                <p className="text-xs text-neutral-600 font-mono">
                  Certificate ID: <strong className="text-neutral-950">{proof.signOff.approvalCertificateId}</strong>
                </p>
              </div>

              {/* Order & Specifications Block */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                  <span className="text-neutral-500 text-[10px] uppercase tracking-wider font-semibold">Client Organization</span>
                  <div className="font-bold text-sm text-neutral-950">{proof.signOff.company}</div>
                  <div className="text-neutral-600">{currentOrder?.customerName}</div>
                  <div className="text-neutral-500 text-[11px]">Tracking: {currentOrder?.trackingNumber}</div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                  <span className="text-neutral-500 text-[10px] uppercase tracking-wider font-semibold">Authorized Batch Run</span>
                  <div className="font-bold text-sm text-neutral-950">{currentOrder?.items[0]?.name}</div>
                  <div className="text-neutral-600">{currentOrder?.packagingSpecs.boxStyle}</div>
                  <div className="text-amber-700 font-mono text-[11px] font-bold">Proof Version: {proof.version}</div>
                </div>
              </div>

              {/* Verified Technical Standards */}
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-2">
                <div className="font-bold text-neutral-950 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified Press Parameters Released for Production:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-neutral-700">
                  <div>• Substrate: {proof.substrate.split('+')[0]}</div>
                  <div>• Tolerance: {proof.tolerance}</div>
                  <div>• Bleed: {proof.bleed}</div>
                  <div>• Hot Foil: 24k Kurz Luxor</div>
                  <div>• Spec Check: Passed (Doha Lab)</div>
                  <div>• GCC Barcode: Verified A</div>
                </div>
              </div>

              {/* Digital Signature Presentation */}
              <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold block">Signed & Authorized by</span>
                  <div className="font-bold text-neutral-950 text-sm">{proof.signOff.signedBy}</div>
                  <div className="text-neutral-600 text-[11px]">{proof.signOff.jobTitle} • {proof.signOff.company}</div>
                  <div className="text-neutral-500 text-[10px] font-mono">{proof.signOff.signedAt}</div>
                </div>

                <div className="p-3 bg-neutral-100 rounded-xl border border-neutral-300 text-center min-w-[180px]">
                  <span className="text-[9px] text-neutral-400 block uppercase tracking-wider">Digital Hash Verified</span>
                  {proof.signOff.signatureDataUrl ? (
                    <img
                      src={proof.signOff.signatureDataUrl}
                      alt="Digital signature"
                      className="h-10 mx-auto object-contain my-1"
                    />
                  ) : (
                    <span className="font-serif italic text-lg text-neutral-900">{proof.signOff.signedBy}</span>
                  )}
                  <span className="text-[9px] text-emerald-700 font-mono font-bold block">
                    ✓ Doha Zone 57 Verified
                  </span>
                </div>
              </div>

            </div>

            {/* Modal Controls */}
            <div className="p-4 bg-neutral-100 border-t border-neutral-200 flex items-center justify-between print:hidden">
              <button
                type="button"
                onClick={() => setIsCertificateModalOpen(false)}
                className="px-4 py-2 rounded-xl text-neutral-600 hover:text-neutral-900 font-semibold text-xs cursor-pointer"
              >
                Close Window
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Certificate</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
