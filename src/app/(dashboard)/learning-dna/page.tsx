import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Sidebar from '@/components/dashboard/Sidebar';
import LearningDNAClient from './LearningDNAClient';

export const metadata = {
  title: 'Learning DNA | NIPUN Intelligence',
  description: 'Per-learner multidimensional skill profile — ASER-inspired evidence and next actions.',
};

export default async function LearningDNAPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#fef9f2', color: '#1d1c18', fontFamily: 'var(--font-jakarta), sans-serif' }}>
      <Sidebar userEmail={user.email!} />
      <main className="flex-1 overflow-y-auto p-8 md:p-12 relative">
        {/* Decorative background blobs */}
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none" style={{ backgroundColor: 'rgba(211,87,154,0.08)' }} />
        <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none" style={{ backgroundColor: 'rgba(190,198,224,0.12)' }} />
        
        <LearningDNAClient />
      </main>
    </div>
  );
}
