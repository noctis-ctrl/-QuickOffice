
export type OfficeTool = 'Excel' | 'Word' | 'PowerPoint' | 'Placement';
export type UserRole = 'admin' | 'student';

export enum Difficulty {
  EASY = 'Easy',
  INTERMEDIATE = 'Intermediate',
  DIFFICULT = 'Difficult'
}

export interface User {
  id: string;
  fullname: string;
  email: string;
  role: UserRole;
  joinedDate: string;
  avatarUrl?: string;
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  FORMULA_ENTRY = 'FORMULA_ENTRY',
  DRAG_DROP = 'DRAG_DROP',
  AI_CHALLENGE = 'AI_CHALLENGE',
  PERFORMANCE_STEP = 'PERFORMANCE_STEP'
}

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  options?: string[]; // Used for MCQ
  steps?: string[];   // Used for Drag & Drop (shuffled version)
  correctOrder?: string[]; // Used for Drag & Drop (correct sequence)
  correctAnswer: string;
  explanation: string;
  category?: string; // Ribbon Category
  difficulty?: Difficulty;
  context?: string;
  imageUrl?: string;
  stepIndex?: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  tool: OfficeTool;
  questions: Question[]; // Quiz 1: Conceptual Pool
  performanceSteps: Question[]; // Quiz 2: Skill Pool
  xpReward: number;
  stageTitle?: string;
  tutorialContent: {
    title: string;
    points: string[];
    proTip: string;
    videoUrl?: string;
  };
}

export interface UserStats {
  xp: number;
  streak: number;
  completedLessons: string[];
  currentTool: OfficeTool;
  hasTakenPreTest: boolean;
  lastCompletionDate?: string;
  lastFreeRestores?: Record<string, string>;
}