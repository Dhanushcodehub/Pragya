/**
 * Client-side attempt recorder — fire-and-forget telemetry.
 * Called on every answered question in PracticeZone and MasteryChallenge.
 */

export interface AttemptPayload {
  learnerId: string;
  pathway: 'reading' | 'numeracy';
  level: string;
  questionId: string;
  chapterNo: number;
  chapterName: string;
  subject: string;
  isCorrect: boolean;
  timeMs: number | null;
  mode: 'practice' | 'challenge';
}

export function recordAttempt(payload: AttemptPayload): void {
  try {
    fetch('/api/nipun/attempts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => { /* silent — analytics must never break the quiz */ });
  } catch {
    // Telemetry must never throw into the quiz UI.
  }
}

/** Per-question response-time stopwatch (kept outside components for render purity). */
export interface QuestionTimer {
  start(): void;
  elapsedMs(): number | null;
}

export function createQuestionTimer(): QuestionTimer {
  let startedAt: number | null = null;
  return {
    start() { startedAt = Date.now(); },
    elapsedMs() { return startedAt === null ? null : Date.now() - startedAt; },
  };
}
