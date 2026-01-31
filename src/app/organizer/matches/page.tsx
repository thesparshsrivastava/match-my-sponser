'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FilterPanel, SponsorFilters } from '@/components/organizer/FilterPanel';
import { SponsorCard } from '@/components/organizer/SponsorCard';
import { SponsorDetailsModal } from '@/components/organizer/SponsorDetailsModal';
import { Sponsor } from '@/types/sponsor';
import { calculateMatchScore } from '@/lib/matching';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const sponsorData: Sponsor[] = [
  {
    id: 'sponsor-1',
    userId: 'user-2',
    companyName: 'TechCorp Solutions',
    industry: 'Technology',
    budgetRange: { min: 50000, max: 150000 },
    location: 'San Francisco, CA',
    logoUrl: undefined,
    preferences: {
      categories: ['hackathon', 'workshop', 'competition'],
      audienceSize: { min: 200, max: 1000 },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'sponsor-2',
    userId: 'user-3',
    companyName: 'Energy Boost Drinks',
    industry: 'Food & Beverage',
    budgetRange: { min: 30000, max: 80000 },
    location: 'Austin, TX',
    logoUrl: undefined,
    preferences: {
      categories: ['sports', 'college-fest', 'cultural'],
      audienceSize: { min: 500, max: 3000 },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'sponsor-3',
    userId: 'user-4',
    companyName: 'Fashion Forward Inc',
    industry: 'Fashion',
    budgetRange: { min: 20000, max: 60000 },
    location: 'New York, NY',
    logoUrl: undefined,
    preferences: {
      categories: ['cultural', 'college-fest'],
      audienceSize: { min: 300, max: 2000 },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'sponsor-4',
    userId: 'user-5',
    companyName: 'Global Finance Group',
    industry: 'Finance',
    budgetRange: { min: 100000, max: 300000 },
    location: 'Chicago, IL',
    logoUrl: undefined,
    preferences: {
      categories: ['competition', 'workshop', 'hackathon'],
      audienceSize: { min: 500, max: 2000 },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'sponsor-5',
    userId: 'user-6',
    companyName: 'Sports Gear Pro',
    industry: 'Sports',
    budgetRange: { min: 40000, max: 100000 },
    location: 'Los Angeles, CA',
    logoUrl: undefined,
    preferences: {
      categories: ['sports', 'college-fest'],
      audienceSize: { min: 1000, max: 5000 },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'sponsor-6',
    userId: 'user-7',
    companyName: 'EduTech Innovations',
    industry: 'Education',
    budgetRange: { min: 25000, max: 70000 },
    location: 'Boston, MA',
    logoUrl: undefined,
    preferences: {
      categories: ['workshop', 'hackathon', 'competition'],
      audienceSize: { min: 100, max: 800 },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function FindSponsorsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<SponsorFilters>({
    industries: [],
    budgetRange: { min: 0, max: 1000000 },
    location: '',
  });

  const [filteredSponsors, setFilteredSponsors] = useState<Sponsor[]>(sponsorData);
  const [matchScores, setMatchScores] = useState<Record<string, number>>({});
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Apply filters
    let filtered = sponsorData;

    // Filter by industry
    if (filters.industries.length > 0) {
      filtered = filtered.filter((sponsor) =>
        filters.industries.includes(sponsor.industry)
      );
    }

    // Filter by budget range
    filtered = filtered.filter(
      (sponsor) =>
        sponsor.budgetRange.max >= filters.budgetRange.min &&
        sponsor.budgetRange.min <= filters.budgetRange.max
    );

    // Filter by location
    if (filters.location) {
      filtered = filtered.filter((sponsor) =>
        sponsor.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredSponsors(filtered);

    // Calculate match scores using the matching algorithm
    const currentEvent = {
      id: 'event-1',
      organizerId: 'user-1',
      name: 'Tech Innovation Summit',
      category: 'hackathon' as const,
      location: 'San Francisco, CA',
      audienceSize: 500,
      date: new Date('2024-06-15'),
      description: 'A premier technology event',
      sponsorshipRequirements: 'Looking for tech sponsors',
      status: 'published' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const scores: Record<string, number> = {};
    filtered.forEach((sponsor) => {
      const result = calculateMatchScore(currentEvent, sponsor);
      scores[sponsor.id] = result.score;
    });
    setMatchScores(scores);
  }, [filters]);

  const handleConnect = (sponsorId: string) => {
    const sponsor = filteredSponsors.find((s) => s.id === sponsorId);
    if (sponsor) {
      setSelectedSponsor(sponsor);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div {...fadeInUp}>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
          Find Sponsors
        </h1>
        <p className="text-gray-600">
          Discover sponsors that match your event requirements
        </p>
      </motion.div>

      {/* Split View Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side - Filters */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FilterPanel filters={filters} onFilterChange={setFilters} />
        </motion.div>

        {/* Right Side - Sponsor Cards */}
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Results Header */}
          <div className="mb-6">
            <p className="text-gray-700">
              <span className="font-semibold">{filteredSponsors.length}</span> sponsors found
            </p>
          </div>

          {/* Sponsor Cards Grid */}
          {filteredSponsors.length === 0 ? (
            <div className="text-center py-12 bg-white/20 backdrop-blur-md rounded-3xl border border-white/20">
              <Search size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No sponsors found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters to see more results
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSponsors.map((sponsor) => (
                <motion.div
                  key={sponsor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <SponsorCard
                    sponsor={sponsor}
                    matchPercentage={matchScores[sponsor.id] || 0}
                    onConnect={() => handleConnect(sponsor.id)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Sponsor Details Modal */}
      <SponsorDetailsModal
        sponsor={selectedSponsor}
        matchScore={selectedSponsor ? matchScores[selectedSponsor.id] || 0 : 0}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eventId="event-1"
      />
    </div>
  );
}
