import { Matter, DailyTask, DashboardStats, Subtask } from '@/types';
import { INITIAL_MATTERS, INITIAL_TASKS } from './seedData';
import { PRACTICE_AREAS } from './constants';

const MATTERS_STORAGE_KEY = 'mla_legal_journal_matters_v1';
const TASKS_STORAGE_KEY = 'mla_legal_journal_tasks_v1';
const SETTINGS_STORAGE_KEY = 'mla_legal_journal_settings_v1';

export interface StorageSettings {
  useMongoBackend: boolean;
  mongoUri?: string;
  autoSync: boolean;
}

export const DEFAULT_SETTINGS: StorageSettings = {
  useMongoBackend: false,
  mongoUri: '',
  autoSync: false,
};

export function getLocalSettings(): StorageSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveLocalSettings(settings: StorageSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings to localStorage', e);
  }
}

export function getStoredMatters(): Matter[] {
  if (typeof window === 'undefined') return INITIAL_MATTERS;
  try {
    const raw = localStorage.getItem(MATTERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(MATTERS_STORAGE_KEY, JSON.stringify(INITIAL_MATTERS));
      return INITIAL_MATTERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MATTERS;
  } catch (e) {
    console.error('Error loading matters from localStorage', e);
    return INITIAL_MATTERS;
  }
}

export function saveStoredMatters(matters: Matter[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MATTERS_STORAGE_KEY, JSON.stringify(matters));
  } catch (e) {
    console.error('Error saving matters to localStorage', e);
  }
}

export function getStoredTasks(): DailyTask[] {
  if (typeof window === 'undefined') return INITIAL_TASKS;
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(INITIAL_TASKS));
      return INITIAL_TASKS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_TASKS;
  } catch (e) {
    console.error('Error loading tasks from localStorage', e);
    return INITIAL_TASKS;
  }
}

export function saveStoredTasks(tasks: DailyTask[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Error saving tasks to localStorage', e);
  }
}

export function resetToSeedData(): { matters: Matter[]; tasks: DailyTask[] } {
  if (typeof window !== 'undefined') {
    localStorage.setItem(MATTERS_STORAGE_KEY, JSON.stringify(INITIAL_MATTERS));
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(INITIAL_TASKS));
  }
  return { matters: INITIAL_MATTERS, tasks: INITIAL_TASKS };
}

// 2-Way Sync Helper: When a task is toggled in To-Do list
export function syncTaskToggleToMatter(
  task: DailyTask,
  allMatters: Matter[]
): Matter[] {
  if (!task.isMatterSubtask || !task.matterId || !task.subtaskId) {
    return allMatters;
  }

  return allMatters.map((m) => {
    if (m.id !== task.matterId) return m;
    const updatedSubtasks = (m.subtasks || []).map((st) => {
      if (st.id === task.subtaskId) {
        return { ...st, completed: task.completed };
      }
      return st;
    });
    return {
      ...m,
      subtasks: updatedSubtasks,
      updatedAt: new Date().toISOString(),
    };
  });
}

// 2-Way Sync Helper: When a matter subtask is changed in Matter Modal
export function syncMatterSubtasksToTasks(
  matter: Matter,
  existingTasks: DailyTask[]
): DailyTask[] {
  // Remove existing linked tasks for this matter
  const nonMatterTasks = existingTasks.filter((t) => t.matterId !== matter.id);

  // Generate linked tasks from current subtasks
  const matterTasks: DailyTask[] = (matter.subtasks || []).map((st: Subtask) => ({
    id: `task-linked-${st.id}`,
    title: st.title,
    priority: st.priority || matter.priority,
    dueDate: st.dueDate || matter.deadline,
    completed: st.completed,
    isMatterSubtask: true,
    matterId: matter.id,
    matterTitle: matter.matterTitle,
    clientReference: matter.clientReference,
    subtaskId: st.id,
    createdAt: matter.createdAt || new Date().toISOString(),
  }));

  return [...nonMatterTasks, ...matterTasks];
}

// Remove matter and clean up its linked tasks
export function cleanupDeletedMatterTasks(
  matterId: string,
  existingTasks: DailyTask[]
): DailyTask[] {
  return existingTasks.filter((t) => t.matterId !== matterId);
}

// Calculate comprehensive dashboard stats
export function calculateDashboardStats(
  matters: Matter[],
  tasks: DailyTask[]
): DashboardStats {
  const totalMatters = matters.length;
  const ongoingMatters = matters.filter((m) => m.status === 'Ongoing').length;
  const totalHours = Number(
    matters.reduce((acc, m) => acc + (Number(m.timeSpentHours) || 0), 0).toFixed(1)
  );
  const lessonsCount = matters.filter((m) => m.lessonsLearned && m.lessonsLearned.trim().length > 0).length;

  const openTasksCount = tasks.filter((t) => !t.completed).length;

  const todayStr = new Date().toISOString().slice(0, 10);
  const overdueCount = tasks.filter(
    (t) => !t.completed && t.dueDate && t.dueDate < todayStr
  ).length;

  const coveredPracticeAreas = new Set(
    matters.map((m) => m.practiceArea).filter(Boolean)
  );
  const practiceAreasCovered = coveredPracticeAreas.size;

  const totalConfidence = matters.reduce((acc, m) => acc + (m.confidenceRating || 3), 0);
  const averageConfidence = totalMatters > 0 ? Number((totalConfidence / totalMatters).toFixed(1)) : 0;

  return {
    totalMatters,
    ongoingMatters,
    totalHours,
    lessonsCount,
    openTasksCount,
    overdueCount,
    practiceAreasCovered,
    averageConfidence,
  };
}

// Client-side CSV generation and instant browser trigger
export function exportMattersToCSV(matters: Matter[]): void {
  const escapeCSV = (val: unknown): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headers = [
    'Matter ID',
    'Date',
    'Priority',
    'Status',
    'Practice Area',
    'Matter Title',
    'Client Reference',
    'Supervising Lawyer',
    'Deadline',
    'Time Spent (Hours)',
    'Confidence Rating (1-5)',
    'Activities Undertaken',
    'Skills & Laws Involved',
    'Lessons Learned',
    'Follow-Up Steps',
    'Total Subtasks',
    'Completed Subtasks',
  ];

  const rows = matters.map((m) => [
    escapeCSV(m.id),
    escapeCSV(m.date),
    escapeCSV(m.priority),
    escapeCSV(m.status),
    escapeCSV(m.practiceArea),
    escapeCSV(m.matterTitle),
    escapeCSV(m.clientReference),
    escapeCSV(m.supervisingLawyer),
    escapeCSV(m.deadline || ''),
    escapeCSV(m.timeSpentHours),
    escapeCSV(m.confidenceRating),
    escapeCSV(m.activitiesDone),
    escapeCSV(m.skillsLawsInvolved),
    escapeCSV(m.lessonsLearned),
    escapeCSV(m.followUpSteps || ''),
    escapeCSV(m.subtasks ? m.subtasks.length : 0),
    escapeCSV(m.subtasks ? m.subtasks.filter((s) => s.completed).length : 0),
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `mla_associate_journal_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
