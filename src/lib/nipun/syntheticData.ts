import { Learner, PracticeQuestion, WorldStage, Badge } from './types';

// Default active student for demo
export const MOCK_ACTIVE_STUDENT: Learner = {
  id: 'learner-001',
  name: 'Aarav Kumar',
  grade: 3,
  classroomId: 'class-3a',
  avatar: '',
  xp: 450,
  streakDays: 5,
  currentQuest: 'Master Connected Text Reading',
  readingLevel: 'paragraph',
  numeracyLevel: 'subtraction',
  profile: {
    learnerId: 'learner-001',
    letterRecognition: 'demonstrated',
    wordReading: 'demonstrated',
    paragraphReading: 'developing',
    storyReading: 'needs_support',
    comprehension: 'needs_support',
    numberRecognition1_9: 'demonstrated',
    numberRecognition11_99: 'demonstrated',
    subtraction: 'developing',
    division: 'needs_support',
    confidence: {
      letterRecognition: 98,
      wordReading: 92,
      paragraphReading: 72,
      storyReading: 35,
      comprehension: 40,
      numberRecognition1_9: 99,
      numberRecognition11_99: 94,
      subtraction: 68,
      division: 20,
    },
    lastAssessed: '2026-09-18T10:00:00Z',
    evidences: {
      paragraphReading: {
        skillId: 'paragraphReading',
        skillName: 'Paragraph Reading',
        status: 'developing',
        confidence: 72,
        evidenceSummary: 'Reads 3 out of 4 sentences correctly. Pauses at connected conjunctions.',
        nextAction: 'Guided short passage practice with audio assistance.',
      },
      subtraction: {
        skillId: 'subtraction',
        skillName: '2-Digit Subtraction',
        status: 'developing',
        confidence: 68,
        evidenceSummary: 'Solves simple subtraction without borrowing. Hesitates when borrowing across place values.',
        nextAction: 'Visual place value regrouping exercises.',
      },
    },
  },
  badges: [
    {
      id: 'badge-1',
      title: 'Letter Explorer',
      description: 'Recognized all alphabet letters fluently!',
      icon: '',
      category: 'reading',
      isUnlocked: true,
      unlockedAt: '2026-09-10',
    },
    {
      id: 'badge-2',
      title: 'Word Builder',
      description: 'Mastered reading 50+ foundational words!',
      icon: '',
      category: 'reading',
      isUnlocked: true,
      unlockedAt: '2026-09-14',
    },
    {
      id: 'badge-3',
      title: 'Number Navigator',
      description: 'Recognizes numbers 1 to 99 with ease!',
      icon: '',
      category: 'numeracy',
      isUnlocked: true,
      unlockedAt: '2026-09-12',
    },
    {
      id: 'badge-4',
      title: '5-Day Streak Hero',
      description: 'Practiced 5 days in a row!',
      icon: '',
      category: 'streak',
      isUnlocked: true,
      unlockedAt: '2026-09-18',
    },
    {
      id: 'badge-5',
      title: 'Story Master',
      description: 'Read a full story and answered comprehension questions!',
      icon: '',
      category: 'reading',
      isUnlocked: false,
    },
    {
      id: 'badge-6',
      title: 'Division Champion',
      description: 'Solved 3-digit by 1-digit division problems!',
      icon: '',
      category: 'numeracy',
      isUnlocked: false,
    },
  ],
};

// Reading World Progression Stages (Matching AGENTS.md Section 6)
export function getReadingWorldStages(learner: Learner): WorldStage[] {
  const ladderOrder = ['beginner', 'letter', 'word', 'paragraph', 'story'];
  const currentLvl = String(learner?.readingLevel || 'beginner');
  const currentIdx = ladderOrder.indexOf(currentLvl) >= 0 ? ladderOrder.indexOf(currentLvl) : 0;

  const rawStages = [
    { id: 'stage-r1', name: 'Letter Explorer', description: 'Identify basic letter sounds and symbols', level: 'letter', xpReward: 100 },
    { id: 'stage-r2', name: 'Word Builder', description: 'Recognize common 2-letter and 3-letter words', level: 'word', xpReward: 150 },
    { id: 'stage-r3', name: 'Sentence Navigator', description: 'Read short 4-word sentences with fluency', level: 'paragraph', xpReward: 200 },
    { id: 'stage-r4', name: 'Paragraph Explorer', description: 'Read connected text (4 simple sentences)', level: 'paragraph', xpReward: 250 },
    { id: 'stage-r5', name: 'Story Master', description: 'Read 7-10 sentence story with full comprehension', level: 'story', xpReward: 300 },
  ];

  return rawStages.map((stg, idx) => {
    // Map stage index to ladder index: stage 0 = letter(1), 1 = word(2), 2 = sentence(3), 3 = paragraph(3), 4 = story(4)
    const stageLadderIdx = idx + 1;
    let status: 'mastered' | 'current' | 'locked' = 'locked';
    let progressPercent = 0;

    if (currentIdx > stageLadderIdx) {
      status = 'mastered';
      progressPercent = 100;
    } else if (currentIdx === stageLadderIdx || (currentIdx === 0 && idx === 0)) {
      status = 'current';
      progressPercent = currentIdx === 0 ? 0 : 50;
    } else {
      status = 'locked';
      progressPercent = 0;
    }

    return {
      id: stg.id,
      name: stg.name,
      description: stg.description,
      icon: '',
      pathway: 'reading',
      level: stg.level as any,
      status,
      progressPercent,
      xpReward: stg.xpReward,
    };
  });
}

// Numeracy World Progression Stages (Matching AGENTS.md Section 6)
export function getNumeracyWorldStages(learner: Learner): WorldStage[] {
  const ladderOrder = ['beginner', 'number_1_9', 'number_11_99', 'subtraction', 'division'];
  const currentLvl = String(learner?.numeracyLevel || 'beginner');
  const currentIdx = ladderOrder.indexOf(currentLvl) >= 0 ? ladderOrder.indexOf(currentLvl) : 0;

  const rawStages = [
    { id: 'stage-n1', name: 'Number Explorer', description: 'Recognize numbers from 1 to 9', level: 'number_1_9', xpReward: 100 },
    { id: 'stage-n2', name: 'Number Navigator', description: 'Recognize 2-digit numbers (11 to 99)', level: 'number_11_99', xpReward: 150 },
    { id: 'stage-n3', name: 'Subtraction Solver', description: 'Solve 2-digit subtraction with borrowing', level: 'subtraction', xpReward: 250 },
    { id: 'stage-n4', name: 'Division Master', description: 'Solve 3-digit by 1-digit division problems', level: 'division', xpReward: 300 },
  ];

  return rawStages.map((stg, idx) => {
    const stageLadderIdx = idx + 1;
    let status: 'mastered' | 'current' | 'locked' = 'locked';
    let progressPercent = 0;

    if (currentIdx > stageLadderIdx) {
      status = 'mastered';
      progressPercent = 100;
    } else if (currentIdx === stageLadderIdx || (currentIdx === 0 && idx === 0)) {
      status = 'current';
      progressPercent = currentIdx === 0 ? 0 : 50;
    } else {
      status = 'locked';
      progressPercent = 0;
    }

    return {
      id: stg.id,
      name: stg.name,
      description: stg.description,
      icon: '',
      pathway: 'numeracy',
      level: stg.level as any,
      status,
      progressPercent,
      xpReward: stg.xpReward,
    };
  });
}

// Sample Practice Questions for Student Practice Zone
export const MOCK_PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'pq-1',
    pathway: 'reading',
    level: 'paragraph',
    content: 'The big brown dog jumped over the fence.',
    audioPrompt: 'Read this sentence out loud: The big brown dog jumped over the fence.',
    options: ['The dog jumped over the fence.', 'The cat sat on the mat.', 'The bird flew in the sky.'],
    correctAnswer: 'The dog jumped over the fence.',
    explanation: 'Awesome reading! You identified what the dog did correctly! 🌟',
    xp: 20,
  },
  {
    id: 'pq-2',
    pathway: 'reading',
    level: 'paragraph',
    content: 'Meena likes to play with her red ball in the park.',
    audioPrompt: 'What does Meena like to play with?',
    options: ['Her red ball', 'A blue bicycle', 'A green kite'],
    correctAnswer: 'Her red ball',
    explanation: 'Superb! Meena plays with her red ball! 🎈',
    xp: 20,
  },
  {
    id: 'pq-3',
    pathway: 'numeracy',
    level: 'subtraction',
    content: 'What is 54 - 27 ?',
    audioPrompt: 'Subtract 27 from 54.',
    options: ['27', '37', '17'],
    correctAnswer: '27',
    explanation: 'Fantastic math skills! 54 minus 27 equals 27! 🧮',
    xp: 25,
  },
  {
    id: 'pq-4',
    pathway: 'numeracy',
    level: 'subtraction',
    content: 'In 472, what is the place value of 7?',
    audioPrompt: 'What is the place value of 7 in 472?',
    options: ['70 (Tens)', '700 (Hundreds)', '7 (Ones)'],
    correctAnswer: '70 (Tens)',
    explanation: 'Brilliant! The 7 is in the Tens place, so its value is 70! 🔢',
    xp: 25,
  },
];
