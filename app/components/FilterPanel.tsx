'use client';

import { useState } from 'react';

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

export default function FilterPanel({ onSearchChange, onFilterChange, onVisualizationModeChange, visualizationMode }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    showSafe: true,
    showCaution: true,
    showHazardous: true,
    showFailed: true,
  });

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleFilterToggle = (key: keyof FilterState) => {
    const newFilters = { ...filters, [key]: !filters[key] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="absolute top-[75px] left-2 sm:left-4 md:left-12 z-[1000] bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 w-[calc(50vw-1rem)] min-w-[160px] sm:w-auto sm:min-w-[200px] md:min-w-[240px] max-w-[320px]">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-2 sm:p-3 md:p-4 hover:bg-gray-50 transition-colors duration-200"
      >
        <span className="text-xs sm:text-sm md:text-base font-bold text-blue-700">
          Filters
        </span>
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
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-2 sm:px-3 md:px-4 pb-2 sm:pb-3 md:pb-4 space-y-2 sm:space-y-3 md:space-y-4 animate-fadeIn">
          {/* Search Input */}
          {/* <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search Cameras
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Enter camera name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              />
              <svg
                className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div> */}

          {/* Filter Checkboxes */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
              Condition Filters
            </label>
            <div className="space-y-1 sm:space-y-2">
              <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.showSafe}
                  onChange={() => handleFilterToggle('showSafe')}
                  className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <div className="flex items-center gap-1.5 sm:gap-2 group-hover:scale-105 transition-transform duration-200">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs sm:text-sm text-gray-700 font-medium">Clear</span>
                </div>
              </label>

              <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.showCaution}
                  onChange={() => handleFilterToggle('showCaution')}
                  className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                />
                <div className="flex items-center gap-1.5 sm:gap-2 group-hover:scale-105 transition-transform duration-200">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-xs sm:text-sm text-gray-700 font-medium">Caution</span>
                </div>
              </label>

              <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.showHazardous}
                  onChange={() => handleFilterToggle('showHazardous')}
                  className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <div className="flex items-center gap-1.5 sm:gap-2 group-hover:scale-105 transition-transform duration-200">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                  <span className="text-xs sm:text-sm text-gray-700 font-medium">Hazardous</span>
                </div>
              </label>

              <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.showFailed}
                  onChange={() => handleFilterToggle('showFailed')}
                  className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                />
                <div className="flex items-center gap-1.5 sm:gap-2 group-hover:scale-105 transition-transform duration-200">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gray-500"></div>
                  <span className="text-xs sm:text-sm text-gray-700 font-medium">Unknown</span>
                </div>
              </label>
            </div>
          </div>

          {/* Visualization Mode */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
              Map View
            </label>
            <div className="space-y-1.5 sm:space-y-2">
              <button
                onClick={() => onVisualizationModeChange('heatmap')}
                className={`w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition-all duration-200 ${
                  visualizationMode === 'heatmap'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
                </svg>
                <div className="flex-1 text-left min-w-0">
                  <div className="font-semibold text-xs sm:text-sm truncate">Heatmap</div>
                  <div className={`text-[10px] sm:text-xs ${visualizationMode === 'heatmap' ? 'text-purple-100' : 'text-gray-500'} hidden sm:block`}>
                    Area gradient
                  </div>
                </div>
                {visualizationMode === 'heatmap' && (
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              <button
                onClick={() => onVisualizationModeChange('markers')}
                className={`w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition-all duration-200 ${
                  visualizationMode === 'markers'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <div className="flex-1 text-left min-w-0">
                  <div className="font-semibold text-xs sm:text-sm truncate">Markers</div>
                  <div className={`text-[10px] sm:text-xs ${visualizationMode === 'markers' ? 'text-purple-100' : 'text-gray-500'} hidden sm:block`}>
                    Individual pins
                  </div>
                </div>
                {visualizationMode === 'markers' && (
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Reset Button */}
          {/* <button
            onClick={() => {
              setSearchTerm('');
              const resetFilters = {
                showSafe: true,
                showCaution: true,
                showHazardous: true,
                showFailed: true,
              };
              setFilters(resetFilters);
              onSearchChange('');
              onFilterChange(resetFilters);
            }}
            className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Reset All Filters
          </button> */}
        </div>
      )}
    </div>
  );
}
