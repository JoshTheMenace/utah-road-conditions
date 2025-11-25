'use client';

import { useEffect, useState } from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <footer className={`
      absolute bottom-0 left-0 right-0 z-[1000]
      transition-all duration-700 ease-out delay-300
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
    `}>
      <div className="
        mx-2 sm:mx-4 mb-2 sm:mb-3
        bg-dark-900/60 backdrop-blur-xl
        border border-white/[0.06]
        rounded-xl
        shadow-[0_-4px_20px_rgba(0,0,0,0.3)]
        overflow-hidden
      ">
        {/* Gradient line accent at top */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

        <div className="px-4 sm:px-6 py-2.5 sm:py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            {/* Left side - Branding */}
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <div className="
                flex items-center gap-1.5
                text-slate-400
              ">
                <span className="text-slate-500">&copy;</span>
                <span>{currentYear}</span>
                <span className="hidden sm:inline text-slate-600">|</span>
                <span className="font-medium text-gradient-blue">
                  Utah Road Conditions
                </span>
              </div>
            </div>

            {/* Right side - Info */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* AI Badge */}
              <div className="
                flex items-center gap-1.5
                px-2 py-1
                bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10
                border border-violet-500/20
                rounded-lg
              ">
                <svg
                  className="w-3 h-3 text-violet-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-[10px] sm:text-xs font-medium text-violet-300">
                  AI-Powered
                </span>
              </div>

              {/* Divider */}
              <div className="h-4 w-px bg-white/10" />

              {/* Disclaimer */}
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-500">
                <svg
                  className="w-3 h-3 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Not affiliated with UDOT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
