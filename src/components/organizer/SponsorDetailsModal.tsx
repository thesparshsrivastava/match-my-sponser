'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, MapPin, DollarSign, Sparkles, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Sponsor } from '@/types/sponsor';
import { GlassButton } from '@/components/shared/GlassButton';
import { createMatch } from '@/lib/api-client';

interface SponsorDetailsModalProps {
  sponsor: Sponsor | null;
  matchScore: number;
  isOpen: boolean;
  onClose: () => void;
  eventId?: string;
}

export function SponsorDetailsModal({ sponsor, matchScore, isOpen, onClose, eventId }: SponsorDetailsModalProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const router = useRouter();
  
  if (!sponsor) return null;

  const handleConnect = async () => {
    if (!eventId) {
      alert('Event ID is required to create a match');
      return;
    }
    
    setIsConnecting(true);
    try {
      await createMatch(eventId, sponsor.id);
      onClose();
      router.push('/organizer/chat');
    } catch (error) {
      console.error('Error creating match:', error);
      alert(error instanceof Error ? error.message : 'Failed to create match');
    } finally {
      setIsConnecting(false);
    }
  };

  const formatBudget = (min: number, max: number) => {
    const formatNumber = (num: number) => {
      if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
      return `$${num}`;
    };
    return `${formatNumber(min)} - ${formatNumber(max)}`;
  };

  const getMatchColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-50';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getCategoryLabel = (category: string) => {
    return category
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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
              className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="relative p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-t-3xl border-b border-indigo-100">
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

                {/* Company Info */}
                <div className="flex items-center gap-4 mt-8">
                  {sponsor.logoUrl ? (
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white shadow-lg">
                      <img
                        src={sponsor.logoUrl}
                        alt={sponsor.companyName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center shadow-lg">
                      <Building2 size={32} className="text-white" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{sponsor.companyName}</h2>
                    <p className="text-lg text-gray-600">{sponsor.industry}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-xl">
                    <DollarSign size={20} className="text-indigo-600" />
                    <div>
                      <p className="text-xs text-gray-600">Budget Range</p>
                      <p className="text-sm font-semibold text-gray-900">{formatBudget(sponsor.budgetRange.min, sponsor.budgetRange.max)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-xl">
                    <MapPin size={20} className="text-indigo-600" />
                    <div>
                      <p className="text-xs text-gray-600">Location</p>
                      <p className="text-sm font-semibold text-gray-900">{sponsor.location}</p>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                {sponsor.preferences.categories.length > 0 && (
                  <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Target size={20} className="text-indigo-600" />
                      <h3 className="text-lg font-bold text-gray-900">Interested In</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sponsor.preferences.categories.map((category) => (
                        <span
                          key={category}
                          className="px-3 py-1.5 rounded-lg bg-white/60 text-sm font-medium text-gray-700"
                        >
                          {getCategoryLabel(category)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Audience Preference */}
                <div className="p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Target Audience Size</h3>
                  <p className="text-gray-700">
                    {sponsor.preferences.audienceSize.min.toLocaleString()} - {sponsor.preferences.audienceSize.max.toLocaleString()} attendees
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <GlassButton
                    variant="primary"
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="flex-1"
                  >
                    {isConnecting ? 'Connecting...' : 'Connect & Chat'}
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
