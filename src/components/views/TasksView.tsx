import React, { useState } from 'react';
import { TaskItem, TaskCategory, PriorityLevel, GoalItem, ScheduleActivity } from '../../types';
import { VelIcon } from '../common/Decorations';
import { BalaMurugan } from '../mascot/BalaMurugan';
import { TaskModal } from './tasks/TaskModal';
import { ScheduleTaskModal } from './tasks/ScheduleTaskModal';
import {
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Clock,
  Calendar,
  Search,
  ArrowUpDown,
  CalendarPlus,
  CheckSquare,
  Edit2,
  Target,
  Sparkles,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playVictoryChime, playTempleBell } from '../../utils/audio';

interface TasksViewProps {
  tasks: TaskItem[];
  onToggleTask: (id: string) => void;
  onAddTask: (task: Omit<TaskItem, 'id' | 'completed'> & { id?: string }) => void;
  onDeleteTask: (id: string) => void;
  onScheduleActivity?: (activity: ScheduleActivity) => void;
  availableGoals?: GoalItem[];
  soundEnabled?: boolean;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onScheduleActivity,
  availableGoals = [],
  soundEnabled = true,
}) => {
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming' | 'important' | 'completed'>(
    'all'
  );
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'title' | 'duration'>('dueDate');

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [schedulingTask, setSchedulingTask] = useState<TaskItem | null>(null);

  // Expanded subtasks on cards
  const [expandedSubtaskCardIds, setExpandedSubtaskCardIds] = useState<Record<string, boolean>>({});

  const toggleSubtaskCard = (taskId: string) => {
    setExpandedSubtaskCardIds((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const handleToggleSubtaskItem = (taskId: string, subtaskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || !task.subtasks) return;

    const newSubtasks = task.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );

    if (soundEnabled) playTempleBell(0.2);

    onAddTask({
      ...task,
      subtasks: newSubtasks,
    });
  };

  const handleCheckboxClick = (task: TaskItem) => {
    if (!task.completed) {
      if (soundEnabled) playVictoryChime();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#F28C28', '#D6A43B', '#087F78', '#D94B83'],
      });
    } else {
      if (soundEnabled) playTempleBell(0.2);
    }
    onToggleTask(task.id);
  };

  // Filter & Search Logic
  const filteredTasks = tasks.filter((task) => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchNotes = task.notes?.toLowerCase().includes(q);
      if (!matchTitle && !matchNotes) return false;
    }

    // Category
    if (categoryFilter !== 'all' && task.category !== categoryFilter) {
      return false;
    }

    // Status filter
    if (filter === 'completed') return task.completed;
    if (filter === 'today') return !task.completed && task.dueDate === '2026-11-01';
    if (filter === 'upcoming') return !task.completed && task.dueDate > '2026-11-01';
    if (filter === 'important') return !task.completed && task.priority === 3;
    return true;
  });

  // Sort Logic
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      return b.priority - a.priority;
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'duration') {
      return (b.estimatedMinutes || 0) - (a.estimatedMinutes || 0);
    }
    // Default by dueDate
    return a.dueDate.localeCompare(b.dueDate);
  });

  const getCategoryColor = (cat: TaskCategory) => {
    switch (cat) {
      case 'work':
        return '#2455A4';
      case 'study':
        return '#087F78';
      case 'personal':
        return '#D94B83';
      case 'health':
        return '#16A34A';
      case 'spiritual':
        return '#F28C28';
      case 'learning':
        return '#D6A43B';
      default:
        return '#49321F';
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#49321F] font-display">
            Personal Task Management
          </h1>
          <p className="text-xs sm:text-sm text-[#49321F]/70">
            Conquer priorities with clear subtasks, estimated focus durations, and planner scheduling
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingTask(null);
            setIsTaskModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F28C28] to-[#D6A43B] text-white font-bold text-sm shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 border border-[#FFF2DC]/40 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>New Task</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#FFF2DC] border border-[#D6A43B]/30 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-[#49321F]/70 font-semibold block">Total Tasks</span>
          <span className="text-2xl font-extrabold text-[#49321F] font-mono tabular-nums">
            {tasks.length}
          </span>
        </div>
        <div className="bg-[#FFF2DC] border border-[#D6A43B]/30 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-[#49321F]/70 font-semibold block">Pending</span>
          <span className="text-2xl font-extrabold text-[#F28C28] font-mono tabular-nums">
            {pendingCount}
          </span>
        </div>
        <div className="bg-[#FFF2DC] border border-[#D6A43B]/30 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-[#49321F]/70 font-semibold block">Completed</span>
          <span className="text-2xl font-extrabold text-[#087F78] font-mono tabular-nums">
            {completedCount}
          </span>
        </div>
        <div className="bg-[#FFF2DC] border border-[#D6A43B]/30 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-[#49321F]/70 font-semibold block">High Priority (3 Vels)</span>
          <span className="text-2xl font-extrabold text-[#2455A4] font-mono tabular-nums">
            {tasks.filter((t) => t.priority === 3 && !t.completed).length}
          </span>
        </div>
      </div>

      {/* Search, Filter, Sort Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#49321F]/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, notes, or tags..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#D6A43B]/35 bg-white text-xs sm:text-sm text-[#49321F] placeholder:text-[#49321F]/40 focus:outline-hidden focus:ring-2 focus:ring-[#F28C28]"
          />
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#FFE0C2]/60 rounded-xl border border-[#D6A43B]/25 overflow-x-auto">
            {[
              { id: 'all', label: 'All' },
              { id: 'today', label: 'Today' },
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'important', label: 'High Priority' },
              { id: 'completed', label: 'Completed' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  filter === tab.id
                    ? 'bg-white text-[#49321F] shadow-xs font-bold'
                    : 'text-[#49321F]/70 hover:text-[#49321F]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-[#D6A43B]/40 bg-white text-[#49321F] text-xs font-medium cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="work">Work</option>
            <option value="study">Study</option>
            <option value="health">Health</option>
            <option value="spiritual">Spiritual</option>
            <option value="learning">Learning</option>
            <option value="personal">Personal</option>
          </select>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1 text-xs text-[#49321F]">
            <ArrowUpDown size={14} className="text-[#F28C28]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl border border-[#D6A43B]/40 bg-white text-[#49321F] text-xs font-medium cursor-pointer"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="duration">Duration</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task Cards List */}
      {sortedTasks.length === 0 ? (
        <div className="bg-[#FFF2DC] border-2 border-dashed border-[#D6A43B]/40 rounded-3xl p-8 text-center flex flex-col items-center justify-center">
          <BalaMurugan pose="murugan_state_thinking" size={130} showCloud={false} />
          <h3 className="text-lg font-bold text-[#49321F] font-display mt-2">
            No matching tasks found
          </h3>
          <p className="text-xs text-[#49321F]/70 max-w-sm mt-1">
            {searchQuery
              ? 'Try modifying your search or clear active filters.'
              : 'Add your first task and keep your daily momentum focused!'}
          </p>
          <button
            type="button"
            onClick={() => {
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-[#F28C28] text-white text-xs font-bold shadow-xs hover:brightness-105 cursor-pointer"
          >
            Add New Task
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedTasks.map((task) => {
            const hasSubtasks = task.subtasks && task.subtasks.length > 0;
            const completedSubtasksCount = task.subtasks?.filter((s) => s.completed).length || 0;
            const totalSubtasksCount = task.subtasks?.length || 0;
            const isSubtasksOpen = !!expandedSubtaskCardIds[task.id];
            const linkedGoal = availableGoals.find((g) => g.id === task.goalId);

            return (
              <div
                key={task.id}
                className={`bg-[#FFF2DC] border-2 rounded-2xl p-4 sm:p-5 transition-all shadow-xs ${
                  task.completed
                    ? 'border-[#087F78]/30 bg-[#F4FBF7]'
                    : 'border-[#D6A43B]/40 hover:border-[#F28C28]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  {/* Left: Checkbox + Title + Metadata */}
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      type="button"
                      onClick={() => handleCheckboxClick(task)}
                      className="mt-0.5 transition-transform active:scale-90 cursor-pointer text-[#49321F]"
                      title={task.completed ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {task.completed ? (
                        <CheckCircle2 size={22} className="text-[#087F78]" />
                      ) : (
                        <Circle size={22} className="text-[#D6A43B] hover:text-[#F28C28]" />
                      )}
                    </button>

                    <div className="space-y-1.5 flex-1">
                      {/* Category, Due, Priority, Duration, Goal metadata */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#49321F]/70">
                        <span
                          className="font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white text-[10px]"
                          style={{ backgroundColor: getCategoryColor(task.category) }}
                        >
                          {task.category}
                        </span>

                        <span>·</span>

                        {/* Priority in Vels */}
                        <div className="flex items-center gap-0.5" title={`Priority: ${task.priority} Vels`}>
                          {Array.from({ length: task.priority }).map((_, i) => (
                            <VelIcon key={i} size={13} glow={false} />
                          ))}
                        </div>

                        <span>·</span>

                        {/* Due Date & Time */}
                        <span className="flex items-center gap-1 font-mono text-[11px] text-[#49321F]/80">
                          <Calendar size={12} className="text-[#F28C28]" />
                          <span>{task.dueDate}</span>
                          {task.dueTime && <span>· {task.dueTime}</span>}
                        </span>

                        {/* Duration estimate */}
                        {task.estimatedMinutes && (
                          <>
                            <span>·</span>
                            <span className="flex items-center gap-1 text-[11px] text-[#49321F]/80">
                              <Clock size={12} className="text-[#2455A4]" />
                              <span>{task.estimatedMinutes}m</span>
                            </span>
                          </>
                        )}

                        {/* Linked Goal */}
                        {linkedGoal && (
                          <>
                            <span>·</span>
                            <span
                              className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md text-white"
                              style={{ backgroundColor: linkedGoal.color }}
                              title={`Linked Goal: ${linkedGoal.title}`}
                            >
                              <Target size={11} />
                              <span className="truncate max-w-[120px]">{linkedGoal.title}</span>
                            </span>
                          </>
                        )}
                      </div>

                      {/* Title */}
                      <h3
                        className={`text-base sm:text-lg font-bold text-[#49321F] font-display ${
                          task.completed ? 'line-through opacity-60' : ''
                        }`}
                      >
                        {task.title}
                      </h3>

                      {/* Notes */}
                      {task.notes && (
                        <p className="text-xs sm:text-sm text-[#49321F]/80 leading-relaxed font-sans">
                          {task.notes}
                        </p>
                      )}

                      {/* Subtasks summary preview */}
                      {hasSubtasks && (
                        <div className="pt-1 flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => toggleSubtaskCard(task.id)}
                            className="text-xs font-semibold text-[#F28C28] flex items-center gap-1 hover:underline cursor-pointer"
                          >
                            {isSubtasksOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            <span>
                              Subtasks: {completedSubtasksCount} of {totalSubtasksCount} completed
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex items-center gap-1.5 self-start shrink-0">
                    {/* 1-click Schedule to Planner */}
                    <button
                      type="button"
                      onClick={() => setSchedulingTask(task)}
                      className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#FFE0C2] text-[#49321F] text-xs font-bold border border-[#D6A43B]/40 flex items-center gap-1 transition-colors cursor-pointer"
                      title="Schedule into Daily Planner"
                    >
                      <CalendarPlus size={14} className="text-[#F28C28]" />
                      <span className="hidden sm:inline">Schedule</span>
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTask(task);
                        setIsTaskModalOpen(true);
                      }}
                      className="p-1.5 rounded-xl bg-white hover:bg-[#FFE0C2] text-[#49321F] border border-[#D6A43B]/30 transition-colors cursor-pointer"
                      title="Edit Task"
                    >
                      <Edit2 size={14} />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
                      title="Delete Task"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Subtasks Accordion Expandable list */}
                {hasSubtasks && isSubtasksOpen && (
                  <div className="mt-3 pt-3 border-t border-[#D6A43B]/20 space-y-1.5 pl-8 animate-fadeIn">
                    {task.subtasks!.map((st) => (
                      <div
                        key={st.id}
                        className="flex items-center gap-2 text-xs text-[#49321F] hover:bg-white/60 p-1.5 rounded-lg transition-colors"
                      >
                        <button
                          type="button"
                          onClick={() => handleToggleSubtaskItem(task.id, st.id)}
                          className="cursor-pointer"
                        >
                          {st.completed ? (
                            <CheckCircle2 size={15} className="text-[#087F78]" />
                          ) : (
                            <Circle size={15} className="text-[#D6A43B]" />
                          )}
                        </button>
                        <span className={st.completed ? 'line-through opacity-60' : ''}>
                          {st.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Task Create/Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={(data) => {
          onAddTask(data);
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        initialTask={editingTask}
        availableGoals={availableGoals}
        soundEnabled={soundEnabled}
      />

      {/* 1-click Schedule Task Modal */}
      {schedulingTask && (
        <ScheduleTaskModal
          isOpen={true}
          onClose={() => setSchedulingTask(null)}
          task={schedulingTask}
          onSchedule={(activity) => {
            if (onScheduleActivity) {
              onScheduleActivity(activity);
            }
          }}
          soundEnabled={soundEnabled}
        />
      )}
    </div>
  );
};
