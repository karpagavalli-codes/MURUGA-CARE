import React, { useState, useEffect } from 'react';
import { ScheduleActivity } from '../../../types';
import {
  CATEGORY_METAS,
  timeToMinutes,
  minutesToTime,
  formatTimeDisplay,
  calculateDuration,
  formatDurationHuman,
} from '../../../utils/scheduleStorage';
import {
  Clock,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Edit3,
  CalendarDays,
  Bell,
  Repeat,
  Plus,
  Trash2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { playTempleBell, playVictoryChime } from '../../../utils/audio';
import confetti from 'canvas-confetti';

interface DailyTimelineViewProps {
  date: string; // YYYY-MM-DD
  activities: ScheduleActivity[];
  onToggleComplete: (id: string) => void;
  onEditActivity: (activity: ScheduleActivity) => void;
  onDeleteActivity: (id: string) => void;
  onRescheduleActivity: (activity: ScheduleActivity) => void;
  onQuickShiftTime: (activity: ScheduleActivity, minutes: number) => void;
  onAddNew: () => void;
  onAutoOptimizeConflicts: () => void;
  soundEnabled?: boolean;
}

export const DailyTimelineView: React.FC<DailyTimelineViewProps> = ({
  date,
  activities,
  onToggleComplete,
  onEditActivity,
  onDeleteActivity,
  onRescheduleActivity,
  onQuickShiftTime,
  onAddNew,
  onAutoOptimizeConflicts,
  soundEnabled = true,
}) => {
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');
  const [currentMinutesNow, setCurrentMinutesNow] = useState<number>(0);

  // Update current time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      setCurrentTimeStr(`${h}:${m}`);
      setCurrentMinutesNow(now.getHours() * 60 + now.getMinutes());
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Sort activities chronologically by startTime
  const sortedActivities = [...activities].sort(
    (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  );

  const conflictCount = activities.filter((a) => a.hasConflict).length;
  const completedCount = activities.filter((a) => a.completed).length;

  const handleToggle = (act: ScheduleActivity) => {
    if (!act.completed) {
      if (soundEnabled) playVictoryChime();
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#F28C28', '#D6A43B', '#087F78', '#FFE0C2'],
      });
    } else {
      if (soundEnabled) playTempleBell(0.2);
    }
    onToggleComplete(act.id);
  };

  return (
    <div className="space-y-4">
      {/* Schedule Summary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[#FFF2DC] rounded-2xl border border-[#D6A43B]/30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="text-xs font-bold text-[#49321F]">
            Scheduled: <span className="text-[#F28C28]">{activities.length} activities</span>
          </div>
          <span className="text-xs text-[#49321F]/40">•</span>
          <div className="text-xs font-bold text-emerald-700">
            Completed: <span>{completedCount}/{activities.length}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {conflictCount > 0 && (
            <button
              type="button"
              onClick={onAutoOptimizeConflicts}
              className="px-3 py-1.5 rounded-xl bg-[#642D35] hover:bg-[#85343D] text-[#FFF2DC] font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer animate-pulse"
            >
              <Sparkles size={14} className="text-[#FFD166]" />
              <span>Optimize Conflicts ({conflictCount})</span>
            </button>
          )}

          <button
            type="button"
            onClick={onAddNew}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#F28C28] to-[#D6A43B] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs hover:opacity-95 active:scale-95 transition-all cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Activity</span>
          </button>
        </div>
      </div>

      {/* Overlap Conflict Alert Banner */}
      {conflictCount > 0 && (
        <div className="bg-gradient-to-r from-[#642D35] to-[#85343D] text-[#FFF2DC] p-4 rounded-2xl shadow-floating border border-[#D6A43B]/40 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#FFF2DC]/10 shrink-0">
              <AlertTriangle size={22} className="text-[#FFD166] animate-bounce" />
            </div>
            <div>
              <h3 className="font-bold text-sm font-display text-[#FFD166]">
                Schedule Collision Detected!
              </h3>
              <p className="text-xs text-[#FFF2DC]/90">
                {conflictCount} activities have overlapping time slots. Murugan can automatically shift them without losing duration.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onAutoOptimizeConflicts}
            className="px-4 py-2 rounded-xl bg-[#FFD166] hover:bg-[#FFE082] text-[#49321F] font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Sparkles size={15} className="text-[#F28C28]" />
            <span>Optimize with Murugan</span>
          </button>
        </div>
      )}

      {/* Live Current Time Line */}
      <div className="flex items-center gap-3 py-1">
        <span className="text-xs font-mono font-bold text-[#F28C28] bg-[#FFE0C2] px-2.5 py-1 rounded-lg border border-[#F28C28]/30 shrink-0 flex items-center gap-1.5 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#F28C28] animate-ping" />
          <span>{formatTimeDisplay(currentTimeStr) || 'NOW'}</span>
        </span>
        <div className="flex-1 h-[2px] bg-gradient-to-r from-[#F28C28] via-[#D6A43B] to-transparent relative">
          <span className="absolute -left-1 -top-1 w-2.5 h-2.5 rounded-full bg-[#F28C28]" />
        </div>
      </div>

      {/* Empty State */}
      {sortedActivities.length === 0 ? (
        <div className="bg-white/80 rounded-3xl p-8 border-2 border-dashed border-[#D6A43B]/40 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#FFE0C2] flex items-center justify-center mx-auto text-[#F28C28]">
            <Clock size={28} />
          </div>
          <h3 className="text-base font-bold text-[#49321F] font-display">
            No activities scheduled for this day
          </h3>
          <p className="text-xs text-[#49321F]/70 max-w-sm mx-auto">
            Plan your day with study blocks, college classes, workouts, or quiet meditation.
          </p>
          <button
            type="button"
            onClick={onAddNew}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F28C28] to-[#D6A43B] text-white font-bold text-xs shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus size={15} />
            <span>Create First Activity</span>
          </button>
        </div>
      ) : (
        /* Chronological Activity Feed */
        <div className="space-y-3">
          {sortedActivities.map((act) => {
            const isConflict = act.hasConflict;
            const duration = calculateDuration(act.startTime, act.endTime);
            const categoryMeta = CATEGORY_METAS[act.category] || CATEGORY_METAS.custom;
            const categoryLabel = act.category === 'custom' && act.customCategoryName
              ? act.customCategoryName
              : categoryMeta.label;

            return (
              <div
                key={act.id}
                className={`p-4 rounded-2xl border-2 transition-all relative overflow-hidden group shadow-xs ${
                  isConflict
                    ? 'bg-[#642D35]/10 border-[#642D35] border-dashed ring-2 ring-[#642D35]/20'
                    : act.completed
                    ? 'bg-emerald-50/70 border-emerald-300 opacity-85'
                    : 'bg-white hover:border-[#D6A43B] border-[#D6A43B]/30'
                }`}
              >
                {/* Left accent color strip */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-2"
                  style={{ backgroundColor: act.color || categoryMeta.defaultColor }}
                />

                <div className="pl-2 flex flex-col gap-2">
                  {/* Top Bar: Time, Category, Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      {/* Checkbox toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggle(act)}
                        className="text-[#49321F]/60 hover:text-emerald-600 transition-colors cursor-pointer"
                        title={act.completed ? 'Mark pending' : 'Mark completed'}
                      >
                        {act.completed ? (
                          <CheckCircle2 size={20} className="text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Circle size={20} />
                        )}
                      </button>

                      {/* Time pill */}
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#49321F] bg-[#FFE0C2]/80 px-2.5 py-1 rounded-lg border border-[#D6A43B]/30">
                        <Clock size={13} className="text-[#F28C28]" />
                        <span>
                          {formatTimeDisplay(act.startTime)} – {formatTimeDisplay(act.endTime)}
                        </span>
                        <span className="text-[10px] text-[#49321F]/60 ml-0.5">
                          ({formatDurationHuman(duration)})
                        </span>
                      </div>

                      {/* Category Badge */}
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: act.color || categoryMeta.defaultColor }}
                      >
                        {categoryLabel}
                      </span>

                      {/* Recurrence Badge */}
                      {act.recurrence && act.recurrence !== 'none' && (
                        <span className="text-[10px] font-bold text-[#49321F]/70 bg-black/5 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Repeat size={11} className="text-[#F28C28]" />
                          <span className="capitalize">{act.recurrence.replace('_', ' ')}</span>
                        </span>
                      )}

                      {/* Reminder Icon */}
                      {act.hasReminder && (
                        <span className="text-[10px] font-semibold text-[#F28C28] bg-[#FFE5D0]/80 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <Bell size={11} />
                          <span>{act.reminderMinutesBefore}m</span>
                        </span>
                      )}

                      {/* Task/Habit Link Badge */}
                      {act.taskId && (
                        <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                          Linked Task
                        </span>
                      )}
                      {act.habitId && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                          Linked Habit
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => onRescheduleActivity(act)}
                        className="px-2.5 py-1 bg-[#FFE0C2]/60 hover:bg-[#FFE0C2] text-[#49321F] rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                        title="Reschedule to another time or date"
                      >
                        <CalendarDays size={13} className="text-[#F28C28]" />
                        <span>Move</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onEditActivity(act)}
                        className="p-1.5 hover:bg-black/5 text-[#49321F] rounded-lg transition-colors cursor-pointer"
                        title="Edit Activity"
                      >
                        <Edit3 size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteActivity(act.id)}
                        className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors cursor-pointer"
                        title="Delete Activity"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="mt-1">
                    <h3
                      className={`text-sm sm:text-base font-bold text-[#49321F] ${
                        act.completed ? 'line-through text-[#49321F]/60' : ''
                      }`}
                    >
                      {act.title}
                    </h3>
                    {act.description && (
                      <p className="text-xs text-[#49321F]/70 mt-0.5 leading-relaxed">
                        {act.description}
                      </p>
                    )}
                  </div>

                  {/* Conflict Notice if overlapping */}
                  {isConflict && act.conflictDetails && (
                    <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-900 text-xs flex items-center justify-between gap-2 mt-1">
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle size={14} className="text-red-600 shrink-0" />
                        <span className="font-semibold">{act.conflictDetails}</span>
                      </div>
                      <button
                        type="button"
                        onClick={onAutoOptimizeConflicts}
                        className="px-2.5 py-1 bg-red-600 text-white rounded-lg text-[11px] font-bold hover:bg-red-700 cursor-pointer shrink-0"
                      >
                        Auto-Shift
                      </button>
                    </div>
                  )}

                  {/* Quick Reschedule Shifts (+15m, +30m, -15m) */}
                  <div className="flex items-center gap-2 pt-2 border-t border-black/5 text-xs text-[#49321F]/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Quick Shift:
                    </span>
                    <button
                      type="button"
                      onClick={() => onQuickShiftTime(act, -30)}
                      className="px-2 py-0.5 rounded-md bg-[#FFE5D0]/60 hover:bg-[#FFE0C2] text-[#49321F] text-[11px] font-bold cursor-pointer transition-all"
                    >
                      -30m
                    </button>
                    <button
                      type="button"
                      onClick={() => onQuickShiftTime(act, -15)}
                      className="px-2 py-0.5 rounded-md bg-[#FFE5D0]/60 hover:bg-[#FFE0C2] text-[#49321F] text-[11px] font-bold cursor-pointer transition-all"
                    >
                      -15m
                    </button>
                    <button
                      type="button"
                      onClick={() => onQuickShiftTime(act, 15)}
                      className="px-2 py-0.5 rounded-md bg-[#FFE5D0]/60 hover:bg-[#FFE0C2] text-[#49321F] text-[11px] font-bold cursor-pointer transition-all"
                    >
                      +15m
                    </button>
                    <button
                      type="button"
                      onClick={() => onQuickShiftTime(act, 30)}
                      className="px-2 py-0.5 rounded-md bg-[#FFE5D0]/60 hover:bg-[#FFE0C2] text-[#49321F] text-[11px] font-bold cursor-pointer transition-all"
                    >
                      +30m
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
