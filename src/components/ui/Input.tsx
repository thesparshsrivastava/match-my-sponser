import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-800 mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={clsx(
          'w-full',
          'bg-white/20',
          'backdrop-blur-sm',
          'border',
          'rounded-xl',
          'px-4 py-3',
          'transition-all',
          'duration-300',
          'text-gray-900',
          'placeholder:text-gray-600',
          'focus:outline-none',
          'focus:ring-2',
          {
            'border-white/30 focus:border-[#667eea]/50 focus:ring-[#667eea]/20 focus:bg-white/30':
              !error,
            'border-red-400 focus:border-red-500 focus:ring-red-500/20 bg-red-50/20':
              error,
          },
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 font-medium">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-600">{helperText}</p>
      )}
    </div>
  );
}
