'use client';

import { useEffect } from 'react';
import { clearAllAuthData } from '@/lib/auth';

export function useAuthCleanup() {
  useEffect(() => {
    // Clean up auth data on page load if it's corrupted
    const cleanupCorruptedAuth = () => {
      try {
        const userStr = localStorage.getItem('current_user');
        if (userStr) {
          const user = JSON.parse(userStr);
          // Check if user data is corrupted or incomplete
          if (!user.id || !user.email || !user.role || 
              (user.role !== 'organizer' && user.role !== 'sponsor')) {
            clearAllAuthData();
          }
        }
      } catch (error) {
        // If parsing fails, clear all auth data
        clearAllAuthData();
      }
    };

    cleanupCorruptedAuth();

    // Set up periodic session validation
    const interval = setInterval(() => {
      try {
        const userStr = localStorage.getItem('current_user');
        if (userStr) {
          const user = JSON.parse(userStr);
          const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
          
          if (user.timestamp && (Date.now() - user.timestamp > SESSION_TIMEOUT)) {
            clearAllAuthData();
            window.location.href = '/login';
          }
        }
      } catch (error) {
        clearAllAuthData();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, []);
}