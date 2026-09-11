import React from 'react';
import { Page } from '../types';
import { 
  Building2, 
  Camera, 
  Leaf, 
  ShieldCheck, 
  Award, 
  Phone, 
  ArrowRight, 
  CheckCircle2,
  Users,
  Compass,
  Layers,
  Sparkles
} from 'lucide-react';

interface AboutViewProps {
  onNavigate: (page: Page) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 space-y-16 transition-colors">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Building2 className="w-3.5 h-3.5" />
            <span>Industrial Area Zone 57, Doha, State of Qatar</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
            Crafting tactile beauty & industrial scale for Qatar.
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Founded with the conviction that packaging is both an intimate tactile sculpture and a critical industrial supply chain asset. NasPack bridges bespoke visual aesthetics with contract co-packaging execution.
          </p>
        </div>

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            <h2 className="font-heading text-2xl font-bold text-neutral-950 dark:text-white">
              The NasPack Creative & Industrial Story
            </h2>
            <p>
              Operating from the heart of Qatar’s Industrial Area, NasPack was established to give regional brands an alternative to lengthy overseas shipping. We built an integrated studio combining creative design, in-house commercial product photography, and high-speed automated packaging machinery under one roof.
            </p>
            <p>
              Whether we are producing 500 bespoke hand-wrapped magnetic boxes for an exclusive royal oud release, or running 100,000 unit automated shrink-sleeved promotional bundles for Baladna dairy retailers, our precision remains uncompromising.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700">
                <div className="font-heading text-2xl font-bold text-neutral-950 dark:text-white">
                  100% Local
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Manufactured & packed in Doha, Qatar
                </div>
              </div>
              <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700">
                <div className="font-heading text-2xl font-bold text-neutral-950 dark:text-white">
                  48 Hours
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Physical CAD die-line mockups
                </div>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 shadow-xl border border-neutral-200 dark:border-neutral-800">
            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80"
              alt="Naspack Qatar Industrial Production and Photography Studio"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6 text-white">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">Facility Spotlight</span>
                <p className="text-sm font-semibold">Naspack Industrial Plant & Cleanroom Lab, Street 24, Zone 57</p>
              </div>
            </div>
          </div>
        </div>

        {/* Photography Studio Unit Spotlight */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              <Camera className="w-4 h-4" />
              <span>Studio Naspack Photography Unit</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white">
              Showcasing packaging with commercial visual mastery.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Every client project manufactured at Naspack is captured in our specialized optical lighting studio before dispatch. We shoot tactile paper textures, microscopic foil stamping reflections, and 360-degree unboxing sequences ready for luxury e-commerce catalogs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 space-y-2">
              <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Medium-Format Optical Capture</h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                100MP sensors capturing every paper grain, embossing depth, and foil sheen with true color calibration.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 space-y-2">
              <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Anti-Glare Foil Lighting</h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Custom polarized diffusion hoods designed to capture high-sheen metallic foils without blown-out highlights.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 space-y-2">
              <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Commercial Staging & Props</h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Curated natural marble, raw oud wood, linen fabrics, and Doha desert sands for thematic Qatari storytelling.
              </p>
            </div>
          </div>
        </div>

        {/* Qatar National Vision 2030 Sustainability Commitment */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-emerald-950 to-neutral-900 text-white border border-emerald-900/60 space-y-6">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Leaf className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
              Qatar National Vision 2030 Commitment
            </span>
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold max-w-2xl">
            Pioneering circular, zero-plastic packaging across Qatar.
          </h2>

          <p className="text-sm text-neutral-300 max-w-3xl leading-relaxed">
            Naspack is actively replacing single-use expanded polystyrene and bubble wrap with 100% recyclable expandable honeycomb paper mailers, compostable plant-based pouch films, and FSC-certified unbleached kraft corrugate. By manufacturing and assembling locally in Doha, we eliminate thousands of metric tons of shipping air freight emissions.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-emerald-200">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              100% Water-Soluble Vegetable Inks
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              FSC Certified Virgin & Recycled Pulp
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Zero Landfill Paper Scrap Recycling in Doha
            </span>
          </div>
        </div>

        {/* Contact Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <div>
            <h3 className="font-heading text-lg font-bold text-neutral-900 dark:text-white">
              Schedule a visit to our Doha Industrial Area facility
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Tour our printing presses, automated co-packing lines, and design studio.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:+97477315415"
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call: 77315415</span>
            </a>
            <button
              onClick={() => onNavigate('contact')}
              className="px-5 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-900 dark:text-white text-xs font-semibold"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
