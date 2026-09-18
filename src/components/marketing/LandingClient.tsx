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
            <span
              className="text-3xl font-bold tracking-tight transition-transform group-hover:-translate-y-0.5"
              style={{ color: C.primary, fontFamily: 'var(--font-fredoka), sans-serif' }}
            >
              Pragya
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium" style={{ color: C.onSurfaceVariant }}>
            {navLinks}
          </div>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4 flex-1 justify-end">
          <Link
            href="/login"
            className="px-5 py-2 rounded-full text-sm font-semibold hover:opacity-80 transition-all whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ backgroundColor: C.primary, color: C.onPrimary, '--tw-ring-color': C.primary } as React.CSSProperties}
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2 rounded-full text-sm font-semibold border-2 hover:bg-[#f2ede6] transition-all whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ borderColor: C.primary, color: C.primary, '--tw-ring-color': C.primary } as React.CSSProperties}
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden p-2 rounded-full focus:outline-none focus-visible:ring-2"
          style={{ color: C.primary, '--tw-ring-color': C.primary } as React.CSSProperties}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t"
            style={{ borderColor: C.surfaceVariant, backgroundColor: C.cream }}
          >
            <div className="px-4 sm:px-6 py-5 flex flex-col gap-4 text-sm font-medium" style={{ color: C.onSurfaceVariant }}>
              {navLinks}
              <div className="flex gap-3 pt-2">
                <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-5 py-2.5 rounded-full text-sm font-semibold" style={{ backgroundColor: C.primary, color: C.onPrimary }}>
                  Login
                </Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-5 py-2.5 rounded-full text-sm font-semibold border-2" style={{ borderColor: C.primary, color: C.primary }}>
                  Sign Up
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const reducedMotion = usePrefersReducedMotion();
  const magnetic = useMagnetic(10);

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : 60]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0.4]);

  return (
    <section ref={sectionRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 overflow-hidden">
      {/* Ambient gradient wash behind the hero — the page's signature atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] -z-10"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${C.accentYellow}22, transparent 55%), radial-gradient(circle at 75% 20%, ${C.accentPink}22, transparent 50%), radial-gradient(circle at 50% 80%, ${C.accentBlue}20, transparent 55%)`,
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={reducedMotion ? undefined : { opacity: fade }}
          className="max-w-2xl"
        >
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 border"
            style={{ backgroundColor: `${C.accentYellow}30`, borderColor: `${C.accentYellow}80`, color: '#725e00' }}
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            ASER DIYA INSPIRED ASSESSMENT ENGINE
          </motion.div>

          <h1
            className="text-5xl sm:text-6xl font-extrabold leading-[1.05] tracking-tight mb-6"
            style={{ color: C.primary, fontFamily: 'var(--font-jakarta), sans-serif' }}
          >
            Making Learning ...     {'     '}
            <span className="relative inline-block">
              
              <span className="relative z-10" style={{ color: '#5a6ba8' }}>Easy.</span>
              <motion.span
                className="absolute left-0 bottom-1 w-full h-[6px] rounded-full -z-0"
                style={{ backgroundColor: C.accentPink }}
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.6, duration: 0.8 }}
              />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="text-lg mb-8 leading-relaxed"
            style={{ color: C.onSurfaceVariant }}
          >
            An ASER DIYA inspired foundational assessment engine that pinpoints exactly where learning breaks down. Assess every child, find the gaps, and help teachers teach what matters most.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              ref={magnetic.ref as React.Ref<HTMLAnchorElement>}
              onMouseMove={magnetic.onMouseMove}
              onMouseLeave={magnetic.onMouseLeave}
              style={{ backgroundColor: C.primary, color: C.onPrimary, boxShadow: '0 8px 24px rgba(0,0,0,0.18)', ...magnetic.style }}
              href="/signup"
              className="text-center px-8 py-4 rounded-full font-semibold transition-transform duration-150 ease-out hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              Get Started
            </Link>
            <a
              href="#how-it-works"
              className="text-center px-8 py-4 rounded-full font-semibold border-2 transition-all flex items-center justify-center gap-2 hover:bg-[#f2ede6] hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ borderColor: C.surfaceVariant, color: C.primary, backgroundColor: C.surfaceContainerLowest, '--tw-ring-color': C.primary } as React.CSSProperties}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" fillRule="evenodd" />
              </svg>
              Try Student Demo
            </a>
          </motion.div>
        </motion.div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          style={reducedMotion ? undefined : { y: parallaxY }}
          className="relative h-[550px] flex items-center justify-center"
        >
          {/* Blob shapes with breathing/morphing animation */}
          {!reducedMotion && (
            <>
              <motion.div
                className="absolute inset-0 blob-shape"
                style={{ background: `${C.accentYellow}25`, filter: 'blur(30px)' }}
                animate={{
                  scale: [1, 1.1, 0.95, 1],
                  rotate: [12, 45, -12, 12],
                  borderRadius: ['40% 60% 60% 40% / 40% 50% 50% 60%', '60% 40% 50% 50% / 50% 60% 40% 50%', '40% 60% 60% 40% / 40% 50% 50% 60%'],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute inset-0 blob-shape"
                style={{ background: `${C.accentPink}20`, filter: 'blur(30px)' }}
                animate={{
                  scale: [0.9, 1.05, 0.85, 0.9],
                  rotate: [-12, -35, 15, -12],
                  borderRadius: ['50% 50% 40% 60% / 60% 40% 60% 40%', '40% 60% 50% 50% / 50% 50% 40% 60%', '50% 50% 40% 60% / 60% 40% 60% 40%'],
                }}
                transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              />
            </>
          )}

          {/* Hero student image */}
          <div className="relative z-10 w-full max-w-sm">
            <motion.img
              src="/hero-student.jpg"
              alt="A smiling student holding a stack of books"
              className="w-full h-auto rounded-3xl shadow-2xl object-cover"
              style={{ borderRadius: '2rem' }}
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            />
          </div>

          {/* Floating badges with custom motion path */}
          {!reducedMotion && (
            <>
              <motion.div
                className="absolute top-8 right-4 px-4 py-2 rounded-xl shadow-lg border flex items-center gap-2"
                style={{ backgroundColor: C.surfaceContainerLowest, borderColor: C.surfaceVariant }}
                animate={{ y: [0, -10, 0], rotate: [6, 4, 6] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="w-3 h-3 rounded-full bg-green-500 animate-ping" />
                <span className="text-sm font-semibold" style={{ color: C.primary }}>Enjoy Learning</span>
              </motion.div>
              <motion.div
                className="absolute bottom-8 left-4 px-4 py-2 rounded-xl shadow-lg border flex items-center gap-2"
                style={{ backgroundColor: C.surfaceContainerLowest, borderColor: C.surfaceVariant }}
                animate={{ y: [0, 10, 0], rotate: [-6, -4, -6] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: C.accentBlue }} />
                <span className="text-sm font-semibold" style={{ color: C.primary }}>Happy Learning</span>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>

      {/* Stats bar */}
      <div
        className="mt-20 border-t pt-10 flex flex-wrap justify-center gap-12 sm:gap-24 text-center"
        style={{ borderColor: C.surfaceVariant }}
      >
        {[
          { value: '🔤', label: 'Read Words' },
          { value: '🔢', label: 'Count Numbers' },
          { value: '🏰', label: 'Unlock Worlds' },
        ].map(({ value, label }, idx) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 + idx * 0.1 }}
          >
            <div className="text-3xl font-extrabold" style={{ color: C.primary }}>{value}</div>
            <div className="text-sm font-medium mt-1" style={{ color: C.onSurfaceVariant }}>{label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Problem Section ──────────────────────────────────────────────────────────
function ProblemSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const angle = Math.atan2(deltaY, deltaX);
      const maxDist = 6;
      const dist = Math.min(Math.hypot(deltaX, deltaY) / 40, maxDist);
      const moveX = Math.cos(angle) * dist;
      const moveY = Math.sin(angle) * dist;
      container.style.setProperty('--eye-x', `${moveX}px`);
      container.style.setProperty('--eye-y', `${moveY}px`);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [reducedMotion]);

  return (
    <section style={{ backgroundColor: C.surfaceContainerLowest }} className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Character with eye-tracking, active hovers, and jump action */}
        <div className="flex justify-center mb-10 select-none">
          <motion.div
            ref={containerRef}
            className="w-32 h-32 relative group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => {
              if (isJumping) return;
              setIsJumping(true);
              setTimeout(() => setIsJumping(false), 900);
            }}
            animate={
              isJumping
                ? {
                    y: [0, -70, 8, -3, 0],
                    rotate: [0, 360, 360, 360, 360],
                    scale: [1, 1.15, 0.92, 1.04, 1],
                  }
                : isHovered
                  ? {
                      y: [0, -10, 0],
                      scale: 1.08,
                      rotate: [0, -2, 2, 0],
                    }
                  : {
                      y: [0, -4, 0],
                      scale: 1,
                    }
            }
            transition={
              isJumping
                ? { duration: 0.9, ease: 'easeInOut' }
                : isHovered
                  ? { duration: 0.6, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            {/* Owl character SVG */}
            <svg viewBox="0 0 120 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              {/* Body */}
              <ellipse cx="60" cy="75" rx="32" ry="38" fill="#fcdf46" />
              {/* Head */}
              <circle cx="60" cy="45" r="32" fill="#fcdf46" />
              {/* Ear tufts */}
              <polygon points="35,22 28,8 43,18" fill="#e2a800" />
              <polygon points="85,22 92,8 77,18" fill="#e2a800" />
              {/* Left eye white */}
              <circle cx="45" cy="44" r="13" fill="white" />
              {/* Right eye white */}
              <circle cx="75" cy="44" r="13" fill="white" />
              {/* Beak */}
              <polygon points="60,52 53,62 67,62" fill="#e2a800" />

              {/* Left Wing with flight/flap animation */}
              <motion.g
                style={{ transformOrigin: '28px 80px' }}
                animate={
                  isJumping
                    ? { rotate: [-15, -95, -15], scaleX: [1, 1.1, 1] }
                    : isHovered
                      ? { rotate: [-15, -80, 20, -15] }
                      : { rotate: [-15, -22, -15] }
                }
                transition={
                  isJumping
                    ? { duration: 0.9, ease: 'easeInOut' }
                    : isHovered
                      ? { duration: 0.22, repeat: Infinity, ease: 'easeInOut' }
                      : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
                }
              >
                <ellipse cx="28" cy="80" rx="12" ry="22" fill="#e2a800" />
              </motion.g>

              {/* Right Wing with flight/flap animation */}
              <motion.g
                style={{ transformOrigin: '92px 80px' }}
                animate={
                  isJumping
                    ? { rotate: [15, 95, 15], scaleX: [1, 1.1, 1] }
                    : isHovered
                      ? { rotate: [15, 80, -20, 15] }
                      : { rotate: [15, 22, 15] }
                }
                transition={
                  isJumping
                    ? { duration: 0.9, ease: 'easeInOut' }
                    : isHovered
                      ? { duration: 0.22, repeat: Infinity, ease: 'easeInOut' }
                      : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
                }
              >
                <ellipse cx="92" cy="80" rx="12" ry="22" fill="#e2a800" />
              </motion.g>

              {/* Feet */}
              <motion.g
                style={{ transformOrigin: '60px 112px' }}
                animate={
                  isJumping
                    ? { y: [0, 4, -4, 0], scaleY: [1, 0.7, 1.1, 1] }
                    : isHovered
                      ? { y: [0, -2, 0] }
                      : { y: 0 }
                }
                transition={{ duration: 0.6 }}
              >
                <ellipse cx="48" cy="112" rx="10" ry="5" fill="#e2a800" />
                <ellipse cx="72" cy="112" rx="10" ry="5" fill="#e2a800" />
              </motion.g>
            </svg>

            {/* Left pupil overlay - squints on hover/jump */}
            <motion.div
              className="absolute pupil transition-all duration-75"
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: '#1e293b',
                left: '28%',
                top: '33%',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'flex-end',
                padding: 3,
                zIndex: 20,
                transform: 'translate(var(--eye-x, 0px), var(--eye-y, 0px))',
              }}
              animate={
                isJumping
                  ? { scaleY: 0.15, scaleX: 1.1 }
                  : isHovered
                    ? { scale: 1.15 }
                    : { scale: 1 }
              }
            >
              {!isJumping && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </motion.div>

            {/* Right pupil overlay - winks/squints on hover/jump */}
            <motion.div
              className="absolute pupil transition-all duration-75"
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: '#1e293b',
                left: '55%',
                top: '31%',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'flex-end',
                padding: 4,
                zIndex: 20,
                transform: 'translate(var(--eye-x, 0px), var(--eye-y, 0px))',
              }}
              animate={
                isJumping
                  ? { scaleY: 0.15, scaleX: 1.1 }
                  : isHovered
                    ? { scale: 1.15 }
                    : { scale: 1 }
              }
            >
              {!isJumping && <div className="w-2 h-2 rounded-full bg-white" />}
            </motion.div>
          </motion.div>
        </div>

        <motion.h2
          className="text-3xl sm:text-4xl font-extrabold mb-6"
          style={{ color: C.primary }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Every Child Learns{' '}
          <span style={{ color: C.accentPurple }}>Differently</span>
        </motion.h2>
        <motion.p
          className="max-w-2xl mx-auto mb-12 text-lg leading-relaxed"
          style={{ color: C.onSurfaceVariant }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          Some children run ahead with words. Some need to meet each letter first. Neither is "slow" — they are just at different steps. The trouble begins when one lesson tries to fit all forty, and the child at the first step is left waiting in the back.
Best for: the softest, most parent/child-safe framing; pairs naturally with your owl mascot.
        </motion.p>

        {/* Pain-point cards */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { emoji: '👥', title: '40', desc: 'learners in one Class 5 room — all stamped the same grade' },
            { emoji: '📖', title: '1',  desc: 'textbook, one lesson, one pace — for children 3 levels apart'},
            { emoji: '❓', title: '0',  desc: 'at-a-glance sight of real reading levels at term start' },
          ].map(({ emoji, title, desc, source }, idx) => (
            <motion.div
              key={title + idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="p-6 rounded-3xl border text-left transition-all duration-300 flex flex-col gap-2"
              style={{ backgroundColor: C.surfaceContainerLow, borderColor: C.surfaceVariant }}
            >
              <div className="text-3xl">{emoji}</div>
              <div className="text-4xl font-extrabold" style={{ color: C.primary }}>{title}</div>
              <p className="text-sm leading-relaxed flex-1" style={{ color: C.onSurfaceVariant }}>{desc}</p>
              <span
                className="self-start text-[11px] font-bold px-2 py-0.5 rounded-md mt-1"
                style={{ backgroundColor: `${C.accentPurple}22`, color: C.accentPurple, fontFamily: 'monospace' }}
              >
                {source}
              </span>
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