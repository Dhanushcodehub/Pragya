'use client';
import React, { useState, useEffect } from 'react';
import type { PragyaLearner } from '@/lib/types';
import { BookOpen, Hash, Filter, X, Star, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

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
  if (level === 'not-assessed') return '—';
  if (level === 'number-recognition-1-9') return 'Number Recognition 1 9';
  if (level === 'number-recognition-11-99') return 'Number Recognition 11 99';
  return level.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

type FilterOption = 'all' | 'secure' | 'developing' | 'needs-support';

export default function ClassroomLearningMap({ learners }: { learners: PragyaLearner[] }) {
  const [filter, setFilter] = useState<FilterOption>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLearner, setSelectedLearner] = useState<PragyaLearner | null>(null);
  const itemsPerPage = 8;

  useEffect(() => { setCurrentPage(1); }, [filter]);

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
                      className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-2xs cursor-pointer flex flex-col justify-between"
                    >
                      {/* Top Row: Avatar + Name + PIN */}
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 flex items-center justify-center rounded-full shadow-xs overflow-hidden bg-zinc-50 border border-zinc-100 shrink-0">
                            {learner.avatar_emoji?.startsWith('/') || learner.avatar_emoji?.startsWith('http') ? (
                              <img src={learner.avatar_emoji} alt={learner.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-2xl">{learner.avatar_emoji}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-zinc-900 font-extrabold text-base leading-tight truncate">{learner.name}</div>
                            <div className="text-[11px] text-zinc-500 font-mono font-medium mt-0.5 flex flex-col leading-tight">
                              <span>Code: <strong className="text-zinc-800 font-bold">{learner.class_code}</strong></span>
                              <span>PIN: <strong className="text-zinc-800 font-bold">{learner.secret_pin}</strong></span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Status Badge Tag */}
                        <div className="mb-4">
                          <span className={`inline-block px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-full border ${getStatusBadgeStyle(learner.status)}`}>
                            {learner.status.replace('-', ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Metrics Box */}
                      <div className="space-y-2 pt-2 border-t border-zinc-100">
                        <div className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-zinc-50/70">
                          <div className="flex items-center gap-1.5 font-bold text-zinc-500">
                            <BookOpen className="w-3.5 h-3.5 text-zinc-400"/> Reading
                          </div>
                          <div className="font-extrabold text-zinc-800">{formatLevel(learner.reading_level)}</div>
                        </div>
                        <div className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-zinc-50/70">
                          <div className="flex items-center gap-1.5 font-bold text-zinc-500">
                            <Hash className="w-3.5 h-3.5 text-zinc-400"/> Math
                          </div>
                          <div className="font-extrabold text-zinc-800">{formatLevel(learner.numeracy_level)}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-2">
                  <div className="inline-flex rounded-2xl border border-zinc-800/80 overflow-hidden shadow-md bg-[#181920]">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4.5 py-2.5 text-xs font-semibold border-r border-zinc-800/70 transition-all focus:outline-none 
                          ${currentPage === page 
                            ? 'bg-[#0e0f14] text-[#fde047] font-extrabold' 
                            : 'text-[#8cb3d9] hover:bg-zinc-800/60'
                          }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4.5 py-2.5 text-xs font-semibold text-[#8cb3d9] border-r border-zinc-800/70 hover:bg-zinc-800/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
                    >
                      Next »
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="px-4.5 py-2.5 text-xs font-semibold text-[#8cb3d9] hover:bg-zinc-800/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
                    >
                      Last »
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Student Profile Modal ─────────────────────────────── */}
      <AnimatePresence>
        {selectedLearner && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLearner(null)}
              className="fixed inset-0 z-40 bg-zinc-900/50 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white rounded-3xl shadow-2xl border border-zinc-200 w-full max-w-2xl overflow-hidden"
              >
                {/* Modal Header */}
                <div className={`relative flex items-center gap-6 p-7 bg-gradient-to-r ${getStatusBg(selectedLearner.status)} border-b border-zinc-100`}>
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-zinc-100 shrink-0">
                    {selectedLearner.avatar_emoji?.startsWith('/') || selectedLearner.avatar_emoji?.startsWith('http') ? (
                      <img src={selectedLearner.avatar_emoji} alt={selectedLearner.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl flex items-center justify-center w-full h-full">{selectedLearner.avatar_emoji}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-extrabold text-zinc-900 font-heading leading-tight">{selectedLearner.name}</h2>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className={`px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-full border ${getStatusBadgeStyle(selectedLearner.status)}`}>
                        {selectedLearner.status.replace('-', ' ')}
                      </span>
                      <span className="text-xs text-zinc-600 font-mono bg-white/80 px-2.5 py-1 rounded-lg border border-zinc-200/50">ID: {selectedLearner.class_code}</span>
                      <span className="text-xs text-zinc-600 font-mono bg-white/80 px-2.5 py-1 rounded-lg border border-zinc-200/50">PIN: {selectedLearner.secret_pin}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedLearner(null)}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-xs text-zinc-500 hover:text-zinc-800 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Modal Stats */}
                <div className="p-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Reading</span>
                    </div>
                    <div className="text-xl font-extrabold text-blue-950">{formatLevel(selectedLearner.reading_level)}</div>
                    <TrendingUp className="w-4 h-4 text-blue-400 self-end mt-2" />
                  </div>

                  <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5 flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      <Hash className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Math</span>
                    </div>
                    <div className="text-xl font-extrabold text-purple-950">{formatLevel(selectedLearner.numeracy_level)}</div>
                    <TrendingUp className="w-4 h-4 text-purple-400 self-end mt-2" />
                  </div>

                  <div className={`rounded-2xl p-5 border bg-gradient-to-br ${getStatusBg(selectedLearner.status)} flex flex-col justify-between`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider">AI Tip</span>
                    </div>
                    <p className="text-xs font-bold text-zinc-800 leading-relaxed">
                      {selectedLearner.status === 'secure'
                        ? 'Advanced extension activities recommended.'
                        : selectedLearner.status === 'developing'
                        ? 'Try peer reading & extra practice sheets.'
                        : 'Schedule phonics & numeracy one-on-one.'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

