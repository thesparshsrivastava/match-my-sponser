'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/GlassCard';

// Placeholder company names for the logo wall
const companies = [
  'TechCorp',
  'InnovateLabs',
  'FutureVentures',
  'StartupHub',
  'BrandWorks',
  'EventPro',
];

export function LogoWall() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section heading */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-lg text-gray-600 font-medium">
            Trusted by leading brands and event organizers
          </p>
        </motion.div>

        {/* Horizontal glass bar with logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <GlassCard padding="lg">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {companies.map((company, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {/* Placeholder logo - using text with grayscale styling */}
                  <div className="px-6 py-3 rounded-xl bg-white/40 backdrop-blur-sm">
                    <span className="text-xl font-bold text-gray-600 grayscale hover:grayscale-0 transition-all duration-300">
                      {company}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
