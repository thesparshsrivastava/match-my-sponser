'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Handle chunk loading errors by refreshing
    if (error.message.includes('Failed to load chunk') || 
        error.message.includes('Loading chunk')) {
      window.location.reload();
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md text-center bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-6">
          {error.message.includes('chunk') 
            ? 'Loading the latest version...' 
            : 'We encountered an unexpected error.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}