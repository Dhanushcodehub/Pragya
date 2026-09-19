/**
 * Practice-attempt analytics engine — real-time mastery computation.
 *
 * Industry-grade metrics computed from raw per-question attempts:
 *  • EWMA-weighted mastery (recent answers count more, like spaced practice)
 *  • Readiness score = in-level mastery blended with ASER ladder progress
 *  • Session-level accuracy trend + rolling mastery timeline
 *  • Fluency (median response time, correct vs incorrect)
 *  • NCERT chapter proficiency + radar across the level ladder
 *  • Auto-generated insights for the teacher
 *
 * Pure functions — no I/O — so both the API route and charts reuse them.
 */

import { MATHS_MELA_CHAPTERS, SANTOOR_CHAPTERS } from './ncertSyllabus';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface PracticeAttemptRecord {
  id: string;
  learner_id: string;
  pathway: 'reading' | 'numeracy';
  level: string;              // ASER level at time of answering
  question_id: string;
  chapter_no: number;
  chapter_name: string;
  subject: string;            // 'Maths Mela (Mathematics)' | 'Santoor (English)'
  is_correct: boolean;
  time_ms: number | null;
  mode: 'practice' | 'challenge';
  created_at: string;         // ISO timestamp
}

export interface MasteryPoint {   // rolling mastery timeline
  t: string;                    // ISO timestamp
  label: string;                // e.g. "#12 · 2:41 PM"
  mastery: number;              // 0–100 EWMA after this attempt
  sessionNo: number;
}

export interface SessionStat {
  sessionNo: number;
  startedAt: string;
  timeLabel: string;            // "Sep 19, 2:41 PM"
  total: number;
  correct: number;
  accuracy: number;             // 0–100
  avgTimeSec: number;
  mode: 'practice' | 'challenge';
  masteryAfter: number;         // EWMA mastery after this session
}

export interface ChapterProficiency {
  chapter: string;              // "Ch 12: Give and Take"
  shortName: string;
  subject: string;
  attempts: number;
  accuracy: number;             // 0–100
  score: number;                // 0–100 (accuracy, attempts<3 flagged)
  needsAttention: boolean;
}

export interface LevelRadarPoint {
  level: string;
  label: string;
  accuracy: number;             // 0–100
  attempts: number;
}

export interface StudentAnalytics {
  totalAttempts: number;
  totalCorrect: number;
  overallAccuracy: number;      // 0–100
  masteryScore: number;         // 0–100 EWMA-weighted (the headline number)
  readinessLevel: 'at-risk' | 'emerging' | 'developing' | 'proficient' | 'advanced';
  momentum: number;             // -100..+100, recent vs earlier accuracy
  trend: 'improving' | 'steady' | 'declining';
  fluency: {
    medianTimeSec: number | null;
    correctMedianSec: number | null;
    incorrectMedianSec: number | null;
    speedImprovementPct: number;  // + = getting faster
  };
  sessions: SessionStat[];
  masteryTimeline: MasteryPoint[];
  chapterBreakdown: ChapterProficiency[];
  levelRadar: LevelRadarPoint[];
  insights: string[];
  lastActiveAt: string | null;
  hasData: boolean;
}

export interface SessionBreakdown {
  sessionNo: number;
  startedAt: string;
  attempts: PracticeAttemptRecord[];
  correct: number;
  total: number;
  accuracy: number;
  mode: 'practice' | 'challenge';
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

/** ASER ladder positions (0-indexed) used to blend ladder progress into readiness. */
const LADDERS: Record<'reading' | 'numeracy', string[]> = {
  reading: ['letter', 'word', 'paragraph', 'story'],
  numeracy: ['number_1_9', 'number_11_99', 'subtraction', 'division'],
};

/** Gap between sessions that starts a new session (5 minutes). */
const SESSION_GAP_MS = 5 * 60 * 1000;

// ─────────────────────────────────────────────────────────────────────────────
// SESSIONIZATION
// ─────────────────────────────────────────────────────────────────────────────

/** Group attempts into practice sessions: a >5min gap starts a new session. */
export function buildSessions(attempts: PracticeAttemptRecord[]): SessionBreakdown[] {
  if (attempts.length === 0) return [];
  const sorted = [...attempts].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const groups: PracticeAttemptRecord[][] = [];
  let current: PracticeAttemptRecord[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1].created_at).getTime();
    const cur = new Date(sorted[i].created_at).getTime();
    if (cur - prev > SESSION_GAP_MS) {
      groups.push(current);
      current = [];
    }
    current.push(sorted[i]);
  }
  groups.push(current);

  return groups.map((attemptsInSession, idx) => {
    const correct = attemptsInSession.filter(a => a.is_correct).length;
    return {
      sessionNo: idx + 1,
      startedAt: attemptsInSession[0].created_at,
      attempts: attemptsInSession,
      correct,
      total: attemptsInSession.length,
      accuracy: attemptsInSession.length ? Math.round((correct / attemptsInSession.length) * 100) : 0,
      mode: attemptsInSession.some(a => a.mode === 'challenge') ? 'challenge' : 'practice',
    };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// CORE METRICS
// ─────────────────────────────────────────────────────────────────────────────

/** EWMA mastery: recent attempts weigh more. alpha=0.3 is stable but reactive. */
export function computeEwmaMastery(attempts: PracticeAttemptRecord[], alpha = 0.3): number {
  if (attempts.length === 0) return 0;
  const sorted = [...attempts].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  let ewma = sorted[0].is_correct ? 100 : 0;
  for (let i = 1; i < sorted.length; i++) {
    const score = sorted[i].is_correct ? 100 : 0;
    ewma = alpha * score + (1 - alpha) * ewma;
  }
  return Math.round(ewma);
}

/** Rolling EWMA after each attempt — the timeline the line chart draws. */
function computeMasteryTimeline(sessions: SessionBreakdown[]): MasteryPoint[] {
  const points: MasteryPoint[] = [];
  let ewma: number | null = null;
  const alpha = 0.3;

  for (const session of sessions) {
    for (const a of session.attempts) {
      const score = a.is_correct ? 100 : 0;
      ewma = ewma === null ? score : alpha * score + (1 - alpha) * ewma;
      const d = new Date(a.created_at);
      const hh = d.getHours() % 12 || 12;
      const mm = String(d.getMinutes()).padStart(2, '0');
      const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
      points.push({
        t: a.created_at,
        label: `#${points.length + 1} · ${hh}:${mm} ${ampm}`,
        mastery: Math.round(ewma),
        sessionNo: session.sessionNo,
      });
    }
  }
  return points;
}

function median(nums: number[]): number | null {
  if (nums.length === 0) return null;
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
}

function computeFluency(attempts: PracticeAttemptRecord[]) {
  const timed = attempts.filter(a => typeof a.time_ms === 'number' && a.time_ms > 500);
  const toSec = (a: PracticeAttemptRecord) => Math.round((a.time_ms as number) / 100) / 10;

  const half = Math.floor(timed.length / 2);
  const firstHalf = timed.slice(0, half).map(toSec);
  const secondHalf = timed.slice(half).map(toSec);
  const firstMedian = median(firstHalf);
  const lastMedian = median(secondHalf);
  const speedImprovementPct =
    firstMedian && lastMedian && firstMedian > 0
      ? Math.round(((firstMedian - lastMedian) / firstMedian) * 100)
      : 0;

  return {
    medianTimeSec: median(timed.map(toSec)),
    correctMedianSec: median(timed.filter(a => a.is_correct).map(toSec)),
    incorrectMedianSec: median(timed.filter(a => !a.is_correct).map(toSec)),
    speedImprovementPct,
  };
}

function levelLabel(level: string): string {
  const map: Record<string, string> = {
    letter: 'Letters',
    word: 'Words',
    paragraph: 'Paragraph',
    story: 'Story',
    number_1_9: '1–9',
    number_11_99: '11–99',
    subtraction: 'Subtraction',
    division: 'Division',
    beginner: 'Beginner',
  };
  return map[level] || level;
}

function ladderProgress(attempts: PracticeAttemptRecord[]): number {
  // Highest rung where the learner answered ≥3 attempts with ≥60% accuracy.
  const byPathway = new Map<'reading' | 'numeracy', PracticeAttemptRecord[]>();
  for (const a of attempts) {
    const arr = byPathway.get(a.pathway) || [];
    arr.push(a);
    byPathway.set(a.pathway, arr);
  }

  let best = 0;
  for (const [pathway, list] of byPathway) {
    const ladder = LADDERS[pathway];
    ladder.forEach((rung, idx) => {
      const atLevel = list.filter(a => a.level === rung);
      if (atLevel.length >= 3) {
        const acc = atLevel.filter(a => a.is_correct).length / atLevel.length;
        if (acc >= 0.6) best = Math.max(best, idx + 1);
      }
    });
  }
  return best; // 0..4
}

const MAX_LADDER = 4;

function readinessBand(score: number): StudentAnalytics['readinessLevel'] {
  if (score >= 80) return 'advanced';
  if (score >= 65) return 'proficient';
  if (score >= 45) return 'developing';
  if (score >= 25) return 'emerging';
  return 'at-risk';
}

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER PROFICIENCY
// ─────────────────────────────────────────────────────────────────────────────

function chapterShortName(chapterNo: number, subject: string): string {
  const book = subject.startsWith('Maths') ? MATHS_MELA_CHAPTERS : SANTOOR_CHAPTERS;
  const ch = book[chapterNo - 1];
  return ch ? ch.name : `Ch ${chapterNo}`;
}

function computeChapterBreakdown(attempts: PracticeAttemptRecord[]): ChapterProficiency[] {
  const map = new Map<string, { no: number; subject: string; total: number; correct: number }>();
  for (const a of attempts) {
    const key = `${a.subject}#${a.chapter_no}`;
    const entry = map.get(key) || { no: a.chapter_no, subject: a.subject, total: 0, correct: 0 };
    entry.total += 1;
    if (a.is_correct) entry.correct += 1;
    map.set(key, entry);
  }

  return [...map.values()]
    .map(e => {
      const accuracy = Math.round((e.correct / e.total) * 100);
      return {
        chapter: `Ch ${e.no}: ${chapterShortName(e.no, e.subject)}`,
        shortName: chapterShortName(e.no, e.subject),
        subject: e.subject,
        attempts: e.total,
        accuracy,
        score: accuracy,
        needsAttention: e.total >= 2 && accuracy < 60,
      };
    })
    .sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts);
}

// ─────────────────────────────────────────────────────────────────────────────
// INSIGHTS (teacher-facing, generated from the data)
// ─────────────────────────────────────────────────────────────────────────────

function buildInsights(a: {
  masteryScore: number;
  overallAccuracy: number;
  trend: StudentAnalytics['trend'];
  sessions: SessionStat[];
  chapters: ChapterProficiency[];
  fluency: ReturnType<typeof computeFluency>;
  readinessLevel: StudentAnalytics['readinessLevel'];
}): string[] {
  const out: string[] = [];
  const { masteryScore, trend, sessions, chapters, fluency } = a;

  if (trend === 'improving') out.push(`📈 Trending up — accuracy is improving across recent sessions.`);
  if (trend === 'declining') out.push(`📉 Recent answers are weaker than earlier ones — consider re-teaching the current level.`);
  if (trend === 'steady' && sessions.length > 1) out.push(`➖ Performance is steady — keep practising for mastery consolidation.`);

  const weak = chapters.filter(c => c.needsAttention).slice(0, 2);
  for (const w of weak) out.push(`🎯 Revisit ${w.chapter} — only ${w.accuracy}% correct over ${w.attempts} tries.`);

  const strong = chapters.filter(c => c.attempts >= 3 && c.accuracy >= 80).slice(0, 1);
  for (const s of strong) out.push(`⭐ Strong on ${s.chapter} (${s.accuracy}%) — ready for a challenge here.`);

  if (fluency.medianTimeSec && fluency.medianTimeSec > 20) {
    out.push(`⏱ Taking ~${fluency.medianTimeSec}s per question — fluency practice would build confidence.`);
  } else if (fluency.speedImprovementPct >= 15) {
    out.push(`⚡ Getting ${fluency.speedImprovementPct}% faster — fluency is improving!`);
  }

  if (sessions.length >= 3) {
    const last = sessions[sessions.length - 1];
    out.push(`Last session: ${last.correct}/${last.total} correct (${last.accuracy}%) in ${last.mode} mode.`);
  }

  if (masteryScore >= 80) out.push(`🏅 Mastery ${masteryScore}/100 — move to the next level on the ladder.`);
  if (a.readinessLevel === 'at-risk') out.push(`🧩 Foundational gaps detected — start with 1-on-1 guided practice.`);

  return out.slice(0, 5);
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ENTRY
// ─────────────────────────────────────────────────────────────────────────────

export function computeStudentAnalytics(attempts: PracticeAttemptRecord[]): StudentAnalytics {
  if (!attempts || attempts.length === 0) {
    return {
      totalAttempts: 0,
      totalCorrect: 0,
      overallAccuracy: 0,
      masteryScore: 0,
      readinessLevel: 'at-risk',
      momentum: 0,
      trend: 'steady',
      fluency: { medianTimeSec: null, correctMedianSec: null, incorrectMedianSec: null, speedImprovementPct: 0 },
      sessions: [],
      masteryTimeline: [],
      chapterBreakdown: [],
      levelRadar: [],
      insights: ['No practice data yet — mastery updates live as the student answers practice questions.'],
      lastActiveAt: null,
      hasData: false,
    };
  }

  const sorted = [...attempts].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  const totalCorrect = attempts.filter(a => a.is_correct).length;
  const masteryScore = computeEwmaMastery(attempts);
  const sessions = buildSessions(attempts);

  // Rolling mastery at session boundaries → session trend chart
  const timeline = computeMasteryTimeline(sessions);
  const sessionStats: SessionStat[] = sessions.map(s => {
    const lastAttemptAt = s.attempts[s.attempts.length - 1].created_at;
    const tp = [...timeline].reverse().find(p => p.t === lastAttemptAt);
    const times = s.attempts
      .filter(x => typeof x.time_ms === 'number' && x.time_ms > 500)
      .map(x => Math.round((x.time_ms as number) / 100) / 10);
    const d = new Date(s.startedAt);
    const hh = d.getHours() % 12 || 12;
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
    return {
      sessionNo: s.sessionNo,
      startedAt: s.startedAt,
      timeLabel: `S${s.sessionNo} · ${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}, ${hh}:${mm} ${ampm}`,
      total: s.total,
      correct: s.correct,
      accuracy: s.accuracy,
      avgTimeSec: times.length ? Math.round((times.reduce((x, y) => x + y, 0) / times.length) * 10) / 10 : 0,
      mode: s.mode,
      masteryAfter: tp?.mastery ?? masteryScore,
    };
  });

  // Momentum: compare last-third accuracy vs first-third accuracy
  let momentum = 0;
  if (sorted.length >= 6) {
    const third = Math.floor(sorted.length / 3);
    const first = sorted.slice(0, third);
    const last = sorted.slice(-third);
    const firstAcc = first.filter(x => x.is_correct).length / first.length;
    const lastAcc = last.filter(x => x.is_correct).length / last.length;
    momentum = Math.round((lastAcc - firstAcc) * 100);
  }
  const trend: StudentAnalytics['trend'] =
    momentum >= 10 ? 'improving' : momentum <= -10 ? 'declining' : 'steady';

  const chapters = computeChapterBreakdown(attempts);
  const fluency = computeFluency(attempts);

  // Level radar (per ASER rung attempted)
  const levelMap = new Map<string, { total: number; correct: number; pathway: string }>();
  for (const a of attempts) {
    const e = levelMap.get(a.level) || { total: 0, correct: 0, pathway: a.pathway };
    e.total += 1;
    if (a.is_correct) e.correct += 1;
    levelMap.set(a.level, e);
  }
  const levelRadar: LevelRadarPoint[] = [...levelMap.entries()].map(([level, e]) => ({
    level,
    label: `${levelLabel(level)}`,
    attempts: e.total,
    accuracy: Math.round((e.correct / e.total) * 100),
  }));

  // Readiness = 70% live mastery + 30% ladder progress (verified levels)
  const ladderPts = ladderProgress(attempts);
  const readinessScore = Math.round(masteryScore * 0.7 + (ladderPts / MAX_LADDER) * 100 * 0.3);

  return {
    totalAttempts: attempts.length,
    totalCorrect,
    overallAccuracy: Math.round((totalCorrect / attempts.length) * 100),
    masteryScore,
    readinessLevel: readinessBand(readinessScore),
    momentum,
    trend,
    fluency,
    sessions: sessionStats,
    masteryTimeline: timeline,
    chapterBreakdown: chapters,
    levelRadar,
    insights: buildInsights({
      masteryScore,
      overallAccuracy: Math.round((totalCorrect / attempts.length) * 100),
      trend,
      sessions: sessionStats,
      chapters,
      fluency,
      readinessLevel: readinessBand(readinessScore),
    }),
    lastActiveAt: sorted[sorted.length - 1].created_at,
    hasData: true,
  };
}
