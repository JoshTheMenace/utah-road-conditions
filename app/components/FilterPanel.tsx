'use client';

import { useState, useEffect } from 'react';

interface FilterPanelProps {
  onSearchChange: (search: string) => void;
  onFilterChange: (filters: FilterState) => void;
  onVisualizationModeChange: (mode: 'markers' | 'heatmap') => void;
  visualizationMode: 'markers' | 'heatmap';
}

export interface FilterState {
  showSafe: boolean;
  showCaution: boolean;
  showHazardous: boolean;
  showFailed: boolean;
}

interface FilterCheckboxProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  color: string;
  glowColor: string;
}

function FilterCheckbox({ checked, onChange, label, color, glowColor }: FilterCheckboxProps) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group py-1.5">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className={`
          w-5 h-5 rounded-md
          border-2 transition-all duration-300
          flex items-center justify-center
          ${checked
            ? `${color} border-transparent`
            : 'bg-white/5 border-white/20 group-hover:border-white/40'
          }
          ${checked ? glowColor : ''}
        `}>
          {checked && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        <span className={`
          text-sm font-medium transition-colors duration-200
          ${checked ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}
        `}>
          {label}
        </span>
      </div>
    </label>
  );
}

export default function FilterPanel({ onSearchChange, onFilterChange, onVisualizationModeChange, visualizationMode }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    showSafe: true,
    showCaution: true,
    showHazardous: true,
    showFailed: true,
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleFilterToggle = (key: keyof FilterState) => {
    const newFilters = { ...filters, [key]: !filters[key] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className={`
      absolute top-[85px] left-2 sm:left-4
      z-[1000]
      w-[180px] sm:w-[220px]
      transition-all duration-700 ease-out delay-200
      ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}
    `}>
      <div className="
        bg-dark-900/70 backdrop-blur-xl
        border border-white/[0.08]
        rounded-2xl
        shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        overflow-hidden
      ">
        {/* Gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-cyan-500/50 via-violet-500/50 to-fuchsia-500/50" />

        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="
            w-full flex items-center justify-between
            p-3 sm:p-4
            hover:bg-white/[0.02]
            transition-colors duration-300
            group
          "
        >
          <div className="flex items-center gap-2.5">
            <div className="
              p-1.5 sm:p-2 rounded-lg
              bg-gradient-to-br from-cyan-500/20 to-violet-500/20
              border border-white/[0.08]
            ">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-white">Filters</span>
          </div>

          <svg
            className={`
              w-4 h-4 sm:w-5 sm:h-5 text-slate-400
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
        </button>

        {/* Filter Content */}
        <div className={`
          overflow-hidden transition-all duration-500 ease-out
          ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
        `}>
          <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-4">
            {/* Condition Filters */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Conditions
              </label>
              <div className="space-y-0.5">
                <FilterCheckbox
                  checked={filters.showSafe}
                  onChange={() => handleFilterToggle('showSafe')}
                  label="Clear"
                  color="bg-emerald-500"
                  glowColor="shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                />
                <FilterCheckbox
                  checked={filters.showCaution}
                  onChange={() => handleFilterToggle('showCaution')}
                  label="Caution"
                  color="bg-amber-500"
                  glowColor="shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                />
                <FilterCheckbox
                  checked={filters.showHazardous}
                  onChange={() => handleFilterToggle('showHazardous')}
                  label="Hazardous"
                  color="bg-rose-500"
                  glowColor="shadow-[0_0_10px_rgba(244,63,94,0.3)]"
                />
                <FilterCheckbox
                  checked={filters.showFailed}
                  onChange={() => handleFilterToggle('showFailed')}
                  label="Unknown"
                  color="bg-slate-500"
                  glowColor="shadow-[0_0_10px_rgba(100,116,139,0.3)]"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Visualization Mode */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Map View
              </label>
              <div className="space-y-2">
                {/* Heatmap Option */}
                <button
                  onClick={() => onVisualizationModeChange('heatmap')}
                  className={`
                    w-full flex items-center gap-2.5
                    p-2.5 rounded-xl
                    transition-all duration-300
                    ${visualizationMode === 'heatmap'
                      ? 'bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30 border border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                      : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1]'
                    }
                  `}
                >
                  <div className={`
                    p-1.5 rounded-lg transition-colors duration-300
                    ${visualizationMode === 'heatmap'
                      ? 'bg-violet-500/30'
                      : 'bg-white/[0.05]'
                    }
                  `}>
                    <svg className={`w-4 h-4 ${visualizationMode === 'heatmap' ? 'text-violet-300' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <div className={`text-sm font-semibold ${visualizationMode === 'heatmap' ? 'text-white' : 'text-slate-300'}`}>
                      Heatmap
                    </div>
                  </div>
                  {visualizationMode === 'heatmap' && (
                    <svg className="w-4 h-4 text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>

                {/* Markers Option */}
                <button
                  onClick={() => onVisualizationModeChange('markers')}
                  className={`
                    w-full flex items-center gap-2.5
                    p-2.5 rounded-xl
                    transition-all duration-300
                    ${visualizationMode === 'markers'
                      ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1]'
                    }
                  `}
                >
                  <div className={`
                    p-1.5 rounded-lg transition-colors duration-300
                    ${visualizationMode === 'markers'
                      ? 'bg-cyan-500/30'
                      : 'bg-white/[0.05]'
                    }
                  `}>
                    <svg className={`w-4 h-4 ${visualizationMode === 'markers' ? 'text-cyan-300' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <div className={`text-sm font-semibold ${visualizationMode === 'markers' ? 'text-white' : 'text-slate-300'}`}>
                      Markers
                    </div>
                  </div>
                  {visualizationMode === 'markers' && (
                    <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
