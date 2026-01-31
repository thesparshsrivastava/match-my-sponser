'use client';

interface Conversation {
  id: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / 3600000);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="w-80 glass-card p-4 overflow-y-auto">
      <h3 className="font-semibold text-lg mb-4">Messages</h3>
      <div className="space-y-2">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`w-full p-3 rounded-xl text-left transition-all ${
              selectedId === conv.id
                ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white'
                : 'bg-white/50 hover:bg-white/70'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium truncate">{conv.participantName}</span>
              {conv.unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2">
                  {conv.unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm opacity-80 truncate flex-1">{conv.lastMessage}</p>
              <span className="text-xs opacity-60 ml-2">{formatTime(conv.lastMessageTime)}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
