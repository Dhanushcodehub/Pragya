import type { Metadata } from 'next';
import { Suspense } from 'react';
import LandingClient from '@/components/marketing/LandingClient';

export const metadata: Metadata = {
  title: 'PRAGYA — Making Learning Visible',
  description:
    'An ASER DIYA inspired foundational assessment engine that pinpoints exactly where learning breaks down. Assess every child, find the gaps, and help teachers teach what matters most.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'PRAGYA — Making Learning Visible',
    description:
      'ASER DIYA inspired foundational assessment engine.',
    url: '/',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <div
      className="font-sans antialiased overflow-x-hidden flex-1 flex flex-col min-h-screen relative grid-bg"
      style={{ backgroundColor: '#fef9f2', color: '#000000', fontFamily: 'var(--font-jakarta), sans-serif' }}
    >
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none" style={{ backgroundColor: 'rgba(124,92,255,0.05)' }} />

      {/* ── JSON-LD Structured Data ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'PRAGYA AI',
            applicationCategory: 'EducationApplication',
            description:
              'Pragya helps teachers launch every child to mastery using deterministic logic and AI Copilots.',
            url: process.env.NEXT_PUBLIC_APP_URL || 'https://focus-ai.app',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
              description: 'Free tier available',
            },
            featureList: [
              'Foundational reading assessment',
              'Numeracy learning diagnostics',
              'Teacher command center',
              'Interactive student quests',
            ],
          }),
        }}
      />

      <LandingClient />
    </div>
  );
}
