/**
 * NCERT Class 3 Syllabus — single source of truth for quiz content.
 *
 * Textbooks (latest NCERT, NEP 2020 / NCF-SE editions):
 *  • Mathematics — "Maths Mela"  (14 chapters)
 *  • English     — "Santoor"     (12 chapters, 4 units)
 *
 * Chapter lists verified against the official NCERT textbook index
 * (ncert.nic.in/textbook.php?cemm1=0-14 for Maths Mela).
 */

import { PracticeQuestion, ReadingLevel, NumeracyLevel } from './types';
import type { PragyaLearner } from '@/lib/types';

// ─────────────────────────────────────────────────────────────────────────────
// TEXTBOOK CHAPTERS
// ─────────────────────────────────────────────────────────────────────────────

export type NcertSubject = 'Maths Mela (Mathematics)' | 'Santoor (English)';

export interface NcertChapter {
  no: number;
  name: string;
  unit?: string;
  focus: string;
}

/** NCERT Class 3 Mathematics — Maths Mela (14 chapters) */
export const MATHS_MELA_CHAPTERS: NcertChapter[] = [
  { no: 1,  name: "What's in a Name?",      focus: 'Numbers, counting and patterns' },
  { no: 2,  name: 'Toy Joy',                focus: 'Shapes, sorting and comparison' },
  { no: 3,  name: 'Double Century',         focus: 'Numbers up to hundreds' },
  { no: 4,  name: 'Vacation with My Nani Maa', focus: 'Addition and subtraction in daily life' },
  { no: 5,  name: 'Fun with Shapes',        focus: 'Shapes and spatial sense' },
  { no: 6,  name: 'House of Hundreds – I',  focus: 'Place value and 3-digit numbers' },
  { no: 7,  name: 'Raksha Bandhan',         focus: 'Multiplication and equal grouping' },
  { no: 8,  name: 'Fair Share',             focus: 'Halves, quarters and fair sharing' },
  { no: 9,  name: 'House of Hundreds – II', focus: 'Larger numbers and operations' },
  { no: 10, name: 'Fun at Class Party!',    focus: 'Division, sharing and grouping' },
  { no: 11, name: 'Filling and Lifting',    focus: 'Capacity and weight' },
  { no: 12, name: 'Give and Take',          focus: 'Addition and subtraction practice' },
  { no: 13, name: 'Time Goes On',           focus: 'Time, calendar and sequence' },
  { no: 14, name: 'The Surajkund Fair',     focus: 'Money, measurement, patterns and data' },
];

/** NCERT Class 3 English — Santoor (12 chapters in 4 units) */
export const SANTOOR_CHAPTERS: NcertChapter[] = [
  { no: 1,  name: 'Colours',                        unit: 'Fun with Friends', focus: 'Poem; colour words and simple sentences' },
  { no: 2,  name: 'Badal and Moti',                 unit: 'Fun with Friends', focus: 'Story; reading connected text' },
  { no: 3,  name: 'Best Friends',                   unit: 'Fun with Friends', focus: 'Story; friendship vocabulary' },
  { no: 4,  name: 'Out in the Garden',              unit: 'Toys and Games',   focus: 'Poem; action words' },
  { no: 5,  name: 'Talking Toys',                   unit: 'Toys and Games',   focus: 'Story; describing toys' },
  { no: 6,  name: 'Paper Boats',                    unit: 'Toys and Games',   focus: 'Story; rainy-day sequence' },
  { no: 7,  name: 'The Big Laddoo',                 unit: 'Good Food',        focus: 'Story; sharing and food words' },
  { no: 8,  name: 'Thank God',                      unit: 'Good Food',        focus: 'Poem; gratitude and rhyming words' },
  { no: 9,  name: "Madhu's Wish",                   unit: 'Good Food',        focus: 'Story; making predictions' },
  { no: 10, name: 'Night',                          unit: 'The Sky',          focus: 'Poem; night-sky vocabulary' },
  { no: 11, name: 'Chanda Mama Counts the Stars',   unit: 'The Sky',          focus: 'Poem; counting and rhythm' },
  { no: 12, name: 'Chandrayaan',                    unit: 'The Sky',          focus: 'Informational text; India moon mission' },
];

// ─────────────────────────────────────────────────────────────────────────────
// SYLLABUS-ALIGNED QUESTION BANK
// ─────────────────────────────────────────────────────────────────────────────

export interface NcertQuestion extends PracticeQuestion {
  subject: NcertSubject;
  chapterNo: number;
  chapterName: string;
}

const mq = (
  id: string,
  level: NumeracyLevel,
  chapterNo: number,
  content: string,
  options: string[],
  correctAnswer: string,
  explanation: string,
  audioPrompt?: string
): NcertQuestion => ({
  id,
  pathway: 'numeracy',
  level,
  subject: 'Maths Mela (Mathematics)',
  chapterNo,
  chapterName: MATHS_MELA_CHAPTERS[chapterNo - 1].name,
  content,
  audioPrompt: audioPrompt || content,
  options,
  correctAnswer,
  explanation,
  xp: 25,
});

const rq = (
  id: string,
  level: ReadingLevel,
  chapterNo: number,
  content: string,
  options: string[],
  correctAnswer: string,
  explanation: string,
  audioPrompt?: string
): NcertQuestion => ({
  id,
  pathway: 'reading',
  level,
  subject: 'Santoor (English)',
  chapterNo,
  chapterName: SANTOOR_CHAPTERS[chapterNo - 1].name,
  content,
  audioPrompt: audioPrompt || content,
  options,
  correctAnswer,
  explanation,
  xp: 20,
});

/**
 * Every question maps to an actual NCERT Class 3 chapter and mirrors the
 * ASER-style adaptive levels used across the app (the level ladder stays
 * ASER-aligned per AGENTS.md; the CONTENT comes from the NCERT textbooks).
 */
export const NCERT_CLASS_3_QUESTION_BANK: NcertQuestion[] = [
  // ── MATHS · Number Recognition 1–9 (Ch 1, 2, 5, 11) ────────────────────────
  mq('m-n1', 'number_1_9', 1, 'In the name "RIYA", how many letters are there?', ['4', '5', '3'], '4',
     "R-I-Y-A has 4 letters — just like counting names in 'What's in a Name?'! 🔤"),
  mq('m-n2', 'number_1_9', 1, 'What comes next in the pattern: 1, 2, 3, 4, ___?', ['5', '6', '3'], '5',
     'Counting forward one by one: after 4 comes 5! 🎉'),
  mq('m-n3', 'number_1_9', 2, 'How many corners does a triangle have?', ['3', '4', '0'], '3',
     "A triangle has 3 straight sides and 3 corners — Toy Joy shapes! 📐"),
  mq('m-n4', 'number_1_9', 2, 'Which shape has no corners at all?', ['Circle', 'Square', 'Triangle'], 'Circle',
     "A circle is perfectly round — no corners, like a wheel! ⭕"),
  mq('m-n5', 'number_1_9', 11, 'A watermelon is ______ than an apple.', ['Heavier', 'Lighter', 'Smaller'], 'Heavier',
     "We compare weight in 'Filling and Lifting' — a watermelon is heavier! 🍉"),

  // ── MATHS · Number Recognition 11–99 (Ch 3, 6) ─────────────────────────────
  mq('m-t1', 'number_11_99', 3, 'How many tens are there in 60?', ['6 tens', '60 tens', '10 tens'], '6 tens',
     "60 = 6 bundles of ten — making numbers in 'Double Century'! 💯"),
  mq('m-t2', 'number_11_99', 3, 'Which number comes just after 79?', ['80', '81', '70'], '80',
     '79 and one more makes 80! 🔢'),
  mq('m-t3', 'number_11_99', 3, '45 + 10 = ?', ['55', '65', '54'], '55',
     "Adding one more ten to 45 gives 55 — Double Century maths! ➕"),
  mq('m-t4', 'number_11_99', 6, 'In 68, which digit is in the tens place?', ['6', '8', '68'], '6',
     "The first digit is the tens place — 'House of Hundreds' place value! 🏠"),
  mq('m-t5', 'number_11_99', 6, 'Which is the biggest number?', ['100', '98', '89'], '100',
     "100 is one hundred — the very first 3-digit number in 'House of Hundreds'! 🏆"),

  // ── MATHS · Subtraction (Ch 4, 12) ─────────────────────────────────────────
  mq('m-s1', 'subtraction', 4, 'Nani Maa had 23 mangoes. She gave 8 away. How many are left?', ['15', '16', '31'], '15',
     "23 − 8 = 15 — sharing mangoes in 'Vacation with My Nani Maa'! 🥭"),
  mq('m-s2', 'subtraction', 12, 'What is 54 − 27?', ['27', '37', '17'], '27',
     "Regroup a ten first: 54 − 27 = 27 — 'Give and Take' borrowing! 🧮"),
  mq('m-s3', 'subtraction', 12, 'A shop had 90 pencils. 45 were sold. How many are left?', ['45', '55', '35'], '45',
     '90 − 45 = 45 pencils still on the shelf! ✏️'),
  mq('m-s4', 'subtraction', 4, 'What is 100 − 60?', ['40', '50', '60'], '40',
     'Take away 6 tens from 10 tens — 4 tens or 40 remain! 💪'),

  // ── MATHS · Equal Groups & Division (Ch 7, 8, 10, 13, 14) ─────────────────
  mq('m-d1', 'division', 10, '12 laddoos are shared equally among 4 children. How many does each get?', ['3', '4', '6'], '3',
     "Sharing one by one: each child gets 3 — 'Fun at Class Party!' 🍬"),
  mq('m-d2', 'division', 8, 'A roti is cut into 2 equal parts. Each part is called a…', ['Half', 'Quarter', 'Whole'], 'Half',
     "Two equal parts make halves — fair sharing in 'Fair Share'! 🫓"),
  mq('m-d3', 'division', 8, 'How many quarters make one whole?', ['4', '2', '3'], '4',
     'Four equal quarters join to make a whole! 🎂'),
  mq('m-d4', 'division', 7, 'Each plate has 5 rakhis. There are 4 plates. How many rakhis in all?', ['20', '25', '9'], '20',
     "5 × 4 = 20 — equal groups in 'Raksha Bandhan'! 🎀"),
  mq('m-d5', 'division', 13, 'How many days are there in one week?', ['7', '12', '30'], '7',
     "Monday to Sunday — 7 days in 'Time Goes On'! 📅"),
  mq('m-d6', 'division', 14, 'A toy costs ₹35 and a ball costs ₹20. How much money for both?', ['₹55', '₹45', '₹15'], '₹55',
     '35 + 20 = 55 — adding money at the fair! 🛒'),

  // ── ENGLISH · Letter & Word level (Santoor Ch 1, 4) ────────────────────────
  rq('e-w1', 'letter', 1, 'Which word has 3 letters?', ['Sun', 'Rain', 'Cloud'], 'Sun',
     "S-U-N has 3 letters — word work with 'Colours'! ☀️"),
  rq('e-w2', 'letter', 1, 'Which colour word starts with the letter G?', ['Green', 'Red', 'Yellow'], 'Green',
     "Green grows in the garden and starts with G! 🌿"),
  rq('e-w3', 'letter', 1, 'Which word rhymes with "red"?', ['Bed', 'Tree', 'Moon'], 'Bed',
     'Red and bed rhyme — same ending sound! 🛏️'),
  rq('e-w4', 'word', 4, 'In the poem "Out in the Garden", where are the children playing?', ['In the garden', 'In the kitchen', 'On the roof'], 'In the garden',
     "The poem takes us out in the garden to play! 🌸"),

  // ── ENGLISH · Paragraph level (Santoor Ch 2, 3, 6, 7) ──────────────────────
  rq('e-p1', 'paragraph', 2, 'In the story "Badal and Moti", what is Moti?', ['A puppy', 'A kitten', 'A bird'], 'A puppy',
     "Moti is Badal's loyal puppy — the heart of 'Badal and Moti'! 🐶"),
  rq('e-p2', 'paragraph', 2, 'In "Badal and Moti", who is Badal?', ['A young boy', 'A teacher', 'A farmer'], 'A young boy',
     'Badal is a kind young boy who cares for Moti! 👦'),
  rq('e-p3', 'paragraph', 6, 'In the story "Paper Boats", what does the child make?', ['Paper boats', 'Paper planes', 'Paper caps'], 'Paper boats',
     "Rainy days are for floating paper boats! ⛵"),
  rq('e-p4', 'paragraph', 6, 'Where does the child float the paper boats?', ['In the rain water', 'In the swimming pool', 'In the bathtub'], 'In the rain water',
     'The child sails the boats on the water collected from the rain! 🌧️'),
  rq('e-p5', 'paragraph', 7, 'In "The Big Laddoo", what is shared among everyone?', ['A big laddoo', 'A big cake', 'A big mango'], 'A big laddoo',
     "One giant laddoo shared by all — 'The Big Laddoo'! 🍥"),
  rq('e-p6', 'paragraph', 3, 'The chapter "Best Friends" is about…', ['Friends who help each other', 'Animals in a zoo', 'A school picnic'], 'Friends who help each other',
     "True best friends always help each other! 🤝"),

  // ── ENGLISH · Story & Comprehension level (Santoor Ch 10, 11, 12) ──────────
  rq('e-s1', 'story', 11, 'Who counts the stars in the poem "Chanda Mama Counts the Stars"?', ['The Moon', 'The Sun', 'A little girl'], 'The Moon',
     "Chanda Mama is the Moon, counting twinkling stars! 🌙"),
  rq('e-s2', 'story', 11, '"Chanda Mama" is another name for the…', ['Moon', 'Star', 'Cloud'], 'Moon',
     'Chanda Mama lovingly means the Moon Uncle! 🌕'),
  rq('e-s3', 'story', 12, 'What did Chandrayaan land on?', ['The Moon', 'The Sun', 'Mars'], 'The Moon',
     "India's Chandrayaan mission reached the Moon! 🚀"),
  rq('e-s4', 'story', 12, 'The chapter "Chandrayaan" tells us about…', ["India's moon mission", 'A school fair', 'A river journey'], "India's moon mission",
     'Chandrayaan is India proudly exploring the Moon! 🇮🇳'),
  rq('e-s5', 'story', 10, 'In the poem "Night", when do the stars come out?', ['At night', 'In the morning', 'At noon'], 'At night',
     'The stars twinkle in the dark night sky! ✨'),
];

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL LADDERS (ASER-aligned stages, mapped to NCERT chapters)
// ─────────────────────────────────────────────────────────────────────────────

export const READING_LEVEL_ORDER: ReadingLevel[] = ['letter', 'word', 'paragraph', 'story'];
export const NUMERACY_LEVEL_ORDER: NumeracyLevel[] = ['number_1_9', 'number_11_99', 'subtraction', 'division'];

/** ASER level → linked NCERT chapters (for stage descriptions & teacher view) */
export const LEVEL_TO_NCERT: Record<string, { subject: NcertSubject; chapters: string }> = {
  letter:        { subject: 'Santoor (English)',        chapters: 'Ch 1: Colours' },
  word:          { subject: 'Santoor (English)',        chapters: 'Ch 4: Out in the Garden' },
  paragraph:     { subject: 'Santoor (English)',        chapters: 'Ch 2: Badal and Moti · Ch 6: Paper Boats' },
  story:         { subject: 'Santoor (English)',        chapters: 'Ch 11: Chanda Mama · Ch 12: Chandrayaan' },
  number_1_9:    { subject: 'Maths Mela (Mathematics)', chapters: "Ch 1: What's in a Name? · Ch 2: Toy Joy" },
  number_11_99:  { subject: 'Maths Mela (Mathematics)', chapters: 'Ch 3: Double Century · Ch 6: House of Hundreds – I' },
  subtraction:   { subject: 'Maths Mela (Mathematics)', chapters: 'Ch 4: Vacation with My Nani Maa · Ch 12: Give and Take' },
  division:      { subject: 'Maths Mela (Mathematics)', chapters: 'Ch 8: Fair Share · Ch 10: Fun at Class Party!' },
};

function normalizeNumeracyLevel(level: string): NumeracyLevel {
  if (level.startsWith('number-recognition-11')) return 'number_11_99';
  if (level.startsWith('number-recognition-1')) return 'number_1_9';
  if (level === 'number_1_9' || level === 'number_11_99' || level === 'subtraction' || level === 'division') return level as NumeracyLevel;
  return 'number_1_9';
}

function normalizeReadingLevel(level: string): ReadingLevel {
  if (level === 'letter' || level === 'word' || level === 'paragraph' || level === 'story') return level as ReadingLevel;
  return 'letter';
}

function levelDistance(a: string, order: string[]): number {
  const idx = order.indexOf(a);
  return idx === -1 ? order.length : idx;
}

/** Practice questions for a pathway + stage: NCERT content for the learner's current level first. */
export function getSyllabusQuestions(pathway: string, level: string): NcertQuestion[] {
  const isNumeracy = pathway === 'numeracy';
  const normalized = isNumeracy ? normalizeNumeracyLevel(level) : normalizeReadingLevel(level);
  const order = isNumeracy ? NUMERACY_LEVEL_ORDER : READING_LEVEL_ORDER;

  const inBank = NCERT_CLASS_3_QUESTION_BANK.filter(q => q.pathway === pathway);
  const primary = inBank.filter(q => q.level === normalized);
  const fill = inBank
    .filter(q => q.level !== normalized)
    .sort((a, b) => levelDistance(a.level, order) - levelDistance(b.level, order));

  return [...primary, ...fill].slice(0, 8);
}

/** 3 carefully selected mastery-verification questions for a pathway + stage. */
export function getMasteryChallengeQuestions(pathway: string, level: string): NcertQuestion[] {
  const isNumeracy = pathway === 'numeracy';
  const normalized = isNumeracy ? normalizeNumeracyLevel(level) : normalizeReadingLevel(level);
  const inBank = NCERT_CLASS_3_QUESTION_BANK.filter(q => q.pathway === pathway);
  const primary = inBank.filter(q => q.level === normalized).slice(0, 3);
  if (primary.length >= 3) return primary;
  return [...primary, ...inBank.filter(q => q.level !== normalized).slice(0, 3 - primary.length)];
}

export function getChapterLabel(q: NcertQuestion): string {
  const book = q.subject.startsWith('Maths') ? '📘 Maths Mela' : '📖 Santoor';
  return `${book} · Ch ${q.chapterNo}: ${q.chapterName}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// TEACHER ANALYTICS — data-driven grouping on the NCERT syllabus ladder
// ─────────────────────────────────────────────────────────────────────────────

const NUMERACY_LABELS: Record<string, string> = {
  beginner: 'Beginning number concepts',
  number_1_9: 'Number Recognition (1–9)',
  number_11_99: 'Number Recognition (11–99)',
  subtraction: '2-Digit Subtraction with Borrowing',
  division: 'Division & Equal Sharing',
};

const NUMERACY_BOTTLENECK_PLAN: Record<string, { chapterRef: string; activity: string }> = {
  beginner: {
    chapterRef: "Maths Mela · Ch 1: What's in a Name?",
    activity: '15-minute counting and letter-of-name games (Maths Mela Ch 1).',
  },
  number_1_9: {
    chapterRef: 'Maths Mela · Ch 1 & 2',
    activity: '15-minute "Number Bingo" with objects 1–9 (Maths Mela Ch 1 & 2).',
  },
  number_11_99: {
    chapterRef: 'Maths Mela · Ch 3: Double Century',
    activity: '15-minute "make the number" game with number cards (Maths Mela Ch 3).',
  },
  subtraction: {
    chapterRef: 'Maths Mela · Ch 4 & 12: Give and Take',
    activity: '15-minute regrouping practice with bundle sticks (Maths Mela Ch 12).',
  },
  division: {
    chapterRef: 'Maths Mela · Ch 10: Fun at Class Party!',
    activity: '15-minute equal-sharing game with laddoo cards (Maths Mela Ch 10).',
  },
};

export interface NumeracyBottleneck {
  level: string;
  label: string;
  chapterRef: string;
  activity: string;
  count: number;
  students: { id: string; name: string; avatar: string }[];
}

/** Most foundational numeracy stage where the most learners are stuck. */
export function getNumeracyBottleneck(learners: PragyaLearner[]): NumeracyBottleneck | null {
  if (learners.length === 0) return null;

  const ladder = ['beginner', 'number_1_9', 'number_11_99', 'subtraction', 'division'];
  const buckets = new Map<string, PragyaLearner[]>();
  for (const l of learners) {
    const key = l.numeracy_level === 'division' ? 'division' : normalizeNumeracyLevel(String(l.numeracy_level));
    const arr = buckets.get(key) || [];
    arr.push(l);
    buckets.set(key, arr);
  }

  // Walk the pedagogical ladder; the first rung where 2+ learners stall is the class bottleneck.
  let chosen: string | null = null;
  for (const rung of ladder) {
    const count = (buckets.get(rung) || []).length;
    if (count >= 2) {
      chosen = rung;
      break;
    }
  }
  if (!chosen) {
    chosen = ladder.reduce((best, rung) =>
      (buckets.get(rung) || []).length > (buckets.get(best) || []).length ? rung : best, 'division');
  }

  const students = (buckets.get(chosen) || []).map(l => ({ id: l.id, name: l.name, avatar: l.avatar_emoji }));
  const plan = NUMERACY_BOTTLENECK_PLAN[chosen] || NUMERACY_BOTTLENECK_PLAN.number_1_9;

  return {
    level: chosen,
    label: NUMERACY_LABELS[chosen] || chosen,
    chapterRef: plan.chapterRef,
    activity: plan.activity,
    count: students.length,
    students,
  };
}

export interface InstructionalGroup {
  id: string;
  name: string;
  subject: 'reading' | 'numeracy';
  chapterRef: string;
  need: string;
  activity: string;
  students: { id: string; name: string; avatar: string }[];
}

const READING_GROUP_PLAN: Record<string, { name: string; chapterRef: string; need: string; activity: string }> = {
  letter: {
    name: 'Phonics & Letters',
    chapterRef: 'Santoor · Ch 1: Colours',
    need: 'These learners are still building letter-sound recognition.',
    activity: 'Letter-sound bingo using colour words from "Colours" (Santoor Ch 1).',
  },
  word: {
    name: 'Word Builders',
    chapterRef: 'Santoor · Ch 4: Out in the Garden',
    need: 'These learners know their letters but need help blending them into words.',
    activity: 'Blend-and-read word hunt with garden words (Santoor Ch 4).',
  },
  paragraph: {
    name: 'Connected Readers',
    chapterRef: 'Santoor · Ch 2: Badal and Moti',
    need: 'These learners read words but struggle to read connected text fluently.',
    activity: 'Echo-read "Badal and Moti" (Santoor Ch 2), then retell the story.',
  },
};

const NUMERACY_GROUP_PLAN: Record<string, { name: string; chapterRef: string; need: string; activity: string }> = {
  beginner: {
    name: 'First Counting Steps',
    chapterRef: "Maths Mela · Ch 1: What's in a Name?",
    need: 'These learners are just beginning to work with numbers.',
    activity: 'Count objects and names together (Maths Mela Ch 1).',
  },
  number_1_9: {
    name: 'Number Sense 1–9',
    chapterRef: 'Maths Mela · Ch 1 & 2',
    need: 'These learners need fluency recognising and comparing numbers 1–9.',
    activity: 'Count-and-match games with classroom objects (Maths Mela Ch 1).',
  },
  number_11_99: {
    name: 'Place Value & 2-Digit Numbers',
    chapterRef: 'Maths Mela · Ch 3: Double Century',
    need: 'These learners need support composing and reading 2-digit numbers.',
    activity: 'Build 2-digit numbers with number cards (Maths Mela Ch 3).',
  },
  subtraction: {
    name: 'Subtraction with Regrouping',
    chapterRef: 'Maths Mela · Ch 4 & 12: Give and Take',
    need: 'These learners hesitate when borrowing across place values.',
    activity: 'Regrouping practice with bundle sticks (Maths Mela Ch 12).',
  },
  division: {
    name: 'Equal Sharing & Division',
    chapterRef: 'Maths Mela · Ch 10: Fun at Class Party!',
    need: 'These learners are ready for sharing and grouping problems.',
    activity: 'Share laddoos equally in groups (Maths Mela Ch 10).',
  },
};

/** Group learners by COMMON INSTRUCTIONAL NEED, each mapped to NCERT chapters. */
export function getInstructionalGroups(learners: PragyaLearner[]): InstructionalGroup[] {
  const groups: InstructionalGroup[] = [];

  const addTo = (subject: 'reading' | 'numeracy', planKey: string, plan: { name: string; chapterRef: string; need: string; activity: string }, list: PragyaLearner[]) => {
    if (list.length === 0) return;
    groups.push({
      id: `${subject}-${planKey}`,
      subject,
      name: plan.name,
      chapterRef: plan.chapterRef,
      need: plan.need,
      activity: plan.activity,
      students: list.map(l => ({ id: l.id, name: l.name, avatar: l.avatar_emoji })),
    });
  };

  // Reading groups
  addTo('reading', 'letter', READING_GROUP_PLAN.letter,
    learners.filter(l => l.reading_level === 'beginner' || l.reading_level === 'letter'));
  addTo('reading', 'word', READING_GROUP_PLAN.word,
    learners.filter(l => l.reading_level === 'word'));
  addTo('reading', 'paragraph', READING_GROUP_PLAN.paragraph,
    learners.filter(l => l.reading_level === 'paragraph'));

  // Numeracy groups
  const byNumeracy = new Map<string, PragyaLearner[]>();
  for (const l of learners) {
    const key = normalizeNumeracyLevel(String(l.numeracy_level));
    const arr = byNumeracy.get(key) || [];
    arr.push(l);
    byNumeracy.set(key, arr);
  }
  addTo('numeracy', 'number_1_9', NUMERACY_GROUP_PLAN.number_1_9, byNumeracy.get('number_1_9') || []);
  addTo('numeracy', 'number_11_99', NUMERACY_GROUP_PLAN.number_11_99, byNumeracy.get('number_11_99') || []);
  addTo('numeracy', 'subtraction', NUMERACY_GROUP_PLAN.subtraction, byNumeracy.get('subtraction') || []);
  addTo('numeracy', 'division', NUMERACY_GROUP_PLAN.division, byNumeracy.get('division') || []);

  // Largest instructional needs first (group sizing, not student ranking)
  return groups.sort((a, b) => b.students.length - a.students.length).slice(0, 4);
}
