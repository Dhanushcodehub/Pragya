'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Award, Map, Home, BookOpen, LogOut } from 'lucide-react';
import { MOCK_ACTIVE_STUDENT } from '@/lib/nipun/syntheticData';

export default function StudentHeader() {
  const pathname = usePathname();
  const student = MOCK_ACTIVE_STUDENT;

  const navItems = [
    { name: 'Home', href: '/student', icon: Home, emoji: '🏠' },
    { name: 'Quest Map', href: '/student/quest', icon: Map, emoji: '🗺️' },
    { name: 'Practice Zone', href: '/student/practice', icon: BookOpen, emoji: '🎯' },
    { name: 'Badges & Trophy', href: '/student/achievements', icon: Award, emoji: '🏆' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#fef9f2]/90 backdrop-blur-md border-b border-[#e6e2db] px-4 py-3 sm:px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <Link href="/student" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 border-2 border-amber-500 flex items-center justify-center text-xl font-black shadow-sm group-hover:scale-105 transition-transform">
              🌟
            </div>
            <div>
              <span className="text-xl font-bold font-fredoka tracking-tight text-amber-950 block leading-tight">
                Pragya <span className="text-amber-600 text-sm font-semibold">Kids</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-amber-800/70 tracking-wider block">
                Student Learning Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Child-Friendly Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#f2ede6] p-1.5 rounded-2xl border border-[#e6e2db]">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-amber-400 text-amber-950 shadow-sm scale-[1.02]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                }`}
              >
                <span>{item.emoji}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Student Badge & Teacher Exit Button */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl border border-amber-200 shadow-sm">
            <span className="text-xl">{student.avatar}</span>
            <div className="text-left">
              <p className="text-xs font-extrabold text-gray-900 leading-none">{student.name.split(' ')[0]}</p>
              <p className="text-[10px] font-semibold text-amber-700 leading-tight">Class {student.grade} &bull; Roll #{student.rollNo ?? '01'}</p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-200/80 hover:bg-gray-300/80 text-gray-700 text-xs font-bold transition-all"
            title="Switch to Teacher Dashboard"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Teacher View</span>
          </Link>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="flex md:hidden items-center justify-around gap-1 mt-3 pt-2 border-t border-[#e6e2db]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                isActive
                  ? 'bg-amber-400 text-amber-950 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="text-base">{item.emoji}</span>
              <span>{item.name.split(' ')[0]}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
