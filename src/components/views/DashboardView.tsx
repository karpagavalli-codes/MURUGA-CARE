import React from 'react';
import { BalaMurugan } from '../mascot/BalaMurugan';
import { PeacockCornerMotif, VelIcon } from '../common/Decorations';
import { TaskItem, UserProfile, CharacterPose, GoalItem, HabitItem, ScheduleActivity } from '../../types';
import {
  CheckSquare,
  Clock,
  Droplets,
  Plus,
  Play,
  Sparkles,
  Calendar,
  Target,
  Flame,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { playWaterDrop, playTempleBell } from '../../utils/audio';

interface DashboardViewProps {
  user: UserProfile;
  tasks: TaskItem[];
  goals?: GoalItem[];
  habits?: HabitItem[];
  activities?: ScheduleActivity[];
  waterDrankMl: number;
  focusMinutesToday: number;
  screenTimeMinutesToday: number;
  onNavigateTab: (tab: string) => void;
  onQuickAddWater: (amountMl: number) => void;
  onToggleTask: (id: string) => void;
  onOpenNewTaskModal: () => void;
  onTriggerParandhuVaa: (customPose?: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  tasks,
  goals = [],
  habits = [],
  activities = [],
  waterDrankMl,
  focusMinutesToday,
  screenTimeMinutesToday,
  onNavigateTab,
  onQuickAddWater,
  onToggleTask,
  onOpenNewTaskModal,
  onTriggerParandhuVaa,
}) => {
  const [heroPose, setHeroPose] = React.useState<CharacterPose>('blessing');

  // Task metrics
  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const totalTasksCount = tasks.length;
  const taskPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;
  const highPriorityPending = tasks.filter((t) => t.priority === 3 && !t.completed);

  // Water metrics
  const waterPercent = Math.min(100, Math.round((waterDrankMl / user.dailyWaterTargetMl) * 100));

  // Habits metrics
  const habitsDoneToday = habits.filter((h) => h.completedDays[6]).length;
  const totalHabits = habits.length;

  // Goals metrics
  const activeGoalsCount = goals.filter((g) => g.status === 'active').length;

  // Schedule activities for today (2026-11-01)
  const todayActivities = activities.filter((a) => a.date === '2026-11-01');

  // Current formatted date
  const todayFormatted = 'Sunday, 1 November 2026';

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* 1. Official Hero Welcome Sanctuary Card */}
      <div className="relative bg-[#FFF5EB] border-2 border-[#D6A43B] rounded-[36px] p-6 sm:p-8 shadow-ambient overflow-hidden flex flex-col items-center text-center w-full max-w-full">
        <PeacockCornerMotif position="top-right" size={32} className="absolute top-4 right-4" />

        {/* Date kicker */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE0C2] text-[#49321F] text-xs font-semibold border border-[#D6A43B]/30 mb-2">
          <Calendar size={13} className="text-[#F28C28]" />
          <span>{todayFormatted}</span>
        </div>

        {/* Centered Heading & Devotional Subtitle */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#49321F] font-display mb-2 flex items-center justify-center gap-2 max-w-full flex-wrap">
          <span>Vanakkam, {user.nickname || 'Kanna'}!</span>
          <span className="text-[#F28C28]">✨</span>
        </h1>

        <p className="text-base sm:text-lg lg:text-xl font-semibold italic text-[#642D35] mb-2 font-display px-2">
          "Innaiku namma day-ah super-ah plan pannalama?"
        </p>

        <p className="text-xs sm:text-sm text-[#49321F]/80 max-w-md sm:max-w-lg mb-4 leading-relaxed font-sans px-3">
          Your personal productivity companion. Harmonize your tasks, daily schedule, sacred habits, and healthy hydration.
        </p>

        {/* Prominent Standalone Bala Murugan 3D Illustration */}
        <div
          className="relative cursor-pointer hover:scale-105 transition-transform my-3 flex flex-col items-center justify-center group"
          onClick={() => {
            if (user.soundEnabled) playTempleBell(0.4);
            setHeroPose((p: CharacterPose) => (p === 'blessing' ? 'thinking' : 'blessing'));
          }}
          title="Click Bala Murugan for blessing chime & pose toggle"
        >
          <BalaMurugan pose={heroPose} size={220} showCloud={true} />
          <span className="text-[10px] text-[#49321F]/70 group-hover:text-[#F28C28] transition-colors mt-[-4px] bg-[#FFE0C2]/70 px-3 py-0.5 rounded-full border border-[#D6A43B]/30 font-display">
            {heroPose === 'blessing' ? '✨ 3D Guardian Companion (Click for Thinking pose)' : '🤔 3D Thinking Mode (Click for Blessing pose)'}
          </span>
        </div>

        {/* Quick Action Buttons Directly Underneath Murugan */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 w-full max-w-xl mt-2">
          <button
            type="button"
            onClick={onOpenNewTaskModal}
            className="px-4 py-2.5 rounded-full bg-[#F28C28] hover:bg-[#E07917] text-white text-xs sm:text-sm font-bold active:scale-95 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Task</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('planner')}
            className="px-4 py-2.5 rounded-full bg-[#2455A4] hover:bg-[#1A4384] text-white text-xs sm:text-sm font-bold active:scale-95 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar size={15} />
            <span>Plan Activity</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('goals')}
            className="px-4 py-2.5 rounded-full bg-[#087F78] hover:bg-[#06645F] text-white text-xs sm:text-sm font-bold active:scale-95 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Target size={15} />
            <span>Create Goal</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('habits')}
            className="px-4 py-2.5 rounded-full bg-[#D6A43B] hover:bg-[#C2912D] text-white text-xs sm:text-sm font-bold active:scale-95 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Flame size={15} />
            <span>Track Habit</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playWaterDrop();
              onQuickAddWater(250);
            }}
            className="px-4 py-2.5 rounded-full bg-white hover:bg-[#FFE0C2] text-[#49321F] text-xs sm:text-sm font-bold active:scale-95 transition-all shadow-sm flex items-center gap-1.5 border border-[#D6A43B]/40 cursor-pointer"
          >
            <Droplets size={15} className="text-[#2455A4]" />
            <span>+250ml Water</span>
          </button>
        </div>
      </div>

      {/* 2. Primary 6-Card Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Tasks Progress */}
        <div
          onClick={() => onNavigateTab('tasks')}
          className="bg-[#FFF2DC] border-2 border-[#D6A43B]/40 hover:border-[#F28C28] rounded-3xl p-5 shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#2455A4]/15 text-[#2455A4] flex items-center justify-center font-bold">
                <CheckSquare size={18} />
              </div>
              <h3 className="font-bold text-[#49321F] font-display text-base">
                Daily Tasks
              </h3>
            </div>
            <ArrowRight size={16} className="text-[#49321F]/40 group-hover:text-[#F28C28] transition-colors" />
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-[#49321F] font-mono tabular-nums">
                {completedTasksCount} / {totalTasksCount}
              </span>
              <span className="text-xs font-bold text-[#087F78]">{taskPercent}% complete</span>
            </div>

            <div className="w-full h-2 bg-[#FFE0C2] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#2455A4] to-[#087F78] rounded-full transition-all"
                style={{ width: `${taskPercent}%` }}
              />
            </div>

            <p className="text-xs text-[#49321F]/70 pt-1">
              {highPriorityPending.length > 0 ? (
                <span className="text-[#D94B83] font-semibold">
                  ⚠️ {highPriorityPending.length} high priority task pending today
                </span>
              ) : (
                'All high-priority tasks conquered!'
              )}
            </p>
          </div>
        </div>

        {/* Card 2: Daily Planner & Schedule */}
        <div
          onClick={() => onNavigateTab('planner')}
          className="bg-[#FFF2DC] border-2 border-[#D6A43B]/40 hover:border-[#F28C28] rounded-3xl p-5 shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#F28C28]/15 text-[#F28C28] flex items-center justify-center font-bold">
                <Calendar size={18} />
              </div>
              <h3 className="font-bold text-[#49321F] font-display text-base">
                Daily Planner
              </h3>
            </div>
            <ArrowRight size={16} className="text-[#49321F]/40 group-hover:text-[#F28C28] transition-colors" />
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-[#49321F] font-mono tabular-nums">
                {todayActivities.length} Blocks
              </span>
              <span className="text-xs font-bold text-[#2455A4]">Timeline View</span>
            </div>

            <p className="text-xs text-[#49321F]/70">
              {todayActivities.length > 0
                ? `Next: ${todayActivities[0].title} (${todayActivities[0].startTime})`
                : 'Schedule your morning routine and deep work slots.'}
            </p>
          </div>
        </div>

        {/* Card 3: Goals & Milestones */}
        <div
          onClick={() => onNavigateTab('goals')}
          className="bg-[#FFF2DC] border-2 border-[#D6A43B]/40 hover:border-[#F28C28] rounded-3xl p-5 shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#087F78]/15 text-[#087F78] flex items-center justify-center font-bold">
                <Target size={18} />
              </div>
              <h3 className="font-bold text-[#49321F] font-display text-base">
                Strategic Goals
              </h3>
            </div>
            <ArrowRight size={16} className="text-[#49321F]/40 group-hover:text-[#F28C28] transition-colors" />
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-[#49321F] font-mono tabular-nums">
                {activeGoalsCount} Active
              </span>
              <span className="text-xs font-bold text-[#087F78]">Milestone Driven</span>
            </div>

            <p className="text-xs text-[#49321F]/70">
              Long-term ambitions broken into monthly & weekly milestones.
            </p>
          </div>
        </div>

        {/* Card 4: Daily Habits */}
        <div
          onClick={() => onNavigateTab('habits')}
          className="bg-[#FFF2DC] border-2 border-[#D6A43B]/40 hover:border-[#F28C28] rounded-3xl p-5 shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#F28C28]/15 text-[#F28C28] flex items-center justify-center font-bold">
                <Flame size={18} />
              </div>
              <h3 className="font-bold text-[#49321F] font-display text-base">
                Daily Habits
              </h3>
            </div>
            <ArrowRight size={16} className="text-[#49321F]/40 group-hover:text-[#F28C28] transition-colors" />
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-[#49321F] font-mono tabular-nums">
                {habitsDoneToday} / {totalHabits}
              </span>
              <span className="text-xs font-bold text-[#F28C28]">Done Today</span>
            </div>

            <div className="w-full h-2 bg-[#FFE0C2] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#F28C28] rounded-full transition-all"
                style={{ width: `${Math.round((habitsDoneToday / Math.max(1, totalHabits)) * 100)}%` }}
              />
            </div>

            <p className="text-xs text-[#49321F]/70 pt-1">
              Check in with 1 tap to preserve your holy streaks!
            </p>
          </div>
        </div>

        {/* Card 5: Hydration Progress */}
        <div
          onClick={() => onNavigateTab('hydration')}
          className="bg-[#FFF2DC] border-2 border-[#D6A43B]/40 hover:border-[#F28C28] rounded-3xl p-5 shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#2455A4]/15 text-[#2455A4] flex items-center justify-center font-bold">
                <Droplets size={18} />
              </div>
              <h3 className="font-bold text-[#49321F] font-display text-base">
                Theertham Hydration
              </h3>
            </div>
            <ArrowRight size={16} className="text-[#49321F]/40 group-hover:text-[#F28C28] transition-colors" />
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-[#49321F] font-mono tabular-nums">
                {waterDrankMl} ml
              </span>
              <span className="text-xs font-bold text-[#087F78]">{waterPercent}%</span>
            </div>

            <div className="w-full h-2 bg-[#FFE0C2] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#087F78] to-[#48CAE4] rounded-full transition-all"
                style={{ width: `${waterPercent}%` }}
              />
            </div>

            <p className="text-xs text-[#49321F]/70 pt-1">
              Target: {user.dailyWaterTargetMl} ml · Resets at midnight
            </p>
          </div>
        </div>

        {/* Card 6: Productivity Harmony */}
        <div
          onClick={() => onNavigateTab('insights')}
          className="bg-[#FFF2DC] border-2 border-[#D6A43B]/40 hover:border-[#F28C28] rounded-3xl p-5 shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#D6A43B]/20 text-[#D6A43B] flex items-center justify-center font-bold">
                <TrendingUp size={18} />
              </div>
              <h3 className="font-bold text-[#49321F] font-display text-base">
                Weekly Insights
              </h3>
            </div>
            <ArrowRight size={16} className="text-[#49321F]/40 group-hover:text-[#F28C28] transition-colors" />
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-[#49321F] font-mono tabular-nums">
                88 / 100
              </span>
              <span className="text-xs font-bold text-[#D6A43B]">Level 4 Sadhakan</span>
            </div>

            <p className="text-xs text-[#49321F]/70">
              Balanced task execution, deep work focus, and restful boundaries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
