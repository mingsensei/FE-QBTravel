import React, { KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageInputProps } from '@/types/chatbot';

/**
 * Message input component
 * Handles user input and message sending
 */
export const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  disabled,
}) => {
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSend();
      }
    }
  };

  return (
    <div className="flex space-x-2">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Ask about Quang Binh..."
        disabled={disabled}
        className="flex-1 border-input bg-background text-foreground placeholder:text-muted-foreground"
      />
      <Button
        onClick={onSend}
        disabled={!value.trim() || disabled}
        size="sm"
        className="px-3 bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );
};