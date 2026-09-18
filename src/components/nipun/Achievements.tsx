'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Award, Flame, Sparkles, Lock, CheckCircle2 } from 'lucide-react';
import { Learner } from '@/lib/nipun/types';
import { useStudent } from '@/lib/nipun/StudentContext';
import { Loader2 } from 'lucide-react';
import { MOCK_ACTIVE_STUDENT } from '@/lib/nipun/syntheticData';

interface AchievementsProps {
  learner?: Learner;
}

export default function Achievements({ learner: propLearner }: AchievementsProps) {
  const { learner: contextLearner, isLoading } = useStudent();
  const learner = propLearner || contextLearner;
  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>;
  if (!learner) return null;

  const unlockedCount = learner.badges.filter(b => b.isUnlocked).length;
  const totalCount = learner.badges.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/*  HEADER  */}
      <div className="flex items-center gap-3">
        <Link
          href="/student"
          className="p-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-fredoka text-gray-900">
            Trophy Cabinet & Badges 
          </h1>
          <p className="text-xs text-gray-600 font-medium">
            Earn badges by practicing quests and unlocking new learning levels!
          </p>
        </div>
      </div>

      {/*  SUMMARY CARDS  */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm text-2xl">
            
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-amber-800">Badges Unlocked</span>
            <h3 className="text-2xl font-extrabold font-fredoka text-amber-950">
              {unlockedCount} / {totalCount}
            </h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-sm text-2xl">
            
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-orange-800">Learning Streak</span>
            <h3 className="text-2xl font-extrabold font-fredoka text-orange-950">
              {learner.streakDays} Days
            </h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-500 text-white flex items-center justify-center shadow-sm text-2xl">
            
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-yellow-800">Total XP</span>
            <h3 className="text-2xl font-extrabold font-fredoka text-yellow-950">
              {learner.xp} XP
            </h3>
          </div>
        </div>
      </div>

      {/*  BADGES GRID  */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-amber-200 shadow-sm space-y-6">
        <h2 className="text-lg font-bold font-fredoka text-gray-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <span>All Mastery Badges</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {learner.badges.map(badge => (
            <motion.div
              key={badge.id}
              whileHover={{ y: -3 }}
              className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                badge.isUnlocked
                  ? 'bg-gradient-to-b from-amber-50/60 to-white border-amber-300 shadow-sm'
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="text-amber-500"><Award className="w-10 h-10" /></div>
                  {badge.isUnlocked ? (
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 bg-gray-200 text-gray-600 text-[10px] font-bold rounded-full flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold font-fredoka text-gray-900">
                  {badge.title}
                </h3>
                <p className="text-xs text-gray-600 mt-1 font-medium leading-relaxed">
                  {badge.description}
                </p>
              </div>

              {badge.unlockedAt && (
                <p className="text-[10px] text-amber-700 font-bold mt-4 pt-2 border-t border-amber-200">
                  Earned on {badge.unlockedAt}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
