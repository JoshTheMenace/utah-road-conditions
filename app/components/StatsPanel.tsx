'use client';

import { useState, useEffect } from 'react';

interface Stats {
  total: number;
  safe: number;
  caution: number;
  hazardous: number;
  failed: number;
}

interface StatsPanelProps {
  stats: Stats;
}

interface StatCardProps {
  label: string;
  value: number;
  percentage: number;
  gradientFrom: string;
  gradientTo: string;
  glowColor: string;
  icon: React.ReactNode;
  delay: number;
}

function StatCard({ label, value, percentage, gradientFrom, gradientTo, glowColor, icon, delay }: StatCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`
        relative group
        transition-all duration-500 ease-out
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
      `}
    >
      {/* Glow effect on hover */}
      <div
        className={`
          absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
          transition-opacity duration-500 blur-xl -z-10
          ${glowColor}
        `}
      />

      <div className={`
        relative overflow-hidden
        bg-gradient-to-br ${gradientFrom} ${gradientTo}
        border border-white/[0.08]
        rounded-xl p-3
        transition-all duration-300
        hover:border-white/[0.15]
        hover:shadow-lg hover:-translate-y-0.5
        group
      `}>
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Icon container */}
            <div className={`
              flex items-center justify-center
              w-10 h-10
              bg-white/10 backdrop-blur-sm
              rounded-lg
              shadow-inner
              transition-transform duration-300
              group-hover:scale-110
            `}>
              {icon}
            </div>

            {/* Label and percentage */}
            <div>
              <p className="text-sm font-semibold text-white/90">{label}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="h-1.5 w-16 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white/40 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-white/60 tabular-nums">{percentage}%</span>
              </div>
            </div>
          </div>

          {/* Value */}
          <div className="text-2xl font-bold text-white tabular-nums stats-number">
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getPercentage = (value: number) => {
    return stats.total > 0 ? Math.round((value / stats.total) * 100) : 0;
  };

  return (
    <div className={`
      absolute top-[85px] right-2 sm:right-4
      z-[1000]
      w-[calc(100vw-1rem)] sm:w-auto sm:min-w-[300px] max-w-[340px]
      transition-all duration-700 ease-out delay-100
      ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}
    `}>
      <div className="
        bg-dark-900/70 backdrop-blur-xl
        border border-white/[0.08]
        rounded-2xl
        shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        overflow-hidden
      ">
        {/* Gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-emerald-500/50 via-amber-500/50 to-rose-500/50" />

        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="
            w-full flex items-center justify-between
            p-4
            hover:bg-white/[0.02]
            transition-colors duration-300
            group
          "
        >
          <div className="flex items-center gap-3">
            <div className="
              p-2 rounded-lg
              bg-gradient-to-br from-blue-500/20 to-violet-500/20
              border border-white/[0.08]
            ">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-sm font-bold text-white">Road Conditions</h3>
              <p className="text-xs text-slate-400">Live camera analysis</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isExpanded && (
              <span className="
                text-xs font-bold text-blue-400
                bg-blue-500/10 border border-blue-500/20
                px-2.5 py-1 rounded-lg
              ">
                {stats.total}
              </span>
            )}
            <svg
              className={`
                w-5 h-5 text-slate-400
                transition-transform duration-300
                group-hover:text-white
                ${isExpanded ? 'rotate-180' : ''}
              `}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {/* Stats Content */}
        <div className={`
          overflow-hidden transition-all duration-500 ease-out
          ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
        `}>
          <div className="px-4 pb-4 space-y-2.5">
            {/* Clear/Safe */}
            <StatCard
              label="Clear"
              value={stats.safe}
              percentage={getPercentage(stats.safe)}
              gradientFrom="from-emerald-500/20"
              gradientTo="to-green-600/10"
              glowColor="bg-emerald-500/20"
              delay={50}
              icon={
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />

            {/* Caution */}
            <StatCard
              label="Caution"
              value={stats.caution}
              percentage={getPercentage(stats.caution)}
              gradientFrom="from-amber-500/20"
              gradientTo="to-orange-600/10"
              glowColor="bg-amber-500/20"
              delay={100}
              icon={
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              }
            />

            {/* Hazardous */}
            <StatCard
              label="Hazardous"
              value={stats.hazardous}
              percentage={getPercentage(stats.hazardous)}
              gradientFrom="from-rose-500/20"
              gradientTo="to-red-600/10"
              glowColor="bg-rose-500/20"
              delay={150}
              icon={
                <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />

            {/* Failed - Only show if there are failures */}
            {stats.failed > 0 && (
              <StatCard
                label="Unknown"
                value={stats.failed}
                percentage={getPercentage(stats.failed)}
                gradientFrom="from-slate-500/20"
                gradientTo="to-gray-600/10"
                glowColor="bg-slate-500/20"
                delay={200}
                icon={
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
            )}

            {/* Divider */}
            <div className="pt-2">
              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {/* Total Summary */}
            <div className="
              relative overflow-hidden
              bg-gradient-to-br from-blue-500/10 to-violet-500/10
              border border-white/[0.08]
              rounded-xl p-3
            ">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="
                    flex items-center justify-center
                    w-10 h-10
                    bg-gradient-to-br from-blue-500/30 to-violet-500/30
                    rounded-lg
                  ">
                    <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white/90">Total Cameras</p>
                    <p className="text-xs text-slate-400">Monitoring statewide</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gradient-blue tabular-nums">
                  {stats.total}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
