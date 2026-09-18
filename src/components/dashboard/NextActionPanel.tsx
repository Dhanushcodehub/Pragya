'use client';
import React from 'react';
import { Target, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { PragyaLearner } from '@/lib/types';

export default function NextActionPanel({ learners }: { learners: PragyaLearner[] }) {
  if (learners.length === 0) return null;

  // Filter students struggling with Number Recognition / foundational math
  const strugglingStudents = learners.filter(l => 
    l.numeracy_level === 'beginner' || 
    l.numeracy_level === 'number-recognition-1-9' || 
    l.numeracy_level === 'number-recognition-11-99' ||
    l.status === 'needs-support'
  ).slice(0, 4);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-[#ffe4d1] rounded-[2rem] border border-orange-200/80 p-7 flex-1 flex flex-col justify-between shadow-xs"
    >
      <div>
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-full bg-orange-950/10 flex items-center justify-center text-orange-950">
            <Target className="w-5 h-5 stroke-[2.2]" />
          </div>
          <h3 className="text-xl font-extrabold text-[#3a1d0d] font-heading tracking-tight">
            Today's Focus
          </h3>
        </div>

        {/* Bottleneck Alert */}
        <p className="text-[#4a2612] font-semibold text-sm leading-relaxed mb-5">
          Your class is struggling most with <strong className="text-[#2a0e02] font-extrabold underline decoration-orange-400/80 underline-offset-2">Number Recognition (11–99)</strong>.
          <br />
          <span className="font-extrabold text-[#3a1d0d] block mt-1">
            4 students dropped off at this specific bottleneck.
          </span>
        </p>
        
        {/* Student Avatars Row */}
        <div className="flex flex-wrap gap-2.5 mb-6">
          {strugglingStudents.map(l => (
            <motion.div 
              key={l.id} 
              whileHover={{ scale: 1.05, y: -2 }}
              className="bg-white/90 backdrop-blur-sm pr-3.5 pl-1.5 py-1 rounded-full flex items-center gap-2 border border-orange-200/80 shadow-xs cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center shrink-0 border border-orange-200">
                {l.avatar_emoji?.startsWith('http') || l.avatar_emoji?.startsWith('/') ? (
                  <img src={l.avatar_emoji} alt={l.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs">{l.avatar_emoji}</span>
                )}
              </div>
              <span className="text-xs font-extrabold text-orange-950">{l.name.split(' ')[0]}</span>
            </motion.div>
          ))}
        </div>
        
        {/* Recommended Activity Card */}
        <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl mb-6 border border-orange-200/60 shadow-xs">
          <p className="text-[11px] font-extrabold text-orange-950/80 mb-1.5 flex items-center gap-1.5 tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" /> RECOMMENDED ACTIVITY
          </p>
          <p className="text-sm font-extrabold text-[#2a1309] leading-snug">
            15-minute "Number Bingo" session using flashcards.
          </p>
        </div>
      </div>
      
      {/* Dark Action Button */}
      <motion.button 
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 bg-[#2a1309] hover:bg-black text-white rounded-2xl font-bold text-sm flex justify-center items-center gap-2 transition-all shadow-md active:scale-95 mt-2"
      >
        Generate AI Lesson Plan <ArrowRight className="w-4 h-4 stroke-[2.5]" />
      </motion.button>
    </motion.div>
  );
}

