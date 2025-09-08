"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TooltipProvider } from "@workspace/ui/components/tooltip";
import { Button } from "@workspace/ui/components/button";
import { ChatInput } from "./chat-input";
import { useStream } from "@langchain/langgraph-sdk/react";
import { AIMessage, Checkpoint, Message } from "@langchain/langgraph-sdk";
import {
  useChatStore,
  useConversationStore,
  type Conversation,
} from "../../lib/store";
import {
  AiMessageBubble,
  HumanMessageBubble,
  ToolOutputMessageBubble,
} from "./chat-message-bubble";
import { useToast } from "../../hooks/use-toast";
import { ProcessedEvent } from "./activity-timeline";

interface ChatMainProps {
  selectedChat?: string;
  isPinned: boolean;
  activeConversationId?: string;
}

type State = {
  messages: Message[];
  context?: Record<string, unknown>;
};

type ConfigurableType = {
  model: string;
};

export function ChatMain({
  selectedChat,
  isPinned,
  activeConversationId,
}: ChatMainProps) {
  const router = useRouter();
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
    if (selectedChat) {
      setThreadId(selectedChat);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (threadId && !selectedChat && messages.length > 0 && !showInitialUI) {
      // Only redirect to the new chat URL when there are actual messages
      // and the initial UI is hidden (indicating conversation has started)
      // This ensures we stay on /chat until the user sends their first message
      router.push(`/chat/${threadId}`);
    }
  }, [threadId, selectedChat, messages.length, showInitialUI, router]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    setIsLoading(thread.isLoading);
    // Only hide initial UI when we have actual messages (not just when loading starts)
    // This prevents premature hiding of the initial UI
    if (thread.isLoading && messages.length > 0) {
      setShowInitialUI(false);
    }
  }, [thread.isLoading, setIsLoading, setShowInitialUI, messages.length]);

  useEffect(() => {
    if (
      thread.messages &&
      JSON.stringify(thread.messages) !== JSON.stringify(messages)
    ) {
      setMessages(thread.messages);

      // Hide initial UI when we receive any messages
      if (showInitialUI && thread.messages.length > 0) {
        setShowInitialUI(false);
      }
    }
  }, [thread.messages, messages, setMessages, showInitialUI, setShowInitialUI]);

  useEffect(() => {
    if (threadId && messages.length > 0 && !showInitialUI) {
      const conversationExists = conversations.some(
        (conv) => conv.id === threadId
      );
      if (!conversationExists) {
        // Only create conversation if there's at least one human message
        // and the initial UI is hidden (indicating conversation has started)
        const hasHumanMessage = messages.some((msg) => msg.type === "human");

        if (hasHumanMessage) {
          const firstMessage = messages[0];
          const lastMessage = messages[messages.length - 1];

          // Extract meaningful content for title and messages
          const getMessageContent = (message: Message): string => {
            if (!message) return "New conversation";
            if (typeof message.content === "string") {
              return message.content.trim() || "New conversation";
            }
            if (Array.isArray(message.content)) {
              const textContent = message.content.find(
                (c: any) => typeof c === "string"
              );
              return textContent?.toString().trim() || "New conversation";
            }
            return "New conversation";
          };

          const title = getMessageContent(firstMessage as Message);
          const firstMessageContent = getMessageContent(
            firstMessage as Message
          );
          const lastMessageContent = getMessageContent(lastMessage as Message);

          addConversation({
            id: threadId,
            title: title.length > 50 ? title.substring(0, 47) + "..." : title,
            timestamp: new Date().toISOString(),
            messageCount: messages.length,
            lastMessage: lastMessageContent,
            firstMessage: firstMessageContent,
          });
        }
      }
    }
  }, [threadId, messages, conversations, addConversation, showInitialUI]);

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

  const handleRegenerateMessage = (
    parentCheckpoint: Checkpoint | null | undefined
  ) => {
    if (parentCheckpoint) {
      thread.submit(undefined, { checkpoint: parentCheckpoint });
    }
  };

  const handleInfoMessage = (message: Message) => {
    console.log("Message info:", message);
    // Implement info display logic here
  };

  const handleEditMessage = (message: Message) => {
    console.log("Editing message:", message);
    // Implement edit logic here
  };

  const handleDeleteMessage = () => {
    console.log("Delete clicked");
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
                <div className="w-full h-full space-y-4 mb-4 pt-4">
                  {" "}
                  {/* Added pt-4 for some top padding */}
                  {messages.map((message, index) => {
                    const isLast = index === messages.length - 1;
                    const meta = thread.getMessagesMetadata(message);
                    const parentCheckpoint =
                      meta?.firstSeenState?.parent_checkpoint;
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
                              copiedMessageId={null}
                              onEdit={(message) =>
                                thread.submit(
                                  { messages: [message] },
                                  { checkpoint: parentCheckpoint }
                                )
                              }
                              onDelete={handleDeleteMessage}
                              onRetry={() =>
                                handleRegenerateMessage(parentCheckpoint)
                              }
                              branch={meta?.branch}
                              branchOptions={meta?.branchOptions}
                              onSelectBranch={(branch) =>
                                thread.setBranch(branch)
                              }
                            />
                          ) : message.type === "tool" ? (
                            <ToolOutputMessageBubble
                              message={message}
                              onCopy={handleCopyMessage}
                              copiedMessageId={message.tool_call_id}
                            />
                          ) : (
                            <AiMessageBubble
                              message={message as AIMessage}
                              historicalActivity={
                                historicalActivities[message.id!]
                              }
                              liveActivity={liveActivityEvents} // Pass global live events
                              isLastMessage={isLast}
                              isOverallLoading={isLoading} // Pass global loading state
                              onCopy={handleCopyMessage}
                              copiedMessageId={copiedMessageId}
                              onRetry={() =>
                                handleRegenerateMessage(parentCheckpoint)
                              }
                              onInfo={handleInfoMessage}
                              branch={meta?.branch}
                              branchOptions={meta?.branchOptions}
                              onSelectBranch={(branch) =>
                                thread.setBranch(branch)
                              }
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                  <div
                    style={{
                      height: `${spacerHeight}px`,
                      transition: "height 0.3s ease",
                    }}
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
