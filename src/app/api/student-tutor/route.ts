import { NextRequest, NextResponse } from 'next/server';
import { generateText } from '@/lib/gemini';
import { answerOffline } from '@/lib/nipun/tutorKnowledge';
import { MATHS_MELA_CHAPTERS, SANTOOR_CHAPTERS, LEVEL_TO_NCERT } from '@/lib/nipun/ncertSyllabus';

/**
 * POST /api/student-tutor
 * Body: { message: string, learner?: { name?, readingLevel?, numeracyLevel? } }
 *
 * Tries Gemini first (grounded to the NCERT Class 3 syllabus); falls back to
 * the offline NCERT tutor brain so the chatbot ALWAYS answers sensibly —
 * following the project rule that every Gemini call needs a fallback.
 */

interface TutorRequest {
  message?: string;
  learner?: {
    name?: string;
    readingLevel?: string;
    numeracyLevel?: string;
  };
}

const chapterList = [
  '📘 Maths Mela: ' + MATHS_MELA_CHAPTERS.map(c => `Ch ${c.no} ${c.name} (${c.focus})`).join('; '),
  '📖 Santoor: ' + SANTOOR_CHAPTERS.map(c => `Ch ${c.no} ${c.name} (${c.focus})`).join('; '),
].join('\n');

const NCERT_GROUNDING = `You are "Dost" 🤖, a warm, cheerful study-buddy for a Class 3 student (age 7–8) in India.

RULES:
- Answer ONLY questions about Class 3 learning: maths, English, their NCERT textbook chapters, school, or friendly chat. For anything else, gently steer back to learning.
- Use VERY simple English, short sentences, and 1-2 emojis. Sound like a kind teacher, never condescending.
- For maths sums: show tiny steps, then give the answer with celebration.
- For English stories/poems: answer from the NCERT chapter knowledge below.
- Keep answers under 90 words. Encourage the child and end with an inviting line.
- NEVER give wrong facts: rely on the syllabus knowledge below.

NCERT Class 3 SYLLABUS (the child's only textbooks):
${chapterList}

Learner's current practice levels (answer slightly below these levels to build confidence):
- Reading: ${'{readingLevel}'}
- Numeracy: ${'{numeracyLevel}'}

Chapter focus for the learner's levels:
- {readingChapters}
- {numeracyChapters}`;

function buildPrompt(message: string, learner: TutorRequest['learner']): string {
  let system = NCERT_GROUNDING
    .replace('{readingLevel}', learner?.readingLevel || 'beginner')
    .replace('{numeracyLevel}', learner?.numeracyLevel || 'beginner')
    .replace('{readingChapters}', LEVEL_TO_NCERT[learner?.readingLevel || 'letter']?.chapters || 'Santoor basics')
    .replace('{numeracyChapters}', LEVEL_TO_NCERT[learner?.numeracyLevel || 'number_1_9']?.chapters || 'Maths Mela basics');

  // Ground the reply with the offline brain's matching knowledge (if any),
  // so Gemini has verified chapter facts to lean on instead of guessing.
  const local = answerOffline(message, learner?.name);
  if (local) {
    system += `\n\nVERIFIED knowledge for this exact question (use it if relevant):\n${local.text}`;
  }

  return `${system}\n\nChild's question: "${message}"\n\nYour answer:`;
}

export async function POST(req: NextRequest) {
  try {
    const body: TutorRequest = await req.json();
    const message = (body.message || '').trim().slice(0, 500);

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const fallback = answerOffline(message, body.learner?.name);
    const prompt = buildPrompt(message, body.learner);
    const aiReply = await generateText(prompt, fallback.text);

    return NextResponse.json({
      reply: aiReply,
      source: aiReply === fallback.text ? 'offline' : 'ai',
      chips: fallback.chips,
    });
  } catch (err) {
    console.error('[PRAGYA StudentTutor] Unexpected error:', err);
    try {
      const body: TutorRequest = await req.json().catch(() => ({}));
      const fallback = answerOffline(body?.message || '', body?.learner?.name);
      return NextResponse.json({ reply: fallback.text, source: 'offline', chips: fallback.chips });
    } catch {
      return NextResponse.json({ error: 'Failed to get answer' }, { status: 500 });
    }
  }
}
