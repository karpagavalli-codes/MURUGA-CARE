import React, { useState } from 'react';
import { TaskItem, HabitItem, ScheduleActivity, ActivityCategory } from '../../../types';
import {
  CATEGORY_METAS,
  minutesToTime,
  timeToMinutes,
} from '../../../utils/scheduleStorage';
import {
  X,
  ListTodo,
  Flame,
  Clock,
  Calendar,
  CheckCircle2,
  Sparkles,
  Plus,
} from 'lucide-react';
import { playTempleBell, playVictoryChime } from '../../../utils/audio';

interface ImportTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: TaskItem[];
  habits: HabitItem[];
  selectedDate: string;
  onScheduleItem: (activity: ScheduleActivity) => void;
  soundEnabled?: boolean;
}

export const ImportTaskModal: React.FC<ImportTaskModalProps> = ({
  isOpen,
  onClose,
  tasks,
  habits,
  selectedDate,
  onScheduleItem,
  soundEnabled = true,
}) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'habits'>('tasks');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState('11:00');
  const [durationMins, setDurationMins] = useState(45);

  if (!isOpen) return null;

  const handleImport = () => {
    let title = '';
    let category: ActivityCategory = 'work';
    let taskId: string | undefined = undefined;
    let habitId: string | undefined = undefined;
    let color = CATEGORY_METAS.work.defaultColor;

    if (activeTab === 'tasks') {
      const task = tasks.find((t) => t.id === selectedTaskId);
      if (!task) return;
      title = task.title;
      category = (task.category as unknown as ActivityCategory) || 'work';
      if (!CATEGORY_METAS[category]) category = 'work';
      taskId = task.id;
      color = CATEGORY_METAS[category]?.defaultColor || '#0D9488';
    } else {
      const habit = habits.find((h) => h.id === selectedHabitId);
      if (!habit) return;
      title = habit.title;
      category = (habit.category as unknown as ActivityCategory) || 'personal';
      if (!CATEGORY_METAS[category]) category = 'personal';
      habitId = habit.id;
      color = CATEGORY_METAS[category]?.defaultColor || '#EA580C';
    }

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = startMinutes + durationMins;
    const endTime = minutesToTime(endMinutes);

    const newActivity: ScheduleActivity = {
      id: `act-sync-${Date.now()}`,
      title,
      date: selectedDate,
      startTime,
      endTime,
      category,
      color,
      hasReminder: true,
      reminderMinutesBefore: 10,
      recurrence: 'none',
      completed: activeTab === 'tasks' ? !!tasks.find((t) => t.id === selectedTaskId)?.completed : false,
      taskId,
      habitId,
      createdAt: new Date().toISOString(),
    };

    if (soundEnabled) playVictoryChime();
    onScheduleItem(newActivity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#FFF5EB] rounded-3xl shadow-2xl border-2 border-[#D6A43B]/40 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#D6A43B]/30 bg-gradient-to-r from-[#FFE0C2] to-[#FFF2DC]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#F28C28] flex items-center justify-center text-white">
              <Sparkles size={16} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#49321F] font-display">
                Schedule Tasks & Habits
              </h2>
              <p className="text-[11px] text-[#49321F]/70">
                Directly block time for your priorities without duplicating records
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

        {/* Tab Switcher: Tasks vs Habits */}
        <div className="p-4 border-b border-[#D6A43B]/20 bg-[#FFE5D0]/30 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'tasks'
                ? 'bg-white text-[#F28C28] shadow-xs border border-[#F28C28]/40'
                : 'text-[#49321F]/70 hover:bg-white/60'
            }`}
          >
            <ListTodo size={14} />
            <span>Tasks Checklist ({tasks.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('habits')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'habits'
                ? 'bg-white text-[#EA580C] shadow-xs border border-[#EA580C]/40'
                : 'text-[#49321F]/70 hover:bg-white/60'
            }`}
          >
            <Flame size={14} />
            <span>Sacred Habits ({habits.length})</span>
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1 max-h-[300px]">
          {activeTab === 'tasks' ? (
            tasks.length === 0 ? (
              <p className="text-center text-xs text-[#49321F]/60 py-6">
                No tasks available to schedule. Create some in Tasks view!
              </p>
            ) : (
              tasks.map((task) => {
                const isSelected = selectedTaskId === task.id;
                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-white border-[#F28C28] shadow-sm'
                        : 'bg-white/60 hover:bg-white border-[#D6A43B]/30'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? 'border-[#F28C28] bg-[#F28C28] text-white'
                            : 'border-[#49321F]/30'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      <div>
                        <span className={`text-xs font-bold block ${task.completed ? 'line-through text-[#49321F]/50' : 'text-[#49321F]'}`}>
                          {task.title}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] uppercase font-bold text-[#F28C28] bg-[#FFE0C2] px-1.5 py-0.2 rounded">
                            {task.category}
                          </span>
                          {task.dueTime && (
                            <span className="text-[10px] text-[#49321F]/60">
                              ⏰ {task.dueTime}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {task.completed && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={11} /> Done
                      </span>
                    )}
                  </div>
                );
              })
            )
          ) : habits.length === 0 ? (
            <p className="text-center text-xs text-[#49321F]/60 py-6">
              No habits created yet.
            </p>
          ) : (
            habits.map((habit) => {
              const isSelected = selectedHabitId === habit.id;
              return (
                <div
                  key={habit.id}
                  onClick={() => setSelectedHabitId(habit.id)}
                  className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-white border-[#EA580C] shadow-sm'
                      : 'bg-white/60 hover:bg-white border-[#D6A43B]/30'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-[#EA580C] bg-[#EA580C] text-white'
                          : 'border-[#49321F]/30'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#49321F] block">
                        {habit.title}
                      </span>
                      <span className="text-[10px] text-[#EA580C] font-semibold">
                        🔥 {habit.streakDays} day streak
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Time & Duration Settings */}
        <div className="p-4 border-t border-[#D6A43B]/25 bg-white/70 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#49321F] uppercase tracking-wider mb-1">
                Start Time
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full pl-8 pr-2 py-2 rounded-xl border border-[#D6A43B]/50 bg-white text-xs font-bold text-[#49321F] focus:outline-none"
                />
                <Clock size={14} className="absolute left-2.5 top-2.5 text-[#F28C28]" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#49321F] uppercase tracking-wider mb-1">
                Duration
              </label>
              <select
                value={durationMins}
                onChange={(e) => setDurationMins(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#D6A43B]/50 bg-white text-xs font-bold text-[#49321F] focus:outline-none"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1 hr 30 mins</option>
                <option value={120}>2 hours</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-[#49321F]/70">
              Scheduling for: <strong>{selectedDate}</strong>
            </span>

            <button
              type="button"
              disabled={activeTab === 'tasks' ? !selectedTaskId : !selectedHabitId}
              onClick={handleImport}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#F28C28] to-[#D6A43B] text-white text-xs font-bold shadow-md hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <Plus size={15} />
              <span>Schedule into Day</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
