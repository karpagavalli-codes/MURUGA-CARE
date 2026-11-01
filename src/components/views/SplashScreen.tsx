import React, { useEffect } from 'react';
import { BalaMurugan } from '../mascot/BalaMurugan';
import { VelIcon } from '../common/Decorations';
import { playTempleBell } from '../../utils/audio';
import { ArrowRight, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  soundEnabled?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, soundEnabled = true }) => {
  useEffect(() => {
    if (soundEnabled) {
      const timer = setTimeout(() => {
        playTempleBell(0.4);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [soundEnabled]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#FFF5EB] text-[#49321F] p-6 select-none animate-fadeIn">
      {/* Background Soft Glow & Kolam Dotted Pattern */}
      <div className="absolute inset-0 kolam-grid-pattern opacity-20 pointer-events-none" />

      {/* Warm Golden Halo Backdrop */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-radial from-[#FFD166]/35 via-[#F28C28]/15 to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full animate-pop-scale">
        {/* Mascot Center Anchor with Official Reference Art */}
        <div
          className="relative mb-3 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => {
            if (soundEnabled) playTempleBell(0.5);
          }}
          title="Click Bala Murugan for blessing chime"
        >
          <div className="absolute -inset-4 rounded-full bg-[#FFE5D0] blur-xl" />
          <BalaMurugan pose="thinking" size={220} showCloud={true} />
        </div>

        {/* App Title & Subtitle in Storybook Typography */}
        <h1 className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-[#49321F] mb-1">
          Vanakkam, Kanna! ✨
        </h1>

        <p className="text-base sm:text-lg font-semibold italic text-[#85343D] mb-2 font-display">
          "Innaiku namma day-ah super-ah plan pannalama?"
        </p>

        <p className="text-xs sm:text-sm text-[#49321F]/80 max-w-sm mb-6 leading-relaxed font-sans">
          Welcome to your personal companion sanctuary. Mindful discipline, gentle reminders, and inner peace.
        </p>

        {/* Golden Vel Indicator */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <div
            className="w-10 h-10 rounded-full bg-[#FFE5D0] border border-[#D6A43B] flex items-center justify-center shadow-xs animate-spin"
            style={{ animationDuration: '8s' }}
          >
            <VelIcon size={22} glow={true} />
          </div>
          <span className="text-xs italic tracking-wider text-[#D6A43B] font-medium">
            "Aruludan Thodangugiradhu..." (Beginning with Grace)
          </span>
        </div>

        {/* Enter Sanctuary Button */}
        <button
          type="button"
          onClick={onComplete}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#F28C28] via-[#FF9F43] to-[#D6A43B] text-white font-bold text-base shadow-floating flex items-center justify-center gap-2 border border-[#FFF2DC]/60 cursor-pointer hover:scale-105 active:scale-95 transition-all"
        >
          <span>Thodangalaam (Enter Sanctuary)</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
