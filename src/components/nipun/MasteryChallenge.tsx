'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Award, Sparkles, CheckCircle2, ArrowRight, RefreshCw, Trophy } from 'lucide-react';
import { MasteryChallengeResult } from '@/lib/nipun/types';

interface MasteryChallengeProps {
  conceptName?: string;
  onComplete?: (result: MasteryChallengeResult) => void;
}

export default function MasteryChallenge({ 
  conceptName = 'Paragraph Explorer', 
  onComplete 
}: MasteryChallengeProps) {
  const [step, setStep] = useState<'intro' | 'question' | 'result'>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);

  const challengeQuestions = [
    {
      question: 'Read: "Ravi has three yellow pencils and two blue pencils. How many pencils in total?"',
      options: ['5 Pencils', '6 Pencils', '1 Pencil'],
      answer: '5 Pencils',
    },
    {
      question: 'Which word connects these two ideas: "I wanted to play outside, ____ it started raining."',
      options: ['but', 'and', 'because'],
      answer: 'but',
    },
    {
      question: 'What is the main idea of: "Plants need sunlight, water, and soil to grow healthy leaves."',
      options: ['What plants need to grow', 'Why soil is brown', 'How to drink water'],
      answer: 'What plants need to grow',
    }
  ];

  const handleSelectOption = (opt: string) => {
    const isCorrect = opt === challengeQuestions[currentIdx].answer;
    if (isCorrect) setScore(prev => prev + 1);

    if (currentIdx + 1 < challengeQuestions.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setStep('result');
    }
  };

  const isPassed = score >= 2;
  const xpEarned = isPassed ? 100 : 30;

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-white rounded-3xl border-2 border-amber-300 shadow-xl text-center space-y-6">
      {step === 'intro' && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-4xl shadow-sm">
            
          </div>
          <span className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 bg-amber-500 text-white rounded-full">
            MASTERY CHALLENGE
          </span>
          <h2 className="text-2xl font-bold font-fredoka text-gray-900">
            Ready for your {conceptName} Boss Battle?
          </h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            Answer 3 quick challenge questions to verify your mastery, level up, and earn <strong className="text-amber-600">+100 XP</strong>!
          </p>

          <button
            onClick={() => setStep('question')}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-extrabold text-base rounded-2xl shadow-md hover:brightness-105 transition-all flex items-center justify-center gap-2"
          >
            Start Challenge Now 
          </button>
        </motion.div>
      )}

      {step === 'question' && (
        <div className="space-y-6 text-left">
          <div className="flex justify-between items-center text-xs font-bold text-gray-500 border-b pb-3">
            <span>Challenge Question {currentIdx + 1} of {challengeQuestions.length}</span>
            <span className="text-amber-600">Mastery Verification</span>
          </div>

          <h3 className="text-lg font-bold text-gray-900 font-fredoka leading-relaxed">
            {challengeQuestions[currentIdx].question}
          </h3>

          <div className="space-y-3">
            {challengeQuestions[currentIdx].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelectOption(opt)}
                className="w-full p-4 rounded-2xl border-2 border-gray-200 hover:border-amber-400 hover:bg-amber-50/50 text-left font-bold text-sm text-gray-800 transition-all flex justify-between items-center"
              >
                <span>{opt}</span>
                <span className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs text-gray-400">
                  {String.fromCharCode(65 + i)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'result' && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-amber-100 border-4 border-amber-400 flex items-center justify-center text-5xl shadow-md">
            {isPassed ? '' : ''}
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-fredoka text-gray-900">
              {isPassed ? 'MASTERY UNLOCKED! ' : 'Almost There! '}
            </h2>
            <p className="text-sm font-medium text-gray-600 mt-1">
              {isPassed 
                ? `Congratulations! You scored ${score}/${challengeQuestions.length} and mastered ${conceptName}!`
                : `You scored ${score}/${challengeQuestions.length}. Keep practicing to complete your mastery!`}
            </p>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-center gap-2 text-amber-900 font-bold text-sm">
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
            <span>Earned +{xpEarned} XP!</span>
          </div>

          <div className="flex gap-4">
            <Link
              href="/student/quest"
              className="flex-1 py-3.5 bg-emerald-600 text-white font-bold text-sm rounded-2xl hover:bg-emerald-700 transition-all shadow-sm"
            >
              Back to Quest Map
            </Link>
            {!isPassed && (
              <button
                onClick={() => { setStep('intro'); setCurrentIdx(0); setScore(0); }}
                className="py-3.5 px-5 border border-amber-300 text-amber-900 font-bold text-sm rounded-2xl hover:bg-amber-50 transition-all"
              >
                Retry Challenge
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
