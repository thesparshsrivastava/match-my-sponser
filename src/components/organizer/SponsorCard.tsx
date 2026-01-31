'use client';

import React from 'react';
import { Building2, MapPin, DollarSign, Sparkles } from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';
import { GlassButton } from '@/components/shared/GlassButton';
import { Sponsor } from '@/types/sponsor';
import { clsx } from 'clsx';

interface SponsorCardProps {
  sponsor: Sponsor;
  matchPercentage: number;
  onConnect?: () => void;
}

export function SponsorCard({ sponsor, matchPercentage, onConnect }: SponsorCardProps) {
  const getMatchColor = (percentage: number) => {
    if (percentage >= 70) return 'text-green-600 bg-green-50';
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getMatchGradient = (percentage: number) => {
    if (percentage >= 70) return 'from-green-500 to-green-600';
    if (percentage >= 50) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const formatBudget = (min: number, max: number) => {
    const formatNumber = (num: number) => {
      if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
      return `$${num}`;
    };
    return `${formatNumber(min)} - ${formatNumber(max)}`;
  };

  return (
    <GlassCard padding="md" hover>
      <div className="space-y-4">
        {/* Header with Logo and Match Score */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {sponsor.logoUrl ? (
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white">
                <img
                  src={sponsor.logoUrl}
                  alt={sponsor.companyName}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
                <Building2 size={24} className="text-white" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-bold text-gray-900">{sponsor.companyName}</h3>
              <p className="text-sm text-gray-600">{sponsor.industry}</p>
            </div>
          </div>

          {/* Match Percentage Badge */}
          <div
            className={clsx(
              'flex items-center gap-1 px-3 py-1.5 rounded-full font-bold text-sm',
              getMatchColor(matchPercentage)
            )}
          >
            <Sparkles size={14} />
            <span>{matchPercentage}%</span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <DollarSign size={16} className="text-gray-500" />
            <span>{formatBudget(sponsor.budgetRange.min, sponsor.budgetRange.max)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-700">
            <MapPin size={16} className="text-gray-500" />
            <span>{sponsor.location}</span>
          </div>
        </div>

        {/* Preferences */}
        {sponsor.preferences.categories.length > 0 && (
          <div>
            <p className="text-xs text-gray-600 mb-2">Interested in:</p>
            <div className="flex flex-wrap gap-2">
              {sponsor.preferences.categories.slice(0, 3).map((category) => (
                <span
                  key={category}
                  className="px-2 py-1 rounded-lg bg-white/40 text-xs font-medium text-gray-700"
                >
                  {category.replace('-', ' ')}
                </span>
              ))}
              {sponsor.preferences.categories.length > 3 && (
                <span className="px-2 py-1 rounded-lg bg-white/40 text-xs font-medium text-gray-700">
                  +{sponsor.preferences.categories.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Match Score Bar */}
        <div>
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Match Score</span>
            <span className="font-semibold">{matchPercentage}%</span>
          </div>
          <div className="w-full h-2 bg-white/40 rounded-full overflow-hidden">
            <div
              className={clsx(
                'h-full bg-gradient-to-r transition-all duration-500',
                getMatchGradient(matchPercentage)
              )}
              style={{ width: `${matchPercentage}%` }}
            />
          </div>
        </div>

        {/* Connect Button */}
        {onConnect && (
          <GlassButton
            variant="primary"
            size="sm"
            onClick={onConnect}
            className="w-full"
          >
            Connect
          </GlassButton>
        )}
      </div>
    </GlassCard>
  );
}
