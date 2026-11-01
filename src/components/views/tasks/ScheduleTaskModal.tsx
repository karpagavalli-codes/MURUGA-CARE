import React, { useState } from 'react';
import { TaskItem, ScheduleActivity } from '../../../types';
import { X, Calendar, Clock, Sparkles } from 'lucide-react';
import { playVictoryChime, playTempleBell } from '../../../utils/audio';

interface ScheduleTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskItem;
  onSchedule: (activity: ScheduleActivity) => void;
  soundEnabled?: boolean;
}

export const ScheduleTaskModal: React.FC<ScheduleTaskModalProps> = ({
  isOpen,
  onClose,
  task,
  onSchedule,
  soundEnabled = true,
}) => {
  const [date, setDate] = useState(task.dueDate || '2026-11-01');
  const [startTime, setStartTime] = useState('09:00');
  const [durationMinutes, setDurationMinutes] = useState(task.estimatedMinutes || 60);
  const [color, setColor] = useState('#2455A4');
  const [hasReminder, setHasReminder] = useState(true);

  if (!isOpen) return null;

  // Calculate end time
  const calculateEndTime = (start: string, duration: number) => {
    const [h, m] = start.split(':').map(Number);
    const totalMinutes = h * 60 + m + duration;
    const endH = Math.min(23, Math.floor(totalMinutes / 60));
    const endM = totalMinutes % 60;
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (soundEnabled) playVictoryChime();

    const endTime = calculateEndTime(startTime, durationMinutes);

    const activity: ScheduleActivity = {
      id: `act-task-${task.id}-${Date.now()}`,
      title: task.title,
      description: task.notes || `Scheduled task from Tasks view`,
      date,
      startTime,
      endTime,
      category: task.category === 'spiritual' ? 'personal' : (task.category as any),
      color,
      hasReminder,
      reminderMinutesBefore: 10,
      recurrence: 'none',
      completed: task.completed,
      taskId: task.id,
      createdAt: new Date().toISOString(),
    };

    onSchedule(activity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FFF2DC] border-2 border-[#D6A43B] rounded-3xl w-full max-w-md shadow-elevated overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#FFE0C2]/80 border-b border-[#D6A43B]/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-[#F28C28]" />
            <h3 className="text-base font-bold text-[#49321F] font-display">
              Schedule Task into Planner
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

        {/* Task Title Context */}
        <div className="px-6 py-3 bg-[#FFE0C2]/30 border-b border-[#D6A43B]/15">
          <span className="text-xs text-[#49321F]/70 font-semibold block">Selected Task:</span>
          <span className="text-sm font-bold text-[#49321F]">{task.title}</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1">
              Scheduled Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3.5 py-2 rounded-xl border border-[#D6A43B]/40 bg-white text-[#49321F] text-sm"
            />
          </div>

          {/* Start Time & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-[#D6A43B]/40 bg-white text-[#49321F] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1">
                Duration
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#D6A43B]/40 bg-white text-[#49321F] text-sm"
              >
                <option value={15}>15 mins</option>
                <option value={30}>30 mins</option>
                <option value={45}>45 mins</option>
                <option value={60}>60 mins</option>
                <option value={90}>90 mins</option>
                <option value={120}>2 hours</option>
              </select>
            </div>
          </div>

          {/* Color & Reminder */}
          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#49321F]">
              <input
                type="checkbox"
                checked={hasReminder}
                onChange={(e) => setHasReminder(e.target.checked)}
                className="rounded text-[#F28C28] focus:ring-[#F28C28]"
              />
              <span>Set 10-minute reminder</span>
            </label>
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
              <span>Schedule into Planner</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
