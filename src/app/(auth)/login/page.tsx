'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { AnimatedBackground } from '@/components/shared/AnimatedBackground';
import { createClient } from '@/utils/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const supabase = createClient();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (email: string, pass: string) => {
    setIsLoading(true);
    setErrors({});

    try {
      // Check if using demo credentials
      const isDemo =
        (email === 'test.organizer@test.com' && pass === 'iamorganizer') ||
        (email === 'test.sponser@test.com' && pass === 'iamsponser');

      if (isDemo) {
        // Set demo cookie
        const role = email.includes('organizer') ? 'organizer' : 'sponsor';
        document.cookie = `demo_role=${role}; path=/; max-age=86400`; // 1 day
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        // If it's a demo user and Supabase fails (e.g. missing env vars), allow access anyway
        if (isDemo) {
          const role = email.includes('organizer') ? 'organizer' : 'sponsor';
          const dashboardPath = role === 'organizer'
            ? '/organizer/dashboard'
            : '/sponsor/dashboard';
          router.push(dashboardPath);
          router.refresh();
          return;
        }
        setErrors({ form: error.message });
        return;
      }

      if (data.user) {
        // Check role from metadata
        const role = data.user.user_metadata.role;
        const dashboardPath = role === 'organizer'
          ? '/organizer/dashboard'
          : '/sponsor/dashboard';

        router.push(dashboardPath);
        router.refresh(); // Refresh to update middleware state
      }
    } catch (error) {
      // Fallback for demo users on unexpected errors
      const isDemo =
        (email === 'test.organizer@test.com' && pass === 'iamorganizer') ||
        (email === 'test.sponser@test.com' && pass === 'iamsponser');

      if (isDemo) {
        const role = email.includes('organizer') ? 'organizer' : 'sponsor';
        const dashboardPath = role === 'organizer'
          ? '/organizer/dashboard'
          : '/sponsor/dashboard';
        router.push(dashboardPath);
        router.refresh();
        return;
      }
      setErrors({ form: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    await handleLogin(formData.email, formData.password);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 overflow-auto">
      <AnimatedBackground />
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">

        <div className="w-full max-w-md bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8 relative z-20">
          <div className="text-center mb-8">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center bg-white">
                <Image
                  src="/logo.png"
                  alt="Match My Sponsor"
                  width={80}
                  height={80}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.form && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {errors.form}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                className={errors.email ? 'border-red-300' : ''}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className={errors.password ? 'border-red-300' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Demo Credentials Section */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/80 text-gray-500">Or try demo accounts</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleLogin('test.organizer@test.com', 'iamorganizer')}
                className="px-4 py-2.5 bg-white/60 backdrop-blur-sm border-2 border-indigo-200 text-indigo-700 rounded-xl font-medium hover:bg-indigo-50 hover:border-indigo-300 transition-all text-sm"
              >
                🎪 Organizer Demo
              </button>
              <button
                type="button"
                onClick={() => handleLogin('test.sponser@test.com', 'iamsponser')}
                className="px-4 py-2.5 bg-white/60 backdrop-blur-sm border-2 border-purple-200 text-purple-700 rounded-xl font-medium hover:bg-purple-50 hover:border-purple-300 transition-all text-sm"
              >
                💼 Sponsor Demo
              </button>
            </div>

            <div className="text-center text-sm">
              <span className="text-gray-600">Don&apos;t have an account? </span>
              <Link href="/signup" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
