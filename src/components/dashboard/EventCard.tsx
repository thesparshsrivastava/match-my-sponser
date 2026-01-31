import React from 'react';
import Image from 'next/image';
import { Calendar, MapPin, Users, Sparkles, Trash2, ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';
import { GlassButton } from '@/components/shared/GlassButton';
import { Event } from '@/types/event';
import { clsx } from 'clsx';

interface EventCardProps {
  event: Event;
  onClick?: () => void;
  onDelete?: () => void;
  showMatchScore?: boolean;
  matchScore?: number;
}

const categoryLabels: Record<string, string> = {
  'college-fest': 'College Fest',
  'competition': 'Competition',
  'sports': 'Sports',
  'hackathon': 'Hackathon',
  'cultural': 'Cultural',
  'workshop': 'Workshop',
};

export function EventCard({ event, onClick, onDelete, showMatchScore = false, matchScore }: EventCardProps) {
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const getMatchScoreColor = (score: number) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  return (
    <div className="glass-card overflow-hidden group hover:scale-[1.02] transition-all duration-300 flex flex-col h-full">
      {/* Banner Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop'}
          alt={event.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-4 right-4 flex gap-2">
          {showMatchScore && matchScore !== undefined && (
            <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold text-indigo-600 shadow-lg">
              {matchScore}% Match
            </div>
          )}
          <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/20">
            {categoryLabels[event.category] || event.category}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {event.name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        <div className="space-y-3 mb-6 flex-grow">
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar size={16} className="mr-2 text-indigo-500" />
            {formattedDate}
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin size={16} className="mr-2 text-indigo-500" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <Users size={16} className="mr-2 text-indigo-500" />
            {event.audienceSize.toLocaleString()} attendees
          </div>
        </div>

        <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100/50">
          {onClick && (
            <button
              onClick={onClick}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
            >
              View Details
              <ArrowRight size={16} />
            </button>
          )}

          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 border border-transparent hover:border-red-100"
              title="Delete Event"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
