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
  isAuthenticated: boolean;
  addXp: (amount: number) => void;
  updateLevel: (subject: 'reading' | 'numeracy', newLevel: string) => Promise<void>;
  logout: () => void;
}

const StudentContext = createContext<StudentContextType>({
  levelUpData: null,
  clearLevelUp: () => {},
  learner: null,
  isLoading: true,
  isAuthenticated: false,
  addXp: () => {},
  updateLevel: async () => {},
  logout: () => {},
});

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const [learner, setLearner] = useState<Learner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [levelUpData, setLevelUpData] = useState<number | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadStudent() {
      try {
        const studentId = localStorage.getItem('pragya_student_id');

        if (!studentId) {
          setIsAuthenticated(false);
          setLearner(null);
          setIsLoading(false);
          return;
        }

        const { data: rows, error } = await supabase
          .from('pragya_learners')
          .select('*')
          .eq('id', studentId)
          .limit(1);

        const data = rows && Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

        if (error || !data) {
          console.warn("Failed to load student from database:", error);
          if (studentId === 'learner-001') {
            setLearner(MOCK_ACTIVE_STUDENT);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('pragya_student_id');
            localStorage.removeItem('pragya_student_name');
            setLearner(null);
            setIsAuthenticated(false);
          }
          setIsLoading(false);
          return;
        }

        const localProgressRaw = localStorage.getItem(`pragya_progress_${studentId}`);
        const localProgress = localProgressRaw ? JSON.parse(localProgressRaw) : { xp: 0, streakDays: 0 };

        const activeLearner: Learner = {
          ...MOCK_ACTIVE_STUDENT,
          id: data.id,
          name: data.name,
          grade: 3,
          readingLevel: data.reading_level || 'beginner',
          numeracyLevel: data.numeracy_level || 'beginner',
          xp: typeof localProgress.xp === 'number' ? localProgress.xp : 0,
          streakDays: typeof localProgress.streakDays === 'number' ? localProgress.streakDays : 0,
          avatar: data.avatar_emoji || MOCK_ACTIVE_STUDENT.avatar,
        };

        setLearner(activeLearner);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Error in loadStudent:", err);
        setIsAuthenticated(false);
        setLearner(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadStudent();
  }, []);

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
        streakDays: updated.streakDays,
      }));

      return updated;
    });
  };

  const clearLevelUp = () => setLevelUpData(null);

  const updateLevel = async (subject: 'reading' | 'numeracy', newLevel: string) => {
    if (!learner) return;

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

    setLearner(prev => {
      if (!prev) return prev;

      return {
        ...prev,
        readingLevel: subject === 'reading' ? (newLevel as any) : prev.readingLevel,
        numeracyLevel: subject === 'numeracy' ? (newLevel as any) : prev.numeracyLevel,
      };
    });
  };

  const logout = () => {
    localStorage.removeItem('pragya_student_id');
    localStorage.removeItem('pragya_student_name');
    setLearner(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <StudentContext.Provider value={{
      learner, isLoading, isAuthenticated,
      addXp, updateLevel, levelUpData, clearLevelUp, logout,
    }}>
      {children}
    </StudentContext.Provider>
  );
}

export const useStudent = () => useContext(StudentContext);
