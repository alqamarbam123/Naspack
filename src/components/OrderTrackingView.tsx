import React, { useState, useEffect } from 'react';
import { Order, TrackingMilestone } from '../types';
import { getStoredOrders, saveOrders } from '../data/ordersData';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Phone, 
  Printer, 
  MapPin, 
  Calendar, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  User, 
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Plus,
  PenTool,
  FileCheck
} from 'lucide-react';

interface OrderTrackingViewProps {
  initialSearchQuery?: string;
  onNavigateToQuote?: () => void;
  onNavigateToProof?: (trackingNumber?: string) => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  initialSearchQuery = '',
  onNavigateToQuote,
  onNavigateToProof
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || 'NP-QA-8941');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [matchingOrders, setMatchingOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);

  // New order creation state for testing
  const [newClientName, setNewClientName] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newPhone, setNewPhone] = useState('77315415');
  const [newBoxStyle, setNewBoxStyle] = useState('Luxury Rigid Box with Magnetic Flap');
  const [newQty, setNewQty] = useState('1000');

  useEffect(() => {
    const loaded = getStoredOrders();
    setOrders(loaded);

    // Initial search
    const query = (initialSearchQuery || 'NP-QA-8941').trim().toLowerCase();
    performSearch(query, loaded);
  }, [initialSearchQuery]);

  const performSearch = (query: string, sourceOrders: Order[]) => {
    setSearched(true);
    if (!query) {
      setMatchingOrders([]);
      setSelectedOrder(null);
      return;
    }

    const cleaned = query.toLowerCase().replace(/\s+/g, '');
    const found = sourceOrders.filter(o => 
      o.trackingNumber.toLowerCase().includes(cleaned) ||
      o.phone.replace(/\s+/g, '').includes(cleaned) ||
      o.company.toLowerCase().includes(cleaned) ||
      o.customerName.toLowerCase().includes(cleaned)
    );

    setMatchingOrders(found);
    if (found.length > 0) {
      setSelectedOrder(found[0]);
    } else {
      setSelectedOrder(null);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery.trim(), orders);
  };

  // Quick chips helper
  const handleQuickLookup = (trackingIdOrPhone: string) => {
    setSearchQuery(trackingIdOrPhone);
    performSearch(trackingIdOrPhone, orders);
  };

  // Advance stage simulation for demonstration
  const handleAdvanceStage = (orderId: string) => {
    const updated = orders.map(ord => {
      if (ord.trackingNumber !== orderId) return ord;

      // Cycle stages
      let nextStatus: Order['status'] = 'In Production';
      let nextProgress = ord.progressPercentage + 15;
      if (nextProgress > 100) nextProgress = 60;

      if (nextProgress >= 95) nextStatus = 'Out for Delivery';
      else if (nextProgress >= 80) nextStatus = 'Quality Check';
      else if (nextProgress >= 60) nextStatus = 'Co-Packaging';
      else nextStatus = 'In Production';

      return {
        ...ord,
        status: nextStatus,
        progressPercentage: nextProgress
      };
    });

    setOrders(updated);
    saveOrders(updated);
    if (selectedOrder && selectedOrder.trackingNumber === orderId) {
      const active = updated.find(o => o.trackingNumber === orderId);
      if (active) setSelectedOrder(active);
    }
  };

  // Create custom demo order
  const handleCreateDemoOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const newTrackingNum = `NP-QA-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      trackingNumber: newTrackingNum,
      customerName: newClientName || 'VIP Qatari Client',
      company: newCompany || 'Doha Creative Enterprise',
      phone: newPhone || '77315415',
      email: 'client@naspack.qa',
      destinationCity: 'Doha Municipality, Qatar',
      orderDate: new Date().toISOString().split('T')[0],
      estimatedDelivery: '3 - 5 Business Days',
      status: 'In Production',
      progressPercentage: 45,
      currentMilestone: 'CAD Die-Line Proof Approved & Initial Print Run',
      items: [
        {
          id: 'custom-1',
          name: `${newBoxStyle}`,
          quantity: parseInt(newQty, 10) || 1000,
          specs: 'Custom Finishing + FSC Virgin Substrate + Naspack Standard'
        }
      ],
      packagingSpecs: {
        boxStyle: newBoxStyle,
        material: 'Premium Rigid Board / High-Barrier Substrate',
        printFinish: 'Precision Foil Stamping & Soft-Touch Matte',
        batchSize: `${newQty} Units`
      },
      timeline: [
        {
          key: 'received',
          label: 'Inquiry & PO Approved',
          timestamp: 'Today - Just Now',
          description: 'Client specifications logged and production scheduled.',
          location: 'Naspack Doha Hub',
          isCompleted: true,
          isCurrent: false
        },
        {
          key: 'production',
          label: 'Printing & Die-Cutting',
          timestamp: 'In Progress',
          description: 'High-speed automated packaging line active.',
          location: 'Industrial Area Zone 57',
          isCompleted: false,
          isCurrent: true
        },
        {
          key: 'dispatch',
          label: 'Delivery Across Qatar',
          timestamp: 'Scheduled',
          description: 'Assigned to Naspack local distribution fleet.',
          location: 'Doha Central Dispatch',
          isCompleted: false,
          isCurrent: false
        }
      ],
      driverOrHandler: 'Hassan Al-Kuwari (Doha Fleet Lead)',
      vehiclePlate: 'QA-58291'
    };

    const nextList = [newOrder, ...orders];
    setOrders(nextList);
    saveOrders(nextList);
    setSelectedOrder(newOrder);
    setSearchQuery(newTrackingNum);
    setShowNewOrderModal(false);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-neutral-50/50 dark:bg-neutral-950 transition-colors">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Live Client Production & Delivery Tracking
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
            Customer Order Tracking System
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base leading-relaxed">
            Monitor real-time packaging production stages, CAD die-line approval, foil stamping, cleanroom co-packing, and scheduled delivery across Doha and Qatar municipalities.
          </p>
        </div>

        {/* Search Box Card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 sm:p-7 shadow-sm">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="order-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter Tracking ID (e.g., NP-QA-8941) or Registered Phone (e.g., 77315415)"
                  className="w-full pl-11 pr-4 py-3.5 text-sm sm:text-base bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>
              <button
                id="search-order-submit-btn"
                type="submit"
                className="px-6 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Track Shipment</span>
              </button>
            </div>

            {/* Quick test pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
              <span className="text-neutral-500 dark:text-neutral-400 font-medium">Quick Lookups:</span>
              <button
                type="button"
                onClick={() => handleQuickLookup('NP-QA-8941')}
                className="px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 border border-neutral-200 dark:border-neutral-700 transition-colors font-mono cursor-pointer"
              >
                NP-QA-8941 (Luxury Oud Box)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLookup('NP-QA-7723')}
                className="px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 border border-neutral-200 dark:border-neutral-700 transition-colors font-mono cursor-pointer"
              >
                NP-QA-7723 (Coffee Pouches)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLookup('NP-QA-9044')}
                className="px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 border border-neutral-200 dark:border-neutral-700 transition-colors font-mono cursor-pointer"
              >
                NP-QA-9044 (FMCG Cartons)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLookup('77315415')}
                className="px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 border border-neutral-200 dark:border-neutral-700 transition-colors font-mono cursor-pointer text-amber-600 dark:text-amber-400 font-bold"
              >
                Search by Phone: 77315415
              </button>
            </div>
          </form>
        </div>

        {/* Multi-orders selector (if phone matched multiple orders) */}
        {matchingOrders.length > 1 && (
          <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
              Found {matchingOrders.length} active orders associated with your query:
            </div>
            <div className="flex flex-wrap gap-2">
              {matchingOrders.map((ord) => (
                <button
                  key={ord.trackingNumber}
                  onClick={() => setSelectedOrder(ord)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedOrder?.trackingNumber === ord.trackingNumber
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:border-amber-500'
                  }`}
                >
                  <span className="font-mono font-bold mr-1.5">{ord.trackingNumber}</span>
                  <span>({ord.company})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Result Display */}
        {selectedOrder ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top Status Banner */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-neutral-100 dark:border-neutral-800">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                      #{selectedOrder.trackingNumber}
                    </span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider ${
                      selectedOrder.status === 'Delivered'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : selectedOrder.status === 'Out for Delivery'
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}>
                      {selectedOrder.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                      {selectedOrder.company} ({selectedOrder.customerName})
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      Ordered: {selectedOrder.orderDate}
                    </span>
                    <span>•</span>
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">
                      Est. Delivery: {selectedOrder.estimatedDelivery}
                    </span>
                  </div>
                </div>

                {/* Actions: Print Slip & WhatsApp support */}
                <div className="flex flex-wrap items-center gap-2">
                  {onNavigateToProof && (
                    <button
                      onClick={() => onNavigateToProof(selectedOrder.trackingNumber)}
                      className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                      title="Inspect pre-press CAD die-lines and sign off packaging proof"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>{selectedOrder.proof?.status === 'approved' ? 'View Proof Certificate' : 'Proof Sign-Off Portal'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => setShowSlipModal(true)}
                    className="px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Dispatch Slip</span>
                  </button>

                  <a
                    href={`https://wa.me/97477315415?text=Hello%20NasPack%20Logistics%2C%20I%20am%20inquiring%20about%20Order%20${selectedOrder.trackingNumber}%20(${selectedOrder.company})`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>WhatsApp Qatar Logistics</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Progress bar */}
              <div className="pt-6 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    Current Stage: <span className="text-neutral-900 dark:text-white font-bold">{selectedOrder.currentMilestone}</span>
                  </span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                    {selectedOrder.progressPercentage}% Complete
                  </span>
                </div>

                <div className="w-full h-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                    style={{ width: `${selectedOrder.progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Production & Delivery Timeline Steps */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  Detailed Production & Logistics Timeline
                </h3>

                {/* Simulation button for user testing */}
                <button
                  onClick={() => handleAdvanceStage(selectedOrder.trackingNumber)}
                  className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Simulate advancing the order to the next packaging phase"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Simulate Next Stage</span>
                </button>
              </div>

              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200 dark:before:bg-neutral-800">
                {selectedOrder.timeline.map((step, idx) => {
                  return (
                    <div key={idx} className="relative group">
                      {/* Step Circle Node */}
                      <div className={`absolute -left-6 sm:-left-8 top-0.5 w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                        step.isCompleted
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : step.isCurrent
                          ? 'bg-amber-500 border-amber-500 text-white animate-pulse ring-4 ring-amber-500/20'
                          : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-400'
                      }`}>
                        {step.isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : step.isCurrent ? (
                          <span className="w-2.5 h-2.5 rounded-full bg-white" />
                        ) : (
                          <span className="text-[10px] font-bold">{idx + 1}</span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className={`text-sm font-bold ${
                            step.isCurrent
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-neutral-900 dark:text-white'
                          }`}>
                            {step.label}
                          </h4>
                          <span className="text-xs font-mono text-neutral-400">
                            {step.timestamp}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                          {step.description}
                        </p>

                        <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 pt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-500" />
                          <span>{step.location}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2-Column: Order Items & Packaging Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Items */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-500" />
                  Order Items & Quantities
                </h3>

                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {item.name}
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white shrink-0 font-mono">
                          {item.quantity.toLocaleString()} pcs
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {item.specs}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
                  <span>Batch Run Total:</span>
                  <span className="font-bold text-neutral-900 dark:text-white">
                    {selectedOrder.packagingSpecs.batchSize}
                  </span>
                </div>
              </div>

              {/* Technical Specifications & Dispatch info */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-500" />
                  Delivery & Logistics Details
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-neutral-400 block mb-0.5">Delivery Destination</span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      {selectedOrder.destinationCity}
                    </span>
                  </div>

                  <div>
                    <span className="text-neutral-400 block mb-0.5">Assigned Logistics Handler / Van</span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {selectedOrder.driverOrHandler} {selectedOrder.vehiclePlate && `(${selectedOrder.vehiclePlate})`}
                    </span>
                  </div>

                  <div>
                    <span className="text-neutral-400 block mb-0.5">Packaging Structure Style</span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {selectedOrder.packagingSpecs.boxStyle}
                    </span>
                  </div>

                  <div>
                    <span className="text-neutral-400 block mb-0.5">Material & Finishing</span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {selectedOrder.packagingSpecs.material} • {selectedOrder.packagingSpecs.printFinish}
                    </span>
                  </div>
                </div>

                {/* Direct Qatar Call CTA */}
                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <span className="text-xs text-neutral-500">Urgent Dispatch Hotline:</span>
                  <a
                    href="tel:+97477315415"
                    className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    +974 77315415
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          searched && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-10 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  No Active Order Found for "{searchQuery}"
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mt-1">
                  Please verify your Tracking Number (e.g. NP-QA-8941) or phone number (e.g. 77315415). If your order was recently placed, please allow up to 2 hours for our Doha production team to index it.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => handleQuickLookup('NP-QA-8941')}
                  className="px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200"
                >
                  Load Sample Order (NP-QA-8941)
                </button>
                <button
                  onClick={() => handleQuickLookup('77315415')}
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium"
                >
                  Lookup Phone 77315415
                </button>
              </div>
            </div>
          )
        )}

        {/* Create Test Order / Quote Action Banner */}
        <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 dark:from-neutral-900 dark:to-neutral-950 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md border border-neutral-800">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="font-heading text-lg sm:text-xl font-bold">
              Need to simulate or start a new packaging contract in Qatar?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
              Create a simulated test order to test our digital tracking pipeline, or submit an official quote request with custom die-line drawings.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowNewOrderModal(true)}
              className="px-4 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 border border-neutral-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Simulate Test Order</span>
            </button>

            {onNavigateToQuote && (
              <button
                onClick={onNavigateToQuote}
                className="px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                <span>Request Official Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Slip Print Modal */}
      {showSlipModal && selectedOrder && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowSlipModal(false)}
        >
          <div 
            className="bg-white text-neutral-900 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-neutral-200 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <div>
                <div className="font-heading font-black text-xl tracking-tight">NasPack Qatar</div>
                <div className="text-[10px] uppercase text-neutral-500">Official Production & Dispatch Slip</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-bold">{selectedOrder.trackingNumber}</div>
                <div className="text-[10px] text-neutral-500">{selectedOrder.orderDate}</div>
              </div>
            </div>

            {/* Recipient info */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-neutral-500 block">Customer:</span>
                <span className="font-bold">{selectedOrder.customerName}</span>
                <div className="text-neutral-700">{selectedOrder.company}</div>
                <div className="text-neutral-700">Phone: +974 {selectedOrder.phone}</div>
              </div>
              <div>
                <span className="text-neutral-500 block">Destination:</span>
                <span className="font-bold">{selectedOrder.destinationCity}</span>
                <div className="text-neutral-700">Zone 57 Logistics Gateway</div>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 text-xs">
              <span className="font-bold block border-b border-neutral-200 pb-1">Batch Items:</span>
              {selectedOrder.items.map(it => (
                <div key={it.id} className="flex justify-between">
                  <span>{it.name}</span>
                  <span className="font-mono font-bold">{it.quantity.toLocaleString()} pcs</span>
                </div>
              ))}
            </div>

            {/* Seal & Disclaimer */}
            <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-[11px] text-neutral-600 flex items-center justify-between">
              <div>
                <div>Inspected by: QA Lab Doha</div>
                <div className="font-bold text-neutral-800">Status: {selectedOrder.status}</div>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-dashed border-amber-600 flex items-center justify-center text-[8px] font-bold text-amber-700 uppercase">
                PASSED
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
              >
                Print Slip
              </button>
              <button
                onClick={() => setShowSlipModal(false)}
                className="px-4 py-2.5 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Test Order Modal */}
      {showNewOrderModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowNewOrderModal(false)}
        >
          <div 
            className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-heading text-lg font-bold">Simulate New Packaging Order</h3>
            <p className="text-xs text-neutral-500">
              Create a live test order in the local tracking registry to test state progression and search lookup.
            </p>

            <form onSubmit={handleCreateDemoOrder} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Client Name</label>
                <input
                  type="text"
                  required
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="e.g. Tariq Al-Kuwari"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Company / Brand</label>
                <input
                  type="text"
                  required
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="e.g. Doha Artisans"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Contact Phone</label>
                <input
                  type="text"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="77315415"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Box / Packaging Style</label>
                <select
                  value={newBoxStyle}
                  onChange={(e) => setNewBoxStyle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                >
                  <option value="Luxury Rigid Box with Magnetic Flap">Luxury Rigid Box with Magnetic Flap</option>
                  <option value="Compostable Stand-Up Coffee Pouch">Compostable Stand-Up Coffee Pouch</option>
                  <option value="Secondary FMCG Corrugated Master Carton">Secondary FMCG Corrugated Master Carton</option>
                  <option value="Gourmet Confectionery Drawer Box">Gourmet Confectionery Drawer Box</option>
                  <option value="Cosmetic Reverse-Tuck Folding Carton">Cosmetic Reverse-Tuck Folding Carton</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Quantity (Units)</label>
                <input
                  type="number"
                  value={newQty}
                  onChange={(e) => setNewQty(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                >
                  Generate & Track
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewOrderModal(false)}
                  className="px-4 py-2.5 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
