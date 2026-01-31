'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Sparkles, MessageSquare } from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';

const features = [
  {
    icon: Calendar,
    title: 'Create Your Event',
    description:
      'Set up your event profile with all the details sponsors need. Showcase your audience, reach, and unique value proposition.',
  },
  {
    icon: Sparkles,
    title: 'Get Sponsor Matches',
    description:
      'Our AI-powered matching algorithm connects you with sponsors that align with your event category, audience, and budget.',
  },
  {
    icon: MessageSquare,
    title: 'Manage Communication',
    description:
      'Chat with potential sponsors, negotiate terms, and track deliverables—all in one seamless platform.',
  },
];

export function Features() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: { duration: 0.5 },
  };

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.2,
      },
    },
    viewport: { once: true, margin: '-100px' },
  };

  return (
    <section id="features" className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Everything You Need
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to make sponsorship management effortless
          </p>
        </motion.div>

        {/* Feature cards grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: '-100px' }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={index} variants={fadeInUp}>
                <GlassCard hover padding="lg" className="h-full">
                  <div className="flex flex-col items-center text-center">
                    {/* Icon with gradient background */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center mb-6">
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
