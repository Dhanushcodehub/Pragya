'use client';
import React, { useState, useEffect } from 'react';
import type { PragyaLearner } from '@/lib/types';
import { BookOpen, Hash, Filter, X, Star, TrendingUp } from 'lucide-react';

const getStatusColor = (status: string) => {
  switch(status) {
    case 'secure': return 'bg-green-100 text-green-700 border-green-200';
    case 'developing': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'needs-support': return 'bg-orange-100 text-orange-700 border-orange-200';
    default: return 'bg-zinc-100 text-zinc-500 border-zinc-200';
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
      <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden mb-8">
        <div className="p-6 border-b border-orange-100 flex flex-col md:flex-row justify-between items-start md:items-center bg-[#FFFCE1] gap-4">
          <h3 className="text-lg font-bold text-zinc-900 font-heading">Classroom Learning Map</h3>
          
          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 mr-2 text-sm font-medium text-zinc-500">
              <Filter className="w-4 h-4" /> Filter:
            </div>
            {(['all', 'secure', 'developing', 'needs-support'] as FilterOption[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all border ${
                  filter === f
                    ? f === 'secure' ? 'bg-green-100 text-green-700 border-green-300'
                    : f === 'developing' ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                    : f === 'needs-support' ? 'bg-orange-100 text-orange-700 border-orange-300'
                    : 'bg-zinc-800 text-white border-zinc-800'
                    : 'bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                {f.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-6 bg-zinc-50/50">
          {filteredLearners.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 bg-white rounded-xl border border-dashed border-zinc-300">
              {learners.length === 0 
                ? "No students in this classroom yet. Create a Student ID above!" 
                : "No students match this evaluation filter."}
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedLearners.map((learner) => (
                  <div 
                    key={learner.id}
                    onClick={() => setSelectedLearner(learner)}
                    className="bg-white rounded-xl p-5 border shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer active:scale-[0.98]"
                    style={{ borderColor: learner.status === 'secure' ? '#bbf7d0' : learner.status === 'developing' ? '#fef08a' : learner.status === 'needs-support' ? '#fed7aa' : '#e4e4e7' }}
                  >
                    {/* Header: Avatar, Name, Pin */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full shadow-sm overflow-hidden bg-zinc-50 border shrink-0">
                          {learner.avatar_emoji?.startsWith('/') || learner.avatar_emoji?.startsWith('http') ? (
                            <img src={learner.avatar_emoji} alt={learner.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-3xl">{learner.avatar_emoji}</span>
                          )}
                        </div>
                        <div>
                          <div className="text-zinc-900 font-bold leading-tight">{learner.name}</div>
                          <div className="text-xs text-zinc-400 font-mono font-medium mt-0.5">PIN: {learner.secret_pin}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="mb-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getStatusColor(learner.status)}`}>
                        {learner.status.replace('-', ' ')}
                      </span>
                    </div>

                    {/* Metrics */}
                    <div className="space-y-2 mt-auto">
                      <div className="flex items-center justify-between bg-zinc-50 p-2 rounded-lg border border-zinc-100">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500">
                          <BookOpen className="w-3.5 h-3.5"/> Reading
                        </div>
                        <div className="text-xs font-bold text-zinc-800">{formatLevel(learner.reading_level)}</div>
                      </div>
                      <div className="flex items-center justify-between bg-zinc-50 p-2 rounded-lg border border-zinc-100">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500">
                          <Hash className="w-3.5 h-3.5"/> Math
                        </div>
                        <div className="text-xs font-bold text-zinc-800">{formatLevel(learner.numeracy_level)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-2">
                  <div className="inline-flex rounded-xl border border-zinc-200 overflow-hidden shadow-sm bg-white">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2.5 text-sm font-bold border-r border-zinc-200 transition-colors focus:outline-none 
                          ${currentPage === page 
                            ? 'bg-zinc-900 text-white' 
                            : 'text-zinc-600 hover:bg-zinc-50'
                          }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2.5 text-sm font-bold text-zinc-600 border-r border-zinc-200 hover:bg-zinc-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
                    >
                      Next »
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2.5 text-sm font-bold text-zinc-600 hover:bg-zinc-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
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
      {/* Backdrop */}
      <div
        onClick={() => setSelectedLearner(null)}
        className={`fixed inset-0 z-40 bg-zinc-900/50 backdrop-blur-sm transition-opacity duration-200 ${selectedLearner ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Centered Modal Box */}
      {selectedLearner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-zinc-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header Row: Avatar + Name + Status + Close */}
            <div className={`relative flex items-center gap-6 p-7 bg-gradient-to-r ${getStatusBg(selectedLearner.status)} border-b`}>
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-zinc-100 shrink-0">
                {selectedLearner.avatar_emoji?.startsWith('/') || selectedLearner.avatar_emoji?.startsWith('http') ? (
                  <img src={selectedLearner.avatar_emoji} alt={selectedLearner.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl flex items-center justify-center w-full h-full">{selectedLearner.avatar_emoji}</span>
                )}
              </div>

              {/* Name + Badge */}
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-extrabold text-zinc-900 font-heading leading-tight">{selectedLearner.name}</h2>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getStatusColor(selectedLearner.status)}`}>
                    {selectedLearner.status.replace('-', ' ')}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono bg-white/60 px-2 py-1 rounded-lg">ID: {selectedLearner.class_code}</span>
                  <span className="text-xs text-zinc-500 font-mono bg-white/60 px-2 py-1 rounded-lg">PIN: {selectedLearner.secret_pin}</span>
                </div>
              </div>

              {/* Close btn */}
              <button
                onClick={() => setSelectedLearner(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow text-zinc-500 hover:text-zinc-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body — 3-column stats grid */}
            <div className="p-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Reading */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Reading</span>
                </div>
                <div className="text-2xl font-extrabold text-blue-900">{formatLevel(selectedLearner.reading_level)}</div>
                <TrendingUp className="w-4 h-4 text-blue-300 self-end" />
              </div>

              {/* Math */}
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-5 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-purple-500" />
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Math</span>
                </div>
                <div className="text-2xl font-extrabold text-purple-900">{formatLevel(selectedLearner.numeracy_level)}</div>
                <TrendingUp className="w-4 h-4 text-purple-300 self-end" />
              </div>

              {/* AI Recommendation */}
              <div className={`rounded-xl p-5 border bg-gradient-to-br ${getStatusBg(selectedLearner.status)} flex flex-col gap-2`}>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-zinc-600 uppercase tracking-wider">AI Tip</span>
                </div>
                <p className="text-sm font-semibold text-zinc-800 leading-snug">
                  {selectedLearner.status === 'secure'
                    ? 'Advanced extension activities recommended.'
                    : selectedLearner.status === 'developing'
                    ? 'Try peer reading & extra practice sheets.'
                    : 'Schedule phonics & numeracy one-on-one.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
