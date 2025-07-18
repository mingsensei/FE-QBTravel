import React, { useEffect, useRef } from 'react';
import { User, Bot, Loader2 } from 'lucide-react';
import { MessageListProps } from '@/types/chatbot';

/**
 * Message list component
 * Displays chat messages with auto-scroll functionality
 */
export const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 && (
        <div className="text-center py-8">
          <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            Welcome! Ask me about famous places in Quang Binh, Vietnam.
          </p>
          <p className="text-muted-foreground text-xs mt-2">
            Try asking: "Tell me about Phong Nha Cave"
          </p>
        </div>
      )}

      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex items-start space-x-3 ${
            message.isUser ? 'flex-row-reverse space-x-reverse' : ''
          }`}
        >
          {/* Avatar */}
          <div className={`
            flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
            ${message.isUser 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-muted-foreground'
            }
          `}>
            {message.isUser ? (
              <User className="w-4 h-4" />
            ) : (
              <Bot className="w-4 h-4" />
            )}
          </div>

          {/* Message */}
          <div className={`
            max-w-[80%] rounded-lg p-3 
            ${message.isUser 
              ? 'bg-primary text-primary-foreground ml-auto' 
              : 'bg-muted text-muted-foreground'
            }
          `}>
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.text}
            </p>
            <p className={`
              text-xs mt-1 opacity-70
              ${message.isUser ? 'text-primary-foreground' : 'text-muted-foreground'}
            `}>
              {message.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </div>
      ))}

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div className="bg-muted text-muted-foreground rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Thinking...</span>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};