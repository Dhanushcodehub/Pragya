export type Subject = 'reading' | 'numeracy';
export type MasteryStatus = 'secure' | 'developing' | 'needs-support' | 'not-assessed';
export type ReadingLevel = 'beginner' | 'letter' | 'word' | 'paragraph' | 'story';
export type NumeracyLevel = 'beginner' | 'number-recognition-1-9' | 'number-recognition-11-99' | 'subtraction' | 'division';

export interface PragyaClassroom {
  id: string;
  name: string;
  teacher_id: string;
  grade_level: string;
  created_at: string;
}

export interface PragyaLearner {
  id: string;
  classroom_id: string;
  name: string;
  avatar_emoji: string;
  class_code: string;
  secret_pin: string;
  reading_level: ReadingLevel | string;
  numeracy_level: NumeracyLevel | string;
  status: MasteryStatus | string;
  created_at: string;
}

export interface PragyaAssessment {
  id: string;
  learner_id: string;
  subject: Subject | string;
  started_at: string;
  completed_at: string | null;
  final_level: string | null;
  confidence_score: number | null;
  responses: any;
}
