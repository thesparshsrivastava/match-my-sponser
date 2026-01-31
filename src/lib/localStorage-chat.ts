// localStorage-based chat system for demo purposes
interface LocalMatch {
  id: string;
  eventId: string;
  sponsorId: string;
  organizerId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

interface LocalMessage {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

const MATCHES_KEY = 'matchmysponsor_matches';
const MESSAGES_KEY = 'matchmysponsor_messages';

export function createLocalMatch(eventId: string, sponsorId: string, organizerId: string): LocalMatch {
  const matches = getLocalMatches();
  
  // Check if match already exists
  const existingMatch = matches.find(m => m.eventId === eventId && m.sponsorId === sponsorId);
  if (existingMatch) {
    throw new Error('Match already exists');
  }

  const newMatch: LocalMatch = {
    id: `match_${Date.now()}`,
    eventId,
    sponsorId,
    organizerId,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  matches.push(newMatch);
  localStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
  
  return newMatch;
}

export function getLocalMatches(): LocalMatch[] {
  const stored = localStorage.getItem(MATCHES_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function getUserMatches(userId: string, userRole: 'organizer' | 'sponsor'): LocalMatch[] {
  const matches = getLocalMatches();
  return matches.filter(match => {
    if (userRole === 'organizer') {
      return match.organizerId === userId;
    } else {
      return match.sponsorId === userId;
    }
  });
}

export function sendLocalMessage(matchId: string, senderId: string, content: string): LocalMessage {
  const messages = getLocalMessages();
  
  const newMessage: LocalMessage = {
    id: `msg_${Date.now()}`,
    matchId,
    senderId,
    content,
    createdAt: new Date().toISOString(),
  };

  messages.push(newMessage);
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  
  return newMessage;
}

export function getLocalMessages(): LocalMessage[] {
  const stored = localStorage.getItem(MESSAGES_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function getMatchMessages(matchId: string): LocalMessage[] {
  const messages = getLocalMessages();
  return messages.filter(msg => msg.matchId === matchId);
}