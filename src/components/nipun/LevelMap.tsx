'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Calculator, Map, CheckCircle2, Lock, Star, 
  ArrowRight, Play, Award, Tent, Mountain, Trees, Droplets, Castle, User, Sparkles
} from 'lucide-react';
import { getReadingWorldStages, getNumeracyWorldStages } from '@/lib/nipun/syntheticData';
import { WorldStage } from '@/lib/nipun/types';
import { useStudent } from '@/lib/nipun/StudentContext';
import LevelUpModal from './LevelUpModal';

export default function LevelMap() {
  const router = useRouter();
  const { learner, isLoading } = useStudent();
  const [activeWorld, setActiveWorld] = useState<'reading' | 'numeracy'>('reading');
  const [selectedStage, setSelectedStage] = useState<WorldStage | null>(null);
  
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // Initialize to 0, will be updated in effect
  const [avatarPos, setAvatarPos] = useState(0);

  // Portal transition state
  const [isEnteringPortal, setIsEnteringPortal] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('leveled_up') === 'true') {
        setShowLevelUp(true);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  // Derive active index safely
  const stages = learner ? (activeWorld === 'reading' ? getReadingWorldStages(learner) : getNumeracyWorldStages(learner)) : [];
  const currentIndex = stages.findIndex(s => s.status === 'current');
  const activeIdx = currentIndex >= 0 ? currentIndex : 0;
  
  useEffect(() => {
    if (!learner) return;
    
    // Set initial start position
    const startIdx = (showLevelUp || !hasAnimated) && activeIdx > 0 ? activeIdx - 1 : activeIdx;
    
    if (showLevelUp && !hasAnimated) {
      setAvatarPos(startIdx); // Start at previous
      const timer = setTimeout(() => {
        setAvatarPos(activeIdx); // Move to new
        setHasAnimated(true);
      }, 3000); 
      return () => clearTimeout(timer);
    } else {
      setAvatarPos(activeIdx);
    }
  }, [showLevelUp, activeIdx, hasAnimated, learner]);

  const handleEnterAdventure = (pathway: string, level: string, isChallenge: boolean = false) => {
    setIsEnteringPortal(true);
    
    // Play a magical sound if possible
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance("Entering the caves!");
      u.rate = 1.1;
      u.pitch = 1.2;
      window.speechSynthesis.speak(u);
    }

    // Wait 2 seconds for the magical overlay to fill the screen
    setTimeout(() => {
      let url = `/student/practice?pathway=${pathway}&level=${level}`;
      if (isChallenge) url += '&challenge=true';
      router.push(url);
    }, 2000);
  };

  if (isLoading || !learner) return <div className="animate-pulse h-96 bg-gray-100 rounded-3xl" />;

  const positions = [
    { left: '30%', top: '75%' }, 
    { left: '38%', top: '55%' }, 
    { left: '68%', top: '63%' }, 
    { left: '78%', top: '40%' }, 
    { left: '53%', top: '15%' }  
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-center mb-8">
        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 inline-flex">
          <button
            onClick={() => setActiveWorld('reading')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              activeWorld === 'reading' 
                ? 'bg-amber-100 text-amber-700 shadow-sm' 
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Reading Quest
          </button>
          <button
            onClick={() => setActiveWorld('numeracy')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              activeWorld === 'numeracy' 
                ? 'bg-blue-100 text-blue-700 shadow-sm' 
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Calculator className="w-4 h-4" />
            Math Journey
          </button>
        </div>
      </div>

      <div className="relative w-full aspect-[4/3] sm:aspect-video rounded-[40px] border-[12px] border-amber-900 overflow-hidden shadow-2xl bg-sky-200 isolate">
        
        <div className="absolute top-4 left-4 z-30 pointer-events-none">
          <div className="bg-white/95 backdrop-blur-sm border-2 border-amber-900 px-6 py-2.5 rounded-full shadow-lg flex items-center gap-2">
            {activeWorld === 'reading' ? <BookOpen className="w-4 h-4 text-amber-600" /> : <Calculator className="w-4 h-4 text-blue-600" />}
            <span className="font-black font-fredoka uppercase text-amber-950 tracking-wider">
              {activeWorld === 'reading' ? 'Enigma Island: Reading' : 'Number Peaks: Math'}
            </span>
          </div>
        </div>

        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/enigma-island-map.jpg')" }}
        />

        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <path d="M 300 750 C 250 650, 300 550, 380 550 C 480 550, 550 650, 680 630 C 750 600, 850 500, 780 400 C 650 350, 600 250, 530 150" 
                fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="8" strokeLinecap="round" strokeDasharray="15 20" />
          
          <path d="M 300 750 C 250 650, 300 550, 380 550 C 480 550, 550 650, 680 630 C 750 600, 850 500, 780 400 C 650 350, 600 250, 530 150" 
                fill="none" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeDasharray="15 20" className="animate-[dash_30s_linear_infinite]" />
        </svg>

        <style>{`
          @keyframes dash {
            to { stroke-dashoffset: -1000; }
          }
        `}</style>

        <motion.div 
          className="absolute z-40 flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-[80%] pointer-events-none"
          initial={false}
          animate={{ 
            left: positions[avatarPos]?.left || positions[0].left, 
            top: positions[avatarPos]?.top || positions[0].top
          }}
          transition={{ 
            type: "spring", 
            stiffness: 40, 
            damping: 12,
            delay: 0.5
          }}
        >
          <motion.div 
            animate={{ y: [-5, 5, -5] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="relative"
          >
            <div className="w-16 h-16 bg-white rounded-full border-4 border-amber-900 flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.6)] overflow-hidden">
              <img src="/images/avatar-boy.jpg" alt="Player Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="w-10 h-3 bg-black/40 rounded-full blur-sm absolute -bottom-4 left-1/2 -translate-x-1/2"></div>
            
            <AnimatePresence>
              {showLevelUp && !hasAnimated && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1.5, rotate: 180 }}
                  exit={{ opacity: 0, scale: 2 }}
                  className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
                >
                  <Sparkles className="w-12 h-12 text-yellow-400 fill-yellow-400 absolute -top-8 -left-4" />
                  <Sparkles className="w-8 h-8 text-emerald-400 fill-emerald-400 absolute -bottom-4 -right-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        <div className="absolute inset-0 z-10 w-full h-full">
          {stages.map((stage, idx) => {
            const isCurrent = stage.status === 'current';
            const isMastered = stage.status === 'mastered';
            const isLocked = stage.status === 'locked';

            const pos = positions[Math.min(idx, positions.length - 1)];
            const MapIcon = [Tent, Trees, Mountain, Droplets, Castle][Math.min(idx, 4)];
            
            const bgClass = isCurrent 
              ? 'bg-gradient-to-b from-amber-400 to-yellow-600 border-yellow-200 text-white shadow-[0_0_20px_rgba(251,191,36,0.8)] scale-110' 
              : isMastered 
              ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 border-emerald-200 text-white' 
              : 'bg-gradient-to-b from-gray-300 to-gray-400 border-gray-100 text-gray-500 opacity-90';

            return (
              <div 
                key={stage.id} 
                className="absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: pos.left, top: pos.top }}
              >
                <div className={`absolute ${idx % 2 === 0 ? 'left-full ml-4' : 'right-full mr-4'} top-1/2 -translate-y-1/2 whitespace-nowrap z-20 pointer-events-none transition-all duration-300 opacity-100 sm:opacity-90 group-hover:opacity-100 group-hover:scale-105`}>
                  <div className="bg-[#FFFCE1]/95 px-4 py-2 rounded-xl border-4 border-amber-900/30 shadow-xl relative backdrop-blur-sm">
                    <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#FFFCE1]/95 border-amber-900/30 rotate-45 ${idx % 2 === 0 ? '-left-2 border-l-4 border-b-4' : '-right-2 border-r-4 border-t-4'}`}></div>
                    <span className="block font-fredoka font-black text-amber-950 text-sm md:text-base drop-shadow-sm">{stage.name}</span>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-700">
                      {isMastered ? '✨ Mastered' : isCurrent ? '🔥 Active Quest' : '🔒 Locked'}
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: isLocked ? 1 : 1.2, y: isLocked ? 0 : -8 }}
                  whileTap={{ scale: isLocked ? 1 : 0.95 }}
                  onClick={() => !isLocked && setSelectedStage(stage)}
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex flex-col items-center justify-center cursor-pointer shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-all border-4 ${bgClass} ${isCurrent ? 'ring-4 ring-white/50 animate-pulse' : ''} ${isLocked ? 'cursor-not-allowed filter grayscale' : ''}`}
                >
                  <MapIcon className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-md" />
                  
                  <div className="absolute -top-3 -right-3 z-30">
                    {isMastered && (
                      <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg border-2 border-white">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                    {isLocked && (
                      <div className="w-7 h-7 rounded-full bg-gray-500 text-white flex items-center justify-center shadow-lg border-2 border-white">
                        <Lock className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </motion.button>
              </div>
            );
          })}
        </div>
      </div>

      {selectedStage && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl bg-white border-2 border-amber-300 shadow-xl"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center shadow-sm text-amber-600">{activeWorld === "reading" ? <BookOpen className="w-8 h-8" /> : <Calculator className="w-8 h-8" />}</div>
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
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              Reward: +{selectedStage.xpReward} XP upon completion
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleEnterAdventure(selectedStage.pathway, selectedStage.level, false)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Practice Now
              </button>
              {selectedStage.status === 'current' && (
                <button
                  onClick={() => handleEnterAdventure(selectedStage.pathway, selectedStage.level, true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
                >
                  <Award className="w-4 h-4" />
                  Take Mastery Challenge
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
      
      {showLevelUp && (
        <LevelUpModal 
          isOpen={true} 
          onClose={() => setShowLevelUp(false)} 
          newLevel="Paragraph Explorer" 
          badgesEarned={1} 
        />
      )}

      {/* PORTAL TRANSITION OVERLAY */}
      <AnimatePresence>
        {isEnteringPortal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center pointer-events-none"
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Sparkles className="w-24 h-24 text-amber-500 fill-amber-500" />
            </motion.div>
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 text-4xl sm:text-6xl font-black text-white font-fredoka tracking-widest uppercase text-center"
              style={{ textShadow: '0 0 20px rgba(245, 158, 11, 0.8)' }}
            >
              Entering the Adventure...
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
