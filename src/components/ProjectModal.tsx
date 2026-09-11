import React, { useState } from 'react';
import { Project } from '../types';
import { 
  X, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Ruler, 
  Layers, 
  CheckCircle2, 
  Camera, 
  ArrowRight,
  ExternalLink,
  Edit3
} from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  isAdmin?: boolean;
  onClose: () => void;
  onInquireProject: (project: Project) => void;
  onEditProject?: (project: Project) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  isAdmin = false,
  onClose,
  onInquireProject,
  onEditProject
}) => {
  if (!project) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/70">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider font-semibold px-2.5 py-1 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              {project.category} Packaging
            </span>
            <span className="text-xs text-neutral-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {project.location}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && onEditProject && (
              <button
                onClick={() => {
                  onClose();
                  onEditProject(project);
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Product Design</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-8">
          {/* Main Visual Photography Section */}
          <div className="space-y-4">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shadow-inner">
              <img
                src={project.galleryImages[activeImageIndex] || project.primaryImage}
                alt={project.title}
                className="w-full h-full object-cover object-center transition-all duration-300"
                referrerPolicy="no-referrer"
              />

              {/* Photography badge */}
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/10">
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>{project.photographyCredits}</span>
              </div>

              {/* Image index counter */}
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                View {activeImageIndex + 1} of {project.galleryImages.length}
              </div>
            </div>

            {/* Thumbnail Gallery selector */}
            {project.galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {project.galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx 
                        ? 'border-amber-500 shadow-md scale-105' 
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`Angle ${idx + 1}`} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title and Project Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                  {project.title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                  <span>Client: <strong className="text-neutral-800 dark:text-neutral-200">{project.client}</strong></span>
                  <span>•</span>
                  <span>Year: <strong className="text-neutral-800 dark:text-neutral-200">{project.year}</strong></span>
                  <span>•</span>
                  <span>Origin: <strong className="text-neutral-800 dark:text-neutral-200">Doha, Qatar</strong></span>
                </div>
              </div>

              <div className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed space-y-3">
                <p>{project.description}</p>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                  {project.detailedStory}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Technical Specifications Card */}
            <div className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-500" />
                Structural Specifications
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-neutral-400 block mb-0.5">Box / Structure Style</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {project.packagingType}
                  </span>
                </div>

                <div>
                  <span className="text-neutral-400 block mb-0.5">Finishing & Foil Details</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {project.finishDetails}
                  </span>
                </div>

                <div>
                  <span className="text-neutral-400 block mb-0.5">Die-Line Dimensions</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                    <Ruler className="w-3.5 h-3.5 text-amber-500" />
                    {project.dimensions}
                  </span>
                </div>

                <div>
                  <span className="text-neutral-400 block mb-0.5">Production Facility</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    NasPack Industrial Plant, Doha Zone 57
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <button
                  onClick={() => {
                    onInquireProject(project);
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <span>Request Quote For This Style</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="text-[11px] text-center text-neutral-400 mt-2">
                  Direct call: <a href="tel:+97477315415" className="text-amber-500 font-bold">+974 77315415</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
