import React, { useState } from 'react';
import { Header } from './components/common/Header';
import { MobileBottomBar } from './components/common/MobileBottomBar';
import { ParandhuVaaOverlay } from './components/mascot/ParandhuVaaOverlay';
import { SplashScreen } from './components/views/SplashScreen';
import { OnboardingModal } from './components/views/OnboardingModal';
import { DashboardView } from './components/views/DashboardView';
import { TasksView } from './components/views/TasksView';
import { PlannerView } from './components/views/PlannerView';
import { FocusStudioView } from './components/views/FocusStudioView';
import { WellbeingView } from './components/views/WellbeingView';
import { HabitTrackerView } from './components/views/HabitTrackerView';
import { HydrationView } from './components/views/HydrationView';
import { RemindersView } from './components/views/RemindersView';
import { InsightsView } from './components/views/InsightsView';
import { ProfileView } from './components/views/ProfileView';
import { GoalsView } from './components/views/GoalsView';
import { SettingsView } from './components/views/SettingsView';
import { BalaMurugan } from './components/mascot/BalaMurugan';
import { PeacockCornerMotif, VelIcon } from './components/common/Decorations';
import {
  UserProfile,
  TaskItem,
  GoalItem,
  ScheduleActivity,
  JumpingOverlayPayload,
  ReminderItem,
  CharacterPose,
} from './types';
import { loadStoredGoals } from './utils/goalsStorage';
import { loadScheduleActivities, saveScheduleActivities } from './utils/scheduleStorage';
import {
  Sparkles,
  Smartphone,
  Monitor,
  Droplets,
  Clock,
  BookOpen,
  Coffee,
  CheckCircle2,
} from 'lucide-react';
import { playTempleBell, playVictoryChime, playWaterDrop } from './utils/audio';

export default function App() {
  // Splash & Onboarding states (Single unified welcome sanctuary screen on Dashboard)
  const [showSplash, setShowSplash] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Active Tab
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Device simulation preview mode (Desktop full-width vs Mobile 390px frame)
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');

  // User Profile
  const [user, setUser] = useState<UserProfile>({
    name: 'Karthik Narayanan',
    nickname: 'Kanna',
    companionTone: 'thozhan',
    level: 4,
    levelTitle: 'Level 4: Sadhakan (Focus Seeker)',
    soundEnabled: true,
    hapticsEnabled: true,
    reduceMotion: false,
    overlayPermission: true,
    usagePermission: true,
    batteryOptimized: true,
    dailyWaterTargetMl: 2500,
    dailyFocusTargetMinutes: 180, // 3 hours
  });

  // Daily Metrics
  const [waterDrankMl, setWaterDrankMl] = useState<number>(1750);
  const [focusMinutesToday, setFocusMinutesToday] = useState<number>(105); // 1h 45m
  const [screenTimeMinutesToday, setScreenTimeMinutesToday] = useState<number>(134); // 2h 14m

  // Tasks
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: 't1',
      title: 'Systems Architecture & Review',
      category: 'work',
      priority: 3,
      dueDate: '2026-11-01',
      dueTime: '09:30 AM',
      completed: true,
      notes: 'Prepare core design tokens, color contrast AA compliance, and modular UI structure.',
    },
    {
      id: 't2',
      title: '15-Minute Breathwork & Surya Namaskar',
      category: 'health',
      priority: 2,
      dueDate: '2026-11-01',
      dueTime: '08:00 AM',
      completed: true,
      notes: 'Invigorating morning energy before diving into code.',
    },
    {
      id: 't3',
      title: 'Client Status Alignment & Milestones',
      category: 'work',
      priority: 3,
      dueDate: '2026-11-01',
      dueTime: '01:30 PM',
      completed: false,
      notes: 'Walkthrough new Parandhu Vaa overlay interactive physics and soundscapes.',
    },
    {
      id: 't4',
      title: 'Hydration & Mindful Desk Walk',
      category: 'health',
      priority: 1,
      dueDate: '2026-11-01',
      dueTime: '11:00 AM',
      completed: true,
      notes: 'Log 250ml Theertham and stretch neck.',
    },
    {
      id: 't5',
      title: 'Read 15 Pages: The Wisdom of Skanda',
      category: 'spiritual',
      priority: 2,
      dueDate: '2026-11-01',
      dueTime: '09:00 PM',
      completed: false,
      notes: 'Evening reflection with no screens nearby.',
    },
    {
      id: 't6',
      title: 'Refactor Vector Mascot Engine to 60fps',
      category: 'learning',
      priority: 3,
      dueDate: '2026-11-01',
      dueTime: '03:45 PM',
      completed: false,
      notes: 'Verify 10 unique poses render smoothly without any layout jank.',
    },
  ]);

  // Goals and Planner Activities state
  const [goals, setGoals] = useState<GoalItem[]>(() => loadStoredGoals());
  const [activities, setActivities] = useState<ScheduleActivity[]>(() => loadScheduleActivities());

  // Parandhu Vaa Jumping Overlay state (Part 3 specifications)
  const [jumpingOverlay, setJumpingOverlay] = useState<JumpingOverlayPayload>({
    isOpen: false,
    pose: 'hydration',
    tanglishQuote: 'Kanna! Water kudikka time aachu! 💧',
    englishSubtitle: 'Time to drink water! Keep your body refreshed and energetic.',
    categoryTitle: '💧 Hydration Check',
    primaryActionLabel: 'DRANK 250ML',
    secondaryActionLabel: 'SNOOZE 10M',
    scenarioMode: 'in_app',
  });

  // Task Handlers
  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          // Synchronously reflect completion in any linked schedule activities
          setActivities((actPrev) => {
            const updatedActs = actPrev.map((a) =>
              a.taskId === id ? { ...a, completed: nextCompleted } : a
            );
            saveScheduleActivities(updatedActs);
            return updatedActs;
          });
          return { ...t, completed: nextCompleted };
        }
        return t;
      })
    );
  };

  const handleAddTask = (newTask: Omit<TaskItem, 'id' | 'completed'> & { id?: string }) => {
    if (newTask.id) {
      // Edit existing task
      setTasks((prev) =>
        prev.map((t) => (t.id === newTask.id ? { ...t, ...newTask } : t))
      );
    } else {
      // Add new task
      const task: TaskItem = {
        ...newTask,
        id: 't-' + Date.now(),
        completed: false,
      };
      setTasks((prev) => [task, ...prev]);
    }
  };

  const handleScheduleActivity = (newAct: ScheduleActivity) => {
    setActivities((prev) => {
      const updated = [newAct, ...prev];
      saveScheduleActivities(updated);
      return updated;
    });

    if (newAct.taskId) {
      setTasks((prev) =>
        prev.map((t) => (t.id === newAct.taskId ? { ...t, isScheduledToPlanner: true } : t))
      );
    }
    if (user.soundEnabled) playVictoryChime();
  };

  const handleDeleteTask = (id: string) => {
    if (user.soundEnabled) playTempleBell(0.2);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Water Handlers
  const handleAddWater = (amountMl: number) => {
    setWaterDrankMl((prev) => prev + amountMl);
  };

  const handleResetWater = () => {
    if (user.soundEnabled) playTempleBell(0.3);
    setWaterDrankMl(0);
  };

  // Focus Handlers
  const handleLogFocusMinutes = (minutes: number) => {
    setFocusMinutesToday((prev) => prev + minutes);
  };

  // Triggering Part 3 Specified Reminders
  const triggerJumpingPopup = (customProps?: Partial<JumpingOverlayPayload>) => {
    const presets: JumpingOverlayPayload[] = [
      // 1. Hydration
      {
        isOpen: true,
        pose: 'hydration',
        tanglishQuote: `${user.nickname || 'Kanna'}! Water kudikka time aachu! 💧`,
        englishSubtitle: 'Murugan is holding your cool water tumbler. Hydrate your mind!',
        categoryTitle: '💧 Hydration Routine',
        primaryActionLabel: 'DRANK 250ML',
        secondaryActionLabel: 'SNOOZE 10M',
        onPrimary: () => {
          playWaterDrop();
          handleAddWater(250);
        },
      },
      // 2. Study
      {
        isOpen: true,
        pose: 'study',
        tanglishQuote: `${user.nickname || 'Kanna'}, konjam padikkalama? 📖`,
        englishSubtitle: "Murugan has his book ready. Let's learn something beautiful today!",
        categoryTitle: '📖 Study Routine',
        primaryActionLabel: 'START READING',
        secondaryActionLabel: 'LATER',
        onPrimary: () => {
          setCurrentTab('tasks');
        },
      },
      // 3. Focus
      {
        isOpen: true,
        pose: 'encouraging',
        tanglishQuote: `Let's focus together, ${user.nickname || 'Kanna'}! ✨`,
        englishSubtitle: 'Vel is held high. Turn off distractions and conquer your work sprint!',
        categoryTitle: '⏱️ Deep Focus Session',
        primaryActionLabel: 'START FOCUS',
        secondaryActionLabel: '10 MINS',
        onPrimary: () => {
          setCurrentTab('focus');
        },
      },
      // 4. Completed Task
      {
        isOpen: true,
        pose: 'celebrating',
        tanglishQuote: 'Super! Namma task complete pannitom! 🎉',
        englishSubtitle: 'Fantastic effort! Your holy streak is shining with pride.',
        categoryTitle: '🎉 Milestone Complete',
        primaryActionLabel: 'FEEL PROUD ✨',
        secondaryActionLabel: 'VIEW STATS',
        onPrimary: () => {
          playVictoryChime();
        },
      },
      // 5. Break reminder
      {
        isOpen: true,
        pose: 'break',
        tanglishQuote: 'Konjam rest eduthukalama? 🌿',
        englishSubtitle: 'Take a gentle breath and stretch your body. Rest is sacred too.',
        categoryTitle: '🌿 Rest & Recharge',
        primaryActionLabel: 'TAKE 5M BREAK',
        secondaryActionLabel: 'CONTINUE',
        onPrimary: () => {
          playTempleBell(0.3);
        },
      },
    ];

    if (customProps) {
      setJumpingOverlay((prev) => ({
        ...prev,
        isOpen: true,
        ...customProps,
      }));
    } else {
      const randomPreset = presets[Math.floor(Math.random() * presets.length)];
      setJumpingOverlay(randomPreset);
    }
  };

  const handleTriggerPresetReminder = (reminder: ReminderItem) => {
    let actionLabel = 'DONE';
    let secLabel = 'SNOOZE';

    if (reminder.category === 'hydration') {
      actionLabel = 'DRANK 250ML';
      secLabel = 'SNOOZE 10M';
    } else if (reminder.category === 'focus') {
      actionLabel = 'START NOW';
      secLabel = 'LATER';
    } else if (reminder.category === 'celebration') {
      actionLabel = 'FEEL PROUD';
      secLabel = 'VIEW STATS';
    } else if (reminder.category === 'screentime') {
      actionLabel = 'TAKE BREAK';
      secLabel = '5 MINS';
    }

    triggerJumpingPopup({
      pose: reminder.pose,
      tanglishQuote: reminder.tanglishTitle,
      englishSubtitle: `Smart reminder triggered for ${reminder.title}.`,
      categoryTitle: reminder.title,
      primaryActionLabel: actionLabel,
      secondaryActionLabel: secLabel,
      onPrimary: () => {
        if (reminder.category === 'hydration') {
          playWaterDrop();
          handleAddWater(250);
        } else if (reminder.category === 'focus') {
          setCurrentTab('focus');
        }
      },
    });
  };

  const handleTestPose = (pose: CharacterPose, quote: string, sub: string, cat: string) => {
    triggerJumpingPopup({
      pose,
      tanglishQuote: quote,
      englishSubtitle: sub,
      categoryTitle: cat,
      primaryActionLabel: 'SUPER! ✨',
      secondaryActionLabel: 'CLOSE',
    });
  };

  return (
    <div className="min-h-screen bg-[#FFF5EB] text-[#49321F] selection:bg-[#F28C28]/25 selection:text-[#49321F] flex flex-col font-sans">
      {/* 1. Splash Screen Layer */}
      {showSplash && (
        <SplashScreen
          onComplete={() => {
            setShowSplash(false);
          }}
          soundEnabled={user.soundEnabled}
        />
      )}

      {/* 2. Onboarding Modal Tour */}
      <OnboardingModal
        isOpen={showOnboarding}
        onFinish={(data) => {
          setUser((prev) => ({
            ...prev,
            name: data.name || prev.name,
            nickname: data.nickname || prev.nickname,
            companionTone: data.tone || prev.companionTone,
          }));
          setShowOnboarding(false);
        }}
        soundEnabled={user.soundEnabled}
      />

      {/* 3. Redesigned Parandhu Vaa Jumping Murugan In-App Overlay */}
      <ParandhuVaaOverlay
        isOpen={jumpingOverlay.isOpen}
        onClose={() => setJumpingOverlay((prev) => ({ ...prev, isOpen: false }))}
        pose={jumpingOverlay.pose}
        tanglishQuote={jumpingOverlay.tanglishQuote}
        englishSubtitle={jumpingOverlay.englishSubtitle}
        categoryTitle={jumpingOverlay.categoryTitle}
        primaryActionLabel={jumpingOverlay.primaryActionLabel}
        secondaryActionLabel={jumpingOverlay.secondaryActionLabel}
        onPrimary={jumpingOverlay.onPrimary}
        onSecondary={jumpingOverlay.onSecondary}
        soundEnabled={user.soundEnabled}
      />

      {/* Top Bar Navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (user.soundEnabled) playTempleBell(0.2);
          setCurrentTab(tab);
        }}
        unreadCount={3}
        onOpenJumpingPopup={() => triggerJumpingPopup()}
        onOpenNotifications={() => setCurrentTab('reminders')}
      />

      {/* Storybook Reminder Quick-Test Subbar (Part 3 Direct Triggers) */}
      <div className="bg-[#FFE5D0]/60 border-b border-[#D6A43B]/25 px-4 py-2.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#642D35] flex items-center gap-1 font-display">
              <VelIcon size={14} glow={true} />
              Storybook Reminders:
            </span>
            <span className="text-[#49321F]/70 hidden sm:inline">
              Test exact Part 3 pop-ups:
            </span>
          </div>

          {/* Part 3 Specified Example Reminders */}
          <div className="flex flex-wrap items-center gap-1.5">
            {/* 1. Hydration */}
            <button
              type="button"
              onClick={() =>
                triggerJumpingPopup({
                  pose: 'hydration',
                  tanglishQuote: 'Kanna! Water kudikka time aachu! 💧',
                  englishSubtitle: 'Murugan is holding your cool water tumbler. Drink up!',
                  categoryTitle: '💧 Hydration Check',
                  primaryActionLabel: 'DRANK 250ML',
                  secondaryActionLabel: 'SNOOZE 10M',
                  onPrimary: () => {
                    playWaterDrop();
                    handleAddWater(250);
                  },
                })
              }
              className="px-2.5 py-1 bg-white hover:bg-[#FFE0C2] rounded-xl border border-[#D6A43B]/40 text-[#49321F] font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs active:scale-95 transition-all"
            >
              <Droplets size={12} className="text-[#087F78]" />
              <span>Hydration 💧</span>
            </button>

            {/* 2. Study */}
            <button
              type="button"
              onClick={() =>
                triggerJumpingPopup({
                  pose: 'study',
                  tanglishQuote: 'Kanna, konjam padikkalama? 📖',
                  englishSubtitle: 'Murugan has his book open. Ready to read and learn?',
                  categoryTitle: '📖 Study Time',
                  primaryActionLabel: 'START READING',
                  secondaryActionLabel: 'LATER',
                })
              }
              className="px-2.5 py-1 bg-white hover:bg-[#FFE0C2] rounded-xl border border-[#D6A43B]/40 text-[#49321F] font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs active:scale-95 transition-all"
            >
              <BookOpen size={12} className="text-[#F28C28]" />
              <span>Study 📖</span>
            </button>

            {/* 3. Focus */}
            <button
              type="button"
              onClick={() =>
                triggerJumpingPopup({
                  pose: 'encouraging',
                  tanglishQuote: "Let's focus together, Kanna! ✨",
                  englishSubtitle: 'Vel is protecting your focus. Dive into deep work!',
                  categoryTitle: '⏱️ Focus Companion',
                  primaryActionLabel: 'START FOCUS',
                  secondaryActionLabel: '10 MINS',
                  onPrimary: () => setCurrentTab('focus'),
                })
              }
              className="px-2.5 py-1 bg-white hover:bg-[#FFE0C2] rounded-xl border border-[#D6A43B]/40 text-[#49321F] font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs active:scale-95 transition-all"
            >
              <Clock size={12} className="text-[#2455A4]" />
              <span>Focus ✨</span>
            </button>

            {/* 4. Completed Task */}
            <button
              type="button"
              onClick={() =>
                triggerJumpingPopup({
                  pose: 'celebrating',
                  tanglishQuote: 'Super! Namma task complete pannitom! 🎉',
                  englishSubtitle: 'Daily victory achieved! Murugan is throwing petals!',
                  categoryTitle: '🎉 Task Complete',
                  primaryActionLabel: 'FEEL PROUD',
                  secondaryActionLabel: 'VIEW STATS',
                  onPrimary: () => playVictoryChime(),
                })
              }
              className="px-2.5 py-1 bg-white hover:bg-[#FFE0C2] rounded-xl border border-[#D6A43B]/40 text-[#49321F] font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs active:scale-95 transition-all"
            >
              <CheckCircle2 size={12} className="text-[#087F78]" />
              <span>Done! 🎉</span>
            </button>

            {/* 5. Break reminder */}
            <button
              type="button"
              onClick={() =>
                triggerJumpingPopup({
                  pose: 'break',
                  tanglishQuote: 'Konjam rest eduthukalama? 🌿',
                  englishSubtitle: 'Relax your eyes and take a deep breath.',
                  categoryTitle: '🌿 Rest Break',
                  primaryActionLabel: 'TAKE BREAK',
                  secondaryActionLabel: 'CONTINUE',
                })
              }
              className="px-2.5 py-1 bg-white hover:bg-[#FFE0C2] rounded-xl border border-[#D6A43B]/40 text-[#49321F] font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs active:scale-95 transition-all"
            >
              <Coffee size={12} className="text-[#F58B72]" />
              <span>Break 🌿</span>
            </button>

            {/* Viewport switch */}
            <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-[#D6A43B]/30 ml-2">
              <button
                type="button"
                onClick={() => setViewportMode('desktop')}
                className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                  viewportMode === 'desktop' ? 'bg-[#F28C28] text-white shadow-xs' : 'text-[#49321F]/70'
                }`}
                title="Full Desktop Multi-Column Layout (1440px)"
              >
                <Monitor size={13} />
              </button>
              <button
                type="button"
                onClick={() => setViewportMode('mobile')}
                className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                  viewportMode === 'mobile' ? 'bg-[#F28C28] text-white shadow-xs' : 'text-[#49321F]/70'
                }`}
                title="Mobile Device Viewport (390px)"
              >
                <Smartphone size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div
          className={
            viewportMode === 'mobile'
              ? 'max-w-[420px] mx-auto bg-[#FFF5EB] border-4 border-[#49321F]/80 rounded-[40px] p-4 shadow-floating overflow-hidden relative min-h-[780px]'
              : 'w-full'
          }
        >
          {/* Mobile frame header bar if in simulated mobile mode */}
          {viewportMode === 'mobile' && (
            <div className="w-full flex items-center justify-between pb-3 px-2 border-b border-[#D6A43B]/30 mb-4 text-xs font-mono text-[#49321F]/70">
              <span>9:41</span>
              <div className="w-20 h-4 rounded-full bg-[#49321F] mx-auto" />
              <span>100% 🔋</span>
            </div>
          )}

          {/* Desktop Multi-column Layout Architecture */}
          <div className={viewportMode === 'desktop' ? 'grid grid-cols-1 lg:grid-cols-12 gap-8' : 'block'}>
            {/* Main Center Workspace (Left 8 columns on Desktop) */}
            <div className={viewportMode === 'desktop' ? 'lg:col-span-8' : 'w-full'}>
              {currentTab === 'dashboard' && (
                <DashboardView
                  user={user}
                  tasks={tasks}
                  goals={goals}
                  activities={activities}
                  waterDrankMl={waterDrankMl}
                  focusMinutesToday={focusMinutesToday}
                  screenTimeMinutesToday={screenTimeMinutesToday}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                  onQuickAddWater={handleAddWater}
                  onToggleTask={handleToggleTask}
                  onOpenNewTaskModal={() => setCurrentTab('tasks')}
                  onTriggerParandhuVaa={() => triggerJumpingPopup()}
                />
              )}

              {currentTab === 'tasks' && (
                <TasksView
                  tasks={tasks}
                  onToggleTask={handleToggleTask}
                  onAddTask={handleAddTask}
                  onDeleteTask={handleDeleteTask}
                  onScheduleActivity={handleScheduleActivity}
                  availableGoals={goals}
                  soundEnabled={user.soundEnabled}
                />
              )}

              {currentTab === 'planner' && (
                <PlannerView
                  tasks={tasks}
                  onToggleTask={handleToggleTask}
                  soundEnabled={user.soundEnabled}
                  user={user}
                />
              )}

              {currentTab === 'goals' && (
                <GoalsView
                  tasks={tasks}
                  onNavigateToTasks={() => setCurrentTab('tasks')}
                  soundEnabled={user.soundEnabled}
                />
              )}

              {currentTab === 'habits' && (
                <HabitTrackerView soundEnabled={user.soundEnabled} />
              )}

              {(currentTab === 'hydration' || currentTab === 'theertham') && (
                <HydrationView
                  waterDrankMl={waterDrankMl}
                  dailyTargetMl={user.dailyWaterTargetMl}
                  onAddWater={handleAddWater}
                  onResetWater={handleResetWater}
                  onUpdateTarget={(newTarget) =>
                    setUser((prev) => ({ ...prev, dailyWaterTargetMl: newTarget }))
                  }
                  soundEnabled={user.soundEnabled}
                />
              )}

              {currentTab === 'insights' && (
                <InsightsView
                  tasks={tasks}
                  goals={goals}
                  activities={activities}
                  waterDrankMl={waterDrankMl}
                  dailyTargetMl={user.dailyWaterTargetMl}
                />
              )}

              {(currentTab === 'settings' || currentTab === 'profile') && (
                <SettingsView
                  user={user}
                  onUpdateUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
                  tasks={tasks}
                  activities={activities}
                  goals={goals}
                  waterDrankMl={waterDrankMl}
                  onReplaySplash={() => setShowSplash(true)}
                  onReplayOnboarding={() => setShowOnboarding(true)}
                />
              )}

              {currentTab === 'focus' && (
                <FocusStudioView
                  onLogFocusMinutes={handleLogFocusMinutes}
                  soundEnabled={user.soundEnabled}
                />
              )}

              {currentTab === 'wellbeing' && (
                <WellbeingView
                  onSimulateAppLimitTrigger={(app) =>
                    triggerJumpingPopup({
                      pose: 'break',
                      tanglishQuote: `${app} limit reach aaiduchu! Konjam rest eduthukalama?`,
                      englishSubtitle: 'Time to rest your eyes and stretch your body.',
                      categoryTitle: '📱 App Boundary',
                      primaryActionLabel: 'CLOSE APP',
                      secondaryActionLabel: '5 MINS',
                    })
                  }
                  soundEnabled={user.soundEnabled}
                />
              )}

              {currentTab === 'reminders' && (
                <RemindersView
                  currentTone={user.companionTone}
                  onChangeTone={(tone) => setUser((prev) => ({ ...prev, companionTone: tone }))}
                  onTriggerPresetReminder={handleTriggerPresetReminder}
                  onTestPose={handleTestPose}
                  soundEnabled={user.soundEnabled}
                />
              )}
            </div>

            {/* Desktop Right Column: Murugan Dynamic Companion Panel */}
            {viewportMode === 'desktop' && (
              <aside className="lg:col-span-4 space-y-6">
                {/* Companion Sanctuary Card (Official Devotional Storybook Style) */}
                <div className="bg-[#FFF5EB] border-2 border-[#D6A43B] rounded-[32px] p-6 shadow-ambient relative overflow-hidden text-center">
                  <PeacockCornerMotif position="top-right" size={28} className="absolute top-3 right-3" />

                  <span className="text-xs font-bold uppercase tracking-wider text-[#087F78] font-display block mb-1">
                    Bala Murugan Sanctuary
                  </span>

                  <div
                    className="cursor-pointer my-2 inline-block hover:scale-105 transition-transform"
                    onClick={() => {
                      if (user.soundEnabled) playTempleBell(0.4);
                    }}
                    title="Click for blessing chime"
                  >
                    <BalaMurugan pose="blessing" size={170} showCloud={true} />
                  </div>

                  <h3 className="text-lg font-bold text-[#49321F] font-display">
                    "Naan Un Thozhan!"
                  </h3>
                  <p className="text-xs text-[#49321F]/80 mt-1 leading-relaxed">
                    "Like your truest friend, I'll walk with you, keeping your mind tranquil, healthy, and focused."
                  </p>

                  <button
                    type="button"
                    onClick={() => triggerJumpingPopup()}
                    className="mt-4 w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#F28C28] via-[#FF9F43] to-[#D6A43B] text-white font-bold text-xs shadow-sm hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/30"
                  >
                    <Sparkles size={14} className="text-[#FFF2DC]" />
                    <span>Summon Parandhu Vaa Pop-Up</span>
                  </button>
                </div>

                {/* Quick Theertham Card */}
                <div className="bg-white rounded-3xl p-5 border border-[#087F78]/30 shadow-ambient">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-[#087F78] flex items-center gap-1 font-display">
                      <Droplets size={14} /> Theertham Live
                    </span>
                    <span className="text-xs font-bold font-mono text-[#087F78]">
                      {waterDrankMl} / {user.dailyWaterTargetMl}ml
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-[#FFE0C2] overflow-hidden mb-3">
                    <div
                      className="h-full bg-gradient-to-r from-[#087F78] to-[#2455A4] transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (waterDrankMl / user.dailyWaterTargetMl) * 100)}%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        playWaterDrop();
                        handleAddWater(150);
                      }}
                      className="flex-1 py-1.5 rounded-xl bg-[#FFE0C2]/60 hover:bg-[#FFE0C2] text-xs font-bold text-[#49321F] cursor-pointer"
                    >
                      +150ml
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playWaterDrop();
                        handleAddWater(250);
                      }}
                      className="flex-1 py-1.5 rounded-xl bg-[#087F78] hover:bg-[#066862] text-xs font-bold text-white cursor-pointer"
                    >
                      +250ml
                    </button>
                  </div>
                </div>

                {/* Quick Focus Studio Dock */}
                <div className="bg-white rounded-3xl p-5 border border-[#F28C28]/30 shadow-ambient">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-[#F28C28] flex items-center gap-1 font-display">
                      <Clock size={14} /> Focus Session
                    </span>
                    <span className="text-xs font-bold font-mono text-[#F28C28]">
                      {Math.floor(focusMinutesToday / 60)}h {focusMinutesToday % 60}m Done
                    </span>
                  </div>

                  <p className="text-xs text-[#49321F]/70 mb-3">
                    Target: {Math.floor(user.dailyFocusTargetMinutes / 60)}h daily Pomodoro deep work
                  </p>

                  <button
                    type="button"
                    onClick={() => setCurrentTab('focus')}
                    className="w-full py-2 rounded-xl bg-[#FFE0C2] hover:bg-[#FFD166] text-[#49321F] text-xs font-bold transition-colors cursor-pointer"
                  >
                    Open Focus Studio →
                  </button>
                </div>
              </aside>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Sticky Bottom Tab Bar */}
      <MobileBottomBar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (user.soundEnabled) playTempleBell(0.2);
          setCurrentTab(tab);
        }}
      />
    </div>
  );
}
