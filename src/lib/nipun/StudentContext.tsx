'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Learner } from './types';
import { MOCK_ACTIVE_STUDENT } from './syntheticData';

interface StudentContextType {
  levelUpData: number | null;
  clearLevelUp: () => void;
  learner: Learner | null;
  isLoading: boolean;
  addXp: (amount: number) => void;
  updateLevel: (subject: 'reading' | 'numeracy', newLevel: string) => Promise<void>;
}

const StudentContext = createContext<StudentContextType>({
  levelUpData: null,
  clearLevelUp: () => {},
  learner: null,
  isLoading: true,
  addXp: () => {},
  updateLevel: async () => {},
});

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const [learner, setLearner] = useState<Learner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [levelUpData, setLevelUpData] = useState<number | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadStudent() {
      try {
        let studentId = localStorage.getItem('pragya_student_id');
        if (!studentId) {
          studentId = 'learner-001';
          localStorage.setItem('pragya_student_id', studentId);
        }

        const { data, error } = await supabase
          .from('pragya_learners')
          .select('*')
          .eq('id', studentId)
          .single();

        if (error || !data) {
          console.warn("Failed to load student from Supabase, falling back to mock data:", error);
          setLearner(MOCK_ACTIVE_STUDENT);
          setIsLoading(false);
          return;
        }

        // Load local progress (XP, streak) from localStorage to simulate a full DB for the demo
        const localProgressRaw = localStorage.getItem(`pragya_progress_${studentId}`);
        const localProgress = localProgressRaw ? JSON.parse(localProgressRaw) : { xp: 0, streakDays: 0, level: 1 };

        // Merge DB data with Mock structure
        const activeLearner: Learner = {
          ...MOCK_ACTIVE_STUDENT,
          id: data.id,
          name: data.name,
          grade: 3, // default or parse from class_code
          readingLevel: data.reading_level || 'beginner',
          numeracyLevel: data.numeracy_level || 'beginner',
          xp: localProgress.xp,
          streakDays: localProgress.streakDays,
          
        };

        setLearner(activeLearner);
      } catch (err) {
        console.error("Error in loadStudent:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadStudent();
  }, [supabase]);

  const addXp = (amount: number) => {
    if (!learner) return;
    
    setLearner(prev => {
      if (!prev) return prev;
      
      const oldLevel = Math.floor(prev.xp / 100) + 1;
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / 100) + 1;
      
      if (newLevel > oldLevel) {
        setLevelUpData(newLevel);
      }

      const updated = { ...prev, xp: newXp };
      localStorage.setItem(`pragya_progress_${prev.id}`, JSON.stringify({
        xp: updated.xp,
        streakDays: updated.streakDays
      }));
      
      return updated;
    });
  };

  const clearLevelUp = () => setLevelUpData(null);

  const updateLevel = async (subject: 'reading' | 'numeracy', newLevel: string) => {
    if (!learner) return;

    // Update in Supabase
    const updatePayload = subject === 'reading' 
      ? { reading_level: newLevel }
      : { numeracy_level: newLevel };

    const { error } = await supabase
      .from('pragya_learners')
      .update(updatePayload)
      .eq('id', learner.id);

    if (error) {
      console.error("Failed to update level in DB", error);
      return;
    }

    // Update in local state
    setLearner(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        readingLevel: subject === 'reading' ? (newLevel as any) : prev.readingLevel,
        numeracyLevel: subject === 'numeracy' ? (newLevel as any) : prev.numeracyLevel,
      };
    });
  };

  return (
    <StudentContext.Provider value={{ learner, isLoading, addXp, updateLevel, levelUpData, clearLevelUp }}>
      {children}
    </StudentContext.Provider>
  );
}

export const useStudent = () => useContext(StudentContext);
