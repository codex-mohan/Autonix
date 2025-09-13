import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Message } from "@langchain/langgraph-sdk";
import { AIMessage } from "@langchain/core/messages";

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  showInitialUI: boolean;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  setIsLoading: (loading: boolean) => void;
  setShowInitialUI: (show: boolean) => void;
  deleteChatHistory: (chatId: string) => void;
}

export const useChatStore = create(
  persist<ChatState>(
    (set) => ({
      messages: [],
      isLoading: false,
      showInitialUI: true,
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      setMessages: (messages) => set({ messages }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      setShowInitialUI: (show) => set({ showInitialUI: show }),
      deleteChatHistory: (chatId) => {
        localStorage.removeItem(`chat-history-${chatId}`);
      },
    }),
    {
      name: "chat-history",
    }
  )
);

export interface Conversation {
  id: string;
  title: string;
  firstMessage: string;
  lastMessage: string;
  timestamp: string;
  messageCount: number;
}

interface ConversationState {
  conversations: Conversation[];
  addConversation: (conversation: Conversation) => void;
  updateConversationTitle: (id: string, title: string) => void;
  deleteConversation: (id: string) => void;
}

export const useConversationStore = create(
  persist<ConversationState>(
    (set) => ({
      conversations: [],
      addConversation: (conversation) =>
        set((state) => ({
          conversations: [...state.conversations, conversation],
        })),
      updateConversationTitle: (id, title) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === id ? { ...conv, title } : conv
          ),
        })),
      deleteConversation: (id) => {
        // Also delete the chat history from localStorage
        useChatStore.getState().deleteChatHistory(id);
        set((state) => ({
          conversations: state.conversations.filter((conv) => conv.id !== id),
        }));
      },
    }),
    {
      name: "conversation-storage", // name of the item in the storage (must be unique)
    }
  )
);

const fn = () => {
  let m = new AIMessage("hello");
};
