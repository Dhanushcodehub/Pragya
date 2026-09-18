'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Sparkles, Star, Zap } from 'lucide-react';

interface LevelUpModalProps {
  level: number | null;
  onClose: () => void;
}

export default function LevelUpModal({ level, onClose }: LevelUpModalProps) {
  if (level === null) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#101b33]/90 backdrop-blur-md overflow-hidden">
        {/* Background glow */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] bg-[#3b82f6]/20 rounded-full blur-[120px]"></div>
          <div className="absolute w-[40vw] h-[40vw] max-w-[300px] max-h-[300px] bg-[#fbbf24]/20 rounded-full blur-[100px]"></div>
        </motion.div>

        {/* Floating stars in background */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 100, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 1, 0], 
              y: -600, 
              scale: [0, Math.random() * 1 + 0.5, 0],
              rotate: 360
            }}
            transition={{ 
              duration: 3 + Math.random() * 3, 
              repeat: Infinity, 
              delay: Math.random() * 2,
              ease: "linear"
            }}
            className="absolute"
            style={{ 
              left: `${Math.random() * 100}%`,
              bottom: '-10%',
            }}
          >
            <Star className={`w-3 h-3 md:w-5 md:h-5 ${i % 2 === 0 ? 'text-amber-200' : 'text-blue-200'} fill-current opacity-70`} />
          </motion.div>
        ))}

        <motion.div 
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
          className="relative z-10 flex flex-col items-center max-w-md w-full px-6"
        >
          <p className="text-blue-100 text-xs md:text-sm font-black uppercase tracking-[0.2em] mb-8 drop-shadow-md">
            You have reached the next level!
          </p>

          
          {/* Badge Container */}
          <div className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center mb-6 mt-4">
            {/* Golden glowing rays */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-50%] opacity-50 pointer-events-none"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0deg, rgba(251, 191, 36, 0.4) 15deg, transparent 30deg, transparent 60deg, rgba(251, 191, 36, 0.4) 75deg, transparent 90deg, transparent 120deg, rgba(251, 191, 36, 0.4) 135deg, transparent 150deg, transparent 180deg, rgba(251, 191, 36, 0.4) 195deg, transparent 210deg, transparent 240deg, rgba(251, 191, 36, 0.4) 255deg, transparent 270deg, transparent 300deg, rgba(251, 191, 36, 0.4) 315deg, transparent 330deg)',
                filter: 'blur(4px)'
              }}
            ></motion.div>
            
            {/* Left Wing (Geometric like reference) */}
            <motion.div 
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', bounce: 0.5, delay: 0.3, duration: 0.8 }}
              className="absolute -left-8 md:-left-12 top-1/2 -translate-y-1/2"
            >
              <svg width="90" height="90" viewBox="0 0 120 120" fill="none" className="drop-shadow-lg">
                <defs>
                  <linearGradient id="wingGrad" x1="120" y1="0" x2="0" y2="120" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FCD34D" />
                    <stop offset="100%" stopColor="#D97706" />
                  </linearGradient>
                </defs>
                <path d="M 120 45 L 40 20 L 25 35 L 50 60 L 20 70 L 100 85 Z" fill="url(#wingGrad)" />
                <path d="M 120 45 L 40 20 L 25 35 L 50 60 Z" fill="#FEF3C7" opacity="0.3" />
              </svg>
            </motion.div>

            {/* Right Wing (Geometric like reference) */}
            <motion.div 
              initial={{ x: -60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', bounce: 0.5, delay: 0.3, duration: 0.8 }}
              className="absolute -right-8 md:-right-12 top-1/2 -translate-y-1/2 transform scale-x-[-1]"
            >
              <svg width="90" height="90" viewBox="0 0 120 120" fill="none" className="drop-shadow-lg">
                <path d="M 120 45 L 40 20 L 25 35 L 50 60 L 20 70 L 100 85 Z" fill="url(#wingGrad)" />
                <path d="M 120 45 L 40 20 L 25 35 L 50 60 Z" fill="#FEF3C7" opacity="0.3" />
              </svg>
            </motion.div>

            {/* Central Industry Level 3D Shield (Reference Match) */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.6, duration: 0.8, delay: 0.1 }}
              className="relative w-40 h-40 md:w-48 md:h-48 z-10 drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)]"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="shieldBase" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FEF3C7" />
                    <stop offset="40%" stopColor="#FBBF24" />
                    <stop offset="100%" stopColor="#B45309" />
                  </linearGradient>
                  
                  <linearGradient id="shieldInner" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#92400E" />
                  </linearGradient>

                  <linearGradient id="shieldCenter" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FDE68A" />
                    <stop offset="50%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#D97706" />
                  </linearGradient>
                </defs>
                
                {/* Outer thick rim */}
                <path d="M50 15 L95 25 L95 65 L50 95 L5 65 L5 25 Z" fill="url(#shieldBase)" stroke="#FFFBEB" strokeWidth="1" strokeOpacity="0.5" />
                
                {/* Inner darker inset */}
                <path d="M50 22 L87 31 L87 61 L50 85 L13 61 L13 31 Z" fill="url(#shieldInner)" />
                
                {/* Center glowing plate */}
                <path d="M50 26 L81 35 L81 58 L50 79 L19 58 L19 35 Z" fill="url(#shieldCenter)" stroke="#FDE68A" strokeWidth="0.5" />
                
                {/* Subtle top highlight on center plate (replacing the bad box shine) */}
                <path d="M50 26 L81 35 L50 45 L19 35 Z" fill="#FFFFFF" opacity="0.2" />
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white pb-3">
                <span className="text-[11px] md:text-sm font-black uppercase tracking-[0.25em] text-amber-100 drop-shadow-md mb-[-2px]">Level</span>
                <span 
                  className="text-5xl md:text-6xl font-black font-fredoka text-white" 
                  style={{ 
                    textShadow: '0 4px 0 #D97706, 0 8px 15px rgba(0,0,0,0.5)',
                  }}
                >
                  {level}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Level Up Text with nice gradient and shadow */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mb-8 text-center"
          >
            <h2 
              className="text-3xl md:text-4xl font-black font-fredoka tracking-wide"
              style={{
                background: 'linear-gradient(to bottom, #FEF3C7, #F59E0B)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.4))'
              }}
            >
              LEVEL UP!
            </h2>
          </motion.div>

          
          {/* Rewards Section with Ribbon */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="w-full mt-4 flex flex-col items-center"
          >
            {/* Ribbon */}
            <div className="relative w-56 md:w-64 h-8 md:h-10 flex items-center justify-center mb-6 drop-shadow-lg z-10">
              {/* Ribbon tails */}
              <div className="absolute -left-4 top-2 w-8 h-10 bg-amber-700 border-l-[16px] border-l-transparent transform -skew-x-12"></div>
              <div className="absolute -right-4 top-2 w-8 h-10 bg-amber-700 border-r-[16px] border-r-transparent transform skew-x-12"></div>
              
              {/* Ribbon center */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 rounded-sm shadow-md flex items-center justify-center border-y border-amber-300">
                <div className="flex items-center gap-2">
                  <Star className="w-3 h-3 text-amber-100 fill-current opacity-70" />
                  <span className="text-[11px] md:text-xs font-black text-amber-950 uppercase tracking-[0.2em]">Rewards</span>
                  <Star className="w-3 h-3 text-amber-100 fill-current opacity-70" />
                </div>
              </div>
            </div>

            {/* Reward Icons inside a subtle transparent dark blue glass box */}
            <div className="flex justify-center gap-6 md:gap-10 -mt-4 bg-[#1a2b4c]/40 px-10 py-6 rounded-3xl border border-blue-400/20 backdrop-blur-sm shadow-inner">
              {[
                { icon: Zap, color: 'bg-blue-500' },
                { icon: Sparkles, color: 'bg-emerald-500' },
                { icon: Award, color: 'bg-rose-500' }
              ].map((reward, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ scale: 0, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 0.9 + (idx * 0.1), type: 'spring' }}
                  className="flex flex-col items-center"
                >
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${reward.color} flex items-center justify-center border-t border-l border-white/40 shadow-lg relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
                    <reward.icon className="w-7 h-7 md:w-9 md:h-9 text-white drop-shadow-md relative z-10" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            onClick={onClose}
            className="mt-8 px-10 py-4 bg-gradient-to-b from-white to-gray-200 text-[#101b33] font-black text-sm md:text-base uppercase tracking-widest rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.3)] border-b-4 border-gray-300"
          >
            Awesome!
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
