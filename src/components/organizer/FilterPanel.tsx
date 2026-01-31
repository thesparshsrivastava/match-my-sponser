'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';
import { GlassButton } from '@/components/shared/GlassButton';

export interface SponsorFilters {
  industries: string[];
  budgetRange: {
    min: number;
    max: number;
  };
  location: string;
}

interface FilterPanelProps {
  filters: SponsorFilters;
  onFilterChange: (filters: SponsorFilters) => void;
}

const industryOptions = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Retail',
  'Food & Beverage',
  'Entertainment',
  'Sports',
  'Fashion',
  'Automotive',
];

export function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const handleIndustryToggle = (industry: string) => {
    const newIndustries = filters.industries.includes(industry)
      ? filters.industries.filter((i) => i !== industry)
      : [...filters.industries, industry];

    onFilterChange({
      ...filters,
      industries: newIndustries,
    });
  };

  const handleBudgetChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || 0;
    onFilterChange({
      ...filters,
      budgetRange: {
        ...filters.budgetRange,
        [type]: numValue,
      },
    });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      location: e.target.value,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      industries: [],
      budgetRange: { min: 0, max: 1000000 },
      location: '',
    });
  };

  const hasActiveFilters =
    filters.industries.length > 0 ||
    filters.budgetRange.min > 0 ||
    filters.budgetRange.max < 1000000 ||
    filters.location !== '';

  return (
    <GlassCard padding="md" className="sticky top-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Industry Filter */}
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Industry</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {industryOptions.map((industry) => (
              <label
                key={industry}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.industries.includes(industry)}
                  onChange={() => handleIndustryToggle(industry)}
                  className="w-4 h-4 rounded border-gray-300 text-[#667eea] focus:ring-[#667eea]/20"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {industry}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Budget Range Filter */}
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Budget Range</h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Minimum ($)</label>
              <input
                type="number"
                value={filters.budgetRange.min}
                onChange={(e) => handleBudgetChange('min', e.target.value)}
                className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#667eea]/20"
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Maximum ($)</label>
              <input
                type="number"
                value={filters.budgetRange.max}
                onChange={(e) => handleBudgetChange('max', e.target.value)}
                className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#667eea]/20"
                placeholder="1000000"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Location Filter */}
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Location</h4>
          <input
            type="text"
            value={filters.location}
            onChange={handleLocationChange}
            className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#667eea]/20"
            placeholder="e.g., San Francisco, CA"
          />
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-white/30">
            <p className="text-xs text-gray-600 mb-2">Active Filters:</p>
            <div className="flex flex-wrap gap-2">
              {filters.industries.map((industry) => (
                <span
                  key={industry}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#667eea]/10 text-xs text-[#667eea] font-medium"
                >
                  {industry}
                  <button
                    onClick={() => handleIndustryToggle(industry)}
                    className="hover:text-[#764ba2]"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
