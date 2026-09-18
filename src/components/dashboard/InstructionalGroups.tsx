'use client';
import React from 'react';
import type { PragyaLearner } from '@/lib/types';
import { Users2, Sparkles } from 'lucide-react';

export default function InstructionalGroups({ learners }: { learners: PragyaLearner[] }) {
  // Simple clustering logic based on reading level for demo
  const lettersGroup = learners.filter(l => l.reading_level === 'beginner' || l.reading_level === 'letter');
  const wordsGroup = learners.filter(l => l.reading_level === 'word');
  
  if (learners.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 flex-1">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-bold text-zinc-900 font-heading">AI Grouping Recommendations</h3>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
          <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
            <Users2 className="w-4 h-4"/> Group A: Phonics & Letters
          </h4>
          <p className="text-sm text-blue-700 mb-3">These students need targeted support in recognizing basic alphabets and phonics sounds.</p>
          <div className="flex flex-wrap gap-2">
            {lettersGroup.map(l => (
              <span key={l.id} className="bg-white px-2 py-1 rounded-md text-xs font-medium text-zinc-700 border shadow-sm">
                {l.avatar_emoji} {l.name}
              </span>
            ))}
            {lettersGroup.length === 0 && <span className="text-xs text-zinc-500">No students fit this group.</span>}
          </div>
        </div>

        <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100">
          <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
            <Users2 className="w-4 h-4"/> Group B: Word Blending
          </h4>
          <p className="text-sm text-purple-700 mb-3">These students know their letters but need help blending them into simple words.</p>
          <div className="flex flex-wrap gap-2">
            {wordsGroup.map(l => (
              <span key={l.id} className="bg-white px-2 py-1 rounded-md text-xs font-medium text-zinc-700 border shadow-sm">
                {l.avatar_emoji} {l.name}
              </span>
            ))}
            {wordsGroup.length === 0 && <span className="text-xs text-zinc-500">No students fit this group.</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
