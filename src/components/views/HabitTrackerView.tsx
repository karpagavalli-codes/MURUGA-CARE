import React, { useState } from 'react';
import { HabitItem, TaskCategory } from '../../types';
import { BalaMurugan } from '../mascot/BalaMurugan';
import { PeacockCornerMotif, VelIcon } from '../common/Decorations';
import { HabitModal } from './habits/HabitModal';
import {
  Flame,
  Award,
  Plus,
  CheckCircle2,
  Circle,
  Pause,
  Play,
  Edit2,
  Trash2,
  Calendar,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playVictoryChime, playTempleBell } from '../../utils/audio';

interface HabitTrackerViewProps {
  soundEnabled?: boolean;
}

const DEFAULT_HABITS: HabitItem[] = [
  {
    id: 'h1',
    title: 'Daily Deep Study & Research',
    description: 'Immerse into academic or technical subjects for at least 60 mins',
    category: 'study',
    frequency: 'daily',
    streakDays: 14,
    bestStreak: 18,
    completedDays: [true, true, true, true, true, true, true],
    targetPerWeek: 7,
    badgeTitle: '14 Days Sacred Streak 🔥',
    reminderTime: '09:00 AM',
    createdAt: '2026-10-01T08:00:00.000Z',
  },
  {
    id: 'h2',
    title: 'Coding & Architecture Practice',
    description: 'Solve algorithms, build components, and write clean tests',
    category: 'work',
    frequency: 'weekdays',
    streakDays: 19,
    bestStreak: 25,
    completedDays: [true, true, true, true, true, false, false],
    targetPerWeek: 5,
    badgeTitle: '19 Days Coding Flow ⚡',
    reminderTime: '02:00 PM',
    createdAt: '2026-10-01T08:00:00.000Z',
  },
  {
    id: 'h3',
    title: 'Wisdom Reading (15 Pages)',
    description: 'Mindful reading from timeless epics, philosophy, or spiritual classics',
    category: 'learning',
    frequency: 'daily',
    streakDays: 8,
    bestStreak: 12,
    completedDays: [true, true, false, true, true, true, true],
    targetPerWeek: 7,
    badgeTitle: '8 Days Reading Streak 📖',
    reminderTime: '08:30 PM',
    createdAt: '2026-10-10T08:00:00.000Z',
  },
  {
    id: 'h4',
    title: 'Surya Namaskar & Mindful Exercise',
    description: 'Morning movement and pranayama to awaken the body',
    category: 'health',
    frequency: 'daily',
    streakDays: 21,
    bestStreak: 21,
    completedDays: [true, true, true, true, true, true, true],
    targetPerWeek: 7,
    badgeTitle: '21-Day Ritual Master 🏆',
    reminderTime: '06:30 AM',
    createdAt: '2026-10-01T08:00:00.000Z',
  },
  {
    id: 'h5',
    title: 'Nightly Reflection & Journaling',
    description: 'Write down 3 gratitude notes and tomorrow’s priorities',
    category: 'personal',
    frequency: 'daily',
    streakDays: 6,
    bestStreak: 10,
    completedDays: [true, true, true, true, false, true, false],
    targetPerWeek: 6,
    reminderTime: '10:00 PM',
    createdAt: '2026-10-15T08:00:00.000Z',
  },
  {
    id: 'h6',
    title: 'Sacred Sleep Routine by 10:30 PM',
    description: 'Turn off screens, meditate briefly, and sleep peacefully',
    category: 'health',
    frequency: 'daily',
    streakDays: 5,
    bestStreak: 14,
    completedDays: [true, true, true, true, true, false, false],
    targetPerWeek: 7,
    reminderTime: '10:15 PM',
    createdAt: '2026-10-20T08:00:00.000Z',
  },
];

const STORAGE_KEY = 'muruga_care_habits_v2';

export const HabitTrackerView: React.FC<HabitTrackerViewProps> = ({ soundEnabled = true }) => {
  const [habits, setHabits] = useState<HabitItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return DEFAULT_HABITS;
  });

  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<HabitItem | null>(null);

  const saveHabits = (newHabits: HabitItem[]) => {
    setHabits(newHabits);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHabits));
    } catch (e) {
      console.error(e);
    }
  };

  const daysLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleDay = (habitId: string, dayIndex: number) => {
    if (soundEnabled) playVictoryChime();

    const updated = habits.map((h) => {
      if (h.id !== habitId) return h;
      const newDays = [...h.completedDays];
      newDays[dayIndex] = !newDays[dayIndex];
      const isNowCompleted = newDays[dayIndex];

      const newStreak = isNowCompleted ? h.streakDays + 1 : Math.max(0, h.streakDays - 1);
      const newBest = Math.max(h.bestStreak || 0, newStreak);

      return {
        ...h,
        completedDays: newDays,
        streakDays: newStreak,
        bestStreak: newBest,
      };
    });

    confetti({
      particleCount: 50,
      spread: 60,
      colors: ['#F28C28', '#D6A43B', '#FFD166', '#087F78'],
    });

    saveHabits(updated);
  };

  const handle1TapCheckinToday = (habitId: string) => {
    // Today is Sunday (index 6 in Mon-Sun list for Nov 1 2026)
    toggleDay(habitId, 6);
  };

  const handleTogglePause = (habitId: string) => {
    const updated = habits.map((h) =>
      h.id === habitId ? { ...h, isPaused: !h.isPaused } : h
    );
    saveHabits(updated);
  };

  const handleDeleteHabit = (habitId: string) => {
    if (soundEnabled) playTempleBell(0.3);
    const updated = habits.filter((h) => h.id !== habitId);
    saveHabits(updated);
  };

  const handleSaveModal = (habit: HabitItem) => {
    const exists = habits.some((h) => h.id === habit.id);
    let updated: HabitItem[];
    if (exists) {
      updated = habits.map((h) => (h.id === habit.id ? habit : h));
    } else {
      updated = [habit, ...habits];
    }
    saveHabits(updated);
    setIsModalOpen(false);
    setEditingHabit(null);
  };

  // High level habit stats
  const totalHabits = habits.length;
  const activeHabits = habits.filter((h) => !h.isPaused);
  const completedTodayCount = habits.filter((h) => h.completedDays[6]).length;
  const longestStreak = habits.reduce((max, h) => Math.max(max, h.streakDays), 0);

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#49321F] font-display">
            Daily Habits & Sacred Streaks
          </h1>
          <p className="text-xs sm:text-sm text-[#49321F]/70">
            Nurture focused rituals with weekly progress grids, monthly calendars, and divine consistency
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingHabit(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F28C28] to-[#D6A43B] text-white font-bold text-sm shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 border border-[#FFF2DC]/40 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>New Habit</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#FFF2DC] border border-[#D6A43B]/30 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-[#49321F]/70 font-semibold block">Active Habits</span>
          <span className="text-2xl font-extrabold text-[#49321F] font-mono tabular-nums">
            {activeHabits.length}
          </span>
        </div>
        <div className="bg-[#FFF2DC] border border-[#D6A43B]/30 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-[#49321F]/70 font-semibold block">Completed Today</span>
          <span className="text-2xl font-extrabold text-[#087F78] font-mono tabular-nums">
            {completedTodayCount} / {totalHabits}
          </span>
        </div>
        <div className="bg-[#FFF2DC] border border-[#D6A43B]/30 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-[#49321F]/70 font-semibold block">Longest Current Streak</span>
          <div className="flex items-center gap-1">
            <Flame size={20} className="text-[#F28C28]" />
            <span className="text-2xl font-extrabold text-[#F28C28] font-mono tabular-nums">
              {longestStreak} d
            </span>
          </div>
        </div>
        <div className="bg-[#FFF2DC] border border-[#D6A43B]/30 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-[#49321F]/70 font-semibold block">Consistency Rate</span>
          <span className="text-2xl font-extrabold text-[#2455A4] font-mono tabular-nums">
            {Math.round((completedTodayCount / Math.max(1, totalHabits)) * 100)}%
          </span>
        </div>
      </div>

      {/* View Switcher: Weekly Mon-Sun Grid vs Monthly Calendar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 p-1 bg-[#FFE0C2]/60 rounded-xl border border-[#D6A43B]/25">
          <button
            type="button"
            onClick={() => setActiveTab('weekly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'weekly'
                ? 'bg-white text-[#49321F] shadow-xs font-bold'
                : 'text-[#49321F]/70 hover:text-[#49321F]'
            }`}
          >
            Weekly Grid
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('monthly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'monthly'
                ? 'bg-white text-[#49321F] shadow-xs font-bold'
                : 'text-[#49321F]/70 hover:text-[#49321F]'
            }`}
          >
            Monthly View (November 2026)
          </button>
        </div>

        <span className="text-xs text-[#49321F]/70 font-medium hidden sm:inline">
          Tap any day circle to log ritual completion
        </span>
      </div>

      {/* Habit Cards List (Weekly View) */}
      {activeTab === 'weekly' && (
        <div className="space-y-4">
          {habits.map((habit) => {
            const completedCount = habit.completedDays.filter(Boolean).length;
            const targetMet = completedCount >= habit.targetPerWeek;
            const isTodayDone = habit.completedDays[6];

            return (
              <div
                key={habit.id}
                className={`bg-[#FFF2DC] border-2 rounded-2xl p-4 sm:p-5 transition-all shadow-xs ${
                  habit.isPaused
                    ? 'opacity-60 border-neutral-300'
                    : 'border-[#D6A43B]/40 hover:border-[#F28C28]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Title & Metadata */}
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 text-xs text-[#49321F]/70">
                      <span className="capitalize font-semibold text-[#087F78]">
                        {habit.category}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 font-mono font-bold text-[#F28C28]">
                        <Flame size={13} />
                        {habit.streakDays} day streak
                      </span>
                      {habit.bestStreak && (
                        <>
                          <span>·</span>
                          <span className="text-[#49321F]/60">Best: {habit.bestStreak}d</span>
                        </>
                      )}
                      {habit.badgeTitle && (
                        <>
                          <span>·</span>
                          <span className="text-[#D6A43B] font-bold">{habit.badgeTitle}</span>
                        </>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#49321F] font-display">
                      {habit.title}
                    </h3>

                    {habit.description && (
                      <p className="text-xs text-[#49321F]/80">{habit.description}</p>
                    )}
                  </div>

                  {/* Actions (1-tap Checkin + Edit + Pause + Delete) */}
                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => handle1TapCheckinToday(habit.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isTodayDone
                          ? 'bg-[#087F78] text-white border-[#087F78]'
                          : 'bg-white hover:bg-[#FFE0C2] text-[#49321F] border-[#D6A43B]/40'
                      }`}
                      title="1-Tap check in for today"
                    >
                      <CheckCircle2 size={14} />
                      <span>{isTodayDone ? 'Done Today ✓' : 'Check-in Today'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingHabit(habit);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 rounded-xl bg-white hover:bg-[#FFE0C2] text-[#49321F] border border-[#D6A43B]/30 cursor-pointer"
                      title="Edit Habit"
                    >
                      <Edit2 size={13} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTogglePause(habit.id)}
                      className="p-1.5 rounded-xl bg-white hover:bg-[#FFE0C2] text-[#49321F] border border-[#D6A43B]/30 cursor-pointer"
                      title={habit.isPaused ? 'Resume Habit' : 'Pause Habit'}
                    >
                      {habit.isPaused ? <Play size={13} /> : <Pause size={13} />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteHabit(habit.id)}
                      className="p-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 cursor-pointer"
                      title="Delete Habit"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Mon-Sun Day Toggles & Target Progress */}
                <div className="mt-4 pt-3 border-t border-[#D6A43B]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Mon-Sun Circles */}
                  <div className="flex items-center gap-2">
                    {daysLabels.map((lbl, idx) => {
                      const isDone = habit.completedDays[idx];
                      const isToday = idx === 6; // Sunday is Today
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleDay(habit.id, idx)}
                          className={`w-9 h-9 rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                            isDone
                              ? 'bg-gradient-to-br from-[#F28C28] to-[#D6A43B] text-white shadow-xs scale-105'
                              : 'bg-white/80 border border-[#D6A43B]/30 text-[#49321F]/60 hover:bg-[#FFE0C2]/50'
                          } ${isToday ? 'ring-2 ring-[#087F78] ring-offset-1' : ''}`}
                          title={`${dayNames[idx]} - Click to toggle completion`}
                        >
                          <span className="text-[10px] leading-none">{lbl}</span>
                          {isDone ? (
                            <span className="text-[9px] leading-none mt-0.5">✓</span>
                          ) : (
                            <span className="text-[8px] leading-none mt-0.5 opacity-40">·</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Target Meter */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[#49321F]/70 font-semibold">
                      Target: {completedCount} / {habit.targetPerWeek} days
                    </span>
                    {targetMet && (
                      <span className="text-[#087F78] font-bold bg-[#087F78]/10 px-2 py-0.5 rounded-md">
                        Goal Met 🎉
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Monthly View */}
      {activeTab === 'monthly' && (
        <div className="bg-[#FFF2DC] border-2 border-[#D6A43B] rounded-3xl p-6 shadow-ambient space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#49321F] font-display flex items-center gap-2">
              <Calendar size={18} className="text-[#F28C28]" />
              <span>November 2026 Habit Consistency Map</span>
            </h3>
            <span className="text-xs text-[#49321F]/70">30 Days · High Discipline</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <span key={d} className="font-bold text-[#49321F]/60 py-1">
                {d}
              </span>
            ))}

            {/* Empty offset for November 2026 starting on Sunday (6 empty slots if Mon-start) */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`empty-${i}`} className="h-10 rounded-xl bg-white/30 opacity-30" />
            ))}

            {/* Days 1 to 30 */}
            {Array.from({ length: 30 }).map((_, i) => {
              const dayNum = i + 1;
              const isToday = dayNum === 1; // Nov 1 is today
              const isPast = dayNum <= 1;
              return (
                <div
                  key={dayNum}
                  className={`h-12 rounded-xl border flex flex-col items-center justify-center p-1 transition-all ${
                    isToday
                      ? 'bg-[#FFE0C2] border-[#F28C28] ring-2 ring-[#F28C28] shadow-xs'
                      : isPast
                      ? 'bg-white border-[#D6A43B]/30'
                      : 'bg-[#FFF9F2] border-[#D6A43B]/15 opacity-70'
                  }`}
                >
                  <span className="text-[11px] font-bold text-[#49321F] font-mono">{dayNum}</span>
                  {isToday ? (
                    <span className="text-[9px] text-[#087F78] font-bold mt-0.5">Today</span>
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#087F78] mt-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Habit Modal */}
      <HabitModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingHabit(null);
        }}
        onSave={handleSaveModal}
        initialHabit={editingHabit}
        soundEnabled={soundEnabled}
      />
    </div>
  );
};
