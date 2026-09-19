'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useStudent } from '@/lib/nipun/StudentContext';

export default function StudentAuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useStudent();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Not logged in — send them back to login page with student tab hint
      router.replace('/login?role=student');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fef9f2] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
        <p className="text-base font-bold text-gray-600 font-fredoka">Loading your adventure...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect in progress — render nothing
    return null;
  }

  return <>{children}</>;
}
