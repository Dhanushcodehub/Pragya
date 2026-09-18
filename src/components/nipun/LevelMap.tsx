'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, Lock, Sparkles, ArrowLeft, Play, Award, Zap } from 'lucide-react';
import { Learner, WorldStage } from '@/lib/nipun/types';
import { MOCK_ACTIVE_STUDENT, getReadingWorldStages, getNumeracyWorldStages } from '@/lib/nipun/syntheticData';

const C = {
  cream: '#fef9f2',
  primary: '#1d1c18',
  onPrimary: '#ffffff',
  surfaceContainerLow: '#f8f3ec',
  surfaceContainer: '#f2ede6',
  outline: '#76777d',
};

interface LevelMapProps {
  learner?: Learner;
}

export default function LevelMap({ learner = MOCK_ACTIVE_STUDENT }: LevelMapProps) {
  const searchParams = useSearchParams();
  const initialWorld = searchParams?.get('world') === 'numeracy' ? 'numeracy' : 'reading';

  const [activeWorld, setActiveWorld] = useState<'reading' | 'numeracy'>(initialWorld);
  const [selectedStage, setSelectedStage] = useState<WorldStage | null>(null);

  const stages = activeWorld === 'reading' 
    ? getReadingWorldStages(learner) 
    : getNumeracyWorldStages(learner);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* ─── HEADER & WORLD SWITCHER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/student"
            className="p-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 
              className="text-2xl font-bold font-fredoka text-gray-900"
            >
              Visual Quest Map 🗺️
            </h1>
            <p className="text-xs text-gray-600 font-medium">
              Tap any unlocked level node to start practicing!
            </p>
          </div>
        </div>

        {/* World Switcher Tabs */}
        <div className="flex bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm shrink-0">
          <button
            onClick={() => { setActiveWorld('reading'); setSelectedStage(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeWorld === 'reading'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>📚</span> Reading World
          </button>
          <button
            onClick={() => { setActiveWorld('numeracy'); setSelectedStage(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeWorld === 'numeracy'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>🔢</span> Numeracy World
          </button>
        </div>
      </div>

      {/* ─── QUEST MAP CANVAS ─── */}
      <div className="bg-gradient-to-b from-amber-50/50 via-emerald-50/30 to-amber-50/50 p-6 sm:p-10 rounded-3xl border-2 border-emerald-100 shadow-sm relative overflow-hidden">
        <div className="text-center mb-8">
          <span className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 bg-white text-emerald-800 rounded-full border border-emerald-200 shadow-xs">
            {activeWorld === 'reading' ? '📖 READING PATHWAY' : '🧮 NUMERACY PATHWAY'}
          </span>
        </div>

        {/* Vertical Stepper Nodes Path */}
        <div className="relative max-w-md mx-auto py-4">
          {/* Connector Line */}
          <div className="absolute left-1/2 top-8 bottom-8 -translate-x-1/2 w-2 bg-gradient-to-b from-emerald-300 via-amber-300 to-gray-200 rounded-full z-0" />

          <div className="space-y-12 relative z-10">
            {stages.map((stage, idx) => {
              const isEven = idx % 2 === 0;
              const isCurrent = stage.status === 'current';
              const isMastered = stage.status === 'mastered';
              const isLocked = stage.status === 'locked';

              return (
                <div key={stage.id} className="relative flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: isLocked ? 1 : 1.08 }}
                    whileTap={{ scale: isLocked ? 1 : 0.95 }}
                    onClick={() => !isLocked && setSelectedStage(stage)}
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex flex-col items-center justify-center cursor-pointer shadow-lg transition-all relative ${
                      isCurrent
                        ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white ring-4 ring-amber-300 ring-offset-4 ring-offset-emerald-50 animate-pulse'
                        : isMastered
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-2 border-emerald-300'
                        : 'bg-gray-200 text-gray-400 border-2 border-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <span className="text-3xl sm:text-4xl">{stage.icon}</span>
                    <span className="text-[10px] font-extrabold mt-0.5 truncate max-w-[80px] px-1">
                      {stage.name}
                    </span>

                    {/* Status Badge */}
                    <div className="absolute -top-2 -right-2">
                      {isMastered && (
                        <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-md border-2 border-white">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                      {isCurrent && (
                        <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-md border-2 border-white font-bold text-xs">
                          ★
                        </div>
                      )}
                      {isLocked && (
                        <div className="w-7 h-7 rounded-full bg-gray-400 text-white flex items-center justify-center shadow-md border-2 border-white">
                          <Lock className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Floating Info Tag on Side */}
                  <div className={`absolute top-1/2 -translate-y-1/2 w-36 sm:w-44 text-xs font-semibold ${
                    isEven ? 'right-full mr-4 text-right' : 'left-full ml-4 text-left'
                  }`}>
                    <span className={`inline-block px-3 py-1.5 rounded-xl border shadow-xs ${
                      isCurrent
                        ? 'bg-amber-100 border-amber-300 text-amber-950 font-bold'
                        : isMastered
                        ? 'bg-emerald-100 border-emerald-200 text-emerald-900'
                        : 'bg-gray-100 border-gray-200 text-gray-400'
                    }`}>
                      {stage.name}
                      <span className="block text-[10px] font-normal opacity-80">
                        {isMastered ? 'Mastered ✓' : isCurrent ? `${stage.progressPercent}% Active` : 'Locked 🔒'}
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── STAGE SELECTION MODAL / DRAWER ─── */}
      {selectedStage && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl bg-white border-2 border-amber-300 shadow-xl"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl shadow-sm">
                {selectedStage.icon}
              </div>
              <div>
                <span className="text-xs font-bold uppercase text-amber-600">
                  {selectedStage.status === 'mastered' ? 'Mastered Concept' : 'Active Learning Quest'}
                </span>
                <h3 className="text-xl font-bold font-fredoka text-gray-900">
                  {selectedStage.name}
                </h3>
                <p className="text-xs text-gray-600 font-medium">
                  {selectedStage.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedStage(null)}
              className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1"
            >
              ✕
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 items-center justify-between border-t pt-4">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700">
              <Zap className="w-4 h-4 fill-amber-400 text-amber-500" />
              Reward: +{selectedStage.xpReward} XP upon completion
            </div>

            <div className="flex gap-3">
              <Link
                href={`/student/practice?pathway=${selectedStage.pathway}&level=${selectedStage.level}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Practice Now
              </Link>
              {selectedStage.status === 'current' && (
                <Link
                  href={`/student/practice?pathway=${selectedStage.pathway}&challenge=true`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
                >
                  <Award className="w-4 h-4" />
                  Take Mastery Challenge
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
