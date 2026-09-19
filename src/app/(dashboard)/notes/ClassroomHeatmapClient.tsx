'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Hash, X, TrendingUp, ChevronDown } from 'lucide-react';
import {
  CLASSROOM_LEARNERS,
  SKILL_COLUMNS,
  getSkillStatus,
  type ClassroomLearner,
  type SkillKey,
} from '@/lib/nipun/classroomData';

// ── Colour helpers ────────────────────────────────────────────────────────────
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

type CellStatus = 'demonstrated' | 'developing' | 'needs-support' | 'not-assessed';

const CELL_STYLES: Record<CellStatus, { bg: string; dot: string; label: string }> = {
  demonstrated: { bg: 'bg-green-100',  dot: 'bg-green-500',  label: 'Demonstrated' },
  developing:   { bg: 'bg-amber-100',  dot: 'bg-amber-400',  label: 'Developing'   },
  'needs-support': { bg: 'bg-red-100', dot: 'bg-red-400',    label: 'Needs Support' },
  'not-assessed': { bg: 'bg-zinc-100', dot: 'bg-zinc-300',   label: 'Not Assessed' },
};

// ── Legend ────────────────────────────────────────────────────────────────────
function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
      {(Object.entries(CELL_STYLES) as [CellStatus, typeof CELL_STYLES[CellStatus]][]).map(([status, s]) => (
        <div key={status} className="flex items-center gap-1.5">
          <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
          <span style={{ color: C.onSurfaceVariant }}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Heatmap cell ─────────────────────────────────────────────────────────────
function HeatCell({ status, confidence }: { status: CellStatus; confidence?: number }) {
  const s = CELL_STYLES[status];
  return (
    <div
      className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.bg} group-hover:scale-110 transition-transform`}
      title={`${s.label}${confidence !== undefined ? ` (${confidence}%)` : ''}`}
    >
      <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
    </div>
  );
}

// ── Student detail modal ──────────────────────────────────────────────────────
function StudentModal({
  learner,
  onClose,
}: {
  learner: ClassroomLearner;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl border max-w-lg w-full overflow-hidden"
          style={{ borderColor: C.surfaceVariant }}
        >
          {/* Header */}
          <div className="p-6 border-b flex items-center gap-4 bg-zinc-50/60" style={{ borderColor: C.surfaceVariant }}>
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-sm bg-zinc-100 shrink-0">
              <img src={learner.avatar} alt={learner.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-extrabold text-black" style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}>
                {learner.name}
              </h2>
              <span
                className={`inline-block mt-1 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full ${
                  learner.status === 'secure'
                    ? 'bg-green-100 text-green-700'
                    : learner.status === 'developing'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {learner.status.replace('-', ' ')}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white border hover:bg-zinc-50 transition"
              style={{ borderColor: C.outlineVariant }}
            >
              <X className="w-4 h-4 text-zinc-500" />
            </button>
          </div>

          {/* Skill Bars */}
          <div className="p-6 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700">Reading Skills</span>
              </div>
              <div className="space-y-2">
                {(['letter', 'word', 'paragraph', 'story'] as SkillKey[]).map((sk) => {
                  const status = getSkillStatus(learner, sk);
                  const conf = learner.confidence[sk as keyof typeof learner.confidence] ?? 0;
                  const labelMap = { letter: 'Letter', word: 'Word', paragraph: 'Paragraph', story: 'Story' };
                  const colorMap = {
                    demonstrated: 'bg-green-400',
                    developing: 'bg-amber-400',
                    'needs-support': 'bg-red-400',
                    'not-assessed': 'bg-zinc-200',
                  };
                  return (
                    <div key={sk} className="flex items-center gap-3">
                      <span className="text-xs font-semibold w-20 shrink-0" style={{ color: C.onSurfaceVariant }}>
                        {labelMap[sk as keyof typeof labelMap]}
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-zinc-100 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${conf}%` }}
                          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                          className={`h-full rounded-full ${colorMap[status]}`}
                        />
                      </div>
                      <span className="text-[10px] font-bold w-8 text-right" style={{ color: C.outline }}>
                        {conf > 0 ? `${conf}%` : '—'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Hash className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700">Numeracy Skills</span>
              </div>
              <div className="space-y-2">
                {(['number_1_9', 'number_11_99', 'subtraction', 'division'] as SkillKey[]).map((sk) => {
                  const status = getSkillStatus(learner, sk);
                  const conf = learner.confidence[sk as keyof typeof learner.confidence] ?? 0;
                  const labelMap = { number_1_9: 'Num 1–9', number_11_99: 'Num 11–99', subtraction: 'Subtraction', division: 'Division' };
                  const colorMap = {
                    demonstrated: 'bg-green-400',
                    developing: 'bg-amber-400',
                    'needs-support': 'bg-red-400',
                    'not-assessed': 'bg-zinc-200',
                  };
                  return (
                    <div key={sk} className="flex items-center gap-3">
                      <span className="text-xs font-semibold w-20 shrink-0" style={{ color: C.onSurfaceVariant }}>
                        {labelMap[sk as keyof typeof labelMap]}
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-zinc-100 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${conf}%` }}
                          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
                          className={`h-full rounded-full ${colorMap[status]}`}
                        />
                      </div>
                      <span className="text-[10px] font-bold w-8 text-right" style={{ color: C.outline }}>
                        {conf > 0 ? `${conf}%` : '—'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Tip */}
            <div className="rounded-2xl p-4 border" style={{ backgroundColor: `${C.accentYellow}20`, borderColor: `${C.accentYellow}60` }}>
              <p className="text-xs font-extrabold uppercase tracking-wider text-zinc-700 mb-1 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" /> AI Recommendation
              </p>
              <p className="text-xs font-medium" style={{ color: C.onSurface }}>
                {learner.status === 'secure'
                  ? 'Advanced extension activities recommended. Consider peer-teaching role.'
                  : learner.status === 'developing'
                  ? `Focus on ${learner.readingLevel === 'paragraph' ? 'connected-text fluency' : 'word blending'} and ${learner.numeracyLevel === 'subtraction' ? 'borrowing with regrouping' : '2-digit number recognition'}.`
                  : 'Schedule one-on-one phonics and number recognition session.'}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ClassroomHeatmapClient() {
  const [selectedSkill, setSelectedSkill] = useState<SkillKey | null>(null);
  const [selectedLearner, setSelectedLearner] = useState<ClassroomLearner | null>(null);

  const learners = [...CLASSROOM_LEARNERS].sort((a, b) => a.name.localeCompare(b.name));

  const filtered = selectedSkill
    ? learners.filter((l) => getSkillStatus(l, selectedSkill) !== 'demonstrated')
    : learners;

  // Summary counts per skill column
  const skillStats = SKILL_COLUMNS.map((col) => {
    const total = learners.length;
    const demonstrated = learners.filter((l) => getSkillStatus(l, col.key) === 'demonstrated').length;
    const needsSupport = learners.filter((l) => getSkillStatus(l, col.key) === 'needs-support').length;
    return { ...col, demonstrated, needsSupport, total };
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2 pb-6 border-b" style={{ borderColor: C.surfaceVariant }}>
        <div className="flex items-center justify-between">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-black" style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}>
            Classroom <span style={{ color: '#5a6ba8' }}>Learning Map</span>
          </h1>
          {selectedSkill && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setSelectedSkill(null)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold transition-all hover:bg-zinc-100"
              style={{ borderColor: C.outlineVariant, color: C.onSurfaceVariant }}
            >
              <X className="w-3.5 h-3.5" /> Clear filter
            </motion.button>
          )}
        </div>
        <p className="text-sm font-medium max-w-2xl" style={{ color: C.onSurfaceVariant }}>
          Class 5A · {learners.length} learners · ASER-inspired skill map across 8 foundational skills.
          Click a column to filter by skill. Click a learner row to view full profile.
        </p>
        <Legend />
      </div>

      {/* Skill Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {skillStats.map((col) => (
          <motion.button
            key={col.key}
            whileHover={{ y: -2, transition: { type: 'spring', stiffness: 400, damping: 26 } }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelectedSkill(selectedSkill === col.key ? null : col.key)}
            className={`rounded-2xl p-3 text-left border transition-all ${
              selectedSkill === col.key
                ? 'border-black bg-black text-white shadow-lg'
                : 'border-zinc-200 bg-white hover:border-zinc-400'
            }`}
          >
            <div className={`text-[10px] font-extrabold uppercase tracking-wider mb-1 ${
              col.domain === 'reading' ? (selectedSkill === col.key ? 'text-blue-300' : 'text-blue-600') : (selectedSkill === col.key ? 'text-purple-300' : 'text-purple-600')
            }`}>
              {col.domain === 'reading' ? '📖' : '🔢'} {col.domain}
            </div>
            <div className={`text-sm font-extrabold leading-tight ${selectedSkill === col.key ? 'text-white' : 'text-zinc-900'}`}>
              {col.label}
            </div>
            <div className={`text-[10px] font-semibold mt-1.5 ${selectedSkill === col.key ? 'text-zinc-300' : 'text-zinc-500'}`}>
              {col.demonstrated}/{col.total} ✓
            </div>
          </motion.button>
        ))}
      </div>

      {/* Heatmap Grid */}
      <div className="rounded-3xl border overflow-hidden shadow-sm" style={{ borderColor: C.surfaceVariant, backgroundColor: C.surfaceContainerLowest }}>
        {/* Column Headers */}
        <div className="sticky top-0 z-10 bg-zinc-50/95 backdrop-blur-sm border-b" style={{ borderColor: C.surfaceVariant }}>
          <div className="flex items-center">
            <div className="w-44 shrink-0 p-4 text-xs font-extrabold uppercase tracking-wider" style={{ color: C.outline }}>
              Learner
            </div>
            {/* Reading columns */}
            <div className="flex border-l" style={{ borderColor: C.outlineVariant }}>
              {SKILL_COLUMNS.filter(c => c.domain === 'reading').map((col) => (
                <div
                  key={col.key}
                  className={`w-16 p-2 text-center cursor-pointer transition-colors ${
                    selectedSkill === col.key ? 'bg-black text-white' : 'hover:bg-blue-50'
                  }`}
                  onClick={() => setSelectedSkill(selectedSkill === col.key ? null : col.key)}
                >
                  <div className={`text-[9px] font-extrabold uppercase tracking-wider ${selectedSkill === col.key ? 'text-blue-300' : 'text-blue-600'}`}>📖</div>
                  <div className={`text-[10px] font-bold leading-tight mt-0.5 ${selectedSkill === col.key ? 'text-white' : 'text-zinc-800'}`}>
                    {col.label}
                  </div>
                </div>
              ))}
            </div>
            {/* Numeracy columns */}
            <div className="flex border-l" style={{ borderColor: C.outlineVariant }}>
              {SKILL_COLUMNS.filter(c => c.domain === 'numeracy').map((col) => (
                <div
                  key={col.key}
                  className={`w-16 p-2 text-center cursor-pointer transition-colors ${
                    selectedSkill === col.key ? 'bg-black text-white' : 'hover:bg-purple-50'
                  }`}
                  onClick={() => setSelectedSkill(selectedSkill === col.key ? null : col.key)}
                >
                  <div className={`text-[9px] font-extrabold uppercase tracking-wider ${selectedSkill === col.key ? 'text-purple-300' : 'text-purple-600'}`}>🔢</div>
                  <div className={`text-[10px] font-bold leading-tight mt-0.5 ${selectedSkill === col.key ? 'text-white' : 'text-zinc-800'}`}>
                    {col.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rows */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={selectedSkill ?? 'all'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {filtered.map((learner, idx) => (
              <motion.div
                key={learner.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 26, delay: idx * 0.025 }}
                onClick={() => setSelectedLearner(learner)}
                className="group flex items-center border-b cursor-pointer hover:bg-zinc-50/80 transition-colors"
                style={{ borderColor: C.surfaceVariant }}
              >
                {/* Learner name + avatar */}
                <div className="w-44 shrink-0 p-3 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden border shrink-0" style={{ borderColor: C.outlineVariant }}>
                    <img src={learner.avatar} alt={learner.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs font-bold text-zinc-800 truncate group-hover:text-black">
                    {learner.name.split(' ')[0]}
                  </span>
                </div>

                {/* Reading cells */}
                <div className="flex border-l gap-1 px-2 items-center" style={{ borderColor: C.outlineVariant }}>
                  {SKILL_COLUMNS.filter(c => c.domain === 'reading').map((col) => (
                    <div key={col.key} className="w-16 flex justify-center py-2">
                      <HeatCell
                        status={getSkillStatus(learner, col.key)}
                        confidence={learner.confidence[col.key as keyof typeof learner.confidence] as number | undefined}
                      />
                    </div>
                  ))}
                </div>

                {/* Numeracy cells */}
                <div className="flex border-l gap-1 px-2 items-center" style={{ borderColor: C.outlineVariant }}>
                  {SKILL_COLUMNS.filter(c => c.domain === 'numeracy').map((col) => (
                    <div key={col.key} className="w-16 flex justify-center py-2">
                      <HeatCell
                        status={getSkillStatus(learner, col.key)}
                        confidence={learner.confidence[col.key as keyof typeof learner.confidence] as number | undefined}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="p-12 text-center text-sm font-medium" style={{ color: C.outline }}>
                No learners match this skill filter.
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Learner modal */}
      {selectedLearner && (
        <StudentModal learner={selectedLearner} onClose={() => setSelectedLearner(null)} />
      )}
    </div>
  );
}
