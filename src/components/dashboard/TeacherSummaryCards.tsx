'use client';
import React from 'react';
import { Users, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import type { PragyaLearner } from '@/lib/types';

export default function TeacherSummaryCards({ learners }: { learners: PragyaLearner[] }) {
  const total = learners.length;
  const assessed = learners.filter(l => l.status !== 'not-assessed').length;
  const needsSupport = learners.filter(l => l.status === 'needs-support').length;
  const secure = learners.filter(l => l.status === 'secure').length;
  
  const masteryPercent = total > 0 ? Math.round((secure / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 flex items-center gap-4">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Users className="w-6 h-6" /></div>
        <div>
          <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Total Students</p>
          <p className="text-3xl font-bold text-zinc-900">{total}</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 flex items-center gap-4">
        <div className="p-3 bg-green-100 text-green-600 rounded-xl"><CheckCircle className="w-6 h-6" /></div>
        <div>
          <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Assessed</p>
          <p className="text-3xl font-bold text-zinc-900">{assessed} <span className="text-sm font-medium text-zinc-400">/ {total}</span></p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 flex items-center gap-4">
        <div className="p-3 bg-orange-100 text-orange-600 rounded-xl"><AlertTriangle className="w-6 h-6" /></div>
        <div>
          <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Needs Support</p>
          <p className="text-3xl font-bold text-orange-600">{needsSupport}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 flex items-center gap-4">
        <div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><TrendingUp className="w-6 h-6" /></div>
        <div>
          <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Class Mastery</p>
          <p className="text-3xl font-bold text-zinc-900">{masteryPercent}%</p>
        </div>
      </div>
    </div>
  );
}
