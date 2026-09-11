import React, { useState } from 'react';
import { SERVICES_DATA } from '../data/servicesData';
import { Service } from '../types';
import { 
  Package, 
  Boxes, 
  Crown, 
  Compass, 
  Utensils, 
  Leaf, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Phone,
  Layers,
  ShieldCheck,
  Zap,
  Box,
  Sparkles
} from 'lucide-react';

interface ServicesViewProps {
  onSelectServiceForQuote: (serviceTitle: string) => void;
  onNavigateToStudio?: () => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  onSelectServiceForQuote,
  onNavigateToStudio
}) => {
  const [selectedService, setSelectedService] = useState<Service>(SERVICES_DATA[0]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Boxes': return Boxes;
      case 'Crown': return Crown;
      case 'Compass': return Compass;
      case 'Utensils': return Utensils;
      case 'Leaf': return Leaf;
      case 'Truck': return Truck;
      default: return Package;
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 space-y-16 transition-colors">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Boxes className="w-3.5 h-3.5" />
            <span>Industrial Packaging & Contract Co-Packaging in Qatar</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
            Comprehensive packaging & contract co-packing services.
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            From single bespoke luxury prototypes to high-speed contract filling, bundling, and nationwide distribution across Doha, Lusail, Al Rayyan, and Al Khor.
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES_DATA.map((service) => {
            const Icon = getIcon(service.iconName);
            const isSelected = selectedService.id === service.id;
            return (
              <div
                key={service.id}
                onClick={() => setSelectedService(service)}
                className={`p-6 sm:p-8 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-6 ${
                  isSelected
                    ? 'bg-white dark:bg-neutral-900 border-amber-500 shadow-lg ring-1 ring-amber-500/30'
                    : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-heading text-xl font-bold text-neutral-950 dark:text-white">
                    {service.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {service.shortDesc}
                  </p>

                  {/* Highlights */}
                  <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                    {service.features.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>Turnaround:</span>
                    <strong className="text-neutral-800 dark:text-neutral-200">{service.turnaround}</strong>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectServiceForQuote(service.title);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-amber-600 hover:text-white dark:hover:bg-amber-600 text-neutral-900 dark:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Request Quote for {service.title.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Service Technical Deep Dive */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 sm:p-10 shadow-sm space-y-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-neutral-200 dark:border-neutral-800 pb-6">
            <div>
              <span className="text-xs uppercase font-bold text-amber-600 dark:text-amber-400 tracking-wider">
                Technical Specification Deep Dive
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white mt-1">
                {selectedService.title}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="tel:+97477315415"
                className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-200 text-xs font-semibold flex items-center gap-2 border border-neutral-200 dark:border-neutral-700"
              >
                <Phone className="w-3.5 h-3.5 text-amber-500" />
                <span>Hotline: +974 77315415</span>
              </a>
              <button
                onClick={() => onSelectServiceForQuote(selectedService.title)}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm"
              >
                Get Custom Pricing
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              <p>{selectedService.fullDesc}</p>
              <div className="pt-2 space-y-2">
                <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                  Included Industrial Deliverables:
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedService.features.map((item, idx) => (
                    <li key={idx} className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 flex items-start gap-2">
                      <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-800 space-y-4 text-xs">
              <h4 className="font-heading font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                Co-Packaging Parameters
              </h4>

              <div className="space-y-3">
                <div>
                  <span className="text-neutral-400 block mb-0.5">Capacity & Run Sizes</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {selectedService.minOrderQty}
                  </span>
                </div>

                <div>
                  <span className="text-neutral-400 block mb-0.5">Production Lead Time</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    {selectedService.turnaround}
                  </span>
                </div>

                <div>
                  <span className="text-neutral-400 block mb-0.5">Recommended Industries</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {selectedService.suitableFor}
                  </span>
                </div>

                <div>
                  <span className="text-neutral-400 block mb-0.5">Facility Location</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    Naspack Industrial Plant, Zone 57, Doha, Qatar
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Packaging Materials Matrix */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold text-amber-600 dark:text-amber-400 tracking-wider">
              Substrates & Finishing Lab
            </span>
            <h2 className="font-heading text-2xl font-bold text-neutral-950 dark:text-white">
              Qatari certified packaging substrates & specialty finishes.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">Rigid Greyboard</span>
              <h4 className="font-bold text-sm text-neutral-900 dark:text-white">1200 - 1800 gsm</h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Dutch-imported heavy density board for precision luxury magnetic boxes, perfume packaging, and oud flacons.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">Virgin SBS Board</span>
              <h4 className="font-bold text-sm text-neutral-900 dark:text-white">250 - 450 gsm</h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Solid Bleached Sulfate paperboard for cosmetics, pharmaceutical cartons, and high-contrast spot UV finishes.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">Food Barrier Bio-Film</span>
              <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Multi-Layer EVOH</h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                High-barrier compostable films with one-way degassing valves for Qatar specialty coffee and dry food goods.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">Curbside Recycled Kraft</span>
              <h4 className="font-bold text-sm text-neutral-900 dark:text-white">FSC Certified Flute</h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Zero-plastic honeycomb cushioning and corrugated E/B flute master shippers for sustainable Qatari logistics.
              </p>
            </div>
          </div>
        </div>

        {/* 3D Studio & Prototype CTA Banner */}
        {onNavigateToStudio && (
          <div className="p-8 rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-950 to-black text-white border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Need Custom CAD Prototyping?</span>
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold">
                Test your box dimensions in our Interactive 3D Studio
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400">
                Simulate 3D box folding angles, foil finishes, and smart anti-counterfeit QR tags with instantaneous technical spec calculations.
              </p>
            </div>
            <button
              onClick={onNavigateToStudio}
              className="shrink-0 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-amber-500/10"
            >
              <Box className="w-4 h-4" />
              <span>Launch 3D Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
