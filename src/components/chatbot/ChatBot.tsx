import React, { useState, useCallback } from 'react';
import { ChatBubbleButton } from './ChatBubbleButton';
import { ChatWindow } from './ChatWindow';
import { GeminiService } from '@/services/geminiService';
import { Message, ChatbotState } from '@/types/chatbot';
import { useToast } from '@/hooks/use-toast';

/**
 * Main ChatBot component
 * Manages chatbot state and integrates all sub-components
 */
export const ChatBot: React.FC = () => {
  const [state, setState] = useState<ChatbotState>({
    isOpen: false,
    messages: [],
    isLoading: false,
    input: '',
  });
  const { toast } = useToast();

  // Initialize Gemini service with API key
  const initializeGemini = useCallback(() => {
    const apiKey = "AIzaSyDgHsfABcItnJu0Vgb-YQK-p7zjFwuDNk0";
    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: "Please set your Gemini API key in the environment variables.",
        variant: "destructive",
      });
      return null;
    }
    return new GeminiService(apiKey);
  }, [toast]);

  // Toggle chatbot window
  const toggleChat = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  // Handle input change
  const handleInputChange = useCallback((value: string) => {
    setState(prev => ({ ...prev, input: value }));
  }, []);

  // Send message and get AI response
  const handleSend = useCallback(async () => {
    if (!state.input.trim() || state.isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: state.input,
      isUser: true,
      timestamp: new Date(),
    };

    // Add user message and start loading
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      input: '',
      isLoading: true,
    }));

    try {
      const geminiService = initializeGemini();
      if (!geminiService) return;

      const response = await geminiService.generateResponse(state.input);
      console.log('Gemini response:', response);


      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: response,
        isUser: false,
        timestamp: new Date(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: "I'm sorry, I encountered an error. Please try again later.",
        isUser: false,
        timestamp: new Date(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isLoading: false,
      }));

      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    }
  }, [state.input, state.isLoading, initializeGemini, toast]);

  return (
    <>
      <ChatBubbleButton
        onClick={toggleChat}
        isOpen={state.isOpen}
        unreadCount={0}
      />
      
      <ChatWindow
        isOpen={state.isOpen}
        onToggle={toggleChat}
        messages={state.messages}
        isLoading={state.isLoading}
        input={state.input}
        onInputChange={handleInputChange}
        onSend={handleSend}
      />
    </>
  );
};