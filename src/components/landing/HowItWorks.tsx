'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Zap, Handshake, ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';

const steps = [
  {
    number: 1,
    icon: FileText,
    title: 'Create Event',
    description: 'Sign up and create your event profile with all the details that matter to sponsors.',
  },
  {
    number: 2,
    icon: Zap,
    title: 'Get Matched',
    description: 'Our AI algorithm finds the perfect sponsors based on your event and their preferences.',
  },
  {
    number: 3,
    icon: Handshake,
    title: 'Connect & Collaborate',
    description: 'Chat with sponsors, finalize deals, and manage deliverables seamlessly.',
  },
];

export function HowItWorks() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: { duration: 0.5 },
  };

  return (
    <section className="py-20 px-4 relative">
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
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Three simple steps to find your perfect sponsor match
          </p>
        </motion.div>

        {/* Steps with horizontal layout */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={index}>
                <motion.div
                  className="flex-1 w-full max-w-sm"
                  variants={fadeIn}
                  initial="initial"
                  whileInView="whileInView"
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ delay: index * 0.2 }}
                >
                  <GlassCard padding="lg" className="h-full">
                    <div className="flex flex-col items-center text-center">
                      {/* Step number badge */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center mb-4">
                        <span className="text-2xl font-bold text-white">
                          {step.number}
                        </span>
                      </div>

                      {/* Icon */}
                      <div className="w-16 h-16 rounded-2xl bg-white/50 flex items-center justify-center mb-4">
                        <Icon className="w-8 h-8 text-[#667eea]" />
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-semibold mb-3 text-gray-800">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </GlassCard>
                </motion.div>

                {/* Arrow indicator between steps (hidden on mobile) */}
                {index < steps.length - 1 && (
                  <motion.div
                    className="hidden lg:block"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.3, duration: 0.5 }}
                  >
                    <ArrowRight className="w-8 h-8 text-[#667eea]" />
                  </motion.div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
