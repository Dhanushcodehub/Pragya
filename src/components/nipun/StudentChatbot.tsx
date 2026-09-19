'use client';

/**
 * Dost 🤖 — the floating study-buddy chatbot for the student portal.
 *
 * • Floating action button pinned to the bottom-right of every student page
 * • Click to pop up a friendly chat panel (framer-motion spring animation)
 * • Answers are grounded in the NCERT Class 3 syllabus via /api/student-tutor
 * • Always gets an answer: Gemini online → offline NCERT tutor brain fallback
 * • "Listen" button reads answers aloud (same TTS pattern as PracticeZone)
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Send, Sparkles, Volume2, X, Loader2, MessageCircleHeart } from 'lucide-react';
import { useStudent } from '@/lib/nipun/StudentContext';

interface ChatMessage {
  id: string;
  from: 'bot' | 'user';
  text: string;
  chips?: string[];
  source?: 'ai' | 'offline';
  time: number;
}

const WELCOME_CHIPS = ['How do I subtract?', 'Tell me about Badal and Moti', 'What is a half?', 'Solve 54 − 27'];

let localId = 0;
const nextId = () => `msg-${++localId}-${Date.now()}`;

function speak(text: string) {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ''));
    u.lang = 'en-IN';
    u.rate = 0.92;
    u.pitch = 1.15;
    window.speechSynthesis.speak(u);
  }
}

function BotAvatar({ size = 'w-8 h-8' }: { size?: string }) {
  return (
    <div className={`${size} rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm shrink-0`}>
      <Bot className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
    </div>
  );
}

export default function StudentChatbot() {
  const { learner } = useStudent();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);

  // Seed the welcome message once the learner is known (personalised greeting).
  const welcomeMessage: ChatMessage | null = learner ? {
    id: 'welcome',
    from: 'bot',
    text: `Hi ${learner.name.split(' ')[0]}! 👋 I'm Dost, your study buddy! Ask me anything about Maths or English — I love helping! 🌟`,
    chips: WELCOME_CHIPS,
    time: 0,
  } : null;
  const allMessages: ChatMessage[] = welcomeMessage ? [welcomeMessage, ...messages] : messages;

  // Auto-scroll to the newest message.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when opening (unread badge is reset in toggleOpen).
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 350);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const send = useCallback(async (raw: string) => {
    const text = raw.trim();
    if (!text || isTyping) return;

    setInput('');
    setMessages(prev => [...prev, { id: nextId(), from: 'user', text, time: Date.now() }]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/student-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          learner: learner ? {
            name: learner.name,
            readingLevel: learner.readingLevel,
            numeracyLevel: learner.numeracyLevel,
          } : undefined,
        }),
      });
      const data = await res.json();
      const reply: ChatMessage = {
        id: nextId(),
        from: 'bot',
        text: data.reply || "Oops, my brain took a tiny nap! Try asking again 😊",
        chips: Array.isArray(data.chips) && data.chips.length > 0 ? data.chips : undefined,
        source: data.source,
        time: Date.now(),
      };
      setMessages(prev => [...prev, reply]);
      if (!isOpen) setUnreadCount(c => c + 1);
      // Auto-read aloud (kids love it) — only while panel is open.
      if (isOpen) speak(reply.text);
    } catch {
      setMessages(prev => [...prev, {
        id: nextId(),
        from: 'bot',
        text: 'Oh no, my Wi-Fi sneezed! 🤧 Please ask me again!',
        chips: WELCOME_CHIPS.slice(0, 2),
        time: Date.now(),
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [isTyping, learner, isOpen]);

  const toggleOpen = () => {
    const opening = !isOpen;
    setIsOpen(opening);
    if (opening) {
      setHasOpenedOnce(true);
      setUnreadCount(0);
    }
    window.speechSynthesis?.cancel();
  };

  const handleSpeak = (m: ChatMessage) => {
    if (speakingId === m.id) {
      window.speechSynthesis?.cancel();
      setSpeakingId(null);
    } else {
      speak(m.text);
      setSpeakingId(m.id);
    }
  };

  const latestChips = [...allMessages].reverse().find(m => m.from === 'bot' && m.chips)?.chips || [];

  return (
    <>
      {/* ── FLOATING CHAT PANEL ─────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="fixed bottom-24 right-4 sm:right-6 z-[90] w-[calc(100vw-2rem)] max-w-sm origin-bottom-right"
          >
            <div className="flex flex-col h-[28rem] sm:h-[32rem] bg-[#fef9f2] rounded-3xl border-2 border-amber-200 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircleHeart className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>Dost — Your Study Buddy</p>
                  <p className="text-[10px] text-amber-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" />
                    NCERT Class 3 helper · always here!
                  </p>
                </div>
                <button
                  onClick={toggleOpen}
                  aria-label="Close chat"
                  className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
                {allMessages.map(m => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2 ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {m.from === 'bot' && <BotAvatar />}
                    <div className={`max-w-[80%] ${m.from === 'user' ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                          m.from === 'user'
                            ? 'bg-emerald-600 text-white rounded-br-md'
                            : 'bg-white border border-amber-100 text-gray-800 rounded-bl-md shadow-sm'
                        }`}
                      >
                        {m.text}
                      </div>
                      {m.from === 'bot' && (
                        <div className="flex items-center gap-1 mt-1">
                          <button
                            onClick={() => handleSpeak(m)}
                            className="text-[10px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 px-1.5 py-0.5 rounded-full hover:bg-amber-50 transition-colors"
                          >
                            <Volume2 className={`w-3 h-3 ${speakingId === m.id ? 'animate-pulse' : ''}`} />
                            {speakingId === m.id ? 'Stop' : 'Listen'}
                          </button>
                        </div>
                      )}
                    </div>
                    {m.from === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-sm shrink-0">
                        {learner?.avatar || '🙂'}
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex gap-2 justify-start">
                    <BotAvatar />
                    <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white border border-amber-100 shadow-sm flex items-center gap-1.5">
                      {[0, 150, 300].map(delay => (
                        <motion.span
                          key={delay}
                          className="w-2 h-2 bg-amber-400 rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ repeat: Infinity, duration: 0.9, delay: delay / 1000 }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick-ask chips */}
              {latestChips.length > 0 && !isTyping && (
                <div className="px-3 pb-1.5 flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                  {latestChips.map(chip => (
                    <button
                      key={chip}
                      onClick={() => send(chip)}
                      className="shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200 transition-colors whitespace-nowrap"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* Input bar */}
              <form
                onSubmit={e => { e.preventDefault(); send(input); }}
                className="p-3 border-t border-amber-100 bg-white/60 flex gap-2"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask me anything…"
                  maxLength={300}
                  className="flex-1 px-4 py-2.5 rounded-full bg-white border border-amber-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  aria-label="Send message"
                  className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors shadow-sm"
                >
                  {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FLOATING ACTION BUTTON (bottom-right) ───────────────────────── */}
      <motion.button
        onClick={toggleOpen}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label={isOpen ? 'Close study buddy chat' : 'Open study buddy chat'}
        className="fixed bottom-6 right-4 sm:right-6 z-[95] w-16 h-16 rounded-full shadow-xl flex items-center justify-center text-white"
        style={{
          background: 'linear-gradient(135deg, #f59e0b, #f97316)',
          boxShadow: '0 8px 24px rgba(245, 158, 11, 0.45), 0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        {/* Attention ring — gently pulses until first opened */}
        {!hasOpenedOnce && !isOpen && (
          <motion.span
            className="absolute inset-0 rounded-full border-4 border-amber-300"
            animate={{ scale: [1, 1.25, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        )}
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="w-7 h-7" />
            </motion.div>
          ) : (
            <motion.div key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }} className="relative">
              <Bot className="w-8 h-8" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        {!isOpen && (
          <motion.span
            className="absolute -top-2 -left-2 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center"
            animate={{ rotate: [0, -12, 12, 0] }}
            transition={{ repeat: Infinity, duration: 3, repeatDelay: 2 }}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </motion.span>
        )}
      </motion.button>
    </>
  );
}
