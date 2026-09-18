'use client';
import React from 'react';
import type { PragyaLearner } from '@/lib/types';
import { BookOpen, Hash } from 'lucide-react';

const getStatusColor = (status: string) => {
  switch(status) {
    case 'secure': return 'bg-green-100 text-green-700 border-green-200';
    case 'developing': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'needs-support': return 'bg-orange-100 text-orange-700 border-orange-200';
    default: return 'bg-zinc-100 text-zinc-500 border-zinc-200';
  }
};

const formatLevel = (level: string) => {
  if (level === 'not-assessed') return 'â€”';
  return level.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

export default function ClassroomLearningMap({ learners }: { learners: PragyaLearner[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden mb-8">
      <div className="p-6 border-b border-orange-100 flex justify-between items-center bg-[#FFFCE1]">
        <h3 className="text-lg font-bold text-zinc-900 font-heading">Classroom Learning Map</h3>
        <div className="flex gap-4 text-xs font-medium">
          <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-400"></div> Secure</span>
          <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-yellow-400"></div> Developing</span>
          <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-orange-400"></div> Needs Support</span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 text-zinc-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold w-1/4">Student</th>
              <th className="p-4 font-semibold w-1/4"><div className="flex items-center gap-2"><BookOpen className="w-4 h-4"/> Reading Level</div></th>
              <th className="p-4 font-semibold w-1/4"><div className="flex items-center gap-2"><Hash className="w-4 h-4"/> Numeracy Level</div></th>
              <th className="p-4 font-semibold w-1/4">Overall Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {learners.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-zinc-500">
                  No students in this classroom yet. Generate demo data above!
                </td>
              </tr>
            ) : (
              learners.map((learner) => (
                <tr key={learner.id} className="hover:bg-orange-50/30 transition-colors">
                  <td className="p-4 font-medium flex items-center gap-3">
                    <span className="text-2xl">{learner.avatar_emoji}</span>
                    <div>
                      <div className="text-zinc-900">{learner.name}</div>
                      <div className="text-xs text-zinc-400 font-mono">PIN: {learner.secret_pin}</div>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-medium text-zinc-700">
                    {formatLevel(learner.reading_level)}
                  </td>
                  <td className="p-4 text-sm font-medium text-zinc-700">
                    {formatLevel(learner.numeracy_level)}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${getStatusColor(learner.status)}`}>
                      {learner.status.replace('-', ' ')}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
