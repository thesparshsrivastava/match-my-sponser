'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';
import { EventCategory } from '@/types/event';

export interface EventFilters {
  categories: EventCategory[];
  audienceRange: {
    min: number;
    max: number;
  };
  location: string;
  budgetDistribution: string;
}

interface FilterPanelProps {
  filters: EventFilters;
  onFilterChange: (filters: EventFilters) => void;
}

const categoryOptions: { value: EventCategory; label: string }[] = [
  { value: 'college-fest', label: 'College Fest' },
  { value: 'competition', label: 'Competition' },
  { value: 'sports', label: 'Sports' },
  { value: 'hackathon', label: 'Hackathon' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'workshop', label: 'Workshop' },
];

const budgetDistributionOptions = [
  'Any',
  'Low (< $25K)',
  'Medium ($25K - $100K)',
  'High (> $100K)',
];

export function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const handleCategoryToggle = (category: EventCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];

    onFilterChange({
      ...filters,
      categories: newCategories,
    });
  };

  const handleAudienceChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || 0;
    onFilterChange({
      ...filters,
      audienceRange: {
        ...filters.audienceRange,
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

  const handleBudgetDistributionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      budgetDistribution: e.target.value,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      categories: [],
      audienceRange: { min: 0, max: 10000 },
      location: '',
      budgetDistribution: 'Any',
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.audienceRange.min > 0 ||
    filters.audienceRange.max < 10000 ||
    filters.location !== '' ||
    filters.budgetDistribution !== 'Any';

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

        {/* Category Filter */}
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Category</h4>
          <div className="space-y-2">
            {categoryOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.categories.includes(option.value)}
                  onChange={() => handleCategoryToggle(option.value)}
                  className="w-4 h-4 rounded border-gray-300 text-[#667eea] focus:ring-[#667eea]/20"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Audience Size Filter */}
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Audience Size</h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Minimum</label>
              <input
                type="number"
                value={filters.audienceRange.min}
                onChange={(e) => handleAudienceChange('min', e.target.value)}
                className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#667eea]/20"
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Maximum</label>
              <input
                type="number"
                value={filters.audienceRange.max}
                onChange={(e) => handleAudienceChange('max', e.target.value)}
                className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#667eea]/20"
                placeholder="10000"
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

        {/* Budget Distribution Filter */}
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Budget Distribution</h4>
          <select
            value={filters.budgetDistribution}
            onChange={handleBudgetDistributionChange}
            className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#667eea]/20"
          >
            {budgetDistributionOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-white/30">
            <p className="text-xs text-gray-600 mb-2">Active Filters:</p>
            <div className="flex flex-wrap gap-2">
              {filters.categories.map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#667eea]/10 text-xs text-[#667eea] font-medium"
                >
                  {categoryOptions.find((c) => c.value === category)?.label}
                  <button
                    onClick={() => handleCategoryToggle(category)}
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
