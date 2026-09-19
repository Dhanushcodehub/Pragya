'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Loader2, Mic, MicOff } from 'lucide-react';
import { getSyllabusQuestions, getChapterLabel, NCERT_CLASS_3_QUESTION_BANK, NcertQuestion } from '@/lib/nipun/ncertSyllabus';
import { ReadingLevel, NumeracyLevel } from '@/lib/nipun/types';
import { useStudent } from '@/lib/nipun/StudentContext';
import MasteryChallenge from './MasteryChallenge';

export default function PracticeZone() {
  const searchParams = useSearchParams();
  const pathwayParam = searchParams?.get('pathway') || 'reading';
  const isChallenge = searchParams?.get('challenge') === 'true';

  const { learner, isLoading, addXp, updateLevel } = useStudent();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [totalXp, setTotalXp] = useState(0);
  const [showChallenge, setShowChallenge] = useState(isChallenge);
  
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const anyWindow = window as any;
      const SpeechRecognition = anyWindow.SpeechRecognition || anyWindow.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.continuous = false;
        reco.interimResults = false;
        reco.lang = 'en-US';

        reco.onstart = () => {
          setIsListening(true);
          setTranscript('');
        };

        reco.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcriptText = event.results[current][0].transcript;
          setTranscript(transcriptText);
          handleVoiceCommand(transcriptText);
        };

        reco.onerror = (event: any) => {
          setIsListening(false);
        };

        reco.onend = () => {
          setIsListening(false);
        };

        setRecognition(reco);
      }
    }
  }, []);

  // NCERT Class 3 level ladders
  const readingLadder: ReadingLevel[] = ['letter', 'word', 'paragraph', 'story'];
  const numeracyLadder: NumeracyLevel[] = ['number_1_9', 'number_11_99', 'subtraction', 'division'];
  
  const ladder = pathwayParam === 'numeracy' ? numeracyLadder : readingLadder;
  
  const levelLabels: Record<string, string> = {
    letter: 'Letter Phonics',
    word: 'Word Builder',
    paragraph: 'Paragraph Explorer',
    story: 'Story Master',
    number_1_9: 'Numbers 1–9',
    number_11_99: 'Place Value 11–99',
    subtraction: 'Subtraction Solver',
    division: 'Equal Sharing & Division',
  };

  const getInitialLevelIdx = () => {
    const rawLevel = pathwayParam === 'numeracy' ? learner?.numeracyLevel : learner?.readingLevel;
    const strLevel = String(rawLevel || '');
    if (strLevel.startsWith('number-recognition-11')) return 1;
    if (strLevel.startsWith('number-recognition-1')) return 0;
    const idx = ladder.indexOf(strLevel as any);
    return idx >= 0 ? idx : 0;
  };

  const [subDifficulty, setSubDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [levelIdx, setLevelIdx] = useState(getInitialLevelIdx());
  const [streak, setStreak] = useState(0);
  const [attemptedIds, setAttemptedIds] = useState<string[]>([]);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [adaptiveBanner, setAdaptiveBanner] = useState<string | null>('✨ Adaptive Quest: Adapting difficulty to your skills!');

  const getNextAdaptiveQuestion = (targetLevelIdx: number, diff: 'easy' | 'medium' | 'hard', usedIds: string[]): NcertQuestion => {
    const targetLevel = ladder[targetLevelIdx];
    const pathwayBank = NCERT_CLASS_3_QUESTION_BANK.filter(q => q.pathway === pathwayParam);
    
    // Shuffle helper to randomize questions within any matched bucket
    const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

    // 1. Unattempted questions matching exact sub-difficulty ('easy' | 'medium' | 'hard')
    let candidates = pathwayBank.filter(q => (q.difficulty || 'medium') === diff && !usedIds.includes(q.id));
    if (candidates.length > 0) return shuffle(candidates)[0];

    // 2. Unattempted questions matching target ASER level
    candidates = pathwayBank.filter(q => q.level === targetLevel && !usedIds.includes(q.id));
    if (candidates.length > 0) return shuffle(candidates)[0];
    
    // 3. Any unattempted question in current pathway
    candidates = pathwayBank.filter(q => !usedIds.includes(q.id));
    if (candidates.length > 0) return shuffle(candidates)[0];

    // 4. Fallback: Any question matching sub-difficulty (even if attempted before for continuous practice)
    candidates = pathwayBank.filter(q => (q.difficulty || 'medium') === diff);
    if (candidates.length > 0) return shuffle(candidates)[0];

    // 5. Ultimate fallback: Random selection across pathway bank
    return shuffle(pathwayBank)[0];
  };

  const [currentQ, setCurrentQ] = useState<NcertQuestion>(() => {
    return getNextAdaptiveQuestion(getInitialLevelIdx(), 'medium', []);
  });

  // Early returns AFTER all hooks (rules-of-hooks)
  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>;
  if (!learner) return null;

  const handlePlayAudio = (text?: string) => {
    if ('speechSynthesis' in window && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectOption = (opt: string) => {
    if (isSubmitted) return;
    setSelectedOption(opt);
  };

  const handleVoiceCommand = (text: string) => {
    if (isSubmitted) return;
    const lowerText = text.toLowerCase().trim();
    
    let matchedOpt: string | null = null;
    currentQ.options.forEach((opt, index) => {
      const letter = String.fromCharCode(65 + index).toLowerCase();
      if (lowerText === letter || lowerText === `option ${letter}` || lowerText.includes(opt.toLowerCase())) {
        matchedOpt = opt;
      }
    });

    if (matchedOpt) {
      const finalOpt: string = matchedOpt;
      setSelectedOption(finalOpt);
      setTimeout(() => submitSpecificAnswer(finalOpt), 1000);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
    } else {
      recognition?.start();
    }
  };

  const submitSpecificAnswer = (opt: string) => {
    setIsSubmitted(true);
    setAttemptedIds(prev => [...prev, currentQ.id]);
    setQuestionsAnswered(prev => prev + 1);

    const isRight = opt === currentQ.correctAnswer;

    if (isRight) {
      setTotalXp(prev => prev + currentQ.xp);
      if (addXp) addXp(currentQ.xp);
      
      const newStreak = streak + 1;
      setStreak(newStreak);

      // Increase sub-difficulty on right answer
      if (subDifficulty === 'easy') setSubDifficulty('medium');
      else if (subDifficulty === 'medium') setSubDifficulty('hard');

      if (newStreak >= 2 && levelIdx < ladder.length - 1) {
        const nextLvl = levelIdx + 1;
        setLevelIdx(nextLvl);
        setSubDifficulty('medium');
        setStreak(0);
        const nextLevelKey = ladder[nextLvl];
        if (updateLevel) updateLevel(pathwayParam === 'numeracy' ? 'numeracy' : 'reading', nextLevelKey);
        setAdaptiveBanner(`🚀 LEVEL UP! Mastered ${levelLabels[ladder[levelIdx]]}! Advancing to ${levelLabels[nextLevelKey]}!`);
        handlePlayAudio(`Level up! You are now entering ${levelLabels[nextLevelKey]}!`);
      } else {
        setAdaptiveBanner(`🌟 Great job! Correct answer! (+${currentQ.xp} XP)`);
        handlePlayAudio('Great job! That is correct!');
      }
    } else {
      setStreak(0);
      
      // Retention Sub-Difficulty Fallback Loop
      if (subDifficulty === 'hard') {
        setSubDifficulty('medium');
        setAdaptiveBanner(`💡 Retention Assist: Adjusting to Medium difficulty to help you solidify this concept!`);
        handlePlayAudio(`Don't worry! Let's practice a medium-level challenge.`);
      } else if (subDifficulty === 'medium') {
        setSubDifficulty('easy');
        const hintText = currentQ.hint ? ` Hint: ${currentQ.hint}` : '';
        setAdaptiveBanner(`💡 Adaptive Retention: Stepping down to Easy step!${hintText}`);
        handlePlayAudio(`No worries! Here is an easier question with a hint.`);
      } else {
        // Already at easy, retain student at easy without penalizing further
        setAdaptiveBanner(`💪 Great effort! Stay determined — practicing makes perfect!`);
        handlePlayAudio('Good try! Practice makes perfect.');
      }
    }
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption) return;
    submitSpecificAnswer(selectedOption);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setTranscript('');

    if (questionsAnswered >= 6) {
      setShowChallenge(true);
    } else {
      const nextQ = getNextAdaptiveQuestion(levelIdx, subDifficulty, [...attemptedIds, currentQ.id]);
      setCurrentQ(nextQ);
    }
  };

  if (showChallenge) {
    return (
      <div className="fixed inset-0 z-50 bg-[#FFFCE1] p-6 space-y-4 overflow-y-auto">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <Link
            href="/student/quest"
            className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
        <MasteryChallenge
          conceptName={pathwayParam === 'reading' ? 'Paragraph Explorer' : 'Subtraction Solver'}
          pathway={pathwayParam}
          level={String(ladder[levelIdx])}
        />
      </div>
    );
  }

  const isCorrect = selectedOption === currentQ.correctAnswer;

  return (
    <div className="fixed inset-0 z-[100] w-full h-full flex flex-col bg-black overflow-hidden font-fredoka">
      
      {/* MAGICAL ADVENTURE BACKGROUND (FULL WIDTH/HEIGHT, NO BLACK BARS) */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-95"
        style={{ backgroundImage: "url('/images/practice-zone-doors.jpg')" }}
      />
      
      {/* Soft dark overlay at top/bottom for readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 pointer-events-none" />

      {/* HEADER OVERLAY */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 w-full gap-2">
        <div className="flex items-center gap-3">
          <Link
            href="/student/quest"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white font-bold transition-colors shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Escape to Map</span>
          </Link>

          {/* ADAPTIVE LEVEL INDICATOR */}
          <div className="px-4 py-2 rounded-xl bg-indigo-950/80 backdrop-blur-md border border-indigo-400/50 text-indigo-200 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Target: {levelLabels[ladder[levelIdx]] || 'Adaptive'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500/90 backdrop-blur-sm border-2 border-amber-300 text-white font-black shadow-[0_0_25px_rgba(245,158,11,0.6)]">
          <Sparkles className="w-5 h-5 fill-white animate-pulse" />
          <span>+{totalXp} XP</span>
        </div>
      </div>

      {/* DYNAMIC ADAPTIVE BANNER */}
      {adaptiveBanner && (
        <motion.div
          key={adaptiveBanner}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-2xl mx-auto px-4 text-center"
        >
          <div className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/40 text-amber-200 text-xs sm:text-sm font-bold shadow-xl inline-flex items-center gap-2">
            <span>{adaptiveBanner}</span>
          </div>
        </motion.div>
      )}

      <div className="relative z-10 flex-1 flex flex-col justify-between w-full h-full pb-6 px-4">
        
        {/* QUESTION TEXT (PUSHED ALL THE WAY UP) */}
        <div className="w-full max-w-6xl mx-auto text-center space-y-2 sm:space-y-4 -mt-2">
          <button
            onClick={() => handlePlayAudio(currentQ.audioPrompt || currentQ.content)}
            className="mx-auto flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-2 bg-indigo-600/90 hover:bg-indigo-500 backdrop-blur-md text-white rounded-full text-xs sm:text-sm font-bold shadow-2xl border-2 border-indigo-300 transition-all hover:scale-105"
          >
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            Read Challenge Aloud
          </button>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight" style={{ textShadow: '0 4px 10px rgba(0,0,0,1), 0 2px 4px rgba(0,0,0,1)' }}>
            {currentQ.content}
          </h2>
          {currentQ && (
            <p className="text-[11px] sm:text-xs font-bold text-amber-300/90 uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
              {getChapterLabel(currentQ)}
            </p>
          )}
        </div>

        {/* SPACER TO PUSH CAVES TO THE BOTTOM */}
        <div className="flex-1" />

        {/* CAVE OPTIONS & CONTROLS (FLEX ALIGNED AT BOTTOM) */}
        <div className="w-full flex flex-col justify-end items-center mb-2 sm:mb-8">
          
          {/* CAVE OPTIONS */}
          <div className="w-full max-w-7xl mx-auto grid grid-cols-3 gap-2 sm:gap-6 md:gap-12 px-2 sm:px-8 mb-6 sm:mb-12">
            {currentQ.options.map((opt, i) => {
              const isSelected = selectedOption === opt;
              
              let textStyle = 'text-white hover:text-amber-300 hover:scale-110';
              if (isSubmitted) {
                if (opt === currentQ.correctAnswer) {
                  textStyle = 'text-emerald-400 drop-shadow-[0_0_30px_rgba(16,185,129,1)] scale-110';
                } else if (isSelected) {
                  textStyle = 'text-red-400';
                } else {
                  textStyle = 'text-gray-400 opacity-50';
                }
              } else if (isSelected) {
                textStyle = 'text-amber-400 drop-shadow-[0_0_40px_rgba(245,158,11,1)] scale-110';
              }

              return (
                <button
                  key={i}
                  disabled={isSubmitted}
                  onClick={() => handleSelectOption(opt)}
                  className={`relative w-full aspect-video sm:aspect-square max-h-[25vh] font-extrabold text-lg sm:text-3xl md:text-4xl lg:text-5xl transition-all duration-300 ease-out flex items-center justify-center cursor-pointer select-none bg-transparent border-none ${textStyle}`}
                  style={{ textShadow: '0 5px 15px rgba(0,0,0,1), 0 2px 5px rgba(0,0,0,1)' }}
                >
                  <span className="text-center px-1 leading-snug w-full break-words">{opt}</span>
                </button>
              );
            })}
          </div>
          
          {/* VOICE & BUTTONS */}
          <div className="flex flex-col items-center">
            {/* VOICE TO TEXT */}
            {!isSubmitted && recognition && (
              <div className="flex flex-col items-center mb-4">
                <button
                  onClick={toggleListening}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-300 border-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] ${
                    isListening 
                      ? 'bg-red-500 border-red-300 animate-pulse scale-110' 
                      : 'bg-indigo-600/80 border-indigo-300 hover:bg-indigo-500 hover:scale-105 backdrop-blur-md'
                  }`}
                >
                  {isListening ? <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-white" /> : <MicOff className="w-6 h-6 sm:w-8 sm:h-8 text-white/90" />}
                </button>
                {transcript && (
                  <p className="mt-2 text-amber-300 font-black text-xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
                    &ldquo;{transcript}&rdquo;
                  </p>
                )}
              </div>
            )}

            {/* ACTION BUTTON / FEEDBACK */}
            {!isSubmitted ? (
              <button
                disabled={!selectedOption}
                onClick={handleSubmitAnswer}
                className={`px-10 py-3 sm:px-16 sm:py-6 rounded-full font-black text-lg sm:text-2xl transition-all uppercase tracking-widest border-4 ${
                  selectedOption
                    ? 'bg-amber-500 hover:bg-amber-400 border-amber-200 text-amber-950 shadow-[0_10px_40px_rgba(245,158,11,0.8)] hover:scale-105'
                    : 'bg-black/60 text-white/30 cursor-not-allowed border-white/10 backdrop-blur-sm'
                }`}
              >
                Enter Cave
              </button>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="w-full max-w-xl mx-auto px-4 z-50">
                <div className={`p-4 sm:p-6 rounded-[30px] border-4 flex flex-col items-center text-center gap-2 sm:gap-4 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] ${
                  isCorrect ? 'bg-emerald-900/95 border-emerald-400 text-white' : 'bg-amber-900/95 border-amber-400 text-white'
                }`}>
                  <div className="flex items-center gap-3">
                    {isCorrect ? <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" /> : <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />}
                    <h4 className="font-black text-xl sm:text-3xl">
                      {isCorrect ? 'Path Unlocked! +20 XP' : 'Magic Fizzled!'}
                    </h4>
                  </div>
                  <p className="text-sm sm:text-lg font-medium opacity-95">{currentQ.explanation}</p>
                  
                  <button
                    onClick={handleNextQuestion}
                    className="mt-2 w-full py-3 sm:py-4 bg-white text-gray-900 font-black text-base sm:text-xl rounded-2xl shadow-xl transition-all hover:bg-gray-100 hover:scale-105 flex items-center justify-center gap-2 uppercase tracking-wide border-b-4 border-gray-300"
                  >
                    <span>{questionsAnswered >= 6 ? 'Face the Boss' : 'Next Challenge'}</span>
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
