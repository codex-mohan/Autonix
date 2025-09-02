"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TooltipProvider } from "@workspace/ui/components/tooltip";
import { Button } from "@workspace/ui/components/button";
import { ChatInput } from "./chat-input";
import { useStream } from "@langchain/langgraph-sdk/react";
import { Checkpoint, Message } from "@langchain/langgraph-sdk";
import {
  useChatStore,
  useConversationStore,
  type Conversation,
} from "../../lib/store";
import { AiMessageBubble, HumanMessageBubble } from "./chat-message-bubble";
import { useToast } from "../../hooks/use-toast";
import { ProcessedEvent } from "./activity-timeline";

import { nanoid } from "nanoid";

interface ChatMainProps {
  selectedChat: string | null;
  isPinned: boolean;
}

type State = {
  messages: Message[];
  context?: Record<string, unknown>;
};

type ConfigurableType = {
  model: string;
};

export function ChatMain({ selectedChat, isPinned }: ChatMainProps) {
  const [threadId, setThreadId] = useState<string | undefined>(undefined);
  const {
    messages,
    setMessages,
    isLoading,
    setIsLoading,
    showInitialUI,
    setShowInitialUI,
  } = useChatStore();
  const { toast } = useToast();
  const { conversations, addConversation } = useConversationStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [spacerHeight, setSpacerHeight] = useState(0);
  const prevMessagesLength = useRef(messages.length);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [liveActivityEvents, setLiveActivityEvents] = useState<
    ProcessedEvent[]
  >([]);
  const [historicalActivities, setHistoricalActivities] = useState<
    Record<string, ProcessedEvent[]>
  >({});

  const thread = useStream<State>({
    apiUrl: "http://localhost:2024",
    assistantId: "simple",
    messagesKey: "messages",
    threadId,
    onThreadId: setThreadId,
  });

  useEffect(() => {
    if (selectedChat && selectedChat !== "new") {
      setThreadId(selectedChat);
    } else {
      setThreadId(undefined);
      setMessages([]);
      setShowInitialUI(true);
      if (thread.messages) {
        thread.messages.length = 0;
      }
    }
  }, [selectedChat, setMessages, setShowInitialUI]);

  useEffect(() => {
    if (selectedChat && selectedChat !== "new") {
      const conversation = conversations.find((c) => c.id === selectedChat);
      if (conversation) {
        // This part is tricky because the messages are fetched by the `useStream` hook.
        // We need to ensure the UI reflects the loading state and then updates.
        setMessages([]); // Clear previous messages
        setShowInitialUI(false); // Move away from the initial view
      }
    }
  }, [selectedChat, conversations, setMessages, setShowInitialUI]);

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
      setMessages(thread.messages);
    }
  }, [thread.messages, setMessages]);

  useEffect(() => {
    if (threadId && messages.length > 0) {
      const conversationExists = conversations.some(
        (conv) => conv.id === threadId
      );
      if (!conversationExists) {
        addConversation({
          id: threadId,
          title: messages[0]?.content as string,
          timestamp: new Date().toISOString(),
          messageCount: messages.length,
          lastMessage: messages[messages.length - 1]?.content as string,
          firstMessage: messages[0]?.content as string,
        });
      }
    }
  }, [threadId, messages, conversations, addConversation]);

  useEffect(() => {
    const wasMessageAdded = messages.length > prevMessagesLength.current;
    const lastMessage = messages[messages.length - 1];

    if (wasMessageAdded && lastMessage?.type === "human") {
      const scrollArea = scrollAreaRef.current;
      if (scrollArea) {
        const newSpacerHeight = scrollArea.clientHeight * 0.75;
        setSpacerHeight(newSpacerHeight);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else if (!isLoading) {
      setSpacerHeight(0);
    }

    prevMessagesLength.current = messages.length;
  }, [messages, isLoading]);

  const handleCopyMessage = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      toast({
        title: "Copied to clipboard!",
        description: "The message content has been copied.",
      });
      setTimeout(() => setCopiedMessageId(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast({
        title: "Failed to copy",
        description: "Could not copy message to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleRetryMessage = (message: Message) => {
    console.log("Retrying message:", message);
    // Implement retry logic here, e.g., resubmit the message to the thread
  };

  const handleInfoMessage = (message: Message) => {
    console.log("Message info:", message);
    // Implement info display logic here
  };

  const handleEditMessage = (message: Message) => {
    console.log("Editing message:", message);
    // Implement edit logic here
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
        <div
          className={`flex-1 flex flex-col items-center px-8 pb-4 overflow-y-auto ${showInitialUI ? "justify-center" : "justify-start"}`}
          ref={scrollAreaRef}
        >
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
                            thread.submit({
                              messages: [
                                { type: "human", content: suggestion },
                              ],
                            });
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
                <div className="w-full space-y-4 mb-4 pt-4">
                  {" "}
                  {/* Added pt-4 for some top padding */}
                  {messages.map((message, index) => {
                    const isLast = index === messages.length - 1;
                    return (
                      <div
                        key={message.id || `msg-${index}`}
                        className="space-y-3"
                      >
                        <div
                          className={`flex items-start gap-3 ${
                            message.type === "human" ? "justify-end" : ""
                          }`}
                        >
                          {message.type === "human" ? (
                            <HumanMessageBubble
                              message={message}
                              onCopy={handleCopyMessage}
                              onEdit={handleEditMessage} copiedMessageId={null}                            />
                          ) : (
                            <AiMessageBubble
                              message={message}
                              historicalActivity={
                                historicalActivities[message.id!]
                              }
                              liveActivity={liveActivityEvents} // Pass global live events
                              isLastMessage={isLast}
                              isOverallLoading={isLoading} // Pass global loading state
                              onCopy={handleCopyMessage}
                              copiedMessageId={copiedMessageId}
                              onRetry={handleRetryMessage}
                              onInfo={handleInfoMessage}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                  <div
                    style={{ height: `${spacerHeight}px`, transition: "height 0.3s ease" }}
                  />
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
