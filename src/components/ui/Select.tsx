import React from 'react';
import { clsx } from 'clsx';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{ value: string; label: string }>;
}

export function Select({
  label,
  error,
  helperText,
  options,
  className = '',
  id,
  ...props
}: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-800 mb-2"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
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
          'focus:outline-none',
          'focus:ring-2',
          'appearance-none',
          'cursor-pointer',
          {
            'border-white/30 focus:border-[#667eea]/50 focus:ring-[#667eea]/20 focus:bg-white/30':
              !error,
            'border-red-400 focus:border-red-500 focus:ring-red-500/20 bg-red-50/20':
              error,
          },
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600 font-medium">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-600">{helperText}</p>
      )}
    </div>
  );
}
