'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Award, 
  Flame, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  Zap, 
  Trophy, 
  BookOpen, 
  Layers, 
  Hash, 
  Calculator, 
  Crown, 
  Star, 
  ChevronRight, 
  ShieldCheck, 
  Share2,
  Medal
} from 'lucide-react';
import { Learner, Badge } from '@/lib/nipun/types';
import { useStudent } from '@/lib/nipun/StudentContext';
import { Loader2 } from 'lucide-react';

interface AchievementsProps {
  learner?: Learner;
}

interface BadgeStyle {
  emoji: string;
  tier: string;
  tierBg: string;
  tierText: string;
  gradient: string;
  borderGlow: string;
  icon: React.ReactNode;
  xpReward: number;
  proof: string;
}

const BADGE_MAP: Record<string, BadgeStyle> = {
  'badge-1': {
    emoji: '🔤',
    tier: 'GOLD TIER 🥇',
    tierBg: 'bg-amber-500/15 border-amber-300',
    tierText: 'text-amber-800',
    gradient: 'from-emerald-400 via-teal-500 to-emerald-600',
    borderGlow: 'border-emerald-300 ring-4 ring-emerald-100/60 shadow-[0_12px_30px_-8px_rgba(16,185,129,0.35)]',
    icon: <BookOpen className="w-8 h-8 text-emerald-600" />,
    xpReward: 50,
    proof: 'Recognized 26/26 letters fluently in diagnostic quest',
  },
  'badge-2': {
    emoji: '🧱',
    tier: 'DIAMOND TIER 💎',
    tierBg: 'bg-sky-500/15 border-sky-300',
    tierText: 'text-sky-800',
    gradient: 'from-sky-400 via-blue-500 to-indigo-600',
    borderGlow: 'border-sky-300 ring-4 ring-sky-100/60 shadow-[0_12px_30px_-8px_rgba(14,165,233,0.35)]',
    icon: <Layers className="w-8 h-8 text-sky-600" />,
    xpReward: 75,
    proof: 'Read 50 foundational sight words in under 2 minutes',
  },
  'badge-3': {
    emoji: '🔢',
    tier: 'GOLD TIER 🥇',
    tierBg: 'bg-amber-500/15 border-amber-300',
    tierText: 'text-amber-800',
    gradient: 'from-amber-400 via-orange-500 to-amber-600',
    borderGlow: 'border-amber-300 ring-4 ring-amber-100/60 shadow-[0_12px_30px_-8px_rgba(245,158,11,0.35)]',
    icon: <Hash className="w-8 h-8 text-amber-600" />,
    xpReward: 60,
    proof: 'Identified 2-digit numbers and tens/ones place value with 100% accuracy',
  },
  'badge-4': {
    emoji: '🔥',
    tier: 'SPECIAL STREAK 🔥',
    tierBg: 'bg-rose-500/15 border-rose-300',
    tierText: 'text-rose-800',
    gradient: 'from-rose-500 via-orange-500 to-amber-500',
    borderGlow: 'border-rose-300 ring-4 ring-rose-100/60 shadow-[0_12px_30px_-8px_rgba(244,63,94,0.35)]',
    icon: <Flame className="w-8 h-8 text-rose-600 animate-pulse" />,
    xpReward: 100,
    proof: 'Logged in and completed practice quests 5 days in a row',
  },
  'badge-5': {
    emoji: '🏰',
    tier: 'LEGENDARY 👑',
    tierBg: 'bg-purple-500/15 border-purple-300',
    tierText: 'text-purple-800',
    gradient: 'from-purple-500 via-indigo-600 to-purple-800',
    borderGlow: 'border-purple-200 shadow-none',
    icon: <Sparkles className="w-8 h-8 text-purple-600" />,
    xpReward: 150,
    proof: 'Read a full Santoor Class 3 story and answered 4 comprehension questions',
  },
  'badge-6': {
    emoji: '➗',
    tier: 'LEGENDARY 👑',
    tierBg: 'bg-indigo-500/15 border-indigo-300',
    tierText: 'text-indigo-800',
    gradient: 'from-indigo-500 via-blue-600 to-slate-800',
    borderGlow: 'border-indigo-200 shadow-none',
    icon: <Calculator className="w-8 h-8 text-indigo-600" />,
    xpReward: 150,
    proof: 'Solved 3-digit by 1-digit division with equal grouping models',
  },
};

function getBadgeStyle(badge: Badge): BadgeStyle {
  if (BADGE_MAP[badge.id]) return BADGE_MAP[badge.id];

  const t = badge.title.toLowerCase();
  if (t.includes('letter')) return BADGE_MAP['badge-1'];
  if (t.includes('word')) return BADGE_MAP['badge-2'];
  if (t.includes('number')) return BADGE_MAP['badge-3'];
  if (t.includes('streak')) return BADGE_MAP['badge-4'];
  if (t.includes('story')) return BADGE_MAP['badge-5'];
  if (t.includes('division')) return BADGE_MAP['badge-6'];

  return {
    emoji: '🎖️',
    tier: 'GOLD TIER 🥇',
    tierBg: 'bg-amber-500/15 border-amber-300',
    tierText: 'text-amber-800',
    gradient: 'from-amber-400 to-orange-500',
    borderGlow: 'border-amber-300 ring-4 ring-amber-100/60 shadow-md',
    icon: <Award className="w-8 h-8 text-amber-600" />,
    xpReward: 50,
    proof: 'Completed foundational learning quest',
  };
}

export default function Achievements({ learner: propLearner }: AchievementsProps) {
  const { learner: contextLearner, isLoading } = useStudent();
  const learner = propLearner || contextLearner;
  const [activeModalBadge, setActiveModalBadge] = useState<Badge | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }
  if (!learner) return null;

  const unlockedCount = learner.badges.filter(b => b.isUnlocked).length;
  const totalCount = learner.badges.length;
  const unlockPercent = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/student"
            className="p-3 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm transition-transform active:scale-95"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold font-fredoka text-gray-900 flex items-center gap-2.5">
              <Trophy className="w-8 h-8 text-amber-500 drop-shadow-sm" />
              Trophy Cabinet & Badges
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 font-medium mt-0.5">
              Earn 3D mastery badges by practicing daily quests and unlocking new learning levels!
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-charcoal font-black px-4 py-2 rounded-2xl shadow-sm border-2 border-white flex items-center gap-2 self-start sm:self-auto">
          <Zap className="w-5 h-5 text-white fill-white animate-pulse" />
          <span className="text-sm font-fredoka">{learner.xp} Total XP</span>
        </div>
      </div>

      {/* SUMMARY STAT CARDS (WITH REAL VIBRANT ICONS) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Badges Unlocked */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.01 }}
          className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-white border-2 border-amber-300/80 shadow-sm flex items-center gap-5 relative overflow-hidden group"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-400 to-yellow-400 text-white flex items-center justify-center shadow-lg border-2 border-white/60 shrink-0 group-hover:rotate-6 transition-transform">
            <Award className="w-9 h-9 drop-shadow-xs" />
          </div>
          <div className="flex-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <Medal className="w-4 h-4 text-amber-600" />
              Badges Unlocked
            </span>
            <h3 className="text-3xl font-black font-fredoka text-amber-950 mt-1">
              {unlockedCount} <span className="text-lg text-gray-400 font-bold">/ {totalCount}</span>
            </h3>
            <div className="w-full bg-amber-200/60 h-2 rounded-full mt-2.5 overflow-hidden border border-amber-300/40">
              <div 
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-700" 
                style={{ width: `${unlockPercent}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Learning Streak */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.01 }}
          className="p-6 rounded-3xl bg-gradient-to-br from-rose-500/10 via-orange-500/5 to-white border-2 border-rose-300/80 shadow-sm flex items-center gap-5 relative overflow-hidden group"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 via-orange-500 to-amber-500 text-white flex items-center justify-center shadow-lg border-2 border-white/60 shrink-0 group-hover:scale-110 transition-transform">
            <Flame className="w-9 h-9 animate-bounce" />
          </div>
          <div className="flex-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-600" />
              Learning Streak
            </span>
            <h3 className="text-3xl font-black font-fredoka text-rose-950 mt-1 flex items-center gap-2">
              <span>{learner.streakDays} Days</span>
              <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold border border-rose-300">
                Active 🔥
              </span>
            </h3>
            <p className="text-xs font-semibold text-gray-500 mt-1">Next reward at 7 Days!</p>
          </div>
        </motion.div>

        {/* Total XP */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.01 }}
          className="p-6 rounded-3xl bg-gradient-to-br from-yellow-500/10 via-amber-500/5 to-white border-2 border-yellow-300/80 shadow-sm flex items-center gap-5 relative overflow-hidden group"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-yellow-400 via-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg border-2 border-white/60 shrink-0 group-hover:-rotate-6 transition-transform">
            <Zap className="w-9 h-9 fill-white drop-shadow-xs" />
          </div>
          <div className="flex-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-600 fill-amber-600" />
              Total Mastery XP
            </span>
            <h3 className="text-3xl font-black font-fredoka text-amber-950 mt-1">
              {learner.xp} XP
            </h3>
            <p className="text-xs font-semibold text-gray-500 mt-1">Class 3 Master Rank</p>
          </div>
        </motion.div>
      </div>

      {/* 3D GAMING INDUSTRY BADGES CABINET */}
      <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] border-2 border-amber-200/80 shadow-sm space-y-8">
        <div className="flex items-center justify-between border-b border-gray-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shadow-xs">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black font-fredoka text-gray-900">
                All Mastery Badges
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Tap any badge to view skill evidence and unlock details
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            {unlockedCount} of {totalCount} Collected
          </span>
        </div>

        {/* BADGES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {learner.badges.map(badge => {
            const config = getBadgeStyle(badge);

            return (
              <motion.div
                key={badge.id}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveModalBadge(badge)}
                className={`group cursor-pointer rounded-[2.2rem] p-6 border-3 transition-all relative flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-xl ${
                  badge.isUnlocked
                    ? `bg-white ${config.borderGlow}`
                    : 'bg-slate-50/90 border-slate-200 opacity-70 hover:opacity-100'
                }`}
              >
                <div>
                  {/* Top Tier Bar */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${config.tierBg} ${config.tierText} flex items-center gap-1`}>
                      <Crown className="w-3 h-3" /> {config.tier}
                    </span>

                    {badge.isUnlocked ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Unlocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-slate-200 text-slate-700 text-[10px] font-black px-2.5 py-1 rounded-full">
                        <Lock className="w-3.5 h-3.5" /> Locked
                      </span>
                    )}
                  </div>

                  {/* 3D Shield Medallion */}
                  <div className="flex justify-center my-4">
                    <div className={`w-28 h-28 rounded-full p-1.5 bg-gradient-to-tr ${config.gradient} shadow-xl flex items-center justify-center relative group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                      <div className="w-full h-full bg-white rounded-full flex flex-col items-center justify-center shadow-inner relative overflow-hidden border-2 border-white">
                        {badge.isUnlocked ? (
                          <span className="text-4xl drop-shadow-md">{config.emoji}</span>
                        ) : (
                          <Lock className="w-10 h-10 text-slate-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Title & XP */}
                  <div className="text-center mt-2">
                    <h3 className="font-fredoka font-bold text-xl text-gray-900 group-hover:text-amber-600 transition-colors">
                      {badge.title}
                    </h3>
                    <div className="inline-flex items-center gap-1 mt-1 bg-amber-100/90 border border-amber-300 text-amber-800 text-[11px] font-black px-3 py-0.5 rounded-full">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> +{config.xpReward} XP Reward
                    </div>
                    <p className="text-xs text-gray-600 font-medium leading-relaxed mt-2.5 line-clamp-2">
                      {badge.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-4 border-t border-gray-100 mt-5 flex items-center justify-between">
                  {badge.isUnlocked && badge.unlockedAt ? (
                    <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                      <span>Earned on {badge.unlockedAt}</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-gray-400">
                      Complete Quest to Unlock
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 3D BADGE DETAIL SHOWCASE MODAL */}
      <AnimatePresence>
        {activeModalBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setActiveModalBadge(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-md w-full p-6 border-4 border-amber-300 shadow-2xl relative space-y-5"
            >
              <button
                onClick={() => setActiveModalBadge(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
              >
                ✕
              </button>

              {(() => {
                const config = getBadgeStyle(activeModalBadge);

                return (
                  <>
                    <div className="text-center space-y-3">
                      <div className={`w-28 h-28 mx-auto rounded-full p-1.5 bg-gradient-to-tr ${config.gradient} shadow-2xl flex items-center justify-center animate-bounce`}>
                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                          <span className="text-5xl">{config.emoji}</span>
                        </div>
                      </div>

                      <h3 className="font-fredoka font-bold text-2xl text-gray-900">
                        {activeModalBadge.title}
                      </h3>
                      <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 border border-amber-300 px-3.5 py-1 rounded-full text-xs font-black">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                        <span>+{config.xpReward} Mastery XP Earned</span>
                      </div>
                    </div>

                    <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/80 space-y-3">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                          Requirement & Description
                        </span>
                        <p className="text-xs font-medium text-gray-800 mt-0.5 leading-relaxed">
                          {activeModalBadge.description}
                        </p>
                      </div>

                      <div className="border-t border-amber-200/50 pt-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> ASER / NCERT Mastery Evidence
                        </span>
                        <p className="text-xs font-bold text-emerald-800 mt-0.5">
                          {config.proof}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => {
                          alert(`Badge "${activeModalBadge.title}" link copied to share with teacher and parents! 🎉`);
                        }}
                        className="flex-1 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-charcoal font-black rounded-full text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
                      >
                        <Share2 className="w-4 h-4" /> Share Badge
                      </button>
                      <button
                        onClick={() => setActiveModalBadge(null)}
                        className="py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-full text-sm"
                      >
                        Close
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
