export type SkillLevel = 'not_assessed' | 'needs_support' | 'developing' | 'demonstrated';

export type ReadingLevel = 'beginner' | 'letter' | 'word' | 'paragraph' | 'story';
export type NumeracyLevel = 'beginner' | 'number_1_9' | 'number_11_99' | 'subtraction' | 'division';

export interface SkillEvidence {
  skillId: string;
  skillName: string;
  status: SkillLevel;
  confidence: number; // 0 to 100 percentage
  evidenceSummary: string;
  nextAction: string;
}

export interface LearnerSkillProfile {
  learnerId: string;
  // Reading skills
  letterRecognition: SkillLevel;
  wordReading: SkillLevel;
  paragraphReading: SkillLevel;
  storyReading: SkillLevel;
  comprehension: SkillLevel;

  // Numeracy skills
  numberRecognition1_9: SkillLevel;
  numberRecognition11_99: SkillLevel;
  subtraction: SkillLevel;
  division: SkillLevel;

  // Detailed confidence per skill (0-100)
  confidence: Record<string, number>;
  lastAssessed: string; // ISO date string
  evidences?: Record<string, SkillEvidence>;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'reading' | 'numeracy' | 'streak' | 'general';
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface WorldStage {
  id: string;
  name: string;
  description: string;
  icon: string;
  pathway: 'reading' | 'numeracy';
  level: ReadingLevel | NumeracyLevel;
  status: 'mastered' | 'current' | 'locked';
  progressPercent: number; // 0-100
  xpReward: number;
}

export interface Learner {
  id: string;
  name: string;
  rollNo?: number | string;
  grade: number;
  classroomId: string;
  avatar: string;
  xp: number;
  streakDays: number;
  currentQuest: string;
  readingLevel: ReadingLevel;
  numeracyLevel: NumeracyLevel;
  profile: LearnerSkillProfile;
  badges: Badge[];
}

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface PracticeQuestion {
  id: string;
  pathway: 'reading' | 'numeracy';
  level: ReadingLevel | NumeracyLevel;
  content: string;          // What the child reads or solves
  audioPrompt?: string;     // Text for speech synthesis (TTS)
  options: string[];        // Tap choices (big buttons)
  correctAnswer: string;
  explanation: string;      // Encouraging feedback
  xp: number;
  difficulty?: QuestionDifficulty;
  hint?: string;
}

export interface MasteryChallengeResult {
  learnerId: string;
  conceptName: string;
  passed: boolean;
  score: number;
  totalQuestions: number;
  xpEarned: number;
  remainingGap?: string;
}
