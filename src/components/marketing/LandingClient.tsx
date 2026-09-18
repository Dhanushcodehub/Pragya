'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

// ─── Colour constants matching the provided design system ─────────────────────
// (unchanged token set — only added a couple of derived/soft variants for depth)
const C = {
  cream: '#fef9f2',
  primary: '#000000',
  onPrimary: '#ffffff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f8f3ec',
  surfaceContainer: '#f2ede6',
  surfaceContainerHigh: '#ece7e1',
  surfaceVariant: '#e6e2db',
  onSurface: '#1d1c18',
  onSurfaceVariant: '#45464d',
  outline: '#76777d',
  outlineVariant: '#c6c6cd',
  inverseOnSurface: '#f5f0e9',
  inverseSurface: '#32302c',
  accentYellow: '#ffe24c',
  accentBlue: '#bec6e0',
  accentPink: '#ffafd3',
  accentGreen: '#86efac',
  accentPurple: '#d3579a',
  secondaryContainer: '#fcdf46',
};

// ─── Shared helpers ─────────────────────────────────────────────────────────
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

/** Subtle magnetic hover — nudges a button toward the cursor within its bounds. */
function useMagnetic(strength = 14) {
  const ref = useRef<HTMLElement | null>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * strength;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * strength;
    setStyle({ transform: `translate(${x}px, ${y}px)` });
  };
  const onMouseLeave = () => setStyle({ transform: 'translate(0px, 0px)' });

  return { ref, style, onMouseMove, onMouseLeave };
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = (
    <>
      <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="hover:text-black transition-colors">How it works</a>
      <a href="#capabilities" onClick={() => setMobileOpen(false)} className="hover:text-black transition-colors">Capabilities</a>
    </>
  );

  return (
    <nav
      style={{
        backgroundColor: scrolled ? 'rgba(254,249,242,0.85)' : C.cream,
        borderColor: scrolled ? C.surfaceVariant : 'transparent',
        boxShadow: scrolled ? '0 4px 24px rgba(29,28,24,0.06)' : 'none',
      }}
      className="sticky top-0 z-50 border-b backdrop-blur-md transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo + Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-1.5 group">
            <motion.span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: C.accentPurple }}
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
            
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Capabilities / Features Section ───────────────────────────────────────────
function CapabilitiesSection() {
  const capabilities = [
    {
      id: 'investigator',
      title: 'AI Learning Investigator',
      desc: "Doesn't just mark a child wrong. It forms a hypothesis, fires a targeted probe, gathers evidence, then explains the gap in plain language.",
      guardNote: 'This is your named differentiator — keep it in the hero (wide) slot.',
      simLabel: 'INVESTIGATOR TRACE → HYPOTHESIS ▶ PROBE EVIDENCE ▶ WHY',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      bg: C.accentPurple,
      textColor: '#ffffff',
      colSpan: 'md:col-span-2',
    },
    {
      id: 'conductor',
      title: 'Adaptive Diagnostic Conductor',
      desc: 'The teacher runs a short ASER-inspired check one-on-one and taps each response. Difficulty adapts in the background.',
      guardNote: 'Must carry the line: "the child never takes a digital test."',
      simLabel: 'LIVE PATH → LEVEL SHIFTS PER TAP',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bg: C.accentYellow,
      textColor: '#6b4f00',
      colSpan: 'md:col-span-1',
    },
    {
      id: 'dna',
      title: 'Learning DNA Profile',
      desc: 'Never one score. A sub-skill-by-skill profile — letter → word → sentence → paragraph → story — each with evidence and confidence.',
      guardNote: 'No raw % shown to students; this card is the teacher view.',
      simLabel: 'SUB-SKILL BARS + CONFIDENCE',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      bg: C.accentBlue,
      textColor: '#1e3a6e',
      colSpan: 'md:col-span-1',
    },
    {
      id: 'classroom',
      title: 'Classroom Intelligence',
      desc: "One screen for the whole class: a learning-level heatmap, auto-groups by shared need, and a single \"Today's Next Action.\"",
      guardNote: 'Group by need, never by rank. No public leaderboard.',
      simLabel: '40-LEARNER HEATMAP ▶ ONE NEXT ACTION',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      bg: C.accentGreen,
      textColor: '#15803d',
      colSpan: 'md:col-span-2',
    },
  ];

  return (
    <section id="capabilities" style={{ backgroundColor: C.cream }} className="py-24 relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-40 pointer-events-none" style={{ backgroundColor: C.accentPurple }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-40 pointer-events-none" style={{ backgroundColor: C.accentBlue }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl sm:text-5xl font-extrabold mb-4"
            style={{ color: C.primary, fontFamily: 'var(--font-jakarta), sans-serif' }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Four Tools. <br />
            <span style={{ color: C.accentPurple }}>One Teacher. Every Child.</span>
          </motion.h2>
          <motion.p
            className="max-w-2xl mx-auto text-lg"
            style={{ color: C.onSurfaceVariant }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Pragya gives every teacher a pocket intelligence layer — diagnose where each child actually is, group by shared need, and know exactly what to teach next.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {capabilities.map((cap, idx) => (
            <motion.div
              key={cap.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -5, scale: 1.01 }}
              className={`group relative rounded-[2rem] p-8 overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 ${cap.colSpan}`}
              style={{ backgroundColor: 'rgba(255,255,255,0.7)', borderColor: C.surfaceVariant, backdropFilter: 'blur(20px)' }}
            >
              {/* Animated hover gradient */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at 100% 100%, ${cap.bg}, transparent 70%)` }}
              />

              <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                <div>
                  {/* Icon badge */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300"
                    style={{ backgroundColor: cap.bg, color: cap.textColor }}
                  >
                    {cap.icon}
                  </div>
                  <h3 className="text-2xl font-extrabold tracking-tight mb-3" style={{ color: C.primary }}>
                    {cap.title}
                  </h3>
                  <p className="text-base leading-relaxed max-w-md" style={{ color: C.onSurfaceVariant }}>
                    {cap.desc}
                  </p>
                </div>

                {/* Sim-box — replaces old imagePlaceholder */}
                <div
                  className="relative w-full rounded-xl overflow-hidden border mt-auto"
                  style={{ backgroundColor: C.inverseSurface, borderColor: C.outline }}
                >
                  {/* Sim label row */}
                  <div className="flex items-center gap-2 px-4 py-2 border-b" style={{ borderColor: C.outline }}>
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: cap.bg }} />
                    <span
                      className="text-[11px] font-extrabold tracking-widest uppercase"
                      style={{ color: C.inverseOnSurface, fontFamily: 'monospace', letterSpacing: '0.08em' }}
                    >
                      {cap.simLabel}
                    </span>
                  </div>
                  {/* Decorative bar lines to suggest a live UI */}
                  <div className="px-4 py-3 flex flex-col gap-2">
                    <div className="h-2 rounded-full w-full opacity-30" style={{ backgroundColor: cap.bg }} />
                    <div className="h-2 rounded-full w-3/4 opacity-20" style={{ backgroundColor: cap.bg }} />
                    <div className="h-2 rounded-full w-1/2 opacity-10" style={{ backgroundColor: cap.bg }} />
                  </div>
                </div>

                {/* Guard note */}
                <p className="text-[11px] leading-snug italic" style={{ color: C.outline }}>
                  ⚑ {cap.guardNote}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


// ─── How it Works / Process Section ──────────────────────────────────────────
function ProcessSection() {
  const magnetic = useMagnetic(10);
  const steps = [
    {
      n: '1',
      title: 'The Check',
      desc: 'The teacher runs a short, ASER-inspired check one-on-one and taps each response. The child never takes a digital test.',
      proves: 'Methodology fidelity — teacher-administered, not a kid quiz',
      accent: false,
    },
    {
      n: '2',
      title: 'The Probe',
      desc: 'Difficulty adapts by rule; when evidence is thin, the investigator fires one targeted probe — never a black box.',
      proves: 'Deterministic core + confidence probe (§20, §25), anti-black-box (§35.4)',
      accent: false,
    },
    {
      n: '3',
      title: 'The Profile',
      desc: 'Each child is mapped skill by skill, letter to story, with evidence, confidence, and a gap vs the benchmark.',
      proves: 'Sub-skill classification + benchmark mapping (§11, §29)',
      accent: false,
    },
    {
      n: '4',
      title: 'The Plan',
      desc: 'One view shows who needs help with what, grouped by need, with a single next action — never a ranking.',
      proves: 'Teacher-facing summary + grouping-by-need + no-ranking (§8, §22)',
      accent: true,
    },
  ];

  return (
    <section id="how-it-works" style={{ backgroundColor: C.surfaceContainerLowest }} className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl sm:text-4xl font-extrabold mb-4"
            style={{ color: C.primary }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            One Session.{' '}
            <span style={{ color: C.accentPurple }}>Four Moments of Truth.</span>
          </motion.h2>
          <motion.p
            className="max-w-2xl mx-auto"
            style={{ color: C.onSurfaceVariant }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            From a single tap-based check to a full classroom plan — here is what happens inside every Pragya session.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">


          {steps.map(({ n, title, desc, proves, accent }, idx) => (
            <motion.div
              key={n}
              className="relative flex flex-col gap-4 p-5 rounded-2xl border"
              style={{
                backgroundColor: accent ? `${C.accentBlue}18` : C.surfaceContainerLowest,
                borderColor: accent ? C.accentBlue : C.surfaceVariant,
                zIndex: 1,
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
            >
              {/* Step number bubble */}
              <motion.div
                className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-lg shadow-md shrink-0"
                style={{
                  backgroundColor: accent ? C.accentBlue : C.primary,
                  color: accent ? C.primary : C.onPrimary,
                }}
                whileHover={{ scale: 1.15 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                {n}
              </motion.div>

              {/* Title + caption */}
              <div>
                <h4 className="font-extrabold text-lg mb-1.5" style={{ color: C.primary }}>{title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: C.onSurfaceVariant }}>{desc}</p>
              </div>

              {/* "What it secretly proves" badge */}
              <div
                className="mt-auto rounded-xl px-3 py-2.5 border"
                style={{
                  backgroundColor: C.inverseSurface,
                  borderColor: C.outline,
                }}
              >
                <p
                  className="text-[10px] font-extrabold uppercase tracking-widest mb-1"
                  style={{ color: C.accentPurple, fontFamily: 'monospace' }}
                >
                  ▸ What it proves
                </p>
                <p className="text-[11px] leading-snug" style={{ color: C.inverseOnSurface }}>
                  {proves}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA inside section */}
        <div className="mt-16 text-center">
          <Link
            ref={magnetic.ref as React.Ref<HTMLAnchorElement>}
            onMouseMove={magnetic.onMouseMove}
            onMouseLeave={magnetic.onMouseLeave}
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg transition-transform duration-150 ease-out hover:scale-[1.03] active:scale-[0.98] shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ backgroundColor: C.primary, color: C.onPrimary, boxShadow: '0 8px 24px rgba(0,0,0,0.18)', ...magnetic.style, '--tw-ring-color': C.primary } as React.CSSProperties}
          >
            Run Your First Check
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}


// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ backgroundColor: C.surfaceContainerLow, borderTopColor: C.surfaceVariant }} className="border-t pt-20 pb-10">
      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-4 text-center mb-16"
      >
        <h2 className="text-3xl font-extrabold mb-4" style={{ color: C.primary }}>
          Bring This to Your Cluster
        </h2>
        <p className="mb-8 text-lg" style={{ color: C.onSurfaceVariant }}>
          Join the waitlist to access the Pragya.
        </p>
        <Link
          href="/signup"
          className="inline-block px-10 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-all shadow-lg hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{ backgroundColor: C.primary, color: C.onPrimary, '--tw-ring-color': C.primary } as React.CSSProperties}
        >
          Get Early Access
        </Link>
      </motion.div>

      {/* Bottom bar */}
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t pt-10 flex flex-col md:flex-row justify-between items-center gap-6"
        style={{ borderColor: C.surfaceVariant }}
      >
        <div className="text-xl font-bold tracking-tight" style={{ color: C.outline, fontFamily: 'var(--font-fredoka), sans-serif' }}>Pragya</div>
        <div className="flex gap-6 text-sm" style={{ color: C.onSurfaceVariant }}>
          <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-black transition-colors">Contact</a>
        </div>
        <div className="text-sm" style={{ color: C.outline }}>© 2026 Pragya . All rights reserved.</div>
      </div>
    </footer>
  );
}

// ─── Scroll progress bar ───────────────────────────────────────────────────
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      style={{ scaleX: scrollYProgress, backgroundColor: C.primary }}
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[60]"
    />
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────
export default function LandingClient() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        <HeroSection />
        <ProblemSection />
        <CapabilitiesSection />
        <ProcessSection />
      </main>
      <Footer />
    </>
  );
}