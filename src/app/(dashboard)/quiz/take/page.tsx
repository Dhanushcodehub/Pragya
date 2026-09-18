'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import QuizTakeClient from './QuizTakeClient';
import { Loader2 } from 'lucide-react';

export default function QuizTakePage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    // Check for student session
    const id = localStorage.getItem('pragya_student_id');
    if (!id) {
      router.push('/login');
    } else {
      setStudentId(id);
    }
  }, [router]);

  if (!studentId) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FFFCE1]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#FFFCE1] text-[#2D2D2D] overflow-hidden font-sans">
      {/* No teacher sidebar for student view */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        <QuizTakeClient userId={studentId} />
      </main>
    </div>
  );
}
