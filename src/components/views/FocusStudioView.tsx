import React, { useState, useEffect } from 'react';
import { BalaMurugan } from '../mascot/BalaMurugan';
import { PeacockCornerMotif, VelIcon } from '../common/Decorations';
import { playTempleBell, playVictoryChime, startSoundscape, stopSoundscape } from '../../utils/audio';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FocusStudioViewProps {
  onLogFocusMinutes: (minutes: number) => void;
  soundEnabled?: boolean;
}

export const FocusStudioView: React.FC<FocusStudioViewProps> = ({
  onLogFocusMinutes,
  soundEnabled = true,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(25); // minutes
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60); // seconds
  const [isActive, setIsActive] = useState<boolean>(false);
  const [subject, setSubject] = useState<string>('Advanced Neural Architecture & Deep Work');
  const [soundscape, setSoundscape] = useState<'none' | 'temple_bell' | 'soft_rain' | 'flute_drone' | 'brown_noise'>('temple_bell');

  // Handle timer countdown
  useEffect(() => {
    let timer: number | null = null;
    if (isActive && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      stopSoundscape();
      if (soundEnabled) playVictoryChime();
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
      });
      onLogFocusMinutes(selectedDuration);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, timeLeft, selectedDuration, onLogFocusMinutes, soundEnabled]);

  // Handle soundscape changes
  useEffect(() => {
    if (isActive && soundscape !== 'none') {
      startSoundscape(soundscape, 0.25);
    } else {
      stopSoundscape();
    }
    return () => {
      stopSoundscape();
    };
  }, [isActive, soundscape]);

  const handleTogglePlay = () => {
    if (!isActive) {
      if (soundEnabled) playTempleBell(0.4);
      setIsActive(true);
    } else {
      setIsActive(false);
      stopSoundscape();
    }
  };

  const handleReset = () => {
    setIsActive(false);
    stopSoundscape();
    setTimeLeft(selectedDuration * 60);
  };

  const handleSelectDuration = (mins: number) => {
    setSelectedDuration(mins);
    setTimeLeft(mins * 60);
    setIsActive(false);
    stopSoundscape();
  };

  const handleCompleteEarly = () => {
    const elapsedMinutes = Math.max(1, Math.round((selectedDuration * 60 - timeLeft) / 60));
    onLogFocusMinutes(elapsedMinutes);
    setIsActive(false);
    stopSoundscape();
    if (soundEnabled) playVictoryChime();
    confetti({ particleCount: 60, spread: 70 });
    setTimeLeft(selectedDuration * 60);
  };

  // Format time mm:ss
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalSeconds = selectedDuration * 60;
  const progressRatio = totalSeconds > 0 ? (totalSeconds - timeLeft) / totalSeconds : 0;
  const circumference = 2 * Math.PI * 115;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#49321F] font-display">
            Focus Studio — The Pomodoro Sanctuary
          </h1>
          <p className="text-xs sm:text-sm text-[#49321F]/70">
            Immerse yourself into mindful, undivided attention with Studying Murugan
          </p>
        </div>

        {/* Duration selector tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FFE0C2]/70 rounded-2xl border border-[#D6A43B]/30 self-start sm:self-auto">
          {[15, 25, 45, 60].map((mins) => (
            <button
              key={mins}
              type="button"
              onClick={() => handleSelectDuration(mins)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedDuration === mins
                  ? 'bg-[#F28C28] text-white shadow-xs'
                  : 'text-[#49321F]/70 hover:text-[#49321F]'
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>
      </div>

      {/* Main Sanctuary Card */}
      <div className="bg-[#FFF2DC] border-2 border-[#D6A43B] rounded-3xl p-6 sm:p-10 shadow-elevated flex flex-col items-center text-center relative overflow-hidden">
        <PeacockCornerMotif position="top-right" size={32} className="absolute top-4 right-4" />

        {/* Subject input chip */}
        <div className="mb-6 max-w-md w-full">
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Focus Subject / Intention..."
            className="w-full text-center text-xs sm:text-sm font-bold text-[#49321F] bg-[#FFE0C2]/60 hover:bg-[#FFE0C2] border border-[#D6A43B]/40 rounded-full px-4 py-2 outline-none focus:border-[#F28C28] transition-colors"
          />
        </div>

        {/* 260px Circular Progress Ring with Studying Murugan */}
        <div className="relative w-[280px] h-[280px] flex items-center justify-center my-2">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 260 260">
            {/* Background Track */}
            <circle
              cx="130"
              cy="130"
              r="115"
              fill="none"
              stroke="#FFE0C2"
              strokeWidth="14"
            />
            {/* Animated Progress Gradient Ring */}
            <defs>
              <linearGradient id="focusProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F28C28" />
                <stop offset="50%" stopColor="#FFD166" />
                <stop offset="100%" stopColor="#D6A43B" />
              </linearGradient>
            </defs>
            <circle
              cx="130"
              cy="130"
              r="115"
              fill="none"
              stroke="url(#focusProgressGrad)"
              strokeWidth="14"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>

          {/* Center Mascot & Digital Clock */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <BalaMurugan pose="murugan_state_study" size={120} showCloud={false} />

            <div className="text-4xl sm:text-5xl font-extrabold text-[#49321F] font-sans tracking-tight tabular-nums mt-[-10px]">
              {formattedTime}
            </div>

            <span className="text-[11px] font-bold uppercase tracking-widest text-[#D6A43B] font-display mt-0.5">
              {isActive ? 'Deep Focus Active' : 'Session Ready'}
            </span>
          </div>
        </div>

        {/* Primary Controls */}
        <div className="flex items-center gap-3 mt-6">
          <button
            type="button"
            onClick={handleTogglePlay}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#F28C28] to-[#D6A43B] text-white font-bold text-base shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center gap-2 border border-[#FFF2DC]/40 cursor-pointer"
          >
            {isActive ? (
              <>
                <Pause size={18} fill="currentColor" />
                <span>Pause Session</span>
              </>
            ) : (
              <>
                <Play size={18} fill="currentColor" />
                <span>Start Focus</span>
              </>
            )}
          </button>

          {isActive && (
            <button
              type="button"
              onClick={handleCompleteEarly}
              className="px-4 py-3.5 rounded-2xl bg-[#087F78] hover:bg-[#066862] text-white font-bold text-sm shadow-sm transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
              title="Complete Early & Log Time"
            >
              <CheckCircle2 size={16} />
              <span>Complete Early</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="p-3.5 rounded-2xl bg-[#FFE0C2] hover:bg-[#FFD166] text-[#49321F] border border-[#D6A43B]/40 transition-colors cursor-pointer"
            title="Reset Timer"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        {/* Ambient Soundscape Synthesizer Selector */}
        <div className="mt-8 pt-6 border-t border-[#D6A43B]/20 w-full max-w-lg">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#49321F] flex items-center gap-1.5">
              <Volume2 size={15} className="text-[#F28C28]" />
              Sacred Soundscape Synthesizer
            </span>
            <span className="text-[11px] text-[#49321F]/60">
              Web Audio Synthesized • Zero Lag
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'temple_bell', label: 'Temple Bell 🔔' },
              { id: 'soft_rain', label: 'Monsoon Rain 🌧️' },
              { id: 'flute_drone', label: 'Tanpura Drone 🪕' },
              { id: 'none', label: 'Silent Mode 🤫' },
            ].map((snd) => (
              <button
                key={snd.id}
                type="button"
                onClick={() => setSoundscape(snd.id as any)}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  soundscape === snd.id
                    ? 'border-[#087F78] bg-[#087F78] text-white shadow-xs'
                    : 'border-[#D6A43B]/30 bg-white hover:bg-[#FFE0C2]/50 text-[#49321F]'
                }`}
              >
                {snd.label}
              </button>
            ))}
          </div>
        </div>

        {/* Murugan Wisdom Card */}
        <div className="mt-6 w-full max-w-lg bg-[#FFE0C2]/60 rounded-2xl p-4 border border-[#D6A43B]/30 text-left flex items-start gap-3">
          <Sparkles size={20} className="text-[#F28C28] shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-[#49321F] leading-relaxed">
            <span className="font-bold">Murugan says:</span> "Kanna, mind divert aagudha? Take 3 deep breaths. Vel is protecting your concentration right now!"
          </p>
        </div>
      </div>
    </div>
  );
};
