// Shared classroom data for all teacher panel components
// This is the single source of truth — derived from ASER DIYA methodology

export type ReadingLevel = 'beginner' | 'letter' | 'word' | 'paragraph' | 'story';
export type NumeracyLevel = 'beginner' | 'number_1_9' | 'number_11_99' | 'subtraction' | 'division';
export type LearnerStatus = 'secure' | 'developing' | 'needs-support';

export interface ClassroomLearner {
  id: string;
  name: string;
  avatar: string; // local path
  readingLevel: ReadingLevel;
  numeracyLevel: NumeracyLevel;
  status: LearnerStatus;
  // Per-skill confidence (0-100)
  confidence: {
    letter: number;
    word: number;
    paragraph: number;
    story: number;
    number_1_9: number;
    number_11_99: number;
    subtraction: number;
    division: number;
  };
}

// ASER reading level order (for comparison)
export const READING_ORDER: ReadingLevel[] = ['beginner', 'letter', 'word', 'paragraph', 'story'];
export const NUMERACY_ORDER: NumeracyLevel[] = ['beginner', 'number_1_9', 'number_11_99', 'subtraction', 'division'];

// The 10 skill columns for the heatmap
export const SKILL_COLUMNS = [
  { key: 'letter',       label: 'Letter',       domain: 'reading'  as const },
  { key: 'word',         label: 'Word',         domain: 'reading'  as const },
  { key: 'paragraph',    label: 'Paragraph',    domain: 'reading'  as const },
  { key: 'story',        label: 'Story',        domain: 'reading'  as const },
  { key: 'number_1_9',   label: 'Num 1–9',     domain: 'numeracy' as const },
  { key: 'number_11_99', label: 'Num 11–99',   domain: 'numeracy' as const },
  { key: 'subtraction',  label: 'Subtraction',  domain: 'numeracy' as const },
  { key: 'division',     label: 'Division',     domain: 'numeracy' as const },
] as const;

export type SkillKey = typeof SKILL_COLUMNS[number]['key'];

// Derive per-skill status from reading/numeracy level
export function getSkillStatus(learner: ClassroomLearner, skillKey: SkillKey): 'demonstrated' | 'developing' | 'needs-support' | 'not-assessed' {
  const readingIdx = READING_ORDER.indexOf(learner.readingLevel);
  const numeracyIdx = NUMERACY_ORDER.indexOf(learner.numeracyLevel);

  const readingSkillIdx: Record<string, number> = {
    letter: 1, word: 2, paragraph: 3, story: 4,
  };
  const numeracySkillIdx: Record<string, number> = {
    number_1_9: 1, number_11_99: 2, subtraction: 3, division: 4,
  };

  if (skillKey in readingSkillIdx) {
    const skillIdx = readingSkillIdx[skillKey];
    if (readingIdx >= skillIdx) return 'demonstrated';
    if (readingIdx === skillIdx - 1) return 'developing';
    return 'needs-support';
  }
  if (skillKey in numeracySkillIdx) {
    const skillIdx = numeracySkillIdx[skillKey];
    if (numeracyIdx >= skillIdx) return 'demonstrated';
    if (numeracyIdx === skillIdx - 1) return 'developing';
    return 'needs-support';
  }
  return 'not-assessed';
}

// 20 synthetic learners — diverse ASER level profiles
export const CLASSROOM_LEARNERS: ClassroomLearner[] = [
  { id: 'l01', name: 'Sai Patel',     avatar: '/avatars/boy_1.jpg',  readingLevel: 'beginner',   numeracyLevel: 'number_1_9',   status: 'needs-support', confidence: { letter: 22, word: 0, paragraph: 0, story: 0, number_1_9: 58, number_11_99: 0, subtraction: 0, division: 0 } },
  { id: 'l02', name: 'Arjun Patel',   avatar: '/avatars/boy_2.png',  readingLevel: 'word',       numeracyLevel: 'subtraction',  status: 'developing',    confidence: { letter: 97, word: 78, paragraph: 30, story: 0, number_1_9: 99, number_11_99: 91, subtraction: 64, division: 0 } },
  { id: 'l03', name: 'Kiara Bose',    avatar: '/avatars/girl_1.png', readingLevel: 'letter',     numeracyLevel: 'number_1_9',   status: 'needs-support', confidence: { letter: 72, word: 28, paragraph: 0, story: 0, number_1_9: 67, number_11_99: 0, subtraction: 0, division: 0 } },
  { id: 'l04', name: 'Meera Singh',   avatar: '/avatars/girl_1.png', readingLevel: 'paragraph',  numeracyLevel: 'number_11_99', status: 'developing',    confidence: { letter: 99, word: 95, paragraph: 71, story: 18, number_1_9: 99, number_11_99: 82, subtraction: 35, division: 0 } },
  { id: 'l05', name: 'Saanvi Gupta',  avatar: '/avatars/girl_1.png', readingLevel: 'word',       numeracyLevel: 'subtraction',  status: 'developing',    confidence: { letter: 98, word: 80, paragraph: 40, story: 0, number_1_9: 99, number_11_99: 93, subtraction: 60, division: 0 } },
  { id: 'l06', name: 'Priya Singh',   avatar: '/avatars/girl_1.png', readingLevel: 'word',       numeracyLevel: 'subtraction',  status: 'developing',    confidence: { letter: 96, word: 77, paragraph: 22, story: 0, number_1_9: 98, number_11_99: 89, subtraction: 58, division: 0 } },
  { id: 'l07', name: 'Kabir Das',     avatar: '/avatars/boy_1.jpg',  readingLevel: 'paragraph',  numeracyLevel: 'subtraction',  status: 'developing',    confidence: { letter: 99, word: 97, paragraph: 74, story: 20, number_1_9: 99, number_11_99: 96, subtraction: 72, division: 10 } },
  { id: 'l08', name: 'Saanvi Reddy',  avatar: '/avatars/girl_1.png', readingLevel: 'story',      numeracyLevel: 'division',     status: 'secure',        confidence: { letter: 99, word: 99, paragraph: 98, story: 95, number_1_9: 99, number_11_99: 99, subtraction: 98, division: 91 } },
  { id: 'l09', name: 'Sai Bose',      avatar: '/avatars/boy_2.png',  readingLevel: 'letter',     numeracyLevel: 'number_1_9',   status: 'needs-support', confidence: { letter: 65, word: 20, paragraph: 0, story: 0, number_1_9: 61, number_11_99: 0, subtraction: 0, division: 0 } },
  { id: 'l10', name: 'Aadhya Sharma', avatar: '/avatars/girl_1.png', readingLevel: 'word',       numeracyLevel: 'number_11_99', status: 'developing',    confidence: { letter: 99, word: 85, paragraph: 45, story: 0, number_1_9: 99, number_11_99: 78, subtraction: 30, division: 0 } },
  { id: 'l11', name: 'Arjun Kumar',   avatar: '/avatars/boy_1.jpg',  readingLevel: 'paragraph',  numeracyLevel: 'subtraction',  status: 'developing',    confidence: { letter: 99, word: 96, paragraph: 68, story: 14, number_1_9: 99, number_11_99: 95, subtraction: 66, division: 0 } },
  { id: 'l12', name: 'Sai Reddy',     avatar: '/avatars/boy_2.png',  readingLevel: 'story',      numeracyLevel: 'division',     status: 'secure',        confidence: { letter: 99, word: 99, paragraph: 97, story: 92, number_1_9: 99, number_11_99: 99, subtraction: 97, division: 88 } },
  { id: 'l13', name: 'Arjun Reddy',   avatar: '/avatars/boy_1.jpg',  readingLevel: 'word',       numeracyLevel: 'number_11_99', status: 'developing',    confidence: { letter: 98, word: 76, paragraph: 35, story: 0, number_1_9: 99, number_11_99: 74, subtraction: 28, division: 0 } },
  { id: 'l14', name: 'Vivaan Das',    avatar: '/avatars/boy_2.png',  readingLevel: 'story',      numeracyLevel: 'division',     status: 'secure',        confidence: { letter: 99, word: 99, paragraph: 99, story: 94, number_1_9: 99, number_11_99: 99, subtraction: 99, division: 90 } },
  { id: 'l15', name: 'Diya Gupta',    avatar: '/avatars/girl_1.png', readingLevel: 'story',      numeracyLevel: 'division',     status: 'secure',        confidence: { letter: 99, word: 99, paragraph: 98, story: 93, number_1_9: 99, number_11_99: 99, subtraction: 98, division: 87 } },
  { id: 'l16', name: 'Aditya Kumar',  avatar: '/avatars/boy_1.jpg',  readingLevel: 'story',      numeracyLevel: 'division',     status: 'secure',        confidence: { letter: 99, word: 99, paragraph: 99, story: 96, number_1_9: 99, number_11_99: 99, subtraction: 99, division: 94 } },
  { id: 'l17', name: 'Ananya Bose',   avatar: '/avatars/girl_1.png', readingLevel: 'paragraph',  numeracyLevel: 'subtraction',  status: 'developing',    confidence: { letter: 99, word: 95, paragraph: 67, story: 12, number_1_9: 99, number_11_99: 94, subtraction: 63, division: 0 } },
  { id: 'l18', name: 'Rohan Nair',    avatar: '/avatars/boy_2.png',  readingLevel: 'letter',     numeracyLevel: 'number_1_9',   status: 'needs-support', confidence: { letter: 68, word: 18, paragraph: 0, story: 0, number_1_9: 70, number_11_99: 0, subtraction: 0, division: 0 } },
  { id: 'l19', name: 'Myra Bhat',     avatar: '/avatars/girl_1.png', readingLevel: 'story',      numeracyLevel: 'division',     status: 'secure',        confidence: { letter: 99, word: 99, paragraph: 98, story: 91, number_1_9: 99, number_11_99: 99, subtraction: 97, division: 86 } },
  { id: 'l20', name: 'Ishaan Rao',    avatar: '/avatars/boy_1.jpg',  readingLevel: 'story',      numeracyLevel: 'division',     status: 'secure',        confidence: { letter: 99, word: 99, paragraph: 99, story: 95, number_1_9: 99, number_11_99: 99, subtraction: 99, division: 92 } },
];

// Group learners by their shared instructional need (not by score)
export interface InstructionalGroup {
  id: string;
  name: string;
  color: string;
  bg: string;
  border: string;
  readingAnchor: ReadingLevel;
  numeracyAnchor: NumeracyLevel;
  focus: string;
  activity: string;
  duration: string;
  learners: ClassroomLearner[];
}

export function buildInstructionalGroups(learners: ClassroomLearner[]): InstructionalGroup[] {
  return [
    {
      id: 'group-a',
      name: 'Group A — Phonics Foundation',
      color: '#c2410c',
      bg: 'bg-[#fff7ed]',
      border: 'border-[#fed7aa]',
      readingAnchor: 'beginner',
      numeracyAnchor: 'number_1_9',
      focus: 'Letter recognition & number 1–9',
      activity: 'Letter sound flashcards + number tracing with 1–9 cards',
      duration: '15 min',
      learners: learners.filter(l =>
        (l.readingLevel === 'beginner' || l.readingLevel === 'letter') &&
        (l.numeracyLevel === 'beginner' || l.numeracyLevel === 'number_1_9')
      ),
    },
    {
      id: 'group-b',
      name: 'Group B — Word Builders',
      color: '#1d4ed8',
      bg: 'bg-[#eff6ff]',
      border: 'border-[#bfdbfe]',
      readingAnchor: 'word',
      numeracyAnchor: 'number_11_99',
      focus: 'Word blending & 2-digit numbers',
      activity: '5-word reading cards + skip counting 11–99 on a number line',
      duration: '15 min',
      learners: learners.filter(l =>
        l.readingLevel === 'word' ||
        (l.numeracyLevel === 'number_11_99' && l.readingLevel !== 'paragraph' && l.readingLevel !== 'story')
      ),
    },
    {
      id: 'group-c',
      name: 'Group C — Connected Readers',
      color: '#7c3aed',
      bg: 'bg-[#faf5ff]',
      border: 'border-[#e9d5ff]',
      readingAnchor: 'paragraph',
      numeracyAnchor: 'subtraction',
      focus: 'Paragraph fluency & subtraction with borrowing',
      activity: 'Shared reading of Std I text + place value regrouping visual',
      duration: '20 min',
      learners: learners.filter(l =>
        l.readingLevel === 'paragraph' ||
        l.numeracyLevel === 'subtraction'
      ).filter((l, _, arr) => arr.some(x => x.id === l.id && (x.readingLevel === 'paragraph' || x.numeracyLevel === 'subtraction'))),
    },
    {
      id: 'group-d',
      name: 'Group D — Story Masters',
      color: '#065f46',
      bg: 'bg-[#ecfdf5]',
      border: 'border-[#a7f3d0]',
      readingAnchor: 'story',
      numeracyAnchor: 'division',
      focus: 'Story comprehension & division',
      activity: 'Std II story read-aloud + 3÷1 division with remainder practice',
      duration: '20 min',
      learners: learners.filter(l =>
        l.readingLevel === 'story' && l.numeracyLevel === 'division'
      ),
    },
  ];
}
