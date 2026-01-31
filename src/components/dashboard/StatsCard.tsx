import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { clsx } from 'clsx';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

export function StatsCard({ title, value, icon: Icon, trend }: StatsCardProps) {
  return (
    <div className="glass-card p-4 sm:p-5 lg:p-6 hover:scale-[1.02] transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-gray-500 font-medium mb-1 sm:mb-2 truncate uppercase tracking-wider">{title}</p>
          <p className="text-xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">{value}</p>

          {trend && (
            <div
              className={clsx(
                'flex items-center gap-1 mt-2 sm:mt-3 text-xs sm:text-sm font-medium px-2 py-1 rounded-full w-fit',
                {
                  'bg-green-100/50 text-green-700': trend.direction === 'up',
                  'bg-red-100/50 text-red-700': trend.direction === 'down',
                }
              )}
            >
              {trend.direction === 'up' ? (
                <TrendingUp size={14} className="sm:w-4 sm:h-4" />
              ) : (
                <TrendingDown size={14} className="sm:w-4 sm:h-4" />
              )}
              <span>
                {trend.direction === 'up' ? '+' : '-'}
                {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>

        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
}
