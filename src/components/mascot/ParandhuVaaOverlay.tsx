import React, { useState, useEffect } from 'react';
import { BalaMurugan } from './BalaMurugan';
import { CharacterPose } from '../../types';
import { playParandhuVaaSwoosh, playTempleBell, playVictoryChime } from '../../utils/audio';
import { PeacockCornerMotif, VelIcon } from '../common/Decorations';
import { X, Sparkles } from 'lucide-react';

export interface ParandhuVaaProps {
  isOpen: boolean;
  onClose: () => void;
  pose?: CharacterPose;
  tanglishQuote?: string;
  englishSubtitle?: string;
  categoryTitle?: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  soundEnabled?: boolean;
}

export const ParandhuVaaOverlay: React.FC<ParandhuVaaProps> = ({
  isOpen,
  onClose,
  pose = 'thinking',
  tanglishQuote = 'Kanna! Water kudikka time aachu! 💧',
  englishSubtitle = 'Time to drink water! Keep your body refreshed and energetic.',
  categoryTitle = '💧 Hydration Check',
  primaryActionLabel = 'DRANK WATER!',
  secondaryActionLabel = 'SNOOZE 10M',
  onPrimary,
  onSecondary,
  soundEnabled = true,
}) => {
  const [exitAnimation, setExitAnimation] = useState<'none' | 'leap_up' | 'drop_down'>('none');

  useEffect(() => {
    if (isOpen) {
      setExitAnimation('none');
      if (soundEnabled) {
        playParandhuVaaSwoosh();
      }
    }
  }, [isOpen, soundEnabled]);

  const handlePrimaryClick = () => {
    if (soundEnabled) {
      playVictoryChime();
    }
    setExitAnimation('leap_up');
    setTimeout(() => {
      onPrimary?.();
      onClose();
      setExitAnimation('none');
    }, 320);
  };

  const handleSecondaryClick = () => {
    if (soundEnabled) {
      playTempleBell(0.3);
    }
    setExitAnimation('drop_down');
    setTimeout(() => {
      onSecondary?.();
      onClose();
      setExitAnimation('none');
    }, 280);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center sm:items-end justify-center sm:justify-start p-4 sm:p-6 md:p-8 bg-[#49321F]/40 backdrop-blur-xs animate-fadeIn">
      {/* The Signature Storybook Floating Unit */}
      <div
        className={`relative z-50 flex flex-col sm:flex-row items-center sm:items-end gap-3 sm:gap-4 max-w-lg w-full transition-all duration-300 ${
          exitAnimation === 'leap_up'
            ? 'opacity-0 -translate-y-48 scale-105'
            : exitAnimation === 'drop_down'
            ? 'opacity-0 translate-y-36 scale-95'
            : 'animate-parabolic-entrance opacity-100'
        }`}
      >
        {/* Character Anchor with Small Cute Bounce */}
        <div
          className="shrink-0 relative cursor-pointer hover:scale-105 transition-transform"
          onClick={() => {
            if (soundEnabled) playTempleBell(0.4);
          }}
          title="Click Bala Murugan for blessing chime"
        >
          <BalaMurugan pose={pose} size={150} animate={exitAnimation === 'none'} showCloud={true} />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#FFE5D0] border border-[#D6A43B] text-[10px] font-bold text-[#642D35] uppercase tracking-wider backdrop-blur-xs whitespace-nowrap shadow-xs">
            Parandhu Vaa ✨
          </div>
        </div>

        {/* Storybook Speech-Bubble Notification Card */}
        <div className="flex-1 bg-[#FFF5EB] border-2 border-[#D6A43B] rounded-3xl p-5 shadow-floating relative overflow-hidden animate-pop-scale">
          {/* Peacock Corner Motif */}
          <PeacockCornerMotif position="top-right" size={26} className="absolute top-2 right-2" />

          {/* Top Category Badge */}
          <div className="flex items-center justify-between gap-2 mb-2 pr-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#087F78] flex items-center gap-1.5 font-display">
              <span className="w-2 h-2 rounded-full bg-[#087F78] animate-pulse" />
              {categoryTitle}
            </span>
          </div>

          {/* Tanglish Speech Quote (Storybook Style) */}
          <p className="text-base sm:text-lg font-bold text-[#49321F] leading-snug font-display mb-1.5">
            "{tanglishQuote}"
          </p>

          {/* English Subtitle Context */}
          <p className="text-xs sm:text-sm text-[#49321F]/80 mb-4 leading-relaxed font-sans">
            {englishSubtitle}
          </p>

          {/* Colourful, Rounded Action Buttons */}
          <div className="flex items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleSecondaryClick}
              className="flex-1 py-2.5 px-3 rounded-2xl bg-[#FFE0C2] hover:bg-[#FFD166] text-[#49321F] font-bold text-xs sm:text-sm transition-all border border-[#D6A43B]/40 active:scale-95 text-center truncate cursor-pointer shadow-xs"
            >
              {secondaryActionLabel}
            </button>

            <button
              type="button"
              onClick={handlePrimaryClick}
              className="flex-1 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-[#F28C28] via-[#FF9F43] to-[#D6A43B] hover:brightness-105 text-white font-bold text-xs sm:text-sm shadow-md shadow-[#F28C28]/25 transition-all active:scale-95 flex items-center justify-center gap-1.5 border border-[#FFF2DC]/50 cursor-pointer"
            >
              <VelIcon size={16} glow={true} />
              <span className="truncate">{primaryActionLabel}</span>
            </button>
          </div>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={handleSecondaryClick}
            className="absolute top-2 right-8 text-[#49321F]/50 hover:text-[#49321F] p-1 rounded-full transition-colors cursor-pointer"
            title="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
