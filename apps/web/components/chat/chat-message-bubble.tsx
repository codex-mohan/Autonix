import type React from "react";
import { useState } from "react";
import type { Message, AIMessage } from "@langchain/langgraph-sdk";
import { Button } from "@workspace/ui/components/button";
import {
  FaRedo,
  FaInfoCircle,
  FaUser,
  FaRobot,
  FaPen,
  FaTrash,
} from "react-icons/fa";
import { Copy, CopyCheck, ChevronsUpDown } from "lucide-react";
import { motion } from "framer-motion";
import MarkdownView from "./markdown-view";
import ToolCall from "./tool-call";

import { ActivityTimeline, ProcessedEvent } from "./activity-timeline";

const bubbleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// ToolCall Component (as provided for context)
interface ToolCallProps {
  toolName: string;
  toolArgs: Record<string, any>;
  toolOutput: string;
}

function BranchSwitcher({
  branch,
  branchOptions,
  onSelect,
}: {
  branch: string | undefined;
  branchOptions: string[] | undefined;
  onSelect: (branch: string) => void;
}) {
  if (!branchOptions || !branch) return null;
  const index = branchOptions.indexOf(branch);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => {
          const prevBranch = branchOptions[index - 1];
          if (!prevBranch) return;
          onSelect(prevBranch);
        }}
      >
        Prev
      </button>
      <span>
        {index + 1} / {branchOptions.length}
      </span>
      <button
        type="button"
        onClick={() => {
          const nextBranch = branchOptions[index + 1];
          if (!nextBranch) return;
          onSelect(nextBranch);
        }}
      >
        Next
      </button>
    </div>
  );
}

function EditMessage({
  message,
  onEdit,
}: {
  message: Message;
  onEdit: (message: Message) => void;
}) {
  const [editing, setEditing] = useState(false);

  if (!editing) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="w-6 h-6 text-muted-foreground hover:text-foreground"
        onClick={() => setEditing(true)}
      >
        <FaPen className="w-3 h-3" />
      </Button>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const content = new FormData(form).get("content") as string;

        form.reset();
        onEdit({ type: "human", content });
        setEditing(false);
      }}
    >
      <input
        name="content"
        defaultValue={message.content as string}
        className="bg-transparent"
      />
      <button type="submit">Save</button>
    </form>
  );
}

// Props for HumanMessageBubble
interface HumanMessageBubbleProps {
  message: Message;
  onCopy: (text: string, messageId: string) => void;
  copiedMessageId: string | null;
  onEdit?: (message: Message) => void;
  onDelete?: () => void;
  onRetry?: () => void;
  branch?: string;
  branchOptions?: string[];
  onSelectBranch?: (branch: string) => void;
}

// HumanMessageBubble Component
export const HumanMessageBubble: React.FC<HumanMessageBubbleProps> = ({
  message,
  onCopy,
  copiedMessageId,
  onEdit,
  onDelete,
  onRetry,
  branch,
  branchOptions,
  onSelectBranch,
}) => {
  const [editing, setEditing] = useState(false);
  return (
    <motion.div
      className="flex items-start gap-3 justify-end"
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      layout="position"
    >
      <div className="flex flex-col items-end w-full">
        <div className="relative p-3 rounded-lg max-w-[100%] bg-primary text-primary-foreground break-words">
          {editing && onEdit ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const content = new FormData(form).get("content") as string;

                form.reset();
                onEdit({ type: "human", content });
                setEditing(false);
              }}
            >
              <input
                name="content"
                defaultValue={message.content as string}
                className="bg-transparent"
              />
              <button type="submit">Save</button>
            </form>
          ) : typeof message.content === "string" ? (
            message.content
          ) : (
            JSON.stringify(message.content)
          )}
        </div>
        <div className="flex justify-end space-x-1 mt-2">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 text-muted-foreground hover:text-foreground"
              onClick={() => setEditing(!editing)}
            >
              <FaPen className="w-3 h-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 text-muted-foreground hover:text-foreground"
            onClick={onDelete}
          >
            <FaTrash className="w-3 h-3" />
          </Button>
          {onRetry && (
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 text-muted-foreground hover:text-foreground"
              onClick={onRetry}
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
          {onSelectBranch && (
            <BranchSwitcher
              branch={branch}
              branchOptions={branchOptions}
              onSelect={onSelectBranch}
            />
          )}
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
  onDelete?: () => void;
  branch?: string;
  branchOptions?: string[];
  onSelectBranch?: (branch: string) => void;
}

// AiMessageBubble Component
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
  onDelete,
  branch,
  branchOptions,
  onSelectBranch,
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
      className="flex gap-3 w-full"
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      layout="position"
    >
      <div className="flex-shrink-0">
        <FaRobot className="w-6 h-6 text-muted-foreground" />
      </div>
      <div className="flex flex-col w-full">
        <div className="relative p-3 rounded-lg bg-muted text-foreground w-full break-words overflow-x-auto">
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
          {(message as AIMessage).tool_calls?.map((toolCall: any) => (
            <ToolCall
              key={toolCall.id}
              toolName={toolCall.name}
              toolArgs={toolCall.args}
              toolOutput={toolCall.output ? toolCall.output : ""}
            />
          ))}
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
          {onSelectBranch && (
            <BranchSwitcher
              branch={branch}
              branchOptions={branchOptions}
              onSelect={onSelectBranch}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Props for ToolOutputMessageBubble
interface ToolOutputMessageBubbleProps {
  message: Message;
  onCopy: (text: string, messageId: string) => void;
  copiedMessageId: string | null;
}

// ToolOutputMessageBubble Component (NEW)
export const ToolOutputMessageBubble: React.FC<
  ToolOutputMessageBubbleProps
> = ({ message, onCopy, copiedMessageId }) => {
  // A 'tool' message in LangGraph often contains the output in `content`
  // and the tool's name in a `name` property.
  const toolName = (message as any).name || "Tool";
  const toolOutput =
    typeof message.content === "string"
      ? message.content
      : JSON.stringify(message.content);

  return (
    <motion.div
      className="flex gap-3 w-full"
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      layout="position"
    >
      <div className="flex-shrink-0">
        <FaRobot className="w-6 h-6 text-muted-foreground" />
      </div>
      <div className="flex flex-col w-full">
        <div className="relative p-3 rounded-lg bg-muted text-foreground w-full break-words overflow-x-auto">
          <ToolCall
            toolName={toolName}
            toolArgs={{}} // Arguments are not present on the 'tool' message type itself
            toolOutput={toolOutput}
          />
        </div>
        <div className="flex justify-start space-x-1 mt-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 text-muted-foreground hover:text-foreground"
            onClick={() => onCopy(toolOutput, message.id!)}
          >
            {copiedMessageId === message.id ? (
              <CopyCheck className="w-3 h-3" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
