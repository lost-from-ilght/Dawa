export type PracticeArea =
  | 'Corporate'
  | 'Tax'
  | 'Employment & Immigration'
  | 'Litigation & Arbitration'
  | 'Finance & Projects'
  | 'IP & Technology'
  | 'Mining, Energy & Real Estate'
  | 'NGO & Civil Society';

export type MatterPriority = 'High' | 'Medium' | 'Low';

export type MatterStatus = 'Ongoing' | 'Completed' | 'Pending' | 'On Hold';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority?: MatterPriority;
}

export interface Matter {
  id: string;
  date: string; // ISO format or YYYY-MM-DD
  priority: MatterPriority;
  status: MatterStatus;
  practiceArea: PracticeArea;
  matterTitle: string;
  clientReference: string; // e.g. "Client · MLA/CORP/042/2026"
  supervisingLawyer: string;
  deadline?: string;
  timeSpentHours: number;
  activitiesDone: string;
  skillsLawsInvolved: string; // e.g. "Commercial Code 2021; Investment Proclamation 1180/2020"
  lessonsLearned: string;
  followUpSteps?: string;
  subtasks: Subtask[];
  confidenceRating: number; // 1 to 5
  createdAt: string;
  updatedAt: string;
}

export interface DailyTask {
  id: string;
  title: string;
  priority: MatterPriority;
  dueDate?: string;
  completed: boolean;
  isMatterSubtask: boolean;
  matterId?: string;
  matterTitle?: string;
  clientReference?: string;
  subtaskId?: string;
  createdAt: string;
}

export type ActiveView =
  | 'feed'
  | 'timeline'
  | 'lessons'
  | 'deadlines'
  | 'competency'
  | 'todo';

export interface DashboardStats {
  totalMatters: number;
  ongoingMatters: number;
  totalHours: number;
  lessonsCount: number;
  openTasksCount: number;
  overdueCount: number;
  practiceAreasCovered: number;
  averageConfidence: number;
}
