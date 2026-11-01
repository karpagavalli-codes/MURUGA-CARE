import React, { useState } from 'react';
import { WaterLogEntry } from '../../types';
import { PeacockCornerMotif } from '../common/Decorations';
import {
  RotateCcw,
  Sparkles,
  Droplets,
  Plus,
  Trash2,
  Clock,
  Bell,
  Settings2,
  CheckCircle2,
} from 'lucide-react';
import { playWaterDrop, playVictoryChime, playTempleBell } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface HydrationViewProps {
  waterDrankMl: number;
  dailyTargetMl: number;
  onAddWater: (amountMl: number) => void;
  onResetWater: () => void;
  onUpdateTarget?: (targetMl: number) => void;
  soundEnabled?: boolean;
}

export const HydrationView: React.FC<HydrationViewProps> = ({
  waterDrankMl,
  dailyTargetMl,
  onAddWater,
  onResetWater,
  onUpdateTarget,
  soundEnabled = true,
}) => {
  const percentage = Math.min(100, Math.round((waterDrankMl / dailyTargetMl) * 100));
  const remainingMl = Math.max(0, dailyTargetMl - waterDrankMl);

  // Custom logging input
  const [customAmount, setCustomAmount] = useState('');
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [newTarget, setNewTarget] = useState(dailyTargetMl.toString());

  // Reminder interval
  const [reminderInterval, setReminderInterval] = useState<number>(60); // minutes
  const [reminderEnabled, setReminderEnabled] = useState(true);

  // Today's intake history log
  const [intakeLogs, setIntakeLogs] = useState<WaterLogEntry[]>([
    { id: 'wl-1', time: '08:00 AM', amountMl: 250, label: 'Morning Warm Water', timestamp: Date.now() - 3600000 * 4 },
    { id: 'wl-2', time: '09:30 AM', amountMl: 500, label: 'Post-Workout Hydration', timestamp: Date.now() - 3600000 * 3 },
    { id: 'wl-3', time: '11:15 AM', amountMl: 250, label: 'Work Break Glass', timestamp: Date.now() - 3600000 * 2 },
    { id: 'wl-4', time: '01:30 PM', amountMl: 500, label: 'Post-Lunch Hydration', timestamp: Date.now() - 3600000 },
    { id: 'wl-5', time: '03:15 PM', amountMl: 250, label: 'Afternoon Refreshment', timestamp: Date.now() - 1800000 },
  ]);

  const handleAdd = (amount: number, label: string = 'Glass of Theertham') => {
    if (soundEnabled) playWaterDrop();
    onAddWater(amount);

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newEntry: WaterLogEntry = {
      id: `wl-${Date.now()}`,
      time: timeStr,
      amountMl: amount,
      label,
      timestamp: Date.now(),
    };
    setIntakeLogs((prev) => [newEntry, ...prev]);

    if (waterDrankMl + amount >= dailyTargetMl && waterDrankMl < dailyTargetMl) {
      if (soundEnabled) playVictoryChime();
      confetti({
        particleCount: 70,
        spread: 80,
        colors: ['#087F78', '#2455A4', '#FFD166', '#B9DCC5'],
      });
    }
  };

  const handleCustomAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customAmount, 10);
    if (!isNaN(parsed) && parsed > 0) {
      handleAdd(parsed, `Custom Intake (${parsed}ml)`);
      setCustomAmount('');
    }
  };

  const handleDeleteLog = (id: string, amount: number) => {
    if (soundEnabled) playTempleBell(0.2);
    setIntakeLogs((prev) => prev.filter((entry) => entry.id !== id));
    // Deduct water
    onAddWater(-Math.min(waterDrankMl, amount));
  };

  const handleSaveTarget = () => {
    const parsed = parseInt(newTarget, 10);
    if (!isNaN(parsed) && parsed >= 500 && onUpdateTarget) {
      onUpdateTarget(parsed);
      setIsEditingTarget(false);
      if (soundEnabled) playTempleBell(0.3);
    }
  };

  const weeklyHistory = [
    { day: 'Mon', amount: 2500, met: true },
    { day: 'Tue', amount: 2250, met: false },
    { day: 'Wed', amount: 2600, met: true },
    { day: 'Thu', amount: 2500, met: true },
    { day: 'Fri', amount: 2400, met: false },
    { day: 'Sat', amount: 2750, met: true },
    { day: 'Today', amount: waterDrankMl, met: waterDrankMl >= dailyTargetMl },
  ];

  const waterLevelY = 220 - (percentage / 100) * 180;

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#49321F] font-display">
            Theertham & Daily Hydration
          </h1>
          <p className="text-xs sm:text-sm text-[#49321F]/70">
            Nourish vitality with mindful hydration, customizable vessel sizes, and smart reminder pacing
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsEditingTarget(!isEditingTarget)}
            className="p-2 rounded-xl bg-white hover:bg-[#FFE0C2] text-[#49321F] text-xs font-bold transition-colors flex items-center gap-1.5 border border-[#D6A43B]/30 cursor-pointer"
          >
            <Settings2 size={14} />
            <span>Target: {dailyTargetMl}ml</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onResetWater();
              setIntakeLogs([]);
            }}
            className="p-2 rounded-xl bg-[#FFE0C2]/80 hover:bg-[#FFE0C2] text-[#49321F] text-xs font-bold transition-colors flex items-center gap-1.5 border border-[#D6A43B]/30 cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Reset Day</span>
          </button>
        </div>
      </div>

      {/* Target Edit Drawer (if active) */}
      {isEditingTarget && (
        <div className="p-4 rounded-2xl bg-[#FFE0C2] border border-[#D6A43B]/40 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2 text-xs font-bold text-[#49321F]">
            <span>Set Personal Daily Water Target (ml):</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="50"
              min="500"
              max="6000"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              className="w-28 px-3 py-1.5 rounded-xl border border-[#D6A43B]/40 bg-white text-xs font-bold font-mono"
            />
            <button
              type="button"
              onClick={handleSaveTarget}
              className="px-3 py-1.5 rounded-xl bg-[#087F78] text-white text-xs font-bold cursor-pointer hover:brightness-105"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => setIsEditingTarget(false)}
              className="px-2 py-1.5 text-xs text-[#49321F]/70 hover:underline cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main Centerpiece Grid: Uruli / Tumbler + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Uruli Reservoir Card */}
        <div className="lg:col-span-7 bg-[#FFF2DC] border-2 border-[#D6A43B] rounded-3xl p-6 sm:p-8 shadow-ambient flex flex-col items-center text-center relative overflow-hidden">
          <PeacockCornerMotif position="top-right" size={32} className="absolute top-4 right-4" />

          {/* Local Midnight status badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE0C2] text-[#49321F] text-xs font-semibold border border-[#D6A43B]/30 mb-2">
            <Clock size={12} className="text-[#F28C28]" />
            <span>Resets automatically at local midnight</span>
          </div>

          {/* Traditional Bronze Uruli / Tumbler SVG */}
          <div className="relative w-56 h-64 my-2 flex items-center justify-center">
            <svg viewBox="0 0 200 240" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="bronzeUruli" x1="0" y1="0" x2="200" y2="240" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFE082" />
                  <stop offset="25%" stopColor="#D6A43B" />
                  <stop offset="60%" stopColor="#9C6B19" />
                  <stop offset="100%" stopColor="#5E3B06" />
                </linearGradient>

                <linearGradient id="theerthamWater" x1="0" y1="0" x2="0" y2="200" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#48CAE4" />
                  <stop offset="40%" stopColor="#087F78" />
                  <stop offset="100%" stopColor="#2455A4" />
                </linearGradient>

                <clipPath id="vesselMask">
                  <path d="M40 30 C40 20 160 20 160 30 L150 200 C150 220 50 220 50 200 Z" />
                </clipPath>
              </defs>

              {/* Shadow Base */}
              <ellipse cx="100" cy="225" rx="60" ry="10" fill="#49321F" opacity="0.15" />

              {/* Outer Vessel Body */}
              <path
                d="M40 30 C40 20 160 20 160 30 L150 200 C150 220 50 220 50 200 Z"
                fill="url(#bronzeUruli)"
                stroke="#FFE082"
                strokeWidth="2.5"
              />

              {/* Inner Cutout with Water Fill */}
              <g clipPath="url(#vesselMask)">
                <rect x="30" y="20" width="140" height="200" fill="#FFF2DC" opacity="0.25" />

                {/* Dynamic Water Rectangle with Wave Animation */}
                <rect
                  x="30"
                  y={waterLevelY}
                  width="140"
                  height={240 - waterLevelY}
                  fill="url(#theerthamWater)"
                  className="transition-all duration-700 ease-out"
                />

                {/* Water Surface Wave Line */}
                <path
                  d={`M40 ${waterLevelY} Q70 ${waterLevelY - 4} 100 ${waterLevelY} T160 ${waterLevelY}`}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.8"
                  className="animate-pulse"
                />
              </g>

              {/* Vessel Rim Collar */}
              <ellipse cx="100" cy="30" rx="60" ry="10" fill="url(#bronzeUruli)" stroke="#FFF2DC" strokeWidth="2" />
              <ellipse cx="100" cy="30" rx="54" ry="7" fill="#5E3B06" opacity="0.4" />
            </svg>

            {/* Float Metric Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#49321F] font-mono drop-shadow-xs tabular-nums">
                {waterDrankMl}
              </span>
              <span className="text-xs font-bold text-[#49321F]/70">/ {dailyTargetMl} ml</span>
              <span className="text-xs font-extrabold text-[#087F78] mt-1 bg-white/80 px-2.5 py-0.5 rounded-full shadow-2xs font-mono">
                {percentage}%
              </span>
            </div>
          </div>

          {/* Remaining Message */}
          <p className="text-xs sm:text-sm font-semibold text-[#49321F]/80 max-w-sm mt-1">
            {remainingMl > 0 ? (
              <>
                Only <strong className="text-[#F28C28]">{remainingMl} ml</strong> remaining to complete today's sacred theertham!
              </>
            ) : (
              <span className="text-[#087F78] font-bold flex items-center justify-center gap-1">
                <Sparkles size={14} />
                Daily Hydration Target Achieved! Blessed health and clarity!
              </span>
            )}
          </p>

          {/* Quick Add Custom Vessel Buttons */}
          <div className="w-full mt-6 pt-5 border-t border-[#D6A43B]/25">
            <span className="text-xs font-bold uppercase tracking-wider text-[#49321F]/70 block mb-3 font-display">
              1-Tap Vessel Logging
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => handleAdd(150, 'Small Cup (150ml)')}
                className="p-3 rounded-2xl bg-white border border-[#D6A43B]/35 hover:border-[#F28C28] hover:bg-[#FFE0C2]/50 active:scale-95 transition-all flex flex-col items-center justify-center text-center cursor-pointer shadow-xs"
              >
                <span className="text-lg">🍵</span>
                <span className="text-xs font-bold text-[#49321F] mt-1">+150 ml</span>
                <span className="text-[10px] text-[#49321F]/60">Small Cup</span>
              </button>

              <button
                type="button"
                onClick={() => handleAdd(250, 'Regular Glass (250ml)')}
                className="p-3 rounded-2xl bg-white border border-[#D6A43B]/35 hover:border-[#F28C28] hover:bg-[#FFE0C2]/50 active:scale-95 transition-all flex flex-col items-center justify-center text-center cursor-pointer shadow-xs"
              >
                <span className="text-lg">🥛</span>
                <span className="text-xs font-bold text-[#49321F] mt-1">+250 ml</span>
                <span className="text-[10px] text-[#49321F]/60">Glass</span>
              </button>

              <button
                type="button"
                onClick={() => handleAdd(500, 'Water Bottle (500ml)')}
                className="p-3 rounded-2xl bg-white border border-[#D6A43B]/35 hover:border-[#F28C28] hover:bg-[#FFE0C2]/50 active:scale-95 transition-all flex flex-col items-center justify-center text-center cursor-pointer shadow-xs"
              >
                <span className="text-lg">🍶</span>
                <span className="text-xs font-bold text-[#49321F] mt-1">+500 ml</span>
                <span className="text-[10px] text-[#49321F]/60">Bottle</span>
              </button>

              <button
                type="button"
                onClick={() => handleAdd(750, 'Uruli Tumbler (750ml)')}
                className="p-3 rounded-2xl bg-white border border-[#D6A43B]/35 hover:border-[#F28C28] hover:bg-[#FFE0C2]/50 active:scale-95 transition-all flex flex-col items-center justify-center text-center cursor-pointer shadow-xs"
              >
                <span className="text-lg">🏺</span>
                <span className="text-xs font-bold text-[#49321F] mt-1">+750 ml</span>
                <span className="text-[10px] text-[#49321F]/60">Tumbler</span>
              </button>
            </div>

            {/* Custom Amount form */}
            <form onSubmit={handleCustomAdd} className="mt-3 flex items-center gap-2 max-w-xs mx-auto">
              <input
                type="number"
                step="50"
                min="50"
                max="2000"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Custom ml (e.g. 350)"
                className="flex-1 px-3 py-2 rounded-xl border border-[#D6A43B]/40 bg-white text-xs font-semibold text-[#49321F]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#F28C28] text-white text-xs font-bold hover:brightness-105 active:scale-95 cursor-pointer shadow-xs"
              >
                + Add
              </button>
            </form>
          </div>
        </div>

        {/* Right Column (5 cols): Intake History & Reminder Intervals */}
        <div className="lg:col-span-5 space-y-6">
          {/* Smart Reminder Pacing Setting */}
          <div className="bg-[#FFF2DC] border border-[#D6A43B]/30 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-[#F28C28]" />
                <h3 className="text-sm font-bold text-[#49321F] font-display">
                  Hydration Reminders
                </h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={reminderEnabled}
                  onChange={(e) => setReminderEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-[#D6A43B]/30 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#087F78]" />
              </label>
            </div>

            <p className="text-xs text-[#49321F]/70">
              Gentle chime and banner to sip water at your optimal interval:
            </p>

            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[30, 45, 60, 90].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  disabled={!reminderEnabled}
                  onClick={() => setReminderInterval(mins)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    reminderInterval === mins
                      ? 'bg-[#087F78] text-white border-[#087F78] shadow-xs'
                      : 'bg-white border-[#D6A43B]/30 text-[#49321F]/70 hover:bg-[#FFE0C2]'
                  } ${!reminderEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          {/* Today's Intake History List */}
          <div className="bg-[#FFF2DC] border border-[#D6A43B]/30 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#49321F] font-display flex items-center gap-1.5">
                <Droplets size={16} className="text-[#2455A4]" />
                <span>Today's Intake Log</span>
              </h3>
              <span className="text-xs font-mono font-bold text-[#49321F]/70">
                {intakeLogs.length} entries
              </span>
            </div>

            {intakeLogs.length === 0 ? (
              <div className="p-4 rounded-2xl bg-white/60 border border-dashed border-[#D6A43B]/30 text-xs text-[#49321F]/70 text-center">
                No logs recorded yet today. Tap any vessel button to begin!
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {intakeLogs.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-2.5 rounded-xl bg-white border border-[#D6A43B]/20 flex items-center justify-between gap-2 shadow-2xs hover:border-[#F28C28]/40 transition-colors"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="w-2 h-2 rounded-full bg-[#087F78] shrink-0" />
                      <div className="truncate">
                        <span className="text-xs font-bold text-[#49321F] block truncate">
                          {entry.label}
                        </span>
                        <span className="text-[10px] text-[#49321F]/60 font-mono">
                          {entry.time}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold font-mono text-[#2455A4]">
                        +{entry.amountMl}ml
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteLog(entry.id, entry.amountMl)}
                        className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                        title="Delete log"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Weekly History Chart Bar */}
      <div className="bg-[#FFF2DC] border-2 border-[#D6A43B] rounded-3xl p-6 shadow-ambient">
        <h3 className="text-base font-bold text-[#49321F] font-display mb-4">
          Weekly Hydration Rhythm
        </h3>

        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-40 pt-4">
          {weeklyHistory.map((item, idx) => {
            const barHeightPercent = Math.min(100, Math.round((item.amount / dailyTargetMl) * 100));
            return (
              <div key={idx} className="flex flex-col items-center justify-end h-full gap-2">
                <span className="text-[10px] sm:text-xs font-bold font-mono text-[#49321F] tabular-nums">
                  {item.amount}
                </span>

                <div className="w-full bg-[#FFE0C2] rounded-xl h-24 relative overflow-hidden flex flex-col justify-end">
                  <div
                    className={`w-full rounded-xl transition-all duration-500 ${
                      item.met
                        ? 'bg-gradient-to-t from-[#087F78] to-[#48CAE4]'
                        : 'bg-gradient-to-t from-[#F28C28] to-[#FFD166]'
                    }`}
                    style={{ height: `${barHeightPercent}%` }}
                  />
                </div>

                <span
                  className={`text-xs font-bold ${
                    item.day === 'Today' ? 'text-[#F28C28] font-extrabold' : 'text-[#49321F]/70'
                  }`}
                >
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
