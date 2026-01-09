"use client";

import { useState } from 'react';

interface SearchFilterProps {
  onSearch?: (filters: FilterState) => void;
}

interface FilterState {
  region: string;
  date: string;
  category: string;
}

export default function SearchFilter({ onSearch }: SearchFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    region: 'All Regions',
    date: 'Date',
    category: 'All'
  });

  const regions = ['All Regions', 'North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania'];
  const categories = ['All', 'Technology', 'Business', 'Science', 'Health', 'Entertainment', 'Sports'];

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    onSearch?.(filters);
  };

  return (
    <div className="w-[95%] max-w-8xl mx-auto px-6 py-8 bg-gradient-to-br bg-[#27261C] rounded-3xl shadow-2xl">
      <div className="flex items-center gap-6 px-32">
        {/* Region Filter */}
        <div className="flex-1">
          <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2">
            Region
          </label>
          <select
            value={filters.region}
            onChange={(e) => handleFilterChange('region', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all cursor-pointer hover:bg-gray-800"
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div className="flex-1">
          <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2">
            Dates
          </label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => handleFilterChange('date', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all cursor-pointer hover:bg-gray-800"
          />
        </div>

        {/* Category Filter */}
        <div className="flex-1">
          <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all cursor-pointer hover:bg-gray-800"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <div className="flex-shrink-0 self-end">
          <button
            onClick={handleSearch}
            className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}