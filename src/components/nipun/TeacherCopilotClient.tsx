'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Loader2, ArrowDown, Users, BookOpen, Zap } from 'lucide-react';
import { CLASSROOM_LEARNERS, buildInstructionalGroups, READING_ORDER, NUMERACY_ORDER } from '@/lib/nipun/classroomData';

const C = {
  cream: '#fef9f2',
  primary: '#000000',
  onPrimary: '#ffffff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f8f3ec',
  surfaceContainer: '#f2ede6',
  surfaceContainerHigh: '#ece7e1',
  surfaceVariant: '#e6e2db',
  onSurface: '#1d1c18',
  onSurfaceVariant: '#45464d',
  outline: '#76777d',
  outlineVariant: '#c6c6cd',
  accentYellow: '#ffe24c',
  accentBlue: '#bec6e0',
  accentPink: '#ffafd3',
  accentGreen: '#86efac',
  accentPurple: '#d3579a',
};

// Build classroom context string for the AI
function buildClassroomContext(): string {
  const learners = CLASSROOM_LEARNERS;
  const groups = buildInstructionalGroups(learners);

  const readingDist = READING_ORDER.map(lvl => ({
    level: lvl,
    count: learners.filter(l => l.readingLevel === lvl).length,
  }));
  const numeracyDist = NUMERACY_ORDER.map(lvl => ({
    level: lvl,
    count: learners.filter(l => l.numeracyLevel === lvl).length,
  }));

  const groupSummary = groups
    .filter(g => g.learners.length > 0)
    .map(g => `  - ${g.name}: ${g.learners.length} learners — Focus: ${g.focus}`)
    .join('\n');

  return `
CLASSROOM: Class 5A (${learners.length} learners total)

READING LEVEL DISTRIBUTION:
${readingDist.map(d => `  - ${d.level}: ${d.count} learners`).join('\n')}

NUMERACY LEVEL DISTRIBUTION:
${numeracyDist.map(d => `  - ${d.level}: ${d.count} learners`).join('\n')}

INSTRUCTIONAL GROUPS (by ASER-aligned instructional need):
${groupSummary}

PRIORITY BOTTLENECK: Most learners are at "word" reading level and "subtraction" math level.
NOTE: This is an ASER-inspired assessment — not an official ASER product.
  `.trim();
}

const PROMPT_CHIPS = [
  { label: 'Group B activity',      prompt: 'What should I teach Group B (Word Builders) tomorrow?',                icon: Users },
  { label: 'Priority skill today',  prompt: 'What is the highest-priority skill to address in class today?',        icon: BookOpen },
  { label: 'Group C plan',          prompt: 'Create a 20-minute lesson plan for Group C (Connected Readers).',      icon: Zap },
  { label: 'Whole-class activity',  prompt: 'Suggest a whole-class activity that benefits all 4 groups at once.',   icon: Sparkles },
];

type Message = { id: string; role: 'user' | 'assistant'; content: string };

// Deterministic fallback when Gemini API is unavailable
function getFallbackResponse(prompt: string): string {
  const p = prompt.toLowerCase();

  if (p.includes('group b') || p.includes('word builder')) {
    return `**Group B — Word Builders (5 learners)**

**Primary Need:** Transition from individual letter recognition to blending sounds into words.

**15-Minute Activity:**
1. Show word cards one at a time (CVC words: "bat", "sit", "cup").
2. Ask each child to blend the sounds aloud.
3. Have them point to the matching picture card.
4. Repeat with 5 new words.
5. Quick oral quiz: "What word is this?" (teacher taps letters).

**Follow-up Check:** After 3 sessions, re-administer the ASER word card. Pass threshold: 4/5 words correct.`;
  }

  if (p.includes('priority') || p.includes('today')) {
    return `**Today's Priority: Word Reading → Paragraph Transition**

7 learners are at "word" level and struggling to move to connected-text reading.

**Recommended Focus:**
- Group C (Connected Readers) — Start with a 4-sentence Std I passage.
- Read it aloud together first, then ask individual students to re-read one sentence each.
- Allow ≤2 mistakes before providing the correct reading.

**Why this matters:** The paragraph-level bottleneck affects 35% of your class. Resolving it unlocks story-level fluency for most.`;
  }

  if (p.includes('group c') || p.includes('connected')) {
    return `**Group C — Connected Readers (8 learners)**

**20-Minute Lesson Plan:**

**Minutes 1–5:** Warm-up
- Read two key vocabulary words from the passage aloud together.

**Minutes 6–15:** Shared Reading
- Display the Std I passage on the board.
- Teacher reads once fluently.
- Each student reads one sentence (rotating).
- Correct errors immediately, gently.

**Minutes 16–20:** Comprehension Check
- Ask 2 questions: "Who is in the story?" and "What happens at the end?"
- Students answer orally — no writing required.

**Reassessment:** After 3 sessions, administer the ASER paragraph card. Target: ≤2 mistakes.`;
  }

  if (p.includes('whole') || p.includes('all group')) {
    return `**Whole-Class Activity: "Reading Chain"**

Works for all 4 groups simultaneously (15 min):

1. **Beginners/Letters (Group A):** Point to a letter on the board.
2. **Word level (Group B):** Say a word that starts with that letter.
3. **Paragraph level (Group C):** Use that word in a sentence.
4. **Story level (Group D):** Extend the sentence into two connected sentences.

Each group contributes at their level. No child is excluded or ranked. The activity naturally reveals which children are ready to advance.`;
  }

  return `**Teacher Copilot Response**

Based on your Class 5A profile:
- 4 learners need phonics support (Group A)
- 5 learners are building word recognition (Group B)
- 8 learners are working toward connected-text reading (Group C)
- 7 learners are at story level with strong numeracy (Group D)

**Recommendation:** Focus your next session on Group C (Connected Readers). They represent the largest instructional gap and will see the fastest movement with targeted Std I passage practice.

Ask me about a specific group or skill for a detailed activity plan.`;
}

export default function TeacherCopilotClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setShowScroll(el.scrollHeight - el.scrollTop - el.clientHeight > 120);
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const handleSend = async (text?: string) => {
    const message = (text ?? input).trim();
    if (!message || isLoading) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: message };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const classroomCtx = buildClassroomContext();
      const systemPrompt = `You are a context-aware Teacher Copilot for a primary school teacher using NIPUN Intelligence (ASER-inspired foundational learning platform).
      
You know the following about the teacher's classroom:
${classroomCtx}

You MUST:
- Always reference specific groups (Group A/B/C/D) and their ASER levels
- Provide concrete, time-bounded activities (e.g. "15 minutes")
- Never recommend ranking students or showing individual scores
- Keep language teacher-friendly, no jargon
- Always include a reassessment suggestion
- Use markdown formatting (**bold**, numbered lists)

The teacher asked: ${message}`;

      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: systemPrompt }),
      });

      if (!response.ok) throw new Error('API unavailable');

      const data = await response.json();
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: data.text ?? getFallbackResponse(message) }]);
    } catch {
      // Graceful fallback — always returns something useful
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: getFallbackResponse(message) }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const renderMessage = (msg: Message) => {
    const isUser = msg.role === 'user';
    // Simple markdown renderer: **bold**, numbered lists
    const formatted = msg.content
      .split('\n')
      .map((line, i) => {
        const boldLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return <p key={i} className={line === '' ? 'h-2' : 'leading-relaxed'} dangerouslySetInnerHTML={{ __html: boldLine }} />;
      });

    return (
      <motion.div
        key={msg.id}
        initial={{ opacity: 0, y: 8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        {!isUser && (
          <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mr-3 mt-1" style={{ background: 'linear-gradient(135deg, #bec6e0 0%, #7c839b 100%)' }}>
            <Sparkles className="h-4 w-4 text-white" />
          </div>
        )}
        <div
          className="max-w-[78%] px-5 py-3.5 rounded-2xl text-sm space-y-1"
          style={isUser
            ? { backgroundColor: C.primary, color: C.onPrimary, borderBottomRightRadius: '6px' }
            : { backgroundColor: C.surfaceContainerLowest, color: C.onSurface, border: `1px solid ${C.surfaceVariant}`, borderBottomLeftRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        >
          {formatted}
        </div>
        {isUser && (
          <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ml-3 mt-1 font-bold text-xs" style={{ backgroundColor: `${C.accentBlue}40`, color: '#5a6ba8' }}>
            T
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full relative z-10">
      {/* Top Bar */}
      <div className="px-6 py-4 border-b flex items-center justify-between shrink-0 bg-white/60 backdrop-blur-xl" style={{ borderColor: C.surfaceVariant }}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #bec6e0 0%, #7c839b 100%)' }}>
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight leading-tight" style={{ color: C.primary, fontFamily: 'var(--font-jakarta), sans-serif' }}>
              Teacher <span style={{ color: '#5a6ba8' }}>Copilot</span>
            </h1>
            <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: C.outline }}>
              Class 5A · {CLASSROOM_LEARNERS.length} learners · ASER-inspired
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-8 md:px-10 scroll-smooth">
          <div className="w-full flex flex-col min-h-full">
            {messages.length === 0 && !isLoading ? (
              /* Empty state */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col items-center justify-center py-16 px-4"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  className="h-20 w-20 rounded-3xl flex items-center justify-center mb-6 shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #bec6e0 0%, #7c839b 50%, #d3579a 100%)' }}
                >
                  <Sparkles className="h-10 w-10 text-white" />
                </motion.div>
                <h2 className="text-2xl font-extrabold text-center mb-2" style={{ color: C.primary, fontFamily: 'var(--font-jakarta), sans-serif' }}>
                  Teacher Copilot
                </h2>
                <p className="text-sm text-center max-w-sm mb-10" style={{ color: C.onSurfaceVariant }}>
                  Context-aware AI that knows your class — groups, skill gaps, and ASER levels. Ask anything about tomorrow's lesson.
                </p>
                {/* Prompt chips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                  {PROMPT_CHIPS.map((chip, i) => {
                    const Icon = chip.icon;
                    return (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 26, delay: 0.06 + i * 0.04 }}
                        whileHover={{ scale: 1.02, y: -2, transition: { type: 'spring', stiffness: 400, damping: 26 } }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleSend(chip.prompt)}
                        className="group text-left p-4 rounded-2xl border transition-all hover:shadow-md"
                        style={{ backgroundColor: C.surfaceContainerLowest, borderColor: C.surfaceVariant }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#5a6ba8'; e.currentTarget.style.backgroundColor = `${C.accentBlue}15`; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.surfaceVariant; e.currentTarget.style.backgroundColor = C.surfaceContainerLowest; }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${C.accentBlue}30` }}>
                            <Icon className="h-4 w-4" style={{ color: '#5a6ba8' }} />
                          </div>
                          <div>
                            <span className="text-sm font-bold block" style={{ color: C.onSurface }}>{chip.label}</span>
                            <span className="text-xs mt-0.5 block" style={{ color: C.outline }}>{chip.prompt}</span>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col w-full pb-4 flex-1 justify-end">
                {messages.map(renderMessage)}
                {isLoading && (
                  <div className="flex justify-start mb-4">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mr-3 mt-1" style={{ background: 'linear-gradient(135deg, #bec6e0 0%, #7c839b 100%)' }}>
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div className="px-5 py-4 rounded-2xl border" style={{ backgroundColor: C.surfaceContainerLowest, borderColor: C.surfaceVariant, borderBottomLeftRadius: '6px' }}>
                      <div className="flex items-center gap-1.5">
                        {[0, 150, 300].map(delay => (
                          <div key={delay} className="h-2 w-2 rounded-full animate-bounce" style={{ backgroundColor: C.outline, animationDelay: `${delay}ms` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-4" />
              </div>
            )}
          </div>
        </div>

        {/* Scroll to bottom */}
        {showScroll && (
          <button
            onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="absolute bottom-28 right-8 h-10 w-10 rounded-full border shadow-md flex items-center justify-center bg-white hover:shadow-lg transition-all z-20"
            style={{ borderColor: C.outlineVariant }}
          >
            <ArrowDown className="h-5 w-5" style={{ color: C.onSurfaceVariant }} />
          </button>
        )}

        {/* Input */}
        <div className="px-6 py-5 md:px-10 border-t bg-white/80 backdrop-blur-xl shrink-0" style={{ borderColor: C.surfaceVariant }}>
          <div className="w-full flex items-center gap-4">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="Ask about a group, skill gap, or tomorrow's lesson…"
              disabled={isLoading}
              className="flex-1 px-5 py-4 rounded-xl border text-sm outline-none transition-all placeholder:text-gray-400 disabled:opacity-50 shadow-sm"
              style={{ backgroundColor: C.surfaceContainerLowest, borderColor: C.surfaceVariant, color: C.onSurface }}
              onFocus={e => { e.currentTarget.style.borderColor = '#5a6ba8'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(90,107,168,0.12)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = C.surfaceVariant; e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'; }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="h-14 w-14 rounded-xl flex items-center justify-center transition-all shrink-0 disabled:opacity-40 shadow-sm"
              style={{ backgroundColor: input.trim() && !isLoading ? C.primary : C.surfaceContainerHigh, color: input.trim() && !isLoading ? C.onPrimary : C.outline }}
            >
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
