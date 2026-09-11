import React, { useState } from 'react';
import { QuoteInquiry, Order } from '../types';
import { getStoredOrders, saveOrders } from '../data/ordersData';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  UploadCloud, 
  Sparkles, 
  ExternalLink,
  Search,
  ArrowRight,
  ShieldCheck,
  FileText
} from 'lucide-react';

interface ContactViewProps {
  prefilledService?: string;
  onNavigateToTracking?: (trackingId: string) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({
  prefilledService = '',
  onNavigateToTracking
}) => {
  // Form state
  const [customerName, setCustomerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [packagingType, setPackagingType] = useState(prefilledService || 'Luxury Rigid Box with Magnetic Closure');
  const [estimatedQty, setEstimatedQty] = useState('2,500 units');
  const [finishingRequirements, setFinishingRequirements] = useState<string[]>([
    'Hot Foil Stamping (Gold/Silver)',
    'Matte Soft-Touch Lamination'
  ]);
  const [notes, setNotes] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [submittedInquiry, setSubmittedInquiry] = useState<QuoteInquiry | null>(null);
  const [generatedTrackingId, setGeneratedTrackingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableFinishes = [
    'Hot Foil Stamping (Gold/Silver)',
    'Matte Soft-Touch Lamination',
    'Registered Spot UV Gloss',
    'Multi-Level Blind Embossing',
    'Custom High-Density Foam / Velvet Inlays',
    'Food-Safe Grease Barrier (ISO 22000)',
    'Degassing Valve & Tamper Zipper',
    'Automated Shrink-Sleeving & Barcoding'
  ];

  const toggleFinish = (finish: string) => {
    if (finishingRequirements.includes(finish)) {
      setFinishingRequirements(finishingRequirements.filter(f => f !== finish));
    } else {
      setFinishingRequirements([...finishingRequirements, finish]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const trackingId = `NP-QA-${Math.floor(1000 + Math.random() * 9000)}`;
      const inquiryId = `INQ-${Date.now().toString().slice(-6)}`;

      const newInquiry: QuoteInquiry = {
        id: inquiryId,
        customerName: customerName || 'Valued Client',
        companyName: companyName || 'Qatar Brand Enterprise',
        phone: phone || '77315415',
        email: email || 'contact@client.qa',
        packagingType,
        estimatedQty,
        serviceType: packagingType,
        notes,
        submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        assignedTrackingId: trackingId
      };

      // Also register into customer tracking system so client can immediately track it!
      const currentOrders = getStoredOrders();
      const newOrderRecord: Order = {
        trackingNumber: trackingId,
        customerName: newInquiry.customerName,
        company: newInquiry.companyName,
        phone: newInquiry.phone,
        email: newInquiry.email,
        destinationCity: 'Doha, State of Qatar (Customer Specified)',
        orderDate: new Date().toISOString().split('T')[0],
        estimatedDelivery: '3 - 7 Business Days after approval',
        status: 'Received',
        progressPercentage: 15,
        currentMilestone: 'Inquiry Logged • Structural Die-Line Estimations in Progress',
        items: [
          {
            id: `item-${Date.now()}`,
            name: `${packagingType} (${finishingRequirements.join(', ') || 'Custom'})`,
            quantity: parseInt(estimatedQty.replace(/[^0-9]/g, ''), 10) || 2500,
            specs: notes || 'Custom Qatari production specifications'
          }
        ],
        packagingSpecs: {
          boxStyle: packagingType,
          material: 'FSC Certified Substrate / Custom Rigid Greyboard',
          printFinish: finishingRequirements.join(', ') || 'Standard Matte',
          batchSize: estimatedQty
        },
        timeline: [
          {
            key: 'received',
            label: 'Inquiry & Die-Line Request Logged',
            timestamp: 'Today - Just Now',
            description: 'Engineering team assigned to calculate substrate die-line and volumetric shipping.',
            location: 'Naspack Industrial Area Zone 57',
            isCompleted: true,
            isCurrent: true
          },
          {
            key: 'dieline',
            label: 'CAD Prototype & Formal Quote Slip',
            timestamp: 'Scheduled within 24 Hours',
            description: 'Physical sample or 3D digital PDF proof generation.',
            location: 'Naspack CAD Lab',
            isCompleted: false,
            isCurrent: false
          },
          {
            key: 'production',
            label: 'Production & Foil Printing',
            timestamp: 'Pending Client Approval',
            description: 'Heidelberg offset press and Kurz foiling schedule.',
            location: 'Doha Press Unit',
            isCompleted: false,
            isCurrent: false
          },
          {
            key: 'dispatch',
            label: 'Doha Logistics Dispatch',
            timestamp: 'Pending',
            description: 'Scheduled delivery via Naspack temperature-controlled vans.',
            location: 'Doha Logistics Bay',
            isCompleted: false,
            isCurrent: false
          }
        ],
        driverOrHandler: 'Hassan Al-Kuwari (Logistics Supervisor)',
        vehiclePlate: 'QA-58291'
      };

      saveOrders([newOrderRecord, ...currentOrders]);

      setSubmittedInquiry(newInquiry);
      setGeneratedTrackingId(trackingId);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 space-y-16 transition-colors">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Mail className="w-3.5 h-3.5" />
            <span>Direct Client & Collaborator Communication</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
            Connect with NasPack Qatar.
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Request official packaging quotes, book contract co-packing lines, or schedule a physical sample review at our Doha facility. Direct assistance available via phone and WhatsApp.
          </p>
        </div>

        {/* 2-Column Layout: Contact Cards & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Info & Location */}
          <div className="lg:col-span-4 space-y-6">
            {/* Direct Qatar Call Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <span className="text-[11px] uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400">
                Primary Contact Line
              </span>

              <div className="space-y-1">
                <a
                  href="tel:+97477315415"
                  className="font-heading text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-2"
                >
                  <Phone className="w-6 h-6 text-amber-500 shrink-0" />
                  <span>+974 77315415</span>
                </a>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Direct Line: <strong>77315415</strong> • Call anytime during business hours.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href="https://wa.me/97477315415"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>Chat on WhatsApp (+974 77315415)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Address Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4 text-xs">
              <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500" />
                Doha Industrial Headquarters
              </h3>

              <div className="space-y-3 text-neutral-600 dark:text-neutral-300">
                <div>
                  <strong className="text-neutral-900 dark:text-white block mb-0.5">Physical Facility:</strong>
                  <span>Street 24, Zone 57, Industrial Area<br />Doha, State of Qatar</span>
                </div>

                <div>
                  <strong className="text-neutral-900 dark:text-white block mb-0.5">Official Inquiries:</strong>
                  <a href="mailto:info@naspack.qa" className="text-amber-600 dark:text-amber-400 hover:underline">
                    info@naspack.qa
                  </a>
                  <span className="block text-neutral-400">sales@naspack.qa</span>
                </div>

                <div>
                  <strong className="text-neutral-900 dark:text-white block mb-0.5">Operating Hours:</strong>
                  <span>Sunday – Thursday: 8:00 AM – 6:00 PM</span><br />
                  <span>Saturday: 9:00 AM – 2:00 PM</span><br />
                  <span className="text-neutral-400">Friday: Cleanroom sterilization & maintenance</span>
                </div>
              </div>
            </div>

            {/* Order Tracking Quick Shortcut */}
            <div className="p-6 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 space-y-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                <Search className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Already an Active Customer?</span>
              </div>
              <p className="text-neutral-600 dark:text-neutral-300">
                Track your active production batch or delivery van directly using your phone number <strong>77315415</strong>.
              </p>
              {onNavigateToTracking && (
                <button
                  onClick={() => onNavigateToTracking('77315415')}
                  className="w-full py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Open Order Tracking System
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Contact & Quote Form */}
          <div className="lg:col-span-8">
            {submittedInquiry && generatedTrackingId ? (
              /* Success State */
              <div className="bg-white dark:bg-neutral-900 border border-emerald-500/40 rounded-3xl p-8 sm:p-10 shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                    Inquiry Confirmed & Tracking ID Generated
                  </span>
                  <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white">
                    Thank you, {submittedInquiry.customerName}!
                  </h2>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-xl">
                    Your packaging inquiry has been dispatched to our Doha engineering studio. A digital tracking ticket has been established in our Customer Order Tracking System.
                  </p>
                </div>

                {/* Generated Tracking ID Card */}
                <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-neutral-400 uppercase font-semibold">Your Live Tracking Number:</span>
                    <div className="font-mono text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {generatedTrackingId}
                    </div>
                    <span className="text-xs text-neutral-500">
                      Linked to Phone: +974 {submittedInquiry.phone}
                    </span>
                  </div>

                  {onNavigateToTracking && (
                    <button
                      onClick={() => onNavigateToTracking(generatedTrackingId)}
                      className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
                    >
                      <span>Track This Order Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      setSubmittedInquiry(null);
                      setGeneratedTrackingId(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold hover:bg-neutral-200 cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>

                  <a
                    href={`https://wa.me/97477315415?text=Hello%20NasPack%20Qatar%2C%20I%20just%20submitted%20inquiry%20${generatedTrackingId}%20for%20${submittedInquiry.companyName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <span>Notify Engineering on WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ) : (
              /* Contact Form */
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-neutral-950 dark:text-white">
                    Request a Custom Packaging or Co-Packing Quote
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    Fill in your product specifications below. Our structural designers in Doha will review your die-line requirements and provide quotation within 24 hours.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Row 1: Name and Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Sheikh Tariq Al-Kuwari"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Company / Brand Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Al Noor Parfums or Doha Roastery"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 2: Phone and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Qatar Contact Number *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400">
                          +974
                        </span>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="77315415"
                          className="w-full pl-14 pr-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Business Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="procurement@brand.qa"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 3: Packaging Category & Quantity */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Packaging / Co-Packing Type
                      </label>
                      <select
                        value={packagingType}
                        onChange={(e) => setPackagingType(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                      >
                        <option value="Luxury Rigid Box with Magnetic Closure">Luxury Rigid Box with Magnetic Closure</option>
                        <option value="Compostable Stand-Up Coffee & Food Pouch">Compostable Stand-Up Coffee & Food Pouch</option>
                        <option value="Contract Co-Packaging & Automated Sleeving">Contract Co-Packaging & Automated Sleeving</option>
                        <option value="Cosmetic Reverse-Tuck Paperboard Carton">Cosmetic Reverse-Tuck Paperboard Carton</option>
                        <option value="Zero-Plastic Honeycomb Protective Mailer">Zero-Plastic Honeycomb Protective Mailer</option>
                        <option value="Gourmet Confectionery Drawer Box">Gourmet Confectionery Drawer Box</option>
                        <option value="Corrugated Master Shipping Case (B/E Flute)">Corrugated Master Shipping Case (B/E Flute)</option>
                        <option value="Bespoke Structural CAD & Prototyping">Bespoke Structural CAD & Prototyping</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Target Production Batch Size
                      </label>
                      <select
                        value={estimatedQty}
                        onChange={(e) => setEstimatedQty(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                      >
                        <option value="500 units (Pilot Launch)">500 units (Pilot Launch)</option>
                        <option value="1,000 units">1,000 units</option>
                        <option value="2,500 units (Popular Standard)">2,500 units (Popular Standard)</option>
                        <option value="5,000 units">5,000 units</option>
                        <option value="10,000 units (Commercial Volume)">10,000 units (Commercial Volume)</option>
                        <option value="50,000+ units (Industrial FMCG)">50,000+ units (Industrial FMCG)</option>
                      </select>
                    </div>
                  </div>

                  {/* Finishing Preferences Checkboxes */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                      Required Finishing & Special Treatments
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {availableFinishes.map((finish, idx) => {
                        const isChecked = finishingRequirements.includes(finish);
                        return (
                          <div
                            key={idx}
                            onClick={() => toggleFinish(finish)}
                            className={`p-2.5 rounded-xl border text-xs flex items-center gap-2.5 cursor-pointer transition-all ${
                              isChecked
                                ? 'bg-amber-500/10 border-amber-500/40 text-neutral-900 dark:text-white font-medium'
                                : 'bg-neutral-50 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                              isChecked ? 'bg-amber-600 border-amber-600 text-white' : 'border-neutral-300 dark:border-neutral-600'
                            }`}>
                              {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </div>
                            <span>{finish}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Artwork / Die-Line File Upload */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                      Upload Artwork or Reference Mockup (Optional)
                    </label>
                    <div className="relative border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-xl p-4 text-center hover:border-amber-500 transition-colors">
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center justify-center space-y-1 text-xs text-neutral-500 dark:text-neutral-400">
                        <UploadCloud className="w-6 h-6 text-amber-500" />
                        {uploadedFileName ? (
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            Attached: {uploadedFileName}
                          </span>
                        ) : (
                          <span>
                            Drag and drop artwork (.pdf, .ai, .psd, .png) or click to browse
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Notes / Details */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Project Notes & Specific Dimensions
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Specify your bottle/product sizes, required delivery date in Doha, or co-packing requirements..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-neutral-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>Instant tracking ID generated upon submission</span>
                    </div>

                    <button
                      id="submit-quote-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Generating Quotation Ticket...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Quote Request</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
