import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { computeStudentAnalytics, PracticeAttemptRecord } from '@/lib/nipun/attemptAnalytics';

export const dynamic = 'force-dynamic';

/**
 * POST /api/nipun/attempts
 * Record one answered practice/challenge question.
 * Body: {
 *   learnerId, pathway ('reading'|'numeracy'), level, questionId,
 *   chapterNo, chapterName, subject, isCorrect, timeMs, mode ('practice'|'challenge')
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      learnerId, pathway, level, questionId, chapterNo, chapterName,
      subject, isCorrect, timeMs, mode,
    } = body || {};

    if (!learnerId || !pathway || !level || !questionId || chapterNo === undefined || isCorrect === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createClient();
    const record = {
      learner_id: learnerId,
      pathway: pathway === 'numeracy' ? 'numeracy' : 'reading',
      level,
      question_id: questionId,
      chapter_no: chapterNo,
      chapter_name: chapterName,
      subject,
      is_correct: Boolean(isCorrect),
      time_ms: typeof timeMs === 'number' ? Math.min(Math.round(timeMs), 600000) : null,
      mode: mode === 'challenge' ? 'challenge' : 'practice',
    };

    // Safe client falls back to the local mock DB when live tables are absent.
    const { data, error } = await supabase
      .from('pragya_practice_attempts')
      .insert(record)
      .select();

    if (error) {
      console.error('[PRAGYA Attempts] Insert failed:', error.message);
      return NextResponse.json({ error: 'Failed to record attempt' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, attempt: data?.[0] || null });
  } catch (err) {
    console.error('[PRAGYA Attempts] Unexpected error:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}

/**
 * GET /api/nipun/attempts?learnerId=<uuid>
 * Returns computed real-time analytics for the learner's practice attempts.
 */
export async function GET(req: NextRequest) {
  try {
    const learnerId = req.nextUrl.searchParams.get('learnerId');
    if (!learnerId) {
      return NextResponse.json({ error: 'learnerId is required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('pragya_practice_attempts')
      .select('*')
      .eq('learner_id', learnerId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[PRAGYA Attempts] Fetch failed:', error.message);
      return NextResponse.json({ error: 'Failed to load attempts' }, { status: 500 });
    }

    const analytics = computeStudentAnalytics((data || []) as unknown as PracticeAttemptRecord[]);
    return NextResponse.json({ analytics });
  } catch (err) {
    console.error('[PRAGYA Attempts] Unexpected error:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
