'use client';

import { LogOut } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

export function TopBar() {
  const { logout, user } = useAuth();

  return (
    <div className="fixed top-4 right-4 z-30">
      <button
        onClick={logout}
        className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl shadow-lg hover:shadow-xl hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
      >
        <LogOut size={16} />
        <span className="text-sm font-medium">Logout</span>
      </button>
    </div>
  );
}