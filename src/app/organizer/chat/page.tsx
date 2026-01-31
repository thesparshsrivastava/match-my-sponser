'use client';

import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { ConversationList } from '@/components/chat/ConversationList';
import { MessageList } from '@/components/chat/MessageList';
import { createClient } from '@/utils/supabase/client';
import { useChat } from '@/hooks/useChat';
import { useConversations } from '@/hooks/useConversations';

function ChatArea({ conversationId, conversations, onBack }: { conversationId: string | null; conversations: any[]; onBack?: () => void }) {
  const [newMessage, setNewMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const { messages, loading, sendMessage } = useChat(conversationId);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);
    };
    getUser();
  }, [supabase]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    await sendMessage(newMessage.trim());
    setNewMessage('');
  };

  if (!conversationId) {
    return (
      <div className="flex-1 glass-card flex items-center justify-center text-gray-500">
        Select a conversation to start chatting
      </div>
    );
  }

  const conversation = conversations.find(c => c.id === conversationId);

  return (
    <div className="flex-1 glass-card flex flex-col">
      <div className="p-3 sm:p-4 border-b border-white/20">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="lg:hidden p-1 hover:bg-white/20 rounded-lg">
              ←
            </button>
          )}
          <h3 className="font-semibold text-base sm:text-lg">{conversation?.participantName}</h3>
        </div>
      </div>
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">Loading...</div>
      ) : (
        <MessageList messages={messages.map(m => ({ id: m.id, senderId: m.sender_id, content: m.content, timestamp: new Date(m.created_at) }))} currentUserId={currentUserId} />
      )}
      <div className="p-3 sm:p-4 border-t border-white/20">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 glass-input text-sm sm:text-base"
          />
          <button onClick={handleSend} disabled={!newMessage.trim()} className="glass-button-primary px-3 sm:px-6 disabled:opacity-50">
            <Send size={16} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrganizerChatPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const { conversations, loading } = useConversations();

  if (conversations.length > 0 && !selectedConversation) {
    setSelectedConversation(conversations[0].id);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#667eea] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] lg:h-[calc(100vh-12rem)] p-4 lg:p-0">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4 lg:mb-6">
        Messages
      </h1>

      {conversations.length === 0 ? (
        <div className="glass-card p-6 sm:p-8 lg:p-12 text-center">
          <p className="text-gray-600 text-base sm:text-lg">No conversations yet</p>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">Start matching with sponsors to begin chatting</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row h-full gap-2 lg:gap-4">
          <div className={`${selectedConversation ? 'hidden lg:block' : 'block'} lg:w-80`}>
            <ConversationList
              conversations={conversations}
              selectedId={selectedConversation}
              onSelect={setSelectedConversation}
            />
          </div>
          <div className={`${selectedConversation ? 'block' : 'hidden lg:block'} flex-1`}>
            <ChatArea
              conversationId={selectedConversation}
              conversations={conversations}
              onBack={() => setSelectedConversation(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
