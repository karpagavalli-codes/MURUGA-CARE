import React, { useState } from 'react';
import { GoalItem, GoalCategory, GoalStatus } from '../../../types';
import { X, Target, Calendar, Sparkles } from 'lucide-react';
import { playTempleBell } from '../../../utils/audio';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: GoalItem) => void;
  initialGoal?: GoalItem | null;
  soundEnabled?: boolean;
}

const CATEGORIES: { id: GoalCategory; label: string; color: string }[] = [
  { id: 'study', label: 'Study & Academics', color: '#2455A4' },
  { id: 'work', label: 'Career & Work', color: '#087F78' },
  { id: 'health', label: 'Health & Fitness', color: '#16A34A' },
  { id: 'learning', label: 'Skills & Learning', color: '#D6A43B' },
  { id: 'personal', label: 'Personal Growth', color: '#D94B83' },
  { id: 'spiritual', label: 'Spiritual Practice', color: '#F28C28' },
];

const SWATCHES = [
  '#2455A4',
  '#087F78',
  '#F28C28',
  '#D94B83',
  '#D6A43B',
  '#642D35',
  '#16A34A',
  '#9333EA',
];

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialGoal,
  soundEnabled = true,
}) => {
  const [title, setTitle] = useState(initialGoal?.title || '');
  const [description, setDescription] = useState(initialGoal?.description || '');
  const [category, setCategory] = useState<GoalCategory>(initialGoal?.category || 'study');
  const [color, setColor] = useState(initialGoal?.color || '#2455A4');
  const [startDate, setStartDate] = useState(initialGoal?.startDate || '2026-11-01');
  const [targetDate, setTargetDate] = useState(initialGoal?.targetDate || '2026-12-31');
  const [status, setStatus] = useState<GoalStatus>(initialGoal?.status || 'active');
  const [notes, setNotes] = useState(initialGoal?.notes || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (soundEnabled) playTempleBell(0.3);

    const goalToSave: GoalItem = {
      id: initialGoal?.id || `goal-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      color,
      status,
      startDate,
      targetDate,
      notes: notes.trim(),
      monthlyMilestones: initialGoal?.monthlyMilestones || [
        {
          id: `mm-${Date.now()}-1`,
          title: 'Initial Phase & Foundation',
          month: 'November 2026',
          targetDate,
          completed: false,
          weeklyMilestones: [
            {
              id: `wm-${Date.now()}-1`,
              title: 'Week 1: Setup habits & daily study blocks',
              weekNumber: 1,
              targetDate: '2026-11-07',
              completed: false,
            },
          ],
        },
      ],
      linkedTaskIds: initialGoal?.linkedTaskIds || [],
      createdAt: initialGoal?.createdAt || new Date().toISOString(),
    };

    onSave(goalToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FFF2DC] border-2 border-[#D6A43B] rounded-3xl w-full max-w-lg shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#FFE0C2]/80 border-b border-[#D6A43B]/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target size={20} className="text-[#F28C28]" />
            <h2 className="text-lg font-bold text-[#49321F] font-display">
              {initialGoal ? 'Edit Long-Term Goal' : 'Create Long-Term Goal'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#49321F]/10 text-[#49321F] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Goal Title */}
          <div>
            <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1">
              Goal Title <span className="text-[#D94B83]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master React & Cloud Architecture with Distinction"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D6A43B]/40 bg-white text-[#49321F] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#F28C28]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1">
              Description & Purpose
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why does this goal matter to you? What will success feel like?"
              rows={2}
              className="w-full px-3.5 py-2 rounded-xl border border-[#D6A43B]/40 bg-white text-[#49321F] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#F28C28]"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setCategory(cat.id);
                    setColor(cat.color);
                  }}
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

          {/* Dates Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1">
                Start Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D6A43B]/40 bg-white text-[#49321F] text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1">
                Target Deadline <span className="text-[#D94B83]">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D6A43B]/40 bg-white text-[#49321F] text-sm"
                />
              </div>
            </div>
          </div>

          {/* Color Swatches */}
          <div>
            <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1.5">
              Accent Color
            </label>
            <div className="flex items-center gap-2">
              {SWATCHES.map((swatch) => (
                <button
                  key={swatch}
                  type="button"
                  onClick={() => setColor(swatch)}
                  style={{ backgroundColor: swatch }}
                  className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                    color === swatch ? 'scale-125 ring-2 ring-offset-2 ring-[#49321F]' : 'hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Status (if editing) */}
          {initialGoal && (
            <div>
              <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1">
                Goal Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as GoalStatus)}
                className="w-full px-3 py-2 rounded-xl border border-[#D6A43B]/40 bg-white text-[#49321F] text-sm"
              >
                <option value="active">Active In Progress</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed 🎉</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          )}

          {/* Devotional Notes */}
          <div>
            <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1">
              Strategy & Daily Rhythm Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Schedule 2 hours every morning at 08:00 AM"
              className="w-full px-3.5 py-2 rounded-xl border border-[#D6A43B]/40 bg-white text-[#49321F] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#F28C28]"
            />
          </div>

          {/* Action Buttons */}
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
              <span>{initialGoal ? 'Save Changes' : 'Create Goal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
