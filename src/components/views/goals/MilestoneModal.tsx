import React, { useState } from 'react';
import { MonthlyMilestone, WeeklyMilestone } from '../../../types';
import { X, Calendar, Flag, Sparkles } from 'lucide-react';

interface MilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalTitle: string;
  monthlyMilestones: MonthlyMilestone[];
  onAddMonthly: (title: string, month: string, targetDate: string) => void;
  onAddWeekly: (monthlyId: string, title: string, weekNumber: number, targetDate: string) => void;
  soundEnabled?: boolean;
}

export const MilestoneModal: React.FC<MilestoneModalProps> = ({
  isOpen,
  onClose,
  goalTitle,
  monthlyMilestones,
  onAddMonthly,
  onAddWeekly,
}) => {
  const [mode, setMode] = useState<'weekly' | 'monthly'>('weekly');
  const [selectedMonthlyId, setSelectedMonthlyId] = useState<string>(
    monthlyMilestones[0]?.id || ''
  );

  // Form states
  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState('2026-11-15');
  const [weekNumber, setWeekNumber] = useState(1);
  const [monthName, setMonthName] = useState('November 2026');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (mode === 'monthly') {
      onAddMonthly(title.trim(), monthName, targetDate);
    } else {
      const targetMonthlyId = selectedMonthlyId || monthlyMilestones[0]?.id;
      if (!targetMonthlyId) {
        onAddMonthly('Phase 1 Milestone', monthName, targetDate);
        return;
      }
      onAddWeekly(targetMonthlyId, title.trim(), weekNumber, targetDate);
    }

    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FFF2DC] border-2 border-[#D6A43B] rounded-3xl w-full max-w-md shadow-elevated overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#FFE0C2]/80 border-b border-[#D6A43B]/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flag size={18} className="text-[#F28C28]" />
            <h3 className="text-base font-bold text-[#49321F] font-display">
              Add Milestone to Goal
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#49321F]/10 text-[#49321F] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Goal context label */}
        <div className="px-6 py-2 bg-[#FFE0C2]/30 border-b border-[#D6A43B]/15 text-xs text-[#49321F]/80">
          Goal: <strong className="text-[#49321F] font-semibold">{goalTitle}</strong>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Milestone Level Selector */}
          <div>
            <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1.5">
              Milestone Tier
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode('weekly')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  mode === 'weekly'
                    ? 'border-[#F28C28] bg-white text-[#F28C28] shadow-xs'
                    : 'border-[#D6A43B]/30 bg-[#FFF5EB] text-[#49321F]/70'
                }`}
              >
                Weekly Milestone
              </button>
              <button
                type="button"
                onClick={() => setMode('monthly')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  mode === 'monthly'
                    ? 'border-[#F28C28] bg-white text-[#F28C28] shadow-xs'
                    : 'border-[#D6A43B]/30 bg-[#FFF5EB] text-[#49321F]/70'
                }`}
              >
                Monthly Phase
              </button>
            </div>
          </div>

          {/* If Weekly: Select Parent Monthly Milestone */}
          {mode === 'weekly' && monthlyMilestones.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1">
                Parent Monthly Phase
              </label>
              <select
                value={selectedMonthlyId}
                onChange={(e) => setSelectedMonthlyId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D6A43B]/40 bg-white text-[#49321F] text-sm"
              >
                {monthlyMilestones.map((mm) => (
                  <option key={mm.id} value={mm.id}>
                    {mm.month} — {mm.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1">
              Milestone Objective <span className="text-[#D94B83]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                mode === 'weekly'
                  ? 'e.g. Complete Unit 2 practice questions & mock test'
                  : 'e.g. Complete Backend Core & Deploy API'
              }
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D6A43B]/40 bg-white text-[#49321F] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#F28C28]"
            />
          </div>

          {/* Details Row */}
          <div className="grid grid-cols-2 gap-3">
            {mode === 'weekly' ? (
              <div>
                <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1">
                  Week Number
                </label>
                <select
                  value={weekNumber}
                  onChange={(e) => setWeekNumber(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#D6A43B]/40 bg-white text-[#49321F] text-sm"
                >
                  <option value={1}>Week 1</option>
                  <option value={2}>Week 2</option>
                  <option value={3}>Week 3</option>
                  <option value={4}>Week 4</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1">
                  Target Month
                </label>
                <input
                  type="text"
                  value={monthName}
                  onChange={(e) => setMonthName(e.target.value)}
                  placeholder="e.g. November 2026"
                  className="w-full px-3 py-2 rounded-xl border border-[#D6A43B]/40 bg-white text-[#49321F] text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1">
                Target Date
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-[#D6A43B]/40 bg-white text-[#49321F] text-sm"
              />
            </div>
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
              <span>Add Milestone</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
