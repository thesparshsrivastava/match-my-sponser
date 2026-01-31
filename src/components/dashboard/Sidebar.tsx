'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
// Using CSS transitions instead of framer-motion for better performance
import {
  LayoutDashboard,
  PlusCircle,
  Search,
  MessageSquare,
  CheckSquare,
  Compass,
  LogOut,
  Menu,
  X,
  Settings,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

interface SidebarProps {
  role: 'organizer' | 'sponsor';
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const organizerNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/organizer/dashboard', icon: LayoutDashboard },
  { label: 'Create Event', href: '/organizer/create-event', icon: PlusCircle },
  { label: 'Find Sponsors', href: '/organizer/matches', icon: Search },
  { label: 'Chat', href: '/organizer/chat', icon: MessageSquare },
  { label: 'Deliverables', href: '/organizer/deliverables', icon: CheckSquare },
  { label: 'Settings', href: '/organizer/settings', icon: Settings },
];

const sponsorNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/sponsor/dashboard', icon: LayoutDashboard },
  { label: 'Discover Events', href: '/sponsor/discover', icon: Compass },
  { label: 'Chat', href: '/sponsor/chat', icon: MessageSquare },
  { label: 'Deliverables', href: '/sponsor/deliverables', icon: CheckSquare },
  { label: 'Settings', href: '/sponsor/settings', icon: Settings },
];

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const navItems = role === 'organizer' ? organizerNavItems : sponsorNavItems;
  const supabase = createClient();

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const handleLogout = async () => {
    // Clear demo cookie
    document.cookie = 'demo_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white/90 backdrop-blur-xl rounded-xl border border-gray-300 shadow-lg text-gray-800"
      >
        {isMobileMenuOpen ? <X size={24} className="text-gray-800" /> : <Menu size={24} className="text-gray-800" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed left-0 top-0 h-screen w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200 shadow-2xl flex flex-col z-40 transition-transform duration-300',
          'lg:fixed lg:z-auto lg:translate-x-0',
          isDesktop ? 'translate-x-0' : (isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full')
        )}
      >
        {/* Logo */}
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <Link href={`/${role}/dashboard`} className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow flex items-center justify-center bg-white">
              <Image
                src="/logo.png"
                alt="Match My Sponsor Logo"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                Match My Sponsor
              </h1>
              <p className="text-xs text-gray-500 capitalize">{role}</p>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-2 lg:p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                <div
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
                    {
                      'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg':
                        isActive,
                      'text-gray-700 hover:bg-gray-100': !isActive,
                    }
                  )}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-2 lg:p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
