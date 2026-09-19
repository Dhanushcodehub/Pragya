'use client';
import React, { useState, useEffect } from 'react';
import type { PragyaLearner } from '@/lib/types';
import { BookOpen, Hash, Filter, X, Star, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import StudentLiveAnalytics from './StudentLiveAnalytics';

// Stagger container: children animate in sequence
const gridVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
  exit: {
    transition: { staggerChildren: 0.02, staggerDirection: -1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 280, damping: 26 },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.96,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
};

const getStatusBadgeStyle = (status: string) => {
  switch(status) {
    case 'secure': return 'bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]';
    case 'developing': return 'bg-[#fef9c3] text-[#854d0e] border-[#fef08a]';
    case 'needs-support': return 'bg-[#ffe8d6] text-[#c2410c] border-[#fed7aa]';
    default: return 'bg-zinc-100 text-zinc-600 border-zinc-200';
  }
};

const getStatusBg = (status: string) => {
  switch(status) {
    case 'secure': return 'from-green-50 to-emerald-50 border-green-200';
    case 'developing': return 'from-yellow-50 to-amber-50 border-yellow-200';
    case 'needs-support': return 'from-orange-50 to-red-50 border-orange-200';
    default: return 'from-zinc-50 to-zinc-100 border-zinc-200';
  }
};

const formatLevel = (level: string) => {
  if (!level || level === 'not-assessed') return '—';
  if (level === 'number-recognition-1-9' || level === 'number_1_9') return 'Numbers 1 – 9';
  if (level === 'number-recognition-11-99' || level === 'number_11_99') return 'Numbers 11 – 99';
  return level.split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

type FilterOption = 'all' | 'secure' | 'developing' | 'needs-support';

export default function ClassroomLearningMap({ learners }: { learners: PragyaLearner[] }) {
  const [filter, setFilter] = useState<FilterOption>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [prevFilter, setPrevFilter] = useState<FilterOption>(filter);
  const [selectedLearner, setSelectedLearner] = useState<PragyaLearner | null>(null);
  const itemsPerPage = 8;

  // Adjust state during render (React-endorsed reset-on-prop-change pattern)
  if (filter !== prevFilter) {
    setPrevFilter(filter);
    setCurrentPage(1);
  }

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedLearner(null); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const filteredLearners = learners.filter(learner => {
    if (filter === 'all') return true;
    return learner.status === filter;
  });

  const totalPages = Math.ceil(filteredLearners.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLearners = filteredLearners.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <div className="bg-[#fffef0] rounded-[2.5rem] border border-amber-200/70 overflow-hidden mb-8 shadow-xs">
        {/* Header & Filter Controls */}
        <div className="p-6 md:p-8 border-b border-amber-200/50 flex flex-col md:flex-row justify-between items-start md:items-center bg-[#fffce8] gap-4">
          <h3 className="text-xl font-extrabold text-zinc-900 font-heading tracking-tight">
            Classroom Learning Map
          </h3>
          
          {/* Filter Pill Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 mr-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </div>
            {(['all', 'secure', 'developing', 'needs-support'] as FilterOption[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 text-xs font-extrabold tracking-wider uppercase rounded-full transition-all border ${
                  filter === f
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs scale-105'
                    : 'bg-white text-zinc-600 border-zinc-200/90 hover:bg-zinc-50 hover:border-zinc-300'
                }`}
              >
                {f.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
        
        {/* Card Grid */}
        <div className="p-6 md:p-8 bg-[#fffef0]">
          {filteredLearners.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 bg-white rounded-2xl border border-dashed border-zinc-300">
              {learners.length === 0 
                ? "No students in this classroom yet. Create a Student ID above!" 
                : "No students match this evaluation filter."}
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`page-${currentPage}-${filter}`}
                  variants={gridVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                >
                  {paginatedLearners.map((learner) => (
                    <motion.div 
                      key={learner.id}
                      variants={cardVariants}
                      whileHover={{ y: -4, boxShadow: '0 8px 24px -4px rgba(0,0,0,0.10)', transition: { type: 'spring', stiffness: 400, damping: 28 } }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedLearner(learner)}
                      className="group relative cursor-pointer bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        {/* Status Top Badge */}
                        <div className="flex justify-between items-start mb-3">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-zinc-100 shadow-xs bg-zinc-50 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                            {learner.avatar_emoji?.startsWith('/') || learner.avatar_emoji?.startsWith('http') ? (
                              <img src={learner.avatar_emoji} alt={learner.name} className="w-full h-full object-cover" />
                            ) : (
                              <span>{learner.avatar_emoji || '🎒'}</span>
                            )}
                          </div>
                          <span className={`px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-full border ${getStatusBadgeStyle(learner.status)}`}>
                            {learner.status.replace('-', ' ')}
                          </span>
                        </div>

                        <h4 className="font-extrabold text-base text-zinc-900 font-heading group-hover:text-amber-600 transition-colors truncate">
                          {learner.name}
                        </h4>
                        <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                          {learner.class_code} · PIN: {learner.secret_pin}
                        </p>

                        {/* Pathway Levels */}
                        <div className="mt-4 space-y-1.5 pt-3 border-t border-zinc-100">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-zinc-500 font-medium flex items-center gap-1">
                              <BookOpen className="w-3 h-3 text-blue-500" /> Reading
                            </span>
                            <span className="font-bold text-zinc-800 text-[11px]">{formatLevel(learner.reading_level)}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-zinc-500 font-medium flex items-center gap-1">
                              <Hash className="w-3 h-3 text-purple-500" /> Math
                            </span>
                            <span className="font-bold text-zinc-800 text-[11px]">{formatLevel(learner.numeracy_level)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-amber-700 font-bold group-hover:translate-x-0.5 transition-transform">
                        <span>View Analytics</span>
                        <span>→</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-xs font-bold rounded-lg border border-zinc-200 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-50"
                  >
                    Prev
                  </button>
                  <span className="text-xs text-zinc-500 font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-xs font-bold rounded-lg border border-zinc-200 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Student Profile Modal (Widescreen Industry Level) ─────────────── */}
      <AnimatePresence>
        {selectedLearner && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLearner(null)}
              className="fixed inset-0 z-[9998] bg-zinc-950/70 backdrop-blur-md"
            />

            {/* Modal Centered Wrapper */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto pt-20 sm:pt-24 pb-8">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-[2.5rem] shadow-2xl border-2 border-zinc-200/90 w-full max-w-5xl max-h-[88vh] flex flex-col overflow-hidden relative my-auto"
              >
                {/* Sticky Header */}
                <div className={`sticky top-0 z-30 flex items-center justify-between gap-4 px-6 py-5 sm:px-8 sm:py-6 bg-gradient-to-r ${getStatusBg(selectedLearner.status)} border-b border-zinc-200/80 backdrop-blur-md`}>
                  <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-3 border-white shadow-md bg-zinc-100 shrink-0 flex items-center justify-center text-3xl sm:text-4xl">
                      {selectedLearner.avatar_emoji?.startsWith('/') || selectedLearner.avatar_emoji?.startsWith('http') ? (
                        <img src={selectedLearner.avatar_emoji} alt={selectedLearner.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{selectedLearner.avatar_emoji || '🎒'}</span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 font-heading leading-tight truncate">
                          {selectedLearner.name}
                        </h2>
                        <span className={`px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-full border ${getStatusBadgeStyle(selectedLearner.status)} shadow-xs`}>
                          {selectedLearner.status.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap text-xs text-zinc-700">
                        <span className="font-mono bg-white/90 px-3 py-1 rounded-xl border border-zinc-200 font-bold">
                          Student ID: <strong className="text-zinc-900">{selectedLearner.class_code}</strong>
                        </span>
                        <span className="font-mono bg-white/90 px-3 py-1 rounded-xl border border-zinc-200 font-bold">
                          Login PIN: <strong className="text-amber-700">{selectedLearner.secret_pin}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedLearner(null)}
                    aria-label="Close dialog"
                    className="w-11 h-11 flex items-center justify-center rounded-full bg-white hover:bg-zinc-100 shadow-md text-zinc-700 hover:text-zinc-900 border border-zinc-200 transition-transform active:scale-95 shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body Scroll Area */}
                <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
                  {/* Foundational Level & AI Guidance Cards */}
                  <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-5 bg-zinc-50/40">
                    <div className="bg-white border-2 border-blue-100/90 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-black text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-blue-600" /> Reading Pathway
                        </span>
                        <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold border border-blue-200">
                          NCERT Santoor
                        </span>
                      </div>
                      <div className="text-2xl font-black text-blue-950 font-heading">
                        {formatLevel(selectedLearner.reading_level)}
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-50 text-xs text-blue-700 font-semibold">
                        <span>ASER Level Diagnostic</span>
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                      </div>
                    </div>

                    <div className="bg-white border-2 border-purple-100/90 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:border-purple-300 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-black text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
                          <Hash className="w-4 h-4 text-purple-600" /> Math Pathway
                        </span>
                        <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-bold border border-purple-200">
                          Maths Mela
                        </span>
                      </div>
                      <div className="text-2xl font-black text-purple-950 font-heading">
                        {formatLevel(selectedLearner.numeracy_level)}
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-purple-50 text-xs text-purple-700 font-semibold">
                        <span>Foundation Diagnostic</span>
                        <TrendingUp className="w-4 h-4 text-purple-500" />
                      </div>
                    </div>

                    <div className={`bg-white border-2 border-amber-200/90 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:border-amber-300 transition-colors`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-black text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> AI Pedagogical Tip
                        </span>
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                          Next Action
                        </span>
                      </div>
                      <p className="text-xs font-bold text-zinc-800 leading-relaxed">
                        {selectedLearner.status === 'secure'
                          ? 'Demonstrating secure foundational mastery. Introduce extension challenge puzzles & story comprehension.'
                          : selectedLearner.status === 'developing'
                          ? 'Developing well! Recommended: peer guided reading pairs & interactive number bonds practice.'
                          : 'Needs foundational support: Schedule daily 10-min phonics & visual base-10 counting sessions.'}
                      </p>
                      <div className="text-[11px] text-zinc-400 font-semibold mt-3 pt-3 border-t border-zinc-100">
                        Adaptive recommendation updated live
                      </div>
                    </div>
                  </div>

                  {/* Real-time mastery analytics — live graphs from actual practice attempts */}
                  <StudentLiveAnalytics learnerId={selectedLearner.id} />
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

