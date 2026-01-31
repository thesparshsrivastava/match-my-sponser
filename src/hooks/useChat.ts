import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { getMatchMessages, sendLocalMessage } from '@/lib/localStorage-chat';

interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export function useChat(matchId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const fetchMessages = useCallback(async () => {
    if (!matchId) return;
    setLoading(true);

    // Use localStorage fallback if configured
    if (process.env.NEXT_PUBLIC_USE_LOCALSTORAGE === 'true') {
      const localMessages = getMatchMessages(matchId);
      const formattedMessages: Message[] = localMessages.map(msg => ({
        id: msg.id,
        match_id: msg.matchId,
        sender_id: msg.senderId,
        content: msg.content,
        created_at: msg.createdAt
      }));
      setMessages(formattedMessages);
      setLoading(false);
      return;
    }

    const { data } = await supabase.from('messages').select('*').eq('match_id', matchId).order('created_at');
    if (data) setMessages(data);
    setLoading(false);
  }, [matchId, supabase]);

  useEffect(() => {
    if (!matchId) return;

    fetchMessages();

    if (process.env.NEXT_PUBLIC_USE_LOCALSTORAGE !== 'true') {
      const channel = supabase
        .channel(`match:${matchId}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${matchId}` },
          (payload: any) => setMessages(prev => [...prev, payload.new as Message]))
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [matchId, fetchMessages, supabase]);

  const sendMessage = async (content: string) => {
    if (!matchId) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Use localStorage fallback if configured
    if (process.env.NEXT_PUBLIC_USE_LOCALSTORAGE === 'true') {
      const newMessage = sendLocalMessage(matchId, user.id, content);
      const formattedMessage: Message = {
        id: newMessage.id,
        match_id: newMessage.matchId,
        sender_id: newMessage.senderId,
        content: newMessage.content,
        created_at: newMessage.createdAt
      };
      setMessages(prev => [...prev, formattedMessage]);
      return;
    }

    await supabase.from('messages').insert({ match_id: matchId, sender_id: user.id, content });
  };

  return { messages, loading, sendMessage };
}
