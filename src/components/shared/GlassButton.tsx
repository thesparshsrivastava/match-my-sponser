import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface GlassButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const sizeVariants = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export function GlassButton({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}: GlassButtonProps) {
  const baseClasses = clsx(
    'rounded-2xl',
    'font-semibold',
    'transition-all',
    'duration-300',
    'cursor-pointer',
    sizeVariants[size],
    {
      'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white shadow-[0_4px_15px_0_rgba(102,126,234,0.4)]':
        variant === 'primary',
      'bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30':
        variant === 'secondary',
      'opacity-50 cursor-not-allowed': disabled,
    },
    className
  );

  return (
    <motion.button
      type={type}
      className={baseClasses}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.button>
  );
}
