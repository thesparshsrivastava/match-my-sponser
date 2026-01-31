import { createClient } from '@/utils/supabase/client';
import { createLocalMatch, getUserMatches } from './localStorage-chat';

const API_BASE = '/api';
const USE_LOCALSTORAGE = process.env.NEXT_PUBLIC_USE_LOCALSTORAGE === 'true';

async function getAuthHeaders() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('User not authenticated');
  }
  return {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json',
  };
}

export async function createMatch(eventId: string, sponsorId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  if (USE_LOCALSTORAGE) {
    // Use localStorage for demo
    // Need to get role from metadata if possible, or assume based on context
    const role = user.user_metadata.role || 'sponsor';
    const organizerId = role === 'organizer' ? user.id : 'demo-organizer';
    return createLocalMatch(eventId, sponsorId, organizerId);
  }

  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/matches`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ eventId, sponsorId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create match');
  }

  return response.json();
}

export async function getMatches() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  if (USE_LOCALSTORAGE) {
    // Use localStorage for demo
    const role = user.user_metadata.role || 'sponsor';
    return getUserMatches(user.id, role as 'organizer' | 'sponsor');
  }

  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/matches`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch matches');
  }

  return response.json();
}