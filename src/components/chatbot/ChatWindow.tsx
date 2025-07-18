import React from 'react';
import { X, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ChatbotProps } from '@/types/chatbot';

/**
 * Main chat window component
 * Contains the chat interface with header, messages, and input
 */
export const ChatWindow: React.FC<ChatbotProps & {
  messages: any[];
  isLoading: boolean;
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
}> = ({
  isOpen,
  onToggle,
  messages,
  isLoading,
  input,
  onInputChange,
  onSend,
}) => {
  if (!isOpen) return null;

  return (
    <Card className={`
      fixed bottom-24 right-6 z-40
      w-96 h-[500px]
      bg-gradient-card shadow-primary border-border
      flex flex-col
      animate-scale-in
      transition-transform duration-300
    `}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-primary/5 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary/10 rounded-full">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Quang Binh Guide</h3>
            <p className="text-xs text-muted-foreground">
              Ask me about famous places in Quang Binh
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 p-0 hover:bg-primary/10"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>


      {/* Input */}
      <div className="p-4 border-t border-border bg-gradient-card">
        <MessageInput
          value={input}
          onChange={onInputChange}
          onSend={onSend}
          disabled={isLoading}
        />
      </div>
    </Card>
  );
};