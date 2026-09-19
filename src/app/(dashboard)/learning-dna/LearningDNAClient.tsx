'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Hash, ChevronDown, ChevronUp, Sparkles, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CLASSROOM_LEARNERS, getSkillStatus, type ClassroomLearner, type SkillKey } from '@/lib/nipun/classroomData';

const C = {
  cream: '#fef9f2',
  primary: '#000000',
  onPrimary: '#ffffff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f8f3ec',
  surfaceVariant: '#e6e2db',
  onSurface: '#1d1c18',
  onSurfaceVariant: '#45464d',
  outline: '#76777d',
  outlineVariant: '#c6c6cd',
  accentYellow: '#ffe24c',
  accentBlue: '#bec6e0',
  accentPurple: '#d3579a',
};

// Reading and numeracy skill rows with their evidence text
const READING_SKILLS: { key: SkillKey; label: string; description: string }[] = [
  { key: 'letter',    label: 'Letter Recognition', description: 'Identifies individual letters from a set of 10' },
  { key: 'word',      label: 'Word Reading',        description: 'Reads simple 2–3 letter words from a word card' },
  { key: 'paragraph', label: 'Paragraph Reading',   description: 'Reads Std I connected text (4 sentences, ≤2 mistakes)' },
  { key: 'story',     label: 'Story Reading',        description: 'Reads Std II story (7–10 sentences, ≤2 mistakes)' },
];

const NUMERACY_SKILLS: { key: SkillKey; label: string; description: string }[] = [
  { key: 'number_1_9',   label: 'Numbers 1–9',       description: 'Reads single-digit numbers from a number card' },
  { key: 'number_11_99', label: 'Numbers 11–99',      description: 'Reads two-digit numbers from a number card' },
  { key: 'subtraction',  label: 'Subtraction',        description: 'Solves both 2-digit subtraction with borrowing' },
  { key: 'division',     label: 'Division',            description: 'Solves 3÷1 digit division — quotient AND remainder' },
];

type SkillStatus = 'demonstrated' | 'developing' | 'needs-support' | 'not-assessed';

const STATUS_STYLE: Record<SkillStatus, { bg: string; bar: string; text: string; icon: React.ReactNode; label: string }> = {
  demonstrated:   { bg: 'bg-green-50',  bar: 'bg-green-500',  text: 'text-green-700', icon: <CheckCircle2 className="w-3.5 h-3.5" />, label: 'Demonstrated' },
  developing:     { bg: 'bg-amber-50',  bar: 'bg-amber-400',  text: 'text-amber-700', icon: <TrendingUp   className="w-3.5 h-3.5" />, label: 'Developing'   },
  'needs-support':{ bg: 'bg-red-50',    bar: 'bg-red-400',    text: 'text-red-700',   icon: <AlertCircle  className="w-3.5 h-3.5" />, label: 'Needs Support' },
  'not-assessed': { bg: 'bg-zinc-50',   bar: 'bg-zinc-300',   text: 'text-zinc-500',  icon: null,                                     label: 'Not Assessed' },
};

function getEvidence(learner: ClassroomLearner, skillKey: SkillKey): string {
  const status = getSkillStatus(learner, skillKey);
  const conf = learner.confidence[skillKey as keyof typeof learner.confidence] ?? 0;
  if (status === 'demonstrated') return `Correctly completed all required tasks. Confidence: ${conf}%.`;
  if (status === 'developing')   return `Partially demonstrated. Confidence: ${conf}%. Needs targeted practice.`;
  if (status === 'needs-support') return `Unable to complete the task at this level. Confidence: ${conf}%. Immediate support needed.`;
  return 'Not yet assessed.';
}

function getNextAction(learner: ClassroomLearner, skillKey: SkillKey): string {
  const status = getSkillStatus(learner, skillKey);
  const actionMap: Record<SkillKey, Record<string, string>> = {
    letter:       { demonstrated: 'Move to word reading activities.', developing: 'Daily letter-sound flashcard practice.', 'needs-support': 'One-on-one phonics with letter tracing.', 'not-assessed': 'Administer ASER letter recognition card.' },
    word:         { demonstrated: 'Introduce short connected sentences.', developing: 'Word blending games with CVC words.', 'needs-support': 'Revisit letter recognition before word work.', 'not-assessed': 'Administer ASER word reading card.' },
    paragraph:    { demonstrated: 'Extend to story-length text.', developing: 'Guided reading with 4-sentence passages.', 'needs-support': 'Oral fluency practice with shared reading.', 'not-assessed': 'Administer ASER Std I paragraph card.' },
    story:        { demonstrated: 'Focus on comprehension questions.', developing: 'Partner reading with Std II stories.', 'needs-support': 'Return to paragraph fluency practice.', 'not-assessed': 'Administer ASER Std II story card.' },
    number_1_9:   { demonstrated: 'Move to 2-digit number recognition.', developing: 'Number tracing and counting games 1–9.', 'needs-support': 'One-on-one with number recognition card.', 'not-assessed': 'Administer ASER number card 1–9.' },
    number_11_99: { demonstrated: 'Introduce place value and subtraction.', developing: 'Skip counting and number line activities 11–99.', 'needs-support': 'Revisit single-digit numbers first.', 'not-assessed': 'Administer ASER number card 11–99.' },
    subtraction:  { demonstrated: 'Introduce 3÷1 division with remainder.', developing: 'Visual regrouping with place value blocks.', 'needs-support': 'Concrete subtraction without borrowing first.', 'not-assessed': 'Administer ASER subtraction card.' },
    division:     { demonstrated: 'Advanced: multi-step word problems.', developing: 'Division with remainder using grouping model.', 'needs-support': 'Revisit multiplication and subtraction link.', 'not-assessed': 'Administer ASER division card.' },
  };
  return actionMap[skillKey]?.[status] ?? 'Assess this skill first.';
}

// ── Skill Row Component ───────────────────────────────────────────────────────
function SkillRow({
  learner, skillKey, label, description,
}: {
  learner: ClassroomLearner;
  skillKey: SkillKey;
  label: string;
  description: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const status = getSkillStatus(learner, skillKey);
  const conf = learner.confidence[skillKey as keyof typeof learner.confidence] ?? 0;
  const s = STATUS_STYLE[status];

  return (
    <div className={`rounded-2xl border transition-all ${expanded ? 'shadow-sm' : ''}`} style={{ borderColor: C.outlineVariant, backgroundColor: C.surfaceContainerLowest }}>
      <div
        className="flex items-center gap-4 p-4 cursor-pointer select-none"
        onClick={() => setExpanded(e => !e)}
      >
        {/* Status icon + label */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shrink-0 ${s.bg} ${s.text}`}>
          {s.icon}
          {s.label}
        </div>

        {/* Skill name */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-extrabold text-zinc-900 leading-tight">{label}</div>
          <div className="text-[11px] mt-0.5" style={{ color: C.outline }}>{description}</div>
        </div>

        {/* Bar + Confidence */}
        <div className="flex items-center gap-3 shrink-0 w-36">
          <div className="flex-1 h-2 rounded-full bg-zinc-100 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${conf}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={`h-full rounded-full ${s.bar}`}
            />
          </div>
          <span className="text-xs font-bold w-8 text-right" style={{ color: C.outline }}>
            {conf > 0 ? `${conf}%` : '—'}
          </span>
        </div>

        {/* WHY chevron */}
        <button className="ml-1 flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 rounded-lg transition-colors hover:bg-zinc-100" style={{ color: '#5a6ba8' }}>
          WHY? {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* WHY Panel */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ borderColor: C.surfaceVariant }}>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider mb-1.5" style={{ color: C.outline }}>Evidence</p>
                <p className="text-xs leading-relaxed font-medium" style={{ color: C.onSurface }}>
                  {getEvidence(learner, skillKey)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider mb-1.5" style={{ color: C.outline }}>Next Recommended Action</p>
                <p className="text-xs leading-relaxed font-medium" style={{ color: C.onSurface }}>
                  {getNextAction(learner, skillKey)}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function LearningDNAClient() {
  const learners = [...CLASSROOM_LEARNERS].sort((a, b) => a.name.localeCompare(b.name));
  const [selectedId, setSelectedId] = useState<string>(learners[0].id);
  const learner = learners.find(l => l.id === selectedId) ?? learners[0];
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const statusBadge =
    learner.status === 'secure'
      ? { label: 'Secure', cls: 'bg-green-100 text-green-700' }
      : learner.status === 'developing'
      ? { label: 'Developing', cls: 'bg-amber-100 text-amber-700' }
      : { label: 'Needs Support', cls: 'bg-red-100 text-red-700' };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="space-y-2 pb-6 border-b"
        style={{ borderColor: C.surfaceVariant }}
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-black" style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}>
          Learning <span style={{ color: '#d3579a' }}>DNA</span>
        </h1>
        <p className="text-sm font-medium max-w-2xl" style={{ color: C.onSurfaceVariant }}>
          Multidimensional skill profile per learner — ASER-inspired. Click WHY? on any skill to view evidence and the next recommended action.
        </p>
      </motion.div>

      {/* Learner Selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.06 }}
        className="relative w-full max-w-sm"
      >
        <button
          onClick={() => setDropdownOpen(o => !o)}
          className="w-full flex items-center justify-between gap-3 px-5 py-3.5 rounded-2xl border text-sm font-bold transition-all shadow-sm hover:shadow-md"
          style={{ backgroundColor: C.surfaceContainerLowest, borderColor: C.outlineVariant, color: C.onSurface }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full overflow-hidden border shrink-0" style={{ borderColor: C.outlineVariant }}>
              <img src={learner.avatar} alt={learner.name} className="w-full h-full object-cover" />
            </div>
            <span className="truncate">{learner.name}</span>
          </div>
          <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} style={{ color: C.outline }} />
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute top-full left-0 right-0 mt-2 rounded-2xl border shadow-xl overflow-hidden z-20"
              style={{ backgroundColor: C.surfaceContainerLowest, borderColor: C.outlineVariant }}
            >
              <div className="max-h-64 overflow-y-auto py-2">
                {learners.map(l => (
                  <button
                    key={l.id}
                    onClick={() => { setSelectedId(l.id); setDropdownOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors text-left ${
                      l.id === selectedId ? 'bg-zinc-100' : 'hover:bg-zinc-50'
                    }`}
                    style={{ color: C.onSurface }}
                  >
                    <div className="w-7 h-7 rounded-full overflow-hidden border shrink-0" style={{ borderColor: C.outlineVariant }}>
                      <img src={l.avatar} alt={l.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="flex-1 truncate">{l.name}</span>
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      l.status === 'secure' ? 'bg-green-100 text-green-700' : l.status === 'developing' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {l.status.replace('-', ' ')}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Learner Identity Card */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={learner.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          className="rounded-3xl border p-6 flex items-center gap-6 shadow-sm"
          style={{ backgroundColor: C.surfaceContainerLowest, borderColor: C.surfaceVariant }}
        >
          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 shrink-0" style={{ borderColor: C.surfaceVariant }}>
            <img src={learner.avatar} alt={learner.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-extrabold text-zinc-900 leading-tight" style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}>
              {learner.name}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className={`px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-full ${statusBadge.cls}`}>
                {statusBadge.label}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full border" style={{ borderColor: C.outlineVariant, color: C.onSurfaceVariant }}>
                Reading: <strong className="text-zinc-900">{learner.readingLevel.replace('_', ' ')}</strong>
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full border" style={{ borderColor: C.outlineVariant, color: C.onSurfaceVariant }}>
                Math: <strong className="text-zinc-900">{learner.numeracyLevel.replace(/_/g, ' ')}</strong>
              </span>
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: C.outline }}>
              <Sparkles className="w-3.5 h-3.5" style={{ color: '#d3579a' }} /> AI Profile
            </div>
            <p className="text-[11px] text-right max-w-[200px] leading-relaxed" style={{ color: C.onSurfaceVariant }}>
              {learner.status === 'secure'
                ? 'Performing at grade level. Candidate for peer-teacher role.'
                : learner.status === 'developing'
                ? 'Near grade level. Targeted practice will accelerate progress.'
                : 'Below grade level. Priority for one-on-one intervention.'}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Reading Skills Section */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`reading-${learner.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <h3 className="text-base font-extrabold uppercase tracking-wider text-blue-700">Reading Skills</h3>
          </div>
          {READING_SKILLS.map((skill, i) => (
            <motion.div
              key={skill.key}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26, delay: i * 0.04 }}
            >
              <SkillRow learner={learner} skillKey={skill.key} label={skill.label} description={skill.description} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Numeracy Skills Section */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`numeracy-${learner.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, delay: 0.08 }}
          className="space-y-3 pb-12"
        >
          <div className="flex items-center gap-2 mb-1">
            <Hash className="w-5 h-5 text-purple-500" />
            <h3 className="text-base font-extrabold uppercase tracking-wider text-purple-700">Numeracy Skills</h3>
          </div>
          {NUMERACY_SKILLS.map((skill, i) => (
            <motion.div
              key={skill.key}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26, delay: 0.08 + i * 0.04 }}
            >
              <SkillRow learner={learner} skillKey={skill.key} label={skill.label} description={skill.description} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
