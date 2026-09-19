'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play } from 'lucide-react';

interface IntroVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function IntroVideoModal({ isOpen, onClose }: IntroVideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsPlaying(true);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] bg-black flex items-center justify-center w-screen h-screen overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full bg-black flex items-center justify-center"
          >
            {/* Close / Skip button top right */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-50 px-4 py-2 bg-black/60 hover:bg-black/80 text-white font-bold text-sm rounded-full flex items-center gap-2 border border-white/20 backdrop-blur-md shadow-2xl transition-all hover:scale-105"
            >
              <span>Skip Video</span>
              <X className="w-5 h-5" />
            </button>

            <video 
              src="/videos/intro.mp4" 
              className="w-full h-full object-cover pointer-events-none"
              autoPlay
              playsInline
              onEnded={onClose}
            >
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
