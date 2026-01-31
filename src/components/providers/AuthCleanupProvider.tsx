'use client';

import { useAuthCleanup } from '@/hooks/useAuthCleanup';

interface AuthCleanupProviderProps {
  children: React.ReactNode;
}

export function AuthCleanupProvider({ children }: AuthCleanupProviderProps) {
  useAuthCleanup();
  return <>{children}</>;
}