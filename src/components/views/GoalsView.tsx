import React, { useState, useEffect } from 'react';
import { GoalItem, GoalCategory, GoalStatus, TaskItem } from '../../types';
import {
  loadStoredGoals,
  saveStoredGoals,
  calculateGoalProgress,
  calculateDaysRemaining,
} from '../../utils/goalsStorage';
import { GoalModal } from './goals/GoalModal';
import { MilestoneModal } from './goals/MilestoneModal';
import { BalaMurugan } from '../mascot/BalaMurugan';
import { PeacockCornerMotif, VelIcon } from '../common/Decorations';
import {
  Plus,
  Target,
  Calendar,
  CheckCircle2,
  Circle,
  Flag,
  Clock,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Play,
  Pause,
  Trash2,
  Edit2,
  Sparkles,
  Link as LinkIcon,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playVictoryChime, playTempleBell } from '../../utils/audio';

interface GoalsViewProps {
  tasks: TaskItem[];
  onNavigateToTasks?: () => void;
  soundEnabled?: boolean;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  tasks,
  onNavigateToTasks,
  soundEnabled = true,
}) => {
  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [expandedGoalIds, setExpandedGoalIds] = useState<Record<string, boolean>>({});

  // Modals
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<GoalItem | null>(null);

  const [milestoneModalGoal, setMilestoneModalGoal] = useState<GoalItem | null>(null);

  // Load goals on mount
  useEffect(() => {
    const loaded = loadStoredGoals();
    setGoals(loaded);
    // Expand the first goal by default
    if (loaded.length > 0) {
      setExpandedGoalIds({ [loaded[0].id]: true });
    }
  }, []);

  const updateAndSaveGoals = (newGoals: GoalItem[]) => {
    setGoals(newGoals);
    saveStoredGoals(newGoals);
  };

  const toggleExpand = (goalId: string) => {
    setExpandedGoalIds((prev) => ({
      ...prev,
      [goalId]: !prev[goalId],
    }));
  };

  const handleSaveGoal = (goalToSave: GoalItem) => {
    const exists = goals.some((g) => g.id === goalToSave.id);
    let updated: GoalItem[];
    if (exists) {
      updated = goals.map((g) => (g.id === goalToSave.id ? goalToSave : g));
    } else {
      updated = [goalToSave, ...goals];
      setExpandedGoalIds((prev) => ({ ...prev, [goalToSave.id]: true }));
    }
    updateAndSaveGoals(updated);
  };

  const handleDeleteGoal = (goalId: string) => {
    if (soundEnabled) playTempleBell(0.3);
    const updated = goals.filter((g) => g.id !== goalId);
    updateAndSaveGoals(updated);
  };

  const handleToggleStatus = (goal: GoalItem) => {
    const newStatus: GoalStatus = goal.status === 'active' ? 'paused' : 'active';
    const updated = goals.map((g) => (g.id === goal.id ? { ...g, status: newStatus } : g));
    updateAndSaveGoals(updated);
  };

  const handleToggleWeeklyMilestone = (
    goalId: string,
    monthlyId: string,
    weeklyId: string
  ) => {
    const updated = goals.map((goal) => {
      if (goal.id !== goalId) return goal;
      const newMonthly = goal.monthlyMilestones.map((mm) => {
        if (mm.id !== monthlyId) return mm;
        const newWeekly = mm.weeklyMilestones.map((wm) => {
          if (wm.id !== weeklyId) return wm;
          const nextState = !wm.completed;
          if (nextState && soundEnabled) playVictoryChime();
          return { ...wm, completed: nextState };
        });
        // Check if all weekly milestones are completed
        const allCompleted = newWeekly.length > 0 && newWeekly.every((w) => w.completed);
        return {
          ...mm,
          completed: allCompleted,
          weeklyMilestones: newWeekly,
        };
      });
      return { ...goal, monthlyMilestones: newMonthly };
    });

    confetti({
      particleCount: 50,
      spread: 60,
      colors: ['#F28C28', '#D6A43B', '#087F78'],
    });

    updateAndSaveGoals(updated);
  };

  const handleToggleMonthlyMilestone = (goalId: string, monthlyId: string) => {
    const updated = goals.map((goal) => {
      if (goal.id !== goalId) return goal;
      const newMonthly = goal.monthlyMilestones.map((mm) => {
        if (mm.id !== monthlyId) return mm;
        const nextState = !mm.completed;
        if (nextState && soundEnabled) playVictoryChime();
        // Also toggle child weekly milestones if marking complete
        const newWeekly = mm.weeklyMilestones.map((wm) => ({
          ...wm,
          completed: nextState ? true : wm.completed,
        }));
        return {
          ...mm,
          completed: nextState,
          weeklyMilestones: newWeekly,
        };
      });
      return { ...goal, monthlyMilestones: newMonthly };
    });

    confetti({
      particleCount: 65,
      spread: 70,
      colors: ['#F28C28', '#D6A43B', '#2455A4', '#FFD166'],
    });

    updateAndSaveGoals(updated);
  };

  const handleAddMonthlyMilestone = (title: string, month: string, targetDate: string) => {
    if (!milestoneModalGoal) return;
    const newMonthly = {
      id: `mm-${Date.now()}`,
      title,
      month,
      targetDate,
      completed: false,
      weeklyMilestones: [],
    };
    const updated = goals.map((g) => {
      if (g.id !== milestoneModalGoal.id) return g;
      return {
        ...g,
        monthlyMilestones: [...g.monthlyMilestones, newMonthly],
      };
    });
    updateAndSaveGoals(updated);
  };

  const handleAddWeeklyMilestone = (
    monthlyId: string,
    title: string,
    weekNumber: number,
    targetDate: string
  ) => {
    if (!milestoneModalGoal) return;
    const newWeekly = {
      id: `wm-${Date.now()}`,
      title,
      weekNumber,
      targetDate,
      completed: false,
    };
    const updated = goals.map((g) => {
      if (g.id !== milestoneModalGoal.id) return g;
      const newMonthly = g.monthlyMilestones.map((mm) => {
        if (mm.id !== monthlyId) return mm;
        return {
          ...mm,
          weeklyMilestones: [...mm.weeklyMilestones, newWeekly],
        };
      });
      return { ...g, monthlyMilestones: newMonthly };
    });
    updateAndSaveGoals(updated);
  };

  // Filter goals
  const filteredGoals = goals.filter((g) => {
    if (filterStatus !== 'all' && g.status !== filterStatus) return false;
    if (filterCategory !== 'all' && g.category !== filterCategory) return false;
    return true;
  });

  // Calculate high-level stats
  const activeCount = goals.filter((g) => g.status === 'active').length;
  let totalMilestonesCount = 0;
  let completedMilestonesCount = 0;
  goals.forEach((g) => {
    g.monthlyMilestones.forEach((mm) => {
      totalMilestonesCount += 1;
      if (mm.completed) completedMilestonesCount += 1;
      mm.weeklyMilestones.forEach((wm) => {
        totalMilestonesCount += 1;
        if (wm.completed) completedMilestonesCount += 1;
      });
    });
  });
  const overallMilestoneRate =
    totalMilestonesCount > 0
      ? Math.round((completedMilestonesCount / totalMilestonesCount) * 100)
      : 0;

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#49321F] font-display">
            Strategic Goals & Milestones
          </h1>
          <p className="text-xs sm:text-sm text-[#49321F]/70">
            Deconstruct long-term ambitions into monthly milestones, weekly steps, and daily tasks
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingGoal(null);
            setIsGoalModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F28C28] to-[#D6A43B] text-white font-bold text-sm shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 border border-[#FFF2DC]/40 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>New Long-Term Goal</span>
        </button>
      </div>

      {/* Overview Stat Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#FFF2DC] border border-[#D6A43B]/30 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-[#49321F]/70 font-semibold block">Total Goals</span>
          <span className="text-2xl font-extrabold text-[#49321F] font-mono tabular-nums">
            {goals.length}
          </span>
        </div>
        <div className="bg-[#FFF2DC] border border-[#D6A43B]/30 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-[#49321F]/70 font-semibold block">Active in Progress</span>
          <span className="text-2xl font-extrabold text-[#087F78] font-mono tabular-nums">
            {activeCount}
          </span>
        </div>
        <div className="bg-[#FFF2DC] border border-[#D6A43B]/30 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-[#49321F]/70 font-semibold block">Milestones Reached</span>
          <span className="text-2xl font-extrabold text-[#F28C28] font-mono tabular-nums">
            {completedMilestonesCount} / {totalMilestonesCount}
          </span>
        </div>
        <div className="bg-[#FFF2DC] border border-[#D6A43B]/30 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-[#49321F]/70 font-semibold block">Overall Progress</span>
          <span className="text-2xl font-extrabold text-[#2455A4] font-mono tabular-nums">
            {overallMilestoneRate}%
          </span>
        </div>
      </div>

      {/* Filter and Status Segmented Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status Filter */}
        <div className="flex items-center gap-1 p-1 bg-[#FFE0C2]/60 rounded-2xl border border-[#D6A43B]/25 overflow-x-auto">
          {['all', 'active', 'completed', 'paused'].map((statusKey) => (
            <button
              key={statusKey}
              type="button"
              onClick={() => setFilterStatus(statusKey)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
                filterStatus === statusKey
                  ? 'bg-white text-[#49321F] shadow-xs font-bold'
                  : 'text-[#49321F]/70 hover:text-[#49321F]'
              }`}
            >
              {statusKey === 'all' ? 'All Goals' : statusKey}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 text-xs text-[#49321F]/80">
          <span className="font-semibold">Category:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-[#D6A43B]/40 bg-white text-[#49321F] text-xs font-medium cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="study">Study & Academics</option>
            <option value="work">Career & Work</option>
            <option value="health">Health & Fitness</option>
            <option value="learning">Skills & Learning</option>
            <option value="personal">Personal Growth</option>
            <option value="spiritual">Spiritual Practice</option>
          </select>
        </div>
      </div>

      {/* Goals Hierarchy List */}
      {filteredGoals.length === 0 ? (
        <div className="bg-[#FFF2DC] border-2 border-dashed border-[#D6A43B]/40 rounded-3xl p-8 text-center flex flex-col items-center justify-center">
          <BalaMurugan pose="murugan_state_thinking" size={130} showCloud={false} />
          <h3 className="text-lg font-bold text-[#49321F] font-display mt-2">
            No goals found for this filter
          </h3>
          <p className="text-xs text-[#49321F]/70 max-w-sm mt-1">
            Plant your first ambitious seed and let Lord Murugan guide you step by step.
          </p>
          <button
            type="button"
            onClick={() => {
              setEditingGoal(null);
              setIsGoalModalOpen(true);
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-[#F28C28] text-white text-xs font-bold shadow-xs hover:brightness-105 cursor-pointer"
          >
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredGoals.map((goal) => {
            const isExpanded = !!expandedGoalIds[goal.id];
            const progress = calculateGoalProgress(goal);
            const daysLeft = calculateDaysRemaining(goal.targetDate);
            const linkedTasks = tasks.filter((t) => goal.linkedTaskIds?.includes(t.id));

            return (
              <div
                key={goal.id}
                className="bg-[#FFF2DC] border-2 rounded-3xl shadow-ambient overflow-hidden transition-all"
                style={{ borderColor: `${goal.color}40` }}
              >
                {/* Goal Header Strip */}
                <div className="p-5 sm:p-6 bg-white/70 border-b border-[#D6A43B]/20">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      {/* Category & Status & Countdown Metadata */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#49321F]/70">
                        <span
                          className="font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white text-[10px]"
                          style={{ backgroundColor: goal.color }}
                        >
                          {goal.category}
                        </span>
                        <span>·</span>
                        <span className="capitalize font-semibold text-[#49321F]">
                          Status: {goal.status}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 font-mono text-[#F28C28] font-bold">
                          <Clock size={12} />
                          {daysLeft > 0 ? `${daysLeft} days left` : 'Due today'}
                        </span>
                        <span>·</span>
                        <span>Target: {goal.targetDate}</span>
                      </div>

                      {/* Title */}
                      <h2 className="text-xl sm:text-2xl font-bold text-[#49321F] font-display flex items-center gap-2">
                        <span>{goal.title}</span>
                      </h2>

                      {/* Description */}
                      {goal.description && (
                        <p className="text-xs sm:text-sm text-[#49321F]/80 leading-relaxed font-sans max-w-3xl">
                          {goal.description}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 self-start shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setMilestoneModalGoal(goal);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#FFE0C2] hover:bg-[#FFD166] text-[#49321F] text-xs font-bold border border-[#D6A43B]/40 flex items-center gap-1 transition-colors cursor-pointer"
                        title="Add Milestone"
                      >
                        <Plus size={14} />
                        <span>Milestone</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingGoal(goal);
                          setIsGoalModalOpen(true);
                        }}
                        className="p-2 rounded-xl bg-white hover:bg-[#FFE0C2] text-[#49321F] border border-[#D6A43B]/30 transition-colors cursor-pointer"
                        title="Edit Goal"
                      >
                        <Edit2 size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(goal)}
                        className="p-2 rounded-xl bg-white hover:bg-[#FFE0C2] text-[#49321F] border border-[#D6A43B]/30 transition-colors cursor-pointer"
                        title={goal.status === 'active' ? 'Pause Goal' : 'Resume Goal'}
                      >
                        {goal.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-2 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
                        title="Delete Goal"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar & Rate */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-[#49321F]/70">Overall Progress</span>
                      <span className="font-mono text-[#49321F] tabular-nums">{progress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#FFE0C2]/80 rounded-full overflow-hidden border border-[#D6A43B]/30">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: goal.color || '#F28C28',
                        }}
                      />
                    </div>
                  </div>

                  {/* Toggle Milestone Tree Accordion */}
                  <div className="mt-3 pt-3 border-t border-[#D6A43B]/15 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => toggleExpand(goal.id)}
                      className="text-xs font-bold text-[#F28C28] flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      <span>
                        {isExpanded ? 'Hide Milestone Breakdown' : 'View Monthly & Weekly Milestones'}
                      </span>
                    </button>

                    {goal.notes && (
                      <span className="text-[11px] text-[#49321F]/70 italic truncate max-w-sm hidden sm:inline">
                        Strategy: {goal.notes}
                      </span>
                    )}
                  </div>
                </div>

                {/* Expanded Hierarchical Milestones & Linked Tasks */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 bg-[#FFF8EE] space-y-6 animate-fadeIn">
                    {/* Monthly Milestones Tree */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#49321F]/80 flex items-center gap-1.5 font-display">
                          <Target size={14} className="text-[#F28C28]" />
                          <span>Monthly Milestones</span>
                        </h3>
                        <span className="text-[11px] text-[#49321F]/60">
                          {goal.monthlyMilestones.length} Phases
                        </span>
                      </div>

                      {goal.monthlyMilestones.length === 0 ? (
                        <div className="p-4 rounded-2xl bg-white/60 border border-dashed border-[#D6A43B]/30 text-xs text-[#49321F]/70 text-center">
                          No monthly milestones yet. Click "+ Milestone" above to break this goal down.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {goal.monthlyMilestones.map((mm) => (
                            <div
                              key={mm.id}
                              className="bg-white rounded-2xl border border-[#D6A43B]/30 p-4 shadow-xs space-y-3"
                            >
                              {/* Monthly Milestone Title & Checkbox */}
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5 flex-1">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleMonthlyMilestone(goal.id, mm.id)}
                                    className="cursor-pointer transition-transform active:scale-90"
                                    title="Mark monthly milestone complete"
                                  >
                                    {mm.completed ? (
                                      <CheckCircle2 size={20} className="text-[#087F78]" />
                                    ) : (
                                      <Circle size={20} className="text-[#D6A43B]" />
                                    )}
                                  </button>
                                  <div>
                                    <h4
                                      className={`text-sm font-bold text-[#49321F] ${
                                        mm.completed ? 'line-through opacity-60' : ''
                                      }`}
                                    >
                                      {mm.title}
                                    </h4>
                                    <div className="flex items-center gap-2 text-[11px] text-[#49321F]/60">
                                      <span className="font-semibold text-[#087F78]">{mm.month}</span>
                                      <span>·</span>
                                      <span>Target: {mm.targetDate}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Nested Weekly Milestones */}
                              {mm.weeklyMilestones.length > 0 && (
                                <div className="pl-6 pt-2 border-t border-[#D6A43B]/15 space-y-2">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#49321F]/60 block">
                                    Weekly Action Milestones
                                  </span>
                                  <div className="space-y-1.5">
                                    {mm.weeklyMilestones.map((wm) => (
                                      <div
                                        key={wm.id}
                                        className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#FFF9F2] hover:bg-[#FFE0C2]/40 transition-colors"
                                      >
                                        <div className="flex items-center gap-2 flex-1">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleToggleWeeklyMilestone(goal.id, mm.id, wm.id)
                                            }
                                            className="cursor-pointer transition-transform active:scale-90"
                                          >
                                            {wm.completed ? (
                                              <CheckCircle2 size={16} className="text-[#087F78]" />
                                            ) : (
                                              <Circle size={16} className="text-[#D6A43B]" />
                                            )}
                                          </button>
                                          <span
                                            className={`text-xs text-[#49321F] ${
                                              wm.completed ? 'line-through opacity-60' : ''
                                            }`}
                                          >
                                            <strong className="text-[#F28C28] mr-1.5">
                                              Week {wm.weekNumber}:
                                            </strong>
                                            {wm.title}
                                          </span>
                                        </div>
                                        <span className="text-[10px] font-mono text-[#49321F]/60 shrink-0">
                                          {wm.targetDate}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Linked Daily Tasks */}
                    <div className="pt-4 border-t border-[#D6A43B]/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#49321F]/80 flex items-center gap-1.5 font-display">
                          <LinkIcon size={14} className="text-[#2455A4]" />
                          <span>Connected Daily Tasks ({linkedTasks.length})</span>
                        </h3>
                        {onNavigateToTasks && (
                          <button
                            type="button"
                            onClick={onNavigateToTasks}
                            className="text-xs font-bold text-[#2455A4] hover:underline cursor-pointer"
                          >
                            Manage Tasks →
                          </button>
                        )}
                      </div>

                      {linkedTasks.length === 0 ? (
                        <div className="p-3 rounded-2xl bg-white/60 border border-[#D6A43B]/20 text-xs text-[#49321F]/70">
                          No tasks linked to this goal yet. You can associate tasks with this goal from the Tasks tab!
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {linkedTasks.map((t) => (
                            <div
                              key={t.id}
                              className="p-2.5 rounded-xl bg-white border border-[#D6A43B]/25 flex items-center justify-between gap-2 shadow-2xs"
                            >
                              <div className="flex items-center gap-2 overflow-hidden">
                                <span
                                  className={`w-2 h-2 rounded-full shrink-0 ${
                                    t.completed ? 'bg-[#087F78]' : 'bg-[#F28C28]'
                                  }`}
                                />
                                <span
                                  className={`text-xs text-[#49321F] font-medium truncate ${
                                    t.completed ? 'line-through opacity-60' : ''
                                  }`}
                                >
                                  {t.title}
                                </span>
                              </div>
                              <span className="text-[10px] font-mono text-[#49321F]/60 shrink-0">
                                {t.dueDate}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Goal Modal (Create / Edit) */}
      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => {
          setIsGoalModalOpen(false);
          setEditingGoal(null);
        }}
        onSave={handleSaveGoal}
        initialGoal={editingGoal}
        soundEnabled={soundEnabled}
      />

      {/* Milestone Modal */}
      {milestoneModalGoal && (
        <MilestoneModal
          isOpen={true}
          onClose={() => setMilestoneModalGoal(null)}
          goalTitle={milestoneModalGoal.title}
          monthlyMilestones={milestoneModalGoal.monthlyMilestones}
          onAddMonthly={handleAddMonthlyMilestone}
          onAddWeekly={handleAddWeeklyMilestone}
          soundEnabled={soundEnabled}
        />
      )}
    </div>
  );
};
