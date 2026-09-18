'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { PragyaLearner, PragyaClassroom } from '@/lib/types';
import TeacherSummaryCards from './TeacherSummaryCards';
import ClassroomLearningMap from './ClassroomLearningMap';
import InstructionalGroups from './InstructionalGroups';
import NextActionPanel from './NextActionPanel';
import { Loader2, PlusCircle } from 'lucide-react';

interface DashboardClientProps {
  userEmail: string;
}

export default function DashboardClient({ userEmail }: DashboardClientProps) {
  const [learners, setLearners] = useState<PragyaLearner[]>([]);
  const [classroom, setClassroom] = useState<PragyaClassroom | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    // 1. Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 2. Try to fetch their classroom
    let { data: classData } = await supabase.from('pragya_classrooms').select('*').eq('teacher_id', user.id).single();
    
    // If no classroom exists, create one implicitly
    if (!classData) {
      const { data: newClass } = await supabase.from('pragya_classrooms').insert({
        name: "My Awesome Class",
        teacher_id: user.id,
        grade_level: "Grade 1"
      }).select().single();
      classData = newClass;
    }
    setClassroom(classData);

    if (classData) {
      // 3. Fetch learners for this classroom
      const { data: learnersData } = await supabase.from('pragya_learners').select('*').eq('classroom_id', classData.id);
      if (learnersData) setLearners(learnersData);
    }
    setLoading(false);
  };

  const generateDemoData = async () => {
    if (!classroom) return;
    setLoading(true);
    
    const demoStudents = [
      { classroom_id: classroom.id, name: 'Aarav Patel', avatar_emoji: 'ðŸ‘¦', class_code: 'DEMO', secret_pin: '1234', reading_level: 'word', numeracy_level: 'number-recognition-1-9', status: 'developing' },
      { classroom_id: classroom.id, name: 'Diya Sharma', avatar_emoji: 'ðŸ‘§', class_code: 'DEMO', secret_pin: '5678', reading_level: 'paragraph', numeracy_level: 'subtraction', status: 'secure' },
      { classroom_id: classroom.id, name: 'Rohan Gupta', avatar_emoji: 'ðŸ‘¦', class_code: 'DEMO', secret_pin: '9999', reading_level: 'letter', numeracy_level: 'beginner', status: 'needs-support' },
      { classroom_id: classroom.id, name: 'Maya Singh', avatar_emoji: 'ðŸ‘§', class_code: 'DEMO', secret_pin: '1111', reading_level: 'story', numeracy_level: 'division', status: 'secure' },
      { classroom_id: classroom.id, name: 'Kabir Khan', avatar_emoji: 'ðŸ‘¦', class_code: 'DEMO', secret_pin: '2222', reading_level: 'beginner', numeracy_level: 'beginner', status: 'needs-support' },
    ];

    await supabase.from('pragya_learners').insert(demoStudents);
    await fetchData();
  };

  if (loading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto z-10 relative">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-zinc-900 font-heading mb-2">Teacher Dashboard</h1>
          <p className="text-zinc-500 font-medium">Welcome back! Here is {classroom?.name}'s learning DNA for today.</p>
        </div>
        {learners.length === 0 && (
          <button onClick={generateDemoData} className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-zinc-800">
            <PlusCircle className="w-4 h-4"/> Generate Demo Students
          </button>
        )}
      </div>

      <TeacherSummaryCards learners={learners} />
      
      <ClassroomLearningMap learners={learners} />

      <div className="flex flex-col md:flex-row gap-8">
        <NextActionPanel learners={learners} />
        <InstructionalGroups learners={learners} />
      </div>
    </div>
  );
}
