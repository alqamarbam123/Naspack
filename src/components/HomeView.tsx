import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Page, Project } from '../types';
import { PROJECTS_DATA } from '../data/projectsData';
import { 
  ArrowRight, 
  Package, 
  Search, 
  Phone, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Layers, 
  Camera, 
  ExternalLink,
  CheckCircle2,
  Compass,
  Boxes,
  Award,
  Box,
  Cpu,
  Sliders,
  QrCode
} from 'lucide-react';

interface HomeViewProps {
  projects?: Project[];
  onNavigate: (page: Page) => void;
  onOpenProject: (project: Project) => void;
  onSearchOrder: (trackingId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  projects = PROJECTS_DATA,
  onNavigate,
  onOpenProject,
  onSearchOrder
}) => {
  const [heroSearchInput, setHeroSearchInput] = useState('');
  const source = projects && projects.length > 0 ? projects : PROJECTS_DATA;
  const featuredProjects = source.filter(p => p.isFeatured).slice(0, 4);

  const handleHeroTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearchInput.trim()) {
      onSearchOrder(heroSearchInput.trim());
      onNavigate('tracking');
    }
  };

  return (
    <div className="space-y-20 pb-20 transition-colors">
      {/* Editorial Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 md:pb-24 border-b border-neutral-200/70 dark:border-neutral-800/70">
        {/* Subtle background ambient light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/5 via-neutral-100/30 dark:via-neutral-900/30 to-transparent pointer-events-none -z-10 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-3xl space-y-6">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Doha, Qatar • Premium Packaging & Contract Co-Packaging</span>
            </div>

            {/* Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 dark:text-white leading-[1.1]">
              Architectural packaging design & industrial co-packaging in Qatar.
            </h1>

            {/* Sub-text */}
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl">
              NasPack merges minimalist visual aesthetics and fine studio photography with high-speed automated packaging lines in Doha. From luxury rigid oud boxes and food-grade bio pouches to large-scale FMCG contract assembly.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-explore-portfolio-btn"
                onClick={() => onNavigate('portfolio')}
                className="px-6 py-3.5 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-semibold text-sm hover:opacity-90 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <span>View Packaging Portfolio</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-studio-btn"
                onClick={() => onNavigate('studio')}
                className="px-5 py-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-semibold text-sm transition-all flex items-center gap-2 shadow-xs cursor-pointer group"
              >
                <Box className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:rotate-12 transition-transform" />
                <span>Interactive 3D Studio</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500 text-white font-bold tracking-wider">
                  NEW TECH
                </span>
              </button>

              <button
                id="hero-request-quote-btn"
                onClick={() => onNavigate('contact')}
                className="px-5 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition-all shadow-sm cursor-pointer"
              >
                <span>Request Custom Quote</span>
              </button>

              <a
                href="tel:+97477315415"
                className="px-4 py-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-semibold text-sm transition-all flex items-center gap-2 border border-neutral-200 dark:border-neutral-700"
              >
                <Phone className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>77315415</span>
              </a>
            </div>
          </div>

          {/* Live Order Tracker Bar directly inside hero for clients */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl max-w-3xl">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-amber-500" />
                Live Customer Order Tracking
              </span>
              <span className="text-neutral-400">
                Track by ID or Phone: <strong className="text-amber-600 dark:text-amber-400">77315415</strong>
              </span>
            </div>

            <form onSubmit={handleHeroTrackSubmit} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={heroSearchInput}
                  onChange={(e) => setHeroSearchInput(e.target.value)}
                  placeholder="Enter Tracking ID (e.g., NP-QA-8941) or Customer Phone"
                  className="w-full bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-amber-500"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shrink-0"
              >
                <span>Track Order</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-neutral-200/60 dark:border-neutral-800/60">
            <div>
              <div className="font-heading text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white">
                150K+
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Daily Co-Packaging Units in Doha
              </div>
            </div>
            <div>
              <div className="font-heading text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white">
                48h
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Rapid CAD Prototyping Turnaround
              </div>
            </div>
            <div>
              <div className="font-heading text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white">
                ISO 22000
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Food-Grade & HACCP Cleanrooms
              </div>
            </div>
            <div>
              <div className="font-heading text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white">
                100% Qatar
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Zone 57 Logistics & Delivery Fleet
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Pillars Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400">
              Core Capabilities
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-950 dark:text-white">
              End-to-end packaging solutions for Qatar's growing commercial industries.
            </h2>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
          >
            <span>Explore All Co-Packaging Services</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4 hover:border-amber-500/40 transition-all shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white">
              <Compass className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-heading text-lg font-bold text-neutral-950 dark:text-white">
              Bespoke Structural Packaging & CAD
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Engineering rigid gift boxes, folding cartons, and pouch die-lines from scratch. We build precision 1:1 physical prototypes using digital Kongsberg cutting tables before production.
            </p>
            <ul className="space-y-1.5 text-xs text-neutral-500 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                <span>Magnetic closures & velvet inlays</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                <span>24k gold foil stamping & embossing</span>
              </li>
            </ul>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4 hover:border-amber-500/40 transition-all shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white">
              <Boxes className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-heading text-lg font-bold text-neutral-950 dark:text-white">
              Contract Co-Packaging & Secondary Assembly
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Industrial Area Zone 57 certified co-packing lines. We handle automated liquid/solid filling, shrink sleeving, promotional bundling (BOGO), and barcode labeling for Qatar retailers.
            </p>
            <ul className="space-y-1.5 text-xs text-neutral-500 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                <span>High-speed shrink-wrapping tunnels</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                <span>GS1 compliant batch coding & date stamping</span>
              </li>
            </ul>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4 hover:border-amber-500/40 transition-all shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white">
              <Camera className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-heading text-lg font-bold text-neutral-950 dark:text-white">
              Studio Photography & Creative Staging
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Specialized packaging still life photography studio capturing tactile foils, embossed textures, and unboxing rituals to elevate Qatar brands on e-commerce and retail lookbooks.
            </p>
            <ul className="space-y-1.5 text-xs text-neutral-500 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                <span>Commercial macro texture captures</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                <span>360° unboxing animation assets</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* New Technology Spotlight: Interactive 3D Packaging Studio & Smart Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-950 to-black text-white p-8 sm:p-12 border border-neutral-800 shadow-2xl">
          {/* Subtle geometric grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-20" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>Next-Generation Technology for Qatar Brands</span>
              </div>

              <h2 className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Interactive 3D Packaging Studio & Smart Authentication Tech.
              </h2>

              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-xl">
                Experience NasPack’s new digital prototyping lab. Test real-time 3D box folding angles, simulate 24K hot gold stampings, tactile soft-touch finishes, and embed anti-counterfeit QR and NFC chips tailored for GCC luxury compliance.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-400">
                    <Box className="w-4 h-4" />
                    <span>3D Kinematic Folding</span>
                  </div>
                  <p className="text-neutral-500 text-[11px]">Real-time CSS 3D die-line folding simulation</p>
                </div>

                <div className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                    <QrCode className="w-4 h-4" />
                    <span>Crypto Anti-Counterfeit</span>
                  </div>
                  <p className="text-neutral-500 text-[11px]">Dynamic QR verification for Qatar luxury goods</p>
                </div>

                <div className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-1 col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-1.5 font-bold text-purple-400">
                    <Cpu className="w-4 h-4" />
                    <span>Smart NFC & Thermal</span>
                  </div>
                  <p className="text-neutral-500 text-[11px]">Cold-chain integrity and interactive consumer tap</p>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-3">
                <button
                  id="home-banner-launch-studio-btn"
                  onClick={() => onNavigate('studio')}
                  className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold text-sm transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <Box className="w-4 h-4" />
                  <span>Launch 3D Packaging Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('services')}
                  className="px-5 py-3.5 rounded-xl bg-neutral-800/90 hover:bg-neutral-800 text-neutral-300 font-semibold text-sm transition-colors"
                >
                  Explore Co-Packaging Lines
                </button>
              </div>
            </div>

            {/* Visual Interactive Teaser Badge */}
            <div className="lg:col-span-5 flex justify-center">
              <div 
                onClick={() => onNavigate('studio')}
                className="w-full max-w-sm rounded-2xl bg-neutral-900/80 p-6 border border-amber-500/30 hover:border-amber-500 transition-all cursor-pointer group shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-3 right-3 px-2 py-1 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider border border-amber-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  Click to Test 3D
                </div>

                <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-neutral-800 to-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-105 group-hover:rotate-6 transition-all duration-300">
                    <Box className="w-12 h-12 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                      Live 3D Box & Spec Builder
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      Configure dimensions, foil colors, paper weight, and download instantaneous CAD production spec sheet.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Open Interactive Lab</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Portfolio Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400">
              Selected Works
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-950 dark:text-white">
              Featured packaging design & photography.
            </h2>
          </div>
          <button
            onClick={() => onNavigate('portfolio')}
            className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
          >
            <span>View All Works</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onOpenProject(project)}
              className="group cursor-pointer bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all shadow-sm"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                <img
                  src={project.primaryImage}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {project.category}
                </div>
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>View Details & Specs</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>

              <div className="p-6 space-y-2">
                <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                  <span>Client: <strong className="text-neutral-800 dark:text-neutral-200">{project.client}</strong></span>
                  <span>{project.location}</span>
                </div>
                <h3 className="font-heading text-lg font-bold text-neutral-950 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                  {project.description}
                </p>
                <div className="pt-2 text-xs font-mono text-neutral-400 flex items-center gap-2">
                  <span>{project.finishDetails.slice(0, 55)}...</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Direct Qatar Call CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-neutral-900 dark:bg-neutral-950 text-white p-8 sm:p-12 border border-neutral-800 shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Phone className="w-3.5 h-3.5" />
              <span>Direct Phone: 77315415</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to create award-winning packaging or schedule co-packing in Qatar?
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
              Connect directly with our engineering team in Doha. We provide free structural die-line evaluations, substrate samples, and rapid quotes for runs from 500 to 1,000,000+ units.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="tel:+97477315415"
                className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm transition-colors flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call +974 77315415</span>
              </a>
              <a
                href="https://wa.me/97477315415"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors flex items-center gap-2"
              >
                <span>Chat on WhatsApp</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-sm transition-colors"
              >
                Submit Design Inquiry
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
