import React from 'react';

interface LogoProps {
  variant?: 'header' | 'footer' | 'compact' | 'hero' | 'symbol-only';
  withTagline?: boolean;
  className?: string;
  isDarkBackground?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'header',
  withTagline = true,
  className = '',
  isDarkBackground = false,
}) => {
  // Dimension & sizing classes based on variant
  const getSymbolSize = () => {
    switch (variant) {
      case 'hero':
        return 'w-14 h-14';
      case 'compact':
        return 'w-8 h-8';
      case 'footer':
        return 'w-10 h-10';
      case 'symbol-only':
        return 'w-10 h-10';
      case 'header':
      default:
        return 'w-10 h-10';
    }
  };

  const getWordmarkSize = () => {
    switch (variant) {
      case 'hero':
        return 'text-2xl sm:text-3xl';
      case 'footer':
        return 'text-xl';
      case 'compact':
        return 'text-lg';
      case 'header':
      default:
        return 'text-xl sm:text-2xl';
    }
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Precision Geometric Packaging Mark */}
      <div
        className={`${getSymbolSize()} relative shrink-0 rounded-xl overflow-hidden shadow-md flex items-center justify-center p-1.5 transition-transform duration-300 group-hover:scale-105 ${
          isDarkBackground
            ? 'bg-neutral-900 border border-neutral-800'
            : 'bg-neutral-950 dark:bg-neutral-900 border border-neutral-800 dark:border-neutral-700/80'
        }`}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            {/* Luxury Amber / Gold Gradient for Qatar Industrial Packaging */}
            <linearGradient id="naspack-gold-top" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="60%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            <linearGradient id="naspack-gold-flap" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>

            <linearGradient id="naspack-slate-left" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>

            <linearGradient id="naspack-slate-right" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>

          {/* Isometric Packaging Box Structure: Diamond Top Plane */}
          <path
            d="M24 4L42 14.5L24 25L6 14.5L24 4Z"
            fill="url(#naspack-gold-top)"
          />

          {/* Precision Center Crease Die-Line */}
          <path
            d="M24 4L24 25"
            stroke="#FFF"
            strokeWidth="1.2"
            strokeOpacity="0.4"
          />

          {/* Left Facet with architectural 'N' pillar */}
          <path
            d="M6 14.5L24 25V44L6 33.5V14.5Z"
            fill="url(#naspack-slate-left)"
          />

          {/* Geometric Inner Cutout / Folding Inset on Left creating N diagonal stem */}
          <path
            d="M10 18.5L20 24.2V38.5L10 32.8V18.5Z"
            fill="#0F172A"
            fillOpacity="0.6"
          />

          {/* Right Facet with dynamic 'P' packaging flap lock */}
          <path
            d="M24 25L42 14.5V33.5L24 44V25Z"
            fill="url(#naspack-slate-right)"
          />

          {/* Golden Interlocking Closure Flap representing Contract Co-Packaging & Rigid Box Craft */}
          <path
            d="M24 25L36 18L36 29L24 36V25Z"
            fill="url(#naspack-gold-flap)"
          />

          {/* Center Precision Focal Accent Dot */}
          <circle cx="24" cy="25" r="1.8" fill="#FFFFFF" opacity="0.9" />
        </svg>
      </div>

      {/* Wordmark Typography */}
      {variant !== 'symbol-only' && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-brand font-extrabold tracking-tight ${getWordmarkSize()} ${
                isDarkBackground
                  ? 'text-white'
                  : 'text-neutral-950 dark:text-white'
              }`}
            >
              Nas<span className="text-amber-500">Pack</span>
            </span>

            <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Qatar
            </span>
          </div>

          {withTagline && (
            <p
              className={`text-[9px] sm:text-[10px] font-medium tracking-wider uppercase mt-1 ${
                isDarkBackground
                  ? 'text-neutral-400'
                  : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              Packaging & Contract Co-Packing
            </p>
          )}
        </div>
      )}
    </div>
  );
};
