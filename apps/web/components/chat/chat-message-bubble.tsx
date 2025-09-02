import type React from "react";
import type { Message } from "@langchain/langgraph-sdk";
import { Button } from "@workspace/ui/components/button";
import { FaRedo, FaInfoCircle, FaUser, FaRobot, FaPen } from "react-icons/fa";
import { Copy, CopyCheck } from "lucide-react";
import { motion } from "framer-motion";
import MarkdownView from "./markdown-view";
import { ActivityTimeline, ProcessedEvent } from "./activity-timeline";

const bubbleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Props for HumanMessageBubble
interface HumanMessageBubbleProps {
  message: Message;
  onCopy: (text: string, messageId: string) => void;
  copiedMessageId: string | null; // Add this prop to track copied state
  onEdit?: (message: Message) => void;
}

// HumanMessageBubble Component (FIXED)
export const HumanMessageBubble: React.FC<HumanMessageBubbleProps> = ({
  message,
  onCopy,
  copiedMessageId, // Destructure the new prop
  onEdit,
}) => {
  return (
    <motion.div
      className="flex items-start gap-3 justify-end"
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      layout="position"
    >
      <div className="flex flex-col items-end w-full">
        {" "}
        {/* Changed to column and items-end */}
        <div className="relative p-3 rounded-lg max-w-[100%] bg-primary text-primary-foreground break-words">
          {typeof message.content === "string"
            ? message.content
            : JSON.stringify(message.content)}
        </div>
        <div className="flex justify-end space-x-1 mt-2">
          {" "}
          {/* Controls are now below */}
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 text-muted-foreground hover:text-foreground"
              onClick={() => onEdit(message)}
            >
              <FaPen className="w-3 h-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 text-muted-foreground hover:text-foreground"
            onClick={() =>
              onCopy(
                typeof message.content === "string"
                  ? message.content
                  : JSON.stringify(message.content),
                message.id!
              )
            }
          >
            {copiedMessageId === message.id ? (
              <CopyCheck className="w-3 h-3" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </Button>
        </div>
      </div>
      <div className="flex-shrink-0">
        <FaUser className="w-6 h-6 text-primary" />
      </div>
    </motion.div>
  );
};

// Props for AiMessageBubble
interface AiMessageBubbleProps {
  message: Message;
  historicalActivity: ProcessedEvent[] | undefined;
  liveActivity: ProcessedEvent[] | undefined;
  isLastMessage: boolean;
  isOverallLoading: boolean;
  onCopy: (text: string, messageId: string) => void;
  copiedMessageId: string | null;
  onRetry?: (message: Message) => void;
  onInfo?: (message: Message) => void;
}

// AiMessageBubble Component (Unchanged)
export const AiMessageBubble: React.FC<AiMessageBubbleProps> = ({
  message,
  historicalActivity,
  liveActivity,
  isLastMessage,
  isOverallLoading,
  onCopy,
  copiedMessageId,
  onRetry,
  onInfo,
}) => {
  const activityForThisBubble =
    isLastMessage && isOverallLoading ? liveActivity : historicalActivity;
  const isLiveActivityForThisBubble = isLastMessage && isOverallLoading;

  const shouldShowTimeline = (events: ProcessedEvent[] | undefined) => {
    if (!events) return false;
    const timelineEvents = ["deep_research", "another_special_tool"];
    return events.some((event) => timelineEvents.includes(event.name));
  };

  return (
    <motion.div
      className="flex items-start gap-3"
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      layout="position"
    >
      <div className="flex-shrink-0">
        <FaRobot className="w-6 h-6 text-muted-foreground" />
      </div>
      <div className="flex flex-col w-full">
        <div className="relative p-3 rounded-lg max-w-[100%] bg-muted text-foreground w-full break-words overflow-x-auto">
          {shouldShowTimeline(activityForThisBubble) && (
            <div className="mb-3 border-b border-border pb-3 text-xs">
              <ActivityTimeline
                processedEvents={activityForThisBubble!}
                isLoading={isLiveActivityForThisBubble}
              />
            </div>
          )}
          <MarkdownView
            text={
              typeof message.content === "string"
                ? message.content
                : JSON.stringify(message.content)
            }
          />
        </div>
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
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 text-muted-foreground hover:text-foreground"
            onClick={() =>
              onCopy(
                typeof message.content === "string"
                  ? message.content
                  : JSON.stringify(message.content),
                message.id!
              )
            }
          >
            {copiedMessageId === message.id ? (
              <CopyCheck className="w-3 h-3" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </Button>
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
      </div>
    </motion.div>
  );
};
