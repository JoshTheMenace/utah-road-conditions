'use client';

import { useEffect, useState } from 'react';

interface HeaderProps {
  lastUpdated?: string;
  isConnected: boolean;
}

export default function Header({ lastUpdated, isConnected }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="absolute top-0 left-0 right-0 z-[1000] bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 shadow-2xl border-b border-blue-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            {/* <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div> */}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Utah Road Conditions
              </h1>
              <p className="text-xs text-blue-200/80 font-medium">
                Real-time snow conditions monitoring
              </p>
            </div>
          </div>

          {/* Status and Time */}
          <div className="flex items-center space-x-4">
            {/* Current Time */}
            <div className="hidden sm:flex items-center space-x-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
              <svg
                className="w-4 h-4 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-mono text-blue-100">{currentTime}</span>
            </div>

            {/* Connection Status */}
            <div className="flex items-center space-x-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
              <div className="relative">
                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    isConnected ? 'bg-green-400' : 'bg-red-400'
                  }`}
                />
                {isConnected && (
                  <div className="absolute inset-0 h-2.5 w-2.5 rounded-full bg-green-400 animate-ping opacity-75" />
                )}
              </div>
              <span className={`text-xs font-semibold ${
                isConnected ? 'text-green-300' : 'text-red-300'
              }`}>
                {isConnected ? 'Live' : 'Offline'}
              </span>
            </div>

            {/* Last Updated */}
            {lastUpdated && (
              <div className="hidden md:flex items-center space-x-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                <svg
                  className="w-4 h-4 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="text-xs text-blue-200/80">
                  Updated {lastUpdated}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
