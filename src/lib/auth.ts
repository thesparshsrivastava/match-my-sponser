// Simple auth utilities with comprehensive session management
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'organizer' | 'sponsor';
  sessionId?: string;
  timestamp?: number;
}

// Session timeout: 24 hours
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;

// Clear all possible auth-related storage
export const clearAllAuthData = () => {
  if (typeof window !== 'undefined') {
    // Clear localStorage
    const keysToRemove = [
      'current_user',
      'demo_accounts', 
      'auth_session',
      'user_session',
      'auth_token',
      'session_data',
      'login_data'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Clear sessionStorage
    keysToRemove.forEach(key => {
      sessionStorage.removeItem(key);
    });
    
    // Clear any auth cookies by setting them to expire
    const cookiesToClear = [
      'auth_token',
      'session_id', 
      'user_data',
      'login_session'
    ];
    
    cookiesToClear.forEach(cookie => {
      document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    });
  }
};

// Generate a simple session ID
const generateSessionId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const setCurrentUser = (user: User) => {
  if (typeof window !== 'undefined') {
    // Clear any existing auth data first
    clearAllAuthData();
    
    // Set new user with session info
    const userWithSession = {
      ...user,
      sessionId: generateSessionId(),
      timestamp: Date.now()
    };
    
    localStorage.setItem('current_user', JSON.stringify(userWithSession));
  }
};

export const getCurrentUser = (): User | null => {
  if (typeof window !== 'undefined') {
    try {
      const userStr = localStorage.getItem('current_user');
      if (!userStr) return null;
      
      const user = JSON.parse(userStr);
      
      // Check if session is expired
      if (user.timestamp && (Date.now() - user.timestamp > SESSION_TIMEOUT)) {
        clearCurrentUser();
        return null;
      }
      
      // Validate user object structure
      if (!user.id || !user.email || !user.role) {
        clearCurrentUser();
        return null;
      }
      
      return user;
    } catch {
      // If parsing fails, clear corrupted data
      clearCurrentUser();
      return null;
    }
  }
  return null;
};

export const clearCurrentUser = () => {
  clearAllAuthData();
};

export const isAuthenticated = (): boolean => {
  const user = getCurrentUser();
  return user !== null && !!user.id && !!user.email && !!user.role;
};

export const getUserRole = (): 'organizer' | 'sponsor' | null => {
  const user = getCurrentUser();
  return user?.role || null;
};

// Validate and refresh session
export const validateSession = (): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  
  // If session is valid, refresh timestamp
  if (user.timestamp && (Date.now() - user.timestamp < SESSION_TIMEOUT)) {
    const refreshedUser = {
      ...user,
      timestamp: Date.now()
    };
    localStorage.setItem('current_user', JSON.stringify(refreshedUser));
    return true;
  }
  
  return false;
};