import { create } from "zustand";
import type { Message } from "@langchain/langgraph-sdk";

type ChatStore = {
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
  addMessage: (message: Message) => void;
  updateLastMessage: (chunk: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isLoading: false,
  error: null,
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  updateLastMessage: (chunk) =>
    set((state) => {
      const lastMessage = state.messages[state.messages.length - 1];
      if (lastMessage && lastMessage._getType() === "ai") {
        const updatedContent =
          typeof lastMessage.content === "string"
            ? lastMessage.content + chunk
            : chunk;
        const newMessages = [...state.messages];
        newMessages[newMessages.length - 1] = {
          ...lastMessage,
          content: updatedContent,
        };
        return { messages: newMessages };
      }
      return state;
    }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
