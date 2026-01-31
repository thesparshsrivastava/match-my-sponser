'use client';

import React from 'react';
import { Calendar, MapPin, Users, Sparkles } from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';
import { GlassButton } from '@/components/shared/GlassButton';
import { Event } from '@/types/event';
import { clsx } from 'clsx';

interface EventDiscoveryCardProps {
  event: Event;
  matchScore: number;
  onViewDetails: () => void;
}

export function EventDiscoveryCard({ event, matchScore, onViewDetails }: EventDiscoveryCardProps) {
  const getMatchColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-50';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getMatchGradient = (score: number) => {
    if (score >= 70) return 'from-green-500 to-green-600';
    if (score >= 50) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatAudience = (size: number) => {
    if (size >= 1000) return `${(size / 1000).toFixed(1)}K`;
    return `${size}`;
  };

  const getCategoryLabel = (category: string) => {
    return category
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <GlassCard padding="md" hover>
      <div className="space-y-4">
        {/* Banner Image or Gradient */}
        <div className="relative h-40 rounded-2xl overflow-hidden">
          {event.bannerUrl ? (
            <img
              src={event.bannerUrl}
              alt={event.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#667eea] to-[#764ba2]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Match Score Badge */}
          <div className="absolute top-3 right-3">
            <div
              className={clsx(
                'flex items-center gap-1 px-3 py-1.5 rounded-full font-bold text-sm backdrop-blur-md',
                getMatchColor(matchScore)
              )}
            >
              <Sparkles size={14} />
              <span>{matchScore}%</span>
            </div>
          </div>

          {/* Category Badge */}
          <div className="absolute bottom-3 left-3">
            <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-900">
              {getCategoryLabel(event.category)}
            </span>
          </div>
        </div>

        {/* Event Title */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{event.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
        </div>

        {/* Event Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Calendar size={16} className="text-gray-500" />
            <span>{formatDate(event.date)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-700">
            <MapPin size={16} className="text-gray-500" />
            <span>{event.location}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Users size={16} className="text-gray-500" />
            <span>{formatAudience(event.audienceSize)} attendees</span>
          </div>
        </div>

        {/* Sponsorship Requirements Preview */}
        <div className="pt-3 border-t border-white/30">
          <p className="text-xs text-gray-600 mb-1">Sponsorship Requirements:</p>
          <p className="text-sm text-gray-700 line-clamp-2">
            {event.sponsorshipRequirements}
          </p>
        </div>

        {/* Match Score Bar */}
        <div>
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Match Score</span>
            <span className="font-semibold">{matchScore}%</span>
          </div>
          <div className="w-full h-2 bg-white/40 rounded-full overflow-hidden">
            <div
              className={clsx(
                'h-full bg-gradient-to-r transition-all duration-500',
                getMatchGradient(matchScore)
              )}
              style={{ width: `${matchScore}%` }}
            />
          </div>
        </div>

        {/* View Details Button */}
        <GlassButton
          variant="primary"
          size="sm"
          onClick={onViewDetails}
          className="w-full"
        >
          View Details
        </GlassButton>
      </div>
    </GlassCard>
  );
}
