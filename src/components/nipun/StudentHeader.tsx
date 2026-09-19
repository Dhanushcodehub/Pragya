'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Sparkles, Award, Map, Home, BookOpen, LogOut } from 'lucide-react';
import { useStudent } from '@/lib/nipun/StudentContext';

export default function StudentHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { learner, isLoading } = useStudent();

  const navItems = [
    { name: 'Home', href: '/student', icon: Home },
    { name: 'Quest Map', href: '/student/quest', icon: Map },
    { name: 'Practice Zone', href: '/student/practice', icon: BookOpen },
    { name: 'Badges & Trophy', href: '/student/achievements', icon: Award },
  ];

  const handleLogout = () => {
    localStorage.removeItem('pragya_student_id');
    localStorage.removeItem('pragya_student_name');
    router.push('/login');
  };

  return (
    <header className="bg-white border-b border-amber-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/student" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 border-2 border-amber-500 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6 text-amber-900" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-fredoka tracking-tight text-gray-900 leading-none">
              Pragya <span className="text-amber-500">Kids</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Student Learning Portal</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/student');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-all ${
                  isActive 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Right side - Profile & Logout */}
        <div className="flex items-center gap-4">
          {!isLoading && learner ? (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full shadow-inner">
              <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center border border-amber-200">
                <Award className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-900 leading-none">{learner.name.split(' ')[0]}</span>
                <span className="text-[10px] font-bold text-amber-600">Class {learner.grade}</span>
              </div>
            </div>
          ) : (
            <div className="w-24 h-8 bg-gray-100 animate-pulse rounded-full"></div>
          )}

          <button 
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
