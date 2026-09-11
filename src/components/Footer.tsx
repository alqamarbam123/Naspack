import React, { useState } from 'react';
import { Page } from '../types';
import { Logo } from './Logo';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Search, 
  ShieldCheck, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface FooterProps {
  onNavigate: (page: Page) => void;
  onSearchOrder?: (trackingId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSearchOrder }) => {
  const [quickTrackingInput, setQuickTrackingInput] = useState('');

  const handleQuickTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTrackingInput.trim()) {
      if (onSearchOrder) {
        onSearchOrder(quickTrackingInput.trim());
      }
      onNavigate('tracking');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-neutral-900 text-neutral-300 dark:bg-black border-t border-neutral-800 transition-colors">
      {/* Top Banner: Direct communication & Urgent packaging hotline */}
      <div className="border-b border-neutral-800/80 bg-neutral-950/60 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-neutral-300 font-medium">
              Immediate Packaging Design Consultations & Rush Co-Packing Lines in Doha, Qatar.
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="tel:+97477315415"
              className="flex items-center gap-2 font-bold text-amber-400 hover:text-amber-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call: +974 77315415</span>
            </a>
            <a
              href="https://wa.me/97477315415"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
            >
              <span>WhatsApp Direct</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand & Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="footer" isDarkBackground={true} />

            <p className="text-sm text-neutral-400 leading-relaxed max-w-md">
              NasPack is Qatar’s premier creative packaging design studio and high-volume contract co-packaging enterprise. Blending bespoke visual aesthetics and studio photography with automated industrial packaging lines in Doha.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ISO 9001 & HACCP Food-Grade Packaging Certified</span>
            </div>

            {/* Quick Order Lookup Form */}
            <form onSubmit={handleQuickTrackSubmit} className="pt-3 max-w-sm">
              <label htmlFor="footer-tracking-input" className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                Quick Order Tracking
              </label>
              <div className="relative flex items-center">
                <input
                  id="footer-tracking-input"
                  type="text"
                  value={quickTrackingInput}
                  onChange={(e) => setQuickTrackingInput(e.target.value)}
                  placeholder="Enter Tracking ID (e.g. NP-QA-8941)"
                  className="w-full bg-neutral-800/90 border border-neutral-700 text-white rounded-lg pl-3 pr-24 py-2 text-xs focus:outline-none focus:border-amber-500 transition-colors"
                />
                <button
                  id="footer-track-btn"
                  type="submit"
                  className="absolute right-1 px-3 py-1.5 rounded-md bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Search className="w-3 h-3" />
                  <span>Track</span>
                </button>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1.5">
                Try <span className="text-amber-400 cursor-pointer" onClick={() => { setQuickTrackingInput('NP-QA-8941'); }}>NP-QA-8941</span> or phone <span className="text-amber-400 cursor-pointer" onClick={() => { setQuickTrackingInput('77315415'); }}>77315415</span>
              </p>
            </form>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button 
                  onClick={() => { onNavigate('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home Showcase
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onNavigate('portfolio'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Design & Photography Portfolio
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onNavigate('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Services & Co-Packaging
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onNavigate('studio'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-amber-400"
                >
                  <span>3D Packaging Studio & Tech</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">New</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onNavigate('tracking'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Order Tracking System</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onNavigate('proof'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-amber-400"
                >
                  <span>Interactive Proof Sign-Off</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">New</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onNavigate('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Naspack & Studio
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onNavigate('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Request a Quote
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Capabilities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Packaging in Qatar
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>Contract Co-Packaging & Filling</li>
              <li>Luxury Rigid Perfume & Oud Boxes</li>
              <li>Food-Grade Bio Pouches & Cartons</li>
              <li>Honeycomb Zero-Plastic Mailers</li>
              <li>Automated Shrink-Sleeving & Labels</li>
              <li>Gourmet Confectionery Hampers</li>
              <li>Industrial CAD Die-Line Prototyping</li>
            </ul>
          </div>

          {/* Col 4: Qatar Location & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Qatar Headquarters
            </h4>
            <div className="space-y-2.5 text-xs text-neutral-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  Street 24, Zone 57, Industrial Area<br />
                  Doha, State of Qatar
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href="tel:+97477315415" className="hover:text-white font-semibold text-neutral-200">
                  +974 77315415
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <a href="mailto:info@naspack.qa" className="hover:text-white">
                  info@naspack.qa
                </a>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  Sun - Thu: 8:00 AM - 6:00 PM<br />
                  Sat: 9:00 AM - 2:00 PM (Fri: Closed)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar: Copyright & legal */}
        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>
            © {new Date().getFullYear()} NasPack Qatar. All rights reserved. Registered Industrial Packaging & Co-Packaging Entity in Qatar.
          </p>
          <div className="flex items-center gap-6">
            <span className="hover:text-neutral-400 cursor-pointer" onClick={() => { onNavigate('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Qatar National Vision 2030 Partner</span>
            <span>•</span>
            <a href="tel:+97477315415" className="text-amber-500 hover:underline">
              Contact 77315415
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
