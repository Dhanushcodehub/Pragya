'use client';
import React from 'react';
import { Target, ArrowRight } from 'lucide-react';
import type { PragyaLearner } from '@/lib/types';

export default function NextActionPanel({ learners }: { learners: PragyaLearner[] }) {
  if (learners.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-[#FFBE91] to-[#FFDDB0] rounded-2xl shadow-sm border border-orange-200 p-6 flex-1 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-6 h-6 text-orange-900" />
          <h3 className="text-xl font-bold text-orange-950 font-heading">Today's Focus</h3>
        </div>
        <p className="text-orange-900 font-medium mb-6">
          Your class is struggling most with <strong>Number Recognition (11-99)</strong>. 
          4 students dropped off at this exact bottleneck in yesterday's assessment.
        </p>
        
        <div className="bg-white/60 p-4 rounded-xl mb-4">
          <p className="text-sm font-bold text-orange-950 mb-1">Recommended Activity:</p>
          <p className="text-sm text-orange-900">15-minute "Number Bingo" session using flashcards.</p>
        </div>
      </div>
      
      <button className="w-full py-3 bg-orange-950 text-white rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-black transition-colors">
        Generate Lesson Plan <ArrowRight className="w-4 h-4"/>
      </button>
    </div>
  );
}
