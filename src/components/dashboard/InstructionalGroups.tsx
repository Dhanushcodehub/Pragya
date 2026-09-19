'use client';
import React from 'react';
import type { PragyaLearner } from '@/lib/types';
import { Sparkles, Users, BookOpen, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';
import { getInstructionalGroups, InstructionalGroup } from '@/lib/nipun/ncertSyllabus';

const GROUP_STYLES: Record<string, { bg: string; border: string; heading: string; text: string; chipBorder: string; chipBg: string }> = {
  reading: {
    bg: 'bg-[#f0f7ff]',
    border: 'border-[#e0edff]',
    heading: 'text-[#1e3a8a]',
    text: 'text-blue-900/80',
    chipBorder: 'border-blue-100',
    chipBg: 'bg-blue-50',
  },
  numeracy: {
    bg: 'bg-[#fff7ed]',
    border: 'border-[#ffedd5]',
    heading: 'text-[#7c2d12]',
    text: 'text-orange-900/80',
    chipBorder: 'border-orange-100',
    chipBg: 'bg-orange-50',
  },
};

function GroupCard({ group }: { group: InstructionalGroup }) {
  const s = GROUP_STYLES[group.subject];
  const Icon = group.subject === 'reading' ? BookOpen : Calculator;

  return (
    <div className={`p-5 rounded-2xl ${s.bg} ${s.border} border flex flex-col`}>
      <div className="flex items-center justify-between mb-1.5">
        <h4 className={`font-extrabold ${s.heading} text-sm flex items-center gap-2`}>
          {group.subject === 'reading' ? (
            <Users className="w-4 h-4 stroke-[2.2]" />
          ) : (
            <Users className="w-4 h-4 stroke-[2.2]" />
          )}
          Group: {group.name}
        </h4>
        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${s.chipBg} ${s.heading} border ${s.chipBorder} flex items-center gap-1`}>
          <Icon className="w-3 h-3" />
          {group.students.length} learner{group.students.length !== 1 ? 's' : ''}
        </span>
      </div>

      <p className="text-[11px] font-extrabold text-zinc-700 uppercase tracking-wider mb-1.5">
        {group.chapterRef}
      </p>
      <p className={`text-xs font-medium ${s.text} leading-relaxed mb-4`}>
        {group.need}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {group.students.map(l => (
          <motion.div
            key={l.id}
            whileHover={{ scale: 1.04 }}
            className={`bg-white px-3 py-1 rounded-full flex items-center gap-2 border ${s.chipBorder} shadow-2xs cursor-pointer`}
          >
            <div className={`w-5 h-5 rounded-full overflow-hidden ${s.chipBg} flex items-center justify-center shrink-0 border ${s.chipBorder}`}>
              {l.avatar?.startsWith('http') || l.avatar?.startsWith('/') ? (
                <img src={l.avatar} alt={l.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[10px]">{l.avatar}</span>
              )}
            </div>
            <span className="text-xs font-bold text-zinc-800">{l.name}</span>
          </motion.div>
        ))}
      </div>

      <div className="mt-auto bg-white/80 rounded-xl p-3 border border-white">
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 mb-1">Recommended activity</p>
        <p className="text-xs font-bold text-zinc-800 leading-snug">{group.activity}</p>
      </div>
    </div>
  );
}

export default function InstructionalGroups({ learners }: { learners: PragyaLearner[] }) {
  if (learners.length === 0) return null;

  // Data-driven grouping by COMMON INSTRUCTIONAL NEED, each mapped to
  // actual NCERT Class 3 chapters (Maths Mela / Santoor).
  const groups = getInstructionalGroups(learners);
  if (groups.length === 0) return null;

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
        {groups.map(group => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </motion.div>
  );
}
