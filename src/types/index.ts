export type CompanionTone = 'anbudan' | 'veeram' | 'thozhan';

export type CharacterPose =
  | 'murugan_state_welcome'
  | 'murugan_state_happy'
  | 'murugan_state_study'
  | 'murugan_state_motivate'
  | 'murugan_state_remind'
  | 'murugan_state_celebrate'
  | 'murugan_state_peace'
  | 'murugan_state_sleep'
  | 'murugan_state_encourage'
  | 'murugan_state_excited'
  | 'murugan_state_sad'
  | 'murugan_state_thinking'
  | 'murugan_state_worried'
  | 'murugan_state_hydration'
  | 'murugan_state_break'
  | 'murugan_state_blessing'
  | 'happy'
  | 'sad'
  | 'sleepy'
  | 'excited'
  | 'thinking'
  | 'encouraging'
  | 'celebrating'
  | 'worried'
  | 'peaceful'
  | 'study'
  | 'hydration'
  | 'break'
  | 'welcome'
  | 'blessing'
  | 'motivate'
  | 'remind';

export type TaskCategory = 'work' | 'personal' | 'health' | 'learning' | 'spiritual' | 'study';

export type PriorityLevel = 1 | 2 | 3; // 1 = Low, 2 = Medium, 3 = High (Vels)

export interface SubTaskItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  category: TaskCategory;
  priority: PriorityLevel;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // e.g. "11:30 AM" or "14:00"
  estimatedMinutes?: number; // e.g. 15, 30, 45, 60, 90, 120
  completed: boolean;
  notes?: string;
  subtasks?: SubTaskItem[];
  goalId?: string; // Associated Goal ID
  isScheduledToPlanner?: boolean;
  createdAt?: string;
}

export type ActivityCategory =
  | 'study'
  | 'college'
  | 'work'
  | 'personal'
  | 'exercise'
  | 'break'
  | 'meals'
  | 'sleep'
  | 'custom';

export type RecurrenceType = 'none' | 'daily' | 'weekdays' | 'weekly' | 'custom_days';

export interface ScheduleActivity {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm format, e.g. "08:00"
  endTime: string; // HH:mm format, e.g. "09:30"
  category: ActivityCategory;
  customCategoryName?: string;
  color: string; // hex code
  hasReminder: boolean;
  reminderMinutesBefore: number; // e.g. 0, 5, 10, 15, 30, 60
  recurrence: RecurrenceType;
  recurrenceDays?: number[]; // [0=Sun, 1=Mon, ..., 6=Sat]
  completed?: boolean;
  taskId?: string; // Linked task ID
  habitId?: string; // Linked habit ID
  hasConflict?: boolean;
  conflictDetails?: string;
  createdAt: string;
}

export interface TimeBlock {
  id: string;
  title: string;
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "10:30"
  category: TaskCategory;
  locked?: boolean;
  hasConflict?: boolean;
  conflictDetails?: string;
}

// Goals Hierarchy: Long-term Goal -> Monthly Milestones -> Weekly Milestones -> Linked Tasks
export type GoalCategory = 'study' | 'work' | 'health' | 'learning' | 'personal' | 'spiritual';
export type GoalStatus = 'active' | 'completed' | 'paused' | 'archived';

export interface WeeklyMilestone {
  id: string;
  title: string;
  weekNumber: number; // 1, 2, 3, 4
  targetDate: string; // YYYY-MM-DD
  completed: boolean;
  notes?: string;
}

export interface MonthlyMilestone {
  id: string;
  title: string;
  month: string; // e.g. "November 2026"
  targetDate: string; // YYYY-MM-DD
  completed: boolean;
  weeklyMilestones: WeeklyMilestone[];
}

export interface GoalItem {
  id: string;
  title: string;
  description?: string;
  category: GoalCategory;
  status: GoalStatus;
  startDate: string; // YYYY-MM-DD
  targetDate: string; // YYYY-MM-DD
  color: string; // Hex color
  monthlyMilestones: MonthlyMilestone[];
  linkedTaskIds?: string[]; // IDs of tasks linked to this goal
  notes?: string;
  createdAt: string;
}

// Habits
export type HabitFrequency = 'daily' | 'weekdays' | 'custom_weekly';

export interface HabitItem {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  frequency?: HabitFrequency;
  streakDays: number;
  bestStreak?: number;
  completedDays: boolean[]; // Mon to Sun [M, T, W, T, F, S, S]
  targetPerWeek: number;
  badgeTitle?: string;
  isPaused?: boolean;
  reminderTime?: string;
  color?: string;
  historyDates?: string[]; // Array of 'YYYY-MM-DD'
  createdAt?: string;
}

// Hydration Log Entry
export interface WaterLogEntry {
  id: string;
  time: string; // e.g. "08:30 AM"
  amountMl: number;
  label: string;
  timestamp: number;
}

export interface AppLimitItem {
  id: string;
  appName: string;
  category: 'social' | 'entertainment' | 'work' | 'other';
  icon: string;
  usedMinutes: number;
  limitMinutes: number;
  isLocked: boolean;
}

export interface ReminderItem {
  id: string;
  title: string;
  tanglishTitle: string;
  category: 'hydration' | 'screentime' | 'focus' | 'priority_task' | 'celebration' | 'night' | 'morning';
  time: string;
  recurrence: string;
  enabled: boolean;
  pose: CharacterPose;
}

export interface UserProfile {
  name: string;
  nickname: string;
  companionTone: CompanionTone;
  level: number;
  levelTitle: string;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  reduceMotion: boolean;
  timeFormat24h?: boolean;
  weekStartsOnMonday?: boolean;
  overlayPermission: boolean;
  usagePermission: boolean;
  batteryOptimized: boolean;
  dailyWaterTargetMl: number;
  dailyFocusTargetMinutes: number;
  hydrationReminderIntervalMinutes?: number;
}

export interface JumpingOverlayPayload {
  isOpen: boolean;
  pose: CharacterPose;
  tanglishQuote: string;
  englishSubtitle: string;
  categoryTitle: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  scenarioMode?: 'in_app' | 'browser_video' | 'windows_desktop';
}

