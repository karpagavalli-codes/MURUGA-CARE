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
import { ChevronLeft, ChevronRight, Plus, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

interface MonthlyCalendarViewProps {
  currentDate: string; // YYYY-MM-DD
  allActivities: ScheduleActivity[];
  onSelectDate: (dateStr: string) => void;
  onEditActivity: (activity: ScheduleActivity) => void;
  onAddNewForDate: (dateStr: string) => void;
}

export const MonthlyCalendarView: React.FC<MonthlyCalendarViewProps> = ({
  currentDate,
  allActivities,
  onSelectDate,
  onEditActivity,
  onAddNewForDate,
}) => {
  const current = parseDateKey(currentDate);
  const year = current.getFullYear();
  const month = current.getMonth(); // 0 to 11

  // First day of current month
  const firstDay = new Date(year, month, 1);
  // Last day of current month
  const lastDay = new Date(year, month + 1, 0);

  // Day of week of the first day (0=Sun, 1=Mon... normalize to Mon start)
  const firstDayOfWeek = firstDay.getDay();
  const leadingDays = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  // Total cells in grid (multiple of 7)
  const totalDaysInMonth = lastDay.getDate();
  const totalSlots = Math.ceil((leadingDays + totalDaysInMonth) / 7) * 7;

  const calendarCells = Array.from({ length: totalSlots }, (_, index) => {
    const dayOffset = index - leadingDays + 1;
    const d = new Date(year, month, dayOffset);
    const dateStr = formatDateKey(d);
    const isCurrentMonth = d.getMonth() === month;
    const isToday = dateStr === formatDateKey(new Date());
    const isSelected = dateStr === currentDate;
    const dayActivities = allActivities.filter((act) => activityAppliesToDate(act, dateStr));
    dayActivities.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

    return {
      date: d,
      dateStr,
      dayNumber: d.getDate(),
      isCurrentMonth,
      isToday,
      isSelected,
      activities: dayActivities,
    };
  });

  const monthLabel = current.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Activities for the currently selected date (for drilldown preview below the grid)
  const selectedDayActivities = allActivities.filter((act) => activityAppliesToDate(act, currentDate));
  selectedDayActivities.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  return (
    <div className="space-y-6">
      {/* Monthly Grid Container */}
      <div className="bg-[#FFF2DC] rounded-3xl p-4 sm:p-6 border border-[#D6A43B]/30 shadow-ambient space-y-4">
        {/* Month Header bar */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D6A43B]/25">
          <h2 className="text-lg sm:text-xl font-extrabold text-[#49321F] font-display">
            {monthLabel}
          </h2>
          <span className="text-xs text-[#49321F]/70 font-semibold">
            Click any day to view or schedule
          </span>
        </div>

        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs uppercase tracking-wider text-[#49321F]/60">
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
          <div>Sun</div>
        </div>

        {/* Calendar Cells */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {calendarCells.map((cell) => (
            <div
              key={cell.dateStr}
              onClick={() => onSelectDate(cell.dateStr)}
              className={`min-h-[75px] sm:min-h-[90px] p-1.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                cell.isSelected
                  ? 'bg-[#FFE0C2] border-[#F28C28] ring-2 ring-[#F28C28]/30 shadow-sm'
                  : cell.isToday
                  ? 'bg-amber-100/70 border-[#D6A43B]'
                  : cell.isCurrentMonth
                  ? 'bg-white hover:bg-[#FFE5D0]/40 border-black/5'
                  : 'bg-black/5 opacity-40 border-transparent'
              }`}
            >
              {/* Day Number + Badges */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold ${
                    cell.isToday
                      ? 'w-5 h-5 rounded-full bg-[#F28C28] text-white flex items-center justify-center'
                      : cell.isSelected
                      ? 'text-[#F28C28] font-extrabold'
                      : 'text-[#49321F]'
                  }`}
                >
                  {cell.dayNumber}
                </span>

                {cell.activities.length > 0 && (
                  <span className="text-[10px] font-bold text-[#49321F]/70 bg-black/5 px-1.5 rounded-full">
                    {cell.activities.length}
                  </span>
                )}
              </div>

              {/* Activity Chips / Dots */}
              <div className="space-y-1 mt-1">
                {cell.activities.slice(0, 2).map((act) => (
                  <div
                    key={act.id}
                    className="text-[9px] font-bold text-white px-1 py-0.5 rounded truncate"
                    style={{ backgroundColor: act.color || CATEGORY_METAS[act.category]?.defaultColor || '#F28C28' }}
                  >
                    {act.title}
                  </div>
                ))}

                {cell.activities.length > 2 && (
                  <span className="text-[9px] font-bold text-[#49321F]/60 block text-right pr-0.5">
                    +{cell.activities.length - 2} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Day Drilldown Preview */}
      <div className="bg-white/90 rounded-3xl p-5 border border-[#D6A43B]/30 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-[#49321F] font-display">
              Schedule for {new Date(currentDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </h3>
            <p className="text-xs text-[#49321F]/70">
              {selectedDayActivities.length} scheduled sessions
            </p>
          </div>

          <button
            type="button"
            onClick={() => onAddNewForDate(currentDate)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#F28C28] to-[#D6A43B] text-white text-xs font-bold shadow-xs hover:opacity-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} />
            <span>Add to this Day</span>
          </button>
        </div>

        {selectedDayActivities.length === 0 ? (
          <p className="text-xs text-[#49321F]/60 italic py-3 text-center">
            No activities scheduled for this date. Click "Add to this Day" to block time.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {selectedDayActivities.map((act) => {
              const meta = CATEGORY_METAS[act.category] || CATEGORY_METAS.custom;
              return (
                <div
                  key={act.id}
                  onClick={() => onEditActivity(act)}
                  className="p-3 rounded-2xl border border-[#D6A43B]/30 hover:border-[#D6A43B] bg-[#FFF5EB] hover:bg-white transition-all cursor-pointer flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-2.5 h-8 rounded-full shrink-0"
                      style={{ backgroundColor: act.color || meta.defaultColor }}
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#49321F] line-clamp-1">
                        {act.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-[#49321F]/70 font-mono mt-0.5">
                        <Clock size={11} className="text-[#F28C28]" />
                        <span>
                          {formatTimeDisplay(act.startTime)} – {formatTimeDisplay(act.endTime)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white shrink-0"
                    style={{ backgroundColor: act.color || meta.defaultColor }}
                  >
                    {act.category}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
