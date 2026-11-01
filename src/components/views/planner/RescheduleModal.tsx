import React, { useState } from 'react';
import { ScheduleActivity } from '../../../types';
import {
  timeToMinutes,
  minutesToTime,
  formatTimeDisplay,
  calculateDuration,
  formatDurationHuman,
  formatDateKey,
  parseDateKey,
} from '../../../utils/scheduleStorage';
import { X, Calendar as CalendarIcon, Clock, ArrowRight, Check, Sparkles, ChevronRight } from 'lucide-react';
import { playVictoryChime, playTempleBell } from '../../../utils/audio';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: ScheduleActivity | null;
  onReschedule: (updatedActivity: ScheduleActivity) => void;
  soundEnabled?: boolean;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  isOpen,
  onClose,
  activity,
  onReschedule,
  soundEnabled = true,
}) => {
  if (!isOpen || !activity) return null;

  const [targetDate, setTargetDate] = useState(activity.date);
  const [targetStartTime, setTargetStartTime] = useState(activity.startTime);
  const [targetEndTime, setTargetEndTime] = useState(activity.endTime);

  const duration = calculateDuration(activity.startTime, activity.endTime);

  const handleShiftMinutes = (delta: number) => {
    const curStartMins = timeToMinutes(targetStartTime);
    let newStartMins = curStartMins + delta;
    if (newStartMins < 0) newStartMins = 0;
    if (newStartMins > 23 * 60 + 45) newStartMins = 23 * 60 + 45;

    const newStartTime = minutesToTime(newStartMins);
    const newEndTime = minutesToTime(newStartMins + duration);
    setTargetStartTime(newStartTime);
    setTargetEndTime(newEndTime);
  };

  const handleMoveToTomorrow = () => {
    const d = parseDateKey(targetDate);
    d.setDate(d.getDate() + 1);
    setTargetDate(formatDateKey(d));
  };

  const handleSave = () => {
    const updated: ScheduleActivity = {
      ...activity,
      date: targetDate,
      startTime: targetStartTime,
      endTime: targetEndTime,
      // If was recurring, rescheduling this specific slot to another date sets recurrence to none
      hasConflict: false,
      conflictDetails: undefined,
    };
    if (soundEnabled) playVictoryChime();
    onReschedule(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#FFF5EB] rounded-3xl shadow-2xl border-2 border-[#D6A43B]/40 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#D6A43B]/30 bg-gradient-to-r from-[#FFE0C2] to-[#FFF2DC]">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: activity.color }}
            >
              <Clock size={16} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#49321F] font-display">
                Reschedule Activity
              </h2>
              <p className="text-[11px] text-[#49321F]/70 truncate max-w-[220px]">
                {activity.title}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#49321F]/10 hover:bg-[#49321F]/20 flex items-center justify-center text-[#49321F] transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Current vs New comparison */}
          <div className="bg-white/80 p-3.5 rounded-2xl border border-[#D6A43B]/30 flex items-center justify-between text-xs font-semibold text-[#49321F]">
            <div>
              <span className="text-[10px] text-[#49321F]/60 uppercase tracking-wider block font-bold">
                Current Slot
              </span>
              <span className="font-bold">{activity.date}</span>
              <p className="text-[11px] text-[#49321F]/80">
                {formatTimeDisplay(activity.startTime)} – {formatTimeDisplay(activity.endTime)}
              </p>
            </div>

            <ArrowRight size={18} className="text-[#F28C28] shrink-0 mx-2" />

            <div>
              <span className="text-[10px] text-[#F28C28] uppercase tracking-wider block font-bold">
                New Target
              </span>
              <span className="font-bold text-[#F28C28]">{targetDate}</span>
              <p className="text-[11px] text-[#49321F]/80">
                {formatTimeDisplay(targetStartTime)} – {formatTimeDisplay(targetEndTime)}
              </p>
            </div>
          </div>

          {/* Quick Shift Presets */}
          <div>
            <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1.5">
              Quick Shift Time ({formatDurationHuman(duration)} slot)
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => handleShiftMinutes(-30)}
                className="py-1.5 px-2 bg-white hover:bg-[#FFE0C2] rounded-xl border border-[#D6A43B]/30 text-xs font-bold text-[#49321F] transition-all cursor-pointer text-center"
              >
                -30m
              </button>
              <button
                type="button"
                onClick={() => handleShiftMinutes(-15)}
                className="py-1.5 px-2 bg-white hover:bg-[#FFE0C2] rounded-xl border border-[#D6A43B]/30 text-xs font-bold text-[#49321F] transition-all cursor-pointer text-center"
              >
                -15m
              </button>
              <button
                type="button"
                onClick={() => handleShiftMinutes(15)}
                className="py-1.5 px-2 bg-white hover:bg-[#FFE0C2] rounded-xl border border-[#D6A43B]/30 text-xs font-bold text-[#49321F] transition-all cursor-pointer text-center"
              >
                +15m
              </button>
              <button
                type="button"
                onClick={() => handleShiftMinutes(30)}
                className="py-1.5 px-2 bg-white hover:bg-[#FFE0C2] rounded-xl border border-[#D6A43B]/30 text-xs font-bold text-[#49321F] transition-all cursor-pointer text-center"
              >
                +30m
              </button>
            </div>
          </div>

          {/* Date Picker & Move to Tomorrow */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#49321F] uppercase tracking-wider">
                Target Date
              </label>
              <button
                type="button"
                onClick={handleMoveToTomorrow}
                className="text-[11px] font-bold text-[#F28C28] hover:underline cursor-pointer flex items-center gap-0.5"
              >
                <span>Move to Tomorrow</span>
                <ChevronRight size={13} />
              </button>
            </div>
            <div className="relative">
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D6A43B]/50 bg-white text-xs font-bold text-[#49321F] focus:outline-none focus:ring-2 focus:ring-[#F28C28]"
              />
              <CalendarIcon size={15} className="absolute left-3 top-2.5 text-[#F28C28]" />
            </div>
          </div>

          {/* Exact Start Time & End Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#49321F] uppercase tracking-wider mb-1">
                Start Time
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={targetStartTime}
                  onChange={(e) => {
                    const newStart = e.target.value;
                    setTargetStartTime(newStart);
                    const endM = timeToMinutes(newStart) + duration;
                    setTargetEndTime(minutesToTime(endM));
                  }}
                  className="w-full pl-8 pr-2 py-2 rounded-xl border border-[#D6A43B]/50 bg-white text-xs font-bold text-[#49321F] focus:outline-none focus:ring-2 focus:ring-[#F28C28]"
                />
                <Clock size={14} className="absolute left-2.5 top-2.5 text-[#F28C28]" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#49321F] uppercase tracking-wider mb-1">
                End Time
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={targetEndTime}
                  onChange={(e) => setTargetEndTime(e.target.value)}
                  className="w-full pl-8 pr-2 py-2 rounded-xl border border-[#D6A43B]/50 bg-white text-xs font-bold text-[#49321F] focus:outline-none focus:ring-2 focus:ring-[#F28C28]"
                />
                <Clock size={14} className="absolute left-2.5 top-2.5 text-[#F28C28]" />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-[#D6A43B]/30">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#D6A43B]/40 bg-white text-xs font-bold text-[#49321F] hover:bg-[#FFE0C2] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#F28C28] to-[#D6A43B] text-white text-xs font-bold shadow-md hover:opacity-95 cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Check size={15} />
              <span>Confirm Reschedule</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
