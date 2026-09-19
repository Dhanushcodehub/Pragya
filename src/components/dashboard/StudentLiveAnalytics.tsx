'use client';

/**
 * StudentLiveAnalytics — industry-grade real-time learning analytics.
 *
 * Polls /api/nipun/attempts every 5 seconds while visible and renders:
 *  • Headline EWMA mastery gauge + readiness band + trend badge
 *  • Rolling mastery timeline (area chart) — updates the moment the student answers
 *  • Session-by-session accuracy vs mastery (composed bar+line chart)
 *  • NCERT chapter proficiency bars (weak chapters highlighted)
 *  • ASER level ladder radar
 *  • Auto-generated teaching insights
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ComposedChart, Bar, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';
import { Activity, Brain, TrendingUp, TrendingDown, Minus, Clock, Target, Radio } from 'lucide-react';
import { StudentAnalytics } from '@/lib/nipun/attemptAnalytics';

const READINESS_STYLES: Record<StudentAnalytics['readinessLevel'], { bg: string; label: string }> = {
  'at-risk': { bg: 'bg-red-100 text-red-700 border-red-200', label: 'At Risk' },
  'emerging': { bg: 'bg-orange-100 text-orange-700 border-orange-200', label: 'Emerging' },
  'developing': { bg: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Developing' },
  'proficient': { bg: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Proficient' },
  'advanced': { bg: 'bg-green-100 text-green-700 border-green-200', label: 'Advanced' },
};

const EMPTY: StudentAnalytics = {
  totalAttempts: 0, totalCorrect: 0, overallAccuracy: 0, masteryScore: 0,
  readinessLevel: 'at-risk', momentum: 0, trend: 'steady',
  fluency: { medianTimeSec: null, correctMedianSec: null, incorrectMedianSec: null, speedImprovementPct: 0 },
  sessions: [], masteryTimeline: [], chapterBreakdown: [], levelRadar: [],
  insights: [], lastActiveAt: null, hasData: false,
};

function timeAgo(iso: string | null): string {
  if (!iso) return 'never';
  const sec = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (sec < 60) return `${sec}s ago`;
  if (sec < 3600) return `${Math.round(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.round(sec / 3600)}h ago`;
  return `${Math.round(sec / 86400)}d ago`;
}

const tooltipStyle = {
  backgroundColor: '#fff',
  border: '1px solid #e4e4e7',
  borderRadius: '12px',
  fontSize: '11px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
} as const;

function TrendBadge({ trend, momentum }: { trend: StudentAnalytics['trend']; momentum: number }) {
  if (trend === 'improving') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold uppercase tracking-wider">
        <TrendingUp className="w-3 h-3" /> Improving +{momentum}
      </span>
    );
  }
  if (trend === 'declining') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-700 border border-red-200 text-[10px] font-extrabold uppercase tracking-wider">
        <TrendingDown className="w-3 h-3" /> Declining {momentum}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200 text-[10px] font-extrabold uppercase tracking-wider">
      <Minus className="w-3 h-3" /> Steady
    </span>
  );
}

function ChartCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3 text-zinc-700">
        {icon}
        <span className="text-[11px] font-extrabold uppercase tracking-wider">{title}</span>
      </div>
      {children}
    </div>
  );
}

export default function StudentLiveAnalytics({ learnerId }: { learnerId: string }) {
  const [analytics, setAnalytics] = useState<StudentAnalytics>(EMPTY);
  const [isLive, setIsLive] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const mountedRef = useRef(true);

  const fetchAnalytics = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/nipun/attempts?learnerId=${encodeURIComponent(learnerId)}`, { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (mountedRef.current && data.analytics) {
        setAnalytics(data.analytics);
        setIsLive(true);
        setLastSync(new Date());
      }
    } catch {
      // keep last good data; polling continues
    }
  }, [learnerId]);

  useEffect(() => {
    mountedRef.current = true;
    const initial = setTimeout(fetchAnalytics, 0);
    const interval = setInterval(fetchAnalytics, 5000);
    return () => {
      mountedRef.current = false;
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [fetchAnalytics]);

  const handleSimulateAttempts = async () => {
    setIsSimulating(true);
    try {
      const sampleAttempts = [
        { learnerId, pathway: 'reading', level: 'letter', questionId: 'q-sim-1', chapterNo: 1, chapterName: 'Letter Identification', subject: 'English', isCorrect: true, timeMs: 4200, mode: 'practice' },
        { learnerId, pathway: 'reading', level: 'word', questionId: 'q-sim-2', chapterNo: 2, chapterName: 'Sight Words', subject: 'English', isCorrect: true, timeMs: 5100, mode: 'practice' },
        { learnerId, pathway: 'numeracy', level: 'number_1_9', questionId: 'q-sim-3', chapterNo: 1, chapterName: 'Counting 1-9', subject: 'Math', isCorrect: true, timeMs: 3800, mode: 'practice' },
        { learnerId, pathway: 'numeracy', level: 'subtraction', questionId: 'q-sim-4', chapterNo: 3, chapterName: '2-Digit Subtraction', subject: 'Math', isCorrect: false, timeMs: 8200, mode: 'practice' },
        { learnerId, pathway: 'reading', level: 'paragraph', questionId: 'q-sim-5', chapterNo: 4, chapterName: 'Short Paragraphs', subject: 'English', isCorrect: true, timeMs: 7400, mode: 'challenge' },
      ];

      for (const att of sampleAttempts) {
        await fetch('/api/nipun/attempts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(att),
        });
      }

      await fetchAnalytics();
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  const readiness = READINESS_STYLES[analytics.readinessLevel];
  const masteryColor = analytics.masteryScore >= 65 ? '#10b981' : analytics.masteryScore >= 45 ? '#f59e0b' : '#ef4444';

  return (
    <div className="border-t border-zinc-100 bg-[#fffef0]">
      {/* Section header with LIVE indicator */}
      <div className="flex items-center justify-between px-7 pt-6 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider">Live Mastery Analytics</h3>
          {isLive && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-[9px] font-extrabold uppercase tracking-widest">
              <Radio className="w-2.5 h-2.5 animate-pulse" /> Live
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-zinc-400 font-mono">
            {analytics.totalAttempts} attempts · {lastSync ? `synced ${lastSync.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : 'syncing…'}
          </span>
          {analytics.hasData && (
            <button
              onClick={handleSimulateAttempts}
              disabled={isSimulating}
              className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full hover:bg-indigo-100 transition-colors disabled:opacity-50"
              title="Add sample practice question"
            >
              {isSimulating ? 'Adding…' : '+ Add Test Attempt'}
            </button>
          )}
        </div>
      </div>

      <div className="px-7 pb-7 space-y-4">
        {/* ── KPI ROW ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Mastery gauge */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 flex flex-col items-center justify-center">
            <div className="relative w-20 h-20">
              <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                <circle cx="40" cy="40" r="34" fill="none" stroke="#f4f4f5" strokeWidth="8" />
                <circle
                  cx="40" cy="40" r="34" fill="none"
                  stroke={masteryColor} strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${(analytics.masteryScore / 100) * 2 * Math.PI * 34} ${2 * Math.PI * 34}`}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-extrabold text-zinc-900 leading-none">{analytics.masteryScore}</span>
                <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Mastery</span>
              </div>
            </div>
            <span className={`mt-2 px-2.5 py-0.5 rounded-full border text-[9px] font-extrabold uppercase tracking-wider ${readiness.bg}`}>
              {readiness.label}
            </span>
          </div>

          {/* Accuracy */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              <Target className="w-3.5 h-3.5" /> Accuracy
            </div>
            <div>
              <div className="text-2xl font-extrabold text-zinc-900 leading-none">{analytics.overallAccuracy}%</div>
              <div className="text-[10px] text-zinc-400 font-medium mt-1">{analytics.totalCorrect}/{analytics.totalAttempts} correct</div>
            </div>
            <TrendBadge trend={analytics.trend} momentum={analytics.momentum} />
          </div>

          {/* Fluency */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" /> Fluency
            </div>
            <div>
              <div className="text-2xl font-extrabold text-zinc-900 leading-none">
                {analytics.fluency.medianTimeSec ? `${analytics.fluency.medianTimeSec}s` : '—'}
              </div>
              <div className="text-[10px] text-zinc-400 font-medium mt-1">median / question</div>
            </div>
            {analytics.fluency.speedImprovementPct !== 0 && (
              <span className={`text-[10px] font-extrabold ${analytics.fluency.speedImprovementPct > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {analytics.fluency.speedImprovementPct > 0 ? '⚡' : '🐢'} {Math.abs(analytics.fluency.speedImprovementPct)}% {analytics.fluency.speedImprovementPct > 0 ? 'faster' : 'slower'}
              </span>
            )}
          </div>

          {/* Sessions */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5" /> Practice
            </div>
            <div>
              <div className="text-2xl font-extrabold text-zinc-900 leading-none">{analytics.sessions.length}</div>
              <div className="text-[10px] text-zinc-400 font-medium mt-1">sessions logged</div>
            </div>
            <span className="text-[10px] font-bold text-zinc-500">Last active {timeAgo(analytics.lastActiveAt)}</span>
          </div>
        </div>

        {!analytics.hasData ? (
          <div className="bg-gradient-to-b from-white to-zinc-50 border-2 border-dashed border-zinc-200 rounded-3xl p-8 text-center space-y-4 shadow-2xs">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl shadow-xs">
              📊
            </div>
            <div>
              <p className="text-base font-extrabold text-zinc-900 font-heading">No Practice Attempts Recorded Yet</p>
              <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto leading-relaxed">
                Live graphs update instantly the moment this student answers questions in their <strong>Practice Zone</strong> or <strong>Mastery Quests</strong>.
              </p>
            </div>
            
            <button
              onClick={handleSimulateAttempts}
              disabled={isSimulating}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-black shadow-sm transition-transform active:scale-95 disabled:opacity-50"
            >
              <Activity className="w-4 h-4 text-amber-400" />
              {isSimulating ? 'Simulating 5 Practice Attempts...' : 'Simulate 5 Practice Attempts (Test Live Graphs) 🚀'}
            </button>
          </div>
        ) : (
          <>
            {/* ── MASTERY TIMELINE (real-time rolling EWMA) ── */}
            <ChartCard title="Mastery Timeline — updates as the student answers" icon={<Brain className="w-3.5 h-3.5 text-indigo-500" />}>
              <ResponsiveContainer width="100%" height={190}>
                <AreaChart data={analytics.masteryTimeline} margin={{ top: 5, right: 10, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="masteryFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={masteryColor} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={masteryColor} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                  <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#a1a1aa' }} interval="preserveStartEnd" minTickGap={24} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#a1a1aa' }} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}/100`, 'Mastery']} />
                  <Area type="monotone" dataKey="mastery" stroke={masteryColor} strokeWidth={2.5} fill="url(#masteryFill)" dot={false} activeDot={{ r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* ── SESSION ACCURACY vs MASTERY ── */}
            {analytics.sessions.length > 0 && (
              <ChartCard title="Session-by-session Progress" icon={<Activity className="w-3.5 h-3.5 text-amber-500" />}>
                <ResponsiveContainer width="100%" height={180}>
                  <ComposedChart data={analytics.sessions} margin={{ top: 5, right: 10, left: -18, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                    <XAxis dataKey="timeLabel" tick={{ fontSize: 9, fill: '#a1a1aa' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#a1a1aa' }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="accuracy" name="Session accuracy %" fill="#f59e0b" radius={[6, 6, 0, 0]} maxBarSize={38} />
                    <Line type="monotone" dataKey="masteryAfter" name="Mastery after" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3, fill: '#6366f1' }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartCard>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ── ASER LEVEL RADAR ── */}
              {analytics.levelRadar.length >= 3 && (
                <ChartCard title="Skill Ladder Radar" icon={<Target className="w-3.5 h-3.5 text-purple-500" />}>
                  <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={analytics.levelRadar} outerRadius="72%">
                      <PolarGrid stroke="#e4e4e7" />
                      <PolarAngleAxis dataKey="label" tick={{ fontSize: 9, fill: '#52525b' }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                      <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, 'Accuracy']} />
                      <Radar dataKey="accuracy" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.35} />
                    </RadarChart>
                  </ResponsiveContainer>
                </ChartCard>
              )}

              {/* ── CHAPTER PROFICIENCY ── */}
              {analytics.chapterBreakdown.length > 0 && (
                <ChartCard title="NCERT Chapter Proficiency" icon={<Brain className="w-3.5 h-3.5 text-emerald-500" />}>
                  <div className="space-y-2.5 max-h-[200px] overflow-y-auto pr-1">
                    {analytics.chapterBreakdown.map(c => (
                      <div key={c.chapter}>
                        <div className="flex justify-between items-baseline mb-0.5">
                          <span className="text-[11px] font-bold text-zinc-700 truncate pr-2">{c.shortName}</span>
                          <span className={`text-[10px] font-extrabold ${c.needsAttention ? 'text-red-600' : 'text-zinc-500'}`}>
                            {c.accuracy}% · {c.attempts}q
                          </span>
                        </div>
                        <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              c.needsAttention ? 'bg-red-400' : c.accuracy >= 80 ? 'bg-emerald-400' : 'bg-amber-400'
                            }`}
                            style={{ width: `${Math.max(c.accuracy, 4)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </ChartCard>
              )}
            </div>

            {/* ── AUTO INSIGHTS ── */}
            {analytics.insights.length > 0 && (
              <div className="bg-white border border-indigo-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2.5">
                  <Brain className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-700">AI Teaching Insights</span>
                </div>
                <ul className="space-y-1.5">
                  {analytics.insights.map((ins, i) => (
                    <li key={i} className="text-xs font-medium text-zinc-600 leading-relaxed flex gap-2">
                      <span className="shrink-0">{ins.split(' ')[0]}</span>
                      <span>{ins.split(' ').slice(1).join(' ')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
