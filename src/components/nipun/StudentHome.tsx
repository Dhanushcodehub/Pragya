'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Award, Flame, Sparkles, BookOpen, Calculator, ArrowRight, CheckCircle2, Lock, Loader2, PlaySquare } from 'lucide-react';
import { Learner } from '@/lib/nipun/types';
import { getReadingWorldStages, getNumeracyWorldStages } from '@/lib/nipun/syntheticData';
import { useStudent } from '@/lib/nipun/StudentContext';
import IntroVideoModal from '@/components/nipun/IntroVideoModal';

const C = {
  cream: '#fef9f2',
  primary: '#1d1c18',
  surfaceContainerLow: '#f4f0e9',
};

export default function StudentHome() {
  const { learner, isLoading } = useStudent();
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    if (!learner) return;
    const seenKey = `pragya_intro_seen_${learner.id}`;
    const hasSeen = localStorage.getItem(seenKey);
    if (!hasSeen) {
      setShowIntro(true);
      localStorage.setItem(seenKey, 'true');
    }
  }, [learner]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
        <h2 className="text-xl font-bold font-fredoka text-gray-700">Loading your adventure...</h2>
      </div>
    );
  }

  if (!learner) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center px-4">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-2">
          <Award className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold font-fredoka text-gray-800">Oops! We couldn't find your profile.</h2>
        <p className="text-gray-600 max-w-md">Please try logging out and logging back in with your Class Code and Secret PIN.</p>
        <Link href="/login" className="mt-4 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-sm transition-colors">
          Go to Login
        </Link>
      </div>
    );
  }

  const playerLevel = Math.floor(learner.xp / 100) + 1;
  const nextLevelXp = playerLevel * 100;
  const progressPercent = Math.min(100, Math.round((learner.xp / nextLevelXp) * 100));

  const readingStages = getReadingWorldStages(learner);
  const numeracyStages = getNumeracyWorldStages(learner);

  const currentReadingStage = readingStages.find(s => s.status === 'current') || readingStages[readingStages.length - 1];
  const currentNumeracyStage = numeracyStages.find(s => s.status === 'current') || numeracyStages[numeracyStages.length - 1];

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/*  WELCOME BANNER  */}
      <section 
        className="relative overflow-hidden rounded-3xl p-6 sm:p-10 border border-[#e6e2db] shadow-sm"
        style={{ backgroundColor: C.surfaceContainerLow }}
      >
        {/* Background decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-200/40 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-200/40 rounded-full blur-3xl"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center shadow-inner text-amber-500"><Award className="w-8 h-8 md:w-10 md:h-10" /></div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500 text-white">
                  Grade {learner.grade} Student
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                  {learner.streakDays} Day Streak!
                </span>
              </div>
              <h1 
                className="text-2xl md:text-3xl font-extrabold mt-1 tracking-tight"
                style={{ color: C.primary, fontFamily: 'var(--font-fredoka), sans-serif' }}
              >
                Welcome back, {learner.name.split(' ')[0]}! <Sparkles className="inline-block w-6 h-6 text-amber-500 mb-1" />
              </h1>
              <p className="text-sm font-medium text-gray-600 mt-0.5">
                Ready for your learning quest today? Let's explore!
              </p>
            </div>
          </div>

          {/* XP Progress Badge */}
          <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border border-amber-200 shadow-sm w-full md:w-64 shrink-0">
            <div className="flex justify-between items-center text-xs font-bold text-gray-700 mb-1.5">
              <span className="flex items-center gap-1 text-amber-600">
                <Sparkles className="w-4 h-4 fill-amber-400 text-amber-500" />
                Level {playerLevel} Explorer
              </span>
              <span>{learner.xp} / {nextLevelXp} XP</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
              <motion.div 
                className="h-full bg-amber-400"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <p className="text-[11px] text-gray-500 mt-1.5 text-right font-medium">
              Only {nextLevelXp - learner.xp} XP to unlock Level {playerLevel + 1}!
            </p>
          </div>
        </div>
      </section>

      {/*  CURRENT QUEST HERO BANNER  */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-6 md:p-8 rounded-3xl shadow-md relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute right-20 bottom-0 w-32 h-32 bg-teal-400/20 rounded-full blur-2xl translate-y-1/2"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest font-bold text-emerald-200 flex items-center gap-1.5">
              <Award className="w-4 h-4" /> ACTIVE TODAY'S QUEST
            </span>
            <h2 className="text-xl md:text-2xl font-bold font-fredoka">
              "{learner.currentQuest}"
            </h2>
            <p className="text-sm text-emerald-100 max-w-xl">
              Practice reading connected sentences to earn 50 bonus XP and unlock the Story Master badge!
            </p>
          </div>
          <Link
            href="/student/practice?pathway=reading"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-emerald-900 font-bold text-sm rounded-2xl hover:bg-emerald-50 transition-all shadow-sm shrink-0"
          >
            Continue Quest
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/*  TWO LEARNING WORLDS GRID  */}
      <div>
        <h2 className="text-xl font-bold mb-4 font-fredoka text-gray-900 flex items-center gap-2">
          <span>Choose Your Learning World</span>
          <span className="text-xs font-normal text-gray-500">(Tap to view journey map)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* READING WORLD CARD */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl border-2 border-emerald-200 bg-emerald-50/40 relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center shadow-sm text-emerald-600"><BookOpen className="w-6 h-6" /></div>
                <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                  Reading World
                </span>
              </div>

              <h3 className="text-xl font-bold text-emerald-950 font-fredoka">
                Reading World
              </h3>
              <p className="text-xs text-emerald-800 mt-1 font-medium">
                Current Level: <strong className="text-emerald-950">{currentReadingStage.name}</strong>
              </p>

              {/* Mini stage list */}
              <div className="mt-4 space-y-2">
                {readingStages.map(stage => (
                  <div 
                    key={stage.id} 
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-all ${
                      stage.status === 'mastered' 
                        ? 'bg-emerald-100/80 text-emerald-900' 
                        : stage.status === 'current'
                        ? 'bg-white border-2 border-emerald-500 text-emerald-950 font-bold shadow-sm'
                        : 'bg-gray-100/60 text-gray-400 opacity-65'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{stage.icon}</span>
                      <span>{stage.name}</span>
                    </span>
                    {stage.status === 'mastered' && (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Mastered
                      </span>
                    )}
                    {stage.status === 'current' && (
                      <span className="px-2 py-0.5 bg-emerald-500 text-white rounded-full text-[10px] font-bold">
                        Active Level
                      </span>
                    )}
                    {stage.status === 'locked' && (
                      <Lock className="w-3.5 h-3.5 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Link
                href="/student/quest?world=reading"
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs text-center transition-colors shadow-sm"
              >
                View Quest Map
              </Link>
              <Link
                href="/student/practice?pathway=reading"
                className="py-3 px-4 rounded-xl bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-50 font-bold text-xs text-center transition-colors"
              >
                Practice
              </Link>
            </div>
          </motion.div>

          {/* NUMERACY WORLD CARD */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl border-2 border-amber-200 bg-amber-50/40 relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center shadow-sm text-amber-600"><Calculator className="w-6 h-6" /></div>
                <span className="text-xs font-bold px-3 py-1 bg-amber-100 text-amber-800 rounded-full border border-amber-300">
                  Numeracy World
                </span>
              </div>

              <h3 className="text-xl font-bold text-amber-950 font-fredoka">
                Numeracy World
              </h3>
              <p className="text-xs text-amber-800 mt-1 font-medium">
                Current Level: <strong className="text-amber-950">{currentNumeracyStage.name}</strong>
              </p>

              {/* Mini stage list */}
              <div className="mt-4 space-y-2">
                {numeracyStages.map(stage => (
                  <div 
                    key={stage.id} 
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-all ${
                      stage.status === 'mastered' 
                        ? 'bg-amber-100/80 text-amber-900' 
                        : stage.status === 'current'
                        ? 'bg-white border-2 border-amber-500 text-amber-950 font-bold shadow-sm'
                        : 'bg-gray-100/60 text-gray-400 opacity-65'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{stage.icon}</span>
                      <span>{stage.name}</span>
                    </span>
                    {stage.status === 'mastered' && (
                      <span className="text-amber-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Mastered
                      </span>
                    )}
                    {stage.status === 'current' && (
                      <span className="px-2 py-0.5 bg-amber-500 text-white rounded-full text-[10px] font-bold">
                        Active Level
                      </span>
                    )}
                    {stage.status === 'locked' && (
                      <Lock className="w-3.5 h-3.5 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Link
                href="/student/quest?world=numeracy"
                className="flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs text-center transition-colors shadow-sm"
              >
                View Quest Map
              </Link>
              <Link
                href="/student/practice?pathway=numeracy"
                className="py-3 px-4 rounded-xl bg-white border border-amber-300 text-amber-900 hover:bg-amber-50 font-bold text-xs text-center transition-colors"
              >
                Practice
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/*  MY BADGES & ACHIEVEMENTS STRIP  */}
      <div 
        className="p-6 rounded-3xl border border-[#e6e2db]"
        style={{ backgroundColor: C.surfaceContainerLow }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold font-fredoka text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>My Badges & Trophy Cabinet</span>
          </h3>
          <Link 
            href="/student/achievements" 
            className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
          >
            View All ({learner.badges?.length || 0}) 
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {(learner.badges || []).map(badge => (
            <div 
              key={badge.id}
              className={`p-3 rounded-2xl border text-center transition-all ${
                badge.isUnlocked
                  ? 'bg-white border-amber-200 shadow-sm'
                  : 'bg-gray-100 border-gray-200 opacity-50 grayscale'
              }`}
            >
              <div className="text-amber-500 mb-2 flex justify-center"><Award className="w-8 h-8" /></div>
              <p className="text-xs font-bold text-gray-800 truncate">{badge.title}</p>
              <p className="text-[10px] text-gray-500 mt-0.5 truncate">
                {badge.isUnlocked ? 'Unlocked ' : 'Locked '}
              </p>
            </div>
          ))}
        </div>
      </div>
      <IntroVideoModal isOpen={showIntro} onClose={() => setShowIntro(false)} />
    </div>
  );
}
