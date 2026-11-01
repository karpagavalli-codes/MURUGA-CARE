import React, { useState } from 'react';
import { AppLimitItem } from '../../types';
import { PeacockCornerMotif, VelIcon } from '../common/Decorations';
import { Smartphone, Lock, AlertCircle, Play, ShieldAlert, Sparkles, Check } from 'lucide-react';
import { playTempleBell } from '../../utils/audio';

interface WellbeingViewProps {
  onSimulateAppLimitTrigger: (appName: string) => void;
  soundEnabled?: boolean;
}

export const WellbeingView: React.FC<WellbeingViewProps> = ({
  onSimulateAppLimitTrigger,
  soundEnabled = true,
}) => {
  const [jumpingInterventionsEnabled, setJumpingInterventionsEnabled] = useState(true);

  const [apps, setApps] = useState<AppLimitItem[]>([
    {
      id: 'app1',
      appName: 'Instagram',
      category: 'social',
      icon: '📸',
      usedMinutes: 45,
      limitMinutes: 45,
      isLocked: true,
    },
    {
      id: 'app2',
      appName: 'YouTube',
      category: 'entertainment',
      icon: '▶️',
      usedMinutes: 32,
      limitMinutes: 60,
      isLocked: false,
    },
    {
      id: 'app3',
      appName: 'X (Twitter)',
      category: 'social',
      icon: '🐦',
      usedMinutes: 12,
      limitMinutes: 30,
      isLocked: false,
    },
    {
      id: 'app4',
      appName: 'Reddit & Forums',
      category: 'entertainment',
      icon: '💬',
      usedMinutes: 26,
      limitMinutes: 30,
      isLocked: false,
    },
  ]);

  const toggleLock = (id: string) => {
    if (soundEnabled) playTempleBell(0.3);
    setApps((prev) =>
      prev.map((app) => (app.id === id ? { ...app, isLocked: !app.isLocked } : app))
    );
  };

  const handleUpdateLimit = (id: string, newLimit: number) => {
    setApps((prev) =>
      prev.map((app) => (app.id === id ? { ...app, limitMinutes: newLimit } : app))
    );
  };

  const totalUsedMinutes = apps.reduce((acc, a) => acc + a.usedMinutes, 0);
  const totalHours = Math.floor(totalUsedMinutes / 60);
  const totalRemainingMins = totalUsedMinutes % 60;

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#49321F] font-display">
            Digital Wellbeing & App Boundary Guardian
          </h1>
          <p className="text-xs sm:text-sm text-[#49321F]/70">
            Reclaim attention from mindless feeds through loving boundaries
          </p>
        </div>

        {/* Total Screen Time Chip */}
        <div className="flex items-center gap-2 bg-[#FFE0C2]/80 px-4 py-2 rounded-2xl border border-[#D6A43B]/30 self-start sm:self-auto">
          <Smartphone size={18} className="text-[#F58B72]" />
          <div>
            <span className="text-[10px] uppercase font-bold text-[#49321F]/60 block leading-tight">
              Total Screen Time
            </span>
            <span className="text-sm font-extrabold text-[#49321F] font-mono">
              {totalHours}h {totalRemainingMins}m Today
            </span>
          </div>
        </div>
      </div>

      {/* Hero Metric & Donut Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Donut Chart Card */}
        <div className="bg-[#FFF2DC] border border-[#D6A43B]/30 rounded-3xl p-6 shadow-ambient flex flex-col items-center justify-center text-center relative overflow-hidden">
          <PeacockCornerMotif position="top-right" size={28} className="absolute top-3 right-3" />

          <div className="relative w-44 h-44 flex items-center justify-center my-3">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Segment 1: Social Media (#D94B83) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#D94B83"
                strokeWidth="12"
                strokeDasharray="90 150"
                strokeDashoffset="0"
              />
              {/* Segment 2: Entertainment (#F58B72) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#F58B72"
                strokeWidth="12"
                strokeDasharray="60 180"
                strokeDashoffset="-90"
              />
              {/* Segment 3: Productivity & Learning (#2455A4) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#2455A4"
                strokeWidth="12"
                strokeDasharray="50 190"
                strokeDashoffset="-150"
              />
              {/* Segment 4: System / Others (#D6A43B) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#D6A43B"
                strokeWidth="12"
                strokeDasharray="39 201"
                strokeDashoffset="-200"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold text-[#49321F] font-mono">
                {totalHours}h {totalRemainingMins}m
              </span>
              <span className="text-[10px] font-bold uppercase text-[#49321F]/60">
                Tracked
              </span>
            </div>
          </div>

          {/* Color Key */}
          <div className="grid grid-cols-2 gap-2 text-left w-full mt-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#D94B83]" />
              <span className="text-[#49321F]/80">Social (49%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#F58B72]" />
              <span className="text-[#49321F]/80">Media (31%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#2455A4]" />
              <span className="text-[#49321F]/80">Work (14%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#D6A43B]" />
              <span className="text-[#49321F]/80">Others (6%)</span>
            </div>
          </div>
        </div>

        {/* Gentle Intervention Panel */}
        <div className="lg:col-span-2 bg-[#FFF2DC] border-2 border-[#D6A43B] rounded-3xl p-6 shadow-ambient flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#087F78] flex items-center gap-1.5 font-display">
                <ShieldAlert size={16} />
                Murugan Jumping Interventions (Parandhu Vaa)
              </span>

              {/* Master Toggle */}
              <button
                type="button"
                onClick={() => setJumpingInterventionsEnabled(!jumpingInterventionsEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  jumpingInterventionsEnabled ? 'bg-[#087F78]' : 'bg-[#D6A43B]/40'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    jumpingInterventionsEnabled ? 'right-0.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            <h3 className="text-lg font-bold text-[#49321F] font-display mb-2">
              Gentle Over-The-App Screen Shield
            </h3>

            <p className="text-xs sm:text-sm text-[#49321F]/80 leading-relaxed font-sans mb-4">
              When toggled ON, reaching 90% of your allowed app quota prompts Murugan to fly in dynamically above the app with a warm, caring reminder ("Kanna! Break edukalaama?").
            </p>

            <div className="p-3.5 rounded-2xl bg-[#FFE0C2]/50 border border-[#D6A43B]/30 flex items-center gap-3">
              <Sparkles size={20} className="text-[#F28C28] shrink-0" />
              <div className="text-xs text-[#49321F]">
                <span className="font-bold">Peace of mind:</span> Muruga Care respects your privacy. Tracking is computed 100% on-device with zero keystroke logging.
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#D6A43B]/20 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold text-[#642D35]">
              Simulate Quota Interventions:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSimulateAppLimitTrigger('Instagram')}
                className="px-3.5 py-1.5 rounded-xl bg-[#F28C28] text-white text-xs font-bold hover:brightness-105 active:scale-95 transition-all shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <Play size={12} fill="currentColor" />
                <span>Simulate Instagram Pop-Up</span>
              </button>
              <button
                type="button"
                onClick={() => onSimulateAppLimitTrigger('YouTube')}
                className="px-3.5 py-1.5 rounded-xl bg-[#2455A4] text-white text-xs font-bold hover:brightness-105 active:scale-95 transition-all shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <Play size={12} fill="currentColor" />
                <span>Simulate YouTube Video Ledge</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* App Limits List */}
      <div className="bg-[#FFF2DC] rounded-3xl p-6 border border-[#D6A43B]/30 shadow-ambient">
        <h2 className="text-lg font-bold text-[#49321F] font-display mb-4">
          Configured App Limits & Real-Time Status
        </h2>

        <div className="space-y-3">
          {apps.map((app) => {
            const ratio = Math.min(100, Math.round((app.usedMinutes / app.limitMinutes) * 100));
            const isNearLimit = ratio >= 80;
            const isExceeded = ratio >= 100;

            return (
              <div
                key={app.id}
                className="p-4 rounded-2xl bg-white border border-[#D6A43B]/20 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFE0C2] flex items-center justify-center text-lg shrink-0">
                    {app.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#49321F]">{app.appName}</h3>
                    <div className="text-xs text-[#49321F]/70 font-mono">
                      {app.usedMinutes}m used / {app.limitMinutes}m limit ({ratio}%)
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="flex-1 max-w-xs mx-0 sm:mx-4">
                  <div className="w-full h-2.5 rounded-full bg-[#FFE0C2] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isExceeded
                          ? 'bg-[#642D35]'
                          : isNearLimit
                          ? 'bg-[#F28C28]'
                          : 'bg-[#087F78]'
                      }`}
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                </div>

                {/* Status Badge & Lock Toggle */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {app.isLocked ? (
                    <span className="px-3 py-1 rounded-full bg-[#642D35] text-white text-xs font-bold flex items-center gap-1 shadow-xs">
                      <Lock size={12} />
                      <span>Locked by Murugan</span>
                    </span>
                  ) : isNearLimit ? (
                    <span className="px-3 py-1 rounded-full bg-[#FFE0C2] text-[#F28C28] text-xs font-bold">
                      Approach Limit
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-[#087F78]/10 text-[#087F78] text-xs font-bold">
                      Active
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => toggleLock(app.id)}
                    className="p-2 rounded-xl bg-[#FFE0C2]/60 hover:bg-[#FFE0C2] text-[#49321F] text-xs font-bold transition-colors cursor-pointer"
                    title={app.isLocked ? 'Unlock app' : 'Lock app immediately'}
                  >
                    <Lock size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
