import React, { useState, useEffect } from 'react';
import { ScheduleActivity, ActivityCategory, RecurrenceType } from '../../../types';
import {
  CATEGORY_METAS,
  COLOR_PALETTE,
  formatDateKey,
  timeToMinutes,
  minutesToTime,
  formatTimeDisplay,
  calculateDuration,
  formatDurationHuman,
} from '../../../utils/scheduleStorage';
import {
  X,
  Clock,
  Calendar as CalendarIcon,
  Tag,
  Palette,
  Bell,
  Repeat,
  AlertTriangle,
  Trash2,
  Check,
  BookOpen,
  GraduationCap,
  Briefcase,
  Heart,
  Dumbbell,
  Coffee,
  Utensils,
  Moon,
  Sparkles,
} from 'lucide-react';
import { playTempleBell, playVictoryChime } from '../../../utils/audio';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: ScheduleActivity) => void;
  onDelete?: (id: string) => void;
  initialActivity?: ScheduleActivity | null;
  selectedDate: string; // YYYY-MM-DD
  existingActivities: ScheduleActivity[];
  soundEnabled?: boolean;
}

const CATEGORY_ICONS: Record<ActivityCategory, React.ElementType> = {
  study: BookOpen,
  college: GraduationCap,
  work: Briefcase,
  personal: Heart,
  exercise: Dumbbell,
  break: Coffee,
  meals: Utensils,
  sleep: Moon,
  custom: Sparkles,
};

const WEEKDAY_NAMES = [
  { day: 0, label: 'Sun' },
  { day: 1, label: 'Mon' },
  { day: 2, label: 'Tue' },
  { day: 3, label: 'Wed' },
  { day: 4, label: 'Thu' },
  { day: 5, label: 'Fri' },
  { day: 6, label: 'Sat' },
];

export const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialActivity,
  selectedDate,
  existingActivities,
  soundEnabled = true,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(selectedDate);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [category, setCategory] = useState<ActivityCategory>('study');
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [color, setColor] = useState(COLOR_PALETTE[0]);
  const [hasReminder, setHasReminder] = useState(true);
  const [reminderMinutesBefore, setReminderMinutesBefore] = useState(15);
  const [recurrence, setRecurrence] = useState<RecurrenceType>('none');
  const [recurrenceDays, setRecurrenceDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setConfirmDelete(false);
      setErrorMsg('');
      return;
    }

    if (initialActivity) {
      setTitle(initialActivity.title);
      setDescription(initialActivity.description || '');
      setDate(initialActivity.date);
      setStartTime(initialActivity.startTime);
      setEndTime(initialActivity.endTime);
      setCategory(initialActivity.category);
      setCustomCategoryName(initialActivity.customCategoryName || '');
      setColor(initialActivity.color || CATEGORY_METAS[initialActivity.category]?.defaultColor || COLOR_PALETTE[0]);
      setHasReminder(initialActivity.hasReminder ?? true);
      setReminderMinutesBefore(initialActivity.reminderMinutesBefore ?? 15);
      setRecurrence(initialActivity.recurrence || 'none');
      setRecurrenceDays(initialActivity.recurrenceDays || [1, 2, 3, 4, 5]);
    } else {
      // New activity default
      setTitle('');
      setDescription('');
      setDate(selectedDate || formatDateKey(new Date()));
      setStartTime('10:00');
      setEndTime('11:00');
      setCategory('study');
      setCustomCategoryName('');
      setColor(CATEGORY_METAS.study.defaultColor);
      setHasReminder(true);
      setReminderMinutesBefore(15);
      setRecurrence('none');
      setRecurrenceDays([1, 2, 3, 4, 5]);
    }
    setConfirmDelete(false);
    setErrorMsg('');
  }, [isOpen, initialActivity, selectedDate]);

  if (!isOpen) return null;

  // Real-time conflict preview
  const currentStartMins = timeToMinutes(startTime);
  const currentEndMins = timeToMinutes(endTime);
  const isEndTimeBeforeStart = currentEndMins <= currentStartMins;

  const overlappingActivities = existingActivities.filter((act) => {
    if (initialActivity && act.id === initialActivity.id) return false;
    if (act.date !== date) return false;
    const aStart = timeToMinutes(act.startTime);
    let aEnd = timeToMinutes(act.endTime);
    if (aEnd <= aStart) aEnd += 24 * 60;

    let bEnd = currentEndMins;
    if (bEnd <= currentStartMins) bEnd += 24 * 60;

    return currentStartMins < aEnd && bEnd > aStart;
  });

  const durationMinutes = calculateDuration(startTime, endTime);

  const handleCategorySelect = (cat: ActivityCategory) => {
    setCategory(cat);
    if (!initialActivity) {
      setColor(CATEGORY_METAS[cat].defaultColor);
    }
  };

  const toggleDay = (day: number) => {
    setRecurrenceDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter an activity title');
      return;
    }

    if (category === 'custom' && !customCategoryName.trim()) {
      setErrorMsg('Please enter a name for your custom category');
      return;
    }

    const activityToSave: ScheduleActivity = {
      id: initialActivity ? initialActivity.id : `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: title.trim(),
      description: description.trim() || undefined,
      date,
      startTime,
      endTime,
      category,
      customCategoryName: category === 'custom' ? customCategoryName.trim() : undefined,
      color,
      hasReminder,
      reminderMinutesBefore,
      recurrence,
      recurrenceDays: recurrence === 'custom_days' ? recurrenceDays : undefined,
      completed: initialActivity?.completed || false,
      taskId: initialActivity?.taskId,
      habitId: initialActivity?.habitId,
      createdAt: initialActivity?.createdAt || new Date().toISOString(),
    };

    if (soundEnabled) playVictoryChime();
    onSave(activityToSave);
    onClose();
  };

  const handleDelete = () => {
    if (!initialActivity || !onDelete) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    if (soundEnabled) playTempleBell(0.3);
    onDelete(initialActivity.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#FFF5EB] rounded-3xl shadow-2xl border-2 border-[#D6A43B]/40 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#D6A43B]/30 bg-gradient-to-r from-[#FFE0C2] to-[#FFF2DC]">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: color }}
            >
              {React.createElement(CATEGORY_ICONS[category] || Sparkles, { size: 18 })}
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#49321F] font-display">
                {initialActivity ? 'Edit Scheduled Activity' : 'Create New Activity'}
              </h2>
              <p className="text-[11px] text-[#49321F]/70">
                Personalized Muruga Care Daily Schedule
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

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {errorMsg && (
            <div className="p-3 bg-red-100 border border-red-300 rounded-xl text-red-800 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle size={15} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Activity Title */}
          <div>
            <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1.5">
              Activity Name *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Deep Focus Study, College Lecture, Yoga..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D6A43B]/50 bg-white text-[#49321F] placeholder:text-[#49321F]/40 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#F28C28]"
              autoFocus
            />
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#49321F] uppercase tracking-wider mb-1">
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-2 rounded-xl border border-[#D6A43B]/50 bg-white text-xs font-bold text-[#49321F] focus:outline-none focus:ring-2 focus:ring-[#F28C28]"
                />
                <CalendarIcon size={14} className="absolute left-2.5 top-2.5 text-[#F28C28]" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#49321F] uppercase tracking-wider mb-1">
                Start Time
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full pl-8 pr-2 py-2 rounded-xl border border-[#D6A43B]/50 bg-white text-xs font-bold text-[#49321F] focus:outline-none focus:ring-2 focus:ring-[#F28C28]"
                />
                <Clock size={14} className="absolute left-2.5 top-2.5 text-[#F28C28]" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#49321F] uppercase tracking-wider mb-1">
                End Time
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full pl-8 pr-2 py-2 rounded-xl border border-[#D6A43B]/50 bg-white text-xs font-bold text-[#49321F] focus:outline-none focus:ring-2 focus:ring-[#F28C28]"
                />
                <Clock size={14} className="absolute left-2.5 top-2.5 text-[#F28C28]" />
              </div>
            </div>
          </div>

          {/* Duration Badge & Time Details */}
          <div className="flex items-center justify-between text-xs px-3 py-1.5 bg-[#FFE5D0]/60 rounded-xl border border-[#D6A43B]/30 font-medium text-[#49321F]">
            <span>
              Duration: <strong>{formatDurationHuman(durationMinutes)}</strong>
            </span>
            <span className="text-[11px] text-[#49321F]/70">
              {formatTimeDisplay(startTime)} → {formatTimeDisplay(endTime)}
              {isEndTimeBeforeStart && ' (Next day)'}
            </span>
          </div>

          {/* Conflict Warning Preview */}
          {overlappingActivities.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                <AlertTriangle size={15} />
                <span>Time Conflict Warning!</span>
              </div>
              <p className="text-[11px]">
                Overlaps with: {overlappingActivities.map((o) => `"${o.title}" (${formatTimeDisplay(o.startTime)} - ${formatTimeDisplay(o.endTime)})`).join(', ')}.
                You can still save, and Murugan will help auto-shift later.
              </p>
            </div>
          )}

          {/* Activity Category Selection */}
          <div>
            <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Tag size={13} className="text-[#F28C28]" />
              <span>Category</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {(Object.keys(CATEGORY_METAS) as ActivityCategory[]).map((catKey) => {
                const meta = CATEGORY_METAS[catKey];
                const Icon = CATEGORY_ICONS[catKey];
                const isSelected = category === catKey;

                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => handleCategorySelect(catKey)}
                    className={`px-2 py-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#F28C28] text-[#49321F] shadow-sm ring-2 ring-[#F28C28]/30 scale-102'
                        : 'bg-white/60 hover:bg-white border-[#D6A43B]/30 text-[#49321F]/80'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: isSelected ? color : meta.defaultColor }}
                    >
                      <Icon size={14} />
                    </div>
                    <span className="text-[11px] truncate w-full text-center">{meta.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Category Label */}
            {category === 'custom' && (
              <div className="mt-2.5">
                <input
                  type="text"
                  value={customCategoryName}
                  onChange={(e) => setCustomCategoryName(e.target.value)}
                  placeholder="Enter custom category name (e.g. Sanskrit Chanting, Flute Practice)"
                  className="w-full px-3 py-2 rounded-xl border border-[#D6A43B]/50 bg-white text-xs font-semibold text-[#49321F] focus:outline-none focus:ring-2 focus:ring-[#F28C28]"
                />
              </div>
            )}
          </div>

          {/* Color Palette Selector */}
          <div>
            <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Palette size={13} className="text-[#F28C28]" />
              <span>Accent Color</span>
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-all cursor-pointer flex items-center justify-center border-2 ${
                    color.toLowerCase() === c.toLowerCase()
                      ? 'border-[#49321F] scale-115 shadow-md'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                >
                  {color.toLowerCase() === c.toLowerCase() && (
                    <Check size={14} className="text-white drop-shadow-xs" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Recurrence Selection */}
          <div className="bg-white/80 p-3 rounded-2xl border border-[#D6A43B]/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#49321F] uppercase tracking-wider flex items-center gap-1.5">
                <Repeat size={13} className="text-[#F28C28]" />
                <span>Repeat Schedule</span>
              </label>

              <select
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value as RecurrenceType)}
                className="px-2.5 py-1 rounded-lg border border-[#D6A43B]/50 bg-[#FFF5EB] text-xs font-bold text-[#49321F] focus:outline-none focus:ring-2 focus:ring-[#F28C28]"
              >
                <option value="none">Does not repeat</option>
                <option value="daily">Every day</option>
                <option value="weekdays">Selected weekdays (Mon-Fri)</option>
                <option value="weekly">Every week ({new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })})</option>
                <option value="custom_days">Custom recurring days</option>
              </select>
            </div>

            {/* Custom Day Checkboxes */}
            {recurrence === 'custom_days' && (
              <div className="pt-2 border-t border-[#D6A43B]/20">
                <p className="text-[11px] font-semibold text-[#49321F]/70 mb-1.5">
                  Select repeat days:
                </p>
                <div className="flex items-center justify-between gap-1">
                  {WEEKDAY_NAMES.map(({ day, label }) => {
                    const isSelected = recurrenceDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#F28C28] text-white shadow-xs'
                            : 'bg-[#FFE5D0]/60 text-[#49321F] hover:bg-[#FFE0C2]'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Reminder Toggle & Settings */}
          <div className="bg-white/80 p-3 rounded-2xl border border-[#D6A43B]/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FFE0C2] flex items-center justify-center text-[#F28C28]">
                <Bell size={16} />
              </div>
              <div>
                <span className="text-xs font-bold text-[#49321F] block">
                  Murugan Reminder
                </span>
                <span className="text-[11px] text-[#49321F]/70">
                  Notify before activity begins
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="reminderCheck"
                checked={hasReminder}
                onChange={(e) => setHasReminder(e.target.checked)}
                className="w-4 h-4 text-[#F28C28] accent-[#F28C28] rounded cursor-pointer"
              />

              {hasReminder && (
                <select
                  value={reminderMinutesBefore}
                  onChange={(e) => setReminderMinutesBefore(Number(e.target.value))}
                  className="px-2 py-1 rounded-lg border border-[#D6A43B]/40 bg-[#FFF5EB] text-xs font-bold text-[#49321F] focus:outline-none"
                >
                  <option value={0}>At start time</option>
                  <option value={5}>5 mins before</option>
                  <option value={10}>10 mins before</option>
                  <option value={15}>15 mins before</option>
                  <option value={30}>30 mins before</option>
                  <option value={60}>1 hour before</option>
                </select>
              )}
            </div>
          </div>

          {/* Description / Notes */}
          <div>
            <label className="block text-xs font-bold text-[#49321F] uppercase tracking-wider mb-1">
              Description & Focus Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key objectives, reading materials, or reminders for this session..."
              className="w-full px-3 py-2 rounded-xl border border-[#D6A43B]/50 bg-white text-xs font-medium text-[#49321F] placeholder:text-[#49321F]/40 focus:outline-none focus:ring-2 focus:ring-[#F28C28]"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-[#D6A43B]/30">
            {initialActivity && onDelete ? (
              <div>
                {confirmDelete ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
                    >
                      Confirm Delete?
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="px-2 py-2 bg-gray-200 text-[#49321F] rounded-xl text-xs font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[#D6A43B]/40 bg-white hover:bg-[#FFE0C2] text-[#49321F] font-bold text-xs transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F28C28] to-[#D6A43B] hover:opacity-95 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Check size={15} />
                <span>{initialActivity ? 'Save Changes' : 'Schedule Activity'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
