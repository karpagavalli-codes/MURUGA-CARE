import React from 'react';
import { ScheduleActivity } from '../../../types';
import {
  activityAppliesToDate,
  formatDateKey,
  parseDateKey,
  formatTimeDisplay,
  CATEGORY_METAS,
  timeToMinutes,
} from '../../../utils/scheduleStorage';
import { Plus, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface WeeklyCalendarViewProps {
  currentDate: string; // YYYY-MM-DD
  allActivities: ScheduleActivity[];
  onSelectDate: (dateStr: string) => void;
  onEditActivity: (activity: ScheduleActivity) => void;
  onAddNewForDate: (dateStr: string) => void;
}

export const WeeklyCalendarView: React.FC<WeeklyCalendarViewProps> = ({
  currentDate,
  allActivities,
  onSelectDate,
  onEditActivity,
  onAddNewForDate,
}) => {
  const current = parseDateKey(currentDate);

  // Compute Monday of the current week (assuming Monday is start of week)
  const dayIndex = current.getDay(); // 0 is Sun, 1 is Mon...
  const diffToMonday = dayIndex === 0 ? -6 : 1 - dayIndex;
  const monday = new Date(current);
  monday.setDate(current.getDate() + diffToMonday);

  // Generate 7 days of the week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = formatDateKey(d);
    const isToday = dateStr === formatDateKey(new Date());
    const isSelected = dateStr === currentDate;
    const dayActivities = allActivities.filter((act) => activityAppliesToDate(act, dateStr));
    dayActivities.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

    return {
      date: d,
      dateStr,
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      isToday,
      isSelected,
      activities: dayActivities,
    };
  });

  return (
    <div className="space-y-4">
      {/* 7-Day Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {weekDays.map((col) => (
          <div
            key={col.dateStr}
            className={`rounded-2xl border-2 transition-all flex flex-col min-h-[360px] overflow-hidden ${
              col.isSelected
                ? 'bg-[#FFF2DC] border-[#F28C28] shadow-md ring-2 ring-[#F28C28]/20'
                : col.isToday
                ? 'bg-amber-50/60 border-[#D6A43B]'
                : 'bg-white/80 border-[#D6A43B]/30 hover:border-[#D6A43B]/60'
            }`}
          >
            {/* Column Day Header */}
            <div
              onClick={() => onSelectDate(col.dateStr)}
              className={`p-3 border-b flex items-center justify-between cursor-pointer transition-colors ${
                col.isSelected
                  ? 'bg-[#FFE0C2] border-[#F28C28]/40'
                  : 'bg-[#FFE5D0]/30 border-[#D6A43B]/20 hover:bg-[#FFE5D0]/60'
              }`}
            >
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#49321F]/70 block">
                  {col.dayName}
                </span>
                <span className="text-base font-extrabold text-[#49321F] font-display">
                  {col.dayNumber}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {col.isToday && (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#F28C28] text-white">
                    Today
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddNewForDate(col.dateStr);
                  }}
                  className="w-6 h-6 rounded-lg bg-white/80 hover:bg-white text-[#F28C28] border border-[#D6A43B]/30 flex items-center justify-center cursor-pointer transition-all active:scale-90"
                  title={`Add activity for ${col.dateStr}`}
                >
                  <Plus size={13} />
                </button>
              </div>
            </div>

            {/* Activities in Day */}
            <div className="p-2 space-y-2 flex-1 overflow-y-auto max-h-[460px]">
              {col.activities.length === 0 ? (
                <div
                  onClick={() => onAddNewForDate(col.dateStr)}
                  className="h-full min-h-[100px] flex flex-col items-center justify-center text-center p-3 text-[#49321F]/40 hover:text-[#F28C28] cursor-pointer rounded-xl border border-dashed border-transparent hover:border-[#F28C28]/40 transition-all group"
                >
                  <Plus size={16} className="mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-medium">Free day</span>
                </div>
              ) : (
                col.activities.map((act) => {
                  const meta = CATEGORY_METAS[act.category] || CATEGORY_METAS.custom;
                  return (
                    <div
                      key={act.id}
                      onClick={() => onEditActivity(act)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer relative group hover:shadow-xs ${
                        act.hasConflict
                          ? 'bg-red-50 border-red-300 ring-1 ring-red-300'
                          : act.completed
                          ? 'bg-emerald-50/60 border-emerald-200 opacity-80'
                          : 'bg-white hover:border-[#D6A43B] border-black/5'
                      }`}
                    >
                      {/* Color accent line */}
                      <div
                        className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r"
                        style={{ backgroundColor: act.color || meta.defaultColor }}
                      />

                      <div className="pl-1.5">
                        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#49321F]/70 mb-0.5">
                          <span className="truncate">
                            {formatTimeDisplay(act.startTime)}
                          </span>
                          {act.hasConflict ? (
                            <AlertTriangle size={11} className="text-red-600" />
                          ) : act.completed ? (
                            <CheckCircle2 size={11} className="text-emerald-600" />
                          ) : null}
                        </div>

                        <h4
                          className={`text-xs font-bold text-[#49321F] line-clamp-2 leading-tight ${
                            act.completed ? 'line-through text-[#49321F]/60' : ''
                          }`}
                        >
                          {act.title}
                        </h4>

                        <span
                          className="text-[9px] font-bold px-1.5 py-0.2 rounded text-white mt-1.5 inline-block truncate max-w-full"
                          style={{ backgroundColor: act.color || meta.defaultColor }}
                        >
                          {act.category === 'custom' && act.customCategoryName ? act.customCategoryName : meta.label}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
