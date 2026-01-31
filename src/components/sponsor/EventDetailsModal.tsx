'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Users, Sparkles, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Event } from '@/types/event';
import Image from 'next/image';
import { GlassButton } from '@/components/shared/GlassButton';
import { createMatch } from '@/lib/api-client';
import { createClient } from '@/utils/supabase/client';

interface EventDetailsModalProps {
  event: Event | null;
  matchScore: number;
  isOpen: boolean;
  onClose: () => void;
}

export function EventDetailsModal({ event, matchScore, isOpen, onClose }: EventDetailsModalProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  if (!event) return null;

  const handleExpressInterest = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('Please log in to express interest');
      return;
    }

    setIsConnecting(true);
    try {
      // For sponsors, we need to get their sponsor profile ID
      // For now, using user.id as sponsor ID (this should match the sponsor table)
      await createMatch(event.id, user.id);
      onClose();
      router.push('/sponsor/chat');
    } catch (error) {
      console.error('Error expressing interest:', error);
      alert(error instanceof Error ? error.message : 'Failed to express interest');
    } finally {
      setIsConnecting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
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

  const getMatchColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-50';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header with Banner */}
              <div className="relative h-64 rounded-t-3xl overflow-hidden">
                {event.bannerUrl ? (
                  <Image
                    src={event.bannerUrl}
                    alt={event.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#667eea] to-[#764ba2]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
                >
                  <X size={20} />
                </button>

                {/* Match Score Badge */}
                <div className="absolute top-4 left-4">
                  <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-bold text-sm backdrop-blur-md ${getMatchColor(matchScore)}`}>
                    <Sparkles size={14} />
                    <span>{matchScore}% Match</span>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-900">
                    {getCategoryLabel(event.category)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                {/* Title */}
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{event.name}</h2>
                  <p className="text-gray-600">{event.description}</p>
                </div>

                {/* Event Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-xl">
                    <Calendar size={20} className="text-indigo-600" />
                    <div>
                      <p className="text-xs text-gray-600">Date</p>
                      <p className="text-sm font-semibold text-gray-900">{formatDate(event.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-xl">
                    <MapPin size={20} className="text-indigo-600" />
                    <div>
                      <p className="text-xs text-gray-600">Location</p>
                      <p className="text-sm font-semibold text-gray-900">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-xl">
                    <Users size={20} className="text-indigo-600" />
                    <div>
                      <p className="text-xs text-gray-600">Audience</p>
                      <p className="text-sm font-semibold text-gray-900">{formatAudience(event.audienceSize)} attendees</p>
                    </div>
                  </div>
                </div>

                {/* Sponsorship Requirements */}
                <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign size={20} className="text-indigo-600" />
                    <h3 className="text-lg font-bold text-gray-900">Sponsorship Requirements</h3>
                  </div>
                  <p className="text-gray-700">{event.sponsorshipRequirements}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <GlassButton
                    variant="primary"
                    onClick={handleExpressInterest}
                    disabled={isConnecting}
                    className="flex-1"
                  >
                    {isConnecting ? 'Connecting...' : 'Express Interest'}
                  </GlassButton>
                  <GlassButton
                    variant="secondary"
                    onClick={onClose}
                    className="px-6"
                  >
                    Close
                  </GlassButton>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
