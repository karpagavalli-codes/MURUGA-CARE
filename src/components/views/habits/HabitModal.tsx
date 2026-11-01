import React, { useState } from 'react';
import { HabitItem, TaskCategory, HabitFrequency } from '../../../types';
import { X, Flame, Sparkles, Clock, Target } from 'lucide-react';
import { playTempleBell } from '../../../utils/audio';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habit: HabitItem) => void;
  initialHabit?: HabitItem | null;
  soundEnabled?: boolean;
}

const CATEGORIES: { id: TaskCategory; label: string; color: string }[] = [
  { id: 'study', label: 'Study & Academics', color: '#087F78' },
  { id: 'work', label: 'Coding & Work', color: '#2455A4' },
  { id: 'health', label: 'Health & Exercise', color: '#16A34A' },
  { id: 'spiritual', label: 'Spiritual Practice', color: '#F28C28' },
  { id: 'learning', label: 'Reading & Knowledge', color: '#D6A43B' },
  { id: 'personal', label: 'Journaling & Sleep', color: '#D94B83' },
];

export const HabitModal: React.FC<HabitModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialHabit,
  soundEnabled = true,
}) => {
  const [title, setTitle] = useState(initialHabit?.title || '');
  const [description, setDescription] = useState(initialHabit?.description || '');
  const [category, setCategory] = useState<TaskCategory>(initialHabit?.category || 'study');
  const [frequency, setFrequency] = useState<HabitFrequency>(initialHabit?.frequency || 'daily');
  const [targetPerWeek, setTargetPerWeek] = useState(initialHabit?.targetPerWeek || 7);
  const [reminderTime, setReminderTime] = useState(initialHabit?.reminderTime || '07:30 AM');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (soundEnabled) playTempleBell(0.3);

    const habit: HabitItem = {
      id: initialHabit?.id || `habit-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      frequency,
      targetPerWeek,
      reminderTime,
      streakDays: initialHabit?.streakDays || 0,
      bestStreak: initialHabit?.bestStreak || 0,
      completedDays: initialHabit?.completedDays || [false, false, false, false, false, false, false],
      isPaused: initialHabit?.isPaused || false,
      createdAt: initialHabit?.createdAt || new Date().toISOString(),
    };

    onSave(habit);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FFF2DC] border-2 border-[#D6A43B] rounded-3xl w-full max-w-md shadow-elevated overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#FFE0C2]/80 border-b border-[#D6A43B]/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame size={20} className="text-[#F28C28]" />
            <h2 className="text-lg font-bold text-[#49321F] font-display">
              {initialHabit ? 'Edit Habit' : 'Create Sacred Habit'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#49321F]/10 text-[#49321F] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1">
              Habit Name <span className="text-[#D94B83]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 10-Minute Morning Dhyanam & Chanting"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D6A43B]/40 bg-white text-[#49321F] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#F28C28]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1">
              Intention & Purpose
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Breathe calmly before opening laptop"
              className="w-full px-3.5 py-2 rounded-xl border border-[#D6A43B]/40 bg-white text-[#49321F] text-sm"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold text-left border transition-all cursor-pointer ${
                    category === cat.id
                      ? 'border-[#F28C28] bg-white shadow-xs font-bold text-[#49321F]'
                      : 'border-[#D6A43B]/30 bg-[#FFF5EB] text-[#49321F]/70 hover:bg-white'
                  }`}
                >
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full mr-1.5"
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Frequency & Target */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => {
                  const val = e.target.value as HabitFrequency;
                  setFrequency(val);
                  if (val === 'daily') setTargetPerWeek(7);
                  else if (val === 'weekdays') setTargetPerWeek(5);
                }}
                className="w-full px-3 py-2 rounded-xl border border-[#D6A43B]/40 bg-white text-[#49321F] text-sm"
              >
                <option value="daily">Every day (7 days)</option>
                <option value="weekdays">Weekdays (Mon-Fri)</option>
                <option value="custom_weekly">Custom Target</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1">
                Days / Week
              </label>
              <select
                value={targetPerWeek}
                onChange={(e) => setTargetPerWeek(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#D6A43B]/40 bg-white text-[#49321F] text-sm"
              >
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'day' : 'days'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reminder Time */}
          <div>
            <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1">
              Daily Reminder Time (Optional)
            </label>
            <input
              type="text"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              placeholder="e.g. 07:00 AM"
              className="w-full px-3.5 py-2 rounded-xl border border-[#D6A43B]/40 bg-white text-[#49321F] text-sm"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-[#D6A43B]/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#D6A43B]/40 text-[#49321F] text-xs font-bold hover:bg-[#49321F]/5 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F28C28] to-[#D6A43B] text-white text-xs font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles size={14} />
              <span>{initialHabit ? 'Save Habit' : 'Create Habit'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
