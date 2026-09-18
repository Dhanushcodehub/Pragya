'use client';
import React from 'react';
import { Target, ArrowRight } from 'lucide-react';
import type { PragyaLearner } from '@/lib/types';

export default function NextActionPanel({ learners }: { learners: PragyaLearner[] }) {
  if (learners.length === 0) return null;

  // Find students who dropped off at the bottleneck (assuming needs-support or beginner math for demo)
  const strugglingStudents = learners.filter(l => l.numeracy_level === 'beginner' || l.numeracy_level === 'number-recognition-1-9');

  return (
    <div className="bg-gradient-to-br from-[#FFBE91] to-[#FFDDB0] rounded-2xl shadow-sm border border-orange-200 p-6 flex-1 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-6 h-6 text-orange-950" />
          <h3 className="text-xl font-bold text-orange-950 font-heading">Today's Focus</h3>
        </div>
        <p className="text-orange-900 font-medium mb-4 leading-relaxed">
          Your class is struggling most with <strong className="bg-orange-200/50 px-1 py-0.5 rounded">Number Recognition (11-99)</strong>. 
          <span className="block mt-1 font-bold text-orange-950">{strugglingStudents.length} students dropped off at this specific bottleneck.</span>
        </p>
        
        {/* Visual Student Group Container */}
        {strugglingStudents.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {strugglingStudents.slice(0, 5).map(l => (
              <div key={l.id} className="bg-white/80 backdrop-blur-sm pr-3 pl-1 py-1 rounded-full flex items-center gap-2 border border-orange-200/50 shadow-sm transition-transform hover:-translate-y-0.5">
                <div className="w-6 h-6 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center shrink-0 border border-orange-200">
                  {l.avatar_emoji?.startsWith('http') || l.avatar_emoji?.startsWith('/') ? (
                    <img src={l.avatar_emoji} alt={l.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs">{l.avatar_emoji}</span>
                  )}
                </div>
                <span className="text-xs font-bold text-orange-950">{l.name.split(' ')[0]}</span>
              </div>
            ))}
            {strugglingStudents.length > 5 && (
              <div className="bg-white/60 pr-3 pl-3 py-1.5 rounded-full flex items-center gap-2 border border-orange-200/50 shadow-sm">
                <span className="text-xs font-bold text-orange-900">+{strugglingStudents.length - 5} more</span>
              </div>
            )}
          </div>
        )}
        
        <div className="bg-white/70 backdrop-blur p-4 rounded-xl mb-4 border border-white/50 shadow-sm">
          <p className="text-xs font-bold text-orange-950 mb-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" /> RECOMMENDED ACTIVITY
          </p>
          <p className="text-sm font-semibold text-orange-900">15-minute "Number Bingo" session using flashcards.</p>
        </div>
      </div>
      
      <button className="w-full py-3 bg-orange-950 hover:bg-black text-white rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-md active:scale-95">
        Generate AI Lesson Plan <ArrowRight className="w-4 h-4"/>
      </button>
    </div>
  );
}
