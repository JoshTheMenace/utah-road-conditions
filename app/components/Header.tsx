'use client';

import { useEffect, useState } from 'react';

interface HeaderProps {
  lastUpdated?: string;
  isConnected: boolean;
}

export default function Header({ lastUpdated, isConnected }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

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
    setIsVisible(true);
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className={`
      absolute top-0 left-0 right-0 z-[1000]
      transition-all duration-700 ease-out
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
    `}>
      {/* Glass background with gradient border */}
      <div className="
        mx-2 sm:mx-4 mt-2 sm:mt-3
        bg-dark-900/70 backdrop-blur-xl
        border border-white/[0.08]
        rounded-2xl
        shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]
        overflow-hidden
      ">
        {/* Gradient line accent at top */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Animated Logo Icon */}
              <div className="relative group">
                <div className="
                  absolute inset-0
                  bg-gradient-to-br from-blue-500 to-violet-600
                  rounded-xl blur-lg opacity-50
                  group-hover:opacity-75 transition-opacity duration-300
                " />
                <div className="
                  relative flex items-center justify-center
                  w-10 h-10 sm:w-12 sm:h-12
                  bg-gradient-to-br from-blue-500 to-violet-600
                  rounded-xl shadow-lg
                  transform group-hover:scale-105 transition-transform duration-300
                ">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                </div>
              </div>

              <div>
                <h1 className="
                  text-lg sm:text-xl md:text-2xl
                  font-bold tracking-tight
                  text-gradient-blue
                ">
                  Utah Road Conditions
                </h1>
                <p className="
                  text-[10px] sm:text-xs
                  text-slate-400 font-medium
                  tracking-wide
                ">
                  Real-time AI-powered monitoring
                </p>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Current Time - Hidden on small mobile */}
              <div className="
                hidden sm:flex items-center gap-2
                px-3 py-2
                bg-white/[0.03] hover:bg-white/[0.06]
                border border-white/[0.06]
                rounded-xl
                transition-all duration-300
                group
              ">
                <div className="p-1.5 bg-slate-700/50 rounded-lg group-hover:bg-slate-600/50 transition-colors">
                  <svg
                    className="w-3.5 h-3.5 text-cyan-400"
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
                </div>
                <span className="text-sm font-mono text-slate-200 tabular-nums">
                  {currentTime}
                </span>
              </div>

              {/* Connection Status */}
              <div className={`
                flex items-center gap-2
                px-3 py-2
                border rounded-xl
                transition-all duration-300
                ${isConnected
                  ? 'bg-emerald-500/[0.08] border-emerald-500/20 hover:bg-emerald-500/[0.12]'
                  : 'bg-red-500/[0.08] border-red-500/20 hover:bg-red-500/[0.12]'
                }
              `}>
                <div className="relative">
                  <div className={`
                    h-2 w-2 rounded-full
                    ${isConnected ? 'bg-emerald-400' : 'bg-red-400'}
                  `} />
                  {isConnected && (
                    <div className="
                      absolute inset-0 h-2 w-2 rounded-full
                      bg-emerald-400 animate-ping opacity-75
                    " />
                  )}
                </div>
                <span className={`
                  text-xs sm:text-sm font-semibold tracking-wide
                  ${isConnected ? 'text-emerald-400' : 'text-red-400'}
                `}>
                  {isConnected ? 'LIVE' : 'OFFLINE'}
                </span>
              </div>

              {/* Last Updated - Hidden on mobile */}
              {lastUpdated && (
                <div className="
                  hidden md:flex items-center gap-2
                  px-3 py-2
                  bg-white/[0.03] hover:bg-white/[0.06]
                  border border-white/[0.06]
                  rounded-xl
                  transition-all duration-300
                  group
                ">
                  <div className="p-1.5 bg-slate-700/50 rounded-lg group-hover:bg-slate-600/50 transition-colors">
                    <svg
                      className="w-3.5 h-3.5 text-violet-400"
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
                  </div>
                  <span className="text-xs text-slate-400">
                    {lastUpdated}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
