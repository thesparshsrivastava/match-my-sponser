'use client';

import { useEffect } from 'react';

export function CacheBuster() {
  useEffect(() => {
    // Clear all cached data on component mount
    const clearCache = () => {
      // Clear localStorage
      localStorage.clear();

      // Clear sessionStorage
      sessionStorage.clear();

      // Force reload stylesheets
      const links = document.querySelectorAll('link[rel="stylesheet"]');
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
          const newLink = document.createElement('link');
          newLink.rel = 'stylesheet';
          newLink.href = href + '?v=' + Date.now();
          document.head.appendChild(newLink);
          link.remove();
        }
      });
    };

    // Check if we need to clear cache (version mismatch)
    const currentVersion = '1.0.2'; // Update this when you make changes
    const storedVersion = localStorage.getItem('app_version');

    if (storedVersion !== currentVersion) {
      clearCache();
      localStorage.setItem('app_version', currentVersion);
      // Force page reload to ensure fresh start
      window.location.reload();
    }
  }, []);

  return null;
}