'use client';
import React from 'react';
import type { PragyaLearner } from '@/lib/types';
import { Sparkles, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InstructionalGroups({ learners }: { learners: PragyaLearner[] }) {
  if (learners.length === 0) return null;

  const groupAStudents = learners.filter(l => 
    l.reading_level === 'beginner' || l.reading_level === 'letter' || l.status === 'needs-support'
  ).slice(0, 4);

  const groupBStudents = learners.filter(l => 
    l.reading_level === 'word' || l.reading_level === 'paragraph' || l.status === 'developing'
  ).slice(0, 5);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white rounded-[2rem] shadow-xs border border-zinc-200/80 p-7 flex-1 flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-blue-500 fill-blue-500" />
        <h3 className="text-xl font-extrabold text-zinc-900 font-heading tracking-tight">
          AI Grouping Recommendations
        </h3>
      </div>
      
      <div className="space-y-4">
        {/* Group A: Phonics & Letters */}
        <div className="p-5 rounded-2xl bg-[#f0f7ff] border border-[#e0edff] flex flex-col">
          <h4 className="font-extrabold text-[#1e3a8a] text-sm mb-1.5 flex items-center gap-2">
            <Users className="w-4 h-4 stroke-[2.2]" /> Group A: Phonics & Letters
          </h4>
          <p className="text-xs font-medium text-blue-900/80 leading-relaxed mb-4">
            These students need targeted support in recognizing basic alphabets and phonics sounds.
          </p>
          
          <div className="flex flex-wrap gap-2">
            {groupAStudents.map(l => (
              <motion.div 
                key={l.id} 
                whileHover={{ scale: 1.04 }}
                className="bg-white px-3 py-1 rounded-full flex items-center gap-2 border border-blue-100 shadow-2xs cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full overflow-hidden bg-blue-50 flex items-center justify-center shrink-0 border border-blue-200">
                  {l.avatar_emoji?.startsWith('http') || l.avatar_emoji?.startsWith('/') ? (
                    <img src={l.avatar_emoji} alt={l.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px]">{l.avatar_emoji}</span>
                  )}
                </div>
                <span className="text-xs font-bold text-zinc-800">{l.name}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Group B: Word Blending */}
        <div className="p-5 rounded-2xl bg-[#fcf5ff] border border-[#f3e8ff] flex flex-col">
          <h4 className="font-extrabold text-[#581c87] text-sm mb-1.5 flex items-center gap-2">
            <Users className="w-4 h-4 stroke-[2.2]" /> Group B: Word Blending
          </h4>
          <p className="text-xs font-medium text-purple-900/80 leading-relaxed mb-4">
            These students know their letters but need help blending them into simple words.
          </p>
          
          <div className="flex flex-wrap gap-2">
            {groupBStudents.map(l => (
              <motion.div 
                key={l.id} 
                whileHover={{ scale: 1.04 }}
                className="bg-white px-3 py-1 rounded-full flex items-center gap-2 border border-purple-100 shadow-2xs cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full overflow-hidden bg-purple-50 flex items-center justify-center shrink-0 border border-purple-200">
                  {l.avatar_emoji?.startsWith('http') || l.avatar_emoji?.startsWith('/') ? (
                    <img src={l.avatar_emoji} alt={l.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px]">{l.avatar_emoji}</span>
                  )}
                </div>
                <span className="text-xs font-bold text-zinc-800">{l.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

