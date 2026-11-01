import React, { useRef } from 'react';
import { UserProfile, CompanionTone, TaskItem, ScheduleActivity, GoalItem, HabitItem } from '../../types';
import { BalaMurugan } from '../mascot/BalaMurugan';
import { PeacockCornerMotif, VelIcon } from '../common/Decorations';
import { playTempleBell, playVictoryChime } from '../../utils/audio';
import {
  ShieldCheck,
  Volume2,
  VolumeX,
  Smartphone,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  CloudCheck,
  Eye,
  Check,
  Clock,
  Calendar,
  Droplets,
  Target,
  Settings as SettingsIcon,
} from 'lucide-react';

interface SettingsViewProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  tasks?: TaskItem[];
  activities?: ScheduleActivity[];
  goals?: GoalItem[];
  habits?: HabitItem[];
  waterDrankMl?: number;
  onRestoreAllData?: (data: any) => void;
  onReplaySplash?: () => void;
  onReplayOnboarding?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateUser,
  tasks = [],
  activities = [],
  goals = [],
  habits = [],
  waterDrankMl = 0,
  onRestoreAllData,
  onReplaySplash,
  onReplayOnboarding,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = () => {
    if (user.soundEnabled) playVictoryChime();
    const exportData = {
      user,
      tasks,
      activities,
      goals,
      habits,
      waterDrankMl,
      app: 'Muruga Care v2.5.0',
      exportedAt: new Date().toISOString(),
      summary: 'Personal Life Companion Vault',
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `muruga-care-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.user) {
          onUpdateUser(parsed.user);
        }
        if (onRestoreAllData) {
          onRestoreAllData(parsed);
        }
        if (user.soundEnabled) playVictoryChime();
        alert('Data backup successfully restored!');
      } catch (err) {
        console.error(err);
        alert('Invalid JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#49321F] font-display">
          Personal Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-[#49321F]/70">
          Tailor your companion profile, calendar preferences, reminder intervals, audio chimes, and data vault
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
            Affectionate Nickname: <strong className="text-[#F28C28]">"{user.nickname}"</strong> · Voice Tone:{' '}
            <strong className="capitalize text-[#087F78]">{user.companionTone}</strong>
          </p>

          <p className="text-xs text-[#49321F]/60">
            100% private local storage · Zero data mining · Encrypted in-browser
          </p>
        </div>
      </div>

      {/* Section 1: Profile Customization */}
      <div className="bg-[#FFF2DC] rounded-3xl p-6 border border-[#D6A43B]/30 shadow-ambient space-y-4">
        <h3 className="text-base font-bold text-[#49321F] font-display">
          Profile Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={user.name}
              onChange={(e) => onUpdateUser({ name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-[#D6A43B]/40 bg-white text-sm text-[#49321F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1">
              Companion Nickname (Tamil term of affection)
            </label>
            <input
              type="text"
              value={user.nickname}
              onChange={(e) => onUpdateUser({ nickname: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-[#D6A43B]/40 bg-white text-sm text-[#49321F]"
            />
          </div>
        </div>

        {/* Companion Tone */}
        <div>
          <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1.5">
            Companion Tone Mode
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'anbudan', label: 'Anbudan (Gentle & Loving)', desc: 'Warm, caring motherly affection' },
              { id: 'veeram', label: 'Veeram (Heroic & Energetic)', desc: 'Warrior spirit, brave and motivating' },
              { id: 'thozhan', label: 'Thozhan (Friendly & Cheerful)', desc: 'Best friend companion, lively banter' },
            ].map((tone) => (
              <button
                key={tone.id}
                type="button"
                onClick={() => onUpdateUser({ companionTone: tone.id as CompanionTone })}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  user.companionTone === tone.id
                    ? 'border-[#F28C28] bg-white shadow-xs ring-1 ring-[#F28C28]'
                    : 'border-[#D6A43B]/30 bg-[#FFF5EB] hover:bg-white'
                }`}
              >
                <div className="font-bold text-xs text-[#49321F]">{tone.label}</div>
                <div className="text-[10px] text-[#49321F]/70 mt-0.5">{tone.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2: Time & Calendar Preferences */}
      <div className="bg-[#FFF2DC] rounded-3xl p-6 border border-[#D6A43B]/30 shadow-ambient space-y-4">
        <h3 className="text-base font-bold text-[#49321F] font-display flex items-center gap-2">
          <Clock size={18} className="text-[#F28C28]" />
          <span>Time & Calendar Preferences</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#D6A43B]/25">
            <div>
              <span className="text-xs font-bold text-[#49321F] block">24-Hour Time Format</span>
              <span className="text-[11px] text-[#49321F]/60">Use 14:00 instead of 02:00 PM</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={user.timeFormat24h || false}
                onChange={(e) => onUpdateUser({ timeFormat24h: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[#D6A43B]/30 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#F28C28]" />
            </label>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#D6A43B]/25">
            <div>
              <span className="text-xs font-bold text-[#49321F] block">Week Starts on Monday</span>
              <span className="text-[11px] text-[#49321F]/60">Monday to Sunday weekly planner cycle</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={user.weekStartsOnMonday !== false}
                onChange={(e) => onUpdateUser({ weekStartsOnMonday: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[#D6A43B]/30 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#087F78]" />
            </label>
          </div>
        </div>
      </div>

      {/* Section 3: Daily Targets & Audio Chimes */}
      <div className="bg-[#FFF2DC] rounded-3xl p-6 border border-[#D6A43B]/30 shadow-ambient space-y-4">
        <h3 className="text-base font-bold text-[#49321F] font-display flex items-center gap-2">
          <Droplets size={18} className="text-[#2455A4]" />
          <span>Daily Targets & Sound Chimes</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1">
              Daily Water Target (ml)
            </label>
            <input
              type="number"
              step="100"
              value={user.dailyWaterTargetMl}
              onChange={(e) => onUpdateUser({ dailyWaterTargetMl: Number(e.target.value) })}
              className="w-full px-3.5 py-2 rounded-xl border border-[#D6A43B]/40 bg-white text-sm font-mono text-[#49321F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1">
              Daily Focus Target (Minutes)
            </label>
            <input
              type="number"
              step="15"
              value={user.dailyFocusTargetMinutes}
              onChange={(e) => onUpdateUser({ dailyFocusTargetMinutes: Number(e.target.value) })}
              className="w-full px-3.5 py-2 rounded-xl border border-[#D6A43B]/40 bg-white text-sm font-mono text-[#49321F]"
            />
          </div>
        </div>

        {/* Audio switches */}
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#D6A43B]/25">
            <div className="flex items-center gap-2">
              {user.soundEnabled ? (
                <Volume2 size={16} className="text-[#087F78]" />
              ) : (
                <VolumeX size={16} className="text-[#49321F]/40" />
              )}
              <div>
                <span className="text-xs font-bold text-[#49321F] block">Sacred Temple Bell & Chimes</span>
                <span className="text-[10px] text-[#49321F]/60">Harmonic bells upon task and habit check-in</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={user.soundEnabled}
                onChange={(e) => onUpdateUser({ soundEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[#D6A43B]/30 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#087F78]" />
            </label>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#D6A43B]/25">
            <div>
              <span className="text-xs font-bold text-[#49321F] block">Reduced Animations</span>
              <span className="text-[10px] text-[#49321F]/60">Lower motion effects for calm experience</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={user.reduceMotion}
                onChange={(e) => onUpdateUser({ reduceMotion: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[#D6A43B]/30 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#F28C28]" />
            </label>
          </div>
        </div>
      </div>

      {/* Section 4: Data Vault (Export / Import / Reset) */}
      <div className="bg-[#FFF2DC] rounded-3xl p-6 border border-[#D6A43B]/30 shadow-ambient space-y-4">
        <h3 className="text-base font-bold text-[#49321F] font-display flex items-center gap-2">
          <Download size={18} className="text-[#087F78]" />
          <span>Data Vault & Backup</span>
        </h3>

        <p className="text-xs text-[#49321F]/70">
          Your tasks, daily planner activities, goals, habits, and water records remain completely in your browser. Export full JSON snapshots anytime or restore from a past file.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportJSON}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F28C28] to-[#D6A43B] text-white text-xs font-bold shadow-xs hover:brightness-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download size={15} />
            <span>Export Full Backup (JSON)</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#FFE0C2] text-[#49321F] text-xs font-bold border border-[#D6A43B]/40 shadow-xs active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Upload size={15} />
            <span>Restore Backup (JSON)</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          {onReplaySplash && (
            <button
              type="button"
              onClick={onReplaySplash}
              className="px-3.5 py-2.5 rounded-xl bg-[#FFE0C2]/80 hover:bg-[#FFE0C2] text-[#49321F] text-xs font-bold border border-[#D6A43B]/30 cursor-pointer"
            >
              Replay Temple Intro
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
