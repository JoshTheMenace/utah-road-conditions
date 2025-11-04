'use client';

import { useState } from 'react';

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
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  iconBg: string;
  percentage?: number;
}

function StatCard({ label, value, icon, bgColor, textColor, iconBg, percentage }: StatCardProps) {
  return (
    <div className={`${bgColor} rounded-lg p-2 sm:p-3 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-opacity-20`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={`${iconBg} rounded-lg p-1.5 sm:p-2 shadow-md`}>
            {icon}
          </div>
          <div>
            <p className={`text-xs sm:text-sm font-semibold ${textColor}`}>{label}</p>
            {percentage !== undefined && (
              <p className="text-xs text-gray-600">{percentage}%</p>
            )}
          </div>
        </div>
        <div className={`text-xl sm:text-2xl font-bold ${textColor}`}>
          {value}
        </div>
      </div>
    </div>
  );
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPercentage = (value: number) => {
    return stats.total > 0 ? Math.round((value / stats.total) * 100) : 0;
  };

  return (
    <div className="absolute top-[75px] right-2 sm:right-4 z-[1000] bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 w-[calc(100vw-1rem)] sm:w-auto sm:min-w-[280px] md:min-w-[300px] max-w-[350px]">
      {/* Toggle Button - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-gray-50 transition-colors duration-200"
      >
        <div className="flex items-center gap-2">
          <h3 className="text-sm sm:text-lg font-bold text-blue-700">
            Road Conditions
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {/* Mobile: Show total count when collapsed */}
          {!isExpanded && (
            <span className="text-xs sm:text-sm font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">
              {stats.total} cameras
            </span>
          )}
          <svg
            className={`w-4 h-4 sm:w-5 sm:h-5 text-blue-700 transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-3 sm:px-5 pb-3 sm:pb-5 animate-fadeIn">
          {/* Stats Cards */}
          <div className="space-y-2 sm:space-y-3">
            <StatCard
              label="Clear"
              value={stats.safe}
              percentage={getPercentage(stats.safe)}
              bgColor="bg-gradient-to-r from-green-50 to-emerald-50"
              textColor="text-green-700"
              iconBg="bg-green-500"
              icon={
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              }
            />

            <StatCard
              label="Caution"
              value={stats.caution}
              percentage={getPercentage(stats.caution)}
              bgColor="bg-gradient-to-r from-yellow-50 to-amber-50"
              textColor="text-yellow-700"
              iconBg="bg-yellow-500"
              icon={
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              }
            />

            <StatCard
              label="Hazardous"
              value={stats.hazardous}
              percentage={getPercentage(stats.hazardous)}
              bgColor="bg-gradient-to-r from-red-50 to-rose-50"
              textColor="text-red-700"
              iconBg="bg-red-500"
              icon={
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              }
            />

            {stats.failed > 0 && (
              <StatCard
                label="Failed"
                value={stats.failed}
                percentage={getPercentage(stats.failed)}
                bgColor="bg-gradient-to-r from-gray-50 to-slate-50"
                textColor="text-gray-700"
                iconBg="bg-gray-500"
                icon={
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                }
              />
            )}
          </div>

          {/* Total Summary */}
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-2 sm:p-3">
              <div className="flex items-center gap-2">
                <div className="bg-blue-500 rounded-full p-1 sm:p-1.5">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-blue-900">Total Cameras</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-blue-700">{stats.total}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
