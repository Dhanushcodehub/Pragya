'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, CheckCircle2, XCircle, ArrowLeft, Sparkles, Award, ArrowRight } from 'lucide-react';
import { MOCK_PRACTICE_QUESTIONS } from '@/lib/nipun/syntheticData';
import MasteryChallenge from './MasteryChallenge';

export default function PracticeZone() {
  const searchParams = useSearchParams();
  const pathwayParam = searchParams?.get('pathway') || 'reading';
  const isChallenge = searchParams?.get('challenge') === 'true';

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [totalXp, setTotalXp] = useState(0);
  const [showChallenge, setShowChallenge] = useState(isChallenge);

  const questions = MOCK_PRACTICE_QUESTIONS.filter(q => q.pathway === pathwayParam) || MOCK_PRACTICE_QUESTIONS;
  const currentQ = questions[currentIdx] || questions[0];

  // Speech synthesis helper
  const handlePlayAudio = (text?: string) => {
    if ('speechSynthesis' in window && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85; // Slightly slower for primary kids
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectOption = (opt: string) => {
    if (isSubmitted) return;
    setSelectedOption(opt);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption) return;
    setIsSubmitted(true);
    if (selectedOption === currentQ.correctAnswer) {
      setTotalXp(prev => prev + currentQ.xp);
      handlePlayAudio('Great job! That is correct!');
    } else {
      handlePlayAudio('Good try! Let us review the correct answer.');
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setShowChallenge(true);
    }
  };

  if (showChallenge) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <Link
            href="/student/quest"
            className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="text-xs font-bold text-gray-600">Back to Quest Map</span>
        </div>
        <MasteryChallenge conceptName={pathwayParam === 'reading' ? 'Paragraph Explorer' : 'Subtraction Solver'} />
      </div>
    );
  }

  const isCorrect = selectedOption === currentQ.correctAnswer;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/*  PRACTICE HEADER  */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/student/quest"
            className="p-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-xs font-bold uppercase text-emerald-700">
              {pathwayParam === 'reading' ? ' READING PRACTICE' : ' NUMERACY PRACTICE'}
            </span>
            <h1 className="text-xl font-bold font-fredoka text-gray-900">
              Question {currentIdx + 1} of {questions.length}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs shadow-xs">
          <Sparkles className="w-4 h-4 fill-amber-400 text-amber-500" />
          <span>+{totalXp} XP Earned</span>
        </div>
      </div>

      {/*  QUESTION CARD  */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border-2 border-emerald-200 shadow-lg space-y-6">
        {/* Audio Prompt Button */}
        <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
          <span className="text-xs font-bold text-emerald-900 flex items-center gap-2">
            Read aloud or tap to listen
          </span>
          <button
            onClick={() => handlePlayAudio(currentQ.audioPrompt || currentQ.content)}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <Volume2 className="w-4 h-4" />
            Listen
          </button>
        </div>

        {/* Question Text */}
        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-fredoka text-gray-900 leading-snug tracking-wide">
            "{currentQ.content}"
          </h2>
        </div>

        {/* Answer Options */}
        <div className="space-y-3">
          {currentQ.options.map((opt, i) => {
            const isSelected = selectedOption === opt;
            let btnStyle = 'bg-white border-2 border-gray-200 text-gray-800 hover:border-emerald-400 hover:bg-emerald-50/40';

            if (isSubmitted) {
              if (opt === currentQ.correctAnswer) {
                btnStyle = 'bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-extrabold shadow-sm';
              } else if (isSelected) {
                btnStyle = 'bg-amber-100 border-2 border-amber-400 text-amber-950 font-bold';
              } else {
                btnStyle = 'bg-gray-100 opacity-50 border-gray-200 text-gray-400';
              }
            } else if (isSelected) {
              btnStyle = 'bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-bold shadow-sm';
            }

            return (
              <button
                key={i}
                disabled={isSubmitted}
                onClick={() => handleSelectOption(opt)}
                className={`w-full p-4 sm:p-5 rounded-2xl text-left text-base sm:text-lg font-bold transition-all flex justify-between items-center ${btnStyle}`}
              >
                <span>{opt}</span>
                <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center text-xs font-black shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        {!isSubmitted ? (
          <button
            disabled={!selectedOption}
            onClick={handleSubmitAnswer}
            className={`w-full py-4 rounded-2xl font-extrabold text-base transition-all shadow-md ${
              selectedOption
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Check Answer 
          </button>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Encouraging Feedback Banner */}
            <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
              isCorrect ? 'bg-emerald-100 border-emerald-300 text-emerald-950' : 'bg-amber-100 border-amber-300 text-amber-950'
            }`}>
              {isCorrect ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <Sparkles className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="font-extrabold text-sm">
                  {isCorrect ? 'Awesome job! +20 XP' : 'Good try! Let\'s learn!'}
                </h4>
                <p className="text-xs mt-0.5 font-medium">{currentQ.explanation}</p>
              </div>
            </div>

            <button
              onClick={handleNextQuestion}
              className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{currentIdx + 1 < questions.length ? 'Next Question' : 'Take Mastery Challenge '}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
