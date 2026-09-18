import React, { Suspense } from 'react';
import PracticeZone from '@/components/nipun/PracticeZone';

export const metadata = {
  title: 'Practice Zone | Pragya Kids',
  description: 'Self-guided practice and XP mastery challenges.',
};

export default function StudentPracticePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500 font-bold">Loading Practice Zone...</div>}>
      <PracticeZone />
    </Suspense>
  );
}
