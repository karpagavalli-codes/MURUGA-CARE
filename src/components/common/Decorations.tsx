import React from 'react';

/**
 * Peacock Feather Corner Motif
 * Vector glyph anchored at card corners (28px x 28px)
 * Outer border: #087F78 (Peacock Teal), Inner eye: #2455A4 (Royal Blue), Center teardrop dot: #F28C28 (Saffron)
 */
export const PeacockCornerMotif: React.FC<{
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
  size?: number;
}> = ({ position = 'bottom-right', className = '', size = 28 }) => {
  const rotation =
    position === 'top-left'
      ? '-rotate-90'
      : position === 'top-right'
      ? 'rotate-0'
      : position === 'bottom-left'
      ? 'rotate-180'
      : 'rotate-90';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none transition-transform duration-300 ${rotation} ${className}`}
      aria-hidden="true"
    >
      {/* Outer Feather Flume */}
      <path
        d="M26 2C24 9 17 14 11 17C6 19.5 2 26 2 26C2 26 8.5 22 11 17C13.5 12 19 5 26 2Z"
        fill="#087F78"
        fillOpacity="0.85"
      />
      {/* Secondary Feather Ribs */}
      <path
        d="M24 4C21 8 16 11.5 12 13.5"
        stroke="#D6A43B"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M20 7C17 10 13 13 9 15"
        stroke="#D6A43B"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Royal Blue Eye */}
      <ellipse
        cx="19"
        cy="9"
        rx="5"
        ry="3.5"
        transform="rotate(-35 19 9)"
        fill="#2455A4"
      />
      {/* Saffron Center Teardrop / Pottu */}
      <circle
        cx="19"
        cy="9"
        r="2"
        fill="#F28C28"
      />
      {/* Tiny Gold Catchlight */}
      <circle
        cx="18.2"
        cy="8.2"
        r="0.6"
        fill="#FFF2DC"
      />
    </svg>
  );
};

/**
 * The Sacred Vel Lance Icon
 * Stylized miniature golden lance with pointed leaf-blade tip emblazoned with Tamil Om (ௐ)
 */
export const VelIcon: React.FC<{
  className?: string;
  size?: number;
  glow?: boolean;
}> = ({ className = '', size = 20, glow = false }) => {
  return (
    <span className={`inline-flex items-center justify-center ${glow ? 'drop-shadow-[0_0_8px_rgba(242,140,40,0.6)]' : ''} ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="velGoldGrad" x1="8" y1="4" x2="24" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFD166" />
            <stop offset="40%" stopColor="#D6A43B" />
            <stop offset="100%" stopColor="#F28C28" />
          </linearGradient>
        </defs>

        {/* Vel Staff */}
        <line
          x1="16"
          y1="12"
          x2="16"
          y2="30"
          stroke="url(#velGoldGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Vel Blade Leaf Contour */}
        <path
          d="M16 2C13 6 8 10 9 15C10 18 13.5 19 16 19C18.5 19 22 18 23 15C24 10 19 6 16 2Z"
          fill="url(#velGoldGrad)"
          stroke="#49321F"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Central Ridge Spine */}
        <line
          x1="16"
          y1="4"
          x2="16"
          y2="18"
          stroke="#FFF2DC"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Micro Tamil Om glyph hint in center */}
        <circle cx="16" cy="12" r="1.8" fill="#49321F" />
        <circle cx="16" cy="12" r="0.8" fill="#FFF2DC" />

        {/* Base Ring / Mount */}
        <ellipse cx="16" cy="19" rx="3.5" ry="1.2" fill="#D6A43B" stroke="#49321F" strokeWidth="1" />
      </svg>
    </span>
  );
};

/**
 * Kolam Dotted Divider
 */
export const KolamDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full flex items-center justify-center gap-2 py-2 ${className}`}>
      <span className="w-8 h-[1.5px] bg-gradient-to-r from-transparent to-[#D6A43B]/60" />
      <div className="flex items-center gap-1.5 opacity-70">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D6A43B]" />
        <span className="w-2 h-2 rounded-full bg-[#F28C28]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#087F78]" />
      </div>
      <span className="w-8 h-[1.5px] bg-gradient-to-l from-transparent to-[#D6A43B]/60" />
    </div>
  );
};
