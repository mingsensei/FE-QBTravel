import React from 'react';
import { MessageCircle, X } from 'lucide-react';
import { ChatBubbleButtonProps } from '@/types/chatbot';

/**
 * Floating chat bubble button component
 * Toggles the chatbot window open/closed
 */
export const ChatBubbleButton: React.FC<ChatBubbleButtonProps> = ({
  onClick,
  isOpen,
  unreadCount = 0,
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        fixed bottom-6 right-6 z-50
        w-16 h-16 rounded-full
        bg-primary hover:bg-primary/90
        text-primary-foreground
        shadow-primary hover:shadow-glow
        transition-all duration-300
        flex items-center justify-center
        transform hover:scale-110
        ${isOpen ? 'rotate-180' : 'rotate-0'}
      `}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
    >
      {isOpen ? (
        <X className="w-6 h-6" />
      ) : (
        <div className="relative">
          <MessageCircle className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
      )}
    </button>
  );
};