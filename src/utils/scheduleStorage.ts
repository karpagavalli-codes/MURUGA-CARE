import { ScheduleActivity, ActivityCategory, RecurrenceType } from '../types';

export const SCHEDULE_STORAGE_KEY = 'muruga_care_schedule_activities_v2';

export interface CategoryMeta {
  id: ActivityCategory;
  label: string;
  defaultColor: string;
  bgLight: string;
  borderLight: string;
  badgeText: string;
}

export const CATEGORY_METAS: Record<ActivityCategory, CategoryMeta> = {
  study: {
    id: 'study',
    label: 'Study',
    defaultColor: '#2563EB',
    bgLight: 'bg-[#2563EB]/10',
    borderLight: 'border-[#2563EB]/40',
    badgeText: 'text-[#2563EB]',
  },
  college: {
    id: 'college',
    label: 'College',
    defaultColor: '#7C3AED',
    bgLight: 'bg-[#7C3AED]/10',
    borderLight: 'border-[#7C3AED]/40',
    badgeText: 'text-[#7C3AED]',
  },
  work: {
    id: 'work',
    label: 'Work',
    defaultColor: '#0D9488',
    bgLight: 'bg-[#0D9488]/10',
    borderLight: 'border-[#0D9488]/40',
    badgeText: 'text-[#0D9488]',
  },
  personal: {
    id: 'personal',
    label: 'Personal',
    defaultColor: '#EA580C',
    bgLight: 'bg-[#EA580C]/10',
    borderLight: 'border-[#EA580C]/40',
    badgeText: 'text-[#EA580C]',
  },
  exercise: {
    id: 'exercise',
    label: 'Exercise',
    defaultColor: '#16A34A',
    bgLight: 'bg-[#16A34A]/10',
    borderLight: 'border-[#16A34A]/40',
    badgeText: 'text-[#16A34A]',
  },
  break: {
    id: 'break',
    label: 'Break',
    defaultColor: '#D97706',
    bgLight: 'bg-[#D97706]/10',
    borderLight: 'border-[#D97706]/40',
    badgeText: 'text-[#D97706]',
  },
  meals: {
    id: 'meals',
    label: 'Meals',
    defaultColor: '#DC2626',
    bgLight: 'bg-[#DC2626]/10',
    borderLight: 'border-[#DC2626]/40',
    badgeText: 'text-[#DC2626]',
  },
  sleep: {
    id: 'sleep',
    label: 'Sleep',
    defaultColor: '#4F46E5',
    bgLight: 'bg-[#4F46E5]/10',
    borderLight: 'border-[#4F46E5]/40',
    badgeText: 'text-[#4F46E5]',
  },
  custom: {
    id: 'custom',
    label: 'Custom',
    defaultColor: '#9333EA',
    bgLight: 'bg-[#9333EA]/10',
    borderLight: 'border-[#9333EA]/40',
    badgeText: 'text-[#9333EA]',
  },
};

export const COLOR_PALETTE = [
  '#EA580C', // Saffron
  '#0D9488', // Peacock Teal
  '#2563EB', // Royal Blue
  '#D97706', // Sacred Gold
  '#16A34A', // Nature Green
  '#7C3AED', // Royal Purple
  '#DC2626', // Kumkum Red
  '#4F46E5', // Indigo
  '#EC4899', // Lotus Pink
  '#0891B2', // Sky Blue
];

/**
 * Format Date to YYYY-MM-DD
 */
export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Parse YYYY-MM-DD into a Date (at midnight local time)
 */
export function parseDateKey(dateStr: string): Date {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return new Date();
  return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
}

/**
 * Converts "HH:mm" (24h) to total minutes from 00:00
 */
export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  // Handle 12-hour AM/PM if present
  const ampmMatch = timeStr.match(/(AM|PM)/i);
  if (ampmMatch) {
    const isPM = ampmMatch[1].toUpperCase() === 'PM';
    const clean = timeStr.replace(/(AM|PM)/gi, '').trim();
    const [h, m] = clean.split(':').map((v) => parseInt(v, 10) || 0);
    let hour = h;
    if (isPM && hour < 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;
    return hour * 60 + m;
  }

  const [hours, minutes] = timeStr.split(':').map((v) => parseInt(v, 10) || 0);
  return hours * 60 + minutes;
}

/**
 * Converts minutes from 00:00 to "HH:mm" 24h
 */
export function minutesToTime(mins: number): string {
  const normalized = Math.max(0, Math.min(24 * 60 - 1, mins));
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Formats "08:30" or "14:15" to friendly "8:30 AM" or "2:15 PM"
 */
export function formatTimeDisplay(timeStr: string): string {
  if (!timeStr) return '';
  const totalMins = timeToMinutes(timeStr);
  const hours24 = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  const ampm = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${String(mins).padStart(2, '0')} ${ampm}`;
}

/**
 * Calculates duration in minutes
 */
export function calculateDuration(startTime: string, endTime: string): number {
  let startMins = timeToMinutes(startTime);
  let endMins = timeToMinutes(endTime);
  if (endMins <= startMins) {
    // Spans past midnight
    endMins += 24 * 60;
  }
  return endMins - startMins;
}

/**
 * Formats duration in minutes to e.g. "1h 30m" or "45m"
 */
export function formatDurationHuman(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/**
 * Checks if a scheduled activity applies to a specific calendar date (handling recurrence)
 */
export function activityAppliesToDate(activity: ScheduleActivity, targetDateStr: string): boolean {
  if (activity.recurrence === 'none') {
    return activity.date === targetDateStr;
  }

  // Activity start date must not be after target date
  if (targetDateStr < activity.date) {
    return false;
  }

  const targetDate = parseDateKey(targetDateStr);
  const dayOfWeek = targetDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  switch (activity.recurrence) {
    case 'daily':
      return true;

    case 'weekdays':
      return dayOfWeek >= 1 && dayOfWeek <= 5; // Monday to Friday

    case 'weekly': {
      const origDate = parseDateKey(activity.date);
      return targetDate.getDay() === origDate.getDay();
    }

    case 'custom_days':
      return Array.isArray(activity.recurrenceDays) && activity.recurrenceDays.includes(dayOfWeek);

    default:
      return activity.date === targetDateStr;
  }
}

/**
 * Detect overlapping/conflicting activities on the given date
 */
export function detectConflictsForDate(activities: ScheduleActivity[], dateStr: string): ScheduleActivity[] {
  // Filter activities applying to this date
  const dayActivities = activities.filter((act) => activityAppliesToDate(act, dateStr));

  // Reset conflict flags first
  const updated: ScheduleActivity[] = dayActivities.map((act) => ({
    ...act,
    hasConflict: false,
    conflictDetails: undefined,
  }));

  // Sort by start time in minutes
  updated.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  for (let i = 0; i < updated.length; i++) {
    const actA = updated[i];
    const startA = timeToMinutes(actA.startTime);
    let endA = timeToMinutes(actA.endTime);
    if (endA <= startA) endA += 24 * 60;

    for (let j = i + 1; j < updated.length; j++) {
      const actB = updated[j];
      const startB = timeToMinutes(actB.startTime);
      let endB = timeToMinutes(actB.endTime);
      if (endB <= startB) endB += 24 * 60;

      // Overlap condition: startA < endB && endA > startB
      if (startA < endB && endA > startB) {
        actA.hasConflict = true;
        actA.conflictDetails = `Overlaps with "${actB.title}" (${formatTimeDisplay(actB.startTime)} - ${formatTimeDisplay(actB.endTime)})`;

        actB.hasConflict = true;
        actB.conflictDetails = `Overlaps with "${actA.title}" (${formatTimeDisplay(actA.startTime)} - ${formatTimeDisplay(actA.endTime)})`;
      }
    }
  }

  // Map back into full activities list
  const dayMap = new Map(updated.map((u) => [u.id, u]));
  return activities.map((act) => dayMap.get(act.id) || act);
}

/**
 * Smart Conflict Resolution ("Optimize with Murugan"):
 * Automatically adjusts start and end times of conflicting activities so they sequence harmoniously without overlap.
 */
export function resolveConflictsAutomatically(
  allActivities: ScheduleActivity[],
  dateStr: string
): ScheduleActivity[] {
  const dayActivities = allActivities.filter((act) => activityAppliesToDate(act, dateStr));
  if (dayActivities.length === 0) return allActivities;

  // Sort by startTime
  const sorted = [...dayActivities].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  let lastEndMinutes = 0;
  const adjustedMap = new Map<string, { startTime: string; endTime: string }>();

  for (let i = 0; i < sorted.length; i++) {
    const act = sorted[i];
    const duration = calculateDuration(act.startTime, act.endTime);
    let currentStart = timeToMinutes(act.startTime);

    if (i > 0 && currentStart < lastEndMinutes) {
      // Push forward to resolve overlap
      currentStart = lastEndMinutes;
    }

    const currentEnd = currentStart + duration;
    adjustedMap.set(act.id, {
      startTime: minutesToTime(currentStart),
      endTime: minutesToTime(Math.min(23 * 60 + 59, currentEnd)),
    });

    lastEndMinutes = currentEnd;
  }

  // Update all activities
  return allActivities.map((act) => {
    const adj = adjustedMap.get(act.id);
    if (adj) {
      return {
        ...act,
        startTime: adj.startTime,
        endTime: adj.endTime,
        hasConflict: false,
        conflictDetails: undefined,
      };
    }
    return act;
  });
}

/**
 * Initial Default Seed Schedule
 * Provides a realistic, fully editable schedule for today
 */
export function getInitialScheduleSeed(): ScheduleActivity[] {
  const todayKey = formatDateKey(new Date());

  return [
    {
      id: 'act-seed-1',
      title: 'Morning Meditation & Surya Namaskar',
      description: 'Chant Murugan Gayatri mantra, 12 rounds of Surya Namaskar and light meditation.',
      date: todayKey,
      startTime: '07:00',
      endTime: '07:45',
      category: 'personal',
      color: '#EA580C',
      hasReminder: true,
      reminderMinutesBefore: 10,
      recurrence: 'daily',
      completed: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'act-seed-2',
      title: 'College Lecture: Data Structures & Algorithms',
      description: 'Advanced graph traversal algorithms, tree structures, and dynamic programming.',
      date: todayKey,
      startTime: '09:00',
      endTime: '10:30',
      category: 'college',
      color: '#7C3AED',
      hasReminder: true,
      reminderMinutesBefore: 15,
      recurrence: 'weekdays',
      completed: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'act-seed-3',
      title: 'Deep Focus Study: Software Architecture',
      description: 'Draft API schemas, verify database relations, and review responsive component design.',
      date: todayKey,
      startTime: '11:00',
      endTime: '12:30',
      category: 'study',
      color: '#2563EB',
      hasReminder: true,
      reminderMinutesBefore: 10,
      recurrence: 'none',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'act-seed-4',
      title: 'Satvik Lunch & Mindful Walk',
      description: 'Nutritious south Indian meal, 500ml warm water, and relaxing eye rest.',
      date: todayKey,
      startTime: '12:45',
      endTime: '13:45',
      category: 'meals',
      color: '#DC2626',
      hasReminder: false,
      reminderMinutesBefore: 0,
      recurrence: 'daily',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'act-seed-5',
      title: 'Project Engineering Sprint: Muruga Care',
      description: 'Implement comprehensive daily planner with multi-view calendars and conflict detection.',
      date: todayKey,
      startTime: '14:15',
      endTime: '16:00',
      category: 'work',
      color: '#0D9488',
      hasReminder: true,
      reminderMinutesBefore: 15,
      recurrence: 'none',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'act-seed-6',
      title: 'Evening Workout & Breathwork',
      description: 'Calisthenics workout followed by 10 minutes of Pranayama breath control.',
      date: todayKey,
      startTime: '17:30',
      endTime: '18:30',
      category: 'exercise',
      color: '#16A34A',
      hasReminder: true,
      reminderMinutesBefore: 10,
      recurrence: 'daily',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'act-seed-7',
      title: 'Evening Dhyanam & Reading',
      description: 'Read 15 pages of inspiring spiritual or technical literature.',
      date: todayKey,
      startTime: '19:30',
      endTime: '20:15',
      category: 'personal',
      color: '#D97706',
      hasReminder: true,
      reminderMinutesBefore: 5,
      recurrence: 'daily',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'act-seed-8',
      title: 'Dinner & Digital Sunset',
      description: 'Turn off notification sounds and prepare mind for restorative rest.',
      date: todayKey,
      startTime: '20:30',
      endTime: '21:30',
      category: 'break',
      color: '#EA580C',
      hasReminder: false,
      reminderMinutesBefore: 0,
      recurrence: 'daily',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'act-seed-9',
      title: 'Restorative Sleep & Rejuvenation',
      description: 'Deep sleep sanctuary with zero blue light.',
      date: todayKey,
      startTime: '22:30',
      endTime: '06:30',
      category: 'sleep',
      color: '#4F46E5',
      hasReminder: true,
      reminderMinutesBefore: 30,
      recurrence: 'daily',
      completed: false,
      createdAt: new Date().toISOString(),
    },
  ];
}

/**
 * Load activities from localStorage
 */
export function loadScheduleActivities(): ScheduleActivity[] {
  if (typeof window === 'undefined') return getInitialScheduleSeed();
  try {
    const raw = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    if (!raw) {
      const initial = getInitialScheduleSeed();
      localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    const initial = getInitialScheduleSeed();
    localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  } catch (err) {
    console.warn('Error reading schedule from localStorage:', err);
    return getInitialScheduleSeed();
  }
}

/**
 * Save activities to localStorage
 */
export function saveScheduleActivities(activities: ScheduleActivity[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(activities));
  } catch (err) {
    console.warn('Error saving schedule to localStorage:', err);
  }
}
