"use client";

import type React from "react";
import { motion } from "framer-motion";
import { ChatInput } from "./chat-input";

import { useStream } from "@langchain/langgraph-sdk/react";
import type { Message } from "@langchain/langgraph-sdk";
import { useState } from "react";

interface ChatMainProps {
  selectedChat: string | null;
}

export function ChatMain({ selectedChat }: ChatMainProps) {
  // Conversation state
  const [threadId, setThreadId] = useState<string | null>();

  const thread = useStream<{
    messages: Message[];
  }>({
    apiUrl: "http://localhost:2024",
    assistantId: "agent",
    messagesKey: "messages",
    threadId: threadId,
    onThreadId: setThreadId,
  });

  return (
    <div className="flex-1 flex flex-col bg-background transition-all duration-300">
      {selectedChat ? (
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-2xl font-semibold text-foreground">
              {selectedChat}
            </h2>
            <p className="text-muted-foreground">
              Select a chat to start messaging.
            </p>
          </motion.div>
        </div>
      ) : (
        <ChatInput />
      )}
    </div>
  );
}
