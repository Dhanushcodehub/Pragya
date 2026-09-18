import React from 'react';
import StudentHeader from '@/components/nipun/StudentHeader';

export default function StudentPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fef9f2] text-[#1d1c18] font-sans flex flex-col">
      <StudentHeader />
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
