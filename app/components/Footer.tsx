'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="absolute bottom-0 left-0 right-0 z-[1000] bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 border-t border-blue-500/20">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Left side - Copyright */}
          <div className="flex items-center space-x-2 text-sm text-blue-200/80">
            {/* <svg
              className="w-4 h-4 text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              />
            </svg> */}
            <span>
              {currentYear} Live Utah Road Conditions
            </span>
          </div>

          {/* Right side - Links */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs text-blue-300/70">
              {/* <svg
                className="w-3.5 h-3.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg> */}
              {/* <span>Powered by AI road analysis</span> */}
            </div>

            {/* <div className="h-4 w-px bg-blue-500/30"></div> */}

            <div className="text-xs text-blue-300/70 flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5"
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
    </footer>
  );
}
