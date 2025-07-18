/**
 * TypeScript interfaces for the chatbot component
 */

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatbotState {
  isOpen: boolean;
  messages: Message[];
  isLoading: boolean;
  input: string;
}

export interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}

export interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
}

export interface ChatBubbleButtonProps {
  onClick: () => void;
  isOpen: boolean;
  unreadCount?: number;
}