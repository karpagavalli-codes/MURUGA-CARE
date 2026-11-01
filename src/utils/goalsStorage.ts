import { GoalItem } from '../types';

const GOALS_STORAGE_KEY = 'muruga_care_goals_v1';

export const INITIAL_GOALS: GoalItem[] = [
  {
    id: 'g1',
    title: 'Achieve University Distinction in Computer Science',
    description: 'Master advanced algorithms, cloud architecture, and maintain top semester GPA.',
    category: 'study',
    status: 'active',
    startDate: '2026-10-01',
    targetDate: '2026-12-15',
    color: '#2455A4',
    linkedTaskIds: ['t1', 't6'],
    notes: 'Dedicate 3 focused morning hours daily without phone interruptions.',
    createdAt: '2026-10-01T08:00:00.000Z',
    monthlyMilestones: [
      {
        id: 'mm1',
        title: 'Complete Distributed Systems & Microservices Core',
        month: 'October 2026',
        targetDate: '2026-10-31',
        completed: true,
        weeklyMilestones: [
          {
            id: 'wm1',
            title: 'Study Raft & Paxos consensus models',
            weekNumber: 1,
            targetDate: '2026-10-07',
            completed: true,
          },
          {
            id: 'wm2',
            title: 'Build gRPC inter-service communication pipeline',
            weekNumber: 2,
            targetDate: '2026-10-14',
            completed: true,
          },
          {
            id: 'wm3',
            title: 'Implement database sharding & replication test suite',
            weekNumber: 3,
            targetDate: '2026-10-21',
            completed: true,
          },
          {
            id: 'wm4',
            title: 'Simulate high concurrency fault injection benchmark',
            weekNumber: 4,
            targetDate: '2026-10-28',
            completed: true,
          },
        ],
      },
      {
        id: 'mm2',
        title: 'Full Semester Project & Comprehensive Revision',
        month: 'November 2026',
        targetDate: '2026-11-30',
        completed: false,
        weeklyMilestones: [
          {
            id: 'wm5',
            title: 'Complete backend REST & GraphQL API performance optimizations',
            weekNumber: 1,
            targetDate: '2026-11-07',
            completed: false,
          },
          {
            id: 'wm6',
            title: 'Draft thesis documentation & architecture diagrams',
            weekNumber: 2,
            targetDate: '2026-11-14',
            completed: false,
          },
          {
            id: 'wm7',
            title: 'Conduct peer review & deploy staging live demo',
            weekNumber: 3,
            targetDate: '2026-11-21',
            completed: false,
          },
          {
            id: 'wm8',
            title: 'Final mock viva exam with senior mentor',
            weekNumber: 4,
            targetDate: '2026-11-28',
            completed: false,
          },
        ],
      },
    ],
  },
  {
    id: 'g2',
    title: 'Complete 108 Surya Namaskars & 10km Marathon Endurance',
    description: 'Build peak cardiovascular fitness, mental stamina, and disciplined morning vitality.',
    category: 'health',
    status: 'active',
    startDate: '2026-10-15',
    targetDate: '2026-11-30',
    color: '#087F78',
    linkedTaskIds: ['t2'],
    notes: 'Stay hydrated with at least 2.5L Theertham daily and sleep before 10:30 PM.',
    createdAt: '2026-10-15T06:00:00.000Z',
    monthlyMilestones: [
      {
        id: 'mm3',
        title: 'Base Stamina & 5km Continuous Running',
        month: 'October 2026',
        targetDate: '2026-10-31',
        completed: true,
        weeklyMilestones: [
          {
            id: 'wm9',
            title: 'Jog 3km 3 times this week without stopping',
            weekNumber: 1,
            targetDate: '2026-10-22',
            completed: true,
          },
          {
            id: 'wm10',
            title: 'Perform 24 Surya Namaskars daily at sunrise',
            weekNumber: 2,
            targetDate: '2026-10-29',
            completed: true,
          },
        ],
      },
      {
        id: 'mm4',
        title: 'Marathon Readiness & 54 Surya Namaskars Pace',
        month: 'November 2026',
        targetDate: '2026-11-30',
        completed: false,
        weeklyMilestones: [
          {
            id: 'wm11',
            title: 'Complete 7km uninterrupted trial run',
            weekNumber: 1,
            targetDate: '2026-11-08',
            completed: false,
          },
          {
            id: 'wm12',
            title: 'Practice pranayama & 10km dress rehearsal',
            weekNumber: 2,
            targetDate: '2026-11-20',
            completed: false,
          },
        ],
      },
    ],
  },
  {
    id: 'g3',
    title: 'Read & Reflect on 6 Classical Wisdom & Tamil Epics',
    description: 'Immerse into Thiruppugazh, Kanda Sashti Kavasam, Tirukkural, and ancient philosophy.',
    category: 'spiritual',
    status: 'active',
    startDate: '2026-11-01',
    targetDate: '2026-12-31',
    color: '#F28C28',
    linkedTaskIds: ['t5'],
    notes: 'Read 15 pages every evening during quiet hours.',
    createdAt: '2026-11-01T09:00:00.000Z',
    monthlyMilestones: [
      {
        id: 'mm5',
        title: 'Complete Thiruppugazh Selected Hymns',
        month: 'November 2026',
        targetDate: '2026-11-30',
        completed: false,
        weeklyMilestones: [
          {
            id: 'wm13',
            title: 'Read first 25 hymns & write reflections in journal',
            weekNumber: 1,
            targetDate: '2026-11-10',
            completed: false,
          },
          {
            id: 'wm14',
            title: 'Explore the metaphorical depth of the Vel',
            weekNumber: 2,
            targetDate: '2026-11-20',
            completed: false,
          },
        ],
      },
    ],
  },
];

export const loadStoredGoals = (): GoalItem[] => {
  try {
    const raw = localStorage.getItem(GOALS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(INITIAL_GOALS));
      return INITIAL_GOALS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_GOALS;
  }
};

export const saveStoredGoals = (goals: GoalItem[]) => {
  try {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
  } catch (e) {
    console.error('Failed to save goals', e);
  }
};

// Calculate progress percentage for a Goal based on weekly and monthly milestones
export const calculateGoalProgress = (goal: GoalItem): number => {
  let totalMilestones = 0;
  let completedMilestones = 0;

  goal.monthlyMilestones.forEach((mm) => {
    // Count monthly milestone
    totalMilestones += 1;
    if (mm.completed) completedMilestones += 1;

    // Count weekly milestones
    mm.weeklyMilestones.forEach((wm) => {
      totalMilestones += 1;
      if (wm.completed) completedMilestones += 1;
    });
  });

  if (totalMilestones === 0) return goal.status === 'completed' ? 100 : 0;
  return Math.round((completedMilestones / totalMilestones) * 100);
};

export const calculateDaysRemaining = (targetDateStr: string): number => {
  const target = new Date(targetDateStr).getTime();
  const now = new Date('2026-11-01').getTime(); // App date anchor
  const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};
