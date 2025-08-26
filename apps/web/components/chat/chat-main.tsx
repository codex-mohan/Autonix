"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TooltipProvider } from "@workspace/ui/components/tooltip";
import { Button } from "@workspace/ui/components/button";
import { ChatInput } from "./chat-input";
import { useStream } from "@langchain/langgraph-sdk/react";
import type { Message } from "@langchain/langgraph-sdk";
import { useChatStore } from "../../lib/store";
import { ChatMessageBubble } from "./chat-message-bubble"; // Import ChatMessageBubble

interface ChatMainProps {
  selectedChat: string | null;
  isPinned: boolean;
}

export function ChatMain({ selectedChat, isPinned }: ChatMainProps) {
  const {
    messages,
    setMessages,
    setIsLoading,
    showInitialUI,
    setShowInitialUI,
    updateLastAssistantMessage,
  } = useChatStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const thread = useStream<{ messages: Message[] }>({
    apiUrl: "http://localhost:2024",
    assistantId: "agent",
    messagesKey: "messages",
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    setIsLoading(thread.isLoading);
    if (thread.isLoading) {
      setShowInitialUI(false);
    }
  }, [thread.isLoading, setIsLoading, setShowInitialUI]);

  useEffect(() => {
    if (thread.messages && thread.messages.length > 0) {
      const newMessages = thread.messages;
      const lastNewMessage = newMessages[newMessages.length - 1];

      if (lastNewMessage && lastNewMessage.type === "ai") {
        updateLastAssistantMessage(lastNewMessage.content as string);
      } else {
        setMessages(newMessages);
      }
    }
  }, [thread.messages, setMessages, updateLastAssistantMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    // Optionally, add a toast notification here
    console.log("Copied to clipboard:", content);
  };

  const handleRetryMessage = (message: Message) => {
    console.log("Retrying message:", message);
    // Implement retry logic here, e.g., resubmit the message to the thread
  };

  const handleInfoMessage = (message: Message) => {
    console.log("Message info:", message);
    // Implement info display logic here
  };

  return (
    <TooltipProvider>
      <motion.div
        className="flex-1 flex flex-col bg-background transition-all duration-300"
        variants={containerVariants as any}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        {/* Main Content Area */}
        <div className={`flex-1 flex flex-col items-center px-8 pb-4 overflow-y-auto ${showInitialUI ? "justify-center" : "justify-start"}`}>
          <div className="w-full max-w-4xl flex flex-col items-center">
            <AnimatePresence>
              {showInitialUI ? (
                <>
                  <motion.div
                    className="text-center mb-12"
                    variants={titleVariants as any}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <motion.h1
                      className="text-5xl font-black text-foreground mb-2"
                      whileHover={{
                        scale: 1.02,
                        textShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
                        transition: { duration: 0.2 },
                      }}
                    >
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary uppercase font-black">
                        Autonix
                      </span>
                    </motion.h1>
                  </motion.div>

                  {/* Chat Input for initial state */}
                  <div className="w-full max-w-4xl px-8">
                    <ChatInput thread={thread} />
                  </div>

                  <motion.div
                    className="flex justify-center mt-6 space-x-4 flex-wrap gap-2"
                    variants={containerVariants as any}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {[
                      "What's trending today?",
                      "Help me write an email",
                      "Plan my weekend",
                      "Explain quantum computing",
                    ].map((suggestion, index) => (
                      <motion.div
                        key={index}
                        variants={suggestionVariants as any}
                        custom={index}
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            thread.submit({ messages: [{ type: "human", content: suggestion }] });
                            setShowInitialUI(false);
                          }}
                          className="text-xs px-4 py-2 rounded-full border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                        >
                          {suggestion}
                        </Button>
                      </motion.div>
                    ))}
                  </motion.div>
                </>
              ) : (
                /* Chat Messages for active chat state */
                <div className="w-full space-y-4 mb-4 pt-4"> {/* Added pt-4 for some top padding */}
                  {messages.map((message, index) => (
                    <ChatMessageBubble
                      key={message.id || index}
                      message={message}
                      onCopy={handleCopyMessage}
                      onRetry={handleRetryMessage}
                      onInfo={handleInfoMessage}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Chat Input for active chat state (always at bottom) */}
        {!showInitialUI && (
          <div className="w-full max-w-4xl px-8 mx-auto">
            <ChatInput thread={thread} />
          </div>
        )}

        {/* Footer */}
        <motion.div
          className="p-4 text-center"
          variants={footerVariants as any}
        >
          <p className="text-xs text-muted-foreground">
            Autonix can make mistakes. Consider checking important information.
          </p>
        </motion.div>
      </motion.div>
    </TooltipProvider>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      staggerChildren: 0.15,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const titleVariants = {
  hidden: {
    y: -30,
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const suggestionVariants = {
  hidden: {
    y: 15,
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const footerVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.6,
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};
