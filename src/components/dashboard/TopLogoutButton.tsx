'use client';

import { LogOut } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export function TopLogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-xl border border-gray-300 rounded-xl shadow-lg hover:shadow-xl hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200 text-gray-800"
    >
      <LogOut size={16} className="text-gray-800" />
      <span className="text-sm font-medium text-gray-800">Logout</span>
    </button>
  );
}