"use client";

import type { Message } from "@langchain/langgraph-sdk";
import { motion } from "framer-motion";
import { Button } from "@workspace/ui/components/button";
import { FaRedo, FaCopy, FaInfoCircle, FaUser, FaRobot } from "react-icons/fa";
import MarkdownView from "./markdown-view";

interface ChatMessageBubbleProps {
  message: Message;
  onRetry?: (message: Message) => void;
  onCopy?: (content: string) => void;
  onInfo?: (message: Message) => void;
}

export function ChatMessageBubble({
  message,
  onRetry,
  onCopy,
  onInfo,
}: ChatMessageBubbleProps) {
  const isUser = message.type === "human";

  const bubbleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleCopy = () => {
    if (onCopy && message.content) {
      onCopy(message.content as string);
    }
  };

  return (
    <motion.div
      className={`flex items-start gap-3 text-wrap ${isUser ? "justify-end" : "justify-start"}`}
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      layout="position" // Changed layout to "position" for smoother animation
    >
      {!isUser && (
        <div className="flex-shrink-0">
          <FaRobot className="w-6 h-6 text-muted-foreground" />
        </div>
      )}
      <div
        className={`relative p-3 rounded-lg max-w-[100%] ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground w-full"
        }`}
      >
        {isUser ? (
          (message.content as string)
        ) : (
          <MarkdownView text={message.content as string} />
        )}

        {/* Controls for assistant messages */}
        {!isUser && (
          <div className="flex justify-start space-x-1 mt-2">
            {onRetry && (
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 text-muted-foreground hover:text-foreground"
                onClick={() => onRetry(message)}
              >
                <FaRedo className="w-3 h-3" />
              </Button>
            )}
            {onCopy && (
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 text-muted-foreground hover:text-foreground"
                onClick={handleCopy}
              >
                <FaCopy className="w-3 h-3" />
              </Button>
            )}
            {onInfo && (
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 text-muted-foreground hover:text-foreground"
                onClick={() => onInfo(message)}
              >
                <FaInfoCircle className="w-3 h-3" />
              </Button>
            )}
          </div>
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0">
          <FaUser className="w-6 h-6 text-primary" />
        </div>
      )}
    </motion.div>
  );
}
