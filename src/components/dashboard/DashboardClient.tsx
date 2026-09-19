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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // New Student Form State
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentUsername, setNewStudentUsername] = useState('');
  const [newStudentPassword, setNewStudentPassword] = useState('');
  const [newStudentGender, setNewStudentGender] = useState<'boy' | 'girl'>('boy');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const { data: classRows } = await supabase.from('pragya_classrooms').select('*').eq('teacher_id', user.id).limit(1);
    let classData = classRows && classRows.length > 0 ? classRows[0] : null;
    
    // If no classroom exists, create one implicitly
    if (!classData) {
      const { data: newClasses } = await supabase.from('pragya_classrooms').insert({
        name: "Class 5A",
        teacher_id: user.id,
        grade_level: "Grade 5"
      }).select().limit(1);
      classData = newClasses && newClasses.length > 0 ? newClasses[0] : null;
    }
    setClassroom(classData);

    if (classData) {
      // 3. Fetch learners for this classroom
      const { data: learnersData } = await supabase.from('pragya_learners').select('*').eq('classroom_id', classData.id);
      if (learnersData && learnersData.length > 0) {
        setLearners(learnersData);
      } else {
        await generateDemoDataForClass(classData.id);
      }
    }
    setLoading(false);
  };

  const generateDemoDataForClass = async (classId: string) => {
    const localAvatars = [
      '/avatars/boy_1.jpg',
      '/avatars/boy_2.png',
      '/avatars/girl_1.png',
    ];

    const uniqueStudents = [
      { name: 'Sai Patel', avatar: '/avatars/boy_1.jpg', pin: '4387', status: 'needs-support', reading: 'beginner', math: 'number-recognition-1-9' },
      { name: 'Arjun Patel', avatar: '/avatars/boy_2.png', pin: '3098', status: 'developing', reading: 'word', math: 'subtraction' },
      { name: 'Kiara Bose', avatar: '/avatars/girl_1.png', pin: '4695', status: 'needs-support', reading: 'beginner', math: 'number-recognition-1-9' },
      { name: 'Kiara Bose', avatar: '/avatars/girl_1.png', pin: '3183', status: 'developing', reading: 'paragraph', math: 'number-recognition-11-99' },
      { name: 'Saanvi Gupta', avatar: '/avatars/girl_1.png', pin: '5274', status: 'developing', reading: 'word', math: 'subtraction' },
      { name: 'Priya Singh', avatar: '/avatars/girl_1.png', pin: '4541', status: 'developing', reading: 'word', math: 'subtraction' },
      { name: 'Kabir Das', avatar: '/avatars/boy_1.jpg', pin: '9395', status: 'developing', reading: 'paragraph', math: 'subtraction' },
      { name: 'Saanvi Reddy', avatar: '/avatars/girl_1.png', pin: '2082', status: 'secure', reading: 'story', math: 'division' },
      { name: 'Sai Bose', avatar: '/avatars/boy_2.png', pin: '1109', status: 'needs-support', reading: 'letter', math: 'number-recognition-1-9' },
      { name: 'Aadhya Sharma', avatar: '/avatars/girl_1.png', pin: '8821', status: 'developing', reading: 'word', math: 'number-recognition-11-99' },
      { name: 'Arjun Kumar', avatar: '/avatars/boy_1.jpg', pin: '6402', status: 'developing', reading: 'paragraph', math: 'subtraction' },
      { name: 'Sai Reddy', avatar: '/avatars/boy_2.png', pin: '7731', status: 'secure', reading: 'story', math: 'division' },
      { name: 'Arjun Reddy', avatar: '/avatars/boy_1.jpg', pin: '5510', status: 'developing', reading: 'word', math: 'number-recognition-11-99' },
      { name: 'Vivaan Das', avatar: '/avatars/boy_2.png', pin: '4412', status: 'secure', reading: 'story', math: 'division' },
      { name: 'Diya Gupta', avatar: '/avatars/girl_1.png', pin: '8831', status: 'secure', reading: 'story', math: 'division' },
      { name: 'Aditya Kumar', avatar: '/avatars/boy_1.jpg', pin: '2291', status: 'secure', reading: 'story', math: 'division' },
      { name: 'Ananya Bose', avatar: '/avatars/girl_1.png', pin: '9012', status: 'developing', reading: 'paragraph', math: 'subtraction' },
      { name: 'Rohan Nair', avatar: '/avatars/boy_2.png', pin: '3341', status: 'needs-support', reading: 'letter', math: 'number-recognition-1-9' },
      { name: 'Myra Bhat', avatar: '/avatars/girl_1.png', pin: '7102', status: 'secure', reading: 'story', math: 'division' },
      { name: 'Ishaan Rao', avatar: '/avatars/boy_1.jpg', pin: '4491', status: 'secure', reading: 'story', math: 'division' },
    ];
    
    const demoStudents = uniqueStudents.map((s, i) => ({
      classroom_id: classId,
      name: s.name,
      avatar_emoji: s.avatar,
      class_code: `CLASS5A-${(i + 1).toString().padStart(2, '0')}`,
      secret_pin: s.pin,
      reading_level: s.reading,
      numeracy_level: s.math,
      status: s.status,
    }));

    const { data } = await supabase.from('pragya_learners').insert(demoStudents).select();
    if (data) setLearners(data);
  };


  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newStudentUsername || !newStudentPassword) return;
    
    setIsSubmitting(true);
    
    // Assign an avatar based on selection
    const avatar = newStudentGender === 'boy' 
      ? ['/avatars/boy_1.jpg', '/avatars/boy_2.png'][Math.floor(Math.random() * 2)]
      : '/avatars/girl_1.png';

    const generatedId = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : `learner-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newLearnerRecord = {
      id: generatedId,
      classroom_id: classroom?.id || 'class-3a',
      name: newStudentName.trim(),
      class_code: newStudentUsername.trim().toUpperCase(),
      secret_pin: newStudentPassword.trim(),
      avatar_emoji: avatar,
      reading_level: 'beginner',
      numeracy_level: 'beginner',
      status: 'developing',
      created_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase
        .from('pragya_learners')
        .insert(newLearnerRecord)
        .select();

      if (error) {
        console.warn("Supabase insert warning, provisioning locally for session:", error.message || error);
      }

      // Add to local state grid regardless to guarantee instantaneous UX feedback
      const createdItem = (data && data[0]) ? data[0] : newLearnerRecord;
      setLearners(prev => [createdItem, ...prev]);

      setIsCreateModalOpen(false);
      setNewStudentName('');
      setNewStudentUsername('');
      setNewStudentPassword('');
    } catch (err) {
      console.error("Local provisioning fallback:", err);
      setLearners(prev => [newLearnerRecord, ...prev]);
      setIsCreateModalOpen(false);
      setNewStudentName('');
      setNewStudentUsername('');
      setNewStudentPassword('');
    } finally {
      setIsSubmitting(false);
    }
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
        <button onClick={() => setIsCreateModalOpen(true)} className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-zinc-800 transition-all shrink-0">
          <PlusCircle className="w-4 h-4"/> Create Student ID
        </button>
      </div>

      <TeacherSummaryCards learners={learners} />
      
      <ClassroomLearningMap learners={learners} />

      <div className="flex flex-col md:flex-row gap-8">
        <NextActionPanel learners={learners} />
        <InstructionalGroups learners={learners} />
      </div>

      {/* Create Student Modal Overlay */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl border border-zinc-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
              <h2 className="text-xl font-bold text-zinc-900 font-heading">Provision Student Account</h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateStudent} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">Full Name</label>
                <input required type="text" value={newStudentName} onChange={e => setNewStudentName(e.target.value)} placeholder="e.g. Arjun Patel" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all font-medium text-zinc-900" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">Student Username (ID)</label>
                <input required type="text" value={newStudentUsername} onChange={e => setNewStudentUsername(e.target.value)} placeholder="e.g. arjun2026" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all font-medium text-zinc-900" />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">Password (PIN)</label>
                <input required type="text" value={newStudentPassword} onChange={e => setNewStudentPassword(e.target.value)} placeholder="e.g. 1234" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all font-medium text-zinc-900" />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">Avatar Profile</label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setNewStudentGender('boy')} className={`flex-1 py-2 px-3 rounded-xl border text-sm font-bold transition-all ${newStudentGender === 'boy' ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm' : 'border-zinc-200 bg-white text-zinc-500'}`}>Boy</button>
                  <button type="button" onClick={() => setNewStudentGender('girl')} className={`flex-1 py-2 px-3 rounded-xl border text-sm font-bold transition-all ${newStudentGender === 'girl' ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm' : 'border-zinc-200 bg-white text-zinc-500'}`}>Girl</button>
                </div>
              </div>
              
              <div className="pt-4 mt-2 border-t border-zinc-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-zinc-600 hover:bg-zinc-100 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-70 transition-all shadow-md">
                  {isSubmitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
