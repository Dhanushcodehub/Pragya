'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Award, Compass, HelpCircle, GraduationCap, FileText } from 'lucide-react';
import { signOutAction } from '@/app/auth/actions';

// ─── Colour constants matching the landing page design system ──────────────
const C = {
  cream: '#fef9f2',
  primary: '#000000',
  onPrimary: '#ffffff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f8f3ec',
  surfaceVariant: '#e6e2db',
  onSurface: '#1d1c18',
  onSurfaceVariant: '#45464d',
  outline: '#76777d',
  outlineVariant: '#c6c6cd',
  accentBlue: '#bec6e0',
};

interface SidebarProps {
  userEmail: string;
}

export default function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOutAction();
      router.push('/login');
    } catch (err) {
      console.error(err);
      window.location.href = '/login';
    }
  };

  const navItems = [
    { name: 'Learning DNA',   href: '/career-guidance', icon: GraduationCap },
  ];

  const displayName = userEmail.split('@')[0].toUpperCase();

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        /* Add top padding to the main element so content isn't hidden under the floating nav */
        main { padding-top: 110px !important; }
      `}} />

      {/* Desktop Floating Navbar */}
      <header 
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-full border shadow-xl flex items-center justify-between px-3 py-2 w-[95%] max-w-5xl transition-all"
        style={{ 
          backgroundColor: 'rgba(254, 249, 242, 0.85)', 
          backdropFilter: 'blur(20px)', 
          borderColor: C.surfaceVariant 
        }}
      >
        {/* Logo */}
        <Link href="/dashboard" className="hidden sm:flex items-center pl-4 pr-6 border-r" style={{ borderColor: C.surfaceVariant }}>
          <span className="text-xl font-bold tracking-tight" style={{ color: C.primary, fontFamily: 'var(--font-fredoka), sans-serif' }}>
            Pragya
          </span>
        </Link>
        
        {/* Nav Links */}
        <nav className="flex flex-1 items-center justify-center sm:justify-start sm:px-4 gap-1.5">
          {navItems.map(item => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap grow-0 shrink-0"
                style={
                  isActive
                    ? {
                        backgroundColor: C.primary,
                        color: C.onPrimary,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      }
                    : {
                        color: C.onSurfaceVariant,
                        backgroundColor: 'transparent',
                      }
                }
              >
                <Icon className="h-4 w-4" style={{ color: isActive ? C.onPrimary : C.outline }} />
                <span className="hidden md:inline">{item.name}</span>
                {/* On smaller screens inside the pill, just show icons until fully mobile */}
              </Link>
            );
          })}
        </nav>

        {/* User Block & Logout */}
        <div className="flex items-center gap-3 pl-4 sm:pl-6 pr-2 sm:border-l shrink-0" style={{ borderColor: C.surfaceVariant }}>
          <div
            className="hidden sm:flex h-9 w-9 rounded-full items-center justify-center font-bold text-xs border"
            style={{ backgroundColor: `${C.accentBlue}30`, borderColor: `${C.accentBlue}60`, color: '#5a6ba8' }}
            title={userEmail}
          >
            {displayName[0] || 'U'}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center p-2.5 rounded-full transition-all bg-white hover:bg-zinc-100 border text-zinc-600 hover:text-black shadow-sm"
            style={{ borderColor: C.surfaceVariant }}
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Mobile Floating Bottom Bar for extremely small screens where top pill shrinks too much */}
      <nav 
        className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full border shadow-2xl flex items-center justify-between px-2 py-2 w-[90%] transition-all"
        style={{ 
          backgroundColor: 'rgba(254, 249, 242, 0.95)', 
          backdropFilter: 'blur(20px)', 
          borderColor: C.surfaceVariant,
        }}
      >
        {navItems.map(item => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-1 items-center justify-center py-3 px-4 rounded-full transition-all duration-200"
                style={
                  isActive
                    ? { backgroundColor: C.primary, color: C.onPrimary }
                    : { color: C.onSurfaceVariant }
                }
              >
                <Icon className="h-5 w-5" />
              </Link>
            );
          })}
      </nav>
    </>
  );
}
