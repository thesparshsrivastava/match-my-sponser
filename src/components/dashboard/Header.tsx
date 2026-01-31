'use client';

import { LogOut } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { NotificationsDropdown } from './NotificationsDropdown';

export function Header() {
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        // Clear demo cookie
        document.cookie = 'demo_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };

    return (
        <header className="fixed top-0 right-0 left-0 lg:left-72 z-30 px-4 py-3 sm:px-8 flex justify-end items-center gap-3 pointer-events-none">
            <div className="flex items-center gap-3 pointer-events-auto bg-white/80 backdrop-blur-xl p-1.5 rounded-2xl border border-white/20 shadow-sm">
                <NotificationsDropdown />

                <div className="w-px h-6 bg-gray-200" />

                <button
                    onClick={handleLogout}
                    className="p-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                    title="Logout"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </header>
    );
}
