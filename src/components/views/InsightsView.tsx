import React, { useState } from 'react';
import { BalaMurugan } from '../mascot/BalaMurugan';
import { PeacockCornerMotif, VelIcon } from '../common/Decorations';
import { TaskItem, GoalItem, HabitItem, ScheduleActivity } from '../../types';
import {
  TrendingUp,
  Award,
  Clock,
  CheckCircle2,
  Sparkles,
  Droplets,
  Target,
  Flame,
  PieChart,
  BarChart3,
} from 'lucide-react';

interface InsightsViewProps {
  tasks?: TaskItem[];
  goals?: GoalItem[];
  habits?: HabitItem[];
  activities?: ScheduleActivity[];
  waterDrankMl?: number;
  dailyTargetMl?: number;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  tasks = [],
  goals = [],
  habits = [],
  activities = [],
  waterDrankMl = 1750,
  dailyTargetMl = 2500,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'planner' | 'habits'>('overview');

  // Task analytics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const taskRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const highPriorityDone = tasks.filter((t) => t.priority === 3 && t.completed).length;
  const highPriorityTotal = tasks.filter((t) => t.priority === 3).length;

  // Goals analytics
  let totalMilestones = 0;
  let completedMilestones = 0;
  goals.forEach((g) => {
    g.monthlyMilestones.forEach((mm) => {
      totalMilestones += 1;
      if (mm.completed) completedMilestones += 1;
      mm.weeklyMilestones.forEach((wm) => {
        totalMilestones += 1;
        if (wm.completed) completedMilestones += 1;
      });
    });
  });
  const goalMilestoneRate =
    totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  // Habit analytics
  const totalHabits = habits.length;
  const habitsDoneToday = habits.filter((h) => h.completedDays[6]).length;
  const habitRate = totalHabits > 0 ? Math.round((habitsDoneToday / totalHabits) * 100) : 0;
  const longestStreak = habits.reduce((max, h) => Math.max(max, h.streakDays), 0);

  // Planner categories distribution (hours scheduled)
  const categoryHours: Record<string, number> = {
    work: 3.5,
    study: 4.0,
    health: 1.5,
    spiritual: 1.0,
    personal: 1.5,
  };

  const weeklyHydrationData = [
    { day: 'Mon', ml: 2500, target: 2500 },
    { day: 'Tue', ml: 2250, target: 2500 },
    { day: 'Wed', ml: 2600, target: 2500 },
    { day: 'Thu', ml: 2500, target: 2500 },
    { day: 'Fri', ml: 2400, target: 2500 },
    { day: 'Sat', ml: 2750, target: 2500 },
    { day: 'Sun', ml: waterDrankMl, target: dailyTargetMl },
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#49321F] font-display">
            Insights & Self-Realization
          </h1>
          <p className="text-xs sm:text-sm text-[#49321F]/70">
            Holistic metrics across task discipline, daily schedule distribution, goal milestones, and hydration
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#FFE0C2] px-3.5 py-1.5 rounded-2xl border border-[#D6A43B]/30 self-start sm:self-auto">
          <Award size={16} className="text-[#D6A43B]" />
          <span className="text-xs font-bold text-[#49321F] font-display">
            Level 4: Sadhakan (Focus Seeker)
          </span>
        </div>
      </div>

      {/* Hero Harmony Scorecard + Mascot Wisdom */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radial Harmony Scorecard */}
        <div className="bg-[#FFF2DC] border-2 border-[#D6A43B] rounded-3xl p-6 shadow-ambient flex flex-col items-center justify-center text-center relative overflow-hidden">
          <PeacockCornerMotif position="top-right" size={28} className="absolute top-3 right-3" />

          <span className="text-xs font-bold uppercase tracking-wider text-[#087F78] mb-2 font-display">
            Weekly Harmony Index
          </span>

          <div className="relative w-40 h-40 flex items-center justify-center my-2">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#FFE0C2" strokeWidth="10" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#harmonyGrad)"
                strokeWidth="10"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - 251.2 * 0.88}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="harmonyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#087F78" />
                  <stop offset="50%" stopColor="#2455A4" />
                  <stop offset="100%" stopColor="#F28C28" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-[#49321F] font-mono tabular-nums">
                88
              </span>
              <span className="text-xs font-bold text-[#49321F]/60">out of 100</span>
            </div>
          </div>

          <div className="text-xs text-[#49321F]/80 mt-1 max-w-xs font-sans">
            Composed of {taskRate}% Task Completion, {goalMilestoneRate}% Milestone Momentum, and 92% Hydration Consistency.
          </div>
        </div>

        {/* Companion Guidance Box */}
        <div className="lg:col-span-2 bg-[#FFF2DC] border border-[#D6A43B]/40 rounded-3xl p-6 sm:p-7 shadow-ambient flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
          <div className="shrink-0">
            <BalaMurugan pose="murugan_state_peace" size={140} showCloud={true} />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#087F78]/15 text-[#087F78] text-xs font-bold uppercase tracking-wider font-display">
              <Sparkles size={14} />
              <span>Sanctuary Companion Wisdom</span>
            </div>

            <h3 className="text-xl font-bold text-[#49321F] font-display">
              "Kanna, your morning study flow and hydration rhythm are shining bright!"
            </h3>

            <p className="text-xs sm:text-sm text-[#49321F]/80 leading-relaxed font-sans">
              Your dedication to 3 unbroken hours of deep focus before noon has yielded massive progress on your Computer Science distinction goal. Keep your hydration tumbler nearby and take deep breath breaks between sprints.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Pillars Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Pillar 1: Task Completion */}
        <div className="bg-[#FFF2DC] border border-[#D6A43B]/30 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#49321F]/70 font-display">
              Task Completion
            </span>
            <CheckCircle2 size={16} className="text-[#087F78]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-[#49321F] font-mono tabular-nums">
              {taskRate}%
            </span>
            <span className="text-xs text-[#087F78] font-bold">
              {completedTasks}/{totalTasks} tasks
            </span>
          </div>
          <div className="w-full h-2 bg-[#FFE0C2] rounded-full overflow-hidden">
            <div className="h-full bg-[#087F78] rounded-full" style={{ width: `${taskRate}%` }} />
          </div>
          <p className="text-[11px] text-[#49321F]/70">
            High Priority Tasks Conquered: {highPriorityDone}/{highPriorityTotal}
          </p>
        </div>

        {/* Pillar 2: Daily Planner Planned vs Actual */}
        <div className="bg-[#FFF2DC] border border-[#D6A43B]/30 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#49321F]/70 font-display">
              Planned vs Actual
            </span>
            <Clock size={16} className="text-[#2455A4]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-[#49321F] font-mono tabular-nums">
              11.5 h
            </span>
            <span className="text-xs text-[#2455A4] font-bold">Today's Plan</span>
          </div>
          <div className="w-full h-2 bg-[#FFE0C2] rounded-full overflow-hidden">
            <div className="h-full bg-[#2455A4] rounded-full" style={{ width: `84%` }} />
          </div>
          <p className="text-[11px] text-[#49321F]/70">
            84% scheduled block adherence with zero conflicting overlaps
          </p>
        </div>

        {/* Pillar 3: Goal Milestones */}
        <div className="bg-[#FFF2DC] border border-[#D6A43B]/30 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#49321F]/70 font-display">
              Goal Milestones
            </span>
            <Target size={16} className="text-[#F28C28]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-[#49321F] font-mono tabular-nums">
              {goalMilestoneRate}%
            </span>
            <span className="text-xs text-[#F28C28] font-bold">
              {completedMilestones}/{totalMilestones}
            </span>
          </div>
          <div className="w-full h-2 bg-[#FFE0C2] rounded-full overflow-hidden">
            <div className="h-full bg-[#F28C28] rounded-full" style={{ width: `${goalMilestoneRate}%` }} />
          </div>
          <p className="text-[11px] text-[#49321F]/70">
            {goals.filter((g) => g.status === 'active').length} active long-term goals on track
          </p>
        </div>

        {/* Pillar 4: Habit Consistency */}
        <div className="bg-[#FFF2DC] border border-[#D6A43B]/30 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#49321F]/70 font-display">
              Habit Streaks
            </span>
            <Flame size={16} className="text-[#F28C28]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-[#49321F] font-mono tabular-nums">
              {longestStreak} d
            </span>
            <span className="text-xs text-[#087F78] font-bold">Peak Streak</span>
          </div>
          <div className="w-full h-2 bg-[#FFE0C2] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#F28C28] to-[#D6A43B] rounded-full" style={{ width: `90%` }} />
          </div>
          <p className="text-[11px] text-[#49321F]/70">
            {habitsDoneToday} of {totalHabits} rituals checked in today
          </p>
        </div>
      </div>

      {/* Category Distribution & Weekly Hydration Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Planner Category Time Distribution */}
        <div className="bg-[#FFF2DC] border-2 border-[#D6A43B] rounded-3xl p-6 shadow-ambient space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#49321F] font-display flex items-center gap-2">
              <PieChart size={18} className="text-[#2455A4]" />
              <span>Schedule Category Allocation</span>
            </h3>
            <span className="text-xs text-[#49321F]/70">Hours Planned Today</span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { label: 'Study & Academics', hours: 4.0, color: '#087F78', percent: 35 },
              { label: 'Work & Software', hours: 3.5, color: '#2455A4', percent: 30 },
              { label: 'Health & Exercise', hours: 1.5, color: '#16A34A', percent: 13 },
              { label: 'Personal & Rest', hours: 1.5, color: '#D94B83', percent: 13 },
              { label: 'Spiritual & Reflection', hours: 1.0, color: '#F28C28', percent: 9 },
            ].map((cat) => (
              <div key={cat.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#49321F]">{cat.label}</span>
                  <span className="font-mono text-[#49321F]/80">
                    {cat.hours}h ({cat.percent}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-[#FFE0C2] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${cat.percent}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Hydration 7-Day Performance */}
        <div className="bg-[#FFF2DC] border-2 border-[#D6A43B] rounded-3xl p-6 shadow-ambient space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#49321F] font-display flex items-center gap-2">
              <Droplets size={18} className="text-[#087F78]" />
              <span>7-Day Theertham Performance</span>
            </h3>
            <span className="text-xs text-[#49321F]/70">Target: {dailyTargetMl}ml/day</span>
          </div>

          <div className="grid grid-cols-7 gap-2 items-end h-48 pt-4">
            {weeklyHydrationData.map((d, i) => {
              const heightPercent = Math.min(100, Math.round((d.ml / d.target) * 100));
              const isMet = d.ml >= d.target;
              return (
                <div key={i} className="flex flex-col items-center justify-end h-full gap-1.5">
                  <span className="text-[10px] font-mono text-[#49321F]/80 tabular-nums">
                    {d.ml}
                  </span>
                  <div className="w-full bg-[#FFE0C2] rounded-xl h-28 relative overflow-hidden flex flex-col justify-end">
                    <div
                      className={`w-full rounded-xl transition-all ${
                        isMet
                          ? 'bg-gradient-to-t from-[#087F78] to-[#48CAE4]'
                          : 'bg-gradient-to-t from-[#F28C28] to-[#FFD166]'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-[#49321F]/70">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
