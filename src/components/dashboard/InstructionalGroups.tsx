'use client';
import React from 'react';
import type { PragyaLearner } from '@/lib/types';
import { Users2, Sparkles, BookOpen } from 'lucide-react';

export default function InstructionalGroups({ learners }: { learners: PragyaLearner[] }) {
  if (learners.length === 0) return null;

  const groups = [
    {
      id: 'A',
      title: 'Phonics & Letters',
      desc: 'These students need targeted support in recognizing basic alphabets and phonics sounds.',
      filter: (l: PragyaLearner) => l.reading_level === 'beginner' || l.reading_level === 'letter',
      color: 'blue',
      aiPlan: '15-min Phonics Song drill followed by magnetic letter matching.',
    },
    {
      id: 'B',
      title: 'Word Blending',
      desc: 'These students know their letters but need help blending them into simple words.',
      filter: (l: PragyaLearner) => l.reading_level === 'word',
      color: 'purple',
      aiPlan: 'CVC word building workshop using interactive letter tiles.',
    },
    {
      id: 'C',
      title: 'Paragraph Fluency',
      desc: 'These students can read words but need to build speed and accuracy across sentences.',
      filter: (l: PragyaLearner) => l.reading_level === 'paragraph',
      color: 'orange',
      aiPlan: 'Buddy reading sessions with timed 1-minute fluency checks.',
    },
    {
      id: 'D',
      title: 'Story Comprehension',
      desc: 'Advanced readers who need challenges in understanding character motives and plot.',
      filter: (l: PragyaLearner) => l.reading_level === 'story',
      color: 'green',
      aiPlan: 'Independent book club discussion on "The Missing Key" with guiding questions.',
    }
  ];

  type ColorMap = {
    [key: string]: { bg: string, border: string, text: string, planBg: string, planText: string }
  }

  const colors: ColorMap = {
    blue: { bg: 'bg-blue-50/50', border: 'border-blue-100', text: 'text-blue-900', planBg: 'bg-blue-100/50', planText: 'text-blue-800' },
    purple: { bg: 'bg-purple-50/50', border: 'border-purple-100', text: 'text-purple-900', planBg: 'bg-purple-100/50', planText: 'text-purple-800' },
    orange: { bg: 'bg-orange-50/50', border: 'border-orange-100', text: 'text-orange-900', planBg: 'bg-orange-100/50', planText: 'text-orange-800' },
    green: { bg: 'bg-green-50/50', border: 'border-green-100', text: 'text-green-900', planBg: 'bg-green-100/50', planText: 'text-green-800' },
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6 flex-1 h-full">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-zinc-900" />
        <h3 className="text-lg font-bold text-zinc-900 font-heading">AI Grouping Recommendations</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map(group => {
          const groupLearners = learners.filter(group.filter);
          const c = colors[group.color];

          return (
            <div key={group.id} className={`p-5 rounded-2xl border flex flex-col ${c.bg} ${c.border}`}>
              <h4 className={`font-bold mb-2 flex items-center gap-2 ${c.text}`}>
                <Users2 className="w-4 h-4"/> Group {group.id}: {group.title}
              </h4>
              <p className={`text-xs mb-4 opacity-80 ${c.text}`}>{group.desc}</p>
              
              <div className="flex flex-wrap gap-2 mb-4 flex-1">
                {groupLearners.map(l => (
                  <div key={l.id} className="bg-white pr-3 pl-1 py-1 rounded-full flex items-center gap-2 border shadow-sm transition-transform hover:-translate-y-0.5">
                    <div className="w-5 h-5 rounded-full overflow-hidden bg-zinc-100 flex items-center justify-center shrink-0 border border-zinc-200">
                      {l.avatar_emoji?.startsWith('http') || l.avatar_emoji?.startsWith('/') ? (
                        <img src={l.avatar_emoji} alt={l.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs">{l.avatar_emoji}</span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-zinc-800">{l.name.split(' ')[0]}</span>
                  </div>
                ))}
                {groupLearners.length === 0 && <span className="text-xs opacity-60 italic mt-2">No students fit this group.</span>}
              </div>

              {/* AI Lesson Plan Snippet */}
              <div className={`mt-auto p-3 rounded-xl border ${c.planBg} border-white/40`}>
                <div className={`flex items-center gap-1.5 text-xs font-bold mb-1 uppercase tracking-wider ${c.planText}`}>
                  <BookOpen className="w-3.5 h-3.5" /> AI Lesson Plan
                </div>
                <p className={`text-[13px] font-medium leading-snug ${c.planText}`}>
                  {group.aiPlan}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
