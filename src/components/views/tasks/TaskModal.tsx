import React, { useState } from 'react';
import { TaskItem, TaskCategory, PriorityLevel, SubTaskItem, GoalItem } from '../../../types';
import { X, CheckSquare, Plus, Trash2, Clock, Calendar, Flag, Sparkles, Target } from 'lucide-react';
import { playTempleBell } from '../../../utils/audio';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<TaskItem, 'id' | 'completed'> & { id?: string }) => void;
  initialTask?: TaskItem | null;
  availableGoals?: GoalItem[];
  soundEnabled?: boolean;
}

const CATEGORIES: { id: TaskCategory; label: string; color: string }[] = [
  { id: 'work', label: 'Work & Projects', color: '#2455A4' },
  { id: 'study', label: 'Study & Academics', color: '#087F78' },
  { id: 'health', label: 'Health & Vitality', color: '#16A34A' },
  { id: 'spiritual', label: 'Spiritual Practice', color: '#F28C28' },
  { id: 'learning', label: 'Skills & Reading', color: '#D6A43B' },
  { id: 'personal', label: 'Personal & Errands', color: '#D94B83' },
];

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTask,
  availableGoals = [],
  soundEnabled = true,
}) => {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [category, setCategory] = useState<TaskCategory>(initialTask?.category || 'work');
  const [priority, setPriority] = useState<PriorityLevel>(initialTask?.priority || 2);
  const [dueDate, setDueDate] = useState(initialTask?.dueDate || '2026-11-01');
  const [dueTime, setDueTime] = useState(initialTask?.dueTime || '10:00 AM');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(
    initialTask?.estimatedMinutes || 45
  );
  const [goalId, setGoalId] = useState<string>(initialTask?.goalId || '');
  const [notes, setNotes] = useState(initialTask?.notes || '');
  const [subtasks, setSubtasks] = useState<SubTaskItem[]>(initialTask?.subtasks || []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const item: SubTaskItem = {
      id: `sub-${Date.now()}`,
      title: newSubtaskTitle.trim(),
      completed: false,
    };
    setSubtasks((prev) => [...prev, item]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (soundEnabled) playTempleBell(0.3);

    onSave({
      ...(initialTask?.id ? { id: initialTask.id } : {}),
      title: title.trim(),
      category,
      priority,
      dueDate,
      dueTime,
      estimatedMinutes,
      goalId: goalId || undefined,
      notes: notes.trim(),
      subtasks,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FFF2DC] border-2 border-[#D6A43B] rounded-3xl w-full max-w-lg shadow-elevated overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#FFE0C2]/80 border-b border-[#D6A43B]/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare size={20} className="text-[#F28C28]" />
            <h2 className="text-lg font-bold text-[#49321F] font-display">
              {initialTask ? 'Edit Task' : 'Create New Task'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#49321F]/10 text-[#49321F] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1">
              Task Title <span className="text-[#D94B83]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design responsive UI components with WCAG contrast"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D6A43B]/40 bg-white text-[#49321F] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#F28C28]"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold text-left border transition-all cursor-pointer ${
                    category === cat.id
                      ? 'border-[#F28C28] bg-white shadow-xs font-bold text-[#49321F]'
                      : 'border-[#D6A43B]/30 bg-[#FFF5EB] text-[#49321F]/70 hover:bg-white'
                  }`}
                >
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full mr-1.5"
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1.5">
                Priority (Golden Vels)
              </label>
              <div className="flex items-center gap-1.5">
                {[
                  { level: 1, label: '1 Vel · Low' },
                  { level: 2, label: '2 Vels · Medium' },
                  { level: 3, label: '3 Vels · High' },
                ].map((item) => (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => setPriority(item.level as PriorityLevel)}
                    className={`flex-1 py-2 px-1 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                      priority === item.level
                        ? 'bg-[#F28C28] text-white border-[#F28C28] shadow-xs'
                        : 'bg-white border-[#D6A43B]/30 text-[#49321F]/70 hover:bg-[#FFF5EB]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1.5">
                Estimated Duration
              </label>
              <select
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#D6A43B]/40 bg-white text-[#49321F] text-sm"
              >
                <option value={15}>15 minutes (Quick sprint)</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour (Deep focus)</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
              </select>
            </div>
          </div>

          {/* Due Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-[#D6A43B]/40 bg-white text-[#49321F] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1">
                Due Time (Optional)
              </label>
              <input
                type="text"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                placeholder="e.g. 10:30 AM or 14:00"
                className="w-full px-3.5 py-2 rounded-xl border border-[#D6A43B]/40 bg-white text-[#49321F] text-sm"
              />
            </div>
          </div>

          {/* Link to Goal */}
          {availableGoals.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Target size={14} className="text-[#087F78]" />
                <span>Link to Strategic Goal (Optional)</span>
              </label>
              <select
                value={goalId}
                onChange={(e) => setGoalId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D6A43B]/40 bg-white text-[#49321F] text-sm"
              >
                <option value="">No linked goal</option>
                {availableGoals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title} ({g.category})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Subtasks Checklist Builder */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider">
              Subtasks Checklist ({subtasks.length})
            </label>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {subtasks.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-[#D6A43B]/25 text-xs text-[#49321F]"
                >
                  <span className="truncate flex-1">{st.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(st.id)}
                    className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                placeholder="Add actionable subtask..."
                className="flex-1 px-3 py-1.5 rounded-xl border border-[#D6A43B]/40 bg-white text-[#49321F] text-xs"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 rounded-xl bg-[#FFE0C2] hover:bg-[#FFD166] text-[#49321F] text-xs font-bold border border-[#D6A43B]/30 cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1">
              Notes & Guidance
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any details, links, or context..."
              rows={2}
              className="w-full px-3.5 py-2 rounded-xl border border-[#D6A43B]/40 bg-white text-[#49321F] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#F28C28]"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[#D6A43B]/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#D6A43B]/40 text-[#49321F] text-xs font-bold hover:bg-[#49321F]/5 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F28C28] to-[#D6A43B] text-white text-xs font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles size={14} />
              <span>{initialTask ? 'Save Task' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
