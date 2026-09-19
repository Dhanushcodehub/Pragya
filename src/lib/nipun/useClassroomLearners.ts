'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { PragyaLearner } from '@/lib/types';

/**
 * Fetches live pragya_learners rows for the current teacher's classroom.
 * Falls back to an empty array if no classroom exists yet.
 *
 * Returns { learners, classroom, isLoading, refresh }.
 */
export function useClassroomLearners() {
  const [learners, setLearners] = useState<PragyaLearner[]>([]);
  const [classroomName, setClassroomName] = useState<string>('Class 5A');
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setIsLoading(false); return; }

      // Get classroom for this teacher
      const { data: classData } = await supabase
        .from('pragya_classrooms')
        .select('id, name')
        .eq('teacher_id', user.id)
        .maybeSingle();

      if (!classData) { setIsLoading(false); return; }

      setClassroomName(classData.name ?? 'Class 5A');

      // Get all learners for this classroom
      const { data: learnersData, error } = await supabase
        .from('pragya_learners')
        .select('*')
        .eq('classroom_id', classData.id)
        .order('name', { ascending: true });

      if (!error && learnersData) {
        setLearners(learnersData);
      }
    } catch (err) {
      console.error('[useClassroomLearners] fetch failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { learners, classroomName, isLoading, refresh: fetch };
}
