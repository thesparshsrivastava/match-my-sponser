import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  blur?: 'sm' | 'md' | 'lg';
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const blurVariants = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
};

const paddingVariants = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function GlassCard({
  children,
  className = '',
  blur = 'md',
  padding = 'md',
  hover = false,
}: GlassCardProps) {
  const baseClasses = clsx(
    'bg-white/30',
    blurVariants[blur],
    'border border-white/20',
    'rounded-3xl',
    'shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]',
    paddingVariants[padding],
    className
  );

  if (hover) {
    return (
      <motion.div
        className={baseClasses}
        whileHover={{ scale: 1.02, boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.25)' }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={baseClasses}>{children}</div>;
}
