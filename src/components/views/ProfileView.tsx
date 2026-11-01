import React from 'react';
import { UserProfile, CompanionTone } from '../../types';
import { BalaMurugan } from '../mascot/BalaMurugan';
import { PeacockCornerMotif, VelIcon } from '../common/Decorations';
import { playTempleBell, playVictoryChime } from '../../utils/audio';
import {
  ShieldCheck,
  Volume2,
  VolumeX,
  Smartphone,
  Download,
  RotateCcw,
  Sparkles,
  CloudCheck,
  Eye,
  Check,
} from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onReplaySplash: () => void;
  onReplayOnboarding: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateUser,
  onReplaySplash,
  onReplayOnboarding,
}) => {
  const handleExportJSON = () => {
    if (user.soundEnabled) playVictoryChime();
    const exportData = {
      user,
      app: 'Muruga Care v2.4.0',
      exportedAt: new Date().toISOString(),
      summary: 'Personal Life Companion Vault',
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `muruga-care-data-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#49321F] font-display">
          Profile, Preferences & System Integrations
        </h1>
        <p className="text-xs sm:text-sm text-[#49321F]/70">
          Tailor your companion's presence, permissions, and sacred aesthetic rhythm
        </p>
      </div>

      {/* User Identity Card */}
      <div className="bg-[#FFF2DC] border-2 border-[#D6A43B] rounded-3xl p-6 sm:p-7 shadow-ambient flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
        <PeacockCornerMotif position="top-right" size={28} className="absolute top-3 right-3" />

        <div className="shrink-0 relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#F28C28] via-[#FFD166] to-[#087F78] p-1 shadow-gold-glow">
            <div className="w-full h-full rounded-full bg-[#FFF2DC] flex items-center justify-center overflow-hidden">
              <BalaMurugan pose="murugan_state_happy" size={80} showCloud={false} />
            </div>
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D6A43B]/20 border border-[#D6A43B] text-[#49321F] text-xs font-bold font-display">
            <VelIcon size={14} glow={true} />
            <span>{user.levelTitle}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-[#49321F] font-display">
            {user.name}
          </h2>

          <p className="text-xs sm:text-sm text-[#49321F]/80">
            Affectionate Nickname: <strong className="text-[#F28C28]">"{user.nickname}"</strong> • Voice Tone: <strong className="capitalize text-[#087F78]">{user.companionTone}</strong>
          </p>

          <p className="text-xs text-[#49321F]/60">
            Local encrypted storage • Strict zero data mining guarantee
          </p>
        </div>
      </div>

      {/* Section 1: System Permissions Simulator (Jumping Murugan Engine) */}
      <div className="bg-[#FFF2DC] rounded-3xl p-6 border border-[#D6A43B]/30 shadow-ambient space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#49321F] font-display">
              System Permissions (Parandhu Vaa Engine)
            </h3>
            <p className="text-xs text-[#49321F]/70">
              Simulates real native Android Overlay and Windows transparent canvas behaviors
            </p>
          </div>
          <ShieldCheck size={20} className="text-[#087F78]" />
        </div>

        <div className="space-y-3">
          {/* Permission 1: Overlay */}
          <div className="p-4 rounded-2xl bg-white border border-[#D6A43B]/20 flex items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-[#49321F]">
                Draw Over Other Apps (TYPE_APPLICATION_OVERLAY)
              </h4>
              <p className="text-xs text-[#49321F]/70">
                Allows Murugan to leap onto the screen when timers or screen boundaries fire
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (user.soundEnabled) playTempleBell(0.3);
                onUpdateUser({ overlayPermission: !user.overlayPermission });
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                user.overlayPermission ? 'bg-[#087F78]' : 'bg-[#D6A43B]/40'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                  user.overlayPermission ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Permission 2: Usage Access */}
          <div className="p-4 rounded-2xl bg-white border border-[#D6A43B]/20 flex items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-[#49321F]">
                Usage Access Statistics (Screen Time Tracking)
              </h4>
              <p className="text-xs text-[#49321F]/70">
                Computes on-device app boundary limits with 100% offline privacy
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (user.soundEnabled) playTempleBell(0.3);
                onUpdateUser({ usagePermission: !user.usagePermission });
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                user.usagePermission ? 'bg-[#087F78]' : 'bg-[#D6A43B]/40'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                  user.usagePermission ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Permission 3: Battery Optimization */}
          <div className="p-4 rounded-2xl bg-white border border-[#D6A43B]/20 flex items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-[#49321F]">
                Ignore Battery Optimization (On-Time Vel Delivery)
              </h4>
              <p className="text-xs text-[#49321F]/70">
                Guarantees exact-alarm dispatch without OS background suspension
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (user.soundEnabled) playTempleBell(0.3);
                onUpdateUser({ batteryOptimized: !user.batteryOptimized });
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                user.batteryOptimized ? 'bg-[#087F78]' : 'bg-[#D6A43B]/40'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                  user.batteryOptimized ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Section 2: Aesthetics, Audio & Accessibility */}
      <div className="bg-[#FFF2DC] rounded-3xl p-6 border border-[#D6A43B]/30 shadow-ambient space-y-4">
        <h3 className="text-base font-bold text-[#49321F] font-display">
          Aesthetics, Audio & Accessibility
        </h3>

        <div className="space-y-3">
          {/* Audio Chimes */}
          <div className="p-4 rounded-2xl bg-white border border-[#D6A43B]/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#FFE0C2] text-[#F28C28]">
                {user.soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#49321F]">Temple Audio Chimes</h4>
                <p className="text-xs text-[#49321F]/70">
                  Synthesized harmonic bronze bell, water drops, and serene tones
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const nextVal = !user.soundEnabled;
                if (nextVal) playTempleBell(0.4);
                onUpdateUser({ soundEnabled: nextVal });
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                user.soundEnabled ? 'bg-[#087F78]' : 'bg-[#D6A43B]/40'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                  user.soundEnabled ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Reduce Motion */}
          <div className="p-4 rounded-2xl bg-white border border-[#D6A43B]/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#FFE0C2] text-[#2455A4]">
                <Eye size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#49321F]">
                  Reduce Motion (Accessibility)
                </h4>
                <p className="text-xs text-[#49321F]/70">
                  Replaces energetic bounce-and-squash physics with soft opacity fades
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (user.soundEnabled) playTempleBell(0.3);
                onUpdateUser({ reduceMotion: !user.reduceMotion });
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                user.reduceMotion ? 'bg-[#087F78]' : 'bg-[#D6A43B]/40'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                  user.reduceMotion ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Section 3: Data Export & Reset */}
      <div className="bg-[#FFF2DC] rounded-3xl p-6 border border-[#D6A43B]/30 shadow-ambient space-y-4">
        <h3 className="text-base font-bold text-[#49321F] font-display">
          Data Sovereignty & Guided Tours
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleExportJSON}
            className="px-4 py-2.5 rounded-xl bg-[#2455A4] hover:bg-[#1C4484] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Download size={15} />
            <span>Export Life Metrics (JSON)</span>
          </button>

          <button
            type="button"
            onClick={onReplayOnboarding}
            className="px-4 py-2.5 rounded-xl bg-[#FFE0C2] hover:bg-[#FFD166] text-[#49321F] text-xs font-bold border border-[#D6A43B]/40 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles size={15} className="text-[#F28C28]" />
            <span>Replay Onboarding Tour</span>
          </button>

          <button
            type="button"
            onClick={onReplaySplash}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#FFE0C2] text-[#49321F] text-xs font-bold border border-[#D6A43B]/40 flex items-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw size={15} />
            <span>View Sacred Splash Screen</span>
          </button>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="text-center pt-4">
        <p className="text-xs text-[#49321F]/60">
          Muruga Care v2.4.0 • Master Product & Design System • Made with Bhakti & Craftsmanship
        </p>
      </div>
    </div>
  );
};
