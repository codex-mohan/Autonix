import { create } from 'zustand';
import type { Message } from "@langchain/langgraph-sdk";

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  showInitialUI: boolean;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  setIsLoading: (loading: boolean) => void;
  setShowInitialUI: (show: boolean) => void;
  updateLastAssistantMessage: (content: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  showInitialUI: true,
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setShowInitialUI: (show) => set({ showInitialUI: show }),
  updateLastAssistantMessage: (content) => set((state) => {
    const lastMessage = state.messages[state.messages.length - 1];
    if (lastMessage && lastMessage.type === "ai") {
      const updatedMessages = [...state.messages];
      updatedMessages[updatedMessages.length - 1] = {
        ...lastMessage,
        content: content,
      };
      return { messages: updatedMessages };
    }
    return state;
  }),
}));
