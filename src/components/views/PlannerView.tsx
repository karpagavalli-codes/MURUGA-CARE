import React, { useState, useEffect } from 'react';
import { ScheduleActivity, TaskItem, HabitItem, UserProfile } from '../../types';
import {
  loadScheduleActivities,
  saveScheduleActivities,
  detectConflictsForDate,
  resolveConflictsAutomatically,
  formatDateKey,
  parseDateKey,
  timeToMinutes,
  minutesToTime,
  calculateDuration,
} from '../../utils/scheduleStorage';
import { DailyTimelineView } from './planner/DailyTimelineView';
import { WeeklyCalendarView } from './planner/WeeklyCalendarView';
import { MonthlyCalendarView } from './planner/MonthlyCalendarView';
import { ActivityModal } from './planner/ActivityModal';
import { RescheduleModal } from './planner/RescheduleModal';
import { ImportTaskModal } from './planner/ImportTaskModal';
import { BalaMurugan } from '../mascot/BalaMurugan';
import { PeacockCornerMotif, VelIcon } from '../common/Decorations';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
  ListTodo,
  CheckCircle2,
  Clock,
  Layers,
  CalendarDays,
  CalendarRange,
} from 'lucide-react';
import { playTempleBell, playVictoryChime } from '../../utils/audio';

type CalendarViewMode = 'daily' | 'weekly' | 'monthly';

interface PlannerViewProps {
  tasks?: TaskItem[];
  onToggleTask?: (id: string) => void;
  habits?: HabitItem[];
  soundEnabled?: boolean;
  user?: UserProfile;
}

export const PlannerView: React.FC<PlannerViewProps> = ({
  tasks = [],
  onToggleTask,
  habits = [
    {
      id: 'h1',
      title: 'Drink 2.5L Theertham Water Daily',
      category: 'health',
      streakDays: 14,
      completedDays: [true, true, true, true, true, true, true],
      targetPerWeek: 7,
    },
    {
      id: 'h2',
      title: '10-Minute Morning Dhyanam & Chanting',
      category: 'spiritual',
      streakDays: 30,
      completedDays: [true, true, true, true, true, true, false],
      targetPerWeek: 7,
    },
    {
      id: 'h3',
      title: 'Read 15 Pages of Deep Book',
      category: 'learning',
      streakDays: 7,
      completedDays: [true, true, false, true, true, true, false],
      targetPerWeek: 5,
    },
  ],
  soundEnabled = true,
  user,
}) => {
  // Master activities state initialized from LocalStorage
  const [activities, setActivities] = useState<ScheduleActivity[]>(() => loadScheduleActivities());

  // Active viewed date (YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState<string>(() => formatDateKey(new Date()));

  // Active Calendar View: 'daily' | 'weekly' | 'monthly'
  const [viewMode, setViewMode] = useState<CalendarViewMode>('daily');

  // Modals state
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ScheduleActivity | null>(null);

  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [reschedulingActivity, setReschedulingActivity] = useState<ScheduleActivity | null>(null);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [optimizationNotice, setOptimizationNotice] = useState<string | null>(null);

  // Sync conflicts whenever activities or selectedDate changes
  useEffect(() => {
    setActivities((prev) => detectConflictsForDate(prev, selectedDate));
  }, [selectedDate]);

  // Persist activities to LocalStorage whenever modified
  const updateActivitiesAndPersist = (newActivities: ScheduleActivity[]) => {
    const withConflicts = detectConflictsForDate(newActivities, selectedDate);
    setActivities(withConflicts);
    saveScheduleActivities(withConflicts);
  };

  // Date Navigation handlers
  const handleShiftDate = (direction: 'prev' | 'next') => {
    if (soundEnabled) playTempleBell(0.15);
    const d = parseDateKey(selectedDate);
    const delta = direction === 'prev' ? -1 : 1;

    if (viewMode === 'daily') {
      d.setDate(d.getDate() + delta);
    } else if (viewMode === 'weekly') {
      d.setDate(d.getDate() + delta * 7);
    } else {
      d.setMonth(d.getMonth() + delta);
    }
    setSelectedDate(formatDateKey(d));
  };

  const handleJumpToToday = () => {
    if (soundEnabled) playTempleBell(0.2);
    setSelectedDate(formatDateKey(new Date()));
  };

  // Activity Handlers
  const handleSaveActivity = (activity: ScheduleActivity) => {
    setActivities((prev) => {
      const exists = prev.some((a) => a.id === activity.id);
      let updated: ScheduleActivity[];
      if (exists) {
        updated = prev.map((a) => (a.id === activity.id ? activity : a));
      } else {
        updated = [activity, ...prev];
      }
      saveScheduleActivities(updated);
      return detectConflictsForDate(updated, selectedDate);
    });
  };

  const handleDeleteActivity = (id: string) => {
    setActivities((prev) => {
      const filtered = prev.filter((a) => a.id !== id);
      saveScheduleActivities(filtered);
      return detectConflictsForDate(filtered, selectedDate);
    });
  };

  const handleToggleComplete = (id: string) => {
    setActivities((prev) => {
      const updated = prev.map((act) => {
        if (act.id === id) {
          const nextState = !act.completed;
          // Synchronize with linked Task if present
          if (act.taskId && onToggleTask) {
            onToggleTask(act.taskId);
          }
          return { ...act, completed: nextState };
        }
        return act;
      });
      saveScheduleActivities(updated);
      return updated;
    });
  };

  const handleQuickShiftTime = (activity: ScheduleActivity, minutesToAdd: number) => {
    if (soundEnabled) playTempleBell(0.2);
    const startMins = timeToMinutes(activity.startTime);
    const duration = calculateDuration(activity.startTime, activity.endTime);
    const newStart = Math.max(0, Math.min(23 * 60, startMins + minutesToAdd));
    const newEnd = Math.min(23 * 60 + 59, newStart + duration);

    const updated: ScheduleActivity = {
      ...activity,
      startTime: minutesToTime(newStart),
      endTime: minutesToTime(newEnd),
      hasConflict: false,
      conflictDetails: undefined,
    };

    handleSaveActivity(updated);
  };

  // Smart Optimization Action
  const handleAutoOptimize = () => {
    if (soundEnabled) playVictoryChime();
    const resolved = resolveConflictsAutomatically(activities, selectedDate);
    updateActivitiesAndPersist(resolved);
    setOptimizationNotice('Aahaa! Schedule optimized cleanly. Overlaps resolved sequentially without losing duration!');
    setTimeout(() => setOptimizationNotice(null), 5000);
  };

  // Open modals
  const handleOpenCreateModal = (dateStr?: string) => {
    if (dateStr) setSelectedDate(dateStr);
    setEditingActivity(null);
    setIsActivityModalOpen(true);
  };

  const handleOpenEditModal = (activity: ScheduleActivity) => {
    setEditingActivity(activity);
    setIsActivityModalOpen(true);
  };

  const handleOpenRescheduleModal = (activity: ScheduleActivity) => {
    setReschedulingActivity(activity);
    setIsRescheduleModalOpen(true);
  };

  // Day filter
  const dayActivities = activities.filter((act) => {
    // Basic day match or recurrence
    if (act.recurrence === 'none') return act.date === selectedDate;
    if (selectedDate < act.date) return false;
    const target = parseDateKey(selectedDate);
    const day = target.getDay();
    if (act.recurrence === 'daily') return true;
    if (act.recurrence === 'weekdays') return day >= 1 && day <= 5;
    if (act.recurrence === 'weekly') return target.getDay() === parseDateKey(act.date).getDay();
    if (act.recurrence === 'custom_days') return act.recurrenceDays?.includes(day);
    return act.date === selectedDate;
  });

  const conflictsOnSelectedDate = dayActivities.filter((a) => a.hasConflict).length;
  const isAllDayCompleted = dayActivities.length > 0 && dayActivities.every((a) => a.completed);

  // Mascot dynamic pose & message
  let mascotPose = 'blessing';
  let mascotTamilQuote = 'Vanakkan Kanna! Innaiku schedule-ah super-ah execute pannuvom!';
  let mascotSubQuote = 'Structure your hours with calm discipline and mindful breaks.';

  if (conflictsOnSelectedDate > 0) {
    mascotPose = 'worried';
    mascotTamilQuote = 'Aiyyo Kanna! Schedule collision irukku!';
    mascotSubQuote = 'Two activities overlap on your timeline. Click "Optimize with Murugan" to resolve effortlessly.';
  } else if (isAllDayCompleted) {
    mascotPose = 'celebrating';
    mascotTamilQuote = 'Aahaa! Innaiku plan full-ah complete pannitiye Kanna! 🎉';
    mascotSubQuote = 'Every scheduled session was fulfilled with holy dedication. Super proud of you!';
  } else if (dayActivities.length === 0) {
    mascotPose = 'thinking';
    mascotTamilQuote = 'Kanna, innaiku schedule empty-ah irukke!';
    mascotSubQuote = 'Add study hours, college lectures, workouts, or rest blocks to build your flow.';
  }

  // Format header date label
  const currentDateObj = parseDateKey(selectedDate);
  const formattedDateTitle = currentDateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Planner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#49321F] font-display">
              Personal Daily Planner
            </h1>
            <span className="text-xs font-bold uppercase tracking-wider bg-[#FFE0C2] text-[#F28C28] px-2.5 py-0.5 rounded-full border border-[#D6A43B]/40">
              Fully Editable
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#49321F]/70">
            Control your day, block deep work intervals, set custom reminders, and sync habits
          </p>
        </div>

        {/* Action Buttons: Add + Import */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#FFE0C2] text-[#49321F] border border-[#D6A43B]/40 font-bold text-xs shadow-2xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            title="Import existing tasks and habits into the schedule"
          >
            <ListTodo size={14} className="text-[#F28C28]" />
            <span className="hidden sm:inline">Schedule from</span>
            <span>Tasks & Habits</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenCreateModal()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#F28C28] to-[#D6A43B] text-white font-bold text-xs shadow-md hover:opacity-95 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={16} />
            <span>New Activity</span>
          </button>
        </div>
      </div>

      {/* Date Navigation & View Switcher Bar */}
      <div className="bg-[#FFF2DC] p-4 rounded-3xl border border-[#D6A43B]/30 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Date Navigator */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
          <button
            type="button"
            onClick={() => handleShiftDate('prev')}
            className="w-8 h-8 rounded-xl bg-white/80 hover:bg-white text-[#49321F] border border-[#D6A43B]/30 flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-2xs"
            title="Previous"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-[#D6A43B]/40 shadow-xs">
            <CalendarIcon size={16} className="text-[#F28C28]" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs sm:text-sm font-bold text-[#49321F] font-display bg-transparent border-none focus:outline-none cursor-pointer"
            />
          </div>

          <button
            type="button"
            onClick={() => handleShiftDate('next')}
            className="w-8 h-8 rounded-xl bg-white/80 hover:bg-white text-[#49321F] border border-[#D6A43B]/30 flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-2xs"
            title="Next"
          >
            <ChevronRight size={18} />
          </button>

          <button
            type="button"
            onClick={handleJumpToToday}
            className="px-3 py-1.5 rounded-xl bg-[#FFE5D0] hover:bg-[#FFE0C2] text-[#49321F] font-bold text-xs border border-[#D6A43B]/30 cursor-pointer transition-all active:scale-95"
          >
            Today
          </button>
        </div>

        {/* View Mode Switcher: Daily Timeline / Weekly / Monthly */}
        <div className="flex items-center gap-1 bg-white/80 p-1 rounded-2xl border border-[#D6A43B]/30 w-full md:w-auto justify-center">
          <button
            type="button"
            onClick={() => setViewMode('daily')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'daily'
                ? 'bg-gradient-to-r from-[#F28C28] to-[#D6A43B] text-white shadow-xs'
                : 'text-[#49321F]/70 hover:text-[#49321F]'
            }`}
          >
            <Clock size={14} />
            <span>Daily Timeline</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('weekly')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'weekly'
                ? 'bg-gradient-to-r from-[#F28C28] to-[#D6A43B] text-white shadow-xs'
                : 'text-[#49321F]/70 hover:text-[#49321F]'
            }`}
          >
            <CalendarDays size={14} />
            <span>Weekly</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('monthly')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'monthly'
                ? 'bg-gradient-to-r from-[#F28C28] to-[#D6A43B] text-white shadow-xs'
                : 'text-[#49321F]/70 hover:text-[#49321F]'
            }`}
          >
            <CalendarRange size={14} />
            <span>Monthly</span>
          </button>
        </div>
      </div>

      {/* Mascot Companion Guidance Card */}
      <div className="bg-gradient-to-r from-[#FFF2DC] via-[#FFE5D0]/80 to-[#FFF2DC] rounded-3xl p-4 sm:p-5 border border-[#D6A43B]/40 shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-center gap-4">
        <PeacockCornerMotif position="top-right" size={24} className="absolute top-2 right-2 opacity-50" />

        <div className="shrink-0 flex items-center justify-center">
          <BalaMurugan
            pose={mascotPose as any}
            size={120}
            showCloud={false}
            interactive={true}
          />
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-1.5">
            <VelIcon size={14} glow={true} />
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#F28C28] font-display">
              Murugan's Schedule Guidance
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-extrabold text-[#49321F] font-display">
            "{mascotTamilQuote}"
          </h3>
          <p className="text-xs text-[#49321F]/80 leading-relaxed">
            {mascotSubQuote}
          </p>

          {conflictsOnSelectedDate > 0 && (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleAutoOptimize}
                className="px-4 py-1.5 rounded-xl bg-[#642D35] hover:bg-[#85343D] text-[#FFF2DC] font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer mx-auto sm:mx-0"
              >
                <Sparkles size={14} className="text-[#FFD166]" />
                <span>Optimize Conflicts with Murugan</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Optimization Toast Notification */}
      {optimizationNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center gap-2 text-xs font-bold animate-fadeIn shadow-xs">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{optimizationNotice}</span>
        </div>
      )}

      {/* Active Calendar View Content */}
      <div className="bg-[#FFF2DC]/50 rounded-3xl p-4 sm:p-6 border border-[#D6A43B]/30 shadow-ambient">
        {viewMode === 'daily' && (
          <DailyTimelineView
            date={selectedDate}
            activities={dayActivities}
            onToggleComplete={handleToggleComplete}
            onEditActivity={handleOpenEditModal}
            onDeleteActivity={handleDeleteActivity}
            onRescheduleActivity={handleOpenRescheduleModal}
            onQuickShiftTime={handleQuickShiftTime}
            onAddNew={() => handleOpenCreateModal()}
            onAutoOptimizeConflicts={handleAutoOptimize}
            soundEnabled={soundEnabled}
          />
        )}

        {viewMode === 'weekly' && (
          <WeeklyCalendarView
            currentDate={selectedDate}
            allActivities={activities}
            onSelectDate={(date) => {
              setSelectedDate(date);
              setViewMode('daily');
            }}
            onEditActivity={handleOpenEditModal}
            onAddNewForDate={(date) => handleOpenCreateModal(date)}
          />
        )}

        {viewMode === 'monthly' && (
          <MonthlyCalendarView
            currentDate={selectedDate}
            allActivities={activities}
            onSelectDate={(date) => setSelectedDate(date)}
            onEditActivity={handleOpenEditModal}
            onAddNewForDate={(date) => handleOpenCreateModal(date)}
          />
        )}
      </div>

      {/* Create / Edit Activity Modal */}
      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onSave={handleSaveActivity}
        onDelete={handleDeleteActivity}
        initialActivity={editingActivity}
        selectedDate={selectedDate}
        existingActivities={dayActivities}
        soundEnabled={soundEnabled}
      />

      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
        activity={reschedulingActivity}
        onReschedule={handleSaveActivity}
        soundEnabled={soundEnabled}
      />

      {/* Import Task / Habit Modal */}
      <ImportTaskModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        tasks={tasks}
        habits={habits}
        selectedDate={selectedDate}
        onScheduleItem={handleSaveActivity}
        soundEnabled={soundEnabled}
      />
    </div>
  );
};
